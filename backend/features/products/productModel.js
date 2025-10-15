import pool from "../../db/connectDB.js";

export async function createProductRow({
  seller_uuid,
  brand_id = null,
  product_name,
  description = null,
  condition = "used",
  status = "available",
  available_quantity = 1,
  target_audience = null,
}) {
  const q = `
    INSERT INTO products
      (seller_uuid, brand_id, product_name, description, condition, status, available_quantity, target_audience, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(), NOW())
    RETURNING product_uuid, product_id, seller_uuid, brand_id, product_name, description, condition, status, available_quantity, target_audience, created_at, updated_at
  `;
  const vals = [
    seller_uuid,
    brand_id,
    product_name,
    description,
    condition,
    status,
    available_quantity,
    target_audience,
  ];
  const r = await pool.query(q, vals);
  return r.rows[0] ?? null;
}

export async function getProductByUuid(product_uuid) {
  const q = `
    SELECT p.*, b.name AS brand_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.brand_id
    WHERE p.product_uuid = $1
    LIMIT 1
  `;
  const r = await pool.query(q, [product_uuid]);
  return r.rows[0] ?? null;
}

export async function getProductById(product_id) {
  const q = `
    SELECT p.*, b.name AS brand_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.brand_id
    WHERE p.product_id = $1
    LIMIT 1
  `;
  const r = await pool.query(q, [product_id]);
  return r.rows[0] ?? null;
}

// const product = await pool.query(
//   "SELECT * FROM products WHERE product_uuid = $1",
//   [uuid]
// );
// const categories = await pool.query(
//   `SELECT c.category_id, c.name
//    FROM category c
//    JOIN product_categories pc ON pc.category_id = c.category_id
//    WHERE pc.product_id = $1`,
//   [product.rows[0].product_id]
// );
// return { ...product.rows[0], categories: categories.rows };

// const categories_data = await pool.query(
//   `
// SELECT
//   p.*,
//   b.name AS brand_name,
//   array_remove(array_agg(c.name), NULL) AS category_names,
//   array_remove(array_agg(c.category_id), NULL) AS category_ids
// FROM products p
// LEFT JOIN brands b ON p.brand_id = b.brand_id
// LEFT JOIN product_categories pc ON pc.product_id = p.product_id
// LEFT JOIN category c ON c.category_id = pc.category_id
// WHERE p.product_uuid = $1
// GROUP BY p.product_uuid, p.product_id, b.name;
// `
// );

export async function listProducts({
  limit = 20,
  offset = 0,
  seller_uuid = null,
  brand_id = null,
  status = null,
  target_audience = null,
  q = null,
  category_id = null,
  orderBy = "created_at",
  orderDir = "DESC",
} = {}) {
  const where = [];
  const vals = [];
  let idx = 1;

  if (seller_uuid) {
    where.push(`p.seller_uuid = $${idx++}`);
    vals.push(seller_uuid);
  }
  if (brand_id) {
    where.push(`p.brand_id = $${idx++}`);
    vals.push(brand_id);
  }
  if (status) {
    where.push(`p.status = $${idx++}`);
    vals.push(status);
  }
  if (target_audience) {
    where.push(`p.target_audience = $${idx++}`);
    vals.push(target_audience);
  }
  if (q) {
    where.push(`(p.product_name ILIKE $${idx} OR p.description ILIKE $${idx})`);
    vals.push(`%${q}%`);
    idx++;
  }
  if (category_id) {
    where.push(
      `EXISTS (SELECT 1 FROM product_categories pc WHERE pc.product_id = p.product_id AND pc.category_id = $${idx++})`
    );
    vals.push(category_id);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const allowedOrderCols = [
    "created_at",
    "updated_at",
    "product_name",
    "available_quantity",
    "product_id",
  ];
  const col = allowedOrderCols.includes(orderBy) ? orderBy : "created_at";
  const dir = String(orderDir).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const qStr = `
    SELECT p.*, b.name AS brand_name,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('category_id', c.category_id, 'category_uuid', c.category_uuid, 'name', c.name))
        FILTER (WHERE c.category_id IS NOT NULL),
        '[]'
      ) AS categories
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.brand_id
    LEFT JOIN product_categories pc ON pc.product_id = p.product_id
    LEFT JOIN category c ON c.category_id = pc.category_id
    ${whereClause}
    GROUP BY p.product_uuid, p.product_id, b.name
    ORDER BY p.${col} ${dir}
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  vals.push(limit, offset);

  const r = await pool.query(qStr, vals);
  return r.rows;
}
export async function updateProductByUuid(
  product_uuid,
  {
    product_name = null,
    description = null,
    condition = null,
    status = null,
    available_quantity = null,
    brand_id = null,
    target_audience = null,
  } = {}
) {
  const q = `
    UPDATE products
    SET
      product_name      = COALESCE($2, product_name),
      description       = COALESCE($3, description),
      condition         = COALESCE($4, condition),
      status            = COALESCE($5, status),
      available_quantity= COALESCE($6, available_quantity),
      brand_id          = COALESCE($7, brand_id),
      target_audience   = COALESCE($8, target_audience),
      updated_at        = NOW()
    WHERE product_uuid = $1
    RETURNING product_uuid, product_id, seller_uuid, brand_id, product_name, description, condition, status, available_quantity, target_audience, created_at, updated_at
  `;
  const vals = [
    product_uuid,
    product_name ?? null,
    description ?? null,
    condition ?? null,
    status ?? null,
    available_quantity ?? null,
    brand_id ?? null,
    target_audience ?? null,
  ];
  const r = await pool.query(q, vals);
  return r.rows[0] ?? null;
}

export async function deleteProductByUuid(product_uuid) {
  const q = `DELETE FROM products WHERE product_uuid = $1 RETURNING product_uuid, product_id`;
  const r = await pool.query(q, [product_uuid]);
  return r.rows[0] ?? null;
}

export async function addProductCategoriesBulk(product_id, category_ids = []) {
  if (!category_ids || category_ids.length === 0) return;
  const placeholders = [];
  const vals = [];
  let idx = 1;
  for (const cid of category_ids) {
    placeholders.push(`($${idx++}, $${idx++}, NOW())`);
    vals.push(product_id, cid);
  }
  const q = `
    INSERT INTO product_categories (product_id, category_id, created_at)
    VALUES ${placeholders.join(",")}
    ON CONFLICT (product_id, category_id) DO NOTHING
  `;
  await pool.query(q, vals);
}

export async function deleteProductCategories(product_id) {
  const q = `DELETE FROM product_categories WHERE product_id = $1`;
  await pool.query(q, [product_id]);
}
