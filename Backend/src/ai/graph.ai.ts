import { StateGraph, StateSchema, START, END, type GraphNode, type CompiledStateGraph } from "@langchain/langgraph"
import z from "zod";
import { models, workingModels, isModelAvailable, invokeModelWithRetry } from "./model.ai.js";
import { HumanMessage } from "@langchain/core/messages";


const state = new StateSchema({
    problem: z.string().default(""),
    modelA: z.string().default(""),
    modelB: z.string().default(""),
    judgeModel: z.string().default(""),

    solution_1: z.string().default(""),
    solution_2: z.string().default(""),

    judge: z.object({
        ideal_solution: z.string().default(""),
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
    }),
});

const solutionNode: GraphNode<typeof state> = async (state) => {
    const { problem, modelA, modelB } = state;
    console.log("solutionNode called with:", { problem, modelA, modelB });

    // Try selected models first, then fall back to the confirmed working provider list
    const getWorkingModel = async (preferredModel: string, fallbackModels: string[]) => {
        const modelKeys = [preferredModel, ...fallbackModels];

        for (const modelKey of modelKeys) {
            // Skip models that are circuit-broken
            if (!isModelAvailable(modelKey)) {
                console.log(`Skipping circuit-broken model: ${modelKey}`);
                continue;
            }

            const model = models[modelKey as keyof typeof models];
            if (!model) {
                console.log(`Model key not found: ${modelKey}`);
                continue;
            }

            try {
                console.log(`Attempting model: ${modelKey}`);
                const response = await invokeModelWithRetry(model, problem, modelKey);

                console.log(`Successful model: ${modelKey}`);
                return { response, usedModel: modelKey };
            } catch (invokeError: any) {
                const errorMsg = invokeError.message || 'Unknown error';
                console.log(`Model ${modelKey} failed: ${errorMsg}`);

                // Continue to next model if this one failed
                continue;
            }
        }

        return {
            response: { content: `Error: Unable to generate solution with ${preferredModel} or fallback models` },
            usedModel: preferredModel
        };
    };

    try {
        console.log("Invoking models...");
        const [res1, res2] = await Promise.all([
            getWorkingModel(modelA, workingModels.solution),
            getWorkingModel(modelB, workingModels.solution)
        ]);

        console.log("Model responses received");
        return {
            solution_1: ((res1.response as any).content as string) || "No response generated",
            solution_2: ((res2.response as any).content as string) || "No response generated",
        };
    } catch (error) {
        console.error("Error in solutionNode:", error);
        return {
            solution_1: "Error: Unable to generate solution",
            solution_2: "Error: Unable to generate solution",
        };
    }
};



