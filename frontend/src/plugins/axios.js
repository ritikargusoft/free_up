import axios from "axios";
import store from "../stores/index.js";
const api = axios.create({
  baseURL: "http://localhost:3000", // base backend origin
  withCredentials: true, // send cookies (important for refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});
// attach access token (if present) to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// optional: simple 401 handler - will logout on unauthorized
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // if 401 and we are not on refresh endpoint, remove auth and redirect to login
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/users/refresh-token")
    ) {
      try {
        // try refresh token once
        await api.post(
          "/users/refresh-token",
          {},
          { headers: { "Content-Type": "application/json" } }
        );
        // if refresh succeeded, retry original request
        return api(error.config);
      } catch (refreshErr) {
        // refresh failed => clear state and redirect
        store.dispatch("auth/logout");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
export default api;
