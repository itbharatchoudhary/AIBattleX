import "dotenv/config.js";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

// Start server
const startServer = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("✅ Server is running on port " + PORT);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();