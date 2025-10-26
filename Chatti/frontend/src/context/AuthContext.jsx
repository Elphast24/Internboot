import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get API instance with current token
  const getApi = () => {
    const token = localStorage.getItem('token');
    const api = axios.create({
      baseURL: `{import.meta.env.VITE_API_URI}/api`,
    });

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return api;
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const api = getApi();
        const response = await api.get('/auth/me');
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Auth check failed:', error.response?.data?.message || error.message);
        // Clear invalid token
        localStorage.removeItem('token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      const api = getApi();
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setCurrentUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const api = getApi();
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setCurrentUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
