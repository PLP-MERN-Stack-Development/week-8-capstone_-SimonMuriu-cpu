import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import connectDB from './config/database.js'
import errorHandler from './middleware/errorHandler.js'
import rateLimiter from './middleware/rateLimiter.js'
import socketHandler from './services/socketService.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

// Create Express app
const app = express()
const server = createServer(app)

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}))
app.use(compression())

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
app.use('/api/', rateLimiter)

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../client/dist')
  app.use(express.static(clientDistPath))

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

// Socket.IO connection handling
socketHandler(io)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode
📡 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
📊 Health check: http://localhost:${PORT}/health
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})

export default app