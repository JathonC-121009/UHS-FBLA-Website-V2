import { createPortal } from 'react-dom'

/**
 * Renders children at the end of <body>.
 *
 * Overlays have to escape the page shell: <Layout> animates the route wrapper,
 * and an element with a transform becomes the containing block for any
 * `position: fixed` descendant, which would leave a dialog anchored to the
 * document instead of the viewport. Everything full-screen goes through here.
 */
export default function Portal({ children }) {
  if (typeof document === 'undefined') return null
  return createPortal(children, document.body)
}
