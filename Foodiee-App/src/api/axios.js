import axios from 'axios';

// Ensure this matches your backend server port
const BASE_URL = 'http://localhost:3002/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request Interceptor: Attaches Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles Errors (Optional: Refresh Token Logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized) & not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Note: This block assumes you have a '/auth/refresh' endpoint.
      // If your backend authController doesn't have it yet, 
      // this will just redirect to login.
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // Call backend to refresh token
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          token: refreshToken,
        });

        const { accessToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Logout if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;