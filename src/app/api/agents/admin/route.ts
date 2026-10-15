import { NextRequest } from "next/server";
import { agentThinkJSON } from "@/lib/gemini";
import { generateInvoicePDF } from "@/lib/pdf";
import type { Invoice } from "@/lib/types";

interface InvoiceInput {
  items: { description: string; quantity: number; unitPrice: number }[];
}

export async function POST(req: NextRequest) {
  const { action, companyName, contactName, productDescription, dealSummary, manualItems } = await req.json();

  try {
    if (action === "generate") {
      if (!companyName || !productDescription) {
        return Response.json({ error: "companyName and productDescription are required" }, { status: 400 });
      }

      const output = await agentThinkJSON<InvoiceInput>(
        `You are a business operations assistant. Generate realistic invoice line items for a product/service sale.
        Create 2-4 line items. Currency is USD.
        Return JSON: { "items": [{ "description": "...", "quantity": 1, "unitPrice": 999.00 }] }`,
        `COMPANY: ${companyName}\nCONTACT: ${contactName || "N/A"}\nPRODUCT: ${productDescription}\nDEAL: ${dealSummary || "Standard deal"}`
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
