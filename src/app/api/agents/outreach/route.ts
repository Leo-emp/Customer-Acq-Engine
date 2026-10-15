import { NextRequest } from "next/server";
import { draftEmail, draftFollowUp, draftEmails, sendDraftedEmail } from "@/agents/outreach";
import { buildBrandContext } from "@/lib/brand-context";
import { DEMO_MODE, DEMO_EMAILS, DEMO_EMAIL_QA } from "@/lib/demo-data";
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
    // # demo mode: return pre-cached email drafts
    if (DEMO_MODE) {
      if (action === "draft" && prospect) {
        const demo = DEMO_EMAILS.find(e => e.prospectId === (prospect as Prospect).id) || DEMO_EMAILS[0];
        return Response.json({ email: { ...demo, body: demo.body.replace("{senderName}", name) } });
      }
      if (action === "draft-all") {
        const emails = DEMO_EMAILS.map(e => ({ ...e, body: e.body.replace("{senderName}", name) }));
        return Response.json({ emails });
      }
      if (action === "send") {
        return Response.json({ email: { ...(draft as EmailDraft), sentAt: new Date().toISOString() } });
      }
      if (action === "send-all") {
        const sent = (draft as EmailDraft[]).map(d => ({ ...d, sentAt: new Date().toISOString() }));
        return Response.json({ sent, sentCount: sent.length, failedCount: 0 });
      }
      if (action === "followup") {
        return Response.json({ email: { to: (prospect as Prospect).email, subject: `Re: ${(originalEmail as EmailDraft).subject}`, body: `Hi ${(prospect as Prospect).contactName},\n\nI wanted to follow up on my previous note. I understand things get busy in ${(prospect as Prospect).industry}, so I'll keep this brief.\n\nSince we last connected, we published a new case study from a company similar to ${(prospect as Prospect).companyName} — they consolidated 4 disconnected tools into Salesforce and saw a 34% increase in sales productivity within the first quarter.\n\nWould it be worth a 15-minute call to explore whether we could deliver similar results for your team?\n\nBest,\n${name}`, prospectId: (prospect as Prospect).id } });
      }
      // # Email QA agent — returns pre-cached scan results for all drafted emails
      if (action === "qa-scan") {
        return Response.json({ results: DEMO_EMAIL_QA });
      }
    }

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
