import express from 'express'
import { body } from 'express-validator'
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController.js'
import auth from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'

const router = express.Router()

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

const profileUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 160 })
    .withMessage('Bio cannot exceed 160 characters'),
  body('location')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Location cannot exceed 50 characters'),
  body('website')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Website URL cannot exceed 100 characters')
]

const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
]

// Routes
router.post('/register', registerValidation, validate, register)
router.post('/login', loginValidation, validate, login)
router.get('/me', auth, getCurrentUser)
router.put('/profile', auth, profileUpdateValidation, validate, updateProfile)
router.put('/password', auth, passwordChangeValidation, validate, changePassword)
router.post('/logout', auth, logout)

export default router