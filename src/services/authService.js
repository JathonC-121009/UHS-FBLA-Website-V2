import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider as FirebaseGoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebaseConfig.js'

export { FirebaseGoogleAuthProvider as GoogleAuthProvider }

const googleProvider = new FirebaseGoogleAuthProvider()
// Base sign-in must only request default non-sensitive scopes (openid/email/profile).
// Attaching a sensitive scope like calendar.readonly to the provider used for every
// sign-in triggers Google's unverified-app warning and a 100-test-user cap for ALL
// users, not just those using Calendar. Calendar access will be requested later as a
// separate incremental authorization scoped specifically to the Calendar feature,
// not on the base provider.

/**
 * Mirrors the domain check in firestore.rules — keep these in sync.
 * Used for the read-only isSchoolAccount flag exposed via auth context,
 * and to gate Google sign-in in AuthProvider (school domains only).
 */
export function isSchoolAccount(email) {
  if (!email) return false
  return email.endsWith('@fcps.org') || email.endsWith('@my.fcps.org')
}

/**
 * Sign in with Google popup. Any Google account is accepted at the Firebase
 * level — school-domain enforcement now happens IN AuthProvider.signIn
 * (immediate sign-out + error on rejected domains) and in the Firestore
 * rules layer for writes. Returns the Firebase UserCredential.
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
