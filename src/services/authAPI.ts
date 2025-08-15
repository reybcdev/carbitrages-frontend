import axios from 'axios';
import { User } from '@/store/slices/authSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Store tokens in localStorage
    const { accessToken, refreshToken } = response.data.data.tokens;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string;
  }) => {
    const response = await apiClient.post('/auth/register', userData);
    
    // Store tokens in localStorage
    const { accessToken, refreshToken } = response.data.data.tokens;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  refreshToken: async (refreshToken: string) => {
    return await apiClient.post('/auth/refresh-token', { refreshToken });
  },

  forgotPassword: async (email: string) => {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string) => {
    return await apiClient.post('/auth/reset-password', { token, password });
  },

  verifyEmail: async (token: string) => {
    return await apiClient.get(`/auth/verify-email/${token}`);
  },

  resendVerification: async () => {
    return await apiClient.post('/auth/resend-verification');
  },

  getProfile: async () => {
    return await apiClient.get('/users/profile');
  },

  updateProfile: async (profileData: Partial<User>) => {
    return await apiClient.put('/users/profile', profileData);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return await apiClient.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
  },

  updatePreferences: async (preferences: any) => {
    return await apiClient.put('/users/preferences', { preferences });
  },

  deleteAccount: async () => {
    return await apiClient.delete('/users/account');
  },
};
