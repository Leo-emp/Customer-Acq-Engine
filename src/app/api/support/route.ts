// ── Support chat API endpoint ──

import { NextRequest } from "next/server";
import { handleSupportMessage } from "@/agents/support";
import { buildBrandContext } from "@/lib/brand-context";
import { DEMO_MODE, DEMO_SUPPORT_RESPONSES } from "@/lib/demo-data";
import type { Prospect, CallRecord, Invoice } from "@/lib/types";

interface SupportRequest {
  message: string;
  prospect: Prospect;
  deal: CallRecord | null;
  invoice: Invoice | null;
  productDescription: string;
  chatHistory: { role: "user" | "assistant"; content: string }[];
  profile?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  const body: SupportRequest = await req.json();

  if (!body.message || !body.prospect) {
    return Response.json({ error: "message and prospect required" }, { status: 400 });
  }

  const brandCtx = buildBrandContext(body.profile as Parameters<typeof buildBrandContext>[0]);
  const enrichedProduct = brandCtx
    ? `${brandCtx}\n\n${body.productDescription || ""}`
    : body.productDescription || "";

  try {
    // # demo mode: return Salesforce-specific pre-cached responses
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 2000));
      const msg = body.message.toLowerCase();
      let reply = "Thanks for reaching out! I'm here to help with anything related to this prospect or our Salesforce CRM solutions. Could you give me a bit more detail about what you're looking for?";
      // # match keywords to cached Salesforce responses
      if (msg.includes("pricing") || msg.includes("cost") || msg.includes("price")) reply = DEMO_SUPPORT_RESPONSES.pricing;
      else if (msg.includes("timeline") || msg.includes("how long") || msg.includes("implement")) reply = DEMO_SUPPORT_RESPONSES.timeline;
      else if (msg.includes("deal") || msg.includes("status") || msg.includes("medvista")) reply = DEMO_SUPPORT_RESPONSES.deal;
      else if (msg.includes("invoice") || msg.includes("quote") || msg.includes("proposal")) reply = DEMO_SUPPORT_RESPONSES.invoice;
      return Response.json({ reply });
    }

    const reply = await handleSupportMessage(
      body.message,
      body.prospect,
      body.deal,
      body.invoice,
      enrichedProduct,
      body.chatHistory || []
    );

    return Response.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Support error";
    return Response.json({ error: message }, { status: 500 });
  }
}
