"use client";

import { ExternalLink } from "lucide-react";
import type { Prospect } from "@/lib/types";

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-slate-500/20 text-slate-400" },
  emailed: { label: "Emailed", color: "bg-amber-500/20 text-amber-400" },
  opened: { label: "Opened", color: "bg-blue-500/20 text-blue-400" },
  called: { label: "Called", color: "bg-purple-500/20 text-purple-400" },
  interested: { label: "Interested", color: "bg-emerald-500/20 text-emerald-400" },
  closed: { label: "Closed", color: "bg-indigo-500/20 text-indigo-400" },
  rejected: { label: "Rejected", color: "bg-rose-500/20 text-rose-400" },
};

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-slate-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-space-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-text-muted w-6">{score}</span>
    </div>
  );
}

interface LeadListProps {
  prospects: Prospect[];
  activeProspectId?: string;
  onSelect?: (prospect: Prospect) => void;
}

export default function LeadList({ prospects, activeProspectId, onSelect }: LeadListProps) {
  if (prospects.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-card-border">
        <h3 className="text-sm font-semibold text-text-primary">
          Prospects <span className="text-text-muted font-normal">({prospects.length})</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border text-text-muted text-xs">
              <th className="text-left px-4 py-2 font-medium">Score</th>
              <th className="text-left px-4 py-2 font-medium">Company</th>
              <th className="text-left px-4 py-2 font-medium">Contact</th>
              <th className="text-left px-4 py-2 font-medium">Industry</th>
              <th className="text-left px-4 py-2 font-medium">Fit</th>
              <th className="text-left px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {prospects.map((prospect) => {
              const badge = STATUS_BADGES[prospect.status] || STATUS_BADGES.new;
              const isActive = prospect.id === activeProspectId;

              return (
                <tr
                  key={prospect.id}
                  onClick={() => onSelect?.(prospect)}
                  className={`
                    border-b border-card-border hover:bg-space-700 transition-colors cursor-pointer
                    ${isActive ? "bg-brand-blue/10 border-l-2 border-l-brand-blue" : ""}
                  `}
                >
                  <td className="px-4 py-3"><ScoreBar score={prospect.score} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-text-primary">{prospect.companyName}</span>
                      {prospect.website && (
                        <a href={prospect.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-text-muted hover:text-brand-glow">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-text-primary">{prospect.contactName}</span>
                      <div className="text-xs text-text-muted">{prospect.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{prospect.industry}</td>
                  <td className="px-4 py-3 text-text-muted max-w-[200px] truncate">{prospect.fitReason}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
