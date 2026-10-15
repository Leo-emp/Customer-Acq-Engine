"use client";

import { Search, Mail, Phone, FileText, Headphones, ShieldCheck } from "lucide-react";
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

const AGENT_META: Record<AgentRole, { name: string; title: string; icon: React.ReactNode; color: string; gradient: string }> = {
  router: { name: "Router", title: "Orchestrator", icon: <Search size={20} />, color: "text-purple-400", gradient: "from-purple-500 to-pink-500" },
  research: { name: "Scout", title: "Research Agent", icon: <Search size={20} />, color: "text-blue-400", gradient: "from-blue-500 to-cyan-500" },
  outreach: { name: "Reach", title: "Outreach Agent", icon: <Mail size={20} />, color: "text-amber-400", gradient: "from-amber-500 to-orange-500" },
  emailqa: { name: "QA", title: "Email QA Agent", icon: <ShieldCheck size={20} />, color: "text-purple-400", gradient: "from-purple-500 to-violet-500" },
  sales: { name: "Closer", title: "Sales Agent", icon: <Phone size={20} />, color: "text-emerald-400", gradient: "from-emerald-500 to-green-500" },
  admin: { name: "Ops", title: "Admin Agent", icon: <FileText size={20} />, color: "text-indigo-400", gradient: "from-indigo-500 to-violet-500" },
  support: { name: "Assist", title: "Support Agent", icon: <Headphones size={20} />, color: "text-teal-400", gradient: "from-teal-500 to-cyan-500" },
};

const STATUS_DOT: Record<AgentStatus, string> = {
  idle: "bg-slate-500",
  thinking: "bg-amber-400 animate-pulse",
  working: "bg-blue-400 animate-pulse",
  done: "bg-emerald-400",
  error: "bg-rose-400",
};

const STATUS_LABEL: Record<AgentStatus, string> = {
  idle: "Standby",
  thinking: "Thinking...",
  working: "Working...",
  done: "Complete",
  error: "Error",
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
  activeAgent: AgentRole;
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
  activeAgent,
}: AgentWorkspaceProps) {
  const meta = AGENT_META[activeAgent];
  const agentEvents = events.filter((e) => e.agent === activeAgent);
  const latestStatus = (agentEvents[agentEvents.length - 1]?.status || "idle") as AgentStatus;

  return (
    <div className="space-y-6">
      {/* agent header */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow-lg`}>
              {meta.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">{meta.name}</h2>
              <p className="text-xs text-text-muted">{meta.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-space-800 border border-card-border">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[latestStatus]}`} />
              <span className="text-xs text-text-secondary">{STATUS_LABEL[latestStatus]}</span>
            </div>
            <div className="text-xs text-text-muted px-3 py-1.5 rounded-lg bg-space-800 border border-card-border">
              {agentEvents.length} events
            </div>
          </div>
        </div>
      </div>

      {/* event log for this agent */}
      {agentEvents.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-xs text-text-muted uppercase tracking-wider font-medium mb-3">Event Log</h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {agentEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${STATUS_DOT[event.status]}`} />
                <span className="text-text-secondary flex-1">{event.message}</span>
                <span className="text-text-muted flex-shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* agent-specific content */}
      {activeAgent === "research" && (
        prospects.length > 0 ? (
          <LeadList prospects={prospects} activeProspectId={activeProspectId} onSelect={onSelectProspect} />
        ) : (
          <EmptyState agent={meta} message="Scout will research and qualify leads from web search results. Launch the pipeline to start." />
        )
      )}

      {activeAgent === "outreach" && (
        <div className="space-y-6">
          {emails.length > 0 ? (
            <EmailPreview emails={emails} />
          ) : (
            <EmptyState agent={meta} message="Reach will draft personalized emails and prepare voice call scripts for each prospect." />
          )}
          {callProspect && (
            <VoiceCall prospect={callProspect} callScript={callScript} agentId={callAgentId} onCallComplete={onCallComplete} />
          )}
        </div>
      )}

      {activeAgent === "sales" && (
        callRecord ? (
          <div className="space-y-4">
            <div className={`glass-card p-5 ${
              callRecord.outcome === "closed" ? "!border-emerald-500/30"
              : callRecord.outcome === "interested" ? "!border-blue-500/30"
              : callRecord.outcome === "objection" ? "!border-amber-500/30"
              : "!border-rose-500/30"
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
              <div className="glass-card p-4">
                <p className="text-xs text-text-muted font-medium mb-2 uppercase tracking-wider">Call Transcript</p>
                <div className="text-sm text-text-secondary whitespace-pre-line max-h-60 overflow-y-auto">{callRecord.transcript}</div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState agent={meta} message="Closer will analyze call transcripts and email replies to classify deal outcomes and determine next steps." />
        )
      )}

      {activeAgent === "admin" && (
        invoice ? (
          <InvoiceView invoice={invoice} pdfDataUrl={pdfDataUrl} />
        ) : (
          <EmptyState agent={meta} message="Ops will generate invoices and contracts when a deal closes successfully." />
        )
      )}

      {activeAgent === "support" && (
        callProspect ? (
          <SupportChat prospect={callProspect} deal={callRecord} invoice={invoice} productDescription={productDescription} />
        ) : (
          <EmptyState agent={meta} message="Assist will provide post-sale customer support with full deal context." />
        )
      )}
    </div>
  );
}

function EmptyState({ agent, message }: { agent: { name: string; icon: React.ReactNode; gradient: string }; message: string }) {
  return (
    <div className="glass-card p-8 text-center">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white shadow-lg mx-auto mb-4 opacity-40`}>
        {agent.icon}
      </div>
      <p className="text-sm text-text-muted max-w-md mx-auto">{message}</p>
    </div>
  );
}
