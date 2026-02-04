import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../config/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function that can be called from anywhere
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // Handle token expiration - called by axios interceptor
  const handleTokenExpiration = useCallback(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    // Store logout handler globally so axios interceptor can access it
    window.handleAuthLogout = handleTokenExpiration;

    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Token exists - user will be verified on first API call
      // If token is invalid, axios interceptor will handle it
      // For now, set a placeholder user object
      setUser({ authenticated: true });
    }
    setLoading(false);

    // Cleanup
    return () => {
      delete window.handleAuthLogout;
    };
  }, [handleTokenExpiration]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

