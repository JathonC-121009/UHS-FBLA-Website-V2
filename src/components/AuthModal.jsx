import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth.js'
import './AuthModal.css'

/**
 * The single Google-only sign-in modal for the whole app.
 *
 * Rendered exactly once, from App.jsx — NOT from AuthWidget, which mounts
 * twice (desktop row + mobile menu) and would otherwise duplicate the modal's
 * DOM ids and state, with the two copies fighting over the shared
 * authModalOpen context value. Driven entirely by AuthProvider's existing
 * authModalOpen / openAuthModal / closeAuthModal.
 *
 * Shows when the modal was opened while signed out — from the navbar button
 * or a page trigger like the Bulletin Board's "+ New Post" or reply prompts.
 * School-domain gating is enforced in AuthProvider.signIn: a rejected Google
 * account is signed straight back out, signIn() returns undefined, and the
 * modal naturally stays open with the authError banner visible.
 *
 * Profile creation is automatic (see ensureUserProfile in AuthProvider) —
 * there is no second step and no user-editable fields.
 */
export default function AuthModal() {
  const { user, authError, authModalOpen, closeAuthModal, signIn } = useAuth()

  // Shared form feedback + busy state
  const [showError, setShowError] = useState(false)
  const [busy, setBusy] = useState(false)

  // Dismiss the context error banner automatically a few seconds after it appears.
  useEffect(() => {
    if (!authError) {
      setShowError(false)
      return
    }
    setShowError(true)
    const t = setTimeout(() => setShowError(false), 6000)
    return () => clearTimeout(t)
  }, [authError])

  // Close the sign-in modal on Escape.
  useEffect(() => {
    if (!authModalOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeAuthModal()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [authModalOpen])

  const handleGoogle = async () => {
    setBusy(true)
    try {
      const fbUser = await signIn()
      // signIn() resolves undefined for a domain-rejected account — the
      // modal stays open and shows the rejection via authError instead.
      if (fbUser) closeAuthModal()
    } finally {
      setBusy(false)
    }
  }

  const banner = authError && showError ? authError : ''

  if (!user && authModalOpen) {
    return (
      <div className="auth-modal-overlay" onMouseDown={closeAuthModal}>
        <div
          className="auth-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Sign in"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button className="auth-modal-close" onClick={closeAuthModal} aria-label="Close">
            ✕
          </button>

          <h3>Sign in to Urbana FBLA</h3>
          <p className="auth-modal-sub">Join member discussions and chapter features.</p>

          {banner && (
            <div className="auth-error" role="alert">
              <span>{banner}</span>
            </div>
          )}

          <button className="btn btn-navy btn-block" onClick={handleGoogle} disabled={busy}>
            {busy ? 'Working…' : 'Continue with Google'}
          </button>
        </div>
      </div>
    )
  }

  return null
}