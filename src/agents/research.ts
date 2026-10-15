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

  // build a lookup map for email verification status
  const emailVerifiedMap = new Map(leads.map((l, i) => [`p${i + 1}`, { verified: l.emailVerified, email: l.email }]));

  // format Apollo results for Gemini scoring
  const leadsText = leads
    .map(
      (l, i) =>
        `[${i + 1}] ${l.name} — ${l.title}\n    Company: ${l.companyName}\n    Industry: ${l.industry}\n    Location: ${l.location}\n    Website: ${l.website}\n    Email: ${l.email || "NOT AVAILABLE"}${l.emailVerified ? " (VERIFIED)" : ""}\n    LinkedIn: ${l.linkedinUrl}\n    Employees: ${l.employeeCount}`
    )
    .join("\n\n");

  // have Gemini analyze and score the real leads
  const scored = await agentThinkJSON<{ prospects: Prospect[] }>(
    `You are a B2B lead research specialist. You've been given REAL leads from a professional database.

Score each lead based on fit with the business goal:
- 80-100: Perfect fit, clear need, decision-ready title
- 60-79: Good fit, likely need
- 40-59: Possible fit, worth reaching out
- Below 40: Don't include

For each qualifying lead, return:
- id: use the index like "p1"
- companyName: from the data
- contactName: real name from the data
- email: real email from the data
- website: from the data
- industry: from the data
- fitReason: 1-2 sentences on WHY they're a good fit (be specific)
- score: your rating
- status: "new"

Return ONLY prospects scoring 40+, sorted by score descending. Max 10.

Return JSON: { "prospects": [{ "id": "p1", "companyName": "...", "contactName": "...", "email": "...", "website": "...", "industry": "...", "fitReason": "...", "score": 85, "status": "new" }] }`,
    `Business goal: ${prompt}\n\nReal B2B leads found:\n${leadsText}`
  );

  return scored.prospects.map((p, i) => {
    const id = p.id || `p${i + 1}`;
    const verifyInfo = emailVerifiedMap.get(id);
    return {
      ...p,
      id,
      status: "new" as const,
      emailVerified: verifyInfo?.verified ?? false,
    };
  });
}
