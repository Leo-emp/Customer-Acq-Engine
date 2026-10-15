// ── Client-side state store for the pipeline ──

export interface CompanyProfile {
  id?: string; // # Turso DB id — present after first save
  companyName: string;
  productDescription: string;
  targetMarket: string;
  senderName: string;
  senderEmail: string;
  valueProposition: string;
  calendlyUrl: string;
  industry: string;
  keyFeatures: string[];
  pricing: string;
  tone: string;
  websiteUrl?: string;
}
