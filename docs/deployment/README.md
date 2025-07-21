# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or Atlas)
- Git repository
- Domain name (for production)

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
CLIENT_URL=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
VITE_APP_NAME=Social Media App
```

## Local Development

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd social-media-mern
   ```

2. **Install Dependencies**
   ```bash
   npm run setup
   ```

3. **Environment Setup**
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   # Edit the .env files with your values
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## Production Deployment

### Backend Deployment (Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository

2. **Create Web Service**
   - Choose "Web Service"
   - Connect repository
   - Set build command: `cd server && npm install`
   - Set start command: `cd server && npm start`

3. **Environment Variables**
   - Add all backend environment variables in Render dashboard

4. **Database Setup**
   - Create MongoDB Atlas cluster
   - Whitelist Render IP addresses
   - Update MONGODB_URI in environment variables

### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository

2. **Project Settings**
   - Framework: Vite
   - Build command: `cd client && npm run build`
   - Output directory: `client/dist`

3. **Environment Variables**
   - Add frontend environment variables in Vercel dashboard

### Alternative: Railway Deployment

**Backend on Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd server
railway deploy
```

### Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/social-media
    depends_on:
      - mongo
      
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
      
volumes:
  mongo-data:
```

## Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Monitor uptime with services like UptimeRobot

### Logging
- Use structured logging in production
- Consider services like LogRocket or Sentry

### Performance
- Enable compression middleware
- Use CDN for static assets
- Monitor with tools like New Relic

### Backup Strategy
- Regular MongoDB backups
- Environment variable backups
- Code repository backups

## Security Checklist
- [ ] Use HTTPS in production
- [ ] Rotate JWT secrets regularly
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities
- [ ] Use strong passwords
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Use secure headers