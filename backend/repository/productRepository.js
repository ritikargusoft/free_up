import pool from "../db/connectDB.js";

export const createProductsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products(
    product_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id SERIAL UNIQUE NOT NULL,
    seller_uuid UUID NOT NULL,
    brand_id INT,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    condition VARCHAR(255) DEFAULT 'used',
    status VARCHAR(255) DEFAULT 'available',
    sold_at TIMESTAMP NULL,
    available_quantity INT DEFAULT 1 CHECK (available_quantity >=0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (seller_uuid) REFERENCES users(user_uuid) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL
    );
    `;
  await pool.query(query);
};
