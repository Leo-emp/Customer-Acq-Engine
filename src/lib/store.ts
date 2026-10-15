// ── Client-side state store for the pipeline ──

export interface CompanyProfile {
  companyName: string;
  productDescription: string;
  targetMarket: string;
  senderName: string;
  senderEmail: string;
  valueProposition: string;
  calendlyUrl: string;
}

export const DEFAULT_PROFILE: CompanyProfile = {
  companyName: "",
  productDescription: "",
  targetMarket: "",
  senderName: "",
  senderEmail: "",
  valueProposition: "",
  calendlyUrl: "",
};
