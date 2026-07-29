import { Link } from 'react-router-dom'
import './ThankYou.css'

// No `label`, so this page is reachable at /thank-you but hidden from the nav.
// See src/pageRegistry.js.
export const meta = {
  order: 70,
  title: 'Urbana FBLA — Thank You',
}

export default function ThankYou() {
  return (
    <section className="thankyou-section">
      <div className="thankyou-box">
        <div className="checkmark">✅</div>
        <p className="label">Message Received</p>
        <h1>Thank You!</h1>
        <div className="divider"></div>
        <p>Your message has been sent successfully. We'll get back to you soon.</p>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </section>
  )
}
