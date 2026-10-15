// ── Extract company info from a website URL using AI ──

import { NextRequest } from "next/server";
import { agentThinkJSON } from "@/lib/gemini";
import { DEMO_MODE, DEMO_BRAND_PROFILE } from "@/lib/demo-data";

// strip HTML tags and extract readable text
function htmlToText(html: string): string {
  return html
    // remove scripts and styles
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    // convert common elements to readable format
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, "\n## $1\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    // clean up whitespace
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim()
    .slice(0, 8000); // limit for Gemini context
}

interface ExtractedProfile {
  companyName: string;
  productDescription: string;
  valueProposition: string;
  targetMarket: string;
  industry: string;
  keyFeatures: string[];
  pricing: string;
  tone: string;
}

const SYSTEM_PROMPT = `You are a business intelligence analyst. Given the text content extracted from a company's website, extract their key business information.

Analyze carefully and extract:
- companyName: The official company/brand name
- productDescription: What they sell or offer (2-3 sentences, specific)
- valueProposition: Their main value prop — what problem they solve and for whom (1-2 sentences)
- targetMarket: Who their ideal customers are (industry, size, location if mentioned)
- industry: Their industry category
- keyFeatures: Top 3-5 product features or benefits (array of short strings)
- pricing: Any pricing info found (or "Not listed" if not visible)
- tone: Their brand voice (e.g., "Professional and corporate", "Casual and friendly", "Technical and precise")

Be specific and extract real details from the content. Don't make up information not present on the site.

Return JSON matching the schema above.`;

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return Response.json({ error: "url is required" }, { status: 400 });
  }

  try {
    // # demo mode: return pre-cached profile instantly
    if (DEMO_MODE) {
      return Response.json({ profile: DEMO_BRAND_PROFILE, url: url.trim() });
    }

    // normalize URL
    let fetchUrl = url.trim();
    if (!fetchUrl.startsWith("http")) {
      fetchUrl = `https://${fetchUrl}`;
    }

    // fetch the website
    const res = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AcquireAI/1.0; business-intelligence)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return Response.json({ error: `Failed to fetch website: ${res.status}` }, { status: 400 });
    }

    const html = await res.text();
    const text = htmlToText(html);

    if (text.length < 50) {
      return Response.json({ error: "Could not extract enough content from this website" }, { status: 400 });
    }

    // extract company info with Gemini
    const profile = await agentThinkJSON<ExtractedProfile>(
      SYSTEM_PROMPT,
      `Website URL: ${fetchUrl}\n\nExtracted content:\n${text}`
    );

    return Response.json({ profile, url: fetchUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Extraction failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
