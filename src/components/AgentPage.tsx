"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, FileText, Headphones, Clock, CheckCircle2, AlertCircle, Loader2, Send, Plus, Sparkles } from "lucide-react";
import LeadList from "./LeadList";
import EmailPreview from "./EmailPreview";
import VoiceCall from "./VoiceCall";
import InvoiceView from "./InvoiceView";
import SupportChat from "./SupportChat";
import type { CompanyProfile } from "@/lib/store";
import type { AgentEvent, AgentRole, AgentStatus, Prospect, EmailDraft, CallRecord, Invoice } from "@/lib/types";

interface CapAction {
  label: string;
  prompt?: string;
  action?: string;
}

interface AgentMeta {
  name: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  borderColor: string;
  capabilities: CapAction[];
  description: string;
}

const AGENT_META: Record<string, AgentMeta> = {
  research: {
    name: "Scout", title: "Research Agent", icon: <Search size={24} />, color: "text-blue-400", gradient: "from-blue-500 to-cyan-500", borderColor: "border-blue-500/30",
    capabilities: [
      { label: "Search for leads", prompt: "Find potential B2B customers in the tech industry" },
      { label: "Score & rank leads", prompt: "Find and rank the top 10 best-fit companies for our product" },
      { label: "Industry research", prompt: "Research companies in the healthcare SaaS space" },
      { label: "Find contacts", prompt: "Find decision makers at enterprise companies" },
      { label: "Competitor analysis", prompt: "Find companies similar to our competitors' customers" },
      { label: "Market mapping", prompt: "Map the market landscape for AI automation tools" },
    ],
    description: "Scout autonomously searches the web for potential customers matching your target market. Click any action below or type your own query.",
  },
  outreach: {
    name: "Reach", title: "Outreach Agent", icon: <Mail size={24} />, color: "text-amber-400", gradient: "from-amber-500 to-orange-500", borderColor: "border-amber-500/30",
    capabilities: [
      { label: "Draft cold email", action: "draft" },
      { label: "Send drafted email", action: "send" },
      { label: "Draft for all leads", action: "draft-all" },
      { label: "AI voice call", action: "call" },
      { label: "Write follow-up", action: "followup" },
      { label: "Batch email campaign", action: "batch" },
    ],
    description: "Reach crafts personalized outreach for each prospect. Select a lead below and choose an action to execute.",
  },
  sales: {
    name: "Closer", title: "Sales Agent", icon: <Phone size={24} />, color: "text-emerald-400", gradient: "from-emerald-500 to-green-500", borderColor: "border-emerald-500/30",
    capabilities: [
      { label: "Analyze call transcript", action: "transcript" },
      { label: "Analyze email thread", action: "email-thread" },
      { label: "Analyze meeting notes", action: "meeting" },
      { label: "Objection breakdown", action: "objections" },
      { label: "Win/loss analysis", action: "winloss" },
      { label: "Generate deal report", action: "report" },
    ],
    description: "Closer analyzes conversations and classifies deals. Click an action or paste your content below.",
  },
  admin: {
    name: "Ops", title: "Admin Agent", icon: <FileText size={24} />, color: "text-indigo-400", gradient: "from-indigo-500 to-violet-500", borderColor: "border-indigo-500/30",
    capabilities: [
      { label: "Generate invoice", action: "invoice" },
      { label: "Download PDF", action: "pdf" },
      { label: "Edit line items", action: "edit" },
      { label: "Create proposal", action: "proposal" },
      { label: "Deal summary", action: "summary" },
      { label: "Revenue report", action: "revenue" },
    ],
    description: "Ops generates professional invoices and documents. Select a prospect or enter details below.",
  },
  support: {
    name: "Assist", title: "Support Agent", icon: <Headphones size={24} />, color: "text-teal-400", gradient: "from-teal-500 to-cyan-500", borderColor: "border-teal-500/30",
    capabilities: [
      { label: "Answer product question", action: "product" },
      { label: "Check deal status", action: "deal" },
      { label: "Lookup invoice", action: "invoice" },
      { label: "Troubleshoot issue", action: "troubleshoot" },
      { label: "Onboarding help", action: "onboarding" },
      { label: "Feature request", action: "feature" },
    ],
    description: "Assist provides intelligent support chat. Click a quick action or type your question directly.",
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
  const [quickAction, setQuickAction] = useState<string>("");

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

      {/* quick actions + stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {meta.capabilities.map((cap, i) => (
              <button key={i} onClick={() => setQuickAction(cap.prompt || cap.action || cap.label)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all cursor-pointer text-left group ${
                  quickAction === (cap.prompt || cap.action || cap.label)
                    ? `${meta.borderColor} bg-space-700`
                    : "border-card-border bg-space-800 hover:bg-space-700 hover:border-space-500"
                }`}>
                <Sparkles size={12} className={`${meta.color} flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`} />
                <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">{cap.label}</span>
              </button>
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
            quickAction={quickAction}
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
            quickAction={quickAction}
            profile={profile}
            prospects={prospects}
          />
        )}

        {role === "admin" && (
          <AdminTool
            invoice={invoice}
            pdfDataUrl={pdfDataUrl}
            profile={profile}
            onAddEvent={onAddEvent}
            prospects={prospects}
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

function ResearchTool({ prospects, activeProspectId, onSelectProspect, onAddProspects, onAddEvent, profile, quickAction }: {
  prospects: Prospect[];
  activeProspectId?: string;
  onSelectProspect: (p: Prospect) => void;
  onAddProspects: (prospects: Prospect[]) => void;
  onAddEvent: (event: AgentEvent) => void;
  profile: CompanyProfile | null;
  quickAction: string;
}) {
  const [query, setQuery] = useState(quickAction || "");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => { if (quickAction) setQuery(quickAction); }, [quickAction]);

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
        body: JSON.stringify({ query: searchQuery, profile }),
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
          profile,
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

function SalesTool({ callRecord, onAddEvent, quickAction, profile, prospects }: {
  callRecord: CallRecord | null;
  onAddEvent: (event: AgentEvent) => void;
  quickAction: string;
  profile: CompanyProfile | null;
  prospects: Prospect[];
}) {
  const [transcript, setTranscript] = useState("");
  const [prospectName, setProspectName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<"idle" | "ringing" | "in-progress" | "completed" | "failed">("idle");
  const [activeCallId, setActiveCallId] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const placeholders: Record<string, string> = {
    "transcript": "Paste your call transcript here...",
    "email-thread": "Paste the email thread here...",
    "meeting": "Paste your meeting notes here...",
    "objections": "Paste the conversation — Closer will identify all objections...",
    "winloss": "Paste deal conversations — Closer will analyze win/loss factors...",
    "report": "Paste deal details — Closer will generate a structured report...",
  };
  const placeholder = placeholders[quickAction] || "Paste your call transcript or conversation here...";
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ outcome: string; summary: string; nextAction: string; insights: string[]; pdfDataUrl: string } | null>(null);

  const handleSelectProspect = (p: Prospect) => {
    setProspectName(p.contactName);
    setCompanyName(p.companyName);
  };

  const handleMakeCall = async () => {
    if (!phoneNumber.trim()) return;
    setIsCalling(true);
    setCallStatus("ringing");
    setLiveTranscript("");
    setResult(null);
    onAddEvent({ agent: "sales", status: "working", message: `Calling ${prospectName || phoneNumber}...`, timestamp: Date.now() });

    try {
      const salesContext = profile
        ? `Company: ${profile.companyName}\nProduct: ${profile.productDescription}\nValue Prop: ${profile.valueProposition}\nTarget: ${profile.targetMarket}\nPricing: ${profile.pricing || "Contact for pricing"}`
        : "General sales call";

      const res = await fetch("/api/agents/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          prospectName: prospectName.trim() || "there",
          companyName: companyName.trim() || "your company",
          salesContext,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActiveCallId(data.callId);
      setCallStatus("in-progress");
      onAddEvent({ agent: "sales", status: "working", message: `Call connected (${data.callSid})`, timestamp: Date.now() });

      // poll for transcript every 5 seconds
      const pollInterval = setInterval(async () => {
        try {
          const tRes = await fetch(`/api/agents/call/transcript?callId=${data.callId}`);
          const tData = await tRes.json();
          if (tData.transcript) setLiveTranscript(tData.transcript);
          if (tData.status === "completed" || tData.status === "failed" || tData.status === "busy" || tData.status === "no-answer") {
            clearInterval(pollInterval);
            setCallStatus("completed");
            setIsCalling(false);
            if (tData.transcript) {
              setTranscript(tData.transcript);
              onAddEvent({ agent: "sales", status: "done", message: `Call ended — ${tData.turns} turns, ${tData.duration || 0}s`, timestamp: Date.now() });
            } else {
              onAddEvent({ agent: "sales", status: "done", message: `Call ended (${tData.status})`, timestamp: Date.now() });
            }
          }
        } catch { /* keep polling */ }
      }, 5000);
    } catch (err) {
      setCallStatus("failed");
      setIsCalling(false);
      onAddEvent({ agent: "sales", status: "error", message: err instanceof Error ? err.message : "Call failed", timestamp: Date.now() });
    }
  };

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
        body: JSON.stringify({ transcript: transcript.trim(), prospectName: prospectName.trim() || "Prospect", companyName: companyName.trim() || "Company", profile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult({ outcome: data.callRecord.outcome, summary: data.callRecord.summary, nextAction: data.callRecord.nextAction, insights: data.insights, pdfDataUrl: data.pdfDataUrl });
      onAddEvent({ agent: "sales", status: "done", message: `Deal classified: ${data.callRecord.outcome}`, timestamp: Date.now() });
    } catch (err) {
      onAddEvent({ agent: "sales", status: "error", message: err instanceof Error ? err.message : "Analysis failed", timestamp: Date.now() });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* outbound call section */}
      <div className="glass-card p-4 border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Phone size={16} className="text-emerald-400" />
          <h4 className="text-sm font-semibold text-text-primary">AI Voice Call</h4>
          {callStatus !== "idle" && (
            <span className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
              callStatus === "ringing" ? "bg-amber-500/20 text-amber-400 animate-pulse" :
              callStatus === "in-progress" ? "bg-emerald-500/20 text-emerald-400 animate-pulse" :
              callStatus === "completed" ? "bg-blue-500/20 text-blue-400" :
              "bg-rose-500/20 text-rose-400"
            }`}>{callStatus}</span>
          )}
        </div>
        <p className="text-xs text-text-muted mb-3">Make a real outbound call — AI handles the sales conversation, then generates a transcript + PDF report</p>

        {/* prospect quick-select */}
        {prospects.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {prospects.slice(0, 6).map((p) => (
              <button key={p.id} onClick={() => handleSelectProspect(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  prospectName === p.contactName ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" : "bg-space-800 border border-card-border text-text-secondary hover:bg-space-700"
                }`}>
                {p.contactName} @ {p.companyName}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 234 567 8900"
            className="bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-500/50 text-text-primary placeholder:text-text-muted" disabled={isCalling} />
          <input type="text" value={prospectName} onChange={(e) => setProspectName(e.target.value)} placeholder="Contact name"
            className="bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-500/50 text-text-primary placeholder:text-text-muted" disabled={isCalling} />
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name"
            className="bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-500/50 text-text-primary placeholder:text-text-muted" disabled={isCalling} />
        </div>

        <button onClick={handleMakeCall} disabled={!phoneNumber.trim() || isCalling}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-space-700 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-sm">
          {isCalling ? (<><Loader2 size={16} className="animate-spin" /> Call in progress...</>) : (<><Phone size={16} /> Make Call</>)}
        </button>

        {/* live transcript */}
        {liveTranscript && (
          <div className="mt-3 bg-space-800 rounded-lg p-3 border border-card-border max-h-40 overflow-y-auto">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Live Transcript</p>
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">{liveTranscript}</pre>
          </div>
        )}
      </div>

      {/* transcript analysis section */}
      <form onSubmit={handleAnalyze} className="glass-card p-4">
        <p className="text-xs text-text-muted mb-3">Paste a call transcript, email thread, or meeting notes — Closer will analyze the deal and generate a structured PDF report</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input type="text" value={prospectName} onChange={(e) => setProspectName(e.target.value)} placeholder="Contact name (optional)"
            className="bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-500/50 text-text-primary placeholder:text-text-muted" disabled={isAnalyzing} />
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name (optional)"
            className="bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-500/50 text-text-primary placeholder:text-text-muted" disabled={isAnalyzing} />
        </div>
        <textarea
          value={transcript} onChange={(e) => setTranscript(e.target.value)}
          placeholder={placeholder}
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                result.outcome === "closed" ? "bg-emerald-500/20 text-emerald-400"
                : result.outcome === "interested" ? "bg-blue-500/20 text-blue-400"
                : result.outcome === "objection" ? "bg-amber-500/20 text-amber-400"
                : "bg-rose-500/20 text-rose-400"
              }`}>{result.outcome}</span>
              <h3 className="text-sm font-semibold text-text-primary">Deal Analysis</h3>
            </div>
            {result.pdfDataUrl && (
              <a href={result.pdfDataUrl} download={`call-notes-${Date.now()}.pdf`}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer">
                <FileText size={14} /> Download PDF
              </a>
            )}
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

function AdminTool({ invoice, pdfDataUrl, profile, onAddEvent, prospects }: {
  invoice: Invoice | null;
  pdfDataUrl: string;
  profile: CompanyProfile | null;
  onAddEvent: (event: AgentEvent) => void;
  prospects: Prospect[];
}) {
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [dealDesc, setDealDesc] = useState(profile?.productDescription || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genInvoice, setGenInvoice] = useState<Invoice | null>(null);
  const [genPdf, setGenPdf] = useState("");

  const handleSelectProspect = (p: Prospect) => {
    setSelectedProspect(p);
    setCompanyName(p.companyName);
    setContactName(p.contactName);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = companyName.trim();
    if (!client) return;
    setIsGenerating(true);
    onAddEvent({ agent: "admin", status: "working", message: `Generating invoice for ${client}`, timestamp: Date.now() });

    try {
      const res = await fetch("/api/agents/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          companyName: client,
          contactName: contactName.trim() || undefined,
          productDescription: dealDesc.trim() || profile?.productDescription || "Consulting services",
          dealSummary: dealDesc.trim() || undefined,
          profile,
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
      {/* quick-select from prospects */}
      {prospects.length > 0 && (
        <div className="glass-card p-4">
          <p className="text-xs text-text-muted mb-3">Select a prospect to auto-fill invoice details</p>
          <div className="flex flex-wrap gap-2">
            {prospects.map((p) => (
              <button key={p.id} onClick={() => handleSelectProspect(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedProspect?.id === p.id ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-400" : "bg-space-800 border border-card-border text-text-secondary hover:bg-space-700"
                }`}>
                {p.companyName}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleGenerate} className="glass-card p-4">
        <p className="text-xs text-text-muted mb-3">Generate a professional invoice — auto-fills from Brand Brain and pipeline data</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Client company name *"
            className="bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500/50 text-text-primary placeholder:text-text-muted" disabled={isGenerating} />
          <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Contact name"
            className="bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500/50 text-text-primary placeholder:text-text-muted" disabled={isGenerating} />
        </div>
        <input type="text" value={dealDesc} onChange={(e) => setDealDesc(e.target.value)} placeholder="Product/service description"
          className="w-full bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500/50 text-text-primary placeholder:text-text-muted mb-3" disabled={isGenerating} />
        <button type="submit" disabled={!companyName.trim() || isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-space-700 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-sm">
          {isGenerating ? (<><Loader2 size={16} className="animate-spin" /> Generating...</>) : (<><FileText size={16} /> Generate Invoice</>)}
        </button>
      </form>

      {displayInvoice ? (
        <InvoiceView invoice={displayInvoice} pdfDataUrl={displayPdf} />
      ) : (
        <EmptyWorkspace message="Select a prospect or enter client details above to generate an invoice." />
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
      profile={profile}
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
