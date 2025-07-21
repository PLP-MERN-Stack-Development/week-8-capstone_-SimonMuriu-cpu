import User from '../models/User.js'
import Post from '../models/Post.js'
import { validationResult } from 'express-validator'

// @desc    Get all users with pagination
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const users = await User.find({}, '-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)

    const total = await User.countDocuments()

    res.json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    })
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password')
      .populate('followers', 'name username avatar')
      .populate('following', 'name username avatar')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user: user.getPublicProfile()
    })
  } catch (error) {
    console.error('Get user by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    })
  }
}

// @desc    Get user by username
// @route   GET /api/users/username/:username
// @access  Private
export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }, '-password')
      .populate('followers', 'name username avatar')
      .populate('following', 'name username avatar')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user: user.getPublicProfile()
    })
  } catch (error) {
    console.error('Get user by username error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user'
    })
  }
}

// @desc    Follow/Unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id)
    const currentUser = await User.findById(req.user._id)

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      })
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user'
      })
    }

    // Add to following/followers lists
    currentUser.following.push(req.params.id)
    userToFollow.followers.push(req.user._id)

    await currentUser.save()
    await userToFollow.save()

    res.json({
      success: true,
      message: `You are now following ${userToFollow.name}`
    })
  } catch (error) {
    console.error('Follow user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to follow user'
    })
  }
}

// @desc    Unfollow user
// @route   DELETE /api/users/:id/follow
// @access  Private
export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id)
    const currentUser = await User.findById(req.user._id)

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user'
      })
    }

    // Remove from following/followers lists
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.id
    )
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user._id.toString()
    )

    await currentUser.save()
    await userToUnfollow.save()

    res.json({
      success: true,
      message: `You have unfollowed ${userToUnfollow.name}`
    })
  } catch (error) {
    console.error('Unfollow user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to unfollow user'
    })
  }
}

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Private
export const getFollowers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const user = await User.findById(req.params.id)
      .populate({
        path: 'followers',
        select: 'name username avatar bio',
        options: {
          limit: limit,
          skip: (page - 1) * limit
        }
      })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      followers: user.followers,
      total: user.followersCount
    })
  } catch (error) {
    console.error('Get followers error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get followers'
    })
  }
}

// @desc    Get user's following
// @route   GET /api/users/:id/following
// @access  Private
export const getFollowing = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const user = await User.findById(req.params.id)
      .populate({
        path: 'following',
        select: 'name username avatar bio',
        options: {
          limit: limit,
          skip: (page - 1) * limit
        }
      })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      following: user.following,
      total: user.followingCount
    })
  } catch (error) {
    console.error('Get following error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get following list'
    })
  }
}

// @desc    Search users
// @route   GET /api/users/search?q=query
// @access  Private
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } }
      ]
    }, '-password')
      .limit(limit)
      .skip(skip)
      .sort({ followersCount: -1 })

    res.json({
      success: true,
      users,
      query: q
    })
  } catch (error) {
    console.error('Search users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    })
  }
}

// @desc    Get suggested users to follow
// @route   GET /api/users/suggestions
// @access  Private
export const getSuggestedUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    const currentUser = await User.findById(req.user._id)

    // Get users that current user is not following and exclude current user
    const suggestedUsers = await User.find({
      _id: { 
        $ne: req.user._id,
        $nin: currentUser.following 
      }
    }, '-password')
      .sort({ followersCount: -1 })
      .limit(limit)

    res.json({
      success: true,
      users: suggestedUsers
    })
  } catch (error) {
    console.error('Get suggested users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get suggested users'
    })
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (own profile only)
export const updateUser = async (req, res) => {
  try {
    // Only allow users to update their own profile
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      })
    }

    const { name, bio, location, website } = req.body

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Update fields
    if (name) user.name = name
    if (bio !== undefined) user.bio = bio
    if (location !== undefined) user.location = location
    if (website !== undefined) user.website = website

    await user.save()

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    })
  }
}