import express from "express";
import cors from "cors";

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
  ],
  credentials: true
}));

app.use(express.json());


import path from "path";

// API routes FIRST
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/plans", planRoutes);
app.use("/invoke", invokeRoutes);
app.use("/history", historyRoutes);

// SPA Catch-all & Static serving for production
const frontendDistPath = path.resolve(process.cwd(), "../Frontend/dist");
app.use(express.static(frontendDistPath));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  } else {
    next();
  }
});

export default app;