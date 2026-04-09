import User from "../models/user.model.js";
import Usage from "../models/usage.model.js";
import rungraph from "../ai/graph.ai.js";

export const invokeGraph = async (req: any, res: any) => {
  try {
    const { input, modelA = "mistral", modelB = "mistral", judgeModel = "mistral" } = req.body;
    const userId = req.user.id;

    console.log("Invoke request received:", { input, modelA, modelB, judgeModel, userId });

    if (!input) {
      return res.status(400).json({ message: "Input required" });
    }

    const user: any = await User.findById(userId);
    let usage: any = await Usage.findOne({ userId });

    // Create usage document if it doesn't exist
    if (!usage) {
      usage = new Usage({ userId, used: 0, limit: user.plan === 'free' ? 5 : 100 });
      await usage.save();
    }

    if (user.plan === "free" && usage.used >= usage.limit) {
      return res.status(403).json({
        message: "Usage limit reached. Upgrade plan."
      });
    }

    console.log("Calling rungraph with:", { problem: input, modelA, modelB, judgeModel });
    const result = await rungraph({ problem: input, modelA, modelB, judgeModel });
    console.log("Graph result:", result);

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