import { useEffect, useState } from 'react'
import Icon from '../Icon.jsx'
import Portal from '../Portal.jsx'
import './Modal.css'
import './NewPostModal.css'

/**
 * The new post form. There is no name field: Bulletin.jsx attaches the author
 * in its onCreate handler (profile display name, then Auth display name, then
 * the shared fallback), so it is never asked for here.
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
        setFormError('Paste an image link to pin a photo.')
        return
      }
    } else if (!message.trim()) {
      setFormError('Write something to pin.')
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
      setFormError(err?.message || 'That post did not save. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Portal>
    <div className="bulletin-overlay" onMouseDown={onClose}>
      <div
        className="bulletin-modal npm-card"
        role="dialog"
        aria-modal="true"
        aria-label="New post"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="bulletin-modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={16} />
        </button>
        <h3>Pin a post</h3>

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
              <Icon name="image" size={15} />
              Photo
            </button>
            <button
              type="button"
              className={type === 'question' ? 'active' : ''}
              onClick={() => switchType('question')}
              aria-pressed={type === 'question'}
            >
              <Icon name="message" size={15} />
              Question
            </button>
          </div>

          {type === 'photo' ? (
            <>
              <div className="field npm-group">
                <label htmlFor="npm-image">Image link</label>
                <input
                  id="npm-image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://"
                  autoFocus
                />
              </div>
              <div className="field npm-group">
                <label htmlFor="npm-caption">Caption</label>
                <input
                  id="npm-caption"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </>
          ) : (
            <div className="field npm-group">
              <label htmlFor="npm-message">Your question</label>
              <textarea
                id="npm-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask the chapter something"
                autoFocus
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Pinning' : 'Pin it'}
          </button>
        </form>
      </div>
    </div>
    </Portal>
  )
}
