import { useState } from 'react'
import Masthead from '../components/Masthead.jsx'
import Icon from '../components/Icon.jsx'
import useAuth from '../hooks/useAuth.js'
import { usePosts } from '../hooks/usePosts.js'
import { AUTHOR_FALLBACK } from '../components/BulletinBoard/bulletinUtils.js'
import Board from '../components/BulletinBoard/Board.jsx'
import ThreadModal from '../components/BulletinBoard/ThreadModal.jsx'
import NewPostModal from '../components/BulletinBoard/NewPostModal.jsx'
import ArchivedPostsPanel from '../components/BulletinBoard/ArchivedPostsPanel.jsx'
import './Bulletin.css'

// Route + nav settings for this page. See src/pageRegistry.js.
export const meta = {
  label: 'Board',
  order: 90,
  title: 'Urbana FBLA, Bulletin Board',
}

export default function Bulletin() {
  const { user, profile, isOfficerOrAdviser, openAuthModal } = useAuth()
  const { posts, loading, error, createPost, removePost, clearBoard, bumpReplyCount } = usePosts()

  const [openPost, setOpenPost] = useState(null)
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [archivedOpen, setArchivedOpen] = useState(false)
  const [clearing, setClearing] = useState(false)

  // The author of a post, and any officer or adviser, may soft-remove it.
  const canRemove = (post) => !!user && (post.authorUid === user.uid || isOfficerOrAdviser)

  const handleRemovePost = async (post) => {
    try {
      await removePost(post.id)
    } catch {
      /* Rules and snapshot races surface silently; board state stays as-is. */
    }
  }

  const handleClearBoard = async () => {
    if (!window.confirm(
      'Clear the whole board? Every post is soft-removed and moved to the archive. This cannot be undone.',
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

  // NewPostModal submits its payload through onCreate, and the author is
  // attached here (profile display name, then the Auth display name, then the
  // shared fallback) so postsService just writes the string it is handed.
  const handleCreatePost = async (post) => {
    await createPost({
      ...post,
      author: profile?.displayName || user?.displayName || AUTHOR_FALLBACK,
    })
  }

  return (
    <>
      <Masthead
        eyebrow="Members"
        title={<>The chapter <em>board</em></>}
        lede="Ask a question, post a photo, or answer someone else's. Sign in to post; anyone can read."
        meta={[
          { label: 'On the board', value: loading ? 'Loading' : String(posts.length) },
          { label: 'Posting', value: user ? 'Signed in' : 'Sign in required' },
        ]}
      />

      <section className="bulletin-section">
        <div className="bulletin-wrap">
          <div className="bulletin-toolbar" data-reveal="fade">
            <button type="button" className="btn btn-primary" onClick={handleNewPost}>
              <Icon name="plus" size={14} />
              New post
            </button>
            <button
              type="button"
              className={`btn btn-ghost${archivedOpen ? ' is-active' : ''}`}
              onClick={() => setArchivedOpen((v) => !v)}
            >
              Archive
            </button>
            {isOfficerOrAdviser && (
              <button
                type="button"
                className="btn btn-ghost bulletin-clear"
                onClick={handleClearBoard}
                disabled={clearing}
              >
                {clearing ? 'Clearing' : 'Clear board'}
              </button>
            )}
          </div>

          <div data-reveal="fade">
            <Board
              posts={posts}
              loading={loading}
              error={error}
              canRemove={canRemove}
              onOpenPost={setOpenPost}
              onRemovePost={handleRemovePost}
            />
          </div>
        </div>
      </section>

      {openPost && (
        <ThreadModal post={openPost} onClose={() => setOpenPost(null)} onReplySaved={bumpReplyCount} />
      )}
      {newPostOpen && <NewPostModal onCreate={handleCreatePost} onClose={() => setNewPostOpen(false)} />}
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
