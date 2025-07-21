import Post from '../models/Post.js'
import User from '../models/User.js'
import { validationResult } from 'express-validator'

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find({ visibility: 'public' })
      .populate('author', 'name username avatar')
      .populate('comments.author', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)

    const total = await Post.countDocuments({ visibility: 'public' })
    const hasMore = skip + posts.length < total

    res.json({
      success: true,
      posts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasMore
      }
    })
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get posts'
    })
  }
}

// @desc    Get feed posts (posts from followed users)
// @route   GET /api/posts/feed
// @access  Private
export const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const currentUser = await User.findById(req.user._id)
    const followingIds = [...currentUser.following, req.user._id] // Include own posts

    const posts = await Post.find({
      author: { $in: followingIds },
      visibility: { $in: ['public', 'followers'] }
    })
      .populate('author', 'name username avatar')
      .populate('comments.author', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)

    const total = await Post.countDocuments({
      author: { $in: followingIds },
      visibility: { $in: ['public', 'followers'] }
    })
    const hasMore = skip + posts.length < total

    res.json({
      success: true,
      posts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasMore
      }
    })
  } catch (error) {
    console.error('Get feed posts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get feed posts'
    })
  }
}

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name username avatar')
      .populate('comments.author', 'name username avatar')

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Check if user can view this post
    if (post.visibility === 'private' && post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this post'
      })
    }

    res.json({
      success: true,
      post
    })
  } catch (error) {
    console.error('Get post error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get post'
    })
  }
}

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { content, visibility = 'public' } = req.body

    const post = new Post({
      author: req.user._id,
      content,
      visibility
    })

    await post.save()
    await post.populate('author', 'name username avatar')

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    })
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    })
  }
}

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const { content, visibility } = req.body

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts'
      })
    }

    // Update fields
    if (content) post.content = content
    if (visibility) post.visibility = visibility

    await post.save()
    await post.populate('author', 'name username avatar')

    res.json({
      success: true,
      message: 'Post updated successfully',
      post
    })
  } catch (error) {
    console.error('Update post error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update post'
    })
  }
}

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      })
    }

    await Post.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.error('Delete post error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete post'
    })
  }
}

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    const userId = req.user._id
    const isLiked = post.likes.includes(userId)

    if (isLiked) {
      return res.status(400).json({
        success: false,
        message: 'Post already liked'
      })
    }

    post.likes.push(userId)
    await post.save()

    res.json({
      success: true,
      message: 'Post liked successfully',
      likesCount: post.likesCount
    })
  } catch (error) {
    console.error('Like post error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to like post'
    })
  }
}

// @desc    Unlike post
// @route   DELETE /api/posts/:id/like
// @access  Private
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    const userId = req.user._id
    const isLiked = post.likes.includes(userId)

    if (!isLiked) {
      return res.status(400).json({
        success: false,
        message: 'Post not liked yet'
      })
    }

    post.likes = post.likes.filter(id => id.toString() !== userId.toString())
    await post.save()

    res.json({
      success: true,
      message: 'Post unliked successfully',
      likesCount: post.likesCount
    })
  } catch (error) {
    console.error('Unlike post error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to unlike post'
    })
  }
}

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { content } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    const comment = {
      author: req.user._id,
      content,
      createdAt: new Date()
    }

    post.comments.push(comment)
    await post.save()
    await post.populate('comments.author', 'name username avatar')

    const newComment = post.comments[post.comments.length - 1]

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
      commentsCount: post.commentsCount
    })
  } catch (error) {
    console.error('Add comment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    })
  }
}

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Private
export const getUserPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find({ 
      author: req.params.userId,
      $or: [
        { visibility: 'public' },
        { author: req.user._id } // User can see their own private posts
      ]
    })
      .populate('author', 'name username avatar')
      .populate('comments.author', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)

    const total = await Post.countDocuments({ 
      author: req.params.userId,
      $or: [
        { visibility: 'public' },
        { author: req.user._id }
      ]
    })

    res.json({
      success: true,
      posts,
      total
    })
  } catch (error) {
    console.error('Get user posts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user posts'
    })
  }
}

// @desc    Search posts
// @route   GET /api/posts/search?q=query
// @access  Private
export const searchPosts = async (req, res) => {
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

    const posts = await Post.find({
      $and: [
        {
          $or: [
            { content: { $regex: q, $options: 'i' } },
            { hashtags: { $in: [q.toLowerCase()] } }
          ]
        },
        { visibility: 'public' }
      ]
    })
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)

    res.json({
      success: true,
      posts,
      query: q
    })
  } catch (error) {
    console.error('Search posts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to search posts'
    })
  }
}