import express from "express";

const router = express.Router();

import {
  registerUser,
  login,
  updatedUser,
  deleteUser,
  getUserProfile,
  getStats,
  getAllUsers,
  promoteUser,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleWares/authmiddleWare.js";
import upload from "../middleware/upload.js";

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", login);
router.get("/profile", protect, getUserProfile);
router.get("/stats", protect, adminOnly, getStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/promote/:id", protect, adminOnly, promoteUser);
router.put("/update/:id", protect, upload.single("avatar"), updatedUser);
router.delete("/delete/:id", protect, adminOnly, deleteUser);

export default router;
