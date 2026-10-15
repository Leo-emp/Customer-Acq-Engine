// ── Sales Agent: analyzes call outcomes + handles follow-ups ──

import { agentThinkJSON } from "@/lib/gemini";
import type { Prospect, CallRecord, DealOutcome } from "@/lib/types";

const SYSTEM_PROMPT = `You are a senior sales analyst. Analyze call transcripts and email exchanges to classify deal outcomes and determine next actions.

CLASSIFICATION:
- CLOSED: Prospect explicitly agreed to buy, sign up, proceed, or requested a contract/invoice
- INTERESTED: Positive response, wants more info, a meeting, or to discuss further
- OBJECTION: Raised specific concerns (price, timing, competition, features, etc.)
- REJECTED: Clearly not interested, asked not to be contacted, or ended the call

ANALYSIS RULES:
- Be accurate — don't classify as CLOSED unless there's explicit agreement
- Extract specific quotes that support your classification
- For INTERESTED: draft a follow-up email with a Calendly-style meeting link
- For OBJECTION: draft a response addressing their SPECIFIC concern
- For CLOSED: summarize what was agreed upon (terms, pricing, timeline)
- For REJECTED: note the reason for future reference

Return JSON: {
  "outcome": "closed" | "interested" | "objection" | "rejected",
  "summary": "2-3 sentence summary of the conversation",
  "keyQuotes": ["relevant quote from prospect"],
  "nextAction": "What should happen next",
  "followUpEmail": { "subject": "...", "body": "..." } // only for interested/objection
  "dealTerms": "..." // only for closed
}`;

interface SalesAnalysis {
  outcome: DealOutcome;
  summary: string;
  keyQuotes: string[];
  nextAction: string;
  followUpEmail?: { subject: string; body: string };
  dealTerms?: string;
}

// analyze a call transcript and determine the outcome
export async function analyzeCall(
  prospect: Prospect,
  transcript: string,
  emailThread: string,
  productDescription: string
): Promise<CallRecord> {
  const analysis = await agentThinkJSON<SalesAnalysis>(
    SYSTEM_PROMPT,
    `PROSPECT: ${prospect.contactName} at ${prospect.companyName}
INDUSTRY: ${prospect.industry}
FIT REASON: ${prospect.fitReason}
PRODUCT: ${productDescription}

EMAIL SENT:
${emailThread}

CALL TRANSCRIPT:
${transcript}`
  );

  return {
    prospectId: prospect.id,
    transcript,
    duration: 0, // set by caller
    outcome: analysis.outcome,
    summary: analysis.summary,
    nextAction: analysis.nextAction,
  };
}

// analyze an email reply for intent (when prospect replies to email instead of taking call)
export async function analyzeEmailReply(
  prospect: Prospect,
  originalEmail: string,
  reply: string,
  productDescription: string
): Promise<CallRecord> {
  const analysis = await agentThinkJSON<SalesAnalysis>(
    SYSTEM_PROMPT,
    `PROSPECT: ${prospect.contactName} at ${prospect.companyName}
PRODUCT: ${productDescription}

ORIGINAL EMAIL SENT:
${originalEmail}

PROSPECT'S REPLY:
${reply}

Analyze this email reply as you would a call transcript.`
  );

  return {
    prospectId: prospect.id,
    transcript: `Email thread:\nSent: ${originalEmail}\nReply: ${reply}`,
    duration: 0,
    outcome: analysis.outcome,
    summary: analysis.summary,
    nextAction: analysis.nextAction,
  };
}

// generate Calendly-style meeting link message
export function generateMeetingEmail(
  prospect: Prospect,
  calendlyUrl: string
): { subject: string; body: string } {
  return {
    subject: `Let's schedule a quick call, ${prospect.contactName}`,
    body: `Hi ${prospect.contactName},

Thanks for your interest! I'd love to walk you through how we can help ${prospect.companyName}.

Pick a time that works for you: ${calendlyUrl || "https://calendly.com/demo"}

Looking forward to speaking with you.

Best regards`,
  };
}
