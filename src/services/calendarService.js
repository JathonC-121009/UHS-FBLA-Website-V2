/**
 * Get upcoming events from the Google Calendar API.
 *
 * This is the primary event source — Google Calendar first, Firestore cache
 * second (cacheEventsToFirestore is a write-through cache, not the read path).
 */

function normalizeEvent(item) {
  return {
    id: item.id,
    title: item.summary || '(no title)',
    start: item.start?.dateTime || item.start?.date,
    end: item.end?.dateTime || item.end?.date,
    description: item.description || '',
    location: item.location || '',
  }
}

const CALENDAR_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID

/**
 * Fetches upcoming events from the public UHS FBLA Google Calendar using a
 * restricted API key (no per-user OAuth / access token required).
 * @param {object} options - { timeMin, timeMax } Date objects for the range
 * @returns {Promise<Array>} Normalized event objects
 */
export async function getUpcomingEvents(options = {}) {
  const timeMin = options.timeMin || new Date()
  const timeMax = options.timeMax || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

  const params = new URLSearchParams({
    key: CALENDAR_API_KEY,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  })

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`,
  )

  if (!res.ok) {
    throw new Error(`Google Calendar API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  return (data.items || []).map(normalizeEvent)
}

/**
 * Optional write-through cache: stores events into Firestore for offline/backup.
 * Implement when needed — stubbed with a TODO for now.
 */
// TODO: implement write-through cache — store fetched events into a
// Firestore `calendarEvents` collection so the Calendar feature can
// read from Firestore as a backup cache when the live API is unavailable.