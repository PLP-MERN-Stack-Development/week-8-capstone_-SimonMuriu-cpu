import { useState } from 'react'
import { postService } from '../../services/postService'
import { X, Image, Video } from 'lucide-react'
import toast from 'react-hot-toast'

const CreatePost = ({ onClose, onPostCreated }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast.error('Please write something!')
      return
    }

    setLoading(true)
    try {
      await postService.createPost({ content: content.trim() })
      toast.success('Post created successfully!')
      onPostCreated()
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Create Post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            maxLength={280}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Image className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Video className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`text-sm ${content.length > 250 ? 'text-red-500' : 'text-gray-500'}`}>
                {content.length}/280
              </span>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost