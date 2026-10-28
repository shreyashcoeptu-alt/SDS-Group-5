import axiosClient from '../api/axiosClient';

/**
 * Authentication API Service (Student 1)
 */
export const authAPI = {
  login: async (email, credential) => {
    return await axiosClient.post('/auth/login', {
      email,
      password: credential,
      studentId: credential,
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

export const userAPI = {
  getProfile: async () => {
    return await axiosClient.get('/auth/me');
  },
};

export default { auth: authAPI, user: userAPI };

