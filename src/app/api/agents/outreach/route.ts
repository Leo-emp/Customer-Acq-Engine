import { NextRequest } from "next/server";
import { draftEmail, sendDraftedEmail } from "@/agents/outreach";
import { buildBrandContext } from "@/lib/brand-context";
import type { Prospect } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { action, prospect, productDescription, senderName, senderCompany, draft, profile } = await req.json();

  const brandCtx = buildBrandContext(profile);

  try {
    if (action === "draft") {
      if (!prospect || !senderName) {
        return Response.json({ error: "prospect and senderName are required" }, { status: 400 });
      }
      const enrichedProduct = brandCtx
        ? `${brandCtx}\n\nProduct: ${productDescription || profile?.productDescription || ""}`
        : productDescription || "";
      const email = await draftEmail(prospect as Prospect, enrichedProduct, senderName);
      return Response.json({ email });
    }

    if (action === "send") {
      if (!draft || !senderCompany) {
        return Response.json({ error: "draft and senderCompany are required" }, { status: 400 });
      }
      const sent = await sendDraftedEmail(draft, senderCompany);
      return Response.json({ email: sent });
    }

    return Response.json({ error: "Invalid action. Use 'draft' or 'send'" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Outreach failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
