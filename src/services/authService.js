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
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
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
