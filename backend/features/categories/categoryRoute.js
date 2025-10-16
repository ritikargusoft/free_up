import express from "express";
import { validate } from "../../middleware/validateMiddleware.js";
import {
  autoCompleteCategoryHandler,
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByUuid,
  updateCategory,
} from "./categoryController.js";
import {
  autoCompleteCategorySchema,
  createCategorySchema,
  updateCategorySchema,
} from "./categoryValidator.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get(
  "/autoComplete",
  validate(autoCompleteCategorySchema, "query"),
  autoCompleteCategoryHandler
);

router.get("/:id", getCategoryByUuid);
router.post("/", authenticate,validate(createCategorySchema), createCategory);

router.put("/:id", authenticate,validate(updateCategorySchema), updateCategory);
router.delete("/:id", authenticate,deleteCategory);

export default router;
