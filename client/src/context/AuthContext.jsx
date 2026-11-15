import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService.js';
import { storage } from '../services/storageService.js';
import { mockDefaultUser } from '../data/mockData.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser() || mockDefaultUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no user exists, initialize with default demo user
    if (!storage.getUser()) {
      storage.setUser(mockDefaultUser);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const newUser = await authService.signup(name, email, password);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    storage.setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
