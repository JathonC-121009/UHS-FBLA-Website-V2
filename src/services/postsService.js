import {
  getDocs, addDoc, updateDoc, doc, collection,
  query, orderBy, where, increment,
} from 'firebase/firestore'
import { db, auth } from '../firebaseConfig.js'

const POSTS_COL = 'posts'
const REPLIES_COL = 'replies'

export async function getPosts() {
  const q = query(collection(db, POSTS_COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
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
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
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