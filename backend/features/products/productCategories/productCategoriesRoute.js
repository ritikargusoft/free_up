import express from "express";
import { validate } from "../../../middleware/validateMiddleware.js";
import {
  bulkAddCategoriesSchema,
  deleteCategorySchema,
  deleteMappingSchema,
  getCategoriesForProductSchema,
} from "./productCategoriesValidator.js";
import {
  addCategories,
  deleteCategoryMapping,
  getCategoriesForProduct,
  removeAllCategories,
  replaceCategories,
} from "./productCategoriesController.js";

const router = express.Router();

router.post("/", validate(bulkAddCategoriesSchema), addCategories);
router.get(
  "/product/:product_id",
  validate(getCategoriesForProductSchema, "params"),
  getCategoriesForProduct
);

router.delete(
  "/delete/:product_id",
  validate(deleteCategorySchema, "params"),
  removeAllCategories
);

router.delete(
  "/:product_id/:category_id",
  validate(deleteMappingSchema, "params"),
  deleteCategoryMapping
);

router.post("/replace", validate(bulkAddCategoriesSchema), replaceCategories);

export default router;
