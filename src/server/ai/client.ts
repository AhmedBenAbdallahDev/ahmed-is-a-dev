import OpenAI from "openai";

export const ai = new OpenAI({
  baseURL: "https://qwen.ai.unturf.com/v1",
  apiKey: "dummy-api-key",
});

export const MODEL = "hf.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF:Q4_K_M";

