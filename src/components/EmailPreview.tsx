"use client";

import { Mail, Check, Clock, Eye } from "lucide-react";
import type { EmailDraft } from "@/lib/types";

interface EmailPreviewProps {
  emails: EmailDraft[];
}

export default function EmailPreview({ emails }: EmailPreviewProps) {
  if (emails.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-text-primary">
        <Mail size={16} className="text-amber-400" />
        Drafted Emails
        <span className="text-text-muted font-normal">({emails.length})</span>
      </h3>

      <div className="space-y-3">
        {emails.map((email, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <div className="px-4 py-3 border-b border-card-border flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>To:</span>
                  <span className="text-text-primary">{email.to}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                  <span>Subject:</span>
                  <span className="text-text-primary font-medium">{email.subject}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                {email.openedAt ? (
                  <span className="flex items-center gap-1 text-xs text-blue-400"><Eye size={12} /> Opened</span>
                ) : email.sentAt ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400"><Check size={12} /> Sent</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-text-muted"><Clock size={12} /> Draft</span>
                )}
              </div>
            </div>

            <div className="px-4 py-3">
              <div className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">{email.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
