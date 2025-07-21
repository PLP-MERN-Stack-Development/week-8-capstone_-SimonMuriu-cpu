# Architecture Overview

## System Architecture

The application follows a microservices-like architecture with clear separation between frontend and backend.

### Frontend (React.js)
- **Framework**: React 18 with functional components and hooks
- **Routing**: React Router for client-side navigation
- **State Management**: React Query for server state, Context API for global state
- **Styling**: Tailwind CSS for utility-first styling
- **Real-time**: Socket.io client for live features

### Backend (Node.js/Express)
- **Framework**: Express.js with ES modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based stateless authentication
- **Real-time**: Socket.io server for websocket connections
- **Security**: Helmet, CORS, rate limiting

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  avatar: String,
  bio: String,
  location: String,
  website: String,
  followers: [ObjectId],
  following: [ObjectId],
  isPrivate: Boolean,
  isVerified: Boolean,
  lastActive: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Posts Collection
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User),
  content: String,
  image: {
    url: String,
    publicId: String
  },
  video: {
    url: String,
    publicId: String
  },
  likes: [ObjectId],
  comments: [{
    author: ObjectId (ref: User),
    content: String,
    createdAt: Date
  }],
  hashtags: [String],
  mentions: [ObjectId],
  visibility: String (enum),
  createdAt: Date,
  updatedAt: Date
}
```

### Security Features
- Password hashing with bcrypt
- JWT token expiration
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers

### Real-time Features
Socket.io handles:
- Live notifications
- Real-time messaging
- Online user status
- Live streaming events
- Typing indicators

### File Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React contexts
│   │   └── utils/          # Utilities
│   └── public/
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── config/         # Configuration
│   └── tests/
└── docs/                   # Documentation
```

### Deployment Architecture
- **Frontend**: Static hosting (Vercel/Netlify)
- **Backend**: Container hosting (Render/Railway)
- **Database**: MongoDB Atlas (cloud)
- **CDN**: Cloudinary for media files
- **Monitoring**: Built-in health checks
</boltAccount>