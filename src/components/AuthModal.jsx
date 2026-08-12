import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth.js'
import './AuthModal.css'

const GRADES = ['9', '10', '11', '12', 'Staff/Other']

/**
 * The single sign-in / profile-setup modal for the whole app.
 *
 * Rendered exactly once, from App.jsx — NOT from AuthWidget, which mounts
 * twice (desktop row + mobile menu) and would otherwise duplicate the modal's
 * DOM ids and form state, with the two copies fighting over the shared
 * authModalOpen context value. Driven entirely by AuthProvider's existing
 * authModalOpen / openAuthModal / closeAuthModal.
 *
 * - Step 1 (sign in / create account) shows when the modal was opened while
 *   signed out — from the navbar button or a page trigger like the Bulletin
 *   Board's "+ New Post" or reply prompts.
 * - Step 2 (profile setup) is required: it takes over whenever a signed-in
 *   user hasn't finished setup yet, with no dismiss option.
 */
export default function AuthModal() {
  const {
    user,
    authError,
    needsProfileSetup,
    authModalOpen,
    closeAuthModal,
    signIn,
    signUpWithEmail,
    signInWithEmail,
    completeProfileSetup,
  } = useAuth()

  // Step 1 — sign-in / create-account form
  const [mode, setMode] = useState('signin') // 'signin' | 'create'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2 — profile setup form
  const [setupName, setSetupName] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')

  // Shared form feedback + busy state
  const [formError, setFormError] = useState('')
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

  // Close the sign-in modal on Escape (Step 2 has no dismiss option).
  useEffect(() => {
    if (!authModalOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeAuthModal()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [authModalOpen])

  // Profile setup becomes required: dismiss the sign-in modal and pre-fill the
  // name field with whatever displayName the auth method already provided.
  useEffect(() => {
    if (needsProfileSetup) {
      closeAuthModal()
      setSetupName((prev) => prev || user?.displayName || '')
    }
  }, [needsProfileSetup, user])

  // Any openAuthModal() call (navbar button or a page trigger like the Bulletin
  // Board) opens a fresh Step 1 modal: reset form state to sign-in defaults.
  useEffect(() => {
    if (!authModalOpen) return
    setMode('signin')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFormError('')
  }, [authModalOpen])

  const switchTo = (next) => {
    setMode(next)
    setConfirmPassword('')
    setFormError('')
  }

  const handleGoogle = async () => {
    setBusy(true)
    try {
      const fbUser = await signIn()
      if (fbUser) closeAuthModal()
    } finally {
      setBusy(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!email.trim()) {
      setFormError('Please enter your email address.')
      return
    }
    if (!password) {
      setFormError('Please enter your password.')
      return
    }
    if (mode === 'create') {
      if (password.length < 6) {
        setFormError('Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match.')
        return
      }
    }

    setBusy(true)
    try {
      const fbUser =
        mode === 'signin'
          ? await signInWithEmail(email, password)
          : await signUpWithEmail(email, password)
      if (fbUser) closeAuthModal()
    } finally {
      setBusy(false)
    }
  }

  const handleSetupSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const name = setupName.trim()
    if (!name) {
      setFormError('Please enter your name.')
      return
    }
    if (!gradeLevel) {
      setFormError('Please select your grade level.')
      return
    }

    setBusy(true)
    try {
      await completeProfileSetup(name, gradeLevel)
    } finally {
      setBusy(false)
    }
  }

  const banner = formError || (authError && showError ? authError : '')

  // Step 2 takes over for signed-in users mid-setup; Step 1 only opens while
  // signed out — they can never render together, exactly like the old widget.
  if (user && needsProfileSetup) {
    return (
      /* ------- Step 2 — profile setup (required, no dismiss option) ------- */
      <div className="auth-modal-overlay">
        <div className="auth-modal" role="dialog" aria-modal="true" aria-label="Complete your profile">
          <h3>Complete your profile</h3>
          <p className="auth-modal-sub">One quick detail so we know who you are.</p>

          {banner && (
            <div className="auth-error" role="alert">
              <span>{banner}</span>
            </div>
          )}

          <form onSubmit={handleSetupSubmit}>
            <div className="auth-form-group">
              <label htmlFor="setup-name">Name</label>
              <input
                id="setup-name"
                type="text"
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                placeholder="Your name"
                autoFocus
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="setup-grade">Grade Level</label>
              <select
                id="setup-grade"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                <option value="">Select grade…</option>
                {GRADES.map((g) => (
                  <option value={g} key={g}>{g}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-gold btn-block" disabled={busy}>
              {busy ? 'Saving…' : 'Finish'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (!user && authModalOpen) {
    return (
      /* ------- Step 1 — sign-in / create account ------- */
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

          <div className="auth-divider">or</div>

          <div className="auth-mode-toggle">
            <button
              type="button"
              className={mode === 'signin' ? 'active' : ''}
              onClick={() => switchTo('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === 'create' ? 'active' : ''}
              onClick={() => switchTo('create')}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleEmailSubmit}>
            <div className="auth-form-group">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {mode === 'create' && (
              <div className="auth-form-group">
                <label htmlFor="auth-confirm">Confirm Password</label>
                <input
                  id="auth-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            )}
            <button type="submit" className="btn btn-navy btn-block" disabled={busy}>
              {busy ? 'Working…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return null
}