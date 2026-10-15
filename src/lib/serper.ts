// ── Serper.dev search client for lead research ──

interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

interface SerperResponse {
  organic: SerperResult[];
  peopleAlsoAsk?: { question: string; snippet: string }[];
}

export async function searchLeads(query: string, num: number = 10): Promise<SerperResult[]> {
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: query, num }),
  });

  if (!res.ok) {
    throw new Error(`Serper search failed: ${res.status} ${res.statusText}`);
  }

  const data: SerperResponse = await res.json();
  return data.organic || [];
}

// run multiple search queries and combine results
export async function searchLeadsMulti(queries: string[]): Promise<SerperResult[]> {
  const results = await Promise.all(queries.map((q) => searchLeads(q)));
  // deduplicate by link
  const seen = new Set<string>();
  const combined: SerperResult[] = [];
  for (const batch of results) {
    for (const r of batch) {
      if (!seen.has(r.link)) {
        seen.add(r.link);
        combined.push(r);
      }
    }
  }
  return combined;
}
