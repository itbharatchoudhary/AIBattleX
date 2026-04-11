import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import planRoutes from "./routes/plan.routes.js";
import invokeRoutes from "./routes/invoke.routes.js";
import historyRoutes from "./routes/history.routes.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://aibattlex.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

// Serve static files from the Frontend/dist directory
const frontendPath = path.join(__dirname, "../../../Frontend/dist");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/plans", planRoutes);
app.use("/invoke", invokeRoutes);
app.use("/history", historyRoutes);

// Catch-all route to serve the frontend's index.html for any unknown routes
// This enables client-side routing (React Router) to work
app.get("/*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;