const judgeNode: GraphNode<typeof state> = async (state) => {
    const { problem, solution_1, solution_2, judgeModel } = state;
    console.log("judgeNode called with:", { problem: problem.substring(0, 50) + "...", judgeModel });

    const cleanJsonResponse = (text: string) => {
        if (!text || typeof text !== 'string') return null;

        try {
            // First try to parse as-is
            JSON.parse(text);
            return text;
        } catch {
            // If that fails, try to extract and clean JSON
            let cleaned = text
                .replace(/```(?:json)?\n?/gi, '')
                .replace(/```\n?/g, '')
                .replace(/^[^{]*/, '') // Remove anything before the first {
                .replace(/[^}]*$/, '') // Remove anything after the last }
                .trim();

            if (!cleaned.startsWith('{') || !cleaned.endsWith('}')) {
                return null;
            }

            try {
                JSON.parse(cleaned);
                return cleaned;
            } catch {
                return null;
            }
        }
    };

    // Try selected judge model first, then fall back to confirmed working judge providers
    const getWorkingJudgeModel = async (preferredModel: string, fallbackModels: string[]) => {
        const judgeKeys = [preferredModel, ...fallbackModels];

        for (const judgeKey of judgeKeys) {
            // Skip models that are circuit-broken
            if (!isModelAvailable(judgeKey)) {
                console.log(`Skipping circuit-broken judge model: ${judgeKey}`);
                continue;
            }

            const judgeLLM = models[judgeKey as keyof typeof models];
            if (!judgeLLM) {
                console.log(`Judge model key not found: ${judgeKey}`);
                continue;
            }

            const prompt = `Evaluate these two AI solutions to the problem: "${problem}"

Solution 1: ${solution_1}

Solution 2: ${solution_2}

Return only JSON like this:
{
  "ideal_solution": "brief description of the correct answer",
  "solution_1_score": 8,
  "solution_2_score": 7,
  "solution_1_reasoning": "why this score for solution 1",
  "solution_2_reasoning": "why this score for solution 2"
}`;

            try {
                console.log(`Attempting judge model: ${judgeKey}`);
                const response = await invokeModelWithRetry(judgeLLM, prompt, judgeKey);

                console.log(`Successful judge model: ${judgeKey}`);
                return { response, usedModel: judgeKey };
            } catch (invokeError: any) {
                const errorMsg = invokeError.message || 'Unknown error';
                console.log(`Judge model ${judgeKey} failed: ${errorMsg}`);

                // Continue to next model if this one failed
                continue;
            }
        }

        return {
            response: {
                content: JSON.stringify({
                    ideal_solution: "Unable to generate judgment due to model unavailability",
                    solution_1_score: 5,
                    solution_2_score: 5,
                    solution_1_reasoning: "Evaluation failed - models unavailable",
                    solution_2_reasoning: "Evaluation failed - models unavailable"
                })
            },
            usedModel: preferredModel
        };
    };

    try {
        console.log("Invoking judge model...");
        const { response } = await getWorkingJudgeModel(judgeModel, workingModels.judge);
        console.log("Judge response received");
        const content = (response as any).content as string;

        // Try to parse JSON from the response
        let parsedResponse;
        try {
            const cleanContent = cleanJsonResponse(content);
            if (!cleanContent) {
                throw new Error("No JSON found in response");
            }
            parsedResponse = JSON.parse(cleanContent);
            console.log("JSON parsed successfully");
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            // Fallback: create a basic response
            parsedResponse = {
                ideal_solution: "Unable to generate ideal solution",
                solution_1_score: 5,
                solution_2_score: 5,
                solution_1_reasoning: "Unable to parse judge response",
                solution_2_reasoning: "Unable to parse judge response"
            };
        }

        return {
            judge: {
                ideal_solution: typeof parsedResponse.ideal_solution === 'object'
                    ? JSON.stringify(parsedResponse.ideal_solution, null, 2)
                    : (parsedResponse.ideal_solution || "No ideal solution provided"),
                solution_1_score: Math.max(0, Math.min(10, parsedResponse.solution_1_score || 5)),
                solution_2_score: Math.max(0, Math.min(10, parsedResponse.solution_2_score || 5)),
                solution_1_reasoning: parsedResponse.solution_1_reasoning || "No reasoning provided",
                solution_2_reasoning: parsedResponse.solution_2_reasoning || "No reasoning provided"
            }
        };
    } catch (error) {
        console.error("Error in judgeNode:", error);
        // Fallback response in case of any error
        return {
            judge: {
                ideal_solution: "Error occurred during evaluation",
                solution_1_score: 5,
                solution_2_score: 5,
                solution_1_reasoning: "Evaluation failed",
                solution_2_reasoning: "Evaluation failed"
            }
        };
    }
};



const graph = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("evaluation", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "evaluation")
    .addEdge("evaluation", END)
    .compile();


export default async function ({ problem, modelA, modelB, judgeModel }: {
    problem: string;
    modelA: string;
    modelB: string;
    judgeModel: string;
}) {
    console.log("rungraph called with:", { problem, modelA, modelB, judgeModel });

    // Prevent same model usage
    if (modelA === modelB) {
        throw new Error("Model A and Model B must be different");
    }

    if (judgeModel === modelA || judgeModel === modelB) {
        throw new Error("Judge model must be different from competing models");
    }

    console.log("Invoking graph...");
    const result = await graph.invoke({
        problem,
        modelA,
        modelB,
        judgeModel,
    });

    console.log("Graph invoke result:", result);
    return result;
}