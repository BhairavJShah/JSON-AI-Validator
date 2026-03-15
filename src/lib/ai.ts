"use client";

import { pipeline, env } from "@xenova/transformers";

// Skip local check for browser environment
env.allowLocalModels = false;

let instance: any = null;

class AIWorker {
  static async getInstance(progress_callback?: any) {
    if (instance === null) {
      instance = await pipeline("text-generation", "Xenova/LaMini-GPT-124M", { progress_callback });
    }
    return instance;
  }
}

export async function fixJSONWithAI(jsonString: string, callback?: any) {
  const model = await AIWorker.getInstance(callback);
  const prompt = `Fix the following broken JSON string so it is valid. Only return the valid JSON string, no explanation:\n\nBroken JSON: ${jsonString}\n\nFixed JSON:`;
  
  const result = await model(prompt, {
    max_new_tokens: 500,
    temperature: 0.2,
    repetition_penalty: 1.2,
  });

  return result[0].generated_text.replace(prompt, "").trim();
}

export async function analyzeJSONWithAI(jsonString: string, callback?: any) {
  const model = await AIWorker.getInstance(callback);
  const prompt = `Analyze the data in this JSON string for any logical errors or improbable values. Provide a brief summary of insights:\n\nJSON: ${jsonString}\n\nAnalysis:`;
  
  const result = await model(prompt, {
    max_new_tokens: 200,
    temperature: 0.5,
  });

  return result[0].generated_text.replace(prompt, "").trim();
}
