import express from 'express'
import {
  getUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  getSuggestedUsers
} from '../controllers/userController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(auth)

// Routes
router.get('/', getUsers)
router.get('/search', searchUsers)
router.get('/suggestions', getSuggestedUsers)
router.get('/username/:username', getUserByUsername)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.post('/:id/follow', followUser)
router.delete('/:id/follow', unfollowUser)
router.get('/:id/followers', getFollowers)
router.get('/:id/following', getFollowing)

export default router