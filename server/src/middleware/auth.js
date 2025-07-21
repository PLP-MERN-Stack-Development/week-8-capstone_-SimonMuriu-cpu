import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      const user = await User.findById(decoded.userId).select('-password')
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but user not found'
        })
      }

      req.user = user
      next()
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    })
  }
}

export default auth