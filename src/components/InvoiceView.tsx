"use client";

import { FileText, Download } from "lucide-react";
import type { Invoice } from "@/lib/types";

interface InvoiceViewProps {
  invoice: Invoice | null;
  pdfDataUrl?: string;
}

export default function InvoiceView({ invoice, pdfDataUrl }: InvoiceViewProps) {
  if (!invoice) return null;

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement("a");
    link.href = pdfDataUrl;
    link.download = `${invoice.id}.pdf`;
    link.click();
  };

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FileText size={16} className="text-indigo-400" />
          Invoice {invoice.id}
        </h3>

        {pdfDataUrl && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Download size={12} />
            Download PDF
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* bill to */}
        <div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Bill To</p>
          <p className="text-sm font-medium mt-1">{invoice.companyName}</p>
          <p className="text-sm text-[var(--muted)]">{invoice.contactName}</p>
        </div>

        {/* line items */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] text-xs border-b border-[var(--border)]">
                <th className="text-left py-2 font-medium">Description</th>
                <th className="text-center py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">Price</th>
                <th className="text-right py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-[var(--border)]">
                  <td className="py-2 text-[var(--foreground)]">{item.description}</td>
                  <td className="py-2 text-center text-[var(--muted)]">{item.quantity}</td>
                  <td className="py-2 text-right text-[var(--muted)]">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-2 text-right text-[var(--foreground)]">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* total */}
        <div className="flex justify-end pt-2 border-t border-[var(--border)]">
          <div className="text-right">
            <span className="text-sm text-[var(--muted)]">Total: </span>
            <span className="text-xl font-bold text-indigo-400">${invoice.total.toFixed(2)}</span>
          </div>
        </div>

        {/* date */}
        <p className="text-xs text-[var(--muted)]">
          Date: {new Date(invoice.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
