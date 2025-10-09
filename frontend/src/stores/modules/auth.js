// import { loginUser, registerUser, logoutUser } from "@/features/auth/api/authService";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../../features/auth/api/authService.js";
export default {
  namespaced: true,
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    accessToken: localStorage.getItem("accessToken") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    user: (state) => state.user,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    setAccessToken(state, token) {
      state.accessToken = token;
      if (token) localStorage.setItem("accessToken", token);
      else localStorage.removeItem("accessToken");
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
  actions: {
    async register({ commit }, data) {
      const res = await registerUser(data);
      const user = res.user || res;
      const token = res.accessToken || res.token || null;
      if (user) commit("setUser", user);
      if (token) commit("setAccessToken", token);
      return res;
    },

    async login({ commit }, data) {
      const res = await loginUser(data);
      const user = res.user || res;
      const token = res.accessToken || res.token || null;
      if (user) commit("setUser", user);
      if (token) commit("setAccessToken", token);
      return res;
    },
    async logout({ commit }) {
      try {
        await logoutUser();
      } catch (err) {
      }
      commit("clearAuth");
    },
  },
};
