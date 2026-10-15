"use client";

import { useState } from "react";
import { Search, Mail, Phone, FileText, Headphones, Clock, CheckCircle2, AlertCircle, Loader2, Send, Plus, Sparkles } from "lucide-react";
import LeadList from "./LeadList";
import EmailPreview from "./EmailPreview";
import VoiceCall from "./VoiceCall";
import InvoiceView from "./InvoiceView";
import SupportChat from "./SupportChat";
import type { CompanyProfile } from "@/lib/store";
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
    description: "Scout autonomously searches the web for potential customers matching your target market. Enter any search query and Scout will find, analyze, and score qualified leads.",
  },
  outreach: {
    name: "Reach", title: "Outreach Agent", icon: <Mail size={24} />, color: "text-amber-400", gradient: "from-amber-500 to-orange-500", borderColor: "border-amber-500/30",
    capabilities: ["Personalized email drafting", "Email sending via Resend", "Open/click tracking", "Voice call scripts", "ElevenLabs AI voice calls", "Follow-up sequences"],
    description: "Reach crafts personalized outreach for each prospect. Select a lead and Reach will write a custom email, send it, and optionally initiate an AI voice call via ElevenLabs.",
  },
  sales: {
    name: "Closer", title: "Sales Agent", icon: <Phone size={24} />, color: "text-emerald-400", gradient: "from-emerald-500 to-green-500", borderColor: "border-emerald-500/30",
    capabilities: ["Call transcript analysis", "Deal outcome classification", "Objection identification", "Next-step recommendation", "Email reply analysis", "Meeting scheduling"],
    description: "Closer analyzes conversations — paste a call transcript, email thread, or meeting notes and Closer will classify the deal outcome and recommend next steps.",
  },
  admin: {
    name: "Ops", title: "Admin Agent", icon: <FileText size={24} />, color: "text-indigo-400", gradient: "from-indigo-500 to-violet-500", borderColor: "border-indigo-500/30",
    capabilities: ["Invoice generation", "PDF creation", "Line item calculation", "Contract preparation", "Deal documentation", "Financial summaries"],
    description: "Ops generates professional invoices with line items. Enter client details and product info — Ops will create the invoice and a downloadable PDF.",
  },
  support: {
    name: "Assist", title: "Support Agent", icon: <Headphones size={24} />, color: "text-teal-400", gradient: "from-teal-500 to-cyan-500", borderColor: "border-teal-500/30",
    capabilities: ["Context-aware chat", "Deal history access", "Invoice lookup", "Product knowledge", "Prospect data access", "Multi-turn conversation"],
    description: "Assist provides intelligent support chat. It uses your product knowledge and deal context to answer any customer question accurately.",
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
  profile: CompanyProfile | null;
  onSelectProspect: (p: Prospect) => void;
  onCallComplete: (transcript: string) => void;
  onAddProspects: (prospects: Prospect[]) => void;
  onAddEmails: (emails: EmailDraft[]) => void;
  onAddEvent: (event: AgentEvent) => void;
}

export default function AgentPage({ role, events, prospects, emails, callRecord, invoice, pdfDataUrl, callProspect, callScript, callAgentId, activeProspectId, productDescription, profile, onSelectProspect, onCallComplete, onAddProspects, onAddEmails, onAddEvent }: AgentPageProps) {
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
          </div>
        </div>
      </div>

      {/* STANDALONE TOOLS — each agent works independently */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          <span className="flex items-center gap-2">
            <Sparkles size={14} className={meta.color} />
            Workspace
          </span>
        </h3>

        {role === "research" && (
          <ResearchTool
            prospects={prospects}
            activeProspectId={activeProspectId}
            onSelectProspect={onSelectProspect}
            onAddProspects={onAddProspects}
            onAddEvent={onAddEvent}
            profile={profile}
          />
        )}

        {role === "outreach" && (
          <OutreachTool
            prospects={prospects}
            emails={emails}
            callProspect={callProspect}
            callScript={callScript}
            callAgentId={callAgentId}
            onCallComplete={onCallComplete}
            onAddEmails={onAddEmails}
            onAddEvent={onAddEvent}
            profile={profile}
          />
        )}

        {role === "sales" && (
          <SalesTool
            callRecord={callRecord}
            onAddEvent={onAddEvent}
          />
        )}

        {role === "admin" && (
          <AdminTool
            invoice={invoice}
            pdfDataUrl={pdfDataUrl}
            profile={profile}
            onAddEvent={onAddEvent}
          />
        )}

        {role === "support" && (
          <SupportTool
            callProspect={callProspect}
            callRecord={callRecord}
            invoice={invoice}
            productDescription={productDescription}
            profile={profile}
          />
        )}
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
    </div>
  );
}

