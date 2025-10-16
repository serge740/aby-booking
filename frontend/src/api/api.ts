import axios, { type AxiosInstance } from "axios";

export const API_URL: string = import.meta.env.VITE_API_URL as string;

// Create an axios instance with a base URL
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Example usage
// api.get('/users') will make a request to https://api.example.com/users

export default api;
