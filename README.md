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



## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [GitHub Classroom Guide](https://docs.github.com/en/education/manage-coursework-with-github-classroom) 


# Render deployment link:
https://week-8-capstone-simonmuriu-cpu.onrender.com/