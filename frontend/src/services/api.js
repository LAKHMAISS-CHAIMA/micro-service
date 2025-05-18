import axios from 'axios';

const API_URL = 'http://localhost:8000';
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('session', JSON.stringify(response.data));
    return response.data;
  },
  
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },
  
  logout: () => {
    localStorage.removeItem('session');
  },
  
  getMe: async () => {
    return await api.get('/auth/me-jwt');
  }
};

export const userService = {
  updateUsername: async (username) => {
    return await api.patch('/users/update-username', { username });
  },
  
  requestEmailUpdate: async (email) => {
    return await api.post('/users/request-email-update', { email });
  },
  
  confirmEmailUpdate: async (token, email) => {
    return await api.patch(`/users/confirm-email-update?token=${token}`, { email });
  },
  
  forgotPassword: async (email) => {
    return await api.post('/users/forgot-password', { email });
  },
  
  resetPassword: async (token, newPassword) => {
    return await api.post(`/users/reset-password?token=${token}`, { newPassword });
  }
};

export const adminService = {
  getLogs: async () => {
    return await api.get('/users/admin/logs');
  }
};

export default api;