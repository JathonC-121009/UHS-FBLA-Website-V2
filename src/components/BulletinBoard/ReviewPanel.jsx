import { useEffect, useState } from 'react'
import { useReviewQueue } from '../../hooks/usePosts.js'
import Icon from '../Icon.jsx'
import Portal from '../Portal.jsx'
import { timeAgo, AUTHOR_FALLBACK } from './bulletinUtils.js'
import './Modal.css'
import './NewPostModal.css'
import './ReviewPanel.css'

/**
 * Officer and adviser review dashboard. Every new post and reply waits here
 * as 'pending' until a reviewer approves it (it goes public) or discards it
 * (it is permanently deleted). Opened from the bulletin toolbar, which only shows the
 * button to officers and advisers; firestore.rules enforces the same limit.
 */
export default function ReviewPanel({ onClose, onPostApproved, onPostDiscarded, onReplyApproved, onCountChange }) {
  const { posts, replies, loading, error, decidePost, decideReply } = useReviewQueue()
  const [tab, setTab] = useState('posts') // 'posts' | 'replies'
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!loading && !error) onCountChange?.(posts.length + replies.length)
  }, [posts.length, replies.length, loading, error, onCountChange])

  const handlePost = async (post, approve) => {
    if (!approve && !window.confirm(
      'Discard this post? It will be permanently deleted. This cannot be undone.',
    )) return
    setBusyId(post.id)
    setActionError('')
    try {
      await decidePost(post, approve)
      if (approve) onPostApproved?.(post)
      else onPostDiscarded?.(post.id)
    } catch {
      setActionError('That did not save. Check your connection and try again.')
    } finally {
      setBusyId(null)
    }
  }

  const handleReply = async (reply, approve) => {
    if (!approve && !window.confirm(
      'Discard this reply? It will be permanently deleted. This cannot be undone.',
    )) return
    setBusyId(reply.id)
    setActionError('')
    try {
      await decideReply(reply, approve)
      if (approve) onReplyApproved?.(reply.postId)
    } catch {
      setActionError('That did not save. Check your connection and try again.')
    } finally {
      setBusyId(null)
    }
  }

  const items = tab === 'posts' ? posts : replies

  return (
    <Portal>
    <div className="bulletin-overlay" onMouseDown={onClose}>
      <div
        className="bulletin-modal review-card"
        role="dialog"
        aria-modal="true"
        aria-label="Review pending posts"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="bulletin-modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={16} />
        </button>
        <h3>Review queue</h3>
        <p className="review-sub">
          New posts and replies wait here until an officer or adviser checks them.
          Approve puts it on the public board. Discard deletes it for good.
        </p>

        <div className="npm-toggle review-tabs" role="tablist" aria-label="Pending items">
          <button
            type="button"
            role="tab"
            className={tab === 'posts' ? 'active' : ''}
            aria-selected={tab === 'posts'}
            onClick={() => setTab('posts')}
          >
            Posts ({loading ? '…' : posts.length})
          </button>
          <button
            type="button"
            role="tab"
            className={tab === 'replies' ? 'active' : ''}
            aria-selected={tab === 'replies'}
            onClick={() => setTab('replies')}
          >
            Replies ({loading ? '…' : replies.length})
          </button>
        </div>

        {actionError && (
          <div className="npm-error" role="alert">
            <span>{actionError}</span>
          </div>
        )}

        <div className="review-list">
          {loading && <p className="thread-state">Loading the queue</p>}
          {!loading && error && <p className="thread-state thread-error">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="thread-state">
              {tab === 'posts' ? 'No posts waiting for review.' : 'No replies waiting for review.'}
            </p>
          )}

          {!loading && !error && items.map((item) => {
            const isReply = tab === 'replies'
            const busy = busyId === item.id
            return (
              <article className="review-item" key={item.id}>
                {isReply && (
                  <p className="review-context">
                    <span>Reply to</span>{' '}
                    {item.parentPost
                      ? `"${item.parentPost.message || item.parentPost.caption || 'a photo post'}"`
                      : 'a post that is no longer available'}
                  </p>
                )}
                <p className="review-text">
                  {item.message || item.caption || (item.imageUrl ? 'Photo post' : '(empty)')}
                </p>
                {!isReply && item.imageUrl && (
                  <img className="review-photo" src={item.imageUrl} alt={item.caption || 'Photo post'} loading="lazy" />
                )}
                <div className="review-meta">
                  <span className="review-author">{item.author || AUTHOR_FALLBACK}</span>
                  <span className="review-time">{timeAgo(item.createdAt)}</span>
                </div>
                <div className="review-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={busy}
                    onClick={() => (isReply ? handleReply(item, false) : handlePost(item, false))}
                  >
                    <Icon name="trash" size={14} />
                    Discard
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={busy}
                    onClick={() => (isReply ? handleReply(item, true) : handlePost(item, true))}
                  >
                    <Icon name="check" size={14} />
                    {busy ? 'Saving' : 'Approve'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
    </Portal>
  )
}