// ── STANDALONE TOOLS ──

function ResearchTool({ prospects, activeProspectId, onSelectProspect, onAddProspects, onAddEvent, profile }: {
  prospects: Prospect[];
  activeProspectId?: string;
  onSelectProspect: (p: Prospect) => void;
  onAddProspects: (prospects: Prospect[]) => void;
  onAddEvent: (event: AgentEvent) => void;
  profile: CompanyProfile | null;
}) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchQuery = query.trim() || (profile ? `Find B2B customers for ${profile.productDescription} targeting ${profile.targetMarket}` : "");
    if (!searchQuery) return;

    setIsSearching(true);
    onAddEvent({ agent: "research", status: "working", message: `Searching: "${searchQuery}"`, timestamp: Date.now() });

    try {
      const res = await fetch("/api/agents/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onAddProspects(data.prospects);
      onAddEvent({ agent: "research", status: "done", message: `Found ${data.prospects.length} qualified leads`, timestamp: Date.now() });
    } catch (err) {
      onAddEvent({ agent: "research", status: "error", message: err instanceof Error ? err.message : "Search failed", timestamp: Date.now() });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="glass-card p-4">
        <p className="text-xs text-text-muted mb-3">Search for leads by entering a query, or let Scout use your Brand Brain profile</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-space-800 rounded-xl border border-card-border px-3 py-2.5">
            <Search size={16} className="text-text-muted flex-shrink-0" />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={profile ? `e.g. "SaaS companies in ${profile.targetMarket}"` : "Describe your ideal customer..."}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted text-text-primary"
              disabled={isSearching}
            />
          </div>
          <button type="submit" disabled={isSearching}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:bg-space-700 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-sm whitespace-nowrap">
            {isSearching ? (<><Loader2 size={16} className="animate-spin" /> Searching...</>) : (<><Search size={16} /> Find Leads</>)}
          </button>
        </div>
      </form>

      {prospects.length > 0 ? (
        <LeadList prospects={prospects} activeProspectId={activeProspectId} onSelect={onSelectProspect} />
      ) : (
        <EmptyWorkspace message="Qualified leads will appear here. Search above or run the full pipeline." />
      )}
    </div>
  );
}

