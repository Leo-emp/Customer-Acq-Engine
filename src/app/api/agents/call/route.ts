// ── Outbound voice call endpoint ──
// POST: initiates a Twilio outbound call to a prospect

import { NextRequest } from "next/server";
import { makeOutboundCall } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  const { phoneNumber, prospectName, companyName, salesContext } = await req.json();

  if (!phoneNumber) {
    return Response.json({ error: "phoneNumber is required" }, { status: 400 });
  }

  // store the sales context in a global map so the TwiML webhook can access it
  const callId = `call_${Date.now()}`;
  globalThis.__callContexts = globalThis.__callContexts || new Map();
  globalThis.__callContexts.set(callId, {
    prospectName: prospectName || "there",
    companyName: companyName || "your company",
    salesContext: salesContext || "",
    transcript: [],
    turnCount: 0,
  });

  // build the webhook URL from env or request origin
  const baseUrl = process.env.PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `http://localhost:3000`;
  const webhookUrl = `${baseUrl}/api/agents/call/twiml?callId=${encodeURIComponent(callId)}`;

  try {
    const { callSid, status } = await makeOutboundCall(phoneNumber, webhookUrl);

    // link callSid to our context
    const ctx = globalThis.__callContexts.get(callId);
    if (ctx) ctx.callSid = callSid;

    return Response.json({ callSid, callId, status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Call failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
