import { useEffect, useMemo, useRef, useState } from 'react'
import Masthead from '../components/Masthead.jsx'
import Icon from '../components/Icon.jsx'
import Portal from '../components/Portal.jsx'
import useCalendar from '../hooks/useCalendar'
import { sharedExpand } from '../hooks/useMotion.js'
import './Events.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Events',
  order: 20,
  title: 'Urbana FBLA, Calendar',
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CATEGORIES = [
  { key: 'meeting', label: 'Meetings' },
  { key: 'competition', label: 'Competitions' },
  { key: 'workshop', label: 'Workshops' },
  { key: 'social', label: 'Social' },
  { key: 'deadline', label: 'Deadlines' },
]

const CATEGORY_TAG = /^\[(Meeting|Competition|Workshop|Social|Deadline)\]\s*/i

/* --- Calendar maths ------------------------------------------------------- */

const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
const firstWeekday = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()
const formatMonth = (date) => date.toLocaleString('default', { month: 'long', year: 'numeric' })

/* --- Event helpers -------------------------------------------------------- */

// Titles arrive from Google Calendar prefixed like "[Meeting] Officer sync".
function categoryOf(title) {
  const match = title.match(CATEGORY_TAG)
  return match ? match[1].toLowerCase() : 'meeting'
}

function cleanTitle(title) {
  return title.replace(CATEGORY_TAG, '').trim()
}

function formatEventTime(event) {
  if (event.isAllDay) return 'All day'

  const start = new Date(event.start)
  if (Number.isNaN(start.getTime())) return 'Time unavailable'

  const timeZone = event.timeZone || 'America/New_York'
  const options = { hour: 'numeric', minute: '2-digit', timeZone }
  const startTime = start.toLocaleTimeString('en-US', options)

  // A deadline has a moment, not a span.
  if (categoryOf(event.title) === 'deadline' || !event.end) return startTime

  const end = new Date(event.end)
  if (Number.isNaN(end.getTime())) return startTime

  return `${startTime} to ${end.toLocaleTimeString('en-US', options)}`
}

