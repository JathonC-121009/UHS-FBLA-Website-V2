/**
 * Get upcoming events from the Google Calendar API.
 *
 * This is the primary event source — Google Calendar first, Firestore cache
 * second (cacheEventsToFirestore is a write-through cache, not the read path).
 */

function parseAllDayDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatAllDayDate(dateStr) {
  if (!dateStr) return null

  const date = parseAllDayDate(dateStr)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatTime(dateTimeStr, timeZone) {
  const date = new Date(dateTimeStr)

  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  })
}

function normalizeEvent(item) {
  const isAllDay = Boolean(
    item.start?.date && !item.start?.dateTime,
  )

  const start = isAllDay
    ? formatAllDayDate(item.start.date)
    : item.start?.dateTime || item.start?.date

  const end = isAllDay
    ? formatAllDayDate(item.end?.date)
    : item.end?.dateTime || item.end?.date

  const timeZone = isAllDay
    ? null
    : item.start?.timeZone || 'America/New_York'

  return {
    id: item.id,
    title: item.summary || '(no title)',

    start,
    end,

    // Start time only.
    time: isAllDay ? null : formatTime(start, timeZone),

    // Keep the timezone so Events.jsx can format the end time correctly.
    timeZone,

    description: item.description || '',
    location: item.location || '',

    isAllDay,
  }
}

const CALENDAR_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID

/**
 * Fetches upcoming events from the public UHS FBLA Google Calendar.
 *
 * @param {object} options - { timeMin, timeMax } Date objects for the range
 * @returns {Promise<Array>} Normalized event objects
 */
export async function getUpcomingEvents(options = {}) {
  const timeMin =
    options.timeMin || new Date()

  const timeMax =
    options.timeMax ||
    new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000,
    )

  const params = new URLSearchParams({
    key: CALENDAR_API_KEY,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  })

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID,
    )}/events?${params}`,
  )

  if (!res.ok) {
    throw new Error(
      `Google Calendar API error: ${res.status} ${res.statusText}`,
    )
  }

  const data = await res.json()

  return (data.items || []).map(normalizeEvent)
}

/**
 * Optional write-through cache.
 *
 * TODO: implement Firestore cache if needed.
 */