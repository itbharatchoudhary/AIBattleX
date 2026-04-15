import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
export declare const models: {
    gemini: ChatGoogle;
    mistral: ChatMistralAI<import("@langchain/mistralai").ChatMistralAICallOptions>;
    cohere: ChatCohere<import("@langchain/cohere").ChatCohereCallOptions>;
    openai: ChatOpenAI<import("@langchain/openai").ChatOpenAICallOptions>;
    claude: ChatAnthropic;
};
declare const isModelAvailable: (modelKey: string) => boolean;
declare const invokeModelWithRetry: (model: any, prompt: string, modelKey: string) => Promise<unknown>;
export declare const workingModels: {
    solution: string[];
    judge: string[];
};
export { isModelAvailable, invokeModelWithRetry };
//# sourceMappingURL=model.ai.d.ts.map