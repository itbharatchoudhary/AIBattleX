import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  used: {
    type: Number,
    default: 0
  },
  limit: {
    type: Number,
    default: 5
  }
});

export default mongoose.model("Usage", usageSchema);