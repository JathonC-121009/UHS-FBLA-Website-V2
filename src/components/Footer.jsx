import { Link } from 'react-router-dom'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-mark">
            Urbana <em>FBLA</em>
          </p>
          <address className="footer-address">
            Urbana High School
            <br />
            3471 Campus Drive, Ijamsville, MD 21754
            <br />
            <a href="mailto:uhsfbla2@gmail.com">uhsfbla2@gmail.com</a>
          </address>
        </div>

        <div className="footer-col">
          <h2>Chapter</h2>
          <ul>
            <li><Link to="/events">Calendar</Link></li>
            <li><Link to="/officers">Officers</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/points">Points</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>Elsewhere</h2>
          <ul>
            <li><a href="https://www.instagram.com/urbanafbla" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://connect.fbla.org/" target="_blank" rel="noreferrer">FBLA Connect</a></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/resources">Resources</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-base">
        <span>
          {YEAR} Urbana FBLA, Future Business Leaders of America
          <span
            className="mark"
            role="presentation"
            onClick={(e) => e.currentTarget.classList.toggle('is-shown')}
          />
        </span>
        <span className="footer-legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  )
}
