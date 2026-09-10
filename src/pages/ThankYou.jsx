import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import './ThankYou.css'

// No `label`, so this page is reachable at /thank-you but stays out of the
// nav. See src/pageRegistry.js.
export const meta = {
  order: 70,
  title: 'Urbana FBLA, Message Sent',
}

export default function ThankYou() {
  return (
    <section className="thanks">
      <div className="thanks-grid" data-parallax="0.05" aria-hidden="true" />

      <div className="thanks-inner" data-reveal-group>
        <span className="thanks-check" data-reveal="scale">
          <Icon name="check" size={22} strokeWidth={1.8} />
        </span>
        <p className="eyebrow" data-reveal="fade">Message sent</p>
        <h1 className="thanks-title" data-reveal="clip">
          Thanks for writing.
        </h1>
        <p className="thanks-body" data-reveal>
          An officer picks up chapter mail during the school week. If it is about
          joining, come to the next meeting on the calendar in the meantime.
        </p>
        <div className="thanks-actions" data-reveal>
          <Link to="/" className="btn btn-accent">
            Back home
            <Icon name="arrow" className="arrow" />
          </Link>
          <Link to="/events" className="btn btn-ghost-ink">
            See the calendar
          </Link>
        </div>
      </div>
    </section>
  )
}
