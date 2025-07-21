import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { postService } from '../../services/postService'
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth()
  const { emitLikePost, emitCommentPost } = useSocket()
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user._id))
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postService.unlikePost(post._id)
        setIsLiked(false)
        setLikesCount(prev => prev - 1)
      } else {
        await postService.likePost(post._id)
        setIsLiked(true)
        setLikesCount(prev => prev + 1)
        emitLikePost(post._id, post.author._id)
      }
    } catch (error) {
      toast.error('Failed to update like')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    setLoading(true)
    try {
      await postService.addComment(post._id, { content: comment.trim() })
      emitCommentPost(post._id, post.author._id, comment.trim())
      setComment('')
      onUpdate?.()
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card animate-fade-in">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <Link 
          to={`/profile/${post.author.username}`}
          className="flex items-center space-x-3 hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
        >
          <img
            src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=3b82f6&color=fff`}
            alt={post.author.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900">{post.author.name}</p>
            <div className="flex items-center text-sm text-gray-500 space-x-1">
              <span>@{post.author.username}</span>
              <span>·</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </Link>

        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 leading-relaxed">{post.content}</p>
        
        {post.image && (
          <div className="mt-3">
            <img
              src={post.image}
              alt="Post content"
              className="w-full rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'text-red-600 bg-red-50 hover:bg-red-100'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{post.commentsCount || 0}</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <Share className="h-5 w-5" />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {/* Add Comment Form */}
          <form onSubmit={handleComment} className="flex space-x-3">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
              alt={user.name}
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              {comment.trim() && (
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="flex space-x-3">
                <img
                  src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.name}&background=3b82f6&color=fff`}
                  alt={comment.author.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{comment.author.name}</p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard