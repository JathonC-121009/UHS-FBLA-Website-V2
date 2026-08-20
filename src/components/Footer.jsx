import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <p>
        © 2026 <strong>Urbana FBLA</strong> · Urbana High School · Ijamsville, MD{' '}
        <span className="egg" onClick={(e) => e.currentTarget.classList.toggle('show')}></span>
      </p>
      <p className="footer-links" style={{ marginTop: '.5rem' }}>
        <Link to="/privacy" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>Privacy Policy</Link>
        <span aria-hidden="true"> · </span>
        <Link to="/terms" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>Terms of Service</Link>
      </p>
      <p className="footer-sub">
        Future Business Leaders of America
      </p>
    </footer>
  )
}
