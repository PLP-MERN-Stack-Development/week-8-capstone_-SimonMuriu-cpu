import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { postService } from '../services/postService'
import CreatePost from '../components/posts/CreatePost'
import PostCard from '../components/posts/PostCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { PlusCircle } from 'lucide-react'

const Home = () => {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [page, setPage] = useState(1)

  const { 
    data: posts, 
    isLoading, 
    error, 
    refetch 
  } = useQuery(
    ['feed-posts', page], 
    () => postService.getFeedPosts(page),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
    }
  )

  const handlePostCreated = () => {
    setShowCreatePost(false)
    refetch()
  }

  if (isLoading && !posts) {
    return <LoadingSpinner className="mt-8" />
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">Failed to load posts. Please try again.</p>
        <button 
          onClick={refetch}
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create Post Button */}
      <div className="card">
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 py-4"
        >
          <PlusCircle className="h-5 w-5" />
          <span>What's on your mind?</span>
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts?.posts?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Follow some users to see their posts in your feed.</p>
          </div>
        ) : (
          posts?.posts?.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onUpdate={refetch}
            />
          ))
        )}

        {/* Load More Button */}
        {posts?.hasMore && (
          <div className="text-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={isLoading}
              className="btn-secondary"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home