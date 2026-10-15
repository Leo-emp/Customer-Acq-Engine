// ── Outreach Agent: drafts personalized emails + follow-ups ──

import { agentThinkJSON } from "@/lib/gemini";
import { sendEmail, formatEmailHTML } from "@/lib/resend";
import { buildCallPrompt } from "@/lib/elevenlabs";
import type { Prospect, EmailDraft } from "@/lib/types";

const EMAIL_SYSTEM_PROMPT = `You are a real person writing a genuine business email. NOT a marketer, NOT an AI — a human who found someone interesting and wants to connect.

VOICE:
- Write like you're emailing a colleague you haven't met yet
- Be direct about why you're reaching out — no fluff, no filler
- Show you actually looked at their company (reference specifics from fitReason)
- One clear ask at the end — keep it low-pressure ("Would it make sense to chat?" not "BOOK A DEMO NOW")
- Short paragraphs, 2-3 sentences each
- Total email: 80-120 words. Shorter is better.

BANNED PHRASES (these scream AI/spam):
- "I hope this finds you well"
- "I wanted to reach out"
- "I came across your company"
- "In today's fast-paced"
- "Streamline your workflow"
- "Leverage our solution"
- "Schedule a quick call"
- "Revolutionary/game-changing/cutting-edge"
- "I'd love to connect"
- Any sentence starting with "As a"
- Any emoji

GOOD OPENERS (vary these):
- Jump straight into what caught your eye about their business
- Ask a question about a challenge in their industry
- Reference a specific thing about their company/role
- Share a relevant insight or stat

SIGN-OFF: Just first name. No "Best regards" or "Looking forward to hearing from you".

Return JSON: {
  "subject": "Short, specific, lowercase-style subject (like a real person would write, not Title Case Marketing)",
  "body": "Full email body"
}`;

const FOLLOWUP_SYSTEM_PROMPT = `You are writing a follow-up email. The first email got no response. This is NOT a copy-paste of the first email.

RULES:
- Acknowledge the first email briefly ("circling back" or similar — one line max)
- Add NEW value — a different angle, a quick insight, a relevant stat, or a case study mention
- Even shorter than the first email: 50-80 words
- Different subject line (reply-style: "re: ..." or a fresh angle)
- Still sound like a real person, not a drip campaign
- End with an easy out: "If timing's off, no worries at all"
- No guilt-tripping ("I noticed you haven't responded")

Return JSON: {
  "subject": "Follow-up subject line",
  "body": "Full follow-up body"
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
    `PROSPECT:
Name: ${prospect.contactName}
Role/Title: (infer from context)
Company: ${prospect.companyName}
Industry: ${prospect.industry}
Website: ${prospect.website}
Why they're a fit: ${prospect.fitReason}

WHAT I'M SELLING:
${productDescription}

MY NAME: ${senderName}

Write the email.`
  );

  return {
    to: prospect.email,
    subject: result.subject,
    body: result.body,
    prospectId: prospect.id,
  };
}

// draft a follow-up email referencing the original
export async function draftFollowUp(
  prospect: Prospect,
  originalEmail: EmailDraft,
  productDescription: string,
  senderName: string
): Promise<EmailDraft> {
  const result = await agentThinkJSON<EmailOutput>(
    FOLLOWUP_SYSTEM_PROMPT,
    `PROSPECT:
Name: ${prospect.contactName}
Company: ${prospect.companyName}
Industry: ${prospect.industry}
Why they're a fit: ${prospect.fitReason}

ORIGINAL EMAIL SENT:
Subject: ${originalEmail.subject}
Body: ${originalEmail.body}

WHAT I'M SELLING:
${productDescription}

MY NAME: ${senderName}

Write a follow-up that adds new value.`
  );

  return {
    to: prospect.email,
    subject: result.subject,
    body: result.body,
    prospectId: prospect.id,
  };
}

// draft emails for multiple prospects in parallel
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

// generate a voice call script for a prospect
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
