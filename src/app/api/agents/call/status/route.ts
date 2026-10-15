// ── Twilio call status webhook — fires when the call completes ──

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const callSid = formData.get("CallSid") as string;
  const callStatus = formData.get("CallStatus") as string;
  const duration = formData.get("CallDuration") as string;

  // find the context for this call
  if (globalThis.__callContexts) {
    for (const [, ctx] of globalThis.__callContexts) {
      if ((ctx as Record<string, unknown>).callSid === callSid) {
        (ctx as Record<string, unknown>).finalStatus = callStatus;
        (ctx as Record<string, unknown>).duration = parseInt(duration || "0");
        break;
      }
    }
  }

  // Twilio expects 200 OK
  return new Response("OK", { status: 200 });
}
