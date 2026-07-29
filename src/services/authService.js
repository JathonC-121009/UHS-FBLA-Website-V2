import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider as FirebaseGoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebaseConfig.js'

export { FirebaseGoogleAuthProvider as GoogleAuthProvider }

const googleProvider = new FirebaseGoogleAuthProvider()
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly')

/**
 * Sign in with Google popup. Returns the Firebase user object.
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
