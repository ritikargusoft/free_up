import * as productImageModel from "./productImageModel.js";
import pool from "../../../db/connectDB.js";
export async function addImageRecord({
  product_id,
  img_url,
  provider,
  public_id,
  is_thumbnail,
  width,
  height,
  size_bytes,
  user,
}) {
  // const owner = await productImageModel.checkOwnership(product_id, user);
  // if (!owner) {
  //   const e = new Error("Not authorized to add image to this product");
  //   e.status = 403;
  //   throw e;
  // }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (is_thumbnail) {
      await client.query(
        `UPDATE product_image SET is_thumbnail = FALSE WHERE product_id = $1 AND is_thumbnail = TRUE`,
        [product_id]
      );
    }
    const q = `
      INSERT INTO product_image
        (product_id, img_url, provider, public_id, is_thumbnail, width, height, size_bytes, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
      RETURNING image_uuid, image_id, product_id, img_url, provider, public_id, is_thumbnail, width, height, size_bytes, created_at
    `;
    const vals = [
      product_id,
      img_url,
      provider ?? "cloudinary",
      public_id ?? null,
      Boolean(is_thumbnail),
      width ?? null,
      height ?? null,
      size_bytes ?? null,
    ];
    const r = await client.query(q, vals);
    await client.query("COMMIT");
    return r.rows[0] ?? null;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
export async function listImages(product_id) {
  const exists = await productImageModel.productExists(product_id);
  if (!exists) {
    const e = new Error("Product not found");
    e.status = 404;
    throw e;
  }
  return await productImageModel.listImagesByProductId(product_id);
}
export async function deleteImage(
  image_uuid,
  user,
  cloudinaryDestroyFn = null
) {
  const img = await productImageModel.getImageByUuid(image_uuid);
  if (!img) {
    const e = new Error("Image not found");
    e.status = 404;
    throw e;
  }
  // const owner = await productImageModel.checkOwnership(img.product_id, user);
  // if (!owner) {
  //   const e = new Error("Not authorized to delete this image");
  //   e.status = 403;
  //   throw e;
  // }
  if (img.provider === "cloudinary" && img.public_id) {
    if (typeof cloudinaryDestroyFn === "function") {
      await cloudinaryDestroyFn(img.public_id);
    } else {
      const e = new Error("cloudinaryDestroyFn not provided");
      e.status = 500;
      throw e;
    }
  }
  const deleted = await productImageModel.deleteImageByUuid(image_uuid);
  return deleted;
}
