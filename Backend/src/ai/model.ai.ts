import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import config from "../config/config.js";

const GEMINI_MODELS = [
  "gemini-2.5-pro",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash"
];

const createGeminiClient = (modelName: string) =>
  new ChatGoogle({
    model: modelName,
    apiKey: config.GOOGLE_API_KEY,
  });

const isGeminiModelError = (errorMessage: string) =>
  /not found for API version|unsupported for generateContent|invalid_request_error/i.test(errorMessage);

export const models = {
  gemini: createGeminiClient(GEMINI_MODELS[0]!),

  mistral: new ChatMistralAI({
    model: "mistral-medium",
    apiKey: config.MISTRAL_API_KEY,
  }),

  cohere: new ChatCohere({
    apiKey: config.COHERE_API_KEY,
  }),

  openai: new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: config.OPENAI_API_KEY,
  }),

  claude: new ChatAnthropic({
    model: "claude-3-haiku-20240307",
    apiKey: config.ANTHROPIC_API_KEY,
  }),
};

// Model health tracking for circuit breaker pattern
const modelHealth = {
  gemini: { failures: 0, lastFailure: 0, circuitOpen: false },
  mistral: { failures: 0, lastFailure: 0, circuitOpen: false },
  cohere: { failures: 0, lastFailure: 0, circuitOpen: false },
  openai: { failures: 0, lastFailure: 0, circuitOpen: false },
  claude: { failures: 0, lastFailure: 0, circuitOpen: false },
};

// Circuit breaker configuration
const CIRCUIT_BREAKER_THRESHOLD = 3;
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute
const RETRY_ATTEMPTS = 2;
const RETRY_DELAY = 1000; // 1 second base delay

// Request queuing to prevent API overwhelming
const requestQueue: Array<{ modelKey: string; resolve: Function; reject: Function; model: any; prompt: string }> = [];
let processingQueue = false;
const MAX_CONCURRENT_REQUESTS = 2; // Limit concurrent requests per model
const activeRequests = new Map<string, number>();

// Process request queue
const processQueue = async () => {
  if (processingQueue || requestQueue.length === 0) return;

  processingQueue = true;

  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (!request) continue;

    const { modelKey, resolve, reject, model, prompt } = request;

    // Check concurrent request limit
    const currentRequests = activeRequests.get(modelKey) || 0;
    if (currentRequests >= MAX_CONCURRENT_REQUESTS) {
      // Re-queue the request
      requestQueue.unshift(request);
      break;
    }

    activeRequests.set(modelKey, currentRequests + 1);

    try {
      const response = await invokeModelWithRetryInternal(model, prompt, modelKey);
      resolve(response);
    } catch (error) {
      reject(error);
    } finally {
      const updatedRequests = (activeRequests.get(modelKey) || 0) - 1;
      activeRequests.set(modelKey, Math.max(0, updatedRequests));
    }
  }

  processingQueue = false;
};

// Check if model is available (circuit breaker)
const isModelAvailable = (modelKey: string) => {
  const health = modelHealth[modelKey as keyof typeof modelHealth];
  if (!health) return true;

  if (health.circuitOpen) {
    const timeSinceLastFailure = Date.now() - health.lastFailure;
    if (timeSinceLastFailure > CIRCUIT_BREAKER_TIMEOUT) {
      // Reset circuit breaker
      health.circuitOpen = false;
      health.failures = 0;
      return true;
    }
    return false;
  }
  return true;
};

// Record model failure
const recordModelFailure = (modelKey: string) => {
  const health = modelHealth[modelKey as keyof typeof modelHealth];
  if (!health) return;

  health.failures++;
  health.lastFailure = Date.now();

  if (health.failures >= CIRCUIT_BREAKER_THRESHOLD) {
    health.circuitOpen = true;
    console.log(`Circuit breaker opened for ${modelKey} after ${health.failures} failures`);
  }
};

// Record model success
const recordModelSuccess = (modelKey: string) => {
  const health = modelHealth[modelKey as keyof typeof modelHealth];
  if (!health) return;

  // Reset failure count on success
  health.failures = Math.max(0, health.failures - 1);
  if (health.circuitOpen && health.failures < CIRCUIT_BREAKER_THRESHOLD) {
    health.circuitOpen = false;
    console.log(`Circuit breaker closed for ${modelKey}`);
  }
};

// Sleep utility for retry delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced model invocation with retry logic and queuing
const invokeModelWithRetry = async (model: any, prompt: string, modelKey: string) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ modelKey, resolve, reject, model, prompt });
    processQueue();
  });
};

// Internal function for actual model invocation with retry
const invokeModelWithRetryInternal = async (model: any, prompt: string, modelKey: string) => {
  for (let attempt = 0; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await Promise.race([
        model.invoke(prompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("TIMEOUT")), attempt === 0 ? 15000 : 30000)
        )
      ]);

      recordModelSuccess(modelKey);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';

      // If Gemini is misconfigured or unsupported, try a fallback Gemini model name.
      if (modelKey === 'gemini' && isGeminiModelError(errorMessage)) {
        const currentIndex = GEMINI_MODELS.indexOf((model as any).model || GEMINI_MODELS[0]);
        const nextModelName = GEMINI_MODELS[currentIndex + 1];
        if (nextModelName) {
          console.log(`Gemini model ${((model as any).model)} unsupported, switching to ${nextModelName}`);
          model = createGeminiClient(nextModelName);
          continue;
        }
      }

      // Don't retry on certain errors
      if (errorMessage.includes('quota') ||
          errorMessage.includes('billing') ||
          errorMessage.includes('credit') ||
          errorMessage.includes('authentication') ||
          errorMessage.includes('authorization')) {
        recordModelFailure(modelKey);
        throw error;
      }

      // Retry on network errors, timeouts, or rate limits
      if (attempt < RETRY_ATTEMPTS) {
        const delay = RETRY_DELAY * Math.pow(2, attempt); // Exponential backoff
        console.log(`Retrying ${modelKey} in ${delay}ms (attempt ${attempt + 1}/${RETRY_ATTEMPTS + 1})`);
        await sleep(delay);
        continue;
      }

      recordModelFailure(modelKey);
      throw error;
    }
  }
};

// Working models configuration for fallback
export const workingModels = {
  solution: ["gemini", "openai", "claude", "mistral", "cohere"],
  judge: ["claude", "openai", "gemini", "mistral", "cohere"]
};

// Export circuit breaker functions
export { isModelAvailable, invokeModelWithRetry };