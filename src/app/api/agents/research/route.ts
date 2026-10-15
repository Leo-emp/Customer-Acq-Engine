import { NextRequest } from "next/server";
import { researchProspects } from "@/agents/research";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!query || typeof query !== "string") {
    return Response.json({ error: "query is required" }, { status: 400 });
  }

  try {
    const prospects = await researchProspects(query);
    return Response.json({ prospects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Research failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
