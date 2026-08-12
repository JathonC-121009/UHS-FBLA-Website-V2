import { timeAgo, tiltFor, AUTHOR_FALLBACK } from './bulletinUtils.js'
import './PinnedNote.css'

/**
 * A single pinned note on the corkboard.
 * Photo posts render polaroid-style; question posts render as sticky notes.
 */
export default function PinnedNote({ post, canRemove = false, onOpen, onRemove }) {
  const tilt = tiltFor(post.id)
  const isSticky = post.type === 'question'
  // Alternate pale-gold / pale-cobalt sticky tints deterministically per note.
  const stickyTint = tiltFor(`${post.id}-tint`) % 2 === 0 ? 'tint-gold' : 'tint-cobalt'

  return (
    <article
      className={`pin-note ${isSticky ? 'pin-sticky' : 'pin-polaroid'} ${isSticky ? stickyTint : ''}`}
      style={{ ['--tilt']: `${tilt}deg` }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${isSticky ? 'question' : 'photo'} post by ${post.author || AUTHOR_FALLBACK}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      <span className="pin-pushpin" aria-hidden="true" />

      {!isSticky && (post.imageUrl ? (
        <div className="pin-photo">
          <img src={post.imageUrl} alt={post.caption || 'Photo post'} loading="lazy" />
        </div>
      ) : (
        <div className="pin-photo pin-photo-empty">
          <span>🖼️</span>
          <span>No image attached</span>
        </div>
      ))}

      {isSticky ? (
        <p className="pin-message">{post.message || '…'}</p>
      ) : (
        post.caption && <p className="pin-caption">{post.caption}</p>
      )}

      <div className="pin-meta">
        <span className="pin-author">{post.author || AUTHOR_FALLBACK}</span>
        <span className="pin-time">{timeAgo(post.createdAt)}</span>
        <span className="pin-replies">💬 {post.replyCount ?? 0}</span>
      </div>

      {canRemove && (
        <button
          type="button"
          className="pin-remove"
          aria-label="Remove post"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(post)
          }}
        >
          🗑️
        </button>
      )}
    </article>
  )
}