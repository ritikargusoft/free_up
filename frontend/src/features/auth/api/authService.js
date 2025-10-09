import api from "@/plugins/axios";

// Register -> POST /users
export const registerUser = async (formData) => {
  const res = await api.post("/users", formData);
  return res.data;
};

// Login -> POST /users/login
export const loginUser = async (credentials) => {
  const res = await api.post("/users/login", credentials);
  return res.data;
};

// Logout -> POST /users/logout
export const logoutUser = async () => {
  const res = await api.post("/users/logout");
  return res.data;
};