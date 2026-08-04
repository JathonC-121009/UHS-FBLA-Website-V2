import { createContext, useState, useEffect } from 'react'
import {
  signInWithGoogle,
  signOutUser,
  onAuthStateChangedListener,
  GoogleAuthProvider,
  isSchoolAccount,
} from '../services/authService.js'

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // String error message shown by the navbar widget, or null when clear.
  const [authError, setAuthError] = useState(null)
  // accessToken is set only right after signInWithGoogle() resolves.
  // It will be null after a page refresh until a proper refresh flow exists.
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChangedListener((firebaseUser) => {
      // Re-check any signed-in session (not just a fresh click) so a stale
      // non-school session from before this feature existed gets signed out.
      if (firebaseUser && !isSchoolAccount(firebaseUser.email)) {
        setAuthError('Sign-in requires a school Google account.')
        setAccessToken(null)
        setUser(null)
        signOutUser()
      } else {
        setUser(firebaseUser)
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
      return result.user
    } catch (err) {
      const code = err?.code
      if (code === 'WRONG_DOMAIN') {
        setAuthError(err.message)
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // User closed the popup — normal behavior, nothing to surface.
      } else {
        setAuthError('Sign-in failed. Please try again.')
      }
    }
  }

  const signOut = async () => {
    setAuthError(null)
    setAccessToken(null)
    await signOutUser()
  }

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, authError, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}