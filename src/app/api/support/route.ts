// ── Support chat API endpoint ──

import { NextRequest } from "next/server";
import { handleSupportMessage } from "@/agents/support";
import { buildBrandContext } from "@/lib/brand-context";
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
