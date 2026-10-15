import dns from "dns/promises";

// verify a domain has MX records (can receive email)
async function verifyMX(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

interface ApolloPersonResult {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  title: string;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedin_url?: string;
  organization?: {
    name: string;
    website_url?: string;
    industry?: string;
    estimated_num_employees?: number;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface ApolloSearchResponse {
  people: ApolloPersonResult[];
  total_entries: number;
}

export interface ApolloLead {
  id: string;
  name: string;
  title: string;
  email: string;
  emailVerified: boolean;
  companyName: string;
  website: string;
  industry: string;
  location: string;
  employeeCount: number;
  linkedinUrl: string;
}

export async function searchPeople(params: {
  personTitles?: string[];
  personLocations?: string[];
  organizationIndustries?: string[];
  qKeywords?: string;
  perPage?: number;
}): Promise<ApolloLead[]> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) throw new Error("APOLLO_API_KEY not set");

  const body: Record<string, unknown> = {
    per_page: params.perPage || 25,
  };
  if (params.personTitles?.length) body.person_titles = params.personTitles;
  if (params.personLocations?.length) body.person_locations = params.personLocations;
  if (params.organizationIndustries?.length) body.organization_industry_tag_ids = params.organizationIndustries;
  if (params.qKeywords) body.q_keywords = params.qKeywords;

  const res = await fetch("https://api.apollo.io/api/v1/mixed_people/search", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apollo API error (${res.status}): ${text.slice(0, 200)}`);
  }

  const data: ApolloSearchResponse = await res.json();

  const leads = (data.people || []).map((p) => ({
    id: p.id,
    name: p.name || `${p.first_name} ${p.last_name}`.trim(),
    title: p.title || "Unknown",
    email: p.email || "",
    emailVerified: !!p.email,
    companyName: p.organization?.name || "Unknown",
    website: p.organization?.website_url || "",
    industry: p.organization?.industry || "Unknown",
    location: [p.city, p.state, p.country].filter(Boolean).join(", "),
    employeeCount: p.organization?.estimated_num_employees || 0,
    linkedinUrl: p.linkedin_url || "",
  }));

  // verify emails via MX record check for leads that have them
  const verified = await Promise.all(
    leads.map(async (lead) => {
      if (!lead.email) return lead;
      const domain = lead.email.split("@")[1];
      if (!domain) return { ...lead, emailVerified: false };
      const mxValid = await verifyMX(domain);
      return { ...lead, emailVerified: mxValid };
    })
  );

  return verified;
}
