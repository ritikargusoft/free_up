import { loginUser, registerUser } from "@/features/auth/api/authService";

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
      localStorage.setItem("accessToken", token);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      localStorage.clear();
    },
  },
  actions: {
    async register({ commit }, data) {
      const res = await registerUser(data);
      commit("setUser", res.user);
      commit("setAccessToken", res.token);
    },
    async login({ commit }, data) {
      const res = await loginUser(data);
      commit("setUser", res.user);
      commit("setAccessToken", res.token);
    },
    logout({ commit }) {
      commit("logout");
    },
  },
};
