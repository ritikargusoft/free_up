import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";

import {
  changePassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  loginUser,
  logout,
  refreshToken,
  updateUser,
} from "./userController.js";
import {
  changePasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  updateUserSchema,
} from "./userValidator.js";
import { validate } from "../../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllUsers);

router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", authenticate, logout);
router.post(
  "/refresh-token",
  authenticate,
  validate(refreshSchema),
  refreshToken
);
router.post("/", validate(registerSchema), createUser);

router.get("/:id", authenticate, getUser);
router.put("/:id", authenticate, validate(updateUserSchema), updateUser);

router.put(
  "/:id/password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);
router.delete("/:id", authenticate, deleteUser);

export default router;
