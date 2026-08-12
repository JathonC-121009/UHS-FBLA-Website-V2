import { useState } from 'react'
import useAuth from '../hooks/useAuth.js'
import { usePosts } from '../hooks/usePosts.js'
import Corkboard from '../components/BulletinBoard/Corkboard.jsx'
import ThreadModal from '../components/BulletinBoard/ThreadModal.jsx'
import NewPostModal from '../components/BulletinBoard/NewPostModal.jsx'
import ArchivedPostsPanel from '../components/BulletinBoard/ArchivedPostsPanel.jsx'
import './Bulletin.css'

export const meta = {
  label: 'Bulletin Board',   // navbar text
  order: 90,                 // navbar position; lower numbers come first
  title: 'Urbana FBLA — Bulletin Board',  // browser tab title
}

export default function Bulletin() {
  const { user, isOfficerOrAdviser, openAuthModal } = useAuth()
  const { posts, loading, error, createPost, removePost, clearBoard, bumpReplyCount } = usePosts()

  const [openPost, setOpenPost] = useState(null)
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [archivedOpen, setArchivedOpen] = useState(false)
  const [clearing, setClearing] = useState(false)

  // Author-of-own-content or officer/adviser may soft-remove.
  const canRemove = (post) => !!user && (post.authorUid === user.uid || isOfficerOrAdviser)

  const handleRemovePost = async (post) => {
    try {
      await removePost(post.id)
    } catch {
      /* rules/snapshot races surface silently — board state stays as-is */
    }
  }

  const handleClearBoard = async () => {
    if (!window.confirm(
      'Clear the whole board? Every post will be soft-removed and moved to the archive. This cannot be undone.',
    )) return
    setClearing(true)
    try {
      await clearBoard()
    } finally {
      setClearing(false)
    }
  }

  const handleNewPost = () => {
    if (!user) {
      openAuthModal()
      return
    }
    setNewPostOpen(true)
  }

  return (
    <>
      <div className="page-hero">
        <p className="page-hero-label">Bulletin Board</p>
        <h1>The <span>Board</span></h1>
        <p>Pin a photo, ask a question, start a conversation</p>
      </div>

      <section className="bulletin-section">
        <div className="bulletin-wrap fi">
          <div className="bulletin-toolbar">
            <button type="button" className="btn btn-gold" onClick={handleNewPost}>
              ＋ New Post
            </button>
            <button
              type="button"
              className={`btn bulletin-outline${archivedOpen ? ' active' : ''}`}
              onClick={() => setArchivedOpen((v) => !v)}
            >
              Archived Posts
            </button>
            {isOfficerOrAdviser && (
              <button
                type="button"
                className="btn btn-navy bulletin-clear"
                onClick={handleClearBoard}
                disabled={clearing}
              >
                {clearing ? 'Clearing…' : 'Clear Board'}
              </button>
            )}
          </div>

          <Corkboard
            posts={posts}
            loading={loading}
            error={error}
            canRemove={canRemove}
            onOpenPost={setOpenPost}
            onRemovePost={handleRemovePost}
          />
        </div>
      </section>

      {openPost && (
        <ThreadModal post={openPost} onClose={() => setOpenPost(null)} onReplySaved={bumpReplyCount} />
      )}
      {newPostOpen && <NewPostModal onCreate={createPost} onClose={() => setNewPostOpen(false)} />}
      {archivedOpen && (
        <ArchivedPostsPanel
          onClose={() => setArchivedOpen(false)}
          onOpenPost={(post) => {
            setArchivedOpen(false)
            setOpenPost(post)
          }}
        />
      )}
    </>
  )
}