import { NextRequest } from "next/server";
import { agentThinkJSON } from "@/lib/gemini";
import { generateInvoicePDF } from "@/lib/pdf";
import { buildBrandContext } from "@/lib/brand-context";
import { DEMO_MODE, DEMO_INVOICE } from "@/lib/demo-data";
import type { Invoice } from "@/lib/types";

interface InvoiceInput {
  items: { description: string; quantity: number; unitPrice: number }[];
}

export async function POST(req: NextRequest) {
  const { action, companyName, contactName, productDescription, dealSummary, manualItems, profile } = await req.json();

  const brandCtx = buildBrandContext(profile);

  try {
    if (action === "generate") {
      if (!companyName) {
        return Response.json({ error: "companyName is required" }, { status: 400 });
      }

      // # demo mode: return pre-cached Salesforce invoice with realistic delay
      if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 2500));
        const items = DEMO_INVOICE.items;
        const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const invoice: Invoice = {
          id: `INV-${Date.now().toString(36).toUpperCase()}`,
          prospectId: "p1",
          companyName: companyName || "MedVista Health Systems",
          contactName: contactName || "Dr. Rachel Torres",
          items,
          total,
          createdAt: new Date().toISOString(),
        };
        const pdfDataUrl = generateInvoicePDF(invoice);
        return Response.json({ invoice, pdfDataUrl });
      }

      const output = await agentThinkJSON<InvoiceInput>(
        `You are a business operations assistant.${brandCtx ? ` You work for the company described below.\n\n${brandCtx}\n\n` : " "}Generate realistic invoice line items for a product/service sale.
        Create 2-4 line items based on the seller's actual products, pricing, and services. Currency is USD.
        Return JSON: { "items": [{ "description": "...", "quantity": 1, "unitPrice": 999.00 }] }`,
        `CLIENT COMPANY: ${companyName}\nCONTACT: ${contactName || "N/A"}\nPRODUCT SOLD: ${productDescription || profile?.productDescription || "Services"}\nDEAL CONTEXT: ${dealSummary || "Standard deal"}`
      );

      const items = manualItems || output.items;
      const total = items.reduce((sum: number, item: { quantity: number; unitPrice: number }) => sum + item.quantity * item.unitPrice, 0);

      const invoice: Invoice = {
        id: `INV-${Date.now().toString(36).toUpperCase()}`,
        prospectId: "manual",
        companyName,
        contactName: contactName || "N/A",
        items,
        total,
        createdAt: new Date().toISOString(),
      };

      const pdfDataUrl = generateInvoicePDF(invoice);
      return Response.json({ invoice, pdfDataUrl });
    }

    return Response.json({ error: "Invalid action. Use 'generate'" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invoice generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
