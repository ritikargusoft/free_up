import express from "express";
import userRoute from "./features/user/userRoute.js";
import brandRoutes from "./features/brands/brandRoute.js";

const router = express.Router();
router.use("/users", userRoute);
router.use("/brands", brandRoutes);

export default router;
