import axios from "axios";

// Centralized Backend Base URL
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) 
  || "https://mit-college-backend.onrender.com" 
  || "http://192.168.1.8:3001";

export const API_PREFIX = "/mit";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 15000,
});

// Request Interceptor: Attach Authorization Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    let token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      // Ensure clean token without quotes
      token = token.replace(/^"(.*)"$/, "$1");
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 & 403 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid session if token expired
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
