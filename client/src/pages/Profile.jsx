import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { userService } from '../services/userService'
import { postService } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import PostCard from '../components/posts/PostCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Settings, UserPlus, UserMinus, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const { emitFollowUser } = useSocket()
  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(false)

  // If no username provided, show current user's profile
  const profileUsername = username || currentUser?.username

  const { 
    data: profileUser, 
    isLoading: userLoading 
  } = useQuery(
    ['user', profileUsername], 
    () => userService.getUserByUsername(profileUsername),
    {
      enabled: !!profileUsername
    }
  )

  const { 
    data: userPosts, 
    isLoading: postsLoading,
    refetch: refetchPosts 
  } = useQuery(
    ['user-posts', profileUser?._id], 
    () => postService.getUserPosts(profileUser._id),
    {
      enabled: !!profileUser?._id
    }
  )

  const isOwnProfile = currentUser?._id === profileUser?._id

  useEffect(() => {
    if (profileUser && currentUser) {
      setIsFollowing(profileUser.followers?.includes(currentUser._id))
    }
  }, [profileUser, currentUser])

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(profileUser._id)
        setIsFollowing(false)
        toast.success(`Unfollowed ${profileUser.name}`)
      } else {
        await userService.followUser(profileUser._id)
        setIsFollowing(true)
        emitFollowUser(profileUser._id)
        toast.success(`Following ${profileUser.name}`)
      }
    } catch (error) {
      toast.error('Failed to update follow status')
    }
  }

  if (userLoading) {
    return <LoadingSpinner className="mt-8" />
  }

  if (!profileUser) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
        <p className="text-gray-600 mt-2">The user you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <img
            src={profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.name}&background=3b82f6&color=fff&size=128`}
            alt={profileUser.name}
            className="h-24 w-24 md:h-32 md:w-32 rounded-full mx-auto md:mx-0"
          />

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{profileUser.name}</h1>
            <p className="text-gray-600 mb-2">@{profileUser.username}</p>
            
            {profileUser.bio && (
              <p className="text-gray-700 mb-4">{profileUser.bio}</p>
            )}

            {/* Stats */}
            <div className="flex justify-center md:justify-start space-x-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-900">{userPosts?.posts?.length || 0}</span>
                <span className="ml-1">Posts</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{profileUser.followersCount || 0}</span>
                <span className="ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{profileUser.followingCount || 0}</span>
                <span className="ml-1">Following</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {isOwnProfile ? (
              <button className="btn-secondary">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollowToggle}
                  className={isFollowing ? 'btn-secondary' : 'btn-primary'}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </button>
                <button className="btn-secondary">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['posts', 'media', 'likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Content */}
      <div>
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {postsLoading ? (
              <LoadingSpinner />
            ) : userPosts?.posts?.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">
                  {isOwnProfile 
                    ? "Share your first post to get started!" 
                    : `${profileUser.name} hasn't posted anything yet.`
                  }
                </p>
              </div>
            ) : (
              userPosts?.posts?.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onUpdate={refetchPosts}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Media posts will be displayed here.</p>
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Liked posts will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile