import * as productModel from "./productModel.js";
import * as brandModel from "../brands/brandModel.js";
import * as categoryModel from "../categories/categoryModel.js";
import pool from "../../db/connectDB.js";

async function resolveProductByParam(idOrUuid) {
  // treat purely numeric strings or numbers as product_id
  if (typeof idOrUuid === "number" || /^[0-9]+$/.test(String(idOrUuid))) {
    // call getProductById
    const pid = Number(idOrUuid);
    return await productModel.getProductById(pid);
  }
  // otherwise assume uuid
  return await productModel.getProductByUuid(String(idOrUuid));
}

async function resolveBrandId({ brand_id, brand_name }) {
  if (brand_id) return brand_id;
  if (!brand_name) return null;

  const existing = await brandModel.getBrandByName(brand_name);
  if (existing) return existing.brand_id;

  const created = await brandModel.createBrand({
    name: brand_name,
    description: null,
  });
  return created?.brand_id ?? null;
}

async function resolveCategoryIds(categories = []) {
  if (!Array.isArray(categories) || categories.length === 0) return [];
  const ids = [];
  for (const c of categories) {
    if (typeof c === "number") {
      ids.push(c);
    } else {
      const name = String(c).trim();
      if (!name) continue;
      let existing = await categoryModel.getCategoryByName(name);
      if (!existing) {
        existing = await categoryModel.createCategory({
          name,
          description: null,
        });
      }
      if (existing) ids.push(existing.category_id);
    }
  }
  return ids;
}

export async function createProduct(data, user) {
  const seller_uuid = user?.user_uuid;
  if (!seller_uuid) {
    const e = new Error("Invalid user");
    e.status = 401;
    throw e;
  }

  const brandId = await resolveBrandId({
    brand_id: data.brand_id,
    brand_name: data.brand_name,
  });

  const categoryIds = await resolveCategoryIds(data.categories || []);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const q = `
      INSERT INTO products
        (seller_uuid, brand_id, product_name, description, condition, status, available_quantity, target_audience, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(), NOW())
      RETURNING product_uuid, product_id, seller_uuid, brand_id, product_name, description, condition, status, available_quantity, target_audience, created_at, updated_at
    `;
    const vals = [
      seller_uuid,
      brandId,
      data.product_name,
      data.description ?? null,
      data.condition ?? "used",
      data.status ?? "available",
      data.available_quantity ?? 1,
      data.target_audience ?? null,
    ];

    const pr = await client.query(q, vals);
    const product = pr.rows[0];

    if (categoryIds.length > 0) {
      const placeholders = [];
      const vals2 = [];
      let idx = 1;

      for (const cid of categoryIds) {
        placeholders.push(`($${idx++}, $${idx++}, NOW())`);
        vals2.push(product.product_id, cid);
      }
      const insertQ = `
        INSERT INTO product_categories (product_id, category_id,created_at)
        VALUES ${placeholders.join(",")}
        ON CONFLICT (product_id, category_id) DO NOTHING
        `;
      await client.query(insertQ, vals2);
    }
    await client.query("COMMIT");

    const full = await productModel.getProductByUuid(product.product_uuid);
    const catQ = `
    SELECT c.category_id, c.category_uuid, c.name
    FROM product_categories pc
    JOIN category c ON c.category_id = pc.category_id
    WHERE pc.product_id = $1`;

    const catRes = await pool.query(catQ, [product.product_id]);
    full.categories = catRes.rows || [];
    return full;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getProductByUuid(product_uuid) {
  const p = await productModel.getProductByUuid(product_uuid);
  if (!p) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }
  // attach categories
  const catQ = `
    SELECT c.category_id, c.category_uuid, c.name
    FROM product_categories pc
    JOIN category c ON c.category_id = pc.category_id
    WHERE pc.product_id = $1
  `;
  const r = await pool.query(catQ, [p.product_id]);
  p.categories = r.rows || [];
  return p;
}

export async function listProducts(filters = {}) {
  return await productModel.listProducts(filters);
}

// export async function updateProductByUuid(product_uuid, data, user) {
//   const current = await productModel.getProductByUuid(product_uuid);
//   if (!current) {
//     const e = new Error("Product not found");
//     e.status = 404;
//     throw e;
//   }

