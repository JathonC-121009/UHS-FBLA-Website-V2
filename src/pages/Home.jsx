import heroImg from '../assets/hero.jpg'
import './Home.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  index: true,
  slug: 'home',
  label: 'Home',
  order: 10,
  title: 'Urbana FBLA — Home',
}

export default function Home() {
  return (
    <>
      {/* HERO — chapter group photo as background */}
      <section className="hero">
        <img className="hero-img" src={heroImg} alt="Urbana FBLA chapter members at conference" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="fi">
            Building Tomorrow's<br /><em>Business Leaders</em>
          </h1>
          <p className="hero-sub fi">
            Urbana FBLA prepares students for success in business and leadership through
            competitive events, professional development, and community service.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section">
        <div className="about-grid">
          <div className="fi">
            <h2 className="section-title">About Our Chapter</h2>
            <div className="divider"></div>
            <p className="section-intro">
              Urbana FBLA is Maryland's largest chapter and a Gold Seal recipient, with membership
              that has nearly tripled over the last two school years. In 2026, we sent over 150
              members to the State Leadership Conference and over 50 to Nationals.
            </p>
            <p className="about-text">
              Through competitive events, community service, and professional development, our
              members build the critical thinking, leadership, and business skills to succeed
              beyond high school.
            </p>
          </div>
          <div className="value-list fi">
            <div className="value-item">
              <div className="vi-icon">🥇</div>
              <div>
                <div className="vi-title">Maryland's Largest Chapter</div>
                <div className="vi-desc">We've nearly tripled our membership in two years and hold the Maryland Largest Chapter award.</div>
              </div>
            </div>
            <div className="value-item">
              <div className="vi-icon">🏅</div>
              <div>
                <div className="vi-title">Gold Seal Chapter</div>
                <div className="vi-desc">Recognized by Maryland FBLA for excellence in membership, competition, and community service.</div>
              </div>
            </div>
            <div className="value-item">
              <div className="vi-icon">🎤</div>
              <div>
                <div className="vi-title">Two Maryland State Officers</div>
                <div className="vi-desc">Charis Roussel serves as Maryland FBLA State President and Hannah Cho as State Reporter/Historian.</div>
              </div>
            </div>
            <div className="value-item">
              <div className="vi-icon">🏆</div>
              <div>
                <div className="vi-title">50+ Members at NLC 2026</div>
                <div className="vi-desc">Over 50 Urbana students will compete at the National Leadership Conference in San Antonio this summer.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION QUOTE */}
      <div className="mission">
        <blockquote className="fi">
          "FBLA inspires and prepares students to become community-minded business leaders in a
          global society through relevant career preparation and leadership experiences."
          <cite>— FBLA Mission Statement</cite>
        </blockquote>
      </div>
    </>
  )
}
