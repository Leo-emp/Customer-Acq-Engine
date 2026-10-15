// ── Twilio call status webhook — fires when the call completes ──

import { NextRequest } from "next/server";
import { getCallContexts } from "@/lib/call-context";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const callSid = formData.get("CallSid") as string;
  const callStatus = formData.get("CallStatus") as string;
  const duration = formData.get("CallDuration") as string;

  const contexts = getCallContexts();
  for (const [, ctx] of contexts) {
    if (ctx.callSid === callSid) {
      ctx.finalStatus = callStatus;
      ctx.duration = parseInt(duration || "0");
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
