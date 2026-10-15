// ── Support Agent: post-sale customer support chat ──

import { agentThink } from "@/lib/gemini";
import type { Prospect, CallRecord, Invoice } from "@/lib/types";

// build context-aware support prompt
function buildSupportPrompt(
  prospect: Prospect,
  deal: CallRecord | null,
  invoice: Invoice | null,
  productDescription: string
): string {
  return `You are a friendly, knowledgeable customer support assistant for AcquireAI.

CUSTOMER CONTEXT:
- Name: ${prospect.contactName}
- Company: ${prospect.companyName}
- Industry: ${prospect.industry}
- Product purchased: ${productDescription}
${deal ? `- Deal summary: ${deal.summary}` : ""}
${invoice ? `- Invoice: ${invoice.id}, Total: $${invoice.total.toFixed(2)}` : ""}

YOUR ROLE:
- Answer questions about onboarding, setup, and getting started
- Help with product features and usage
- Handle billing and invoice questions
- Resolve technical issues or escalate them
- Be proactive — suggest next steps they might not think of

TONE:
- Warm and helpful, not robotic
- Concise — answer in 2-4 sentences max
- If you don't know something, say so and offer to connect them with a specialist`;
}

// handle a support chat message
export async function handleSupportMessage(
  message: string,
  prospect: Prospect,
  deal: CallRecord | null,
  invoice: Invoice | null,
  productDescription: string,
  chatHistory: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const systemPrompt = buildSupportPrompt(prospect, deal, invoice, productDescription);

  // build conversation context
  const historyText = chatHistory
    .map((msg) => `${msg.role === "user" ? "Customer" : "Support"}: ${msg.content}`)
    .join("\n");

  const fullMessage = historyText
    ? `Previous conversation:\n${historyText}\n\nCustomer's new message: ${message}`
    : `Customer's message: ${message}`;

  return agentThink(systemPrompt, fullMessage);
}
