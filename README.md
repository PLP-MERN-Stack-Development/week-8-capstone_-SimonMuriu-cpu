# Social Media MERN App

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring real-time chat, live streaming, and modern social features.

## 🚀 Features

- **User Authentication**: JWT-based auth with secure login/register
- **Social Features**: Posts, comments, likes, follows, user profiles
- **Real-time**: Socket.io powered notifications and chat
- **Live Streaming**: WebRTC integration with external service support
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Modern Stack**: Latest versions of React, Node.js, and MongoDB

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API calls and external services
│   │   ├── context/        # React context providers
│   │   ├── utils/          # Helper functions
│   │   └── assets/         # Static assets
│   └── public/
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── config/         # Configuration files
│   └── tests/              # Backend tests
├── docs/                   # Documentation
└── .github/               # CI/CD workflows
```

## 🛠️ Tech Stack

**Frontend:**
- React.js (JavaScript)
- React Router for navigation
- Tailwind CSS for styling
- Socket.io client for real-time features
- Axios for API calls

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose ODM
- Socket.io for real-time communication
- JWT for authentication
- Multer for file uploads
- Express rate limiting

**Testing:**
- Jest + Supertest (Backend)
- React Testing Library (Frontend)
- Cypress (E2E - optional)

## 🚀 Quick Start

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd social-media-mern
   npm run setup
   ```

2. **Environment Variables**
   ```bash
   # Copy environment files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 🌐 Environment Variables

### Server (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLOUDINARY_URL` - Image upload service
- `PORT` - Server port (default: 5000)

### Client (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_SOCKET_URL` - Socket.io server URL

## 📚 API Documentation

The API follows RESTful conventions:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/users/:id` - Get user profile

## 🚀 Deployment

**Frontend (Vercel/Netlify)**
```bash
cd client && npm run build
```

**Backend (Render/Railway)**
```bash
cd server && npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.