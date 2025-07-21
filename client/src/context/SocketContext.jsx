import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext({})

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [notifications, setNotifications] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      })

      setSocket(socketInstance)

      // Listen for connection
      socketInstance.on('connect', () => {
        console.log('Connected to server')
      })

      // Listen for online users
      socketInstance.on('online-users', (users) => {
        setOnlineUsers(users)
      })

      // Listen for notifications
      socketInstance.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev])
        
        // Show toast notification
        toast.success(notification.message, {
          duration: 4000,
          icon: getNotificationIcon(notification.type)
        })
      })

      // Listen for new messages
      socketInstance.on('new-message', (message) => {
        // Handle new message (will be used in Messages component)
        console.log('New message received:', message)
      })

      // Listen for post interactions
      socketInstance.on('post-liked', (data) => {
        if (data.postAuthorId === user._id) {
          const notification = {
            type: 'like',
            message: `${data.likerName} liked your post`,
            createdAt: new Date()
          }
          setNotifications(prev => [notification, ...prev])
        }
      })

      socketInstance.on('post-commented', (data) => {
        if (data.postAuthorId === user._id) {
          const notification = {
            type: 'comment',
            message: `${data.commenterName} commented on your post`,
            createdAt: new Date()
          }
          setNotifications(prev => [notification, ...prev])
        }
      })

      // Listen for follow notifications
      socketInstance.on('new-follower', (data) => {
        if (data.followedUserId === user._id) {
          const notification = {
            type: 'follow',
            message: `${data.followerName} started following you`,
            createdAt: new Date()
          }
          setNotifications(prev => [notification, ...prev])
        }
      })

      return () => {
        socketInstance.close()
        setSocket(null)
      }
    }
  }, [user])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return '❤️'
      case 'comment': return '💬'
      case 'follow': return '👤'
      case 'message': return '📩'
      default: return '🔔'
    }
  }

  const emitLikePost = (postId, postAuthorId) => {
    if (socket) {
      socket.emit('like-post', {
        postId,
        postAuthorId,
        likerId: user._id,
        likerName: user.name
      })
    }
  }

  const emitCommentPost = (postId, postAuthorId, comment) => {
    if (socket) {
      socket.emit('comment-post', {
        postId,
        postAuthorId,
        commenterId: user._id,
        commenterName: user.name,
        comment
      })
    }
  }

  const emitFollowUser = (followedUserId) => {
    if (socket) {
      socket.emit('follow-user', {
        followedUserId,
        followerId: user._id,
        followerName: user.name
      })
    }
  }

  const sendMessage = (receiverId, message) => {
    if (socket) {
      socket.emit('send-message', {
        receiverId,
        senderId: user._id,
        message,
        timestamp: new Date()
      })
    }
  }

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const value = {
    socket,
    onlineUsers,
    notifications,
    emitLikePost,
    emitCommentPost,
    emitFollowUser,
    sendMessage,
    markNotificationsAsRead,
    unreadNotifications: notifications.filter(n => !n.read).length
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}