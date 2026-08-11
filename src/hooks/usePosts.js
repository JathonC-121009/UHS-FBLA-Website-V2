import { useState, useEffect, useCallback, useRef } from 'react'
import {
  addPost, getPosts, getReplies, addReply as addReplySvc,
  removePost as removePostSvc, removeReply as removeReplySvc,
  clearBoard as clearBoardSvc, getArchivedPosts,
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

  const removePost = useCallback(async (postId) => {
    await removePostSvc(postId)
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }, [])

  const clearBoard = useCallback(async () => {
    await clearBoardSvc()
    setPosts([])
  }, [])

  return { posts, loading, error, createPost, removePost, clearBoard }
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

  return {
    posts: pagesCache[page] ?? [],
    page,
    hasNextPage,
    hasPrevPage: page > 0,
    nextPage,
    prevPage,
    loading,
    error,
  }
}