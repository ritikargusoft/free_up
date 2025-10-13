import * as productCategoryModel from "./productCategoriesModel.js";
import pool from "../../../db/connectDB.js";

export async function addCategoriesToProduct(product_id, category_ids = []) {
  if (!product_id) {
    const e = new Error("product_id is required");
    e.status = 400;
    throw e;
  }
  if (
    !category_ids ||
    !Array.isArray(category_ids) ||
    category_ids.length === 0
  ) {
    const e = new Error("category_ids must be a non-empty array");
    e.status = 400;
    throw e;
  }
  productCategoryModel;
  const exists = await productCategoryModel.productExists(product_id);
  if (!exists) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }

  const catsOk = await productCategoryModel.categoriesExist(category_ids);
  if (!catsOk) {
    const e = new Error("One or more categories not found");
    e.status = 404;
    throw e;
  }

  const inserted = await productCategoryModel.bulkInsertProductCategories(
    product_id,
    category_ids
  );
  return inserted;
}

export async function listCategoriesForProduct(product_id) {
  if (!product_id) {
    const e = new Error("product_id is required");
    e.status = 400;
    throw e;
  }

  const exists = await productCategoryModel.productExists(product_id);
  if (!exists) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }
  return await productCategoryModel.getCategoriesByProductId(product_id);
}

export async function removeCategoryFromProduct(product_id, category_id) {
  if (!product_id || !category_id) {
    const e = new Error("product_id and category_id required");
    e.status = 400;
    throw e;
  }

  const deleted = await productCategoryModel.deleteByProductAndCategory(
    product_id,
    category_id
  );
  if (!deleted) {
    const e = new Error("Mapping not found");
    e.status = 404;
    throw e;
  }
  return deleted;
}

export async function removeAllCategories(product_id) {
  if (!product_id ) {
    const e = new Error("product_id is required");
    e.status = 400;
    throw e;
  }

  const deleted = await productCategoryModel.deleteByProductId(
    product_id
  );
  if (!deleted) {
    const e = new Error("Mapping not found");
    e.status = 404;
    throw e;
  }
  return deleted;
}

// replace categories for a product (delete existing, then bulk insert new)
export async function replaceCategoriesForProduct(
  product_id,
  category_ids = []
) {
  if (!product_id) {
    const e = new Error("product_id id required");
    e.status = 400;
    throw e;
  }

  const exists = await productCategoryModel.productExists(product_id);
  if (!exists) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }

  if (
    !category_ids ||
    !Array.isArray(category_ids) ||
    category_ids.length === 0
  ) {
    const e = new Error("category_ids must be a non-empty array");
    e.status = 400;
    throw e;
  }
  const catsOk = await productCategoryModel.categoriesExist(category_ids);
  if (!catsOk) {
    const e = new Error("One or more categories not found");
    e.status = 404;
    throw e;
  }

  //transaction of deleting and inserting new one

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM product_categories WHERE product_id = $1`, [
      product_id,
    ]);

    if (category_ids.length > 0) {
      // build bulk insert
      const vals = [];
      const placeholders = [];
      let idx = 1;
      for (const cid of category_ids) {
        placeholders.push(`($${idx++}, $${idx++})`);
        vals.push(product_id, cid);
      }
      const insertSql = `
        INSERT INTO product_categories (product_id, category_id)
        VALUES ${placeholders.join(",")}
        ON CONFLICT (product_id, category_id) DO NOTHING
      `;
      await client.query(insertSql, vals);
    }

    await client.query("COMMIT");
    return await productCategoryModel.getCategoriesByProductId(product_id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
