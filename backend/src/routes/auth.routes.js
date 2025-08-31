import express from "express";
import {
  register,
  login,
  logout,
  profileCompletion,
  getUserProfile,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/profile-completion", authMiddleware, profileCompletion);
router.post("/me", authMiddleware, getUserProfile);

export default router;
