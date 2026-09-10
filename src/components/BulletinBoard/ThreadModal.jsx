import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth.js'
import { usePostThread } from '../../hooks/usePosts.js'
import Icon from '../Icon.jsx'
import Portal from '../Portal.jsx'
import { timeAgo, AUTHOR_FALLBACK } from './bulletinUtils.js'
import './Modal.css'
import './ThreadModal.css'

/**
 * The full post and its reply thread, opened from a note on the board.
 * Replies use the signed-in account, so there is no name field.
 */
export default function ThreadModal({ post, onClose, onReplySaved }) {
  const { user, isOfficerOrAdviser, openAuthModal } = useAuth()
  const { replies, loading, error, reply, removeReply } = usePostThread(post.id)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const isOwnerOrModerator = !!user && (post.authorUid === user.uid || isOfficerOrAdviser)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const canRemoveReply = (r) => !!user && (r.authorUid === user.uid || isOfficerOrAdviser)

  const handleReply = async (e) => {
    e.preventDefault()
    const text = message.trim()
    if (!text || !user) return
    setBusy(true)
    try {
      const saved = await reply({ author: user.displayName || AUTHOR_FALLBACK, message: text })
      // Only after the reply actually saved: bump the board's reply-count badge.
      if (saved) onReplySaved?.(post.id)
      setMessage('')
    } catch {
      /* Nothing to surface: the live thread still shows replies that saved. */
    } finally {
      setBusy(false)
    }
  }

  return (
    <Portal>
    <div className="bulletin-overlay" onMouseDown={onClose}>
      <div
        className="bulletin-modal thread-card"
        role="dialog"
        aria-modal="true"
        aria-label="Post thread"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="bulletin-modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={16} />
        </button>

        {post.type === 'photo' ? (
          post.imageUrl ? (
            <img className="thread-photo" src={post.imageUrl} alt={post.caption || 'Photo post'} />
          ) : (
            <div className="thread-photo-empty">
              <Icon name="image" size={22} />
              <span>No image attached</span>
            </div>
          )
        ) : (
          <p className="thread-question">{post.message}</p>
        )}

        <div className="thread-head">
          <span className="thread-author">{post.author || AUTHOR_FALLBACK}</span>
          <span className="thread-time">{timeAgo(post.createdAt)}</span>
          {isOwnerOrModerator && (
            <span className={`thread-status ${post.status === 'visible' ? 'is-public' : post.autoFlagged ? 'is-flagged' : 'is-pending'}`}>
              {post.status === 'visible' ? 'Public' : post.autoFlagged ? 'Under review' : 'Pending review'}
            </span>
          )}
        </div>
        {post.caption && <p className="thread-caption">{post.caption}</p>}

        <div className="thread-replies">
          {loading && <p className="thread-state">Loading replies</p>}
          {!loading && error && <p className="thread-state thread-error">{error}</p>}
          {!loading && !error && replies.length === 0 && (
            <p className="thread-state">No replies yet. Start the conversation.</p>
          )}
          {replies.map((r) => (
            <div className="thread-reply" key={r.id}>
              <div className="thread-reply-head">
                <span className="thread-reply-author">{r.author || AUTHOR_FALLBACK}</span>
                <span className="thread-reply-time">{timeAgo(r.createdAt)}</span>
                {canRemoveReply(r) && (
                  <button
                    type="button"
                    className="thread-remove"
                    aria-label="Remove reply"
                    onClick={() => removeReply(r.id)}
                  >
                    <Icon name="trash" size={13} />
                  </button>
                )}
              </div>
              <p className="thread-reply-text">{r.message}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form className="thread-reply-form" onSubmit={handleReply}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a reply"
              rows={2}
            />
            <button type="submit" className="btn btn-primary" disabled={busy || !message.trim()}>
              {busy ? 'Posting' : 'Reply'}
            </button>
          </form>
        ) : (
          <div className="thread-signin">
            <p>Sign in with your school account to reply.</p>
            <button type="button" className="btn btn-accent" onClick={openAuthModal}>
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
    </Portal>
  )
}
