import express from "express";
import { getProfile, getUsage } from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);
router.get("/usage", authenticateToken, getUsage);

export default router;