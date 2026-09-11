import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.jpg'
import Counter from '../components/Counter.jsx'
import Icon from '../components/Icon.jsx'
import './Home.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  index: true,
  slug: 'home',
  label: 'Home',
  order: 10,
  title: 'Urbana FBLA',
}

const RECORD = [
  {
    title: 'Largest chapter in Maryland',
    body: 'Our membership has almost tripled in the last two years, and Maryland FBLA gave us the Largest Chapter award for it.',
  },
  {
    title: 'Gold Seal chapter',
    body: 'The Gold Seal is the state\u2019s top chapter award. It looks at how much a chapter grows, how it does at competition, and how much service it does.',
  },
  {
    title: 'Two state officers',
    body: 'Charis Roussel is Maryland FBLA State President and National Secretary, and Hannah Cho is State Reporter and Historian.',
  },
  {
    title: 'Fifty members at Nationals',
    body: 'Over fifty of our members qualified for the National Leadership Conference in San Antonio last summer.',
  },
]

const LEDGER = [
  { value: 150, suffix: '+', label: 'Members at the state conference' },
  { value: 50, suffix: '+', label: 'Qualified for Nationals' },
  { value: 70, suffix: '+', label: 'Events you can compete in' },
  { value: 2, suffix: '', label: 'Maryland state officers' },
]

export default function Home() {
  return (
    <>
      {/* HERO: asymmetric, headline left, chapter photograph right */}
      <section className="hero" data-reveal-group>
        <div className="hero-grid" data-parallax="0.05" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow" data-reveal="fade">
              Urbana High School &middot; Ijamsville, Maryland
            </p>

            <h1 className="hero-title" data-reveal="clip">
              The largest FBLA chapter in <em>Maryland</em>.
            </h1>

            <p className="hero-lede" data-reveal>
              We're a business and leadership club run by students at Urbana High
              School. Anyone can join, and you don't need any experience to start.
            </p>

            <div className="hero-actions" data-reveal>
              <Link to="/events" className="btn btn-accent">
                See what's coming up
                <Icon name="arrow" className="arrow" />
              </Link>
              <Link to="/contact" className="btn btn-ghost-ink">
                Join the chapter
              </Link>
            </div>
          </div>

          <figure className="hero-figure" data-reveal="scale">
            <div className="hero-figure-frame">
              <img src={heroImg} alt="Urbana FBLA members at the state leadership conference" />
            </div>
            <figcaption>
              Our members at the State Leadership Conference in Baltimore.
            </figcaption>
          </figure>
        </div>

        {/* Scroll-linked figures, counting up as the strip arrives */}
        <dl className="ledger" data-reveal-group>
          {LEDGER.map((item) => (
            <div className="ledger-cell" key={item.label} data-reveal>
              <dt className="ledger-value">
                <Counter to={item.value} suffix={item.suffix} />
              </dt>
              <dd className="ledger-label">{item.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CHAPTER: sticky title column against a numbered record */}
      <section className="chapter">
        <div className="chapter-inner">
          <div className="chapter-head">
            <p className="eyebrow" data-reveal="fade">The chapter</p>
            <h2 className="section-title" data-reveal>
              What we've <em>done</em>.
            </h2>
            <p className="section-intro" data-reveal>
              Members compete in business events, help run the chapter, and volunteer
              around Frederick County. Here's what the last couple of years look like.
            </p>
            <Link to="/officers" className="chapter-link" data-reveal>
              Meet our officers
              <Icon name="arrow" className="arrow" size={14} />
            </Link>
          </div>

          <ol className="record" data-reveal-group>
            {RECORD.map((item, i) => (
              <li className="record-row edge" key={item.title} data-reveal>
                <span className="record-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="record-body">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* MISSION: full-width pull quote */}
      <section className="mission">
        <div className="mission-grid" data-parallax="0.08" aria-hidden="true" />
        <blockquote className="mission-quote" data-reveal="clip">
          FBLA inspires and prepares students to become community minded business leaders
          in a global society through relevant career preparation and leadership
          experiences.
        </blockquote>
        <p className="mission-cite" data-reveal="fade">FBLA mission statement</p>
      </section>

      {/* CLOSE: two doors out of the page */}
      <section className="gateway">
        <div className="gateway-inner" data-reveal-group>
        <Link to="/resources" className="gateway-card edge tilt" data-reveal data-tilt="4">
          <span className="mono-label">Prepare</span>
          <h2>Competition resources</h2>
          <p>Study guides, past topics, and rubrics for every event we compete in.</p>
          <span className="gateway-arrow"><Icon name="arrow" size={18} /></span>
        </Link>
        <Link to="/bulletin" className="gateway-card edge tilt" data-reveal data-tilt="4">
          <span className="mono-label">Talk</span>
          <h2>The chapter board</h2>
          <p>Announcements, photos, and questions posted by members.</p>
          <span className="gateway-arrow"><Icon name="arrow" size={18} /></span>
        </Link>
        </div>
      </section>
    </>
  )
}
