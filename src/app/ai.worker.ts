import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.useBrowserCache = true;

let model: any = null;

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
      prompt = `Instruction: Repair the following broken JSON. Return ONLY the valid JSON string. NO markdown, NO explanations.\n\nJSON: ${jsonString}\n\nFixed JSON:`;
    } else {
      prompt = `Instruction: Analyze this JSON data for logical errors or anomalies. Return a 2-sentence expert summary.\n\nJSON: ${jsonString}\n\nAnalysis:`;
    }

    const result = await model(prompt, {
      max_new_tokens: 500,
      temperature: 0.1, // Lower temperature for more accuracy in JSON fixing
    });

    const output = result[0].generated_text.split("Fixed JSON:").pop().split("Analysis:").pop().trim();
    self.postMessage({ type: 'result', data: output });

  } catch (error: any) {
    self.postMessage({ type: 'error', data: error.message });
  }
};
