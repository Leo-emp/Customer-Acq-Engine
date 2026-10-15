// ── Email sending: Gmail API (primary) → Resend (fallback) ──

import { Resend } from "resend";
import { sendGmail } from "./gmail";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
  }
  return _resend;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  // try Gmail API first (emails appear in user's Sent folder)
  const hasGmail = process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN;

  if (hasGmail) {
    try {
      const result = await sendGmail({ to, subject, html });
      return { data: { id: result.messageId }, error: null };
    } catch (err) {
      console.error("Gmail send failed, falling back to Resend:", err);
    }
  }

  // fallback to Resend
  const result = await getResend().emails.send({
    from: from || process.env.RESEND_FROM_EMAIL || "AcquireAI <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  return result;
}

export function formatEmailHTML(body: string, companyName: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
      <div style="border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #1f2937; font-size: 18px;">${companyName}</h2>
      </div>
      <div style="color: #374151; font-size: 15px; line-height: 1.7;">
        ${body.split("\n").map((line) => (line.trim() ? `<p style="margin: 0 0 12px;">${line}</p>` : "")).join("")}
      </div>
    </div>
  `;
}
