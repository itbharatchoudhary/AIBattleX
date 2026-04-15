import User from "../models/user.model.js";
import Usage from "../models/usage.model.js";
export const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user);
};
export const getUsage = async (req, res) => {
    const usage = await Usage.findOne({ userId: req.user.id });
    res.json(usage);
};
//# sourceMappingURL=user.controller.js.map