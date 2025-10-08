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

const router = express.Router();

router.get("/", authenticate, getAllUsers);

router.post("/login", loginUser);
router.post("/logout", authenticate, logout);
router.post("/refresh-token", authenticate, refreshToken);
router.post("/", createUser);

router.get("/:id", authenticate, getUser);
router.put("/:id", authenticate, updateUser);

router.put("/:id/password", authenticate, changePassword);
router.delete("/:id", authenticate, deleteUser);

export default router;
