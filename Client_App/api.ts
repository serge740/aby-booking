// services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import ENV from './env';

const TOKEN_KEY = 'client_token';

// Create axios instance
const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - automatically attach token to every request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get token from SecureStore
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      
      if (token && config.headers) {
        // Attach token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token attached to request:', config.url);
      } else {
        console.log('⚠️ No token found for request:', config.url);
      }
    } catch (error) {
      console.error('❌ Error getting token from SecureStore:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    // Any status code within 2xx will trigger this
    console.log('✅ Response success:', response.config.url, response.status);
    return response;
  },
  async (error: AxiosError) => {
    // Any status code outside 2xx will trigger this
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('🔄 Token expired, clearing and redirecting to login...');
        
        // Clear invalid token
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        
        // You can emit an event or use navigation here to redirect to login
        // Example: navigation.navigate('Login');
        
      } catch (clearError) {
        console.error('Error clearing token:', clearError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('🚫 Access forbidden:', error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('🔥 Server error:', error.response.data);
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('🌐 Network error - check your internet connection');
    }

    return Promise.reject(error);
  }
);

export default api;