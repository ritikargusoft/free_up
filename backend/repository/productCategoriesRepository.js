import pool from "../db/connectDB.js";

export const createProductCategoriesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS product_categories(
    product_categories_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_categories_id SERIAL UNIQUE NOT NULL,
   product_id INT NOT NULL,
   category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, category_id),

    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
    );
    `;
  await pool.query(query);
};
