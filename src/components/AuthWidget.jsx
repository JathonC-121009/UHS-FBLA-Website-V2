import { useState, useEffect, useRef } from 'react'
import useAuth from '../hooks/useAuth.js'
import './AuthWidget.css'

function getInitials(user) {
  if (user?.displayName) {
    const parts = user.displayName.trim().split(/\s+/)
    const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
    if (initials) return initials
  }
  if (user?.email) return user.email[0].toUpperCase()
  return '?'
}

export default function AuthWidget() {
  const { user, loading, authError, signIn, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const [busy, setBusy] = useState(false)
  const rootRef = useRef(null)

  // Dismiss the error banner automatically a few seconds after it appears.
  useEffect(() => {
    if (!authError) {
      setShowError(false)
      return
    }
    setShowError(true)
    const t = setTimeout(() => setShowError(false), 6000)
    return () => clearTimeout(t)
  }, [authError])

  // Close the dropdown on click-outside and on Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onDocMouseDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const handleSignIn = async () => {
    setBusy(true)
    try {
      await signIn()
    } catch {
      /* error is surfaced via authError — nothing to do here */
    } finally {
      setBusy(false)
    }
  }

  const handleSignOut = async () => {
    setMenuOpen(false)
    try {
      await signOut()
    } catch {
      /* ignore sign-out errors */
    }
  }

  return (
    <div className="auth-widget" ref={rootRef}>
      {loading ? (
        <span className="auth-loading" aria-label="Checking sign-in status" />
      ) : user ? (
        <>
          <button
            className="auth-avatar"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            title={user.email || user.displayName || 'Account'}
          >
            {getInitials(user)}
          </button>
          {menuOpen && (
            <div className="auth-menu" role="menu">
              <div className="auth-menu-name">{user.displayName || 'Signed in'}</div>
              <div className="auth-menu-email">{user.email}</div>
              <button className="auth-signout" onClick={handleSignOut} role="menuitem">
                Sign Out
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <button className="btn btn-gold auth-signin" onClick={handleSignIn} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
          {authError && showError && (
            <div className="auth-error" role="alert">
              <span>{authError}</span>
              <button
                className="auth-error-close"
                onClick={() => setShowError(false)}
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}