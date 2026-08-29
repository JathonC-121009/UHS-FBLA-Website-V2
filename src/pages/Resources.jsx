import './Resources.css'
import { useState } from 'react'

export const meta = {
  label: 'Resources',   // navbar text — delete this line to hide it from the nav
  order: 30,           // navbar position; lower numbers come first
  title: 'Urbana FBLA — Resources',  // browser tab title
  // path: 'custom-url',  // optional: override the URL (defaults to the slug)
  // index: true,         // optional: make this the "/" home page
}

export default function Resources() {
  const [active, setActive] = useState('events')
  const [searchTerm, setSearchTerm] = useState('')

  const typeMessages = {
    o: 'Objective Testing Event',
    p: 'Presentation Event',
    r: 'Role Play Event',
    c: 'Chapter Event',
    d: 'Production Event'
  }

  const events = [
    { name: 'Accounting', url: 'https://drive.google.com/drive/folders/1T877gdscLJuhtAGUaAZX-CBTKFRiBOmr', type: 'o' },
    { name: 'Advanced Accounting', url: 'https://drive.google.com/drive/folders/1-eWFwxzCDFSPGS1jF2OQIFB6R0R_NxKh', type: 'o' },
    { name: 'Advertising', url: 'https://drive.google.com/drive/folders/11Tbx9ytwLfrsYBkIMK4NRF8N87Okj1sd', type: 'o' },
    { name: 'Agribusiness', url: 'https://drive.google.com/drive/folders/13feGgwScmbzvuKZeoIremqsRbHuekwIM', type: 'o' },
    { name: 'Banking & Financial Systems', url: 'https://drive.google.com/drive/folders/1BjdINcrOO7Ws03-DhEuRJ7rj_EbEAblm', type: 'r' },
    { name: 'Broadcast Journalism', url: 'https://drive.google.com/drive/folders/191SA4lPyI5M4K1OWc-V4DVAwZGXZaHRU', type: 'p' },
    { name: 'Business Communication', url: 'https://drive.google.com/drive/folders/1p9jR4ZvE73uGpI5EKIi0Or_BqwqGShUG', type: 'o' },
    { name: 'Business Ethics', url: 'https://drive.google.com/drive/folders/15MPfNEqZayZNuo2DIKyi-fvcTyePV3rr', type: 'p' },
    { name: 'Business Law', url: 'https://drive.google.com/drive/folders/1jRu9POUvtstwohUnbS2sSNvCqP5wVsEm', type: 'o' },
    { name: 'Business Management', url: 'https://drive.google.com/drive/folders/1SnVqTbzTHqfKxtNNEnILHcH2vaYW9kXJ', type: 'r' },
    { name: 'Business Plan', url: 'https://drive.google.com/drive/folders/1vdoO5jKmwzU7ibKEVuSkLaKavkbZdLFZ', type: 'p' },
    { name: 'Career Portfolio', url: 'https://drive.google.com/drive/folders/1R2BQNWz9BHqRI_sN1WXJWDmChEBjuwws', type: 'p' },
    { name: 'Coding & Programming', url: 'https://drive.google.com/drive/folders/1ZyKZcEyypNaEN-m7VC6TLKW_CiM9aMB3', type: 'p' },
    { name: 'Community Service Project', url: 'https://drive.google.com/drive/folders/1XUHgFEC0Dp8rtUxF-GQrK8V4_Ky9IlS4', type: 'c' },
    { name: 'Computer Applications', url: 'https://drive.google.com/drive/folders/11ZZ8Aj9WQ5lL5UIW2BjN5Sz6hIyfNCDM', type: 'd' },
    { name: 'Computer Game & Simulation Programming', url: 'https://drive.google.com/drive/folders/16WJxaNXNzQCecFTCcjg_qpXk_Bqqc76w', type: 'p' },
    { name: 'Computer Problem Solving', url: 'https://drive.google.com/drive/folders/1l4CuktyHMKHFGAEhV6_QRjrxyy7_Q8L5', type: 'o' },
    { name: 'Customer Service', url: 'https://drive.google.com/drive/folders/1zls8mJS75ugLyGs33SAqcDleOtza6Bap', type: 'r' },
    { name: 'Cybersecurity', url: 'https://drive.google.com/drive/folders/10vDLW7iGGtLZHP9yh9xzM-7SqUpeT0wo', type: 'o' },
    { name: 'Data Analysis', url: 'https://drive.google.com/drive/folders/1JmKU0-Kv7ad0dpqacAB3eXXgzRMIgylS', type: 'p' },
    { name: 'Data Science & AI', url: 'https://drive.google.com/drive/folders/1kN2MgbqX0KNV7Ms2TqTCajbOOO3pAoTA', type: 'o' },
    { name: 'Digital Animation', url: 'https://drive.google.com/drive/folders/1TYpca0TPEOtzyUqkrv0QPH46N4lXbO3N', type: 'p' },
    { name: 'Digital Video Production', url: 'https://drive.google.com/drive/folders/1fFIcdbzy6oBLTgKr2VyRaKLZcWluf83n', type: 'p' },
    { name: 'Economics', url: 'https://drive.google.com/drive/folders/10jE0mlWJZWyyWSCTLFIY_yAwNRqRGiwT', type: 'o' },
    { name: 'Entrepreneurship', url: 'https://drive.google.com/drive/folders/1GqfuTmjt1u8ZMKVRCv4E8_l7e9FZg0bI', type: 'r' },
    { name: 'Event Planning', url: 'https://drive.google.com/drive/folders/1TDuQ1e2pKI878tIUL6HpIBmJ2SE4SRtm', type: 'p' },
    { name: 'Financial Planning', url: 'https://drive.google.com/drive/folders/1mzcDHY5gpDBaRbDiCB7gAxaN63W0M6xn', type: 'p' },
    { name: 'Financial Statement Analysis', url: 'https://drive.google.com/drive/folders/1YOf12M6w0fnyzBV8MXjIVsS_KrKud6Mu', type: 'p' },
    { name: 'Future Business Educator', url: 'https://drive.google.com/drive/folders/1gYJaGb76wV5RxzwUknNz0_QW-2OpFCpm', type: 'p' },
    { name: 'Future Business Leader', url: 'https://drive.google.com/drive/folders/12mDWtk8gFQwlZNUHDf8NT8zTijqd2SoP', type: 'p' },
    { name: 'Graphic Design', url: 'https://drive.google.com/drive/folders/1d4sm_507ouEqexn1L-Jv41vy5Grucfuy', type: 'p' },
    { name: 'Health Care Administration', url: 'https://drive.google.com/drive/folders/1wSrQLUo95YB2nRC00oxFA1Z8rW3Vgv0r', type: 'o' },
    { name: 'Hospitality & Event Management', url: 'https://drive.google.com/drive/folders/1e1hEuaLpkhHUmChLx_vzVWaCUGS-PmfK', type: 'r' },
    { name: 'Human Resource Management', url: 'https://drive.google.com/drive/folders/13PdFC5jbQYzv1gUMLtiVzrhxZP20EnIn', type: 'o' },
    { name: 'Impromptu Speaking', url: 'https://drive.google.com/drive/folders/1aLi_djtMnV8_EAAcZBZmbXaG5EpSIx-B', type: 'p' },
    { name: 'Insurance & Risk Management', url: 'https://drive.google.com/drive/folders/165VWRI_heDWOtqPRV4zIuKsbCqQR2Sse', type: 'o' },
    { name: 'International Business', url: 'https://drive.google.com/drive/folders/1u-N7TMzvn-dKEwQH94ybZi0ePUKE7cGp', type: 'r' },
    { name: 'Introduction to Business Communication', url: 'https://drive.google.com/drive/folders/1SplDfP6nNMm_IXdlJpZHiAormJY8thZr', type: 'o' },
    { name: 'Introduction to Business Concepts', url: 'https://drive.google.com/drive/folders/1vVzCZbWLPxqSXHpg0zkpmgwx7kddOr-d', type: 'o' },
    { name: 'Introduction to Business Presentation', url: 'https://drive.google.com/drive/folders/19i7tX7Mhjoh6C6kb6NLaUgP1qFaqMm1n', type: 'p' },
    { name: 'Introduction to Business Procedures', url: 'https://drive.google.com/drive/folders/12v1_FXoAEztTWx3l6Ngx0QTYRqJsDhv1', type: 'o' },
    { name: 'Introduction to FBLA', url: 'https://drive.google.com/drive/folders/1QYyhRP9QImNgpegORgblhb5ol7qW8x9q', type: 'o' },
    { name: 'Introduction to Information Technology', url: 'https://drive.google.com/drive/folders/1nEo09oTODtjLDM17cB1SSSd16PEn0qjO', type: 'o' },
    { name: 'Introduction to Parliamentary Procedure', url: 'https://drive.google.com/drive/folders/16J_5rxkIMNAYbnlcTPRh0IpaabUCfMvZ', type: 'o' },
    { name: 'Introduction to Programming', url: 'https://drive.google.com/drive/folders/1Gjx_LllWwJmciGnT-Ha0SE30G-oYjN9b', type: 'p' },
    { name: 'Introduction to Public Speaking', url: 'https://drive.google.com/drive/folders/1iAHU4mjHcPpWhxJ1ZVEewoXjfKYi1sBr', type: 'p' },
    { name: 'Introduction to Supply Chain Management', url: 'https://drive.google.com/drive/folders/1viXE9ssYcRXiyXi0tqGc2cZFSipTbDV6', type: 'o' },
    { name: 'Job Interview', url: 'https://drive.google.com/drive/folders/15iYfi3io3lHXTBbf_wki8F5V6I7DZjim', type: 'p' },
    { name: 'Journalism', url: 'https://drive.google.com/drive/folders/1nmzMqC3SvH-tcJvVayMFMvpM1jijso4h', type: 'o' },
    { name: 'Local Chapter Annual Business Report', url: 'https://drive.google.com/drive/folders/1_WjpPeFZetaPAgUUsd9PwZx-zJ4CaTDS', type: 'c' },
    { name: 'Management Information Systems', url: 'https://drive.google.com/drive/folders/1EJ3nAokxMvYlk8bdFGC43mtj1jzrN7Cg', type: 'r' },
    { name: 'Marketing', url: 'https://drive.google.com/drive/folders/13RnlY-5_RjtN7F14vmm5_AGOjVes0YdK', type: 'r' },
    { name: 'Mobile Application Development', url: 'https://drive.google.com/drive/folders/1q1LLwN0nKqiT2XJ_0KXDrqqymkg2iXuh', type: 'p' },
    { name: 'Network Design', url: 'https://drive.google.com/drive/folders/1qmAInIbIj3Ktrhk_2EYsMunEfJT1HM_q', type: 'r' },
    { name: 'Networking & Infrastructure', url: 'https://drive.google.com/drive/folders/1xiKF19idEwOvhVZRaCPtsecFFwXsouEV', type: 'o' },
    { name: 'Organizational Leadership', url: 'https://drive.google.com/drive/folders/1qfmRDcv7Rm7_S72bNBMsUZHd72ZWAiGX', type: 'o' },
    { name: 'Parliamentary Procedure', url: 'https://drive.google.com/drive/folders/1kLrGCxo2ne1fjnaJiI2-XxGrQ4n6DJoH', type: 'r' },
    { name: 'Project Management', url: 'https://drive.google.com/drive/folders/1qn0HaUxjlFSGNjLYSFaQT8O8EN-M2n82', type: 'o' },
    { name: 'Public Service Announcement', url: 'https://drive.google.com/drive/folders/13tWn0x9xdJQOuR9hMnzDOmVhM1jZhlX2', type: 'p' },
    { name: 'Public Speaking', url: 'https://drive.google.com/drive/folders/1Hq5mpf6Mf2_9x2ZzqQ3n4wEHjStl3NQW', type: 'p' },
    { name: 'Retail Management', url: 'https://drive.google.com/drive/folders/1UQ7-V8r4b2oHzTSrhrGmdKFar_VJObFE', type: 'o' },
    { name: 'Sales Presentation', url: 'https://drive.google.com/drive/folders/173yGEsWcUHgv_90hq-MGu_dDMGSw30KD', type: 'p' },
    { name: 'Social Media Strategies', url: 'https://drive.google.com/drive/folders/1qCniC5IJcPW4Eqw8WbWtZ9CgceIefcq9', type: 'p' },
    { name: 'Sports & Entertainment Management', url: 'https://drive.google.com/drive/folders/1cVywuQP5ULMMSMlurG_i2pmZZNmZyjdn', type: 'r' },
    { name: 'Supply Chain Management', url: 'https://drive.google.com/drive/folders/1Zze02UJeKX3LsTQ1MZ2qmSuM71xhFxlh', type: 'p' },
    { name: 'Technology Support & Services', url: 'https://drive.google.com/drive/folders/1Ts8SMTjgsmSdsoJDh4yJWxhr6KJhKJ98', type: 'r' },
    { name: 'Visual Design', url: 'https://drive.google.com/drive/folders/11MGuiz2Zklz0MXzfISABz5kqGTCjN2e0', type: 'p' },
    { name: 'Website Coding & Development', url: 'https://drive.google.com/drive/folders/1duvSKU4E_zhfjo6T1GLi9FPNI_ExOgxT', type: 'p' },
    { name: 'Website Design', url: 'https://drive.google.com/drive/folders/1QXw0w2LCXqeXInHwguXPwgPa_YAW26fu', type: 'p' }
  ]

  const filteredEvents = events.filter((evt) =>
    evt.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  )

  return (
    <div>
      <section className="page-hero">
        <p className="page-hero-label">Urbana FBLA</p>
        <h1>Resources</h1>
        <p>Competitive Event Resources, FBLA Connect, and a Guide to the Website!</p>
      </section>

      <section className="resources-section">
        <div className="resources-wrap">
          <div className="tabs">
            <nav className="tabs-nav" role="tablist" aria-label="Resources tabs">
              <button type="button" className={`tab-btn ${active === 'events' ? 'active' : ''}`} onClick={() => setActive('events')} role="tab" aria-selected={active === 'events' ? 'true' : 'false'}>Competitive Events</button>
              <button type="button" className={`tab-btn ${active === 'connect' ? 'active' : ''}`} onClick={() => setActive('connect')} role="tab" aria-selected={active === 'connect' ? 'true' : 'false'}>FBLA Connect</button>
              <button type="button" className={`tab-btn ${active === 'guide' ? 'active' : ''}`} onClick={() => setActive('guide')} role="tab" aria-selected={active === 'guide' ? 'true' : 'false'}>Website Guide</button>
            </nav>

            <div className="tabs-content">
              {active === 'events' && (
                <div className="resources-events">
                  <h2 className="section-title">Competitive Events</h2>
                  <p className="section-intro">Click an event to open the Urbana FBLA resource folder on Google Drive.</p>

                  <div className="resources-search-wrap">
                    <input
                      type="text"
                      className="resources-search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search events..."
                      aria-label="Search competitive events"
                    />
                  </div>

                  <div className="events-grid">
                    {filteredEvents.map((evt) => (
                      <a key={evt.name} className="resource-card" href={evt.url || 'https://drive.google.com'} target="_blank" rel="noreferrer">
                        <div className="rc-body">
                          <h3 className="rc-title">{evt.name}</h3>
                          <hr className="rc-divider" />
                          <p className="rc-desc">{typeMessages[evt.type]}</p>
                        </div>
                      </a>
                    ))}
                  </div>

                  {filteredEvents.length === 0 && (
                    <p className="no-results">No events match your search.</p>
                  )}
                </div>
              )}

              {active === 'connect' && (
                <div className="resources-connect">
                  <h2 className="section-title">FBLA Connect</h2>
                  <p className="section-intro">Official FBLA community and announcements.</p>
                  <a className="btn btn-gold" href="https://connect.fbla.org/" target="_blank" rel="noreferrer">FBLA Connect</a>
                </div>
              )}

              {active === 'guide' && (
                <div className="resources-guide">
                  <h2 className="section-title">Website Guide</h2>
                  <p className="section-intro">Quick directory of the site and what each page contains.</p>
                  <ul className="site-list">
                    <li><a href="/">Home</a> — Overview and upcoming highlights.</li>
                    <li><a href="/events">Events</a> — Calendar and meeting/competition listings.</li>
                    <li><a href="/gallery">Gallery</a> — Photos from FBLA activities.</li>
                    <li><a href="/officers">Officers</a> — Current officer bios and contact info.</li>
                    <li><a href="/contact">Contact</a> — How to reach advisors and leadership.</li>
                    <li><a href="/thank-you">Thank You</a> — Acknowledgements and sponsors.</li>
                    <li><a href="/resources">Resources</a> — This page (event guides, FBLA Connect, site guide).</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
