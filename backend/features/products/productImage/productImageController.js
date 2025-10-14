import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import * as productImageService from "./productImageService.js";
import { initCloudinary } from "../../../utils/cloudinaryConfig.js";
initCloudinary(); 
function uploadBufferToCloudinary(
  buffer,
  folder = "freeup/products",
  timeoutMs = 15000
) {
  return new Promise((resolve, reject) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error("Invalid file buffer"));
    }
    const opts = {
      folder,
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
    };
    let timedOut = false;
    const t = setTimeout(() => {
      timedOut = true;
      reject(new Error("Cloudinary upload timed out"));
    }, timeoutMs);
    const uploadStream = cloudinary.uploader.upload_stream(
      opts,
      (error, result) => {
        clearTimeout(t);
        if (timedOut) return;
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary returned empty result"));
        }
        return resolve(result);
      }
    );
    // pipe buffer into upload stream
    try {
      streamifier.createReadStream(buffer).pipe(uploadStream);
    } catch (err) {
      clearTimeout(t);
      return reject(err);
    }
  });
}
export async function uploadProductImage(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        message: "file is required (send as form-data with key 'file')",
      });
    }
    const product_id = Number(req.body.product_id);
    if (!product_id || Number.isNaN(product_id)) {
      return res
        .status(400)
        .json({ message: "product_id is required and must be a number" });
    }
    const is_thumbnail = String(req.body.is_thumbnail || "false") === "true";
    let result;
    try {
      result = await uploadBufferToCloudinary(
        req.file.buffer,
        "freeup/products"
      );
    } catch (uploadErr) {
      console.error(
        "Cloudinary upload error:",
        uploadErr && uploadErr.message ? uploadErr.message : uploadErr
      );
      return res.status(502).json({
        message: "Failed to upload image",
        detail: uploadErr.message || String(uploadErr),
      });
    }
    const imgUrl = result.secure_url || result.url || null;
    if (!imgUrl) {
      console.error("Cloudinary returned no url:", result);
      return res
        .status(500)
        .json({ message: "Cloudinary did not return image url" });
    }
    const created = await productImageService.addImageRecord({
      product_id,
      img_url: imgUrl,
      provider: "cloudinary",
      public_id: result.public_id || result.public_id_str || null,
      is_thumbnail,
      width: result.width ?? null,
      height: result.height ?? null,
      size_bytes: result.bytes ?? null,
      user: req.user, // authenticate middleware must have set this
    });
    return res.status(201).json(created);
  } catch (err) {
    console.error("uploadProductImage unexpected error:", err);
    next(err);
  }
}
export async function listImagesForProduct(req, res, next) {
  try {
    const product_id = Number(req.params.product_id);
    if (!product_id)
      return res.status(400).json({ message: "Invalid product_id" });
    const rows = await productImageService.listImages(product_id);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}
export async function deleteImageHandler(req, res, next) {
  try {
    const image_uuid = req.params.image_uuid;
    const destroyFn = async (public_id) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
          public_id,
          { resource_type: "image" },
          (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          }
        );
      });
    };
    const deleted = await productImageService.deleteImage(
      image_uuid,
      req.user,
      destroyFn
    );
    return res.status(200).json({ message: "Image deleted", deleted });
  } catch (err) {
    next(err);
  }
}
