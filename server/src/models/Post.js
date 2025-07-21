import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxLength: [280, 'Post cannot exceed 280 characters']
  },
  image: {
    url: String,
    publicId: String
  },
  video: {
    url: String,
    publicId: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: [280, 'Comment cannot exceed 280 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  hashtags: [{
    type: String,
    lowercase: true
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isRepost: {
    type: Boolean,
    default: false
  },
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual fields
postSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0
})

postSchema.virtual('commentsCount').get(function() {
  return this.comments ? this.comments.length : 0
})

// Indexes
postSchema.index({ author: 1, createdAt: -1 })
postSchema.index({ hashtags: 1 })
postSchema.index({ content: 'text' })
postSchema.index({ createdAt: -1 })

// Pre-save middleware to extract hashtags and mentions
postSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Extract hashtags
    const hashtagRegex = /#(\w+)/g
    const hashtags = []
    let match
    while ((match = hashtagRegex.exec(this.content)) !== null) {
      hashtags.push(match[1].toLowerCase())
    }
    this.hashtags = [...new Set(hashtags)]

    // Extract mentions would go here
    // This is a simplified version - in production you'd want to validate mentioned users exist
  }
  next()
})

// Static methods
postSchema.statics.getFeedPosts = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit
  
  return this.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: '$author'
    },
    {
      $match: {
        $or: [
          { 'author.followers': userId },
          { 'author._id': userId }
        ],
        visibility: { $in: ['public', 'followers'] }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: 'comments.author',
        foreignField: '_id',
        as: 'commentAuthors'
      }
    }
  ])
}

export default mongoose.model('Post', postSchema)