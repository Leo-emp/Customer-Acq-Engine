// ── Resend webhook handler: tracks email opens/clicks ──

import { NextRequest } from "next/server";

// in-memory store for email events (fine for hackathon demo)
// in production this would be a database
export const emailEvents: Map<
  string,
  { type: string; email: string; timestamp: string }[]
> = new Map();

// POST /api/webhooks/email — receives Resend webhook events
export async function POST(req: NextRequest) {
  const body = await req.json();

  const eventType = body.type; // email.sent, email.delivered, email.opened, email.clicked, email.bounced
  const emailTo = body.data?.to?.[0] || body.data?.email_id;

  if (emailTo) {
    const existing = emailEvents.get(emailTo) || [];
    existing.push({
      type: eventType,
      email: emailTo,
      timestamp: new Date().toISOString(),
    });
    emailEvents.set(emailTo, existing);
  }

  // return 200 to acknowledge the webhook
  return Response.json({ received: true });
}

// GET /api/webhooks/email — check email status (used by frontend polling)
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    // return all events
    const all: Record<string, unknown> = {};
    emailEvents.forEach((events, key) => {
      all[key] = events;
    });
    return Response.json(all);
  }

  const events = emailEvents.get(email) || [];
  const opened = events.some((e) => e.type === "email.opened");
  const delivered = events.some((e) => e.type === "email.delivered");

  return Response.json({ email, events, opened, delivered });
}
