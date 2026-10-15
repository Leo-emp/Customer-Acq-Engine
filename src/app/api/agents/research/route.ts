import { NextRequest } from "next/server";
import { researchProspects } from "@/agents/research";
import { buildBrandContext } from "@/lib/brand-context";

export async function POST(req: NextRequest) {
  const { query, profile } = await req.json();
  if (!query || typeof query !== "string") {
    return Response.json({ error: "query is required" }, { status: 400 });
  }

  const brandCtx = buildBrandContext(profile);
  const enrichedQuery = brandCtx
    ? `${brandCtx}\n\nSearch Goal: ${query}`
    : query;

  try {
    const prospects = await researchProspects(enrichedQuery);
    return Response.json({ prospects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Research failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
