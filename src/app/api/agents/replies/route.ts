// ── Check Gmail inbox for prospect replies ──

import { NextRequest } from "next/server";
import { checkReplies } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  const minutes = parseInt(req.nextUrl.searchParams.get("minutes") || "60");

  try {
    const replies = await checkReplies(minutes);
    return Response.json({ replies, count: replies.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to check replies";
    return Response.json({ error: message, replies: [], count: 0 }, { status: 500 });
  }
}
