import Icon from '../Icon.jsx'
import { timeAgo, tiltFor, AUTHOR_FALLBACK } from './bulletinUtils.js'
import './Note.css'

/**
 * One pinned note. Photo posts show the image above the caption; question
 * posts are text only. Each note carries a small deterministic rotation that
 * straightens when you point at it.
 */
export default function Note({ post, canRemove = false, onOpen, onRemove }) {
  const isQuestion = post.type === 'question'
  const status = post.status === 'visible'
    ? { className: 'is-public', label: 'Public' }
    : post.autoFlagged
      ? { className: 'is-flagged', label: 'Under review' }
      : { className: 'is-pending', label: 'Pending review' }

  return (
    <article
      className={`note edge${isQuestion ? ' note--question' : ''}`}
      style={{ '--tilt': `${tiltFor(post.id) * 0.5}deg` }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${isQuestion ? 'question' : 'photo'} post by ${post.author || AUTHOR_FALLBACK}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      <span className="note-pin" aria-hidden="true" />

      {canRemove && <span className={`note-status ${status.className}`}>{status.label}</span>}

      {!isQuestion &&
        (post.imageUrl ? (
          <div className="note-photo">
            <img src={post.imageUrl} alt={post.caption || 'Photo post'} loading="lazy" />
          </div>
        ) : (
          <div className="note-photo note-photo--empty">
            <Icon name="image" size={20} />
            <span>No image attached</span>
          </div>
        ))}

      {isQuestion ? (
        <p className="note-message">{post.message}</p>
      ) : (
        post.caption && <p className="note-caption">{post.caption}</p>
      )}

      <footer className="note-meta">
        <span className="note-author">{post.author || AUTHOR_FALLBACK}</span>
        <span className="note-time">{timeAgo(post.createdAt)}</span>
        <span className="note-replies">
          <Icon name="message" size={12} />
          {post.replyCount ?? 0}
        </span>
      </footer>

      {canRemove && (
        <button
          type="button"
          className="note-remove"
          aria-label="Remove post"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(post)
          }}
        >
          <Icon name="trash" size={13} />
        </button>
      )}
    </article>
  )
}
