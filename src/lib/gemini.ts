// ── Gemini AI client ──

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// fast model for all agents
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// generate text with a system prompt
export async function agentThink(systemPrompt: string, userMessage: string): Promise<string> {
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
  });
  return result.response.text();
}

// generate structured JSON output
export async function agentThinkJSON<T>(systemPrompt: string, userMessage: string): Promise<T> {
  const result = await model.generateContent({
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
}
