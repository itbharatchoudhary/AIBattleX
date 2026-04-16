import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

console.log(" Starting AIBattleX Server...");

// Start server
const startServer = async () => {
  try {
    console.log(" Connecting to MongoDB...");
    await connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
  catch (error) {
    console.error(" Failed to start server:");
    process.exit(1);
  }
};

startServer();