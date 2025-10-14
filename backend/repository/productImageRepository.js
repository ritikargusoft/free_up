import pool from "../db/connectDB.js";

export const createProductImageTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS product_image (
      image_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      image_id SERIAL UNIQUE NOT NULL,
      product_id INT NOT NULL,
      img_url VARCHAR(2000) NOT NULL,
      provider VARCHAR(50) DEFAULT 'cloudinary',
      public_id VARCHAR(500),
      is_thumbnail BOOLEAN DEFAULT FALSE,
      width INT,
      height INT,
      size_bytes INT,
      created_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
    );
    `;
  await pool.query(query);
};
