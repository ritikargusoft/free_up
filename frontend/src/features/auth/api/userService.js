import api from "@/plugins/axios";

// PUT /users/:id
export async function updateUser(user_uuid, payload) {
  // backend expects user id as path param, ensure you pass uuid
  const res = await api.put(`/users/${encodeURIComponent(user_uuid)}`, payload);
  return res.data;
}
// GET /users/:id
export async function getUserById(user_uuid) {
  const res = await api.get(`/users/${encodeURIComponent(user_uuid)}`);
  return res.data;
}


//CHANGE password
export async function changePassword(user_uuid, oldPassword, newPassword) {
    const res = await api.put(`/users/${encodeURIComponent(user_uuid)}/password`,{
        oldPassword,
        newPassword
    });
    return res.data
}
