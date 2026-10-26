import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider as FirebaseGoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebaseConfig.js'

export { FirebaseGoogleAuthProvider as GoogleAuthProvider }

const googleProvider = new FirebaseGoogleAuthProvider()
// Calendar events are fetched via a public, API-key-restricted endpoint
// (see calendarService.js), so this app never requests calendar OAuth
// scopes from users, so no scope is added here.

/**
 * Sign in with the Google popup. Any Google account is accepted, and Firebase Auth
 * handles authentication, and Firestore rules enforce authorization.
 * Returns the Firebase UserCredential.
 *
 * The Google OAuth access token is only available right after this resolves
 * via GoogleAuthProvider.credentialFromResult(result).accessToken.
 * Firebase Auth does not persist it across page reloads on its own,
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
