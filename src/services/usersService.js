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
 * Create a user's profile document on first sign-in (Google-only auth:
 * displayName and email both come straight from the Google account — nothing
 * is user-editable). The doc ID is the uid, not an auto-generated ID.
 *
 * Callers must only invoke this when no profile doc exists yet — an existing
 * doc (e.g. an admin-assigned `role`) must never be overwritten by this write;
 * see ensureUserProfile in AuthProvider.jsx for the existence check.
 */
export async function createUserProfile(uid, { displayName, email }) {
  const data = {
    displayName,
    email,
    createdAt: new Date().toISOString(),
  }
  await setDoc(doc(db, USERS_COL, uid), data)
  return data
}