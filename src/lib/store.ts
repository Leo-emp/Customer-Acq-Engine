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
  // # extended brand intelligence (populated in demo mode)
  founded?: string;
  headquarters?: string;
  ceo?: string;
  employees?: string;
  revenue?: string;
  customers?: string;
  marketCap?: string;
  stockTicker?: string;
  competitors?: string;
  marketPosition?: string;
  differentiators?: string[];
  idealCustomer?: string;
  painPoints?: string[];
  website?: string;
  annualEvents?: string;
}
