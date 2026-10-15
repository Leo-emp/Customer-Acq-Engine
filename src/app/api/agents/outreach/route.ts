import { NextRequest } from "next/server";
import { draftEmail, draftFollowUp, draftEmails, sendDraftedEmail } from "@/agents/outreach";
import { buildBrandContext } from "@/lib/brand-context";
import type { Prospect, EmailDraft } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { action, prospect, prospects, productDescription, senderName, senderCompany, draft, originalEmail, profile } = await req.json();

  const brandCtx = buildBrandContext(profile);
  const enrichedProduct = brandCtx
    ? `${brandCtx}\n\nProduct: ${productDescription || profile?.productDescription || ""}`
    : productDescription || profile?.productDescription || "";
  const name = senderName || profile?.senderName || "Team";
  const company = senderCompany || profile?.companyName || "Our Company";

  try {
    // draft a single personalized email
    if (action === "draft") {
      if (!prospect) return Response.json({ error: "prospect is required" }, { status: 400 });
      const email = await draftEmail(prospect as Prospect, enrichedProduct, name);
      return Response.json({ email });
    }

    // draft a follow-up email referencing the original
    if (action === "followup") {
      if (!prospect || !originalEmail) return Response.json({ error: "prospect and originalEmail are required" }, { status: 400 });
      const email = await draftFollowUp(prospect as Prospect, originalEmail as EmailDraft, enrichedProduct, name);
      return Response.json({ email });
    }

    // draft emails for all prospects in parallel
    if (action === "draft-all") {
      if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
        return Response.json({ error: "prospects array is required" }, { status: 400 });
      }
      const emails = await draftEmails(prospects as Prospect[], enrichedProduct, name);
      return Response.json({ emails });
    }

    // send a single drafted email
    if (action === "send") {
      if (!draft) return Response.json({ error: "draft is required" }, { status: 400 });
      const sent = await sendDraftedEmail(draft as EmailDraft, company);
      return Response.json({ email: sent });
    }

    // send all unsent drafts
    if (action === "send-all") {
      if (!Array.isArray(draft) || draft.length === 0) {
        return Response.json({ error: "draft array is required" }, { status: 400 });
      }
      const results = await Promise.allSettled(
        (draft as EmailDraft[]).map((d) => sendDraftedEmail(d, company))
      );
      const sent = results
        .filter((r): r is PromiseFulfilledResult<EmailDraft> => r.status === "fulfilled")
        .map((r) => r.value);
      const failed = results.filter((r) => r.status === "rejected").length;
      return Response.json({ sent, sentCount: sent.length, failedCount: failed });
    }

    return Response.json({ error: "Invalid action. Use: draft, followup, draft-all, send, send-all" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Outreach failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
