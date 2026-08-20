import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig.js'

const USERS_COL = 'users'

/**
 * Read a user's own profile document (`users/{uid}`).
 * Returns the whole data object — including `role` when present (admin-assigned
 * only via the Firebase Console; an absent `role` means 'member') — or null if
 * the doc doesn't exist yet.
 */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, USERS_COL, uid))
  return snap.exists() ? snap.data() : null
}

/**
 * Create (or overwrite) a user's profile document.
 * The doc ID is the uid, not an auto-generated ID — uses setDoc, not addDoc.
 */
export async function createUserProfile(uid, { name, gradeLevel }) {
  const data = {
    name,
    gradeLevel,
    createdAt: new Date().toISOString(),
  }
  await setDoc(doc(db, USERS_COL, uid), data)
  return data
}