// Both shapes Google returns: a date-only string for all-day events, and a
// full timestamp for everything else.
function dayKeyOf(event) {
  if (event.isAllDay) {
    const [year, month, day] = event.start.split('-').map(Number)
    return `${year}-${month - 1}-${day}`
  }
  const date = new Date(event.start)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export default function Events() {
  const [cursor, setCursor] = useState(() => new Date())
  const [direction, setDirection] = useState(0)
  const [expandedDays, setExpandedDays] = useState({})
  const [selected, setSelected] = useState(null)
  const originRect = useRef(null)

  const { events, loading, error } = useCalendar()
  const today = new Date()

  const goToMonth = (date, dir) => {
    setDirection(dir)
    setExpandedDays({})
    setSelected(null)
    setCursor(date)
  }

  const shiftMonth = (delta) =>
    goToMonth(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1), delta)

  // One pass over the feed per month instead of a filter per calendar cell.
  const eventsByDay = useMemo(() => {
    const map = new Map()
    events.forEach((event) => {
      const key = dayKeyOf(event)
      const bucket = map.get(key)
      if (bucket) bucket.push(event)
      else map.set(key, [event])
    })
    return map
  }, [events])

  const cells = useMemo(() => {
    const total = daysInMonth(cursor)
    const lead = firstWeekday(cursor)
    const list = Array.from({ length: lead }, () => null)
    for (let day = 1; day <= total; day += 1) list.push(day)
    while (list.length % 7 !== 0) list.push(null)
    return list
  }, [cursor])

  const monthCount = useMemo(
    () =>
      cells.reduce((sum, day) => {
        if (!day) return sum
        return sum + (eventsByDay.get(`${cursor.getFullYear()}-${cursor.getMonth()}-${day}`)?.length || 0)
      }, 0),
    [cells, eventsByDay, cursor],
  )

  const dayEvents = (day) =>
    (day && eventsByDay.get(`${cursor.getFullYear()}-${cursor.getMonth()}-${day}`)) || []

  const isToday = (day) =>
    Boolean(day) &&
    today.getDate() === day &&
    today.getMonth() === cursor.getMonth() &&
    today.getFullYear() === cursor.getFullYear()

  const openEvent = (event, element) => {
    originRect.current = element?.getBoundingClientRect() ?? null
    setSelected(event)
  }

  // Escape closes the detail card, and the page behind it stays put.
  useEffect(() => {
    if (!selected) return
    const onKey = (e) => e.key === 'Escape' && setSelected(null)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [selected])

  return (
    <>
      <Masthead
        eyebrow="Chapter calendar"
        title={<>What is <em>coming up</em></>}
        lede="Meetings, competitions, workshops, and deadlines. This updates automatically from the chapter's Google Calendar."
        meta={[
          { label: 'Viewing', value: formatMonth(cursor) },
          { label: 'Events this month', value: loading ? 'Loading' : String(monthCount) },
        ]}
      />

      <section className="events-section">
        <div className="events-wrap">
          <div className="calendar" data-reveal="fade">
            <header className="calendar-bar">
              <button type="button" className="month-btn press" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                <Icon name="chevronLeft" size={16} />
              </button>

              <h2 className="calendar-month" key={formatMonth(cursor)}>
                {formatMonth(cursor)}
              </h2>

              <div className="calendar-actions">
                <button type="button" className="today-btn press" onClick={() => goToMonth(new Date(), 0)}>
                  Today
                </button>
                <button type="button" className="month-btn press" onClick={() => shiftMonth(1)} aria-label="Next month">
                  <Icon name="chevronRight" size={16} />
                </button>
              </div>
            </header>

            {loading && <p className="calendar-state">Loading the calendar</p>}
            {!loading && error && <p className="calendar-state calendar-state--error">The calendar could not be reached. Try again shortly.</p>}

            {!loading && !error && (
              <div
                className="calendar-body"
                key={`${cursor.getFullYear()}-${cursor.getMonth()}`}
                data-direction={direction >= 0 ? 'forward' : 'back'}
              >
                <div className="weekdays">
                  {WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="days">
                  {cells.map((day, index) => {
                    const all = dayEvents(day)
                    const expanded = Boolean(expandedDays[day])
                    const shown = expanded ? all : all.slice(0, 2)

                    return (
                      <div
                        key={index}
                        className={`day${day ? '' : ' is-empty'}${isToday(day) ? ' is-today' : ''}`}
                        style={{ '--cell': index }}
                      >
                        {day && (
                          <span className="day-number">
                            {String(day).padStart(2, '0')}
                            {isToday(day) && <span className="day-today">Today</span>}
                          </span>
                        )}

                        {shown.map((event) => {
                          const category = categoryOf(event.title)
                          return (
                            <button
                              key={event.id}
                              type="button"
                              className={`chip chip--${category}`}
                              title={cleanTitle(event.title)}
                              onClick={(e) => openEvent(event, e.currentTarget)}
                            >
                              {cleanTitle(event.title)}
                            </button>
                          )
                        })}

                        {all.length > 2 && (
                          <button
                            type="button"
                            className="day-more"
                            onClick={() => setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }))}
                          >
                            {expanded ? 'Show less' : `${all.length - 2} more`}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <ul className="legend" data-reveal="fade">
            {CATEGORIES.map((category) => (
              <li key={category.key}>
                <span className={`legend-key legend-key--${category.key}`} />
                {category.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {selected && (
        <Portal>
        <div className="event-overlay" onClick={() => setSelected(null)}>
          <article
            className={`event-detail event-detail--${categoryOf(selected.title)}`}
            role="dialog"
            aria-modal="true"
            aria-label={cleanTitle(selected.title)}
            onClick={(e) => e.stopPropagation()}
            ref={(node) => sharedExpand(node, originRect.current)}
          >
            <button type="button" className="event-close press" onClick={() => setSelected(null)} aria-label="Close">
              <Icon name="close" size={16} />
            </button>

            <p className="event-category">{categoryOf(selected.title)}</p>
            <h2 className="event-title">{cleanTitle(selected.title)}</h2>

            <dl className="event-meta">
              <div>
                <dt><Icon name="clock" size={15} /> {categoryOf(selected.title) === 'deadline' ? 'Due' : 'Time'}</dt>
                <dd>{formatEventTime(selected)}</dd>
              </div>

              {selected.location && (
                <div>
                  <dt><Icon name="pin" size={15} /> Location</dt>
                  <dd>{selected.location}</dd>
                </div>
              )}

              {selected.description && (
                <div>
                  <dt><Icon name="message" size={15} /> Details</dt>
                  <dd className="event-description">{selected.description}</dd>
                </div>
              )}
            </dl>
          </article>
        </div>
        </Portal>
      )}
    </>
  )
}
