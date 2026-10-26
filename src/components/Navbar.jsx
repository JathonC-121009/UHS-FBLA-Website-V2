import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { navPages } from '../pageRegistry.js'
import { useIndicator } from '../hooks/useMotion.js'
import AuthWidget from './AuthWidget.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const listRef = useRef(null)
  const { pathname } = useLocation()

  // The underline slides between links instead of appearing under each one.
  useIndicator(listRef, 'a.active', [pathname])

  // Close the mobile panel on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav className="nav" aria-label="Primary">
      <Link to="/" className="nav-logo">
        <img
          src="https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,h_124/v1777949175/logo_z9kpxp.png"
          alt="Maryland FBLA, Urbana High School"
        />
        <span className="nav-wordmark">
          <b>Urbana FBLA</b>
          Chapter 2026 / 2027
        </span>
      </Link>

      <button
        type="button"
        className="nav-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="primary-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <span />
      </button>

      {/* Links come from each page's `meta` export. See src/pageRegistry.js. */}
      <ul id="primary-nav" className={`nav-links${open ? ' is-open' : ''}`} ref={listRef}>
        {navPages.map((page) => (
          <li key={page.slug}>
            <NavLink
              to={page.path}
              end={page.isIndex}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {page.label}
            </NavLink>
          </li>
        ))}
        <li className="nav-auth-mobile">
          <AuthWidget />
        </li>
        <li className="nav-indicator-slot" aria-hidden="true">
          <span className="indicator nav-indicator" />
        </li>
      </ul>

      <div className="nav-auth">
        <AuthWidget />
      </div>
    </nav>
  )
}
