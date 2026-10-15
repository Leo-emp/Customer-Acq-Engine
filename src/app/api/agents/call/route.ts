// ── Outbound voice call endpoint ──

import { NextRequest } from "next/server";
import { makeOutboundCall } from "@/lib/twilio";
import { getCallContexts } from "@/lib/call-context";

export async function POST(req: NextRequest) {
  const { phoneNumber, prospectName, companyName, salesContext } = await req.json();

  if (!phoneNumber) {
    return Response.json({ error: "phoneNumber is required" }, { status: 400 });
  }

  const callId = `call_${Date.now()}`;
  const contexts = getCallContexts();
  contexts.set(callId, {
    prospectName: prospectName || "there",
    companyName: companyName || "your company",
    salesContext: salesContext || "",
    transcript: [],
    turnCount: 0,
  });

  // build the webhook URL from env or Vercel auto-detected URL
  const baseUrl = process.env.PUBLIC_APP_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
  const webhookUrl = `${baseUrl}/api/agents/call/twiml?callId=${encodeURIComponent(callId)}`;

  try {
    const { callSid, status } = await makeOutboundCall(phoneNumber, webhookUrl);
    const ctx = contexts.get(callId);
    if (ctx) ctx.callSid = callSid;

    return Response.json({ callSid, callId, status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Call failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
