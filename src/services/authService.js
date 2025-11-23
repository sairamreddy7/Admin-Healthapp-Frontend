// src/services/authService.js
import api from './api';

export const authService = {
  async login(username, password) {
    // Use AD-based staff login so it checks VM1 and then creates/updates user in DB
    const response = await api.post('/auth/staff-ad-login', {
      username,
      password,
    });

    const payload = response.data || {};

    // If backend indicates failure, surface the message
    if (!payload.success) {
      throw new Error(
        payload.message || 'Unable to sign in. Please check your credentials.'
      );
    }

    const data = payload.data || {};

    // Enforce that ONLY ADMIN users can access this admin portal
    if (!data.role || data.role.toUpperCase() !== 'ADMIN') {
      throw new Error(
        'You are not authorized to access the admin portal. Please use an administrator account.'
      );
    }

    if (!data.token) {
      throw new Error('Login successful but token is missing from response.');
    }

    // Store token and user for admin SPA
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(data));

    return data;
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
  },
};
