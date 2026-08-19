import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider as FirebaseGoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebaseConfig.js'

export { FirebaseGoogleAuthProvider as GoogleAuthProvider }

const googleProvider = new FirebaseGoogleAuthProvider()
// Calendar events are fetched via a public, API-key-restricted endpoint
// (see calendarService.js) — this app never requests calendar OAuth
// scopes from users, so no scope is added here.

/**
 * Mirrors the domain check in firestore.rules — keep these in sync.
 * Used for the read-only isSchoolAccount flag exposed via auth context;
 * it no longer gates who can sign in.
 */
export function isSchoolAccount(email) {
  if (!email) return false
  return email.endsWith('@fcps.org') || email.endsWith('@my.fcps.org')
}

/**
 * Sign in with Google popup. Any Google account is accepted — school-domain
 * gating now lives in the Firestore rules layer and a UI-facing flag, not
 * here. Returns the Firebase UserCredential.
 *
 * The Google OAuth access token is only available right after this resolves
 * via GoogleAuthProvider.credentialFromResult(result).accessToken.
 * It is NOT persisted across page reloads by Firebase Auth on its own —
 * a proper token refresh strategy (silent re-auth or server-side exchange)
 * is a future task.
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  return result
}

/**
 * Create a new email/password account. Firebase's built-in errors
 * (auth/email-already-in-use, auth/weak-password, ...) propagate to the
 * caller, which maps them to friendly messages.
 */
export async function signUpWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * Sign in an existing email/password account. Firebase's built-in errors
 * (auth/wrong-password, auth/user-not-found, ...) propagate to the caller.
 */
export async function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Set the current user's display name. Keeps existing code that reads
 * user.displayName (avatar initials, post author) working without changes.
 */
export async function updateDisplayName(name) {
  if (!auth.currentUser) throw new Error('Not signed in — cannot update display name')
  await updateProfile(auth.currentUser, { displayName: name })
}

export async function signOutUser() {
  await firebaseSignOut(auth)
}

export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(auth, callback)
}

export function getDisplayName(user) {
  if (!user) return null
  return user.displayName || user.email?.split('@')[0] || 'Unknown'
}
