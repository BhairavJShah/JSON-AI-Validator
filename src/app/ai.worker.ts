import { pipeline, env } from "@xenova/transformers";

// Configuration
env.allowLocalModels = false;
env.useBrowserCache = true;

let model: any = null;

// Listen for messages from the main thread
self.onmessage = async (event) => {
  const { type, jsonString } = event.data;

  try {
    if (!model) {
      model = await pipeline("text-generation", "Xenova/LaMini-GPT-124M", {
        progress_callback: (p: any) => {
          self.postMessage({ type: 'progress', data: p });
        }
      });
    }

    let prompt = "";
    if (type === 'fix') {
      prompt = `Fix the following broken JSON string so it is valid. Only return the valid JSON string, no explanation:\n\nBroken JSON: ${jsonString}\n\nFixed JSON:`;
    } else {
      prompt = `Analyze the data in this JSON string for any logical errors or improbable values. Provide a brief summary of insights:\n\nJSON: ${jsonString}\n\nAnalysis:`;
    }

    const result = await model(prompt, {
      max_new_tokens: 500,
      temperature: 0.2,
    });

    const output = result[0].generated_text.replace(prompt, "").trim();
    self.postMessage({ type: 'result', data: output });

  } catch (error: any) {
    self.postMessage({ type: 'error', data: error.message });
  }
};
