import express from "express";

const router = express.Router();

import {
  createNotice,
  getAllNotices,
  getSingleNotice,
  deleteNotice,
  updateNotice,
} from "../controllers/noticecontroller.js";
import { protect, adminOnly } from "../middleWares/authmiddleWare.js";
import upload from "../middleware/upload.js";

router.post("/create", protect, adminOnly, upload.single('image'), createNotice);
router.get("/notices", getAllNotices);
router.get("/notices/:id", getSingleNotice);
router.delete("/delete/:id", protect, adminOnly, deleteNotice);
router.put("/update/:id", protect, adminOnly, upload.single('image'), updateNotice);

export default router;
