import PinnedNote from './PinnedNote.jsx'
import './Corkboard.css'

/**
 * The framed corkboard: wood-gradient frame around a fixed-height,
 * internally scrollable cork-textured board holding wrapped pinned notes.
 */
export default function Corkboard({ posts, loading, error, canRemove, onOpenPost, onRemovePost }) {
  return (
    <div className="cork-frame">
      <div className="cork-board">
        {loading ? (
          <p className="cork-state">Pinning the board…</p>
        ) : error ? (
          <p className="cork-state">{error}</p>
        ) : posts.length === 0 ? (
          <p className="cork-state">No posts yet — be the first to pin something!</p>
        ) : (
          <div className="cork-notes">
            {posts.map((post) => (
              <PinnedNote
                key={post.id}
                post={post}
                canRemove={canRemove(post)}
                onOpen={() => onOpenPost(post)}
                onRemove={onRemovePost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}