function OutreachTool({ prospects, emails, callProspect, callScript, callAgentId, onCallComplete, onAddEmails, onAddEvent, profile }: {
  prospects: Prospect[];
  emails: EmailDraft[];
  callProspect: Prospect | null;
  callScript: string;
  callAgentId: string;
  onCallComplete: (transcript: string) => void;
  onAddEmails: (emails: EmailDraft[]) => void;
  onAddEvent: (event: AgentEvent) => void;
  profile: CompanyProfile | null;
}) {
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);

  const handleDraftEmail = async (prospect: Prospect) => {
    if (!profile) return;
    setSelectedProspect(prospect);
    setIsDrafting(true);
    onAddEvent({ agent: "outreach", status: "working", message: `Drafting email for ${prospect.companyName}`, timestamp: Date.now() });

    try {
      const res = await fetch("/api/agents/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "draft",
          prospect,
          productDescription: profile.productDescription,
          senderName: profile.senderName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onAddEmails([data.email]);
      onAddEvent({ agent: "outreach", status: "done", message: `Email drafted for ${prospect.companyName}`, timestamp: Date.now() });
    } catch (err) {
      onAddEvent({ agent: "outreach", status: "error", message: err instanceof Error ? err.message : "Draft failed", timestamp: Date.now() });
    } finally {
      setIsDrafting(false);
      setSelectedProspect(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* prospect selector for manual drafting */}
      {prospects.length > 0 && (
        <div className="glass-card p-4">
          <p className="text-xs text-text-muted mb-3">Select a prospect to draft a personalized email</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {prospects.map((p) => {
              const hasEmail = emails.some(e => e.prospectId === p.id);
              return (
                <button key={p.id} onClick={() => !hasEmail && !isDrafting && handleDraftEmail(p)} disabled={hasEmail || isDrafting || !profile}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    hasEmail ? "border-emerald-500/20 bg-emerald-500/5" :
                    selectedProspect?.id === p.id ? "border-amber-500/30 bg-amber-500/5" :
                    "border-card-border bg-space-800 hover:bg-space-700 cursor-pointer"
                  } disabled:cursor-not-allowed`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{p.companyName}</span>
                    {hasEmail && <CheckCircle2 size={14} className="text-emerald-400" />}
                    {selectedProspect?.id === p.id && isDrafting && <Loader2 size={14} className="text-amber-400 animate-spin" />}
                  </div>
                  <p className="text-[11px] text-text-muted">{p.contactName} &middot; {p.email}</p>
                </button>
              );
            })}
          </div>
          {!profile && <p className="text-xs text-amber-400 mt-2">Set up Brand Brain first to enable email drafting</p>}
        </div>
      )}

      {prospects.length === 0 && (
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-text-muted mb-2">No prospects yet</p>
          <p className="text-xs text-text-muted">Use Scout to find leads first, then come back to draft emails.</p>
        </div>
      )}

      {emails.length > 0 && <EmailPreview emails={emails} />}

      {callProspect && (
        <VoiceCall prospect={callProspect} callScript={callScript} agentId={callAgentId} onCallComplete={onCallComplete} />
      )}
    </div>
  );
}

function SalesTool({ callRecord, onAddEvent }: {
  callRecord: CallRecord | null;
  onAddEvent: (event: AgentEvent) => void;
}) {
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ outcome: string; summary: string; nextAction: string; insights: string[] } | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    onAddEvent({ agent: "sales", status: "working", message: "Analyzing conversation...", timestamp: Date.now() });

    try {
      const res = await fetch("/api/agents/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcript.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult({ outcome: data.callRecord.outcome, summary: data.callRecord.summary, nextAction: data.callRecord.nextAction, insights: data.insights });
      onAddEvent({ agent: "sales", status: "done", message: `Deal classified: ${data.callRecord.outcome}`, timestamp: Date.now() });
    } catch (err) {
      onAddEvent({ agent: "sales", status: "error", message: err instanceof Error ? err.message : "Analysis failed", timestamp: Date.now() });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAnalyze} className="glass-card p-4">
        <p className="text-xs text-text-muted mb-3">Paste a call transcript, email thread, or meeting notes to analyze the deal</p>
        <textarea
          value={transcript} onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your call transcript or conversation here..."
          rows={6}
          className="w-full bg-space-800 border border-card-border rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/50 text-text-primary placeholder:text-text-muted resize-none"
          disabled={isAnalyzing}
        />
        <button type="submit" disabled={!transcript.trim() || isAnalyzing}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-space-700 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-sm">
          {isAnalyzing ? (<><Loader2 size={16} className="animate-spin" /> Analyzing...</>) : (<><Phone size={16} /> Analyze Deal</>)}
        </button>
      </form>

      {result && (
        <div className="glass-card p-5 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
              result.outcome === "closed" ? "bg-emerald-500/20 text-emerald-400"
              : result.outcome === "interested" ? "bg-blue-500/20 text-blue-400"
              : result.outcome === "objection" ? "bg-amber-500/20 text-amber-400"
              : "bg-rose-500/20 text-rose-400"
            }`}>{result.outcome}</span>
            <h3 className="text-sm font-semibold text-text-primary">Deal Analysis</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3">{result.summary}</p>
          <p className="text-xs text-text-muted mb-4">Next step: {result.nextAction}</p>
          {result.insights.length > 0 && (
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Key Insights</p>
              <div className="space-y-1.5">
                {result.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                    <span className="text-emerald-400 mt-0.5">&#8226;</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {callRecord && !result && (
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
            <h3 className="text-sm font-semibold text-text-primary">Pipeline Result</h3>
          </div>
          <p className="text-sm text-text-secondary mb-3">{callRecord.summary}</p>
          <p className="text-xs text-text-muted">Next: {callRecord.nextAction}</p>
        </div>
      )}
    </div>
  );
}

function AdminTool({ invoice, pdfDataUrl, profile, onAddEvent }: {
  invoice: Invoice | null;
  pdfDataUrl: string;
  profile: CompanyProfile | null;
  onAddEvent: (event: AgentEvent) => void;
}) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [dealDesc, setDealDesc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genInvoice, setGenInvoice] = useState<Invoice | null>(null);
  const [genPdf, setGenPdf] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    setIsGenerating(true);
    onAddEvent({ agent: "admin", status: "working", message: `Generating invoice for ${companyName}`, timestamp: Date.now() });

    try {
      const res = await fetch("/api/agents/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          companyName: companyName.trim(),
          contactName: contactName.trim() || undefined,
          productDescription: dealDesc.trim() || profile?.productDescription || "Consulting services",
          dealSummary: dealDesc.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGenInvoice(data.invoice);
      setGenPdf(data.pdfDataUrl);
      onAddEvent({ agent: "admin", status: "done", message: `Invoice ${data.invoice.id} generated — $${data.invoice.total.toLocaleString()}`, timestamp: Date.now() });
    } catch (err) {
      onAddEvent({ agent: "admin", status: "error", message: err instanceof Error ? err.message : "Generation failed", timestamp: Date.now() });
    } finally {
      setIsGenerating(false);
    }
  };

  const displayInvoice = genInvoice || invoice;
  const displayPdf = genPdf || pdfDataUrl;

  return (
    <div className="space-y-4">
      <form onSubmit={handleGenerate} className="glass-card p-4">
        <p className="text-xs text-text-muted mb-3">Generate a professional invoice with AI-suggested line items</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Client company name *"
            className="bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500/50 text-text-primary placeholder:text-text-muted" disabled={isGenerating} />
          <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Contact name (optional)"
            className="bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500/50 text-text-primary placeholder:text-text-muted" disabled={isGenerating} />
        </div>
        <input type="text" value={dealDesc} onChange={(e) => setDealDesc(e.target.value)} placeholder="Product/service description (optional — uses Brand Brain if blank)"
          className="w-full bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500/50 text-text-primary placeholder:text-text-muted mb-3" disabled={isGenerating} />
        <button type="submit" disabled={!companyName.trim() || isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-space-700 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-sm">
          {isGenerating ? (<><Loader2 size={16} className="animate-spin" /> Generating...</>) : (<><FileText size={16} /> Generate Invoice</>)}
        </button>
      </form>

      {displayInvoice ? (
        <InvoiceView invoice={displayInvoice} pdfDataUrl={displayPdf} />
      ) : (
        <EmptyWorkspace message="Generate an invoice above, or invoices will appear here when a deal closes in the pipeline." />
      )}
    </div>
  );
}

function SupportTool({ callProspect, callRecord, invoice, productDescription, profile }: {
  callProspect: Prospect | null;
  callRecord: CallRecord | null;
  invoice: Invoice | null;
  productDescription: string;
  profile: CompanyProfile | null;
}) {
  const dummyProspect: Prospect = {
    id: "support",
    companyName: profile?.companyName || "Your Company",
    contactName: profile?.senderName || "User",
    email: "",
    website: "",
    industry: "",
    fitReason: "",
    score: 100,
    status: "new",
  };

  return (
    <SupportChat
      prospect={callProspect || dummyProspect}
      deal={callRecord}
      invoice={invoice}
      productDescription={productDescription || profile?.productDescription || ""}
    />
  );
}

function EmptyWorkspace({ message }: { message: string }) {
  return (
    <div className="glass-card p-8 text-center">
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
