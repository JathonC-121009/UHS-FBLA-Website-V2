import { useEffect } from 'react'
import { useArchivedPosts } from '../../hooks/usePosts.js'
import PinnedNote from './PinnedNote.jsx'
import './Modal.css'
import './ArchivedPostsPanel.css'

/**
 * Archived (soft-removed) posts, newest-removed first, via the cursor-based
 * useArchivedPosts() hook — Next/Previous only, 30 per page.
 */
export default function ArchivedPostsPanel({ onClose, onOpenPost }) {
  const { posts, page, hasNextPage, hasPrevPage, nextPage, prevPage, loading, error } = useArchivedPosts()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="bulletin-overlay" onMouseDown={onClose}>
      <div
        className="bulletin-modal archived-card"
        role="dialog"
        aria-modal="true"
        aria-label="Archived posts"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="bulletin-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h3>Archived Posts</h3>
        <p className="archived-sub">
          Soft-removed posts, newest first. Hidden from the live board, but kept here.
        </p>

        <div className="archived-list">
          {loading && <p className="thread-state">Loading archive…</p>}
          {!loading && error && <p className="thread-state thread-error">{error}</p>}
          {!loading && !error && posts.length === 0 && (
            <p className="thread-state">No archived posts.</p>
          )}
          {posts.map((post) => (
            <div className="archived-note" key={post.id}>
              <PinnedNote post={post} onOpen={() => onOpenPost(post)} />
              <span className="archived-tag">Archived</span>
            </div>
          ))}
        </div>

        <div className="archived-nav">
          <button type="button" className="btn btn-navy" disabled={!hasPrevPage || loading} onClick={prevPage}>
            ← Previous
          </button>
          <span className="archived-page">Page {page + 1}</span>
          <button type="button" className="btn btn-navy" disabled={!hasNextPage || loading} onClick={nextPage}>
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}