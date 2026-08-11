import {
  getDocs, addDoc, updateDoc, doc, collection,
  query, orderBy, where, increment, limit, startAfter, writeBatch,
} from 'firebase/firestore'
import { db, auth } from '../firebaseConfig.js'

const POSTS_COL = 'posts'
const REPLIES_COL = 'replies'

// NOTE on removal filtering: Firestore query predicates (== / !=) only match
// documents where the field EXISTS with that value. Posts created before the
// `removed` field existed have no such field, so `where('removed', ...)` would
// silently hide all legacy active posts. getPosts/getReplies therefore fetch
// and filter in JS instead, keeping legacy documents visible (no `removed`
// field counts as not removed).

export async function getPosts() {
  const q = query(collection(db, POSTS_COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs
    .filter((d) => !d.data().removed)
    .map((d) => ({ id: d.id, ...d.data() }))
}

export async function addPost(post) {
  const createdAt = new Date().toISOString()
  const data = {
    type: post.type,
    author: post.author,
    authorUid: auth.currentUser?.uid,
    imageUrl: post.imageUrl || null,
    caption: post.caption || null,
    message: post.message || null,
    replyCount: 0,
    createdAt,
  }
  const ref = await addDoc(collection(db, POSTS_COL), data)
  return { id: ref.id, ...data }
}

export async function getReplies(postId) {
  const q = query(
    collection(db, REPLIES_COL),
    where('postId', '==', postId),
    orderBy('createdAt', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs
    .filter((d) => !d.data().removed)
    .map((d) => ({ id: d.id, ...d.data() }))
}

export async function addReply(postId, reply) {
  const createdAt = new Date().toISOString()
  const data = {
    postId,
    author: reply.author,
    authorUid: auth.currentUser?.uid,
    message: reply.message,
    createdAt,
  }
  const ref = await addDoc(collection(db, REPLIES_COL), data)
  await updateDoc(doc(db, POSTS_COL, postId), {
    replyCount: increment(1),
  })
  return { id: ref.id, ...data }
}

/** Soft-remove a post: sets removed=true + removedAt — never a hard delete. */
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
 * operations — a chapter board with 500+ active posts is not anticipated;
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
 * Firestore pagination is CURSOR-based (startAfter + limit) — "jump to
 * arbitrary page N" is not natively supported. Callers should cache the
 * returned cursors as they page forward (see useArchivedPosts) so instant
 * Previous navigation works.
 *
 * `lastVisibleCursor` is the raw DocumentSnapshot of the last post on the
 * page — exactly what startAfter() needs for the next page. (It is not
 * JSON-serializable; persisting page state across a page reload would need a
 * serializable cursor instead.)
 *
 * NOTE: the where('removed' == true) + orderBy('removedAt' desc) combination
 * requires a composite index in the Firebase console; the SDK surfaces the
 * one-click index URL in a live error until it is created.
 */
export async function getArchivedPosts({ pageSize = 30, cursor = null } = {}) {
  const base = query(
    collection(db, POSTS_COL),
    where('removed', '==', true),
    orderBy('removedAt', 'desc'),
    limit(pageSize + 1),
  )
  const q = cursor ? query(base, startAfter(cursor)) : base
  const snap = await getDocs(q)
  const docs = snap.docs
  const hasMore = docs.length > pageSize
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs
  return {
    posts: pageDocs.map((d) => ({ id: d.id, ...d.data() })),
    lastVisibleCursor: pageDocs.length ? pageDocs[pageDocs.length - 1] : null,
    hasMore,
  }
}