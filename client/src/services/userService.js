import api from './api'

export const userService = {
  async getUsers(page = 1, limit = 10) {
    const response = await api.get(`/users?page=${page}&limit=${limit}`)
    return response
  },

  async getUser(userId) {
    const response = await api.get(`/users/${userId}`)
    return response
  },

  async getUserByUsername(username) {
    const response = await api.get(`/users/username/${username}`)
    return response
  },

  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData)
    return response
  },

  async followUser(userId) {
    const response = await api.post(`/users/${userId}/follow`)
    return response
  },

  async unfollowUser(userId) {
    const response = await api.delete(`/users/${userId}/follow`)
    return response
  },

  async getFollowers(userId, page = 1, limit = 10) {
    const response = await api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`)
    return response
  },

  async getFollowing(userId, page = 1, limit = 10) {
    const response = await api.get(`/users/${userId}/following?page=${page}&limit=${limit}`)
    return response
  },

  async searchUsers(query, page = 1, limit = 10) {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    return response
  },

  async getSuggestedUsers(limit = 5) {
    const response = await api.get(`/users/suggestions?limit=${limit}`)
    return response
  },

  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  },

  async removeAvatar() {
    const response = await api.delete('/users/avatar')
    return response
  }
}