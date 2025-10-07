import pool from "../db/connectDB.js";

export const createOrdersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS orders(
    order_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id SERIAL UNIQUE NOT NULL,
    buyer_uuid UUID,
    seller_uuid UUID,
    total_amount NUMERIC(12,2) CHECK (total_amount >= 0),
status VARCHAR(50) default 'pending',
payment_status VARCHAR(50) DEFAULT 'initiated',
sold_at TIMESTAMP null,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() ,

    FOREIGN KEY (buyer_uuid) REFERENCES users(user_uuid) ON DELETE SET NULL,
    FOREIGN KEY (seller_uuid) REFERENCES users(user_uuid) ON DELETE SET NULL
    );
    `;
  await pool.query(query);
};
