import express from "express";
import { validate } from "../../../middleware/validateMiddleware.js";
import { upload } from "../../../utils/multerConfig.js";
import {
  deleteImageHandler,
  listImagesForProduct,
  uploadProductImage,
} from "./productImageController.js";
import {
  deleteImageSchema,
  listImagesSchema,
} from "./productImageValidator.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadProductImage);
router.get(
  "/product/:product_id",
  validate(listImagesSchema, "params"),
  listImagesForProduct
);

router.delete(
  "/:image_uuid",
  validate(deleteImageSchema, "params"),
  deleteImageHandler
);

export default router;
