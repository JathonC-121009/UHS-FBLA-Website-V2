import { useEffect, useRef, useState } from 'react'

const easeOut = (t) => 1 - Math.pow(1 - t, 4)

/**
 * A figure that counts up the first time it scrolls into view. Static for
 * anyone who prefers reduced motion.
 */
export default function Counter({ to, duration = 1400, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          setValue(Math.round(easeOut(progress) * to))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [to, duration])

  return (
    <span ref={ref} className="counter">
      {prefix}
      {value}
      {suffix}
    </span>
  )
}