//   if (String(current.seller_uuid) !== String(user.user_uuid) && !user.isAdmin) {
//     const e = new Error("Not authorized");
//     e.status = 403;
//     throw e;
//   }

//   const brandId = await resolveBrandId({
//     brand_id: data.brand_id,
//     brand_name: data.brand_name,
//   });

//   if (brandId) data.brand_id = brandId;

//   const updatedRow = await productModel.updateProductByUuid(product_uuid, data);
//   if (Array.isArray(data.categories)) {
//     const categoryIds = await resolveCategoryIds(data.categories);
//     const client = await pool.connect();

//     try {
//       await client.query("BEGIN");
//       await client.query(
//         `DELETE FROM product_categories WHERE product_id = $1`,
//         [current.product_id]
//       );
//       if (categoryIds.length > 0) {
//         const placeholders = [];
//         const vals = [];
//         let idx = 1;
//         for (const cid of categoryIds) {
//           placeholders.push(`($${idx++}, $${idx++}, NOW())`);
//           vals.push(current.product_id, cid);
//         }
//         const insertQ = ` INSERT INTO product_categories (product_id, category_id, created_at) VALUES ${placeholders.join(
//           ","
//         )}
//             ON CONFLICT DO NOTHING`;
//         await client.query(insertQ, vals);
//       }
//       await client.query("COMMIT");
//     } catch (err) {
//       await client.query("ROLLBACK");
//       throw err;
//     } finally {
//       client.release();
//     }
//   }
// }

export async function updateProductByUuid(product_uuid_or_id, data, user) {
  // resolve product by id or uuid
  const current = await resolveProductByParam(product_uuid_or_id);
  if (!current) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }
  // ensure user present
  if (!user || !user.user_uuid) {
    const e = new Error("Unauthorized");
    e.status = 401;
    throw e;
  }
  // ensure owner or admin
  if (String(current.seller_uuid) !== String(user.user_uuid) && !user.isAdmin) {
    const e = new Error("Not authorized");
    e.status = 403;
    throw e;
  }
  // resolve brand if present
  const brandId = await resolveBrandId({
    brand_id: data.brand_id || data.brandId,
    brand_name: data.brand_name || data.brandName,
  });
  if (brandId) data.brand_id = brandId;
  // update core product row (productModel.updateProductByUuid expects uuid input)
  // if we were passed numeric id, convert to uuid for update, or call update by uuid.
  const targetUuid = current.product_uuid; // always have uuid from resolved product
  const updatedRow = await productModel.updateProductByUuid(targetUuid, data);
  // handle category changes if provided
  if (Array.isArray(data.categories)) {
    const categoryIds = await resolveCategoryIds(data.categories);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `DELETE FROM product_categories WHERE product_id = $1`,
        [current.product_id]
      );
      if (categoryIds.length > 0) {
        const placeholders = [];
        const vals = [];
        let idx = 1;
        for (const cid of categoryIds) {
          placeholders.push(`($${idx++}, $${idx++}, NOW())`);
          vals.push(current.product_id, cid);
        }
        const insertQ = `INSERT INTO product_categories (product_id, category_id, created_at) VALUES ${placeholders.join(
          ", "
        )} ON CONFLICT DO NOTHING`;
        await client.query(insertQ, vals);
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
  // return fresh product
  return await productModel.getProductByUuid(targetUuid);
}

// export async function deleteProduct(product_uuid, user) {
//   const current = await productModel.getProductByUuid(product_uuid);
//   if (!current) {
//     const e = new Error("Product not found");
//     e.status = 404;
//     throw e;
//   }

//     if (String(current.seller_uuid) !== String(user.user_uuid) && !user.isAdmin) {
//       const e = new Error("Not authorized");
//       e.status = 403;
//       throw e;
//     }
//   const deleted = await productModel.deleteProductByUuid(product_uuid);
//   return deleted;
// }

export async function deleteProduct(product_uuid_or_id, user) {
  const current = await resolveProductByParam(product_uuid_or_id);
  if (!current) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }
  if (!user || !user.user_uuid) {
    const e = new Error("Unauthorized");
    e.status = 401;
    throw e;
  }
  if (String(current.seller_uuid) !== String(user.user_uuid) && !user.isAdmin) {
    const e = new Error("Not authorized");
    e.status = 403;
    throw e;
  }
  const deleted = await productModel.deleteProductByUuid(current.product_uuid);
  return deleted;
}
