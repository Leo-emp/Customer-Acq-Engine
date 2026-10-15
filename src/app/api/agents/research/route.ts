// ── Research API: leads, competitor analysis, industry research, market mapping ──

import { NextRequest } from "next/server";
import { researchProspects } from "@/agents/research";
import { buildBrandContext } from "@/lib/brand-context";
import { agentThinkJSON } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { action, query, profile } = await req.json();

  const brandCtx = buildBrandContext(profile);
  const companyName = profile?.companyName || "our company";
  const product = profile?.productDescription || "our product";
  const market = profile?.targetMarket || "B2B companies";
  const industry = profile?.industry || "technology";
  const valueProps = profile?.valueProposition || "";
  const features = profile?.keyFeatures?.join(", ") || "";

  try {
    // ── ACTION: Search for leads (Apollo) ──
    if (!action || action === "leads") {
      if (!query || typeof query !== "string") {
        return Response.json({ error: "query is required" }, { status: 400 });
      }
      const enrichedQuery = brandCtx ? `${brandCtx}\n\nSearch Goal: ${query}` : query;
      const prospects = await researchProspects(enrichedQuery);

      // # generate a summary of the search results
      const summary = prospects.length > 0
        ? {
            totalLeads: prospects.length,
            verifiedEmails: prospects.filter(p => p.emailVerified).length,
            avgScore: Math.round(prospects.reduce((s, p) => s + p.score, 0) / prospects.length),
            topIndustries: [...new Set(prospects.map(p => p.industry).filter(Boolean))].slice(0, 5),
            topLocations: [...new Set(prospects.map(p => p.location).filter(Boolean))].slice(0, 5),
            scoreBreakdown: {
              excellent: prospects.filter(p => p.score >= 80).length,
              good: prospects.filter(p => p.score >= 60 && p.score < 80).length,
              fair: prospects.filter(p => p.score < 60).length,
            },
          }
        : null;

      return Response.json({ action: "leads", prospects, summary });
    }

    // ── ACTION: Competitor analysis ──
    if (action === "competitors") {
      const result = await agentThinkJSON<{
        competitors: {
          name: string;
          website: string;
          description: string;
          strengths: string[];
          weaknesses: string[];
          pricing: string;
          marketPosition: string;
          threatLevel: "high" | "medium" | "low";
        }[];
        ourAdvantages: string[];
        ourVulnerabilities: string[];
        strategicRecommendations: string[];
        marketGaps: string[];
      }>(
        `You are a competitive intelligence analyst. Given a company's profile, identify their top 5-8 competitors and provide a comprehensive competitive analysis.

Be specific, detailed, and strategic. Each competitor entry should have real, actionable intelligence.

For each competitor provide:
- name: Company name
- website: Their website URL (best guess based on your knowledge)
- description: What they do in 2-3 sentences
- strengths: 3-4 specific strengths (be concrete, not generic)
- weaknesses: 2-3 specific weaknesses or gaps
- pricing: Their pricing model/range if known, otherwise "Not publicly listed"
- marketPosition: One of "market leader", "strong challenger", "niche player", "emerging", "declining"
- threatLevel: "high", "medium", or "low" based on direct competition overlap

Also provide:
- ourAdvantages: 4-5 specific advantages our company has over the field
- ourVulnerabilities: 3-4 areas where we're vulnerable
- strategicRecommendations: 4-5 actionable strategic moves to outcompete
- marketGaps: 3-4 underserved market segments or unmet needs we could exploit

Return JSON matching this schema exactly.`,
        `Company: ${companyName}\nProduct: ${product}\nIndustry: ${industry}\nTarget Market: ${market}\nValue Proposition: ${valueProps}\nKey Features: ${features}\nPricing: ${profile?.pricing || "Unknown"}`
      );

      return Response.json({ action: "competitors", ...result });
    }

    // ── ACTION: Industry research ──
    if (action === "industry") {
      const result = await agentThinkJSON<{
        overview: {
          industryName: string;
          marketSize: string;
          growthRate: string;
          maturityStage: string;
          summary: string;
        };
        trends: { trend: string; impact: string; timeframe: string; relevance: "high" | "medium" | "low" }[];
        keyPlayers: { name: string; role: string; marketShare: string }[];
        opportunities: { opportunity: string; description: string; difficulty: string; potentialRevenue: string }[];
        threats: { threat: string; severity: "high" | "medium" | "low"; mitigation: string }[];
        regulations: { regulation: string; impact: string; status: string }[];
        outlook: string;
      }>(
        `You are an industry research analyst. Provide a comprehensive, structured industry report based on the company profile.

Be specific with numbers, percentages, and concrete data points wherever possible. This should read like a professional industry report.

Return JSON with:
- overview: { industryName, marketSize (e.g. "$4.2B in 2025"), growthRate (e.g. "12.5% CAGR"), maturityStage (one of "emerging", "growth", "mature", "declining"), summary (3-4 sentences) }
- trends: Array of 5-6 trends with { trend (name), impact (2-3 sentences), timeframe ("short-term"/"medium-term"/"long-term"), relevance ("high"/"medium"/"low") }
- keyPlayers: Array of 6-8 players with { name, role (e.g. "Market leader in enterprise segment"), marketShare (e.g. "~15%") }
- opportunities: Array of 4-5 with { opportunity (name), description (2-3 sentences), difficulty ("easy"/"moderate"/"hard"), potentialRevenue (e.g. "$500K-2M ARR") }
- threats: Array of 3-4 with { threat, severity, mitigation (1-2 sentences) }
- regulations: Array of 2-3 with { regulation, impact (1-2 sentences), status ("active"/"proposed"/"upcoming") }
- outlook: 3-4 sentence forward-looking industry outlook`,
        `Company: ${companyName}\nProduct: ${product}\nIndustry: ${industry}\nTarget Market: ${market}\nValue Proposition: ${valueProps}`
      );

      return Response.json({ action: "industry", ...result });
    }

    // ── ACTION: Market mapping ──
    if (action === "market") {
      const result = await agentThinkJSON<{
        totalAddressableMarket: { size: string; description: string };
        serviceableMarket: { size: string; description: string };
        segments: {
          name: string;
          size: string;
          growth: string;
          competition: "saturated" | "competitive" | "moderate" | "underserved" | "blue ocean";
          ourFit: "strong" | "moderate" | "weak";
          description: string;
          entryStrategy: string;
        }[];
        buyerPersonas: {
          title: string;
          companySize: string;
          painPoints: string[];
          decisionFactors: string[];
          budget: string;
        }[];
        positioningMap: {
          axes: { x: string; y: string };
          players: { name: string; x: "low" | "medium" | "high"; y: "low" | "medium" | "high" }[];
          ourPosition: { x: "low" | "medium" | "high"; y: "low" | "medium" | "high" };
        };
        entryRecommendation: string;
        prioritySegments: string[];
      }>(
        `You are a market strategy consultant. Create a comprehensive market map based on the company profile.

Provide strategic, actionable market intelligence. Be specific about sizes, growth rates, and positioning.

Return JSON with:
- totalAddressableMarket: { size (e.g. "$12B"), description (1-2 sentences) }
- serviceableMarket: { size (e.g. "$2.1B"), description (1-2 sentences) }
- segments: Array of 5-6 market segments with { name, size, growth (e.g. "15% YoY"), competition ("saturated"/"competitive"/"moderate"/"underserved"/"blue ocean"), ourFit ("strong"/"moderate"/"weak"), description (2-3 sentences), entryStrategy (1-2 sentences) }
- buyerPersonas: Array of 3-4 with { title (e.g. "VP of Marketing at mid-market SaaS"), companySize (e.g. "50-200 employees"), painPoints (3-4 items), decisionFactors (3-4 items), budget (e.g. "$5K-15K/year") }
- positioningMap: { axes: { x: dimension name, y: dimension name }, players: array of 5-6 with { name, x, y }, ourPosition: { x, y } }
- entryRecommendation: 3-4 sentence strategic recommendation
- prioritySegments: Top 3 segments to target first (by name)`,
        `Company: ${companyName}\nProduct: ${product}\nIndustry: ${industry}\nTarget Market: ${market}\nValue Proposition: ${valueProps}\nKey Features: ${features}\nPricing: ${profile?.pricing || "Unknown"}`
      );

      return Response.json({ action: "market", ...result });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Research failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
