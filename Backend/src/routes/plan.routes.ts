import express from "express";
import { getPlans, upgradePlan } from "../controllers/plan.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getPlans);
router.post("/upgrade", authenticateToken, upgradePlan);

export default router;