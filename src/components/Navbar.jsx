import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { navPages } from '../pageRegistry.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav>
      <Link to="/" className="nav-logo">
        <img
          src="https://res.cloudinary.com/dmgisz0pf/image/upload/f_auto,q_auto,h_124/v1777949175/logo_z9kpxp.png"
          alt="Maryland FBLA Urbana High School"
        />
      </Link>
      <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      {/* Links come from each page's `meta` export — see src/pageRegistry.js. */}
      <ul className={`nav-links${open ? ' open' : ''}`} id="nl">
        {navPages.map((page) => (
          <li key={page.slug}>
            <NavLink
              to={page.path}
              end={page.isIndex}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              onClick={() => setOpen(false)}
            >
              {page.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
