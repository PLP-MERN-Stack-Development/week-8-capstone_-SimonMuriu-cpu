import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const socketService = (io) => {
  // Store online users
  const onlineUsers = new Map()

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId)
      
      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.userId = user._id.toString()
      socket.user = user
      next()
    } catch (error) {
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected`)
    
    // Add user to online users
    onlineUsers.set(socket.userId, {
      socketId: socket.id,
      user: {
        _id: socket.userId,
        username: socket.user.username,
        name: socket.user.name,
        avatar: socket.user.avatar
      }
    })

    // Update user's last active status
    socket.user.updateLastActive()

    // Broadcast online users to all connected clients
    io.emit('online-users', Array.from(onlineUsers.values()).map(u => u.user))

    // Join user to their personal room
    socket.join(socket.userId)

    // Handle post likes
    socket.on('like-post', (data) => {
      const { postId, postAuthorId, likerId, likerName } = data
      
      // Notify post author if they're online and it's not their own post
      if (postAuthorId !== likerId && onlineUsers.has(postAuthorId)) {
        io.to(postAuthorId).emit('post-liked', {
          postId,
          postAuthorId,
          likerId,
          likerName,
          timestamp: new Date()
        })
      }
    })

    // Handle post comments
    socket.on('comment-post', (data) => {
      const { postId, postAuthorId, commenterId, commenterName, comment } = data
      
      // Notify post author if they're online and it's not their own comment
      if (postAuthorId !== commenterId && onlineUsers.has(postAuthorId)) {
        io.to(postAuthorId).emit('post-commented', {
          postId,
          postAuthorId,
          commenterId,
          commenterName,
          comment,
          timestamp: new Date()
        })
      }
    })

    // Handle user follows
    socket.on('follow-user', (data) => {
      const { followedUserId, followerId, followerName } = data
      
      // Notify followed user if they're online
      if (onlineUsers.has(followedUserId)) {
        io.to(followedUserId).emit('new-follower', {
          followedUserId,
          followerId,
          followerName,
          timestamp: new Date()
        })
      }
    })

    // Handle private messages
    socket.on('send-message', (data) => {
      const { receiverId, senderId, message, timestamp } = data
      
      // Send message to receiver if they're online
      if (onlineUsers.has(receiverId)) {
        io.to(receiverId).emit('new-message', {
          senderId,
          senderName: socket.user.name,
          senderUsername: socket.user.username,
          senderAvatar: socket.user.avatar,
          message,
          timestamp
        })
      }

      // Send confirmation back to sender
      socket.emit('message-sent', {
        receiverId,
        message,
        timestamp
      })
    })

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { receiverId } = data
      if (onlineUsers.has(receiverId)) {
        io.to(receiverId).emit('user-typing', {
          userId: socket.userId,
          username: socket.user.username
        })
      }
    })

    socket.on('typing-stop', (data) => {
      const { receiverId } = data
      if (onlineUsers.has(receiverId)) {
        io.to(receiverId).emit('user-stop-typing', {
          userId: socket.userId
        })
      }
    })

    // Handle live streaming events
    socket.on('start-stream', (data) => {
      const { streamTitle, streamDescription } = data
      
      // Notify followers about the new stream
      // This would integrate with your streaming service
      socket.broadcast.emit('stream-started', {
        streamerId: socket.userId,
        streamerName: socket.user.name,
        streamerUsername: socket.user.username,
        streamTitle,
        streamDescription,
        timestamp: new Date()
      })
    })

    socket.on('join-stream', (data) => {
      const { streamId } = data
      socket.join(`stream-${streamId}`)
      
      // Notify stream viewers
      socket.to(`stream-${streamId}`).emit('viewer-joined', {
        viewerId: socket.userId,
        viewerName: socket.user.name
      })
    })

    socket.on('leave-stream', (data) => {
      const { streamId } = data
      socket.leave(`stream-${streamId}`)
      
      // Notify stream viewers
      socket.to(`stream-${streamId}`).emit('viewer-left', {
        viewerId: socket.userId,
        viewerName: socket.user.name
      })
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected`)
      
      // Remove user from online users
      onlineUsers.delete(socket.userId)
      
      // Broadcast updated online users list
      io.emit('online-users', Array.from(onlineUsers.values()).map(u => u.user))
    })
  })
}

export default socketService