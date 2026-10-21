// Base API URL: Uses relative path so Vite proxy (or production reverse proxy) handles it
const API_BASE = '/api';

/**
 * Helper to get authorization headers with JWT
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('cafeteria_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Generic request wrapper with comprehensive error handling
 */
const request = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({
      success: false,
      message: 'Failed to parse JSON response from server.',
    }));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
};

export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () =>
    request('/auth/me', {
      method: 'GET',
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),
};

export const userAPI = {
  getProfile: () =>
    request('/users/profile', {
      method: 'GET',
    }),

  updateProfile: (data) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (data) =>
    request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Admin user management
  getUserStats: () =>
    request('/users/stats', {
      method: 'GET',
    }),

  getAllUsers: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/users${queryString}`, {
      method: 'GET',
    });
  },

  updateUserRoleOrStatus: (userId, data) =>
    request(`/users/${userId}/role-status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUser: (userId) =>
    request(`/users/${userId}`, {
      method: 'DELETE',
    }),
};

export default { auth: authAPI, user: userAPI };
