import express from "express";
import userRoute from "./features/user/userRoute.js";
import brandRoutes from "./features/brands/brandRoute.js";
import categoryRoutes from "./features/categories/categoryRoute.js";

const router = express.Router();
router.use("/users", userRoute);
router.use("/brands", brandRoutes);
router.use("/category", categoryRoutes);

export default router;
