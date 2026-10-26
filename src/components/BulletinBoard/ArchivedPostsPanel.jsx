import { useEffect } from 'react'
import { useArchivedPosts } from '../../hooks/usePosts.js'
import Icon from '../Icon.jsx'
import Portal from '../Portal.jsx'
import Note from './Note.jsx'
import './Modal.css'
import './ArchivedPostsPanel.css'

/**
 * Archived (soft-removed) posts, newest removed first, read through the
 * cursor-based useArchivedPosts() hook: next and previous only, 30 per page.
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
    <Portal>
    <div className="bulletin-overlay" onMouseDown={onClose}>
      <div
        className="bulletin-modal archived-card"
        role="dialog"
        aria-modal="true"
        aria-label="Archived posts"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="bulletin-modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={16} />
        </button>
        <h3>Archive</h3>
        <p className="archived-sub">
          Posts removed from the live board, newest first. Nothing is deleted.
        </p>

        <div className="archived-list">
          {loading && <p className="thread-state">Loading the archive</p>}
          {!loading && error && <p className="thread-state thread-error">{error}</p>}
          {!loading && !error && posts.length === 0 && (
            <p className="thread-state">No archived posts.</p>
          )}
          {posts.map((post) => (
            <div className="archived-note" key={post.id}>
              <Note post={post} onOpen={() => onOpenPost(post)} />
              <span className="archived-tag">Archived</span>
            </div>
          ))}
        </div>

        <div className="archived-nav">
          <button type="button" className="btn btn-ghost" disabled={!hasPrevPage || loading} onClick={prevPage}>
            <Icon name="arrowLeft" size={14} />
            Previous
          </button>
          <span className="archived-page">Page {String(page + 1).padStart(2, '0')}</span>
          <button type="button" className="btn btn-ghost" disabled={!hasNextPage || loading} onClick={nextPage}>
            Next
            <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>
    </div>
    </Portal>
  )
}
