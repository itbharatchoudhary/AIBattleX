import User from "../models/user.model.js";
import Usage from "../models/usage.model.js";
import rungraph from "../ai/graph.ai.js";

export const invokeGraph = async (req: any, res: any) => {
  try {
    const { input, modelA = "mistral", modelB = "mistral", judgeModel = "mistral" } = req.body;
    const userId = req.user.id;

    if (process.env.VERBOSE_LOGGING === 'true') console.log("Invoke request received:", { input, modelA, modelB, judgeModel, userId });

    if (!input) {
      return res.status(400).json({ message: "Input required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user: any = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPlan = user.plan || "free";
    let usage: any = await Usage.findOne({ userId });

    // Create usage document if it doesn't exist
    if (!usage) {
      usage = new Usage({ userId, used: 0, limit: userPlan === "free" ? 5 : 100 });
      await usage.save();
    }

    if (userPlan === "free" && usage.used >= usage.limit) {
      return res.status(403).json({
        message: "Usage limit reached. Upgrade plan."
      });
    }

    if (process.env.VERBOSE_LOGGING === 'true') console.log("Calling rungraph with:", { problem: input, modelA, modelB, judgeModel });
    const result = await rungraph({ problem: input, modelA, modelB, judgeModel });
    if (process.env.VERBOSE_LOGGING === 'true') console.log("Graph result:", result);

    if (user.plan === "free") {
      usage.used += 1;
      await usage.save();
    }

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error("Error in invokeGraph:", err);
    res.status(500).json({ error: "Execution failed", details: (err as Error).message });
  }
};