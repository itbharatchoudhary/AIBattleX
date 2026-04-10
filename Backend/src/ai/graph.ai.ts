import { StateGraph, START, END, type GraphNode, type CompiledStateGraph } from "@langchain/langgraph"
import z from "zod";
import { models, workingModels, isModelAvailable, invokeModelWithRetry } from "./model.ai.js";
import { HumanMessage } from "@langchain/core/messages";

const VERBOSE_LOGGING = process.env.VERBOSE_LOGGING === 'true';


const state = z.object({
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
        verdict: z.string().default(""),
    }),
});

const getResponseText = (response: any): string => {
    if (!response) return "";
    if (typeof response === "string") return response;
    if (typeof response.content === "string") return response.content;
    if (typeof response.text === "string") return response.text;
    if (response.kwargs?.content) return response.kwargs.content;
    if (response.output?.text) return response.output.text;
    if (Array.isArray(response.generations)) {
        const first = response.generations[0];
        if (typeof first === "string") return first;
        if (Array.isArray(first) && typeof first[0]?.text === "string") return first[0].text;
        if (typeof first?.text === "string") return first.text;
    }
    return "";
};

const solutionNode: GraphNode<typeof state> = async (state) => {
    const { problem, modelA, modelB } = state;
    if (VERBOSE_LOGGING) console.log("solutionNode called with:", { problem, modelA, modelB });

    const buildSolutionPrompt = (problem: string, solutionNumber: number, modelKey: string) => {
        const styleHint = solutionNumber === 1
            ? 'Provide a concise, formal, and direct response with clear final results. Use professional language.'
            : 'Provide a clear, explanatory response with step-by-step reasoning and professional tone. Structure your answer logically.';

        return `You are an expert AI assistant providing professional answers.
Respond completely, accurately, and helpfully to the user's request.
Use natural language with proper grammar and avoid unnecessary markdown or code blocks.

${styleHint}

Problem: ${problem}

Answer:`;
    };

    // Try selected models first, then fall back to the confirmed working provider list
    const getWorkingModel = async (preferredModel: string, fallbackModels: string[], solutionNumber: number) => {
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

            const prompt = buildSolutionPrompt(problem, solutionNumber, modelKey);

            try {
                console.log(`Attempting model: ${modelKey}`);
                const response = await invokeModelWithRetry(model, prompt, modelKey);

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
            getWorkingModel(modelA, workingModels.solution, 1),
            getWorkingModel(modelB, workingModels.solution, 2)
        ]);

        console.log("Model responses received");
        return {
            solution_1: getResponseText(res1.response) || "No response generated",
            solution_2: getResponseText(res2.response) || "No response generated",
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

        const tryParse = (candidate: string) => {
            try {
                JSON.parse(candidate);
                return candidate;
            } catch {
                return null;
            }
        };

        const sanitizeMultilineJsonStrings = (jsonString: string) => {
            let inString = false;
            let escaped = false;
            let result = "";

            for (const char of jsonString) {
                if (char === '"' && !escaped) {
                    inString = !inString;
                }

                if ((char === '\n' || char === '\r') && inString && !escaped) {
                    result += '\\n';
                    escaped = false;
                    continue;
                }

                result += char;
                if (escaped) {
                    escaped = false;
                } else if (char === '\\') {
                    escaped = true;
                }
            }

            return result;
        };

        const direct = tryParse(text);
        if (direct) return direct;

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const cleaned = jsonMatch[0]
                .replace(/```(?:json)?\n?/gi, '')
                .replace(/```\n?/g, '')
                .trim();

            if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
                const sanitized = sanitizeMultilineJsonStrings(cleaned);
                return tryParse(sanitized);
            }
        }

        return null;
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

            const prompt = `You are a professional AI evaluator. Compare Solution 1 and Solution 2 against the original problem.

Problem: ${problem}

Solution 1: ${solution_1}

Solution 2: ${solution_2}

Score each solution from 0 to 10 based on correctness, completeness, clarity, relevance, and how well it solves the user's request.
Also provide a polished ideal solution summary that shows the best possible answer.
Finally, provide a professional verdict stating which solution is better or if they are tied.

Return only valid JSON exactly in this format and nothing else:
{
  "ideal_solution": "a concise professional ideal answer to the problem",
  "solution_1_score": 0,
  "solution_2_score": 0,
  "solution_1_reasoning": "concise professional evaluation (2-3 sentences) explaining the score for solution 1",
  "solution_2_reasoning": "concise professional evaluation (2-3 sentences) explaining the score for solution 2",
  "verdict": "professional summary (1 sentence) declaring the winner or tie"
}

If the solutions are equal in quality, explain why they are tied. If one is stronger, explain precisely why it is better.`;

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
                    solution_2_reasoning: "Evaluation failed - models unavailable",
                    verdict: "Unable to determine winner due to technical issues"
                })
            },
            usedModel: preferredModel
        };
    };

    try {
        console.log("Invoking judge model...");
        const { response } = await getWorkingJudgeModel(judgeModel, workingModels.judge);
        console.log("Judge response received");
        const content = getResponseText(response);

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
                solution_2_reasoning: "Unable to parse judge response",
                verdict: "Unable to determine winner due to parsing error"
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
                solution_2_reasoning: parsedResponse.solution_2_reasoning || "No reasoning provided",
                verdict: parsedResponse.verdict || "No verdict provided"
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
                solution_2_reasoning: "Evaluation failed",
                verdict: "Unable to determine winner due to error"
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
    if (VERBOSE_LOGGING) console.log("rungraph called with:", { problem, modelA, modelB, judgeModel });

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

    if (VERBOSE_LOGGING) console.log("Graph invoke result:", result);
    return result;
}