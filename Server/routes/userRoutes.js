import express from "express";

const router = express.Router();

import { registerUser, login, updatedUser, deleteUser } from "../controllers/userController.js";
import { authmiddleWare, adminOnly, adminOrOwner } from "../middleWare/authmiddleWare.js";


router.post("/register", registerUser);
router.post("/login", login);
router.put("/update/:id", authmiddleWare, adminOrOwner, updatedUser);
router.delete("/delete/:id", authmiddleWare, adminOnly, deleteUser);





export default router;
