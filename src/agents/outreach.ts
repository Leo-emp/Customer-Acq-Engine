// ── Outreach Agent: drafts personalized emails + voice call scripts ──

import { agentThinkJSON } from "@/lib/gemini";
import { sendEmail, formatEmailHTML } from "@/lib/resend";
import { buildCallPrompt } from "@/lib/elevenlabs";
import type { Prospect, EmailDraft } from "@/lib/types";

const EMAIL_SYSTEM_PROMPT = `You are an expert cold outreach copywriter. Write personalized, concise sales emails.

RULES:
- Reference something SPECIFIC about the prospect's business (from fitReason)
- State the value proposition in 1-2 sentences
- Include a clear call to action (reply or book a call)
- Sound human, warm, and conversational — NOT templated
- Under 150 words total
- No emoji, no excessive exclamation marks
- No "I hope this email finds you well" or similar clichés
- Professional but personable tone

Return JSON: {
  "subject": "Short, specific subject line (not generic)",
  "body": "Full email body text with line breaks"
}`;

interface EmailOutput {
  subject: string;
  body: string;
}

// draft a personalized email for a prospect
export async function draftEmail(
  prospect: Prospect,
  productDescription: string,
  senderName: string
): Promise<EmailDraft> {
  const result = await agentThinkJSON<EmailOutput>(
    EMAIL_SYSTEM_PROMPT,
    `Prospect: ${prospect.contactName} at ${prospect.companyName}
Industry: ${prospect.industry}
Why they're a fit: ${prospect.fitReason}
Website: ${prospect.website}

Product/Service being sold: ${productDescription}
Sender name: ${senderName}

Write the email.`
  );

  return {
    to: prospect.email,
    subject: result.subject,
    body: result.body,
    prospectId: prospect.id,
  };
}

// draft emails for multiple prospects
export async function draftEmails(
  prospects: Prospect[],
  productDescription: string,
  senderName: string
): Promise<EmailDraft[]> {
  const drafts = await Promise.all(
    prospects.map((p) => draftEmail(p, productDescription, senderName))
  );
  return drafts;
}

// send a drafted email via Resend
export async function sendDraftedEmail(
  draft: EmailDraft,
  senderCompany: string
): Promise<EmailDraft> {
  const html = formatEmailHTML(draft.body, senderCompany);

  await sendEmail({
    to: draft.to,
    subject: draft.subject,
    html,
  });

  return {
    ...draft,
    sentAt: new Date().toISOString(),
  };
}

// generate a voice call script for a prospect (used by ElevenLabs)
export function generateCallScript(
  prospect: Prospect,
  productDescription: string,
  emailSubject: string
): string {
  return buildCallPrompt(
    prospect.contactName,
    prospect.companyName,
    productDescription,
    emailSubject,
    prospect.fitReason
  );
}
