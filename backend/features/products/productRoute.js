import express from "express";
import { validate } from "../../middleware/validateMiddleware.js";
import {
  createProductSchema,
  listProductsSchema,
  updateProductSchema,
} from "./productValidator.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "./productController.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", validate(listProductsSchema, "query"), listProducts);
router.get("/:id", getProduct);

router.post("/", authenticate, validate(createProductSchema), createProduct);
router.put("/:id", authenticate, validate(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
