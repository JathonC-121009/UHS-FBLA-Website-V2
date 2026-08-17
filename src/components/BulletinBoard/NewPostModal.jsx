import { useEffect, useState } from 'react'
import './Modal.css'
import './NewPostModal.css'

/**
 * "+ New Post" form. No name field — the author is attached by Bulletin.jsx's
 * onCreate handler (profile.name → Auth displayName → AUTHOR_FALLBACK), never
 * asked here.
 */
export default function NewPostModal({ onCreate, onClose }) {
  const [type, setType] = useState('photo') // 'photo' | 'question'
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const switchType = (next) => {
    setType(next)
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (type === 'photo') {
      if (!imageUrl.trim()) {
        setFormError('Paste an image URL to pin a photo.')
        return
      }
    } else if (!message.trim()) {
      setFormError('Write a question or thought to pin.')
      return
    }
    setBusy(true)
    try {
      await onCreate(
        type === 'photo'
          ? { type: 'photo', imageUrl: imageUrl.trim(), caption: caption.trim() || null }
          : { type: 'question', message: message.trim() },
      )
      onClose()
    } catch (err) {
      setFormError(err?.message || 'Could not create the post — try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bulletin-overlay" onMouseDown={onClose}>
      <div
        className="bulletin-modal npm-card"
        role="dialog"
        aria-modal="true"
        aria-label="New post"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="bulletin-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h3>Pin a New Post</h3>

        {formError && (
          <div className="npm-error" role="alert">
            <span>{formError}</span>
          </div>
        )}

        <form className="npm-form" onSubmit={handleSubmit}>
          <div className="npm-toggle" role="radiogroup" aria-label="Post type">
            <button
              type="button"
              className={type === 'photo' ? 'active' : ''}
              onClick={() => switchType('photo')}
              aria-pressed={type === 'photo'}
            >
              🖼️ Photo
            </button>
            <button
              type="button"
              className={type === 'question' ? 'active' : ''}
              onClick={() => switchType('question')}
              aria-pressed={type === 'question'}
            >
              💬 Question / Discussion
            </button>
          </div>

          {type === 'photo' ? (
            <>
              <div className="npm-group">
                <label htmlFor="npm-image">Image URL (paste a link)</label>
                <input
                  id="npm-image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://…"
                  autoFocus
                />
              </div>
              <div className="npm-group">
                <label htmlFor="npm-caption">Caption</label>
                <input
                  id="npm-caption"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Optional caption"
                />
              </div>
            </>
          ) : (
            <div className="npm-group">
              <label htmlFor="npm-message">Question / Discussion</label>
              <textarea
                id="npm-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask the chapter something…"
                autoFocus
              />
            </div>
          )}

          <button type="submit" className="btn btn-navy btn-block" disabled={busy}>
            {busy ? 'Pinning…' : 'Pin It'}
          </button>
        </form>
      </div>
    </div>
  )
}