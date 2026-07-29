import { useMemo, useState } from 'react'
import './Calendar.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Calendar',
  order: 30,
  title: 'Urbana FBLA — Calendar',
}

/* ---------------------------------------------------------------------------
   Chapter events.

   Dates are plain 'YYYY-MM-DD' strings so they are never shifted by a time
   zone. `end` is optional and inclusive — use it for multi-day events.
   `type` picks the badge color and must be one of the keys in TYPE_LABEL.

   To add an event, add an object to this list. Nothing else needs to change.
--------------------------------------------------------------------------- */
const EVENTS = [
  {
    title: 'National Leadership Conference',
    type: 'competition',
    start: '2026-06-29',
    end: '2026-07-02',
    time: 'Jun 29 – Jul 2',
    location: 'Henry B. Gonzalez Convention Center, San Antonio, TX',
    description:
      'Top competitors from state conferences advance to NLC to compete at the national level.',
  },
]

// Events that are confirmed but do not have a date yet.
const UNSCHEDULED = [
  {
    title: 'End-of-Year Party',
    type: 'social',
    location: 'Urbana District Park',
    description: 'Celebrate the year with members, food, and fun. More details coming soon.',
  },
]

const TYPE_LABEL = {
  meeting: 'Meeting',
  competition: 'Competition',
  community: 'Community',
  social: 'Social',
  deadline: 'Deadline',
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const pad = (n) => String(n).padStart(2, '0')
const iso = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`
const lastDay = (event) => event.end || event.start
const eventsOn = (dateKey) =>
  EVENTS.filter((event) => dateKey >= event.start && dateKey <= lastDay(event))

function EventCard({ event }) {
  return (
    <article className="cal-event">
      <span className={`cal-badge cal-t-${event.type}`}>
        {TYPE_LABEL[event.type] ?? event.type}
      </span>
      <h3 className="cal-event-title">{event.title}</h3>
      {event.time && <p className="cal-event-detail">🕓 {event.time}</p>}
      {event.location && <p className="cal-event-detail">📍 {event.location}</p>}
      {event.description && <p className="cal-event-desc">{event.description}</p>}
    </article>
  )
}

export default function Calendar() {
  const now = new Date()
  const todayKey = iso(now.getFullYear(), now.getMonth(), now.getDate())

  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [selected, setSelected] = useState(null)

  const { year, month } = cursor

  // Day cells for the visible month, padded with blanks so the 1st lands on
  // the right weekday and the final week is complete.
  const cells = useMemo(() => {
    const leading = new Date(year, month, 1).getDay()
    const dayCount = new Date(year, month + 1, 0).getDate()
    const out = Array.from({ length: leading }, () => null)
    for (let day = 1; day <= dayCount; day += 1) out.push(day)
    while (out.length % 7 !== 0) out.push(null)
    return out
  }, [year, month])

  // Events that overlap the visible month at all, in date order.
  const monthEvents = useMemo(() => {
    const start = iso(year, month, 1)
    const end = iso(year, month, new Date(year, month + 1, 0).getDate())
    return EVENTS
      .filter((event) => event.start <= end && lastDay(event) >= start)
      .sort((a, b) => a.start.localeCompare(b.start))
  }, [year, month])

  const shiftMonth = (delta) => {
    setSelected(null)
    setCursor(({ year: y, month: m }) => {
      const next = new Date(y, m + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const goToday = () => {
    setSelected(null)
    setCursor({ year: now.getFullYear(), month: now.getMonth() })
  }

  const selectedEvents = selected ? eventsOn(selected) : []

  return (
    <>
      <div className="page-hero">
        <p className="page-hero-label">Plan Ahead</p>
        <h1>Chapter <span>Calendar</span></h1>
        <p>Meetings, competitions, and deadlines at a glance</p>
      </div>

      <section className="cal-section">
        <div className="cal-wrap">
          <div className="cal-card fi">
            <header className="cal-toolbar">
              <button className="cal-nav" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
              <h2 className="cal-month">{MONTHS[month]} <span>{year}</span></h2>
              <button className="cal-nav" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
              <button className="cal-today-btn" onClick={goToday}>Today</button>
            </header>

            <div className="cal-grid" role="grid">
              {WEEKDAYS.map((weekday) => (
                <div className="cal-weekday" key={weekday}>{weekday}</div>
              ))}

              {cells.map((day, i) => {
                if (day === null) return <div className="cal-day cal-empty" key={`blank-${i}`} />

                const key = iso(year, month, day)
                const dayEvents = eventsOn(key)
                const classes = [
                  'cal-day',
                  dayEvents.length ? 'has-events' : '',
                  key === todayKey ? 'is-today' : '',
                  key === selected ? 'is-selected' : '',
                ].filter(Boolean).join(' ')

                return (
                  <button
                    className={classes}
                    key={key}
                    onClick={() => setSelected((prev) => (prev === key ? null : key))}
                  >
                    <span className="cal-daynum">{day}</span>
                    <span className="cal-dots">
                      {dayEvents.map((event) => (
                        <span className={`cal-dot cal-t-${event.type}`} key={event.title} />
                      ))}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="cal-legend">
              {Object.entries(TYPE_LABEL).map(([type, label]) => (
                <span className="cal-legend-item" key={type}>
                  <span className={`cal-dot cal-t-${type}`} /> {label}
                </span>
              ))}
            </div>
          </div>

          <aside className="cal-side fi">
            {selected ? (
              <>
                <p className="section-label">{selected}</p>
                <h2 className="section-title">Selected Day</h2>
                <div className="divider"></div>
                {selectedEvents.length ? (
                  selectedEvents.map((event) => <EventCard event={event} key={event.title} />)
                ) : (
                  <p className="cal-empty-note">Nothing scheduled on this day.</p>
                )}
              </>
            ) : (
              <>
                <p className="section-label">{MONTHS[month]} {year}</p>
                <h2 className="section-title">This Month</h2>
                <div className="divider"></div>
                {monthEvents.length ? (
                  monthEvents.map((event) => <EventCard event={event} key={event.title} />)
                ) : (
                  <p className="cal-empty-note">No events scheduled this month yet.</p>
                )}
              </>
            )}

            {UNSCHEDULED.length > 0 && (
              <div className="cal-tbd">
                <p className="section-label">Date TBD</p>
                {UNSCHEDULED.map((event) => <EventCard event={event} key={event.title} />)}
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
