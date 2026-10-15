// ── Research Agent: finds and qualifies leads via Apollo.io ──

import { agentThinkJSON } from "@/lib/gemini";
import { searchPeople, type ApolloLead } from "@/lib/apollo";
import type { Prospect } from "@/lib/types";

// Gemini extracts structured Apollo search params from a natural language prompt
interface ApolloSearchParams {
  personTitles: string[];
  personLocations: string[];
  organizationIndustries: string[];
  keywords: string;
}

// step 1: convert user prompt into Apollo search parameters
async function promptToApolloParams(prompt: string): Promise<ApolloSearchParams> {
  const result = await agentThinkJSON<ApolloSearchParams>(
    `You convert a business prospecting goal into structured search parameters for a B2B lead database.

Extract:
- personTitles: job titles of decision-makers to find (e.g., ["CEO", "CTO", "VP of Engineering", "Head of Marketing"])
- personLocations: geographic locations to target (e.g., ["United States", "London, United Kingdom"]). Leave empty if not specified.
- organizationIndustries: industry categories (e.g., ["saas", "financial services", "real estate"])
- keywords: a short keyword string to narrow results (company name, technology, niche)

Return JSON: { "personTitles": [...], "personLocations": [...], "organizationIndustries": [...], "keywords": "..." }`,
    `Prospecting goal: ${prompt}`
  );
  return result;
}

// step 2: search Apollo and have Gemini score the real leads
export async function researchProspects(prompt: string): Promise<Prospect[]> {
  // convert natural language prompt to Apollo API params
  const params = await promptToApolloParams(prompt);

  // search Apollo.io for real B2B leads
  const leads = await searchPeople({
    personTitles: params.personTitles,
    personLocations: params.personLocations,
    organizationIndustries: params.organizationIndustries,
    qKeywords: params.keywords,
    perPage: 25,
  });

  if (leads.length === 0) {
    return [];
  }

  // build a lookup map so we can enrich Gemini's output with Apollo's raw data
  const apolloMap = new Map(leads.map((l, i) => [`p${i + 1}`, l]));

  // format Apollo results for Gemini scoring
  const leadsText = leads
    .map(
      (l, i) =>
        `[${i + 1}] ${l.name} — ${l.title}\n    Company: ${l.companyName}\n    Industry: ${l.industry}\n    Location: ${l.location}\n    Website: ${l.website}\n    Email: ${l.email || "NOT AVAILABLE"}${l.emailVerified ? " (VERIFIED)" : ""}\n    LinkedIn: ${l.linkedinUrl}\n    Employees: ${l.employeeCount}`
    )
    .join("\n\n");

  // have Gemini analyze and score the real leads
  const scored = await agentThinkJSON<{ prospects: { id: string; fitReason: string; score: number }[] }>(
    `You are a B2B lead research specialist. You've been given REAL leads from a professional database.

Score each lead based on fit with the business goal:
- 80-100: Perfect fit, clear need, decision-ready title
- 60-79: Good fit, likely need
- 40-59: Possible fit, worth reaching out
- Below 40: Don't include

For each qualifying lead, return:
- id: the index like "p1", "p2", etc. (matching the [1], [2] numbers above)
- fitReason: 1-2 sentences on WHY they're a good fit (be specific)
- score: your rating

Return ONLY prospects scoring 40+, sorted by score descending. Max 10.

Return JSON: { "prospects": [{ "id": "p1", "fitReason": "...", "score": 85 }] }`,
    `Business goal: ${prompt}\n\nReal B2B leads found:\n${leadsText}`
  );

  // merge Gemini's scoring with Apollo's full data
  return scored.prospects
    .map((p) => {
      const id = p.id || "p1";
      const lead = apolloMap.get(id);
      if (!lead) return null;
      return {
        id,
        companyName: lead.companyName,
        contactName: lead.name,
        title: lead.title,
        email: lead.email,
        emailVerified: lead.emailVerified,
        website: lead.website,
        industry: lead.industry,
        location: lead.location,
        employeeCount: lead.employeeCount,
        linkedinUrl: lead.linkedinUrl,
        fitReason: p.fitReason,
        score: p.score,
        status: "new" as const,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}
