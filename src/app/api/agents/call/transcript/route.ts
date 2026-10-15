// ── Retrieve call transcript after a Twilio call ──

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const callId = req.nextUrl.searchParams.get("callId");
  if (!callId || !globalThis.__callContexts?.has(callId)) {
    return Response.json({ error: "Call not found" }, { status: 404 });
  }

  const ctx = globalThis.__callContexts.get(callId) as Record<string, unknown>;
  const transcript = (ctx.transcript as { role: string; text: string }[]) || [];
  const status = ctx.finalStatus || "in-progress";
  const duration = ctx.duration || 0;

  // format transcript as readable text
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
