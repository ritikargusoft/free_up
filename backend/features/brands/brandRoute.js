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
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllBrands);
router.get(
  "/autoComplete",
  validate(autoCompleteBrandSchema, "query"),
  autoCompleteBrandsHandler
);

router.get("/:id", getBrandByUuid);
router.post("/",authenticate, validate(createBrandSchema), createBrand);

router.put("/:id", authenticate,validate(updateBrandSchema), updateBrand);
router.delete("/:id", authenticate,deleteBrand);

export default router;
