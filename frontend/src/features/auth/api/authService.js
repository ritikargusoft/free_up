import api from "@/plugins/axios";

export const registerUser = async (formData) => {
  const res = await api.post("/users/register", formData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await api.post("/users/login", credentials);
  return res.data;
};
