export default function Footer() {
  return (
    <footer>
      <p>
        © 2026 <strong>Urbana FBLA</strong> · Urbana High School · Ijamsville, MD{' '}
        <span className="egg" onClick={(e) => e.currentTarget.classList.toggle('show')}></span>
      </p>
      <p className="footer-sub">
        Future Business Leaders of America
      </p>
    </footer>
  )
}
