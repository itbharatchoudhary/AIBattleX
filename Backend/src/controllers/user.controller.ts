import User from "../models/user.model.js";
import Usage from "../models/usage.model.js";

export const getProfile = async (req: any, res: any) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

export const getUsage = async (req: any, res: any) => {
  const usage = await Usage.findOne({ userId: req.user.id });
  res.json(usage);
};