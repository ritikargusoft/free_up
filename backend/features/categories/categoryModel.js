import pool from "../../db/connectDB.js";

export async function getAllCategories() {
  const q = `SELECT category_uuid, category_id, name, description, created_at, updated_at FROM category ORDER BY created_at DESC`;
  const r = await pool.query(q);
  return r.rows;
}
export async function getCategoryByUuid(category_uuid) {
  const q = `
    SELECT category_uuid, category_id, name, description, created_at, updated_at
    FROM category
    WHERE category_uuid = $1
    LIMIT 1
  `;
  const r = await pool.query(q, [category_uuid]);
  return r.rows[0] ?? null;
}
export async function getCategoryById(category_id) {
  const q = `
    SELECT category_uuid, category_id, name, description, created_at, updated_at
    FROM category
    WHERE category_id = $1
    LIMIT 1
  `;
  const r = await pool.query(q, [category_id]);
  return r.rows[0] ?? null;
}
export async function getCategoryByName(name) {
  const q = `
    SELECT category_uuid, category_id, name, description, created_at, updated_at
    FROM category
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1
  `;
  const r = await pool.query(q, [name]);
  return r.rows[0] ?? null;
}
export async function createCategory({ name, description = null }) {
  const q = `
    INSERT INTO category (name, description, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING category_uuid, category_id, name, description, created_at, updated_at
  `;
  const r = await pool.query(q, [name, description]);
  return r.rows[0] ?? null;
}
export async function autoCompleteCategory(q, limit = 8) {
  if (!q || !String(q).trim()) return [];
  const search = `${q.trim()}%`; // prefix match
  const sql = `
    SELECT category_uuid, category_id, name
    FROM category
    WHERE name ILIKE $1
    ORDER BY name ASC
    LIMIT $2
  `;
  const r = await pool.query(sql, [search, limit]);
  return r.rows;
}
export async function updateCategory(category_uuid, { name, description }) {
  const q = `
    UPDATE category
    SET
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      updated_at = NOW()
    WHERE category_uuid = $1
    RETURNING category_uuid, category_id, name, description, created_at, updated_at
  `;
  const r = await pool.query(q, [
    category_uuid,
    name ?? null,
    description ?? null,
  ]);
  return r.rows[0] ?? null;
}

export async function deleteCategory(category_uuid) {
  const q = `
    DELETE FROM category
    WHERE category_uuid = $1
    RETURNING category_uuid, category_id
  `;
  const r = await pool.query(q, [category_uuid]);
  return r.rows[0] ?? null;
}
