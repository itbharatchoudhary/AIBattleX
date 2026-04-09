import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  plan: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  },
  avatar: {
    type: String,
    default: "👤"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otpCode: String,
  otpExpiresAt: Date
}, { timestamps: true });

export default mongoose.model("User", userSchema);