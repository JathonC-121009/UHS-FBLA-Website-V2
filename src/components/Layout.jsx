import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { useReveal, useScrollMotion, usePointerMotion } from '../hooks/useMotion.js'
import { findPage } from '../pageRegistry.js'

export default function Layout() {
  const location = useLocation()
  const page = findPage(location.pathname)

  // Site-wide motion: scroll reveals, the progress bar and parallax, and
  // pointer-driven tilt / border tracking. See src/hooks/useMotion.js.
  useReveal()
  useScrollMotion()
  usePointerMotion()

  // Each route opens at the top, the way a fresh page load would.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Tag <body> with the active route, e.g. `route-events`. Every page
  // stylesheet scopes itself under that class, which does two things:
  //   1. page styles can never leak into another page, and
  //   2. a page can restyle the shared navbar, footer or masthead for itself
  //      alone (`.route-events .nav { ... }`) without editing index.css.
  useEffect(() => {
    const cls = `route-${page?.slug ?? 'unknown'}`
    document.body.classList.add(cls)
    return () => document.body.classList.remove(cls)
  }, [page])

  // Tab title comes from the page's `meta.title`, so pages don't repeat it.
  useEffect(() => {
    if (page?.title) document.title = page.title
  }, [page])

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <Navbar />
      {/* Keyed on the path so every route entrance replays the same lift. */}
      <main className="route-shell" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
