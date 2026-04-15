import History from "../models/history.model.js";
export const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await History.find({ userId }).sort({ timestamp: -1 }).limit(50);
        res.json({ success: true, data: history });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch history", error: err.message });
    }
};
export const saveHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { problem, timestamp, result, models } = req.body;
        const entry = new History({
            userId,
            problem,
            timestamp: timestamp || new Date(),
            result,
            models
        });
        await entry.save();
        res.json({ success: true, data: entry });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to save history", error: err.message });
    }
};
export const deleteHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const result = await History.findOneAndDelete({ _id: id, userId });
        if (!result) {
            return res.status(404).json({ success: false, message: "History entry not found" });
        }
        res.json({ success: true, message: "History entry deleted" });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete history", error: err.message });
    }
};
export const clearHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        await History.deleteMany({ userId });
        res.json({ success: true, message: "All history cleared" });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to clear history", error: err.message });
    }
};
//# sourceMappingURL=history.controller.js.map