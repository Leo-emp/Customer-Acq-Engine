"use client";

import { useState } from "react";
import { Search, Mail, Phone, FileText, Headphones } from "lucide-react";
import LeadList from "./LeadList";
import EmailPreview from "./EmailPreview";
import VoiceCall from "./VoiceCall";
import InvoiceView from "./InvoiceView";
import SupportChat from "./SupportChat";
import type {
  AgentEvent,
  AgentRole,
  AgentStatus,
  Prospect,
  EmailDraft,
  CallRecord,
  Invoice,
} from "@/lib/types";

interface TabConfig {
  role: AgentRole;
  name: string;
  icon: React.ReactNode;
  gradient: string;
  activeText: string;
  activeBg: string;
  activeBorder: string;
}

const TABS: TabConfig[] = [
  { role: "research", name: "Scout", icon: <Search size={16} />, gradient: "from-blue-500 to-cyan-500", activeText: "text-blue-400", activeBg: "bg-blue-500/10", activeBorder: "border-blue-500/40" },
  { role: "outreach", name: "Reach", icon: <Mail size={16} />, gradient: "from-amber-500 to-orange-500", activeText: "text-amber-400", activeBg: "bg-amber-500/10", activeBorder: "border-amber-500/40" },
  { role: "sales", name: "Closer", icon: <Phone size={16} />, gradient: "from-emerald-500 to-green-500", activeText: "text-emerald-400", activeBg: "bg-emerald-500/10", activeBorder: "border-emerald-500/40" },
  { role: "admin", name: "Ops", icon: <FileText size={16} />, gradient: "from-indigo-500 to-violet-500", activeText: "text-indigo-400", activeBg: "bg-indigo-500/10", activeBorder: "border-indigo-500/40" },
  { role: "support", name: "Assist", icon: <Headphones size={16} />, gradient: "from-teal-500 to-cyan-500", activeText: "text-teal-400", activeBg: "bg-teal-500/10", activeBorder: "border-teal-500/40" },
];

const STATUS_DOT: Record<AgentStatus, string> = {
  idle: "bg-slate-500",
  thinking: "bg-amber-400 animate-pulse",
  working: "bg-blue-400 animate-pulse",
  done: "bg-emerald-400",
  error: "bg-rose-400",
};

interface AgentWorkspaceProps {
  events: AgentEvent[];
  prospects: Prospect[];
  emails: EmailDraft[];
  callRecord: CallRecord | null;
  invoice: Invoice | null;
  pdfDataUrl: string;
  callProspect: Prospect | null;
  callScript: string;
  callAgentId: string;
  activeProspectId?: string;
  productDescription: string;
  onSelectProspect: (p: Prospect) => void;
  onCallComplete: (transcript: string) => void;
}

export default function AgentWorkspace({
  events,
  prospects,
  emails,
  callRecord,
  invoice,
  pdfDataUrl,
  callProspect,
  callScript,
  callAgentId,
  activeProspectId,
  productDescription,
  onSelectProspect,
  onCallComplete,
}: AgentWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<AgentRole>("research");

  const getAgentStatus = (role: AgentRole): AgentStatus => {
    const agentEvents = events.filter((e) => e.agent === role);
    return (agentEvents[agentEvents.length - 1]?.status || "idle") as AgentStatus;
  };

  const activeEvents = events.filter((e) => e.agent === activeTab);

  return (
    <div className="glass-card overflow-hidden">
      {/* tab bar */}
      <div className="flex border-b border-card-border overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.role;
          const status = getAgentStatus(tab.role);
          const statusDot = STATUS_DOT[status];

          return (
            <button
              key={tab.role}
              onClick={() => setActiveTab(tab.role)}
              className={`
                flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all cursor-pointer
                border-b-2 whitespace-nowrap
                ${isActive
                  ? `${tab.activeText} ${tab.activeBg} ${tab.activeBorder}`
                  : "text-text-muted border-transparent hover:text-text-secondary hover:bg-space-700/50"
                }
              `}
            >
              {tab.icon}
              <span>{tab.name}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            </button>
          );
        })}
      </div>

      {/* tab content */}
      <div className="p-5 min-h-[400px]">
        {activeEvents.length > 0 && (
          <div className="mb-5 space-y-1.5 max-h-40 overflow-y-auto">
            {activeEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${STATUS_DOT[event.status]}`} />
                <span className="text-text-secondary">{event.message}</span>
                <span className="text-text-muted ml-auto flex-shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "research" && (
          <div>
            {prospects.length > 0 ? (
              <LeadList prospects={prospects} activeProspectId={activeProspectId} onSelect={onSelectProspect} />
            ) : (
              <EmptyState message="Scout will research and qualify leads from web search results." />
            )}
          </div>
        )}

        {activeTab === "outreach" && (
          <div className="space-y-6">
            {emails.length > 0 ? (
              <EmailPreview emails={emails} />
            ) : (
              <EmptyState message="Reach will draft personalized emails and prepare voice call scripts for each prospect." />
            )}
            {callProspect && (
              <VoiceCall prospect={callProspect} callScript={callScript} agentId={callAgentId} onCallComplete={onCallComplete} />
            )}
          </div>
        )}

        {activeTab === "sales" && (
          <div>
            {callRecord ? (
              <div className="space-y-4">
                <div className={`rounded-xl border p-5 ${
                  callRecord.outcome === "closed" ? "bg-emerald-500/5 border-emerald-500/20"
                    : callRecord.outcome === "interested" ? "bg-blue-500/5 border-blue-500/20"
                    : callRecord.outcome === "objection" ? "bg-amber-500/5 border-amber-500/20"
                    : "bg-rose-500/5 border-rose-500/20"
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                      callRecord.outcome === "closed" ? "bg-emerald-500/20 text-emerald-400"
                        : callRecord.outcome === "interested" ? "bg-blue-500/20 text-blue-400"
                        : callRecord.outcome === "objection" ? "bg-amber-500/20 text-amber-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}>
                      {callRecord.outcome}
                    </span>
                    <h3 className="text-sm font-semibold text-text-primary">Deal Outcome</h3>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{callRecord.summary}</p>
                  <p className="text-xs text-text-muted">Next: {callRecord.nextAction}</p>
                </div>

                {callRecord.transcript && (
                  <div className="bg-space-800 rounded-lg p-4">
                    <p className="text-xs text-text-muted font-medium mb-2 uppercase tracking-wider">Call Transcript</p>
                    <div className="text-sm text-text-secondary whitespace-pre-line max-h-60 overflow-y-auto">
                      {callRecord.transcript}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState message="Closer will analyze call transcripts and email replies to classify deal outcomes and determine next steps." />
            )}
          </div>
        )}

        {activeTab === "admin" && (
          <div>
            {invoice ? (
              <InvoiceView invoice={invoice} pdfDataUrl={pdfDataUrl} />
            ) : (
              <EmptyState message="Ops will generate invoices and contracts when a deal closes." />
            )}
          </div>
        )}

        {activeTab === "support" && (
          <div>
            {callProspect ? (
              <SupportChat prospect={callProspect} deal={callRecord} invoice={invoice} productDescription={productDescription} />
            ) : (
              <EmptyState message="Assist will provide post-sale customer support with full deal context." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-sm text-text-muted max-w-sm mx-auto">{message}</p>
    </div>
  );
}
