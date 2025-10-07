import pool from "../db/connectDB.js";

export const createBrandsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS brands (
    brand_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id SERIAL UNIQUE NOT NULL,
    name  VARCHAR(255) ,
   description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
    );
    `;
  await pool.query(query);
};
    