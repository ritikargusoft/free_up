import axios from "axios";
import store from "../stores/index.js";

const backednURL = Process.env.VITE_API_URL;
const api = axios.create({
  baseURL: backednURL,
  withCredentials: true, 
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

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/users/refresh-token")
    ) {
      try {
        await api.post(
          "/users/refresh-token",
          {},
          { headers: { "Content-Type": "application/json" } }
        );
        return api(error.config);
      } catch (refreshErr) {
        store.dispatch("auth/logout");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
export default api;
