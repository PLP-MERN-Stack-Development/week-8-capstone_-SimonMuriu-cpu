# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "errors": array (only on validation errors)
}
```

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `PUT /auth/password` - Change password
- `POST /auth/logout` - Logout user

### Users
- `GET /users` - Get all users (paginated)
- `GET /users/search?q=query` - Search users
- `GET /users/suggestions` - Get suggested users
- `GET /users/:id` - Get user by ID
- `GET /users/username/:username` - Get user by username
- `PUT /users/:id` - Update user profile
- `POST /users/:id/follow` - Follow user
- `DELETE /users/:id/follow` - Unfollow user
- `GET /users/:id/followers` - Get user followers
- `GET /users/:id/following` - Get user following

### Posts
- `GET /posts` - Get all posts (paginated)
- `GET /posts/feed` - Get feed posts
- `GET /posts/search?q=query` - Search posts
- `GET /posts/user/:userId` - Get user posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/like` - Like post
- `DELETE /posts/:id/like` - Unlike post
- `POST /posts/:id/comments` - Add comment

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Higher limits for authenticated users

## Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error