import { StateGraph, StateSchema, START, END, type GraphNode, type CompiledStateGraph } from "@langchain/langgraph"
import z from "zod";
import { models } from "./model.ai.js";
import { createAgent, HumanMessage, providerStrategy } from "langchain";


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

    const model1 = models[modelA as keyof typeof models];
    const model2 = models[modelB as keyof typeof models];

    if (!model1 || !model2) {
        throw new Error("Invalid model selection");
    }

    const [res1, res2] = await Promise.all([
        model1.invoke(problem),
        model2.invoke(problem),
    ]);

    return {
        solution_1: res1.content as string,
        solution_2: res2.content as string,
    };
};



const judgeNode: GraphNode<typeof state> = async (state) => {
    const { problem, solution_1, solution_2, judgeModel } = state;

    const judgeLLM = models[judgeModel as keyof typeof models];

    if (!judgeLLM) {
        throw new Error("Invalid judge model");
    }

    const judge = createAgent({
        model: judgeLLM,
        responseFormat: providerStrategy(
            z.object({
                ideal_solution: z.string(),
                solution_1_score: z.number().min(0).max(10),
                solution_2_score: z.number().min(0).max(10),
                solution_1_reasoning: z.string(),
                solution_2_reasoning: z.string(),
            })
        ),
        systemPrompt: `You are an AI judge. First generate an ideal solution. Then score both solutions out of 10 with reasoning.`,
    });

    const response = await judge.invoke({
        messages: [
            new HumanMessage(`
Problem: ${problem}

Solution 1: ${solution_1}
Solution 2: ${solution_2}

Evaluate both solutions.
`),
        ],
    });

    return {
        judge: response.structuredResponse,
    };
};



const graph = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();


export default async function ({
    problem, modelA, modelB, judgeModel, }: {
        problem: string;
        modelA: string;
        modelB: string;
        judgeModel: string;
    }) {

    //  Prevent same model usage
    if (modelA === modelB) {
        throw new Error("Model A and Model B must be different");
    }

    if (judgeModel === modelA || judgeModel === modelB) {
        throw new Error("Judge model must be different from competing models");
    }

    const result = await graph.invoke({
        problem,
        modelA,
        modelB,
        judgeModel,
    });

    return result;
}