import { useState, useCallback } from 'react'
import { addContactMessage } from '../services/contactService.js'

const MAX = { name: 80, email: 200, message: 2000 }

/**
 * Client-side checks that mirror the limits in firestore.rules, so a user gets
 * a readable message instead of a permission-denied error. Returns an error
 * string, or null when the form is good to send.
 */
function validate({ firstName, lastName, email, subject, message }) {
  if (!firstName?.trim()) return 'Please enter your first name.'
  if (!lastName?.trim()) return 'Please enter your last name.'
  if (!email?.trim()) return 'Please enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.'
  if (!subject) return 'Please choose a subject.'
  if (!message?.trim()) return 'Please write a message.'

  if (firstName.trim().length > MAX.name || lastName.trim().length > MAX.name) {
    return `Names must be under ${MAX.name} characters.`
  }
  if (email.trim().length > MAX.email) return 'That email address is too long.'
  if (message.trim().length > MAX.message) {
    return `Message must be under ${MAX.message} characters.`
  }
  return null
}

/**
 * Contact form submission state. `send` returns true only when the message
 * actually reached Firestore, so the caller can navigate to /thank-you on
 * success and keep the user on the form (with an error) on failure.
 */
export default function useContact() {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const send = useCallback(async (form) => {
    const invalid = validate(form)
    if (invalid) {
      setError(invalid)
      return false
    }

    setSending(true)
    setError(null)
    try {
      await addContactMessage(form)
      return true
    } catch (err) {
      setError(
        err?.code === 'permission-denied'
          ? "We couldn't send your message right now. Please email us at uhsfbla2@gmail.com."
          : 'Something went wrong sending your message. Please try again.',
      )
      return false
    } finally {
      setSending(false)
    }
  }, [])

  return { send, sending, error, clearError: () => setError(null) }
}
