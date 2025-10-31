import pool from "../db/connectDB.js";

export const createProductsTable = async () => {
  try {
    const createEnumTypeQuery = `
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'target_audience_type') THEN
              CREATE TYPE target_audience_type AS ENUM('male', 'female', 'kids', 'unisex');
          END IF;
      END
      $$;
    `;
    await pool.query(createEnumTypeQuery);

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products(
        product_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id SERIAL UNIQUE NOT NULL,
        seller_uuid UUID NOT NULL,
        brand_id INT,
        price NUMERIC(12,2),
        product_name VARCHAR(255) NOT NULL,
        description TEXT,
        condition VARCHAR(255) DEFAULT 'used',
        status VARCHAR(255) DEFAULT 'available',
        target_audience target_audience_type DEFAULT 'unisex',
        sold_at TIMESTAMP NULL,
        available_quantity INT DEFAULT 1 CHECK (available_quantity >=0),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        FOREIGN KEY (seller_uuid) REFERENCES users(user_uuid) ON DELETE CASCADE,
        FOREIGN KEY (brand_id) REFERENCES brands(brand_id) 
      );
    `;
    await pool.query(createTableQuery);
  } catch (error) {
    console.error(
      "Error creating products table or target_audience_type:",
      error
    );
  }
};
