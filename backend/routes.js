import express from "express";
import userRoute from "./features/user/userRoute.js";
import brandRoutes from "./features/brands/brandRoute.js";
import categoryRoutes from "./features/categories/categoryRoute.js";
import productCategoryRoutes from "./features/products/productCategories/productCategoriesRoute.js";
import productImageRoutes from "./features/products/productImage/productImageRoute.js";

const router = express.Router();
router.use("/users", userRoute);
router.use("/brands", brandRoutes);
router.use("/category", categoryRoutes);
router.use("/product-categories", productCategoryRoutes);
router.use("/product-Images", productImageRoutes);

export default router;
