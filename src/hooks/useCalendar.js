import { useCallback, useEffect, useRef, useState } from 'react'
import { getUpcomingEvents } from '../services/calendarService.js'

/**
 * Events for the month being viewed.
 *
 * The feed is fetched in a wide window either side of that month rather than
 * one month at a time, so paging back and forth through the calendar never
 * waits on the network. A new request only goes out when the cursor walks off
 * the end of what is already loaded.
 */

// Months kept loaded on each side of the month in view.
const PAD_MONTHS = 12

// Months as a single number, so a range is two comparisons.
const monthIndex = (date) => date.getFullYear() * 12 + date.getMonth()
const monthStart = (index) => new Date(Math.floor(index / 12), index % 12, 1)

export default function useCalendar(cursor) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // The window currently held in `events`, and a token so a slow response
  // from an abandoned month cannot overwrite a newer one.
  const range = useRef(null)
  const request = useRef(0)

  const viewed =
    cursor instanceof Date && !Number.isNaN(cursor.getTime()) ? cursor : new Date()
  const viewedMonth = monthIndex(viewed)

  const load = useCallback(async (centre) => {
    const from = centre - PAD_MONTHS
    const to = centre + PAD_MONTHS
    const token = (request.current += 1)

    range.current = { from, to }
    setLoading(true)
    setError(null)

    try {
      const data = await getUpcomingEvents({
        timeMin: monthStart(from),
        // Exclusive: the first instant of the month after the last one shown.
        timeMax: monthStart(to + 1),
      })
      if (token !== request.current) return
      setEvents(data)
    } catch (err) {
      if (token !== request.current) return
      // Nothing is loaded, so the next month change should try again.
      range.current = null
      setEvents([])
      setError(err.message)
    } finally {
      if (token === request.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const loaded = range.current
    if (loaded && viewedMonth >= loaded.from && viewedMonth <= loaded.to) return
    load(viewedMonth)
  }, [viewedMonth, load])

  return { events, loading, error, refetch: () => load(viewedMonth) }
}
