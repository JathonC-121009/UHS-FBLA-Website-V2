import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Reproduces the IntersectionObserver fade-in behavior from the original
// static pages: any element with the `.fi` class fades/slides in when it
// scrolls into view. Re-runs on route change so newly-mounted elements animate.
export default function useFadeIn() {
  const location = useLocation()

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('on'), i * 80)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fi').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [location.pathname])
}
