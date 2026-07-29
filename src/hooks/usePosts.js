import { useState, useEffect, useCallback } from 'react'
import { addPost, getPosts, getReplies, addReply as addReplySvc } from '../services/postsService.js'

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

  return { posts, loading, error, createPost }
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

  return { replies, loading, error, reply }
}