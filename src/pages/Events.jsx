import { useState } from 'react'

import './Events.css'

import useCalendar from '../hooks/useCalendar'

export const meta = {
  label: 'Events',
  order: 20,
  title: 'Urbana FBLA — Events',
}

function getDaysInMonth(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate()
}

function getFirstDayOfMonth(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  ).getDay()
}

function formatMonth(date) {
  return date.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

function getEventCategory(title) {
  const match = title.match(
    /^\[(Meeting|Competition|Workshop|Social|Deadline)\]\s*/i,
  )

  if (!match) {
    return 'meeting'
  }

  return match[1].toLowerCase()
}

function getCleanEventTitle(title) {
  return title
    .replace(
      /^\[(Meeting|Competition|Workshop|Social|Deadline)\]\s*/i,
      '',
    )
    .trim()
}

function formatEventTime(event) {
  if (event.isAllDay) {
    return 'All day'
  }

  const startDate = new Date(event.start)

  if (Number.isNaN(startDate.getTime())) {
    return 'Time unavailable'
  }

  const timeZone =
    event.timeZone || 'America/New_York'

  const startTime = startDate.toLocaleTimeString(
    'en-US',
    {
      hour: 'numeric',
      minute: '2-digit',
      timeZone,
    },
  )

  const category = getEventCategory(event.title)

  // Deadlines only display the start time.
  if (category === 'deadline') {
    return startTime
  }

  if (!event.end) {
    return startTime
  }

  const endDate = new Date(event.end)

  if (Number.isNaN(endDate.getTime())) {
    return startTime
  }

  const endTime = endDate.toLocaleTimeString(
    'en-US',
    {
      hour: 'numeric',
      minute: '2-digit',
      timeZone,
    },
  )

  return `${startTime} – ${endTime}`
}

export default function Events() {
  const [currentDate, setCurrentDate] =
    useState(new Date())

  const [animate, setAnimate] = useState(false)

  const [expandedDays, setExpandedDays] =
    useState({})

  const [selectedEvent, setSelectedEvent] =
    useState(null)

  const {
    events,
    loading,
    error,
  } = useCalendar()

  const today = new Date()

  const changeMonth = (newDate) => {
    setAnimate(false)
    setExpandedDays({})
    setSelectedEvent(null)

    setTimeout(() => {
      setCurrentDate(newDate)
      setAnimate(true)
    }, 50)
  }

  const previousMonth = () => {
    changeMonth(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      ),
    )
  }

  const nextMonth = () => {
    changeMonth(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
      ),
    )
  }

  const goToday = () => {
    changeMonth(new Date())
  }

  const toggleExpanded = (day) => {
    setExpandedDays((previous) => ({
      ...previous,
      [day]: !previous[day],
    }))
  }

  const openEvent = (event) => {
    setSelectedEvent(event)
  }

  const closeEvent = () => {
    setSelectedEvent(null)
  }

  const daysInMonth = getDaysInMonth(currentDate)

  const firstDay = getFirstDayOfMonth(currentDate)

  const calendarDays = []

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Only create enough rows to contain the actual month.
  const totalCells =
    Math.ceil(calendarDays.length / 7) * 7

  while (calendarDays.length < totalCells) {
    calendarDays.push(null)
  }

  const getEventsForDay = (day) => {
    if (!day) return []

    return events.filter((event) => {
      let eventYear, eventMonth, eventDay

      if (event.isAllDay) {
        const [y, m, d] = event.start.split('-').map(Number)
        eventYear = y
        eventMonth = m - 1
        eventDay = d
      } else {
        const eventDate = new Date(event.start)
        eventYear = eventDate.getFullYear()
        eventMonth = eventDate.getMonth()
        eventDay = eventDate.getDate()
      }

      return (
        eventDay === day &&
        eventMonth === currentDate.getMonth() &&
        eventYear === currentDate.getFullYear()
      )
    })
  }

  const isToday = (day) => {
    return (
      day &&
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() ===
        currentDate.getFullYear()
    )
  }

  return (
    <>
      <section className="page-hero">
        <p className="page-hero-label">
          Stay in the Know
        </p>

        <h1>
          FBLA <span>Calendar</span>
        </h1>

        <p>
          Meetings, competitions, and chapter
          activities.
        </p>
      </section>

      <section className="events-section">
        <div className="events-wrap">
          <div className="calendar-card">
            <div className="calendar-header">
              <button
                type="button"
                onClick={previousMonth}
              >
                ← Previous
              </button>

              <div className="calendar-title">
                {formatMonth(currentDate)}
              </div>

              <div className="calendar-controls">
                <button
                  type="button"
                  onClick={goToday}
                >
                  Today
                </button>

                <button
                  type="button"
                  onClick={nextMonth}
                >
                  Next →
                </button>
              </div>
            </div>

            {loading && (
              <div className="calendar-message">
                Loading events...
              </div>
            )}

            {error && (
              <div className="calendar-message error">
                Unable to load calendar events.
              </div>
            )}

            {!loading && !error && (
              <div
                className={`calendar-body ${
                  animate
                    ? 'calendar-enter'
                    : ''
                }`}
              >
                <div className="calendar-weekdays">
                  {[
                    'Sun',
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                  ].map((day) => (
                    <div key={day}>
                      {day}
                    </div>
                  ))}
                </div>

                <div className="calendar-grid">
                  {calendarDays.map(
                    (day, index) => {
                      const dayEvents =
                        getEventsForDay(day)

                      const isExpanded =
                        expandedDays[day]

                      const visibleEvents =
                        isExpanded
                          ? dayEvents
                          : dayEvents.slice(0, 2)

                      const hiddenCount =
                        dayEvents.length - 2

                      return (
                        <div
                          key={index}
                          className={[
                            'calendar-day',
                            isToday(day)
                              ? 'today'
                              : '',
                            !day
                              ? 'empty'
                              : '',
                            isExpanded
                              ? 'expanded'
                              : '',
                          ].join(' ')}
                        >
                          {day && (
                            <div className="day-number">
                              {day}

                              {isToday(day) && (
                                <span className="today-label">
                                  Today
                                </span>
                              )}
                            </div>
                          )}

                          {visibleEvents.map(
                            (event) => {
                              const category =
                                getEventCategory(
                                  event.title,
                                )

                              const cleanTitle =
                                getCleanEventTitle(
                                  event.title,
                                )

                              return (
                                <button
                                  key={event.id}
                                  type="button"
                                  className={`calendar-event ${category}`}
                                  title={
                                    cleanTitle
                                  }
                                  onClick={() =>
                                    openEvent(
                                      event,
                                    )
                                  }
                                >
                                  {cleanTitle}
                                </button>
                              )
                            },
                          )}

                          {dayEvents.length >
                            2 && (
                            <button
                              type="button"
                              className="calendar-more"
                              onClick={() =>
                                toggleExpanded(
                                  day,
                                )
                              }
                            >
                              {isExpanded
                                ? '− Show less'
                                : `+ ${hiddenCount} more`}
                            </button>
                          )}
                        </div>
                      )
                    },
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="calendar-legend">
            <div>
              <span className="legend meeting" />
              Meetings
            </div>

            <div>
              <span className="legend competition" />
              Competitions
            </div>

            <div>
              <span className="legend workshop" />
              Workshops
            </div>

            <div>
              <span className="legend social" />
              Social
            </div>

            <div>
              <span className="legend deadline" />
              Deadlines
            </div>
          </div>
        </div>
      </section>

      {selectedEvent && (
        <div
          className="event-modal-backdrop"
          onClick={closeEvent}
        >
          <div
            className={`event-detail-card ${getEventCategory(
              selectedEvent.title,
            )}`}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="event-detail-close"
              onClick={closeEvent}
              aria-label="Close event details"
            >
              ×
            </button>

            <div
              className={`event-detail-category ${getEventCategory(
                selectedEvent.title,
              )}`}
            >
              {getEventCategory(
                selectedEvent.title,
              )}
            </div>

            <h2>
              {getCleanEventTitle(
                selectedEvent.title,
              )}
            </h2>

            <div className="event-detail-info">
              <div className="event-detail-row">
                <span className="event-detail-icon">
                  🕒
                </span>

                <div>
                  <strong>
                    {getEventCategory(
                      selectedEvent.title,
                    ) === 'deadline'
                      ? 'Due'
                      : 'Time'}
                  </strong>

                  <p>
                    {formatEventTime(
                      selectedEvent,
                    )}
                  </p>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="event-detail-row">
                  <span className="event-detail-icon">
                    📍
                  </span>

                  <div>
                    <strong>Location</strong>

                    <p>
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>
              )}

              {selectedEvent.description && (
                <div className="event-detail-description">
                  <strong>Description</strong>

                  <p>
                    {selectedEvent.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}