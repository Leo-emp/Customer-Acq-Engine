// ── Support chat API endpoint ──

import { NextRequest } from "next/server";
import { handleSupportMessage } from "@/agents/support";
import { buildBrandContext } from "@/lib/brand-context";
import { DEMO_MODE } from "@/lib/demo-data";
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
    // # demo mode: return helpful pre-cached response
    if (DEMO_MODE) {
      const msg = body.message.toLowerCase();
      let reply = "Thanks for reaching out! I'd be happy to help. Could you give me a bit more detail about what you're looking for?";
      if (msg.includes("pricing") || msg.includes("cost") || msg.includes("price")) reply = "Our pricing is project-based and depends on scope. For a typical MVP or product redesign, projects start at $15,000-25,000. For ongoing partnerships, we offer monthly retainers starting at $8,000/month. I'd recommend scheduling a quick discovery call so we can scope your specific needs and provide an accurate quote.";
      else if (msg.includes("timeline") || msg.includes("how long") || msg.includes("delivery")) reply = "Our typical project timelines are: MVP builds (6-10 weeks), product redesigns (4-8 weeks), brand identity (3-4 weeks). We can accelerate timelines for an additional fee. For your specific project, we'd nail down the exact timeline during our discovery session.";
      else if (msg.includes("deal") || msg.includes("status")) reply = `Based on our records, the prospect from ${body.prospect.companyName} is currently marked as "${body.deal?.outcome || "in progress"}". ${body.deal?.nextAction || "The next step is to schedule a follow-up call to discuss specifics."}`;
      else if (msg.includes("invoice")) reply = body.invoice ? `Invoice ${body.invoice.id} for ${body.invoice.companyName} totals $${body.invoice.total.toLocaleString()}. It was generated on ${body.invoice.createdAt}. Would you like me to resend it or make any changes?` : "No invoice has been generated yet for this prospect. Would you like me to create one?";
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
