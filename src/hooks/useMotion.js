import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* ============================================================================
   MOTION LAYER
   One document-level system serving every page, so components stay markup
   only. Elements opt in with attributes and classes defined in index.css:

     data-reveal            enter on scroll (values: up | fade | left | right |
                            scale | clip). The revealed state is the data-in
                            attribute, set by useReveal below.
     data-reveal-group      stagger the reveals inside this subtree
     data-parallax="0.15"   drift with scroll at the given rate
     .tilt                  follow the pointer with a slight 3D rotation
     .edge                  brighten the 1px border nearest the pointer

   Everything degrades to a static page under prefers-reduced-motion.
   ========================================================================= */

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Enter-on-scroll with per-group stagger, including content mounted later.
 *
 * Two things here are deliberate, and both exist because the previous version
 * left real content permanently invisible:
 *
 * 1. The hidden state lives behind `html.reveal-ready`, added here. If this
 *    module fails to load or throws, nothing is ever hidden and the page
 *    renders as ordinary HTML rather than a blank screen.
 *
 * 2. Revealing sets the `data-in` ATTRIBUTE rather than an `is-in` class.
 *    React owns className on many of these elements and rewrites it whenever
 *    the element re-renders -- switching the points leaderboard between "All
 *    time" and "This month" changes each row's rank class, so React reset
 *    className and wiped the externally-added class, leaving every row that
 *    changed rank stuck at opacity 0. React never touches attributes it did
 *    not render, so data-in survives a re-render.
 */
export function useReveal() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const root = document.documentElement

    if (reduced()) {
      root.classList.remove('reveal-ready')
      return
    }

    root.classList.add('reveal-ready')

    const reveal = (el) => el.setAttribute('data-in', '')
    const tracked = new WeakSet()

    // Content that appears after the first paint is usually the result of an
    // interaction -- switching the points leaderboard between boards remounts
    // every row -- and should just be there. If such an element is already on
    // screen it is revealed synchronously instead of waiting for the observer,
    // which is asynchronous and does not run at all in a background tab.
    // First-paint content still animates in normally.
    let firstScan = true
    const onScreen = (el) => {
      const rect = el.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > -1
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // A fast scroll can carry an element past the viewport between two
          // frames, which reports as "not intersecting" with a negative top.
          // Those count as seen, otherwise they would stay hidden for good.
          const scrolledPast = entry.boundingClientRect.bottom < 0
          if (!entry.isIntersecting && !scrolledPast) return
          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0 },
    )

    const scan = () => {
      let found = 0
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        if (tracked.has(el)) return
        tracked.add(el)
        found += 1

        // Stagger index comes from the element's position in its group, capped
        // so a long list never ends on a two-second delay.
        if (!el.style.getPropertyValue('--reveal-i')) {
          const group = el.closest('[data-reveal-group]')
          if (group) {
            const items = Array.from(group.querySelectorAll('[data-reveal]'))
            el.style.setProperty('--reveal-i', String(Math.min(items.indexOf(el), 7)))
          }
        }

        if (!firstScan && onScreen(el)) {
          reveal(el)
          return
        }
        observer.observe(el)
      })

      firstScan = false

      // Re-arm the safety net for whatever was just added. A single timer set
      // at mount would not cover content that appears later. Only re-arm when
      // this scan actually found something, so unrelated DOM churn (the
      // counters on the home page tick every frame) cannot keep pushing the
      // deadline back.
      if (found) armFailsafe()
    }

    // Failsafe. Anything still hidden after a short delay is shown regardless
    // of scroll position, so a dropped observer callback can never leave real
    // content permanently invisible.
    let failsafe = 0
    const armFailsafe = () => {
      window.clearTimeout(failsafe)
      failsafe = window.setTimeout(() => {
        document.querySelectorAll('[data-reveal]:not([data-in])').forEach(reveal)
      }, 1600)
    }

    scan()

    // Late arrivals (fetched photos, opened tabs) animate the same way.
    let queued = false
    const mutations = new MutationObserver(() => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        scan()
      })
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
      mutations.disconnect()
    }
  }, [pathname])
}

