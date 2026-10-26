import { createContext, useState, useEffect } from 'react'
import {
  signInWithGoogle,
  signOutUser,
  onAuthStateChangedListener,
  GoogleAuthProvider,
} from '../services/authService.js'
import { getUserProfile, createUserProfile } from '../services/usersService.js'

export const AuthContext = createContext(null)

/**
 * Map a Firebase error to a friendly message. Returns null for errors that
 * are normal user behavior (closing the Google popup). Those stay silent.
 */
function getFriendlyAuthError(err) {
  const code = err?.code
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    // The user closed the popup: normal behavior, nothing to surface.
    return null
  }
  return 'Sign-in failed. Please try again.'
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // String error message shown by the auth modal, or null when clear.
  const [authError, setAuthError] = useState(null)
  // accessToken is set only right after signInWithGoogle() resolves.
  // It will be null after a page refresh until a proper refresh flow exists.
  const [accessToken, setAccessToken] = useState(null)
  // The signed-in user's profile doc (users/{uid}); null until fetched.
  const [profile, setProfile] = useState(null)

  // Sign-in modal visibility. It lives here, not in AuthWidget, so that any
  // page (the bulletin board, for one) can open the same Google sign-in modal.
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const openAuthModal = () => setAuthModalOpen(true)
  const closeAuthModal = () => setAuthModalOpen(false)

  // Role is admin-assigned only (site owner in the Firebase Console; firestore
  // rules exclude it from self-writes). Absent role = 'member'.
  const role = profile?.role ?? 'member'
  const isOfficerOrAdviser = role === 'officer' || role === 'adviser'

  /**
   * Google-only profile bootstrap.
   *
   * Called after every successful Google sign-in AND on every auth-state
   * change (page reload included). Idempotent: if a profile doc already
   * exists it is NEVER rewritten, so an admin-assigned `role` and the
   * original `createdAt` survive repeat calls across sessions.
   */
  const ensureUserProfile = async (fbUser) => {
    if (!fbUser) return
    try {
      const existing = await getUserProfile(fbUser.uid)
      if (!existing) {
        await createUserProfile(fbUser.uid, {
          displayName: fbUser.displayName,
          email: fbUser.email,
        })
      }
      // Always refresh the in-memory profile: a role may have been assigned
      // in the console since the last read, and the doc is now guaranteed
      // to exist for signed-in users.
      const fresh = await getUserProfile(fbUser.uid)
      setProfile(fresh)
    } catch {
      // Rules may not be deployed yet, and a failure must never block sign-in.
      setProfile(null)
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChangedListener(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await ensureUserProfile(firebaseUser)
      } else {
        setProfile(null)
        setAccessToken(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const signIn = async () => {
    try {
      const result = await signInWithGoogle()

      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken)
      }
      setAuthError(null)
      await ensureUserProfile(result.user)
      return result.user
    } catch (err) {
      const msg = getFriendlyAuthError(err)
      if (msg) setAuthError(msg)
    }
  }

  const signOut = async () => {
    setAuthError(null)
    setAccessToken(null)
    setProfile(null)
    await signOutUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        authError,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        role,
        isOfficerOrAdviser,
        profile,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}