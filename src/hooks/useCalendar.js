import { useState, useEffect, useCallback } from 'react'
import useAuth from './useAuth.js'
import { getUpcomingEvents } from '../services/calendarService.js'

export default function useCalendar() {
  const { accessToken } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const data = await getUpcomingEvents(accessToken)
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { events, loading, error, refetch: fetch }
}