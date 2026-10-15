// ── Gmail API client: send emails + check replies ──

import { google } from "googleapis";

function getOAuth2Client() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN must be set");
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, "https://developers.google.com/oauthplayground");
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
}

function getGmail() {
  return google.gmail({ version: "v1", auth: getOAuth2Client() });
}

// build a raw RFC 2822 email
function buildRawEmail(params: {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): string {
  const boundary = `boundary_${Date.now()}`;
  const lines = [
    `From: ${params.from}`,
    `To: ${params.to}`,
    `Subject: ${params.subject}`,
    params.replyTo ? `Reply-To: ${params.replyTo}` : "",
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    "",
    params.html,
    "",
    `--${boundary}--`,
  ].filter(Boolean);

  return Buffer.from(lines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// send an email via Gmail API
export async function sendGmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ messageId: string; threadId: string }> {
  const gmail = getGmail();
  const senderEmail = process.env.GMAIL_SENDER_EMAIL || "me";

  const raw = buildRawEmail({
    from: senderEmail,
    to: params.to,
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo,
  });

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return {
    messageId: res.data.id || "",
    threadId: res.data.threadId || "",
  };
}

// check for replies to our sent emails
export async function checkReplies(sinceMinutes: number = 30): Promise<
  { from: string; subject: string; snippet: string; threadId: string; receivedAt: string }[]
> {
  const gmail = getGmail();

  // search for recent replies in inbox
  const after = Math.floor((Date.now() - sinceMinutes * 60 * 1000) / 1000);
  const res = await gmail.users.messages.list({
    userId: "me",
    q: `in:inbox is:unread after:${after}`,
    maxResults: 20,
  });

  if (!res.data.messages || res.data.messages.length === 0) {
    return [];
  }

  const replies = await Promise.all(
    res.data.messages.map(async (msg) => {
      const full = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      });

      const headers = full.data.payload?.headers || [];
      const from = headers.find((h) => h.name === "From")?.value || "";
      const subject = headers.find((h) => h.name === "Subject")?.value || "";
      const date = headers.find((h) => h.name === "Date")?.value || "";

      return {
        from,
        subject,
        snippet: full.data.snippet || "",
        threadId: full.data.threadId || "",
        receivedAt: date,
      };
    })
  );

  return replies;
}

// get the sender's email address
export async function getSenderEmail(): Promise<string> {
  const gmail = getGmail();
  const profile = await gmail.users.getProfile({ userId: "me" });
  return profile.data.emailAddress || "";
}
