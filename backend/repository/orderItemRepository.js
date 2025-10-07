import pool from "../db/connectDB.js";

export const createOrderItemTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS order_item(
    order_item_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id SERIAL UNIQUE NOT NULL,
    order_id INT,
    product_id INT,

    seller_uuid UUID,
    quantity INT DEFAULT 1 CHECK(quantity>0) ,
    unit_price NUMERIC(10,2) CHECK (unit_price >= 0),
    total_price NUMERIC(10,2) CHECK (total_price >= 0),

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
    );
    `;
  await pool.query(query);
};
