import { useState, useEffect, useCallback, useRef } from 'react'
import {
  addPost, getPosts, getReplies, addReply as addReplySvc,
  removePost as removePostSvc, removeReply as removeReplySvc,
  clearBoard as clearBoardSvc, getArchivedPosts, deleteArchivedPost,
  getPendingPosts, getPendingReplies, approvePost, discardPost, approveReply, discardReply,
} from '../services/postsService.js'

export function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPosts()
      setPosts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const createPost = useCallback(async (post) => {
    const saved = await addPost(post)
    setPosts((prev) => [saved, ...prev])
  }, [])

  // Called by the review dashboard after it approves a post, so the post goes
  // up on the board (or flips from Pending to Public for its author) at once.
  const showApprovedPost = useCallback((post) => {
    const approved = { ...post, status: 'visible' }
    setPosts((prev) =>
      [approved, ...prev.filter((p) => p.id !== post.id)]
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    )
  }, [])

  // Called after a post is discarded, in case it was the reviewer's own.
  const dropPost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }, [])

  const removePost = useCallback(async (postId) => {
    await removePostSvc(postId)
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }, [])

  const clearBoard = useCallback(async () => {
    await clearBoardSvc()
    setPosts([])
  }, [])

  // Client-side display patch only: bumps a post's reply count badge after a
  // reply actually saved (the service already incremented it in Firestore).
  const bumpReplyCount = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replyCount: (p.replyCount ?? 0) + 1 } : p)),
    )
  }, [])

  return {
    posts, loading, error, createPost, removePost, clearBoard, bumpReplyCount,
    showApprovedPost, dropPost, reload: load,
  }
}

export function usePostThread(postId) {
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!postId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getReplies(postId)
      setReplies(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => { load() }, [load])

  const reply = useCallback(async (replyData) => {
    const saved = await addReplySvc(postId, replyData)
    setReplies((prev) => [...prev, saved])
    return saved // resolves only if the reply saved; callers bump badges on success
  }, [postId])

  const removeReply = useCallback(async (replyId) => {
    await removeReplySvc(postId, replyId)
    setReplies((prev) => prev.filter((r) => r.id !== replyId))
  }, [postId])

  return { replies, loading, error, reply, removeReply }
}

/**
 * Paginated "removed posts" archive.
 *
 * Pages already visited are cached (pagesCache + a cursor stack), so Previous
 * and Next within visited pages are instant; only forward pages that were
 * never fetched hit Firestore.
 */
export function useArchivedPosts({ pageSize = 30 } = {}) {
  // pagesCache[i] = the posts of page i
  const [pagesCache, setPagesCache] = useState([])
  // cursorsRef.current[i] = the snapshot cursor to startAfter for page i+1
  const cursorsRef = useRef([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasNextPage, setHasNextPage] = useState(false)

  const loadPage = useCallback(async (targetPage) => {
    setLoading(true)
    setError(null)
    try {
      const cursor = targetPage === 0 ? null : cursorsRef.current[targetPage - 1]
      const { posts: pagePosts, lastVisibleCursor, hasMore } = await getArchivedPosts({ pageSize, cursor })
      setPagesCache((prev) => {
        const next = [...prev]
        next[targetPage] = pagePosts
        return next
      })
      cursorsRef.current = [...cursorsRef.current]
      cursorsRef.current[targetPage] = lastVisibleCursor
      setHasNextPage(hasMore)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  useEffect(() => { loadPage(0) }, [loadPage])

  const nextPage = useCallback(() => {
    if (!hasNextPage) return
    setPage((cur) => {
      const next = cur + 1
      if (next < pagesCache.length) {
        return next
      }
      loadPage(next)
      return next
    })
  }, [hasNextPage, pagesCache, loadPage])

  const prevPage = useCallback(() => {
    setPage((cur) => Math.max(0, cur - 1))
  }, [])

  // Permanent delete (officers and advisers). Drops the post from every cached
  // page so it disappears at once; later pages shift by one on the next fetch.
  const deletePost = useCallback(async (postId) => {
    await deleteArchivedPost(postId)
    setPagesCache((prev) => prev.map((pagePosts) => pagePosts?.filter((p) => p.id !== postId)))
  }, [])

  return {
    posts: pagesCache[page] ?? [],
    page,
    hasNextPage,
    hasPrevPage: page > 0,
    nextPage,
    prevPage,
    deletePost,
    loading,
    error,
  }
}

/**
 * The officer/adviser review queue: every pending post and reply. Approving or
 * discarding takes the item out of the queue straight away.
 */
export function useReviewQueue() {
  const [posts, setPosts] = useState([])
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [pendingPosts, pendingReplies] = await Promise.all([getPendingPosts(), getPendingReplies()])
      setPosts(pendingPosts)
      setReplies(pendingReplies)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const decidePost = useCallback(async (post, approve) => {
    await (approve ? approvePost(post.id) : discardPost(post.id))
    setPosts((prev) => prev.filter((p) => p.id !== post.id))
  }, [])

  const decideReply = useCallback(async (reply, approve) => {
    await (approve ? approveReply(reply.postId, reply.id) : discardReply(reply.id))
    setReplies((prev) => prev.filter((r) => r.id !== reply.id))
  }, [])

  return { posts, replies, loading, error, reload: load, decidePost, decideReply }
}

/**
 * How many posts and replies are waiting for review, for the badge on the
 * toolbar's Review button. Only fetches when `enabled` (officers and advisers).
 */
export function usePendingCount(enabled) {
  const [count, setCount] = useState(null)

  useEffect(() => {
    if (!enabled) {
      setCount(null)
      return undefined
    }
    let cancelled = false
    Promise.all([getPendingPosts(), getPendingReplies()])
      .then(([p, r]) => { if (!cancelled) setCount(p.length + r.length) })
      .catch(() => { if (!cancelled) setCount(null) })
    return () => { cancelled = true }
  }, [enabled])

  return [count, setCount]
}
