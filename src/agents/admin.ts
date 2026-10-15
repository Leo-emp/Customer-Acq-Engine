// ── Admin Agent: generates invoices + contracts for closed deals ──

import { agentThinkJSON } from "@/lib/gemini";
import { generateInvoicePDF } from "@/lib/pdf";
import type { Prospect, CallRecord, Invoice } from "@/lib/types";

const SYSTEM_PROMPT = `You are a business operations assistant. When a deal is closed, generate invoice details.

Based on the deal discussion and prospect info, create realistic invoice line items.

RULES:
- Create 2-4 line items that match the product/service being sold
- Price items realistically for the industry
- Include setup/onboarding fees if appropriate
- Currency is USD

Return JSON: {
  "items": [
    { "description": "Product/Service name", "quantity": 1, "unitPrice": 999.00 },
    { "description": "Setup & Onboarding", "quantity": 1, "unitPrice": 299.00 }
  ],
  "contractSummary": "1-2 sentence summary of agreed terms",
  "onboardingSteps": ["Step 1", "Step 2", "Step 3"]
}`;

interface AdminOutput {
  items: { description: string; quantity: number; unitPrice: number }[];
  contractSummary: string;
  onboardingSteps: string[];
}

// generate an invoice for a closed deal
export async function generateInvoice(
  prospect: Prospect,
  deal: CallRecord,
  productDescription: string
): Promise<{ invoice: Invoice; pdfDataUrl: string }> {
  const output = await agentThinkJSON<AdminOutput>(
    SYSTEM_PROMPT,
    `PROSPECT: ${prospect.contactName} at ${prospect.companyName}
INDUSTRY: ${prospect.industry}
PRODUCT SOLD: ${productDescription}
DEAL SUMMARY: ${deal.summary}
DEAL TERMS: ${deal.nextAction}`
  );

  const total = output.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const invoice: Invoice = {
    id: `INV-${Date.now().toString(36).toUpperCase()}`,
    prospectId: prospect.id,
    companyName: prospect.companyName,
    contactName: prospect.contactName,
    items: output.items,
    total,
    createdAt: new Date().toISOString(),
  };

  const pdfDataUrl = generateInvoicePDF(invoice);

  return { invoice, pdfDataUrl };
}
