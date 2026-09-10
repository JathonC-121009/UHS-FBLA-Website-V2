import Note from './Note.jsx'
import './Board.css'

/**
 * The board itself: a bordered pinboard surface holding the notes in a
 * masonry column flow, scrollable on its own so the page never grows without
 * limit as posts accumulate.
 */
export default function Board({ posts, loading, error, canRemove, onOpenPost, onRemovePost }) {
  return (
    <div className="board-frame">
      <div className="board-surface">
        {loading ? (
          <p className="board-state">Loading the board</p>
        ) : error ? (
          <p className="board-state">{error}</p>
        ) : posts.length === 0 ? (
          <p className="board-state">Nothing pinned yet. Be the first to post.</p>
        ) : (
          <div className="board-notes">
            {posts.map((post) => (
              <Note
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
