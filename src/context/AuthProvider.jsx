import { createContext, useState, useEffect } from 'react'
import {
  signInWithGoogle,
  signOutUser,
  onAuthStateChangedListener,
  GoogleAuthProvider,
  isSchoolAccount as isSchoolDomain,
  signUpWithEmail as authSignUpWithEmail,
  signInWithEmail as authSignInWithEmail,
  updateDisplayName,
} from '../services/authService.js'
import { getUserProfile, createUserProfile } from '../services/usersService.js'

export const AuthContext = createContext(null)

/**
 * Map a Firebase error to a friendly message. Returns null for errors that
 * are normal user behavior (closing the Google popup) — those stay silent.
 */
function getFriendlyAuthError(err) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
    'auth/weak-password': 'Password is too weak — use at least 6 characters.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-not-found': 'No account found with this email. Create one instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
  }
  const code = err?.code
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    // User closed the popup — normal behavior, nothing to surface.
    return null
  }
  return map[code] || 'Sign-in failed. Please try again.'
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // String error message shown by the navbar widget, or null when clear.
  const [authError, setAuthError] = useState(null)
  // True while the signed-in user has not completed profile setup yet.
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false)
  // accessToken is set only right after signInWithGoogle() resolves.
  // It will be null after a page refresh until a proper refresh flow exists.
  const [accessToken, setAccessToken] = useState(null)
  // The signed-in user's profile doc (users/{uid}); null until fetched.
  const [profile, setProfile] = useState(null)

  // Sign-in modal visibility. Lives here (not in AuthWidget) so any page —
  // e.g. the Bulletin Board — can open the same Step 1 → Step 2 flow.
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const openAuthModal = () => setAuthModalOpen(true)
  const closeAuthModal = () => setAuthModalOpen(false)

  // Read-only flag for future UI use (e.g. disabling Bulletin Board actions).
  // It does not gate sign-in itself.
  const isSchoolAccount = !!user && isSchoolDomain(user.email)

  // Role is admin-assigned only (site owner in the Firebase Console; firestore
  // rules exclude it from self-writes). Absent role = 'member'.
  const role = profile?.role ?? 'member'
  const isOfficerOrAdviser = role === 'officer' || role === 'adviser'

  const checkProfileSetup = async (fbUser) => {
    if (!fbUser) return
    try {
      const profile = await getUserProfile(fbUser.uid)
      setProfile(profile)
      setNeedsProfileSetup(!profile)
    } catch {
      // Rules may not be deployed yet — never block sign-in on a read failure.
      setNeedsProfileSetup(false)
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChangedListener(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        // Catches reloads too: a signed-in user who hasn't finished setup yet
        // (or a leftover session from before this feature) is still routed to Step 2.
        await checkProfileSetup(firebaseUser)
      } else {
        setProfile(null)
        setNeedsProfileSetup(false)
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
      await checkProfileSetup(result.user)
      return result.user
    } catch (err) {
      const msg = getFriendlyAuthError(err)
      if (msg) setAuthError(msg)
    }
  }

  const signUpWithEmail = async (email, password) => {
    try {
      const result = await authSignUpWithEmail(email, password)
      setAuthError(null)
      await checkProfileSetup(result.user)
      return result.user
    } catch (err) {
      const msg = getFriendlyAuthError(err)
      if (msg) setAuthError(msg)
    }
  }

  const signInWithEmail = async (email, password) => {
    try {
      const result = await authSignInWithEmail(email, password)
      setAuthError(null)
      // Expected for returning users: a profile doc already exists, so this
      // just confirms it and leaves needsProfileSetup false.
      await checkProfileSetup(result.user)
      return result.user
    } catch (err) {
      const msg = getFriendlyAuthError(err)
      if (msg) setAuthError(msg)
    }
  }

  const completeProfileSetup = async (name, gradeLevel) => {
    if (!user) return
    try {
      const created = await createUserProfile(user.uid, { name, gradeLevel })
      await updateDisplayName(name)
      // Reflect the new display name immediately (avatar initials, etc.).
      setUser((prev) => (prev ? { ...prev, displayName: name } : prev))
      setProfile(created)
      setNeedsProfileSetup(false)
      setAuthError(null)
    } catch (err) {
      const msg = getFriendlyAuthError(err)
      if (msg) setAuthError(msg)
    }
  }

  const signOut = async () => {
    setAuthError(null)
    setAccessToken(null)
    setProfile(null)
    setNeedsProfileSetup(false)
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
        isSchoolAccount,
        role,
        isOfficerOrAdviser,
        needsProfileSetup,
        signIn,
        signUpWithEmail,
        signInWithEmail,
        completeProfileSetup,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}