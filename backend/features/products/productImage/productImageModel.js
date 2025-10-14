import pool from "../../../db/connectDB.js";

export async function insertImage({
  product_id,
  img_url,
  provider = "cloudinary",
  public_id = null,
  is_thumbnail = false,
  width = null,
  height = null,
  size_bytes = null,
}) {
  const q = `
    INSERT INTO product_image
    (product_id, img_url, provider, public_id, is_thumbnail, width, height, size_bytes, created_at)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8, NOW())
    RETURNING image_uuid, image_id, product_id, img_url, product_id,img_url, provider, public_id, is_thumbnail,width, height, size_bytes, created_at
    `;

  const r = await pool.query(q, [
    product_id,
    img_url,
    provider,
    public_id,
    is_thumbnail,
    width,
    height,
    size_bytes,
  ]);
  return r.rows[0] ?? null;
}

export async function listImagesByProductId(product_id) {
  const q = `
    SELECT image_uuid, image_id, product_id, img_url, provider, public_id, is_thumbnail, width, height, size_bytes, created_at
    FROM product_image
    WHERE product_id = $1
    ORDER BY is_thumbnail DESC, created_at ASC`;
  const r = await pool.query(q, [product_id]);
  return r.rows;
}

export async function getImageByUuid(image_uuid) {
  const q = `
    SELECT image_uuid, image_id, product_id, img_url, provider, public_id, is_thumbnail, width, height, size_bytes, created_at
    FROM product_image 
    WHERE image_uuid = $1
    LIMIT 1
    `;
  const r = await pool.query(q, [image_uuid]);
  return r.rows[0] ?? null;
}

export async function unsetThumbnailForProduct(product_id) {
  const q = `
    UPDATE product_image
    SET is_thumbnail = FALSE
    WHERE product_id = $1 AND is_thumbnail = TRUE
    RETURNING image_uuid, image_id`;
  const r = await pool.query(q, [product_id]);
  return r.rows;
}

export async function deleteImageByUuid(image_uuid) {
  const q = `
    DELETE FROM product_image
    WHERE image_uuid = $1created_at
    RETURNING image_uuid, image_id, product_id, public_id, img_url`;
  const r = await pool.query(q, [image_uuid]);
  return r.rows[0] ?? null;
}
export async function checkOwnership(product_id, user) {
  if (!user) return false;
  if (user.isAdmin) return true;

  const q = `SELECT seller_uuid FROM products WHERE product_id = $1 LIMIT 1`;
  const r = await pool.query(q, [product_id]);
  if (!r.rows[0]) return false;
  return String(r.rows[0].seller_uuid) === String(user.user_uuid);
}

export async function productExists(product_id) {
  const q = `SELECT 1 FROM products WHERE product_id = $1 LIMIT 1`;
  const r = await pool.query(q, [product_id]);
  return r.rowCount > 0;
}
