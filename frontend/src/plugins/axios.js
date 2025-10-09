// src/services/api.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// const api = axios.create({
//   baseURL,
//   withCredentials: true, // send cookies if backend sets them
//   headers: { "Content-Type": "application/json" }
// });

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // important for sending cookies
  headers: { "Content-Type": "application/json" },
});

// Simple request interceptor that reads token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
