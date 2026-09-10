import {
  getDocs, getDoc, addDoc, updateDoc, doc, collection,
  query, orderBy, where, increment, limit, startAfter, writeBatch,
} from 'firebase/firestore'
import { db, auth } from '../firebaseConfig.js'
import { AUTHOR_FALLBACK } from '../components/BulletinBoard/bulletinUtils.js'

const POSTS_COL = 'posts'
const REPLIES_COL = 'replies'

async function isModerator(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return false
  const role = snap.data().role
  return role === 'officer' || role === 'adviser'
}

// NOTE on removal filtering: Firestore query predicates (== / !=) only match
// documents where the field EXISTS with that value. Posts created before the
// `removed` field existed have no such field, so `where('removed', ...)` would
// silently hide all legacy active posts. getPosts/getReplies therefore fetch
// and filter in JS instead, keeping legacy documents visible (no `removed`
// field counts as not removed).

export async function getPosts() {
  const currentUid = auth.currentUser?.uid
  const moderator = currentUid ? await isModerator(currentUid) : false

  let docs
  if (moderator) {
    const q = query(collection(db, POSTS_COL), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    docs = snap.docs
  } else {
    const visibleQ = query(
      collection(db, POSTS_COL),
      where('status', '==', 'visible'),
      orderBy('createdAt', 'desc'),
    )
    const visibleSnap = await getDocs(visibleQ)
    const byId = new Map(visibleSnap.docs.map((d) => [d.id, d]))

    if (currentUid) {
      const ownPendingQ = query(
        collection(db, POSTS_COL),
        where('authorUid', '==', currentUid),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
      )
      const ownPendingSnap = await getDocs(ownPendingQ)
      ownPendingSnap.docs.forEach((d) => byId.set(d.id, d))
    }

    docs = [...byId.values()].sort((a, b) =>
      (b.data().createdAt || '').localeCompare(a.data().createdAt || ''),
    )
  }

  return docs
    .filter((d) => !d.data().removed)
    .map((d) => ({ id: d.id, ...d.data() }))
}

export async function addPost(post) {
  if (post.type === 'photo') {
    throw new Error('Photo posts are not currently allowed')
  }

  const createdAt = new Date().toISOString()
  const authorUid = auth.currentUser?.uid

  const moderator = await isModerator(authorUid)

  const data = {
    type: post.type,
    // Defensive fallback: the UI layer attaches the real author, but Firestore
    // rejects `undefined` outright, so never let a missing author reach addDoc.
    author: post.author || AUTHOR_FALLBACK,
    authorUid,
    imageUrl: post.imageUrl || null,
    caption: post.caption || null,
    message: post.message || null,
    status: moderator ? 'visible' : 'pending',
    replyCount: 0,
    createdAt,
  }
  const ref = await addDoc(collection(db, POSTS_COL), data)
  return { id: ref.id, ...data }
}

export async function getReplies(postId) {
  const currentUid = auth.currentUser?.uid
  const moderator = currentUid ? await isModerator(currentUid) : false

  let docs
  if (moderator) {
    const q = query(
      collection(db, REPLIES_COL),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc'),
    )
    const snap = await getDocs(q)
    docs = snap.docs
  } else {
    const visibleQ = query(
      collection(db, REPLIES_COL),
      where('postId', '==', postId),
      where('status', '==', 'visible'),
      orderBy('createdAt', 'asc'),
    )
    const visibleSnap = await getDocs(visibleQ)
    const byId = new Map(visibleSnap.docs.map((d) => [d.id, d]))

    if (currentUid) {
      const ownPendingQ = query(
        collection(db, REPLIES_COL),
        where('postId', '==', postId),
        where('authorUid', '==', currentUid),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'asc'),
      )
      const ownPendingSnap = await getDocs(ownPendingQ)
      ownPendingSnap.docs.forEach((d) => byId.set(d.id, d))
    }

    docs = [...byId.values()].sort((a, b) =>
      (a.data().createdAt || '').localeCompare(b.data().createdAt || ''),
    )
  }

  return docs
    .filter((d) => !d.data().removed)
    .map((d) => ({ id: d.id, ...d.data() }))
}

export async function addReply(postId, reply) {
  const createdAt = new Date().toISOString()
  const authorUid = auth.currentUser?.uid

  const moderator = await isModerator(authorUid)

  const data = {
    postId,
    author: reply.author,
    authorUid,
    message: reply.message,
    status: moderator ? 'visible' : 'pending',
    createdAt,
  }
  const ref = await addDoc(collection(db, REPLIES_COL), data)
  await updateDoc(doc(db, POSTS_COL, postId), {
    replyCount: increment(1),
  })
  return { id: ref.id, ...data }
}

/** Soft-remove a post: sets removed=true and removedAt, never a hard delete. */
export async function removePost(postId) {
  await updateDoc(doc(db, POSTS_COL, postId), {
    removed: true,
    removedAt: new Date().toISOString(),
  })
}

