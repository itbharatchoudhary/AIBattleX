import express from "express";
import { invokeGraph } from "../controllers/invoke.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, invokeGraph);

export default router;