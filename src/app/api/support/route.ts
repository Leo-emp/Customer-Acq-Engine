// ── Support chat API endpoint ──

import { NextRequest } from "next/server";
import { handleSupportMessage } from "@/agents/support";
import type { Prospect, CallRecord, Invoice } from "@/lib/types";

interface SupportRequest {
  message: string;
  prospect: Prospect;
  deal: CallRecord | null;
  invoice: Invoice | null;
  productDescription: string;
  chatHistory: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: NextRequest) {
  const body: SupportRequest = await req.json();

  if (!body.message || !body.prospect) {
    return Response.json({ error: "message and prospect required" }, { status: 400 });
  }

  try {
    const reply = await handleSupportMessage(
      body.message,
      body.prospect,
      body.deal,
      body.invoice,
      body.productDescription,
      body.chatHistory || []
    );

    return Response.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Support error";
    return Response.json({ error: message }, { status: 500 });
  }
}
