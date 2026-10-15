import type { CompanyProfile } from "./store";

export function buildBrandContext(profile: Partial<CompanyProfile> | null | undefined): string {
  if (!profile || !profile.companyName) return "";

  const lines = [
    "=== BRAND BRAIN (Your Company Intelligence) ===",
    `Company: ${profile.companyName}`,
    profile.industry ? `Industry: ${profile.industry}` : "",
    `Product/Service: ${profile.productDescription}`,
    `Value Proposition: ${profile.valueProposition}`,
    `Target Market: ${profile.targetMarket}`,
    profile.keyFeatures?.length ? `Key Features: ${profile.keyFeatures.join(", ")}` : "",
    profile.pricing ? `Pricing: ${profile.pricing}` : "",
    profile.tone ? `Brand Tone: ${profile.tone}` : "",
    profile.senderName ? `Sales Rep: ${profile.senderName}` : "",
    "================================================",
  ];

  return lines.filter(Boolean).join("\n");
}
