import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth.js'
import Icon from './Icon.jsx'
import './AuthModal.css'

/**
 * The single Google sign-in dialog for the whole app.
 *
 * Rendered exactly once, from App.jsx, and never from AuthWidget: that widget
 * mounts twice (desktop row and mobile menu) and two copies would duplicate
 * the dialog's DOM ids while fighting over the same authModalOpen context
 * value. Everything here is driven by AuthProvider's authModalOpen,
 * openAuthModal and closeAuthModal.
 *
 * It appears when the modal is opened while signed out, either from the navbar
 * button or from a page trigger such as the board's new post and reply
 * prompts. School domain gating happens in AuthProvider.signIn: a rejected
 * Google account is signed straight back out, signIn() resolves undefined, and
 * the dialog stays open with the error banner visible.
 *
 * Profile creation is automatic (see ensureUserProfile in AuthProvider), so
 * there is no second step and no editable fields.
 */
export default function AuthModal() {
  const { user, authError, authModalOpen, closeAuthModal, signIn } = useAuth()

  // Shared form feedback + busy state
  const [showError, setShowError] = useState(false)
  const [busy, setBusy] = useState(false)

  // Clear the error banner a few seconds after it appears.
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
      // signIn() resolves undefined for a domain-rejected account, so the
      // dialog stays open and shows the rejection through authError instead.
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
            <Icon name="close" size={16} />
          </button>

          <p className="eyebrow">Members</p>
          <h3>Sign in</h3>
          <p className="auth-modal-sub">
            Use your Google account to post on the board and reply to other
            members.
          </p>

          {banner && (
            <div className="auth-error" role="alert">
              <span>{banner}</span>
            </div>
          )}

          <button className="btn btn-primary btn-block" onClick={handleGoogle} disabled={busy}>
            {busy ? 'Opening Google' : 'Continue with Google'}
          </button>
        </div>
      </div>
    )
  }

  return null
}