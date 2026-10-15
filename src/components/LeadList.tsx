"use client";

import { ExternalLink, ShieldCheck, ShieldAlert, Link2, MapPin, Users } from "lucide-react";
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
      <div className="px-4 py-3 border-b border-card-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          Prospects <span className="text-text-muted font-normal">({prospects.length})</span>
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-text-muted">
          <span>{prospects.filter(p => p.emailVerified).length} verified</span>
          <span>{prospects.filter(p => p.email && !p.emailVerified).length} unverified</span>
          <span>{prospects.filter(p => !p.email).length} no email</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-card-border text-text-muted text-[11px] uppercase tracking-wider">
              <th className="text-left px-3 py-2.5 font-medium w-[70px]">Score</th>
              <th className="text-left px-3 py-2.5 font-medium w-[18%]">Contact</th>
              <th className="text-left px-3 py-2.5 font-medium w-[16%]">Company</th>
              <th className="text-left px-3 py-2.5 font-medium w-[18%]">Email</th>
              <th className="text-left px-3 py-2.5 font-medium w-[11%]">Industry</th>
              <th className="text-left px-3 py-2.5 font-medium w-[10%]">Location</th>
              <th className="text-left px-3 py-2.5 font-medium w-[60px]">Size</th>
              <th className="text-left px-3 py-2.5 font-medium w-[15%]">Fit Reason</th>
              <th className="text-left px-3 py-2.5 font-medium w-[50px]">Links</th>
            </tr>
          </thead>
          <tbody>
            {prospects.map((prospect) => {
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
                  {/* score */}
                  <td className="px-3 py-3"><ScoreBar score={prospect.score} /></td>

                  {/* contact: name + title */}
                  <td className="px-3 py-3">
                    <span className="font-medium text-text-primary block truncate">{prospect.contactName}</span>
                    {prospect.title && (
                      <span className="text-[11px] text-text-muted block truncate">{prospect.title}</span>
                    )}
                  </td>

                  {/* company */}
                  <td className="px-3 py-3">
                    <span className="font-medium text-text-primary truncate block">{prospect.companyName}</span>
                  </td>

                  {/* email + verification */}
                  <td className="px-3 py-3">
                    {prospect.email ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-text-secondary truncate">{prospect.email}</span>
                        {prospect.emailVerified ? (
                          <span className="flex-shrink-0"><ShieldCheck size={11} className="text-emerald-400" /></span>
                        ) : (
                          <span className="flex-shrink-0"><ShieldAlert size={11} className="text-amber-400" /></span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-rose-400 italic">No email</span>
                    )}
                  </td>

                  {/* industry */}
                  <td className="px-3 py-3">
                    <span className="text-xs text-text-muted truncate block">{prospect.industry}</span>
                  </td>

                  {/* location */}
                  <td className="px-3 py-3">
                    {prospect.location ? (
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <MapPin size={10} className="flex-shrink-0" />
                        <span className="truncate">{prospect.location}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>

                  {/* employee count */}
                  <td className="px-3 py-3">
                    {prospect.employeeCount ? (
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Users size={10} className="flex-shrink-0" />
                        <span>{prospect.employeeCount.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>

                  {/* fit reason */}
                  <td className="px-3 py-3">
                    <span className="text-xs text-text-muted line-clamp-2">{prospect.fitReason}</span>
                  </td>

                  {/* links: website + linkedin */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      {prospect.website && (
                        <a href={prospect.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                          className="text-text-muted hover:text-brand-glow transition-colors">
                          <ExternalLink size={13} />
                        </a>
                      )}
                      {prospect.linkedinUrl && (
                        <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                          className="text-text-muted hover:text-blue-400 transition-colors">
                          <Link2 size={13} />
                        </a>
                      )}
                    </div>
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
