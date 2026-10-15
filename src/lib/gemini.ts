// ── Gemini AI client (lazy-initialized to avoid build-time crashes) ──

import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

let _model: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (!_model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    _model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }
  return _model;
}

export async function agentThink(systemPrompt: string, userMessage: string): Promise<string> {
  const result = await getModel().generateContent({
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
  });
  return result.response.text();
}

export async function agentThinkJSON<T>(systemPrompt: string, userMessage: string): Promise<T> {
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
}
