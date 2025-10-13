import pool from "../../../db/connectDB.js";

export async function bulkInsertProductCategories(
  product_id,
  category_ids = []
) {
  if (!category_ids || !category_ids.length) return [];
  const vals = [];
  const placeholders = [];
  let idx = 1;
  for (const cid of category_ids) {
    placeholders.push(`($${idx++}, $${idx++})`);
    vals.push(product_id, cid);
  }
  const q = `
    INSERT INTO product_categories (product_id, category_id)
    VALUES ${placeholders.join(",")}
    ON CONFLICT (product_id, category_id) DO NOTHING
    RETURNING product_categories_uuid, product_categories_id, product_id, category_id
  `;
  const r = await pool.query(q, vals);
  return r.rows;
}

export async function getCategoriesByProductId(product_id) {
  const q = `
    SELECT c.category_uuid, c.category_id, c.name, c.description
    FROM product_categories pc
    JOIN category c ON pc.category_id = c.category_id
    WHERE pc.product_id = $1
    ORDER BY c.name ASC 
    `;
  const r = await pool.query(q, [product_id]);
  return r.rows;
}

export async function deleteByProductAndCategory(product_id, category_id) {
  const q = `
    DELETE FROM product_categories
    WHERE product_id = $1 AND category_id = $2
    RETURNING product_categories_uuid, product_categories_id, product_id, category_id
    `;

  const r = await pool.query(q, [product_id, category_id]);
  return r.rows[0] ?? null;
}

export async function deleteByProductId(product_id) {
  const q = `
    DELETE FROM product_categories
    WHERE product_id = $1
    RETURNING product_categories_uuid, product_categories_id, product_id, category_id
    `;

  const r = await pool.query(q, [product_id]);
  return r.rows;
}

export async function productExists(product_id) {
  const q = `SELECT 1 FROM products WHERE product_id = $1 LIMIT 1`;
  const r = await pool.query(q, [product_id]);
  return r.rowCount > 0;
}

export async function categoriesExist(category_ids = []) {
  if (!category_ids.length) return false;
  const q = `
    SELECT category_id FROM category WHERE category_id = ANY($1::int[])
  `;
  const r = await pool.query(q, [category_ids]);
  return r.rowCount === category_ids.length;
}
