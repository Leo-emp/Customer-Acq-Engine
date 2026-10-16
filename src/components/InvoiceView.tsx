"use client";

import { FileText, Download } from "lucide-react";
import type { Invoice } from "@/lib/types";

interface InvoiceViewProps {
  invoice: Invoice | null;
  pdfDataUrl?: string;
}

export default function InvoiceView({ invoice, pdfDataUrl }: InvoiceViewProps) {
  if (!invoice) return null;

  // # download the cached PDF from public/ in demo mode, or the generated data URL in live mode
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfDataUrl || "/salesforce_invoice.pdf";
    link.download = `${invoice.id}.pdf`;
    link.click();
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-card-border flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-text-primary">
          <FileText size={16} className="text-indigo-400" />
          Invoice {invoice.id}
        </h3>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-brand-blue hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
        >
          <Download size={12} /> Export PDF
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wide">Bill To</p>
          <p className="text-sm font-medium mt-1 text-text-primary">{invoice.companyName}</p>
          <p className="text-sm text-text-muted">{invoice.contactName}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs border-b border-card-border">
                <th className="text-left py-2 font-medium">Description</th>
                <th className="text-center py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">Price</th>
                <th className="text-right py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-card-border">
                  <td className="py-2 text-text-primary">{item.description}</td>
                  <td className="py-2 text-center text-text-muted">{item.quantity}</td>
                  <td className="py-2 text-right text-text-muted">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-2 text-right text-text-primary">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2 border-t border-card-border">
          <div className="text-right">
            <span className="text-sm text-text-muted">Total: </span>
            <span className="text-xl font-bold text-brand-glow">${invoice.total.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-xs text-text-muted">
          Date: {new Date(invoice.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
