import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from "fs";
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
// Robust path calculation for both dev and prod
const frontendPath = fs.existsSync(path.join(__dirname, "../../../Frontend/dist"))
    ? path.join(__dirname, "../../../Frontend/dist")
    : path.join(__dirname, "../../Frontend/dist");
app.use(express.static(frontendPath));
app.get("/", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    }
    else {
        res.status(404).send("Frontend build not found. Please run 'npm run build'.");
    }
});
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/plans", planRoutes);
app.use("/invoke", invokeRoutes);
app.use("/history", historyRoutes);
// Catch-all route to serve the frontend's index.html for any unknown routes
// This enables client-side routing (React Router) to work
// Catch-all route to serve the frontend's index.html for any unknown routes
// This enables client-side routing (React Router) to work
// Note: In Express 5, '*' is the correct catch-all wildcard
app.get("*", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    }
    else {
        // If it's an API route that was missed, let it fall through or send 404
        // But since this is a catch-all, we send 404 if index.html is missing
        res.status(404).send("Not Found");
    }
});
export default app;
//# sourceMappingURL=app.js.map