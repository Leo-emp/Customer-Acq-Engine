// ── TwiML webhook: handles the AI conversation loop during a Twilio call ──
// Twilio calls this URL when the call connects and after each speech gather

import { NextRequest } from "next/server";
import { agentThink } from "@/lib/gemini";

interface CallContext {
  prospectName: string;
  companyName: string;
  salesContext: string;
  transcript: { role: string; text: string }[];
  turnCount: number;
  callSid?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __callContexts: Map<string, CallContext> | undefined;
}

// return TwiML XML response
function twiml(xml: string) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${xml}</Response>`, {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(req: NextRequest) {
  const callId = req.nextUrl.searchParams.get("callId");
  if (!callId || !globalThis.__callContexts?.has(callId)) {
    return twiml('<Say voice="Polly.Matthew">Sorry, something went wrong. Goodbye.</Say><Hangup/>');
  }

  const ctx = globalThis.__callContexts.get(callId)!;

  // parse form data from Twilio
  const formData = await req.formData();
  const speechResult = formData.get("SpeechResult") as string | null;
  const callStatus = formData.get("CallStatus") as string | null;

  // if call ended, clean up
  if (callStatus === "completed" || callStatus === "busy" || callStatus === "no-answer" || callStatus === "failed") {
    return twiml("<Hangup/>");
  }

  // if we got speech from the prospect, add to transcript
  if (speechResult) {
    ctx.transcript.push({ role: "prospect", text: speechResult });
  }

  ctx.turnCount++;

  // max 6 turns then wrap up
  if (ctx.turnCount > 6) {
    const closing = "Thank you so much for your time today. I'll send over a summary email with everything we discussed. Have a great day!";
    ctx.transcript.push({ role: "agent", text: closing });
    return twiml(`<Say voice="Polly.Matthew">${escapeXml(closing)}</Say><Hangup/>`);
  }

  // generate AI response using Gemini
  try {
    const conversationHistory = ctx.transcript
      .map((t) => `${t.role === "agent" ? "You" : "Prospect"}: ${t.text}`)
      .join("\n");

    const prompt = ctx.turnCount === 1
      ? `You are a professional sales representative making a B2B cold call. Be friendly, concise, and professional.

CONTEXT:
${ctx.salesContext}

You just called ${ctx.prospectName} at ${ctx.companyName}. They answered the phone.
Deliver a brief, friendly opening pitch in 2-3 sentences. Introduce yourself, mention why you're calling, and ask an engaging question.
Keep it under 30 seconds of speaking time. Do NOT use markdown. Speak naturally.`
      : `You are on a live B2B sales call with ${ctx.prospectName} at ${ctx.companyName}.

CONTEXT:
${ctx.salesContext}

CONVERSATION SO FAR:
${conversationHistory}

The prospect just said: "${speechResult}"

Respond naturally in 2-3 sentences. Address what they said, provide value, and keep the conversation moving.
If they seem interested, suggest a follow-up meeting. If they have objections, handle them gracefully.
If they want to end the call, wrap up politely.
Keep it under 25 seconds of speaking time. Do NOT use markdown. Speak naturally.`;

    const aiResponse = await agentThink(
      "You are a professional AI sales agent on a live phone call. Respond naturally and concisely.",
      prompt
    );
    const cleanResponse = aiResponse.replace(/[*#_`]/g, "").trim();

    ctx.transcript.push({ role: "agent", text: cleanResponse });

    // say the response and gather the next speech input
    return twiml(
      `<Say voice="Polly.Matthew">${escapeXml(cleanResponse)}</Say>` +
      `<Gather input="speech" speechTimeout="3" timeout="8" action="/api/agents/call/twiml?callId=${callId}" method="POST">` +
      `<Say voice="Polly.Matthew"> </Say>` +
      `</Gather>` +
      `<Say voice="Polly.Matthew">It seems like you might be busy. I'll follow up via email. Thank you for your time!</Say><Hangup/>`
    );
  } catch {
    return twiml('<Say voice="Polly.Matthew">I apologize, let me follow up with you via email instead. Thank you for your time!</Say><Hangup/>');
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
