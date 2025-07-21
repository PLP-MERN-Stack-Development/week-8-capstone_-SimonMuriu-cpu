import api from './api'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Continue with logout even if server request fails
      console.error('Logout request failed:', error)
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData)
    return response
  },

  async changePassword(passwordData) {
    const response = await api.put('/auth/password', passwordData)
    return response
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response
  },

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password })
    return response
  },

  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token })
    return response
  }
}