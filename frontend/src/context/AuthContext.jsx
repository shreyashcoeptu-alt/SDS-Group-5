import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api'; // Removed userAPI if it was unused, add back if needed

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const getStoredToken = () =>
    localStorage.getItem('the_lunchroom_token') ||
    localStorage.getItem('cafeteria_token') ||
    localStorage.getItem('token');

  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveToken = (tok) => {
    localStorage.setItem('the_lunchroom_token', tok);
    localStorage.setItem('cafeteria_token', tok);
    localStorage.setItem('token', tok);
  };

  const clearToken = () => {
    localStorage.removeItem('the_lunchroom_token');
    localStorage.removeItem('cafeteria_token');
    localStorage.removeItem('token');
  };

  // Initialize and verify existing session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        // Handle both Fetch API (direct return) and Axios (.data wrapper)
        const data = response?.data !== undefined ? response.data : response;
        
        if (data?.success && data?.user) {
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token invalid
          clearToken();
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.warn('Session verification expired or failed. Clearing token.');
        clearToken();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const data = res?.data !== undefined ? res.data : res;
    
    if (data?.success && data?.token) {
      saveToken(data.token);
      setToken(data.token);
      setUser(data.user || data.student);
      return data.user || data.student;
    }
    throw new Error(data?.message || 'Login failed.');
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const data = res?.data !== undefined ? res.data : res;
    
    if (data?.success && data?.token) {
      saveToken(data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
    throw new Error(data?.message || 'Registration failed.');
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      clearToken();
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  const isAdmin = user?.role === 'cafeteria_admin' || user?.role === 'admin' || user?.role === 'staff';
  const isCustomer = user?.role === 'customer' || user?.role === 'student' || (!isAdmin && !!user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isCustomer,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};