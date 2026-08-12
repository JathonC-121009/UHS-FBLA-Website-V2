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
  const { user, loading, openAuthModal, signOut } = useAuth()

  // Signed-in avatar dropdown
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef(null)

  // Close the signed-in dropdown on click-outside.
  useEffect(() => {
    if (!menuOpen) return
    const onDocMouseDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [menuOpen])

  const handleSignOut = async () => {
    setMenuOpen(false)
    try {
      await signOut()
    } catch {
      /* ignore sign-out errors */
    }
  }

  // The sign-in / profile-setup modals are NOT rendered here — AuthModal is
  // mounted exactly once from App.jsx and driven by the shared
  // authModalOpen / openAuthModal / closeAuthModal context values.
  return (
    <div className="auth-widget" ref={rootRef}>
      {loading ? (
        <span className="auth-loading" aria-label="Checking sign-in status" />
      ) : user ? (
        /* ------- Signed in with avatar + dropdown ------- */
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
        /* ------- Signed out: button that opens the Step 1 modal ------- */
        <button className="btn btn-gold auth-signin" onClick={openAuthModal}>
          Sign In
        </button>
      )}
    </div>
  )
}