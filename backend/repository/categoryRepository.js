import pool from "../db/connectDB.js";

export const createCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS category(
    category_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id SERIAL UNIQUE NOT NULL,
    name  VARCHAR(255) ,
   description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
    );
    `;
  await pool.query(query);
};
