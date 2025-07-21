import api from './api'

export const postService = {
  async getPosts(page = 1, limit = 10) {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`)
    return response
  },

  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`)
    return response
  },

  async createPost(postData) {
    const response = await api.post('/posts', postData)
    return response
  },

  async updatePost(postId, postData) {
    const response = await api.put(`/posts/${postId}`, postData)
    return response
  },

  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`)
    return response
  },

  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like`)
    return response
  },

  async unlikePost(postId) {
    const response = await api.delete(`/posts/${postId}/like`)
    return response
  },

  async getPostLikes(postId) {
    const response = await api.get(`/posts/${postId}/likes`)
    return response
  },

  async addComment(postId, commentData) {
    const response = await api.post(`/posts/${postId}/comments`, commentData)
    return response
  },

  async updateComment(postId, commentId, commentData) {
    const response = await api.put(`/posts/${postId}/comments/${commentId}`, commentData)
    return response
  },

  async deleteComment(postId, commentId) {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`)
    return response
  },

  async getComments(postId, page = 1, limit = 10) {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`)
    return response
  },

  async getUserPosts(userId, page = 1, limit = 10) {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`)
    return response
  },

  async getFeedPosts(page = 1, limit = 10) {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`)
    return response
  },

  async searchPosts(query, page = 1, limit = 10) {
    const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    return response
  }
}