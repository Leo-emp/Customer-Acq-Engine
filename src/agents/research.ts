// ── Research Agent: finds and qualifies leads ──

import { agentThinkJSON } from "@/lib/gemini";
import { searchLeadsMulti } from "@/lib/serper";
import type { Prospect } from "@/lib/types";

const SYSTEM_PROMPT = `You are a B2B lead research specialist. Your job is to find qualified prospects for a business.

TASK 1 - GENERATE SEARCH QUERIES:
Given a business description, generate 3-4 specific search queries to find potential customers.
Focus on:
- Businesses that would need this product/service
- Companies in the target market/location
- Industry-specific terms
- Decision maker titles

TASK 2 - ANALYZE RESULTS:
Given search results, extract and score prospects.

For each prospect, provide:
- companyName: The business name
- contactName: Contact person (use "Decision Maker" if not found)
- email: Email address (construct likely one from domain if not found, e.g., info@domain.com)
- website: Company website URL
- industry: Their industry/category
- fitReason: 1-2 sentences on WHY they're a good fit (be specific to the user's offering)
- score: 1-100 based on:
  - 80-100: Perfect fit, clear need, decision-ready
  - 60-79: Good fit, likely need
  - 40-59: Possible fit, worth reaching out
  - Below 40: Don't include

Return ONLY prospects scoring 40+, sorted by score descending. Max 10 prospects.`;

interface SearchQueries {
  queries: string[];
}

// step 1: generate search queries from the user's prompt
export async function generateSearchQueries(prompt: string): Promise<string[]> {
  const result = await agentThinkJSON<SearchQueries>(
    `Generate 3-4 Google search queries to find potential B2B customers. Return JSON: { "queries": ["query1", "query2", ...] }`,
    `Business goal: ${prompt}`
  );
  return result.queries;
}

// step 2: research and score prospects
export async function researchProspects(prompt: string): Promise<Prospect[]> {
  // generate targeted search queries
  const queries = await generateSearchQueries(prompt);

  // run all searches in parallel
  const searchResults = await searchLeadsMulti(queries);

  // format search results for Gemini analysis
  const resultsText = searchResults
    .map((r, i) => `[${i + 1}] ${r.title}\n    URL: ${r.link}\n    ${r.snippet}`)
    .join("\n\n");

  // have Gemini analyze and score the results
  const prospects = await agentThinkJSON<{ prospects: Prospect[] }>(
    SYSTEM_PROMPT + `\n\nReturn JSON: { "prospects": [{ "id": "p1", "companyName": "...", "contactName": "...", "email": "...", "website": "...", "industry": "...", "fitReason": "...", "score": 85, "status": "new" }, ...] }`,
    `Business goal: ${prompt}\n\nSearch results to analyze:\n${resultsText}`
  );

  // ensure IDs and status
  return prospects.prospects.map((p, i) => ({
    ...p,
    id: p.id || `p${i + 1}`,
    status: "new" as const,
  }));
}
