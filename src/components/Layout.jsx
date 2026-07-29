import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import useFadeIn from '../hooks/useFadeIn.js'
import { findPage } from '../pageRegistry.js'

export default function Layout() {
  const location = useLocation()
  const page = findPage(location.pathname)
  useFadeIn()

  // Scroll to top on route change (each original page loaded fresh at the top).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Tag <body> with the active route, e.g. `route-events`. Every page
  // stylesheet scopes itself under that class, which does two things:
  //   1. page styles can never leak into another page, and
  //   2. a page can restyle the shared navbar/footer/hero for itself only
  //      (`.route-events nav { ... }`) without editing index.css.
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
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
