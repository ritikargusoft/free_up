import pool from "../db/connectDB.js";

export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users(
    user_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id SERIAL UNIQUE NOT NULL,
    name TEXT,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    password VARCHAR(255),
    isAdmin BOOLEAN DEFAULT false,
    address VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    );
    `;
  await pool.query(query);
};
