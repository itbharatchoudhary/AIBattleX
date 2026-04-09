import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import config from "../config/config.js";

export const models = {
  gemini: new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: config.GOOGLE_API_KEY,
  }),

  mistral: new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY,
  }),

  cohere: new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY,
  }),

  openai: new ChatOpenAI({
    model: "gpt-4o",
    apiKey: config.OPENAI_API_KEY,
  }),

  claude: new ChatAnthropic({
    model: "claude-3-5-sonnet-20240620",
    apiKey: config.ANTHROPIC_API_KEY,
  }),
};