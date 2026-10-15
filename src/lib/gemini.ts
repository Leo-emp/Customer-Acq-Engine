// ── Gemini AI client with retry logic for 503/overload errors ──

import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

let _model: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (!_model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    _model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }
  return _model;
}

// # retry wrapper — handles 503 overload, rate limits, transient failures
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const isRetryable = message.includes("503") || message.includes("overloaded") ||
        message.includes("Service Unavailable") || message.includes("high demand") ||
        message.includes("429") || message.includes("RESOURCE_EXHAUSTED");

      if (!isRetryable || attempt === maxRetries) throw err;

      // # exponential backoff: 2s, 4s, 8s
      const delay = Math.pow(2, attempt + 1) * 1000;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Retry exhausted");
}

export async function agentThink(systemPrompt: string, userMessage: string): Promise<string> {
  return withRetry(async () => {
    const result = await getModel().generateContent({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
    });
    return result.response.text();
  });
}

export async function agentThinkJSON<T>(systemPrompt: string, userMessage: string): Promise<T> {
  return withRetry(async () => {
    const result = await getModel().generateContent({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt + "\n\nRespond ONLY with valid JSON. No markdown, no code fences, no explanation." }],
      },
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();
    return JSON.parse(text) as T;
  });
}
