import './Events.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Events',
  order: 20,
  title: 'Urbana FBLA — Events',
}

export default function Events() {
  return (
    <>
      <div className="page-hero">
        <p className="page-hero-label">Stay in the Know</p>
        <h1>Upcoming <span>Events</span></h1>
        <p>Meetings, competitions, and chapter activities</p>
      </div>

      <section className="events-section">
        <div className="events-wrap">
          <div className="events-grid">
            <div className="event-card fi">
              <div className="event-header">
                <div className="event-date">
                  <div className="event-month">May</div>
                  <div className="event-day">TBD</div>
                </div>
                <div className="event-hinfo">
                  <span className="event-badge t-social">Social</span>
                  <div className="event-htitle">End-of-Year Party</div>
                </div>
              </div>
              <div className="event-body">
                <div className="event-detail">📍 Urbana District Park</div>
                <div className="event-detail">🕓 Date TBD</div>
                <div className="event-desc">Celebrate the year with members, food, and fun. More details coming soon.</div>
              </div>
            </div>

            <div className="event-card fi">
              <div className="event-header">
                <div className="event-date">
                  <div className="event-month">Jun</div>
                  <div className="event-day">29</div>
                </div>
                <div className="event-hinfo">
                  <span className="event-badge t-competition">Competition</span>
                  <div className="event-htitle">National Leadership Conference</div>
                </div>
              </div>
              <div className="event-body">
                <div className="event-detail">📍 Henry B. Gonzalez Convention Center, San Antonio, TX</div>
                <div className="event-detail">🕓 Jun 29 – Jul 2</div>
                <div className="event-desc">Top competitors from state conferences advance to NLC to compete at the national level.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
