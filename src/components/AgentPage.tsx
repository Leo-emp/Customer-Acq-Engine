"use client";

import { Search, Mail, Phone, FileText, Headphones, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import LeadList from "./LeadList";
import EmailPreview from "./EmailPreview";
import VoiceCall from "./VoiceCall";
import InvoiceView from "./InvoiceView";
import SupportChat from "./SupportChat";
import type { AgentEvent, AgentRole, AgentStatus, Prospect, EmailDraft, CallRecord, Invoice } from "@/lib/types";

interface AgentMeta {
  name: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  borderColor: string;
  capabilities: string[];
  description: string;
}

const AGENT_META: Record<string, AgentMeta> = {
  research: {
    name: "Scout", title: "Research Agent", icon: <Search size={24} />, color: "text-blue-400", gradient: "from-blue-500 to-cyan-500", borderColor: "border-blue-500/30",
    capabilities: ["Web search via Serper API", "Lead scoring (0-100)", "Industry classification", "Contact discovery", "Company analysis", "Fit assessment"],
    description: "Scout autonomously searches the web for potential customers matching your target market. It analyzes each result, scores them on fit, and builds a qualified prospect list with contact details.",
  },
  outreach: {
    name: "Reach", title: "Outreach Agent", icon: <Mail size={24} />, color: "text-amber-400", gradient: "from-amber-500 to-orange-500", borderColor: "border-amber-500/30",
    capabilities: ["Personalized email drafting", "Email sending via Resend", "Open/click tracking", "Voice call scripts", "ElevenLabs AI voice calls", "Follow-up sequences"],
    description: "Reach crafts personalized outreach for each prospect. It writes custom emails based on the prospect's business, sends them, tracks opens, and initiates AI-powered voice calls.",
  },
  sales: {
    name: "Closer", title: "Sales Agent", icon: <Phone size={24} />, color: "text-emerald-400", gradient: "from-emerald-500 to-green-500", borderColor: "border-emerald-500/30",
    capabilities: ["Call transcript analysis", "Deal outcome classification", "Objection identification", "Next-step recommendation", "Email reply analysis", "Meeting scheduling"],
    description: "Closer analyzes every interaction — call transcripts and email threads — to classify deal outcomes as Closed, Interested, Objection, or Rejected, and recommends next steps.",
  },
  admin: {
    name: "Ops", title: "Admin Agent", icon: <FileText size={24} />, color: "text-indigo-400", gradient: "from-indigo-500 to-violet-500", borderColor: "border-indigo-500/30",
    capabilities: ["Invoice generation", "PDF creation", "Line item calculation", "Contract preparation", "Deal documentation", "Financial summaries"],
    description: "Ops handles all back-office work. When a deal closes, it automatically generates professional invoices with line items and creates downloadable PDF documents.",
  },
  support: {
    name: "Assist", title: "Support Agent", icon: <Headphones size={24} />, color: "text-teal-400", gradient: "from-teal-500 to-cyan-500", borderColor: "border-teal-500/30",
    capabilities: ["Context-aware chat", "Deal history access", "Invoice lookup", "Product knowledge", "Prospect data access", "Multi-turn conversation"],
    description: "Assist provides intelligent post-sale support. It has full context of the deal, invoice, and prospect data to answer any customer question accurately.",
  },
};

const STATUS_CONFIG: Record<AgentStatus, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  idle: { label: "Standby", icon: <Clock size={14} />, color: "text-text-muted", bg: "bg-space-700" },
  thinking: { label: "Thinking", icon: <Loader2 size={14} className="animate-spin" />, color: "text-amber-400", bg: "bg-amber-500/10" },
  working: { label: "Working", icon: <Loader2 size={14} className="animate-spin" />, color: "text-blue-400", bg: "bg-blue-500/10" },
  done: { label: "Complete", icon: <CheckCircle2 size={14} />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  error: { label: "Error", icon: <AlertCircle size={14} />, color: "text-rose-400", bg: "bg-rose-500/10" },
};

interface AgentPageProps {
  role: AgentRole;
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

export default function AgentPage({ role, events, prospects, emails, callRecord, invoice, pdfDataUrl, callProspect, callScript, callAgentId, activeProspectId, productDescription, onSelectProspect, onCallComplete }: AgentPageProps) {
  const meta = AGENT_META[role];
  if (!meta) return null;

  const agentEvents = events.filter((e) => e.agent === role);
  const latestStatus = (agentEvents[agentEvents.length - 1]?.status || "idle") as AgentStatus;
  const statusCfg = STATUS_CONFIG[latestStatus];

  return (
    <div className="space-y-6">
      {/* agent header card */}
      <div className={`glass-card p-6 ${meta.borderColor} border`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow-lg shadow-black/20`}>
              {meta.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{meta.name}</h1>
              <p className="text-sm text-text-muted">{meta.title}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusCfg.bg}`}>
            <span className={statusCfg.color}>{statusCfg.icon}</span>
            <span className={`text-xs font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-4 max-w-2xl leading-relaxed">{meta.description}</p>
      </div>

      {/* capabilities + stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* capabilities */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Capabilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {meta.capabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-space-800 border border-card-border">
                <CheckCircle2 size={12} className={meta.color} />
                <span className="text-xs text-text-secondary">{cap}</span>
              </div>
            ))}
          </div>
        </div>
        {/* quick stats */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Total Actions</span>
              <span className="text-sm font-bold text-text-primary">{agentEvents.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Status</span>
              <span className={`text-sm font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
            </div>
            {role === "research" && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Leads Found</span>
                <span className="text-sm font-bold text-blue-400">{prospects.length}</span>
              </div>
            )}
            {role === "outreach" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Emails Drafted</span>
                  <span className="text-sm font-bold text-amber-400">{emails.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Emails Sent</span>
                  <span className="text-sm font-bold text-amber-400">{emails.filter(e => e.sentAt).length}</span>
                </div>
              </>
            )}
            {role === "sales" && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Deal Status</span>
                <span className={`text-sm font-bold ${callRecord?.outcome === "closed" ? "text-emerald-400" : callRecord ? "text-amber-400" : "text-text-muted"}`}>
                  {callRecord?.outcome ? callRecord.outcome.charAt(0).toUpperCase() + callRecord.outcome.slice(1) : "Pending"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* event history */}
      {agentEvents.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-3 border-b border-card-border">
            <h3 className="text-sm font-semibold text-text-primary">Event History</h3>
          </div>
          <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
            {agentEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  event.status === "done" ? "bg-emerald-400"
                  : event.status === "working" ? "bg-blue-400"
                  : event.status === "thinking" ? "bg-amber-400"
                  : event.status === "error" ? "bg-rose-400"
                  : "bg-space-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <span className="text-text-secondary">{event.message}</span>
                </div>
                <span className="text-xs text-text-muted flex-shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* agent workspace — the actual work output */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Workspace</h3>

        {role === "research" && (
          prospects.length > 0 ? (
            <LeadList prospects={prospects} activeProspectId={activeProspectId} onSelect={onSelectProspect} />
          ) : (
            <EmptyWorkspace message="Qualified leads will appear here when Scout runs." />
          )
        )}

        {role === "outreach" && (
          <div className="space-y-4">
            {emails.length > 0 ? (
              <EmailPreview emails={emails} />
            ) : (
              <EmptyWorkspace message="Drafted emails and call scripts will appear here when Reach runs." />
            )}
            {callProspect && (
              <VoiceCall prospect={callProspect} callScript={callScript} agentId={callAgentId} onCallComplete={onCallComplete} />
            )}
          </div>
        )}

        {role === "sales" && (
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
                  }`}>{callRecord.outcome}</span>
                  <h3 className="text-sm font-semibold text-text-primary">Deal Outcome</h3>
                </div>
                <p className="text-sm text-text-secondary mb-3">{callRecord.summary}</p>
                <p className="text-xs text-text-muted">Next: {callRecord.nextAction}</p>
              </div>
              {callRecord.transcript && (
                <div className="glass-card p-4">
                  <p className="text-xs text-text-muted font-medium mb-2 uppercase tracking-wider">Transcript</p>
                  <div className="text-sm text-text-secondary whitespace-pre-line max-h-60 overflow-y-auto">{callRecord.transcript}</div>
                </div>
              )}
            </div>
          ) : (
            <EmptyWorkspace message="Deal analysis will appear here after a call or email reply." />
          )
        )}

        {role === "admin" && (
          invoice ? (
            <InvoiceView invoice={invoice} pdfDataUrl={pdfDataUrl} />
          ) : (
            <EmptyWorkspace message="Invoices and contracts will appear here when a deal closes." />
          )
        )}

        {role === "support" && (
          callProspect ? (
            <SupportChat prospect={callProspect} deal={callRecord} invoice={invoice} productDescription={productDescription} />
          ) : (
            <EmptyWorkspace message="Customer support chat will activate after a prospect is engaged." />
          )
        )}
      </div>
    </div>
  );
}

function EmptyWorkspace({ message }: { message: string }) {
  return (
    <div className="glass-card p-8 text-center">
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