/** Scroll-linked progress bar, nav hairline and parallax drift. */
export function useScrollMotion() {
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    let frame = 0

    const update = () => {
      frame = 0
      const max = root.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      root.style.setProperty('--progress', ratio.toFixed(4))
      root.style.setProperty('--nav-progress', ratio.toFixed(4))

      if (reduced()) return
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const rate = Number(el.dataset.parallax) || 0.12
        const rect = el.getBoundingClientRect()
        const offset = (rect.top - window.innerHeight / 2) * -rate
        el.style.setProperty('--parallax', `${offset.toFixed(2)}px`)
      })
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])
}

/** Pointer-driven card tilt and border tracking, delegated from the document. */
export function usePointerMotion() {
  useEffect(() => {
    if (reduced()) return
    if (window.matchMedia('(hover: none)').matches) return

    let tilted = null

    const release = () => {
      if (!tilted) return
      tilted.classList.remove('is-tilting')
      tilted.style.setProperty('--tilt-x', '0deg')
      tilted.style.setProperty('--tilt-y', '0deg')
      tilted = null
    }

    const onMove = (event) => {
      const target = event.target
      if (!target || typeof target.closest !== 'function') return

      const edge = target.closest('.edge')
      if (edge) {
        const rect = edge.getBoundingClientRect()
        edge.style.setProperty('--mx', `${event.clientX - rect.left}px`)
        edge.style.setProperty('--my', `${event.clientY - rect.top}px`)
      }

      const tilt = target.closest('.tilt')
      if (tilt !== tilted) release()
      if (!tilt) return

      const rect = tilt.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      const strength = Number(tilt.dataset.tilt) || 6

      tilted = tilt
      tilt.classList.add('is-tilting')
      tilt.style.setProperty('--tilt-x', `${(-y * strength).toFixed(2)}deg`)
      tilt.style.setProperty('--tilt-y', `${(x * strength).toFixed(2)}deg`)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', release)
    window.addEventListener('blur', release)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', release)
      window.removeEventListener('blur', release)
      release()
    }
  }, [])
}

/**
 * Slide a shared indicator to whichever child matches `activeSelector`.
 * The indicator is 1px wide and scaled, so the move is one composited
 * transform rather than an animated width.
 */
export function useIndicator(containerRef, activeSelector, deps = []) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const place = () => {
      const active = container.querySelector(activeSelector)
      if (!active) {
        container.style.setProperty('--ind-o', '0')
        return
      }
      const parent = container.getBoundingClientRect()
      const rect = active.getBoundingClientRect()
      container.style.setProperty('--ind-x', `${rect.left - parent.left}px`)
      container.style.setProperty('--ind-w', rect.width.toFixed(2))
      container.style.setProperty('--ind-o', '1')
    }

    // Fonts settle after first paint; measure again once they have.
    place()
    const raf = requestAnimationFrame(place)
    document.fonts?.ready.then(place).catch(() => {})

    const resize = new ResizeObserver(place)
    resize.observe(container)
    window.addEventListener('resize', place)

    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      window.removeEventListener('resize', place)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Play a dialog back from the element that opened it, so a card appears to
 * grow into its detail view. Pass the clicked element's rect, captured at
 * click time, and call this from the dialog's ref callback.
 */
export function sharedExpand(node, originRect) {
  if (!node || !originRect || reduced()) return

  const rect = node.getBoundingClientRect()
  if (!rect.width || !rect.height) return

  const scale = Math.min(Math.max(originRect.width / rect.width, 0.25), 1)
  const dx = originRect.left + originRect.width / 2 - (rect.left + rect.width / 2)
  const dy = originRect.top + originRect.height / 2 - (rect.top + rect.height / 2)

  node.style.setProperty('--from-x', `${dx.toFixed(1)}px`)
  node.style.setProperty('--from-y', `${dy.toFixed(1)}px`)
  node.style.setProperty('--from-scale', scale.toFixed(3))
  node.classList.add('shared-expand')
}