/**
 * Soft-remove a reply. Replies live in a flat collection keyed by their own
 * auto-ID with a `postId` field pointing at the parent (see addReply), so only
 * replyId addresses the document; postId is kept for caller context.
 */
export async function removeReply(postId, replyId) {
  await updateDoc(doc(db, REPLIES_COL, replyId), {
    removed: true,
    removedAt: new Date().toISOString(),
  })
}

/**
 * Soft-remove every currently-active post in ONE batched write (single
 * timestamp for the whole batch). NOTE: writeBatch commits cap at 500
 * operations. A chapter board with 500+ active posts is not anticipated;
 * chunking into batches of ~400 would be needed if it ever is.
 */
export async function clearBoard() {
  const q = query(collection(db, POSTS_COL))
  const snap = await getDocs(q)
  const removedAt = new Date().toISOString()
  const batch = writeBatch(db)
  let writes = 0
  snap.docs.forEach((d) => {
    if (!d.data().removed) {
      batch.update(doc(db, POSTS_COL, d.id), { removed: true, removedAt })
      writes++
    }
  })
  if (writes > 0) {
    await batch.commit()
  }
}

/**
 * Paginated view of removed posts, newest-removed first.
 *
 * Firestore pagination is CURSOR-based (startAfter plus limit), so "jump to
 * arbitrary page N" is not natively supported. Callers should cache the
 * returned cursors as they page forward (see useArchivedPosts) so instant
 * Previous navigation works.
 *
 * `lastVisibleCursor` is the raw DocumentSnapshot of the last post on the
 * page, exactly what startAfter() needs for the next page. (It is not
 * JSON-serializable; persisting page state across a page reload would need a
 * serializable cursor instead.)
 *
 * NOTE: the where('removed' == true) + orderBy('removedAt' desc) combination
 * requires a composite index in the Firebase console; the SDK surfaces the
 * one-click index URL in a live error until it is created.
 */
export async function getArchivedPosts({ pageSize = 30, cursor = null } = {}) {
  const currentUid = auth.currentUser?.uid
  const moderator = currentUid ? await isModerator(currentUid) : false

  let allDocs
  if (moderator) {
    const base = query(
      collection(db, POSTS_COL),
      where('removed', '==', true),
      orderBy('removedAt', 'desc'),
      limit(pageSize + 1),
    )
    const q = cursor ? query(base, startAfter(cursor)) : base
    const snap = await getDocs(q)
    allDocs = snap.docs
  } else {
    // Fetch visible and own-pending archived posts, merge in memory.
    // NOTE: cursor-based pagination doesn't work across two merged queries
    // (Firestore cursors are bound to a specific query). Using in-memory
    // pagination instead, which is acceptable for a small chapter board.
    const fetchLimit = cursor ? pageSize + 1 : pageSize * 3

    const visibleQ = query(
      collection(db, POSTS_COL),
      where('removed', '==', true),
      where('status', '==', 'visible'),
      orderBy('removedAt', 'desc'),
      limit(fetchLimit),
    )
    const visibleSnap = await getDocs(visibleQ)
    const byId = new Map(visibleSnap.docs.map((d) => [d.id, d]))

    if (currentUid) {
      const ownPendingQ = query(
        collection(db, POSTS_COL),
        where('removed', '==', true),
        where('authorUid', '==', currentUid),
        where('status', '==', 'pending'),
        orderBy('removedAt', 'desc'),
        limit(fetchLimit),
      )
      const ownPendingSnap = await getDocs(ownPendingQ)
      ownPendingSnap.docs.forEach((d) => byId.set(d.id, d))
    }

    const merged = [...byId.values()].sort((a, b) =>
      (b.data().removedAt || '').localeCompare(a.data().removedAt || ''),
    )

    if (cursor) {
      const idx = merged.findIndex((d) => d.id === cursor.id)
      allDocs = idx === -1 ? [] : merged.slice(idx + 1, idx + 1 + pageSize + 1)
    } else {
      allDocs = merged.slice(0, pageSize + 1)
    }
  }

  const docs = allDocs
  const hasMore = docs.length > pageSize
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs
  return {
    posts: pageDocs.map((d) => ({ id: d.id, ...d.data() })),
    lastVisibleCursor: pageDocs.length ? pageDocs[pageDocs.length - 1] : null,
    hasMore,
  }
}

export async function getPendingPosts() {
  const q = query(
    collection(db, POSTS_COL),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs
    .filter((d) => !d.data().removed)
    .map((d) => ({ id: d.id, ...d.data() }))
}

export async function getPendingReplies() {
  const q = query(
    collection(db, REPLIES_COL),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs
    .filter((d) => !d.data().removed)
    .map((d) => ({ id: d.id, ...d.data() }))
}

export async function approvePost(postId) {
  await updateDoc(doc(db, POSTS_COL, postId), { status: 'visible' })
}

export async function approveReply(postId, replyId) {
  await updateDoc(doc(db, REPLIES_COL, replyId), { status: 'visible' })
}
