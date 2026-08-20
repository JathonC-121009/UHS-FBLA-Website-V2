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

  const events = [
    { name: 'Broadcast Journalism', url: 'https://drive.google.com' },
    { name: 'Digital Animation', url: 'https://drive.google.com' },
    { name: 'Digital Video Production', url: 'https://drive.google.com' },
    { name: 'Graphic Design', url: 'https://drive.google.com' },
    { name: 'Public Service Announcement', url: 'https://drive.google.com' },
    { name: 'Visual Design', url: 'https://drive.google.com' },
    { name: 'Website Design', url: 'https://drive.google.com' },
    { name: 'Career Portfolio', url: 'https://drive.google.com' },
    { name: 'Job Interview', url: 'https://drive.google.com' },
    { name: 'Coding & Programming', url: 'https://drive.google.com' },
    { name: 'Computer Game & Simulation Programming', url: 'https://drive.google.com' },
    { name: 'Data Analysis', url: 'https://drive.google.com' },
    { name: 'Introduction to Programming', url: 'https://drive.google.com' },
    { name: 'Management Information Systems', url: 'https://drive.google.com' },
    { name: 'Mobile Application Development', url: 'https://drive.google.com' },
    { name: 'Network Design', url: 'https://drive.google.com' },
    { name: 'Technology Support & Services', url: 'https://drive.google.com' },
    { name: 'Website Coding & Development', url: 'https://drive.google.com' },
    { name: 'Future Business Educator', url: 'https://drive.google.com' },
    { name: 'Banking & Financial Systems', url: 'https://drive.google.com' },
    { name: 'Financial Planning', url: 'https://drive.google.com' },
    { name: 'Financial Statement Analysis', url: 'https://drive.google.com' },
    { name: 'Community Service Project', url: 'https://drive.google.com' },
    { name: 'Event Planning', url: 'https://drive.google.com' },
    { name: 'Hospitality & Event Management', url: 'https://drive.google.com' },
    { name: 'Sports & Entertainment Management', url: 'https://drive.google.com' },
    { name: 'Business Ethics', url: 'https://drive.google.com' },
    { name: 'Business Management', url: 'https://drive.google.com' },
    { name: 'Business Plan', url: 'https://drive.google.com' },
    { name: 'Entrepreneurship', url: 'https://drive.google.com' },
    { name: 'Future Business Leader', url: 'https://drive.google.com' },
    { name: 'International Business', url: 'https://drive.google.com' },
    { name: 'Local Chapter Annual Business Report', url: 'https://drive.google.com' },
    { name: 'Customer Service', url: 'https://drive.google.com' },
    { name: 'Impromptu Speaking', url: 'https://drive.google.com' },
    { name: 'Introduction to Business Presentation', url: 'https://drive.google.com' },
    { name: 'Introduction to Public Speaking', url: 'https://drive.google.com' },
    { name: 'Marketing', url: 'https://drive.google.com' },
    { name: 'Public Speaking', url: 'https://drive.google.com' },
    { name: 'Sales Presentation', url: 'https://drive.google.com' },
    { name: 'Social Media Strategies', url: 'https://drive.google.com' },
    { name: 'Parliamentary Procedure', url: 'https://drive.google.com' },
    { name: 'Supply Chain Management', url: 'https://drive.google.com' },
    { name: 'Computer Applications', url: 'https://drive.google.com' }
  ]

  const filteredEvents = events.filter((evt) =>
    evt.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  )

  return (
    <div>
      <section className="page-hero">
        <p className="page-hero-label">Resources</p>
        <h1>Resources</h1>
        <p>Helpful links, competitive event resources, and a short website guide.</p>
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
                  <p className="section-intro">Click an event to open the temporary resource folder on Google Drive.</p>

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
                          <p className="rc-desc">Resources and example files for {evt.name} (Google Drive placeholder).</p>
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
                  <a className="btn btn-gold" href="https://drive.google.com" target="_blank" rel="noreferrer">FBLA Connect</a>
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
