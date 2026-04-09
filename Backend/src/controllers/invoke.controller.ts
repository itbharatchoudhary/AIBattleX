import User from "../models/user.model.js";
import Usage from "../models/usage.model.js";
import rungraph from "../ai/graph.ai.js";

export const invokeGraph = async (req: any, res: any) => {
  try {
    const { input } = req.body;
    const userId = req.user.id;

    if (!input) {
      return res.status(400).json({ message: "Input required" });
    }

    const user: any = await User.findById(userId);
    const usage: any = await Usage.findOne({ userId });

    if (user.plan === "free" && usage.used >= usage.limit) {
      return res.status(403).json({
        message: "Usage limit reached. Upgrade plan."
      });
    }

    const result = await rungraph(input);

    if (user.plan === "free") {
      usage.used += 1;
      await usage.save();
    }

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({ error: "Execution failed" });
  }
};