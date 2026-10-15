// ── Retrieve call transcript after a Twilio call ──

import { NextRequest } from "next/server";
import { getCallContexts } from "@/lib/call-context";

export async function GET(req: NextRequest) {
  const callId = req.nextUrl.searchParams.get("callId");
  const contexts = getCallContexts();

  if (!callId || !contexts.has(callId)) {
    return Response.json({ error: "Call not found" }, { status: 404 });
  }

  const ctx = contexts.get(callId)!;
  const transcript = ctx.transcript || [];
  const status = ctx.finalStatus || "in-progress";
  const duration = ctx.duration || 0;

  const transcriptText = transcript
    .map((t) => `${t.role === "agent" ? "Sales Agent" : "Prospect"}: ${t.text}`)
    .join("\n\n");

  return Response.json({
    callId,
    status,
    duration,
    transcript: transcriptText,
    turns: transcript.length,
    prospectName: ctx.prospectName,
    companyName: ctx.companyName,
  });
}
