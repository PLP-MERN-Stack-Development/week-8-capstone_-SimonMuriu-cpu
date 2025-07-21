import express from 'express'
import { body } from 'express-validator'
import {
  getPosts,
  getFeedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getUserPosts,
  searchPosts
} from '../controllers/postController.js'
import auth from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'

const router = express.Router()

// Validation rules
const postValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage('Post content must be between 1 and 280 characters'),
  body('visibility')
    .optional()
    .isIn(['public', 'followers', 'private'])
    .withMessage('Visibility must be public, followers, or private')
]

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage('Comment must be between 1 and 280 characters')
]

// All routes require authentication
router.use(auth)

// Routes
router.get('/', getPosts)
router.get('/feed', getFeedPosts)
router.get('/search', searchPosts)
router.get('/user/:userId', getUserPosts)
router.get('/:id', getPost)
router.post('/', postValidation, validate, createPost)
router.put('/:id', postValidation, validate, updatePost)
router.delete('/:id', deletePost)
router.post('/:id/like', likePost)
router.delete('/:id/like', unlikePost)
router.post('/:id/comments', commentValidation, validate, addComment)

export default router