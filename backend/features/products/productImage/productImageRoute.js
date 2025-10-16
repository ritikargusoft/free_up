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
import { authenticate } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", upload.single("file"), authenticate,uploadProductImage);
router.get(
  "/product/:product_id",
  validate(listImagesSchema, "params"),
  authenticate,
  listImagesForProduct
);

router.delete(
  "/:image_uuid",
  validate(deleteImageSchema, "params"),
  authenticate,
  deleteImageHandler
);

export default router;
