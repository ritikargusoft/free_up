import {
  loginUser,
  registerUser,
  logoutUser,
} from "../../features/auth/api/authService.js";
import { changePassword as apiChangePassword } from "../../features/auth/api/userService.js";
import {
  updateUser as apiUpdateUser,
  getUserById,
} from "../../features/auth/api/userService.js";
import { toast } from "vue3-toastify";
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
      } catch (err) {}
      commit("clearAuth");
    },

    async updateProfile({ commit, state }, payload) {
      const userUuid =
        state.user?.user_uuid || state.user?.userId || state.user?.id;
      if (!userUuid) {
        const err = new Error("User not found");
        toast.error("User not found");
        throw err;
      }
      const res = await apiUpdateUser(userUuid, payload);
      const updatedUser = res.user || res;
      if (updatedUser) {
        commit("setUser", updatedUser);
        toast.success("Profile updated");
      } else {
        toast.success("Profile updated");
      }
      return updatedUser;
    },
    async refreshUser({ commit, state }) {
      const userUuid =
        state.user?.user_uuid || state.user?.userId || state.user?.id;
      if (!userUuid) return null;
      const res = await getUserById(userUuid);
      const updatedUser = res.user || res;
      if (updatedUser) commit("setUser", updatedUser);
      return updatedUser;
    },

    async changePassword({ state }, { oldPassword, newPassword }) {
      const userUuid =
        state.user?.user_uuid || state.user?.userId || state.user?.id;
      if (!userUuid) {
        const err = new Error("User not found");
        toast.error("User not found");
        throw err;
      }

      try {
        const res = await apiChangePassword(userUuid, oldPassword, newPassword);
        toast.success(res?.message || "Password saved sucessfuly");
        return res;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Password was not saved";
        toast.error(msg);
        throw err;
      }
    },
  },
};
