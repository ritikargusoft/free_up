import pool from "../../db/connectDB.js";

export const getAllUsers = async () => {
  const q = `SELECT user_uuid, user_id, name, email, phone, isAdmin, address, created_at, updated_at FROM users ORDER BY created_at DESC`;
  const r = await pool.query(q);
  return r.rows;
};

export const getUserByUuid = async (user_uuid) => {
  const q = `SELECT user_uuid, user_id, name, email, phone ,password, isAdmin, address, created_at, updated_at FROM users WHERE user_uuid = $1`;
  const r = await pool.query(q, [user_uuid]);
  return r.rows[0] ?? null;
};

export const getUserById = async (user_id) => {
  const q = `SELECT user_uuid, user_id, name, email, phone ,password, isAdmin, address, created_at, updated_at FROM users WHERE user_id = $1`;
  const r = await pool.query(q, [user_id]);
  return r.rows[0] ?? null;
};

export const getUserByEmail = async (email) => {
  const q = `SELECT user_uuid, user_id, name, email, phone, password, isAdmin, address, created_at, updated_at FROM users WHERE email = $1`;
  const r = await pool.query(q, [email]);
  return r.rows[0] ?? null;
};

export const createUser = async ({ name, email, password, phone, address }) => {
  const q = `INSERT INTO users(name, email, password, phone, address, created_at, updated_at)
    VALUES($1,$2,$3,$4,$5, NOW(), NOW())
    RETURNING user_uuid, user_id,name, email, phone, isAdmin address, created_at, updated_at `;
  const r = await pool.query(q, [name, email, password, phone, address]);
  return r.rows[0];
};

export const updateUser = async (user_uuid, { name, phone, address }) => {
  const q = `
  UPDATE users
  SET name = COALESCE($2,name),
   phone = COALESCE($3,phone),
    address = COALESCE($4,address),
    updated_at = NOW()
    WHERE user_uuid = $1
    RETURNING user_uuid, user_id, name, email, phone, isAdmin, address, created_at, updated_at
     `;
  const r = await pool.query(q, [
    user_uuid,
    name ?? null,
    phone ?? null,
    address ?? null,
  ]);
  return r.rows[0];
};

/*
 @Params
 @user_uuid uuid desc
   */
export const changePassword = async (user_uuid, newHashedPassword) => {
  const q = `UPDATE users SET password = $1, updated_at = NOW() 
    WHERE user_uuid =$2
    RETURNING user_uuid, user_id , email`;
  const r = await pool.query(q, [newHashedPassword, user_uuid]);
  return r.rows[0] ?? null;
};

export const deleteUser = async (user_uuid) => {
  const q = `DELETE FROM users 
    WHERE user_uuid =$1`;
  await pool.query(q, [user_uuid]);
  return true;
};
