import { createContext, useState, useEffect } from 'react'
import {
  signInWithGoogle,
  signOutUser,
  onAuthStateChangedListener,
  GoogleAuthProvider,
} from '../services/authService.js'

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // accessToken is set only right after signInWithGoogle() resolves.
  // It will be null after a page refresh until a proper refresh flow exists.
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChangedListener((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  const signIn = async () => {
    const result = await signInWithGoogle()
    const credential = GoogleAuthProvider.credentialFromResult(result)
    if (credential?.accessToken) {
      setAccessToken(credential.accessToken)
    }
    return result.user
  }

  const signOut = async () => {
    setAccessToken(null)
    await signOutUser()
  }

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}