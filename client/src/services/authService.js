import api from './api.js';
import { storage } from './storageService.js';
import { mockDefaultUser } from '../data/mockData.js';

export const authService = {
  async login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.user && res.token) {
        storage.setUser(res.user);
        storage.setToken(res.token);
        return res.user;
      }
    } catch (err) {
      console.warn('[AuthService] Backend login error, using demo session:', err.message);
    }
    // Fallback demo user
    const user = { ...mockDefaultUser, email: email || mockDefaultUser.email };
    storage.setUser(user);
    storage.setToken('mock-jwt-token-12345');
    return user;
  },

  async signup(name, email, password) {
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      if (res.user && res.token) {
        storage.setUser(res.user);
        storage.setToken(res.token);
        return res.user;
      }
    } catch (err) {
      console.warn('[AuthService] Backend signup error, creating demo user session:', err.message);
    }
    const user = {
      ...mockDefaultUser,
      _id: `user-${Date.now()}`,
      name: name || 'Learner',
      email: email || 'learner@studyflow.ai',
    };
    storage.setUser(user);
    storage.setToken('mock-jwt-token-12345');
    return user;
  },

  async getCurrentUser() {
    try {
      const res = await api.get('/auth/me');
      if (res.user) {
        storage.setUser(res.user);
        return res.user;
      }
    } catch (err) {
      // Use local storage
    }
    return storage.getUser() || mockDefaultUser;
  },

  logout() {
    storage.clearAuth();
  },
};
