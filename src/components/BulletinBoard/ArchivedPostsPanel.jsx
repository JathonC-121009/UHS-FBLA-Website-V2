import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth.js'
import { useArchivedPosts } from '../../hooks/usePosts.js'
import Icon from '../Icon.jsx'
import Portal from '../Portal.jsx'
import Note from './Note.jsx'
import './Modal.css'
import './ArchivedPostsPanel.css'

/**
 * Archived (soft-removed) posts, newest removed first, read through the
 * cursor-based useArchivedPosts() hook: next and previous only, 30 per page.
 * Officers and advisers also get a Delete button that removes a post and its
 * replies for good.
 */
export default function ArchivedPostsPanel({ onClose, onOpenPost }) {
  const { posts, page, hasNextPage, hasPrevPage, nextPage, prevPage, deletePost, loading, error } = useArchivedPosts()
  const { isOfficerOrAdviser } = useAuth()
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async (post) => {
    if (!window.confirm(
      'Permanently delete this post and all of its replies? This cannot be undone.',
    )) return
    setDeletingId(post.id)
    setDeleteError('')
    try {
      await deletePost(post.id)
    } catch {
      setDeleteError('That post did not delete. Try again.')
    } finally {
      setDeletingId(null)
    }
  }

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
          Posts removed from the live board, newest first.
          {isOfficerOrAdviser
            ? ' Officers and advisers can delete a post here for good.'
            : ' Nothing is deleted.'}
        </p>

        {deleteError && <p className="thread-state thread-error" role="alert">{deleteError}</p>}

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
              {isOfficerOrAdviser && (
                <button
                  type="button"
                  className="archived-delete"
                  onClick={() => handleDelete(post)}
                  disabled={deletingId === post.id}
                >
                  <Icon name="trash" size={13} />
                  {deletingId === post.id ? 'Deleting' : 'Delete forever'}
                </button>
              )}
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
