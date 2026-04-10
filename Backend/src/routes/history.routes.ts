import express from "express";
import { 
  getHistory, 
  saveHistory, 
  deleteHistory, 
  clearHistory 
} from "../controllers/history.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, getHistory);
router.post("/", authenticateToken, saveHistory);
router.delete("/:id", authenticateToken, deleteHistory);
router.delete("/", authenticateToken, clearHistory);

export default router;
