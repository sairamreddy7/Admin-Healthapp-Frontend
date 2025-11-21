import api from './api';

export const authService = {
  async login(email, password) {
    // Azure backend uses 'username' instead of 'email'
    const response = await api.post('/auth/login', { username: email, password });
    if (response.data.token || response.data.data?.token) {
      const token = response.data.token || response.data.data?.token;
      const user = response.data.user || response.data.data;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
    }
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    try {
      // Try the primary endpoint first
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      // If 404, the endpoint doesn't exist
      if (error.response?.status === 404) {
        console.error('Change password endpoint not found. Available endpoints may differ.');
        throw new Error('Password change feature is not available on the backend. Please contact your system administrator.');
      }
      // Re-throw other errors
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getCurrentUser() {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('adminToken');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
