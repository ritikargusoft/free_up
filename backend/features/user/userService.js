import * as userModel from "./userModel.js";
import bcrypt from "bcrypt";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../../utils/helper.js";
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

export async function loginUser(email, plainPassword) {
  const user = await userModel.getUserByEmail(email);
  if (!user) throw new Error("Invalid email or password");
  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const payload = {
    user_uuid: user.user_uuid,
    user_id: user.user_id,
    email: user.email,
  };
  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  //   delete user.password; //so that we don't return password or store it
  return { user, token, refreshToken };
}

export async function refreshTokens(refresh) {
  const decoded = verifyRefreshToken(refresh);
  if (!decoded) throw new Error("Invalid refresh token");
  const payload = { user_uuid: decoded.user_uuid, user_id: decoded.user_id, email: decoded.email };
  const accessToken = generateToken(payload);
  const newRefresh = generateRefreshToken(payload);
  return { accessToken, refreshToken: newRefresh };
}

export async function getAllUsers() {
  const users = await userModel.getAllUsers();
  // remove passwords
  return users.map((u) => {
    // delete u.password;
    return u;
  });
}

export async function createUser(data) {
  if (!data.email || !data.password)
    throw new Error("Email and password required");
  const existing = await userModel.getUserByEmail(data.email);
  if (existing) throw new Error("Email already registered");
  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

  const payload = {
    name: data.name || null,
    email: data.email.toLowerCase(),
    password: hashed,
    phone: data.phone || null,
    address: data.address || null,
  };
  const user = await userModel.createUser(payload);
  //delete user.password;
  return user;
}

export async function getUser(id) {
  const user = await userModel.getUserByUuid(id);
  if (!user) throw new Error("User not found");
  // delete user.password
  return user;
}

export async function changePassword(user_uuid, oldPassword, newPassword) {
  // const { oldPassword, newPassword } = body;
  const user = await userModel.getUserByUuid(user_uuid);
  console.log();

  if (!user) throw new Error("User not found");

  if (!oldPassword && !newPassword) {
    const err = new Error("Old password and new password required");
    throw err;
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");
  console.log("NEW PAssword ", newPassword);

  const hashed = await bcrypt.hash(String(newPassword), SALT_ROUNDS);
  console.log(hashed);

  const updated = userModel.changePassword(user_uuid, hashed);
  if (!updated) {
    const err = new Error("error");
    throw err;
  }
  return { user_uuid: updated.user_uuid, user_id: updated.user_id };
}


export async function deleteUser(user_uuid) {
  await userModel.deleteUser(user_uuid);
}


export const updateUser = async (user_uuid, data) => {
  // you may add permission checks at controller level
  const user = await userModel.updateUser(user_uuid, data);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
};