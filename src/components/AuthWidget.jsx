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

const GRADES = ['9', '10', '11', '12', 'Staff/Other']

export default function AuthWidget() {
  const {
    user,
    loading,
    authError,
    needsProfileSetup,
    signIn,
    signUpWithEmail,
    signInWithEmail,
    completeProfileSetup,
    signOut,
  } = useAuth()

  // Signed-in avatar dropdown
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef(null)

  // Step 1 — sign-in / create-account modal
  const [signInOpen, setSignInOpen] = useState(false)
  const [mode, setMode] = useState('signin') // 'signin' | 'create'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2 — profile setup modal
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

  // Close the sign-in modal on Escape.
  useEffect(() => {
    if (!signInOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSignInOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [signInOpen])

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

  // Profile setup becomes required: dismiss the sign-in modal and pre-fill the
  // name field with whatever displayName the auth method already provided.
  useEffect(() => {
    if (needsProfileSetup) {
      setSignInOpen(false)
      setSetupName((prev) => prev || user?.displayName || '')
    }
  }, [needsProfileSetup, user])

  const openSignIn = () => {
    setMode('signin')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFormError('')
    setSignInOpen(true)
  }

  const switchTo = (next) => {
    setMode(next)
    setConfirmPassword('')
    setFormError('')
  }

  const handleGoogle = async () => {
    setBusy(true)
    try {
      const fbUser = await signIn()
      if (fbUser) setSignInOpen(false)
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
      if (fbUser) setSignInOpen(false)
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

  const handleSignOut = async () => {
    setMenuOpen(false)
    try {
      await signOut()
    } catch {
      /* ignore sign-out errors */
    }
  }

  const banner = formError || (authError && showError ? authError : '')

  return (
    <div className="auth-widget" ref={rootRef}>
      {loading ? (
        <span className="auth-loading" aria-label="Checking sign-in status" />
      ) : user ? (
        needsProfileSetup ? (
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
        ) : (
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
        )
      ) : (
        /* ------- Signed out: button that opens the Step 1 modal ------- */
        <>
          <button className="btn btn-gold auth-signin" onClick={openSignIn}>
            Sign In
          </button>

          {signInOpen && (
            <div className="auth-modal-overlay" onMouseDown={() => setSignInOpen(false)}>
              <div
                className="auth-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Sign in"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button className="auth-modal-close" onClick={() => setSignInOpen(false)} aria-label="Close">
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
          )}
        </>
      )}
    </div>
  )
}