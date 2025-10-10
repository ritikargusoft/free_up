import express from "express";
import { validate } from "../../middleware/validateMiddleware.js";
import {
  autoCompleteBrandSchema,
  createBrandSchema,
  updateBrandSchema,
} from "./brandValidator.js";
import {
  autoCompleteBrandsHandler,
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandByUuid,
  updateBrand,
} from "./brandController.js";

const router = express.Router();

router.get("/", getAllBrands);
router.get(
  "/autoComplete",
  validate(autoCompleteBrandSchema, "query"),
  autoCompleteBrandsHandler
);

router.get("/:id", getBrandByUuid);
router.post("/", validate(createBrandSchema), createBrand);

router.put("/:id", validate(updateBrandSchema), updateBrand);
router.delete("/:id", deleteBrand);

export default router;
