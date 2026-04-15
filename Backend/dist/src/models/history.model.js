import mongoose from "mongoose";
const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    problem: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    result: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    models: {
        modelA: String,
        modelB: String,
        judgeModel: String
    }
}, { timestamps: true });
export default mongoose.model("History", historySchema);
//# sourceMappingURL=history.model.js.map