import axiosClient from '../api/axiosClient';

/**
 * Authentication API Service
 */
export const authAPI = {
  login: async (email, credential) => {
    // Support sending the credential as both studentId and password 
    // to align with the backend's unified login logic.
    return await axiosClient.post('/auth/login', { 
      email, 
      studentId: credential,
      password: credential 
    });
  },

  register: async (userData) => {
    return await axiosClient.post('/auth/register', userData);
  },

  getMe: async () => {
    return await axiosClient.get('/auth/me');
  },

  logout: async () => {
    return await axiosClient.post('/auth/logout');
  },
};

/**
 * User & Admin Management API Service
 */
export const userAPI = {
  getProfile: async () => {
    return await axiosClient.get('/users/profile');
  },

  updateProfile: async (data) => {
    return await axiosClient.put('/users/profile', data);
  },

  changePassword: async (data) => {
    return await axiosClient.put('/users/change-password', data);
  },

  // ==========================================
  // Admin User Management Endpoints
  // ==========================================
  
  getUserStats: async () => {
    return await axiosClient.get('/users/stats');
  },

  getAllUsers: async (params = {}) => {
    // Axios automatically serializes the params object into query strings
    return await axiosClient.get('/users', { params });
  },

  updateUserRoleOrStatus: async (userId, data) => {
    return await axiosClient.put(`/users/${userId}/role-status`, data);
  },

  deleteUser: async (userId) => {
    return await axiosClient.delete(`/users/${userId}`);
  },
};

export default { auth: authAPI, user: userAPI };