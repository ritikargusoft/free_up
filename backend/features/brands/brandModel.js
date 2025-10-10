import pool from "../../db/connectDB.js";
export async function getAllBrands() {
  const q = `SELECT brand_uuid, brand_id, name, description, created_at, updated_at FROM brands ORDER BY created_at DESC`;
  const r = await pool.query(q);
  return r.rows;
}
export async function getBrandsByUuid(brand_uuid) {
  const q = `
    SELECT brand_uuid, brand_id, name, description, created_at, updated_at
    FROM brands
    WHERE brand_uuid = $1
    LIMIT 1
  `;
  const r = await pool.query(q, [brand_uuid]);
  return r.rows[0] ?? null;
}
export async function getBrandsById(brand_id) {
  const q = `
    SELECT brand_uuid, brand_id, name, description, created_at, updated_at
    FROM brands
    WHERE brand_id = $1
    LIMIT 1
  `;
  const r = await pool.query(q, [brand_id]);
  return r.rows[0] ?? null;
}
export async function getBrandByName(name) {
  const q = `
    SELECT brand_uuid, brand_id, name, description, created_at, updated_at
    FROM brands
    WHERE LOWER(name) = LOWER($1)
    LIMIT 1
  `;
  const r = await pool.query(q, [name]);
  return r.rows[0] ?? null;
}
export async function createBrand({ name, description = null }) {
  const q = `
    INSERT INTO brands (name, description, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING brand_uuid, brand_id, name, description, created_at, updated_at
  `;
  const r = await pool.query(q, [name, description]);
  return r.rows[0] ?? null;
}
export async function autoCompleteBrands(q, limit = 8) {
  if (!q || !String(q).trim()) return [];
  const search = `${q.trim()}%`; // prefix match
  const sql = `
    SELECT brand_uuid, brand_id, name
    FROM brands
    WHERE name ILIKE $1
    ORDER BY name ASC
    LIMIT $2
  `;
  const r = await pool.query(sql, [search, limit]);
  return r.rows;
}
export async function updateBrand(brand_uuid, { name, description }) {
  const q = `
    UPDATE brands
    SET
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      updated_at = NOW()
    WHERE brand_uuid = $1
    RETURNING brand_uuid, brand_id, name, description, created_at, updated_at
  `;
  const r = await pool.query(q, [
    brand_uuid,
    name ?? null,
    description ?? null,
  ]);
  return r.rows[0] ?? null;
}
export async function deleteBrand(brand_uuid) {
  const q = `
    DELETE FROM brands
    WHERE brand_uuid = $1
    RETURNING brand_uuid, brand_id
  `;
  const r = await pool.query(q, [brand_uuid]);
  return r.rows[0] ?? null;
}
