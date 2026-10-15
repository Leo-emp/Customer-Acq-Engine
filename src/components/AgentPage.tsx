"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, FileText, Headphones, Clock, CheckCircle2, AlertCircle, Loader2, Send, Plus, Sparkles, ShieldCheck, AlertTriangle, RefreshCw, Lock, Download } from "lucide-react";
import LeadList from "./LeadList";
import EmailPreview from "./EmailPreview";
import VoiceCall from "./VoiceCall";
import InvoiceView from "./InvoiceView";
import SupportChat from "./SupportChat";
import type { CompanyProfile } from "@/lib/store";
import type { AgentEvent, AgentRole, AgentStatus, Prospect, EmailDraft, CallRecord, Invoice } from "@/lib/types";
import { DEMO_MODE, DEMO_SENT_EMAILS, DEMO_FOLLOWUP_EMAILS, DEMO_FOLLOWUP_QA, DEMO_CALL_TRANSCRIPT, DEMO_SALES_ANALYSIS } from "@/lib/demo-data";
import type { EmailQAResult } from "@/lib/demo-data";
import { DEMO_PIPELINE_QA, DEMO_PIPELINE_EMAILS } from "@/lib/demo-pipeline";
import { generateCompetitorPDF, generateIndustryPDF, generateMarketPDF } from "@/lib/pdf";

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
      { label: "Search for Leads", action: "leads" },
      { label: "Competitor Analysis", action: "competitors" },
      { label: "Industry Research", action: "industry" },
      { label: "Market Mapping", action: "market" },
    ],
    description: "Scout uses AI to research your market landscape. Each tool auto-executes using your Brand Brain identity.",
  },
  outreach: {
    name: "Reach", title: "Outreach Agent", icon: <Mail size={24} />, color: "text-amber-400", gradient: "from-amber-500 to-orange-500", borderColor: "border-amber-500/30",
    capabilities: [
      { label: "Draft Cold Email", action: "draft-cold" },
      { label: "Write Follow-Up", action: "followup" },
    ],
    description: "Reach crafts personalized cold emails and follow-ups using leads from Scout. Select a tab to get started.",
  },
  emailqa: {
    name: "QA", title: "Email QA Agent", icon: <ShieldCheck size={24} />, color: "text-purple-400", gradient: "from-purple-500 to-violet-500", borderColor: "border-purple-500/30",
    capabilities: [
      { label: "Scan Cold Emails", action: "scan-cold" },
      { label: "Scan Follow-Ups", action: "scan-followups" },
    ],
    description: "QA Agent scans drafted emails for quality, personalization gaps, and compliance issues before sending.",
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
    name: "Invoice", title: "Invoice Agent", icon: <FileText size={24} />, color: "text-indigo-400", gradient: "from-indigo-500 to-violet-500", borderColor: "border-indigo-500/30",
    capabilities: [
      { label: "Generate invoice", action: "invoice" },
      { label: "Download PDF", action: "pdf" },
    ],
    description: "Invoice agent generates professional invoices with AI-calculated line items and PDF export.",
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
  const [quickActionTick, setQuickActionTick] = useState(0);

  // # fire action immediately on button click — tick ensures re-clicks work
  const handleQuickAction = (action: string) => {
    setQuickAction(action);
    setQuickActionTick((t) => t + 1);
  };

  return (
    <div className="space-y-6">
      {/* agent header — sales agent gets compact header + inline stats */}
      {role === "sales" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={`lg:col-span-2 glass-card p-6 ${meta.borderColor} border`}>
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
            <p className="text-sm text-text-secondary mt-4 leading-relaxed">{meta.description}</p>
          </div>
          <div className="glass-card p-5 flex flex-col justify-center">
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
            </div>
          </div>
        </div>
      ) : (
        <>
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

          {/* quick actions + stats row (not shown for sales) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 glass-card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {meta.capabilities.map((cap, i) => (
                  <button key={i} onClick={() => handleQuickAction(cap.prompt || cap.action || cap.label)}
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
        </>
      )}

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
            quickActionTick={quickActionTick}
          />
        )}

        {role === "outreach" && (
          <OutreachTool
            prospects={prospects}
            emails={emails}
            onAddEmails={onAddEmails}
            onAddEvent={onAddEvent}
            profile={profile}
          />
        )}

        {role === "emailqa" && (
          <EmailQAPanel
            emails={emails}
            onAddEvent={onAddEvent}
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
            {agentEvents.map((event, i) => {
              // # when agent is done, show all events as green (Complete)
              const dotStatus = latestStatus === "done" ? "done" : event.status;
              // # convert in-progress messages to past tense when agent is complete
              let displayMessage = event.message;
              if (latestStatus === "done" && event.status !== "done" && event.status !== "error") {
                displayMessage = displayMessage
                  .replace(/\bAnalyzing\b/g, "Analyzed")
                  .replace(/\bSearching\b/g, "Searched")
                  .replace(/\bScanning\b/g, "Scanned")
                  .replace(/\bDrafting\b/g, "Drafted")
                  .replace(/\bGenerating\b/g, "Generated")
                  .replace(/\bCrafting\b/g, "Crafted")
                  .replace(/\bInitiating\b/g, "Initiated")
                  .replace(/\bMapping\b/g, "Mapped")
                  .replace(/\bResearching\b/g, "Researched")
                  .replace(/\bBuilding\b/g, "Built")
                  .replace(/\bWriting\b/g, "Wrote")
                  .replace(/\bSending\b/g, "Sent")
                  .replace(/\bProcessing\b/g, "Processed")
                  .replace(/\bConnecting\b/g, "Connected")
                  .replace(/\bReviewing\b/g, "Reviewed")
                  .replace(/\bInitializing\b/g, "Initialized")
                  .replace(/\.\.\.$/, "");
              }
              return (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  dotStatus === "done" ? "bg-emerald-400"
                  : dotStatus === "working" ? "bg-blue-400"
                  : dotStatus === "thinking" ? "bg-amber-400"
                  : dotStatus === "error" ? "bg-rose-400"
                  : "bg-space-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <span className="text-text-secondary">{displayMessage}</span>
                </div>
                <span className="text-xs text-text-muted flex-shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── STANDALONE TOOLS ──

function ResearchTool({ prospects, activeProspectId, onSelectProspect, onAddProspects, onAddEvent, profile, quickAction, quickActionTick }: {
  prospects: Prospect[];
  activeProspectId?: string;
  onSelectProspect: (p: Prospect) => void;
  onAddProspects: (prospects: Prospect[]) => void;
  onAddEvent: (event: AgentEvent) => void;
  profile: CompanyProfile | null;
  quickAction: string;
  quickActionTick: number;
}) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeAction, setActiveAction] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leadSummary, setLeadSummary] = useState<any>(null);

  // # auto-execute immediately on every button click (tick changes on each click)
  useEffect(() => {
    if (!quickAction || quickActionTick === 0 || isSearching) return;
    executeAction(quickAction);
  }, [quickActionTick]); // eslint-disable-line react-hooks/exhaustive-deps

  const executeAction = async (action: string, searchQuery?: string) => {
    setIsSearching(true);
    setActiveAction(action);
    setAnalysisResult(null);

    const labels: Record<string, string> = {
      leads: "Searching Apollo for leads...",
      competitors: "Analyzing competitors...",
      industry: "Researching industry...",
      market: "Mapping market landscape...",
    };
    onAddEvent({ agent: "research", status: "working", message: labels[action] || "Working...", timestamp: Date.now() });

    try {
      const body: Record<string, unknown> = { action, profile };
      if (action === "leads") {
        body.query = searchQuery || `Find B2B customers for ${profile?.productDescription} targeting ${profile?.targetMarket}`;
      }

      const res = await fetch("/api/agents/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (action === "leads") {
        onAddProspects(data.prospects);
        setLeadSummary(data.summary);
        onAddEvent({ agent: "research", status: "done", message: `Found ${data.prospects.length} qualified leads`, timestamp: Date.now() });
      } else {
        setAnalysisResult({ action, ...data });
        const doneMessages: Record<string, string> = {
          competitors: `Identified ${data.competitors?.length || 0} competitors`,
          industry: `Industry report complete: ${data.overview?.industryName || ""}`,
          market: `Market map complete: ${data.segments?.length || 0} segments identified`,
        };
        onAddEvent({ agent: "research", status: "done", message: doneMessages[action] || "Analysis complete", timestamp: Date.now() });
      }
    } catch (err) {
      onAddEvent({ agent: "research", status: "error", message: err instanceof Error ? err.message : "Failed", timestamp: Date.now() });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim() || (profile ? `Find B2B customers for ${profile.productDescription} targeting ${profile.targetMarket}` : "");
    if (!q) return;
    executeAction("leads", q);
  };

  // # PDF download helper for analysis reports
  const downloadPDF = (dataUri: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = filename;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* loading state */}
      {isSearching && (
        <div className="glass-card p-6 border border-blue-500/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Loader2 size={20} className="text-blue-400 animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                {activeAction === "leads" ? "Searching Apollo.io..." : activeAction === "competitors" ? "Analyzing Competitors..." : activeAction === "industry" ? "Researching Industry..." : "Mapping Market..."}
              </p>
              <p className="text-xs text-text-muted mt-0.5">Using {profile?.companyName || "your"} Brand Brain identity</p>
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      {/* lead search input */}
      {(activeAction === "leads" || activeAction === "" || !analysisResult) && (
        <form onSubmit={handleSearch} className="glass-card p-4">
          <p className="text-xs text-text-muted mb-3">Search Apollo.io for real B2B leads matching your target market</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-space-800 rounded-xl border border-card-border px-3 py-2.5">
              <Search size={16} className="text-text-muted flex-shrink-0" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={profile ? `e.g. "SaaS companies in ${profile.targetMarket}"` : "Describe your ideal customer..."}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted text-text-primary" disabled={isSearching} />
            </div>
            <button type="submit" disabled={isSearching}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:bg-space-700 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-sm whitespace-nowrap">
              {isSearching && activeAction === "leads" ? (<><Loader2 size={16} className="animate-spin" /> Searching...</>) : (<><Search size={16} /> Find Leads</>)}
            </button>
          </div>
        </form>
      )}

      {/* lead summary card — only show when viewing leads, not other analyses */}
      {leadSummary && prospects.length > 0 && (!analysisResult || activeAction === "leads") && (
        <div className="glass-card p-4 border border-blue-500/20">
          <h4 className="text-sm font-semibold text-text-primary mb-3">Search Results Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-space-800 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{leadSummary.totalLeads}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Total Leads</p>
            </div>
            <div className="bg-space-800 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{leadSummary.verifiedEmails}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Verified Emails</p>
            </div>
            <div className="bg-space-800 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">{leadSummary.avgScore}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Avg Score</p>
            </div>
            <div className="bg-space-800 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">{leadSummary.scoreBreakdown?.excellent || 0}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Top Matches</p>
            </div>
          </div>
          {leadSummary.topIndustries?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {leadSummary.topIndustries.map((ind: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-300">{ind}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* lead table — only show when viewing leads, not competitor/industry/market */}
      {prospects.length > 0 && (!analysisResult || activeAction === "leads") && <LeadList prospects={prospects} activeProspectId={activeProspectId} onSelect={onSelectProspect} />}

      {/* ── COMPETITOR ANALYSIS OUTPUT ── */}
      {analysisResult?.action === "competitors" && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="glass-card p-5 border border-rose-500/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Competitive Analysis</h3>
                <p className="text-xs text-text-muted">Based on {profile?.companyName}&apos;s market position</p>
              </div>
              <button onClick={() => downloadPDF(generateCompetitorPDF(analysisResult, profile?.companyName || "Company"), `competitive-analysis-${profile?.companyName || "report"}.pdf`)}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer">
                <Download size={14} /> Export PDF
              </button>
            </div>
          </div>

          {/* competitor cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {analysisResult.competitors?.map((comp: { name: string; website: string; description: string; strengths: string[]; weaknesses: string[]; pricing: string; marketPosition: string; threatLevel: string }, i: number) => (
              <div key={i} className="glass-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{comp.name}</h4>
                    <p className="text-[10px] text-text-muted">{comp.website}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      comp.threatLevel === "high" ? "bg-rose-500/20 text-rose-400" :
                      comp.threatLevel === "medium" ? "bg-amber-500/20 text-amber-400" :
                      "bg-emerald-500/20 text-emerald-400"
                    }`}>{comp.threatLevel} threat</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-space-700 text-text-muted">{comp.marketPosition}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mb-3">{comp.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1.5 font-medium">Strengths</p>
                    {comp.strengths?.map((s: string, j: number) => (
                      <p key={j} className="text-[11px] text-text-muted flex items-start gap-1.5 mb-1"><span className="text-emerald-400 mt-0.5 flex-shrink-0">+</span>{s}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-400 uppercase tracking-wider mb-1.5 font-medium">Weaknesses</p>
                    {comp.weaknesses?.map((w: string, j: number) => (
                      <p key={j} className="text-[11px] text-text-muted flex items-start gap-1.5 mb-1"><span className="text-rose-400 mt-0.5 flex-shrink-0">-</span>{w}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-card-border">
                  <p className="text-[10px] text-text-muted">Pricing: <span className="text-text-secondary">{comp.pricing}</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* strategic insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="glass-card p-4 border border-emerald-500/20">
              <h4 className="text-xs text-emerald-400 uppercase tracking-wider font-medium mb-3">Our Advantages</h4>
              {analysisResult.ourAdvantages?.map((a: string, i: number) => (
                <p key={i} className="text-xs text-text-secondary flex items-start gap-2 mb-2"><span className="text-emerald-400 mt-0.5 flex-shrink-0">&#9679;</span>{a}</p>
              ))}
            </div>
            <div className="glass-card p-4 border border-rose-500/20">
              <h4 className="text-xs text-rose-400 uppercase tracking-wider font-medium mb-3">Our Vulnerabilities</h4>
              {analysisResult.ourVulnerabilities?.map((v: string, i: number) => (
                <p key={i} className="text-xs text-text-secondary flex items-start gap-2 mb-2"><span className="text-rose-400 mt-0.5 flex-shrink-0">&#9679;</span>{v}</p>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 border border-blue-500/20">
            <h4 className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-3">Strategic Recommendations</h4>
            <div className="space-y-2">
              {analysisResult.strategicRecommendations?.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-space-800 rounded-lg p-3">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">{i + 1}</span>
                  <p className="text-xs text-text-secondary">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {analysisResult.marketGaps?.length > 0 && (
            <div className="glass-card p-4 border border-purple-500/20">
              <h4 className="text-xs text-purple-400 uppercase tracking-wider font-medium mb-3">Market Gaps to Exploit</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.marketGaps.map((g: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-300">{g}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── INDUSTRY RESEARCH OUTPUT ── */}
      {analysisResult?.action === "industry" && (
        <div className="space-y-4 animate-fade-in-up">
          {/* overview card */}
          <div className="glass-card p-5 border border-cyan-500/20">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-text-primary mb-1">{analysisResult.overview?.industryName || "Industry"} Report</h3>
              <button onClick={() => downloadPDF(generateIndustryPDF(analysisResult, profile?.companyName || "Company"), `industry-report-${profile?.companyName || "report"}.pdf`)}
                className="flex items-center gap-1.5 px-3 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 transition-all cursor-pointer">
                <Download size={14} /> Export PDF
              </button>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">{analysisResult.overview?.summary}</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-space-800 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-cyan-400">{analysisResult.overview?.marketSize}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Market Size</p>
              </div>
              <div className="bg-space-800 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-emerald-400">{analysisResult.overview?.growthRate}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Growth Rate</p>
              </div>
              <div className="bg-space-800 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-amber-400 capitalize">{analysisResult.overview?.maturityStage}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Stage</p>
              </div>
            </div>
          </div>

          {/* trends */}
          <div className="glass-card p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Key Trends</h4>
            <div className="space-y-3">
              {analysisResult.trends?.map((t: { trend: string; impact: string; timeframe: string; relevance: string }, i: number) => (
                <div key={i} className="bg-space-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-text-primary">{t.trend}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        t.relevance === "high" ? "bg-rose-500/20 text-rose-400" :
                        t.relevance === "medium" ? "bg-amber-500/20 text-amber-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>{t.relevance}</span>
                      <span className="text-[10px] text-text-muted bg-space-700 px-2 py-0.5 rounded-full">{t.timeframe}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted">{t.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* key players */}
          <div className="glass-card p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Key Players</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {analysisResult.keyPlayers?.map((p: { name: string; role: string; marketShare: string }, i: number) => (
                <div key={i} className="bg-space-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-text-primary">{p.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{p.role}</p>
                  <p className="text-xs text-cyan-400 font-medium mt-1">{p.marketShare}</p>
                </div>
              ))}
            </div>
          </div>

          {/* opportunities + threats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="glass-card p-4 border border-emerald-500/20">
              <h4 className="text-xs text-emerald-400 uppercase tracking-wider font-medium mb-3">Opportunities</h4>
              {analysisResult.opportunities?.map((o: { opportunity: string; description: string; difficulty: string; potentialRevenue: string }, i: number) => (
                <div key={i} className="bg-space-800 rounded-lg p-3 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-text-primary">{o.opportunity}</span>
                    <span className="text-[10px] text-emerald-400 font-medium">{o.potentialRevenue}</span>
                  </div>
                  <p className="text-[11px] text-text-muted">{o.description}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] bg-space-700 text-text-muted">{o.difficulty}</span>
                </div>
              ))}
            </div>
            <div className="glass-card p-4 border border-rose-500/20">
              <h4 className="text-xs text-rose-400 uppercase tracking-wider font-medium mb-3">Threats</h4>
              {analysisResult.threats?.map((t: { threat: string; severity: string; mitigation: string }, i: number) => (
                <div key={i} className="bg-space-800 rounded-lg p-3 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-text-primary">{t.threat}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      t.severity === "high" ? "bg-rose-500/20 text-rose-400" :
                      t.severity === "medium" ? "bg-amber-500/20 text-amber-400" :
                      "bg-slate-500/20 text-slate-400"
                    }`}>{t.severity}</span>
                  </div>
                  <p className="text-[11px] text-text-muted">{t.mitigation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* outlook */}
          <div className="glass-card p-4 border border-cyan-500/20">
            <h4 className="text-xs text-cyan-400 uppercase tracking-wider font-medium mb-2">Industry Outlook</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{analysisResult.outlook}</p>
          </div>
        </div>
      )}

      {/* ── MARKET MAPPING OUTPUT ── */}
      {analysisResult?.action === "market" && (
        <div className="space-y-4 animate-fade-in-up">
          {/* TAM/SAM overview */}
          <div className="glass-card p-5 border border-violet-500/20">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary">Market Map</h3>
              <button onClick={() => downloadPDF(generateMarketPDF(analysisResult, profile?.companyName || "Company"), `market-map-${profile?.companyName || "report"}.pdf`)}
                className="flex items-center gap-1.5 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs font-medium text-violet-400 hover:bg-violet-500/20 transition-all cursor-pointer">
                <Download size={14} /> Export PDF
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-space-800 rounded-lg p-4">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Total Addressable Market</p>
                <p className="text-2xl font-bold text-violet-400">{analysisResult.totalAddressableMarket?.size}</p>
                <p className="text-xs text-text-muted mt-1">{analysisResult.totalAddressableMarket?.description}</p>
              </div>
              <div className="bg-space-800 rounded-lg p-4">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Serviceable Market</p>
                <p className="text-2xl font-bold text-emerald-400">{analysisResult.serviceableMarket?.size}</p>
                <p className="text-xs text-text-muted mt-1">{analysisResult.serviceableMarket?.description}</p>
              </div>
            </div>
          </div>

          {/* segments */}
          <div className="glass-card p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Market Segments</h4>
            <div className="space-y-2">
              {analysisResult.segments?.map((seg: { name: string; size: string; growth: string; competition: string; ourFit: string; description: string; entryStrategy: string }, i: number) => {
                const isPriority = analysisResult.prioritySegments?.includes(seg.name);
                return (
                  <div key={i} className={`bg-space-800 rounded-lg p-4 ${isPriority ? "border border-violet-500/30" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">{seg.name}</span>
                        {isPriority && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-400">PRIORITY</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted">{seg.size}</span>
                        <span className="text-xs text-emerald-400">{seg.growth}</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mb-2">{seg.description}</p>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        seg.competition === "blue ocean" ? "bg-blue-500/20 text-blue-400" :
                        seg.competition === "underserved" ? "bg-emerald-500/20 text-emerald-400" :
                        seg.competition === "moderate" ? "bg-amber-500/20 text-amber-400" :
                        seg.competition === "competitive" ? "bg-orange-500/20 text-orange-400" :
                        "bg-rose-500/20 text-rose-400"
                      }`}>{seg.competition}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        seg.ourFit === "strong" ? "bg-emerald-500/20 text-emerald-400" :
                        seg.ourFit === "moderate" ? "bg-amber-500/20 text-amber-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>Fit: {seg.ourFit}</span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-2 italic">{seg.entryStrategy}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* buyer personas */}
          <div className="glass-card p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Buyer Personas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysisResult.buyerPersonas?.map((bp: { title: string; companySize: string; painPoints: string[]; decisionFactors: string[]; budget: string }, i: number) => (
                <div key={i} className="bg-space-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-text-primary mb-0.5">{bp.title}</p>
                  <p className="text-[10px] text-text-muted mb-2">{bp.companySize} | Budget: {bp.budget}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-rose-400 uppercase tracking-wider mb-1.5 font-medium">Pain Points</p>
                      {bp.painPoints?.map((p: string, j: number) => (
                        <p key={j} className="text-[11px] text-text-muted mb-1">&#8226; {p}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1.5 font-medium">Decision Factors</p>
                      {bp.decisionFactors?.map((d: string, j: number) => (
                        <p key={j} className="text-[11px] text-text-muted mb-1">&#8226; {d}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* positioning map */}
          {analysisResult.positioningMap && (
            <div className="glass-card p-4 border border-violet-500/20">
              <h4 className="text-sm font-semibold text-text-primary mb-3">Competitive Positioning</h4>
              <div className="relative bg-space-800 rounded-lg p-6 min-h-[280px]">
                {/* axes */}
                <div className="absolute left-6 top-6 bottom-12 w-px bg-card-border" />
                <div className="absolute left-6 right-6 bottom-12 h-px bg-card-border" />
                <p className="absolute left-0 top-1/2 -rotate-90 text-[10px] text-text-muted font-medium origin-center -translate-x-2 whitespace-nowrap">{analysisResult.positioningMap.axes?.y}</p>
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-text-muted font-medium whitespace-nowrap">{analysisResult.positioningMap.axes?.x}</p>

                {/* plot players */}
                {analysisResult.positioningMap.players?.map((p: { name: string; x: string; y: string }, i: number) => {
                  const xPos = p.x === "low" ? "20%" : p.x === "medium" ? "50%" : "80%";
                  const yPos = p.y === "low" ? "75%" : p.y === "medium" ? "45%" : "15%";
                  return (
                    <div key={i} className="absolute" style={{ left: xPos, top: yPos, transform: "translate(-50%, -50%)" }}>
                      <div className="w-3 h-3 rounded-full bg-slate-500 mb-0.5 mx-auto" />
                      <p className="text-[10px] text-text-muted text-center whitespace-nowrap">{p.name}</p>
                    </div>
                  );
                })}

                {/* our position */}
                {analysisResult.positioningMap.ourPosition && (
                  <div className="absolute" style={{
                    left: analysisResult.positioningMap.ourPosition.x === "low" ? "20%" : analysisResult.positioningMap.ourPosition.x === "medium" ? "50%" : "80%",
                    top: analysisResult.positioningMap.ourPosition.y === "low" ? "75%" : analysisResult.positioningMap.ourPosition.y === "medium" ? "45%" : "15%",
                    transform: "translate(-50%, -50%)",
                  }}>
                    <div className="w-4 h-4 rounded-full bg-violet-500 mb-0.5 mx-auto ring-2 ring-violet-400/50" />
                    <p className="text-[10px] text-violet-400 text-center font-bold whitespace-nowrap">{profile?.companyName || "Us"}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* recommendation */}
          <div className="glass-card p-4 border border-violet-500/20">
            <h4 className="text-xs text-violet-400 uppercase tracking-wider font-medium mb-2">Entry Recommendation</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{analysisResult.entryRecommendation}</p>
          </div>
        </div>
      )}

      {/* empty state */}
      {!isSearching && prospects.length === 0 && !analysisResult && (
        <EmptyWorkspace message="Click a tool above to get started. Search for Leads uses Apollo.io, other tools use AI analysis." />
      )}
    </div>
  );
}

function OutreachTool({ prospects, emails, onAddEmails, onAddEvent, profile }: {
  prospects: Prospect[];
  emails: EmailDraft[];
  onAddEmails: (emails: EmailDraft[]) => void;
  onAddEvent: (event: AgentEvent) => void;
  profile: CompanyProfile | null;
}) {
  const [activeTab, setActiveTab] = useState<"draft-cold" | "followup">("draft-cold");
  // # Draft Cold Email state
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isDrafting, setIsDrafting] = useState(false);
  const [coldDrafts, setColdDrafts] = useState<EmailDraft[]>([]);
  // # Follow-Up state
  const [sentEmails] = useState<EmailDraft[]>(DEMO_MODE ? DEMO_SENT_EMAILS as EmailDraft[] : []);
  const [selectedSentEmail, setSelectedSentEmail] = useState<string | null>(null);
  const [isFollowingUp, setIsFollowingUp] = useState(false);
  const [followupDrafts, setFollowupDrafts] = useState<EmailDraft[]>([]);

  // # toggle lead selection for cold email drafting
  const toggleLead = (id: string) => {
    setSelectedLeads(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // # select all / deselect all
  const toggleAll = () => {
    if (selectedLeads.size === prospects.length) setSelectedLeads(new Set());
    else setSelectedLeads(new Set(prospects.map(p => p.id)));
  };

  // # generate cold email drafts for selected leads
  const handleGenerateDrafts = async () => {
    if (selectedLeads.size === 0) return;
    setIsDrafting(true);
    const count = selectedLeads.size;
    onAddEvent({ agent: "outreach", status: "working", message: `Drafting ${count} cold emails...`, timestamp: Date.now() });

    // # demo mode: use cached pipeline emails for all 30 leads
    if (DEMO_MODE) {
      const selectedProspects = prospects.filter(p => selectedLeads.has(p.id));
      const drafts: EmailDraft[] = [];
      // # stagger output for natural feel
      for (let i = 0; i < selectedProspects.length; i++) {
        const p = selectedProspects[i];
        await new Promise(r => setTimeout(r, 80));
        // # match by prospectId against pipeline email cache
        const cached = DEMO_PIPELINE_EMAILS.find(e => e.prospectId === p.id);
        if (cached) {
          const senderName = profile?.senderName || "Alex";
          drafts.push({
            ...cached,
            body: cached.body.replace("{senderName}", senderName),
            sentAt: undefined,
          } as EmailDraft);
        }
        // # progress events every 5 emails
        if ((i + 1) % 5 === 0 || i === selectedProspects.length - 1) {
          onAddEvent({ agent: "outreach", status: "working", message: `Drafted ${i + 1} of ${count} emails...`, timestamp: Date.now() });
        }
      }
      setColdDrafts(drafts);
      onAddEmails(drafts);
      onAddEvent({ agent: "outreach", status: "done", message: `${drafts.length} cold emails drafted`, timestamp: Date.now() });
      setIsDrafting(false);
      return;
    }

    try {
      const res = await fetch("/api/agents/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "draft-all", prospects: prospects.filter(p => selectedLeads.has(p.id)), profile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setColdDrafts(data.emails);
      onAddEmails(data.emails);
      onAddEvent({ agent: "outreach", status: "done", message: `${data.emails.length} cold emails drafted`, timestamp: Date.now() });
    } catch (err) {
      onAddEvent({ agent: "outreach", status: "error", message: err instanceof Error ? err.message : "Draft failed", timestamp: Date.now() });
    } finally {
      setIsDrafting(false);
    }
  };

  // # generate follow-up for a specific sent email
  const handleGenerateFollowup = async (email: EmailDraft) => {
    const prospect = prospects.find(p => p.id === email.prospectId);
    if (!prospect) return;
    setIsFollowingUp(true);
    setSelectedSentEmail(email.prospectId);
    onAddEvent({ agent: "outreach", status: "working", message: `Writing follow-up for ${prospect.companyName}...`, timestamp: Date.now() });

    // # in demo mode, use cached follow-up
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 2000));
      const cached = DEMO_FOLLOWUP_EMAILS.find(f => f.prospectId === email.prospectId);
      if (cached) {
        const followup = cached as EmailDraft;
        setFollowupDrafts(prev => [...prev.filter(f => f.prospectId !== email.prospectId), followup]);
        onAddEvent({ agent: "outreach", status: "done", message: `Follow-up drafted for ${prospect.companyName}`, timestamp: Date.now() });
      }
    } else {
      try {
        const res = await fetch("/api/agents/outreach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "followup", prospect, originalEmail: email, profile }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setFollowupDrafts(prev => [...prev.filter(f => f.prospectId !== email.prospectId), data.email]);
        onAddEvent({ agent: "outreach", status: "done", message: `Follow-up drafted for ${prospect.companyName}`, timestamp: Date.now() });
      } catch (err) {
        onAddEvent({ agent: "outreach", status: "error", message: err instanceof Error ? err.message : "Follow-up failed", timestamp: Date.now() });
      }
    }
    setIsFollowingUp(false);
    setSelectedSentEmail(null);
  };

  return (
    <div className="space-y-4">
      {/* tab switcher */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab("draft-cold")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "draft-cold" ? "bg-amber-500/10 border border-amber-500/30 text-amber-400" : "bg-space-800 border border-card-border text-text-muted hover:text-text-secondary"
          }`}>
          <Mail size={14} /> Draft Cold Email
        </button>
        <button onClick={() => setActiveTab("followup")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "followup" ? "bg-amber-500/10 border border-amber-500/30 text-amber-400" : "bg-space-800 border border-card-border text-text-muted hover:text-text-secondary"
          }`}>
          <RefreshCw size={14} /> Write Follow-Up
          {sentEmails.length > 0 && <span className="text-[10px] bg-space-700 px-1.5 py-0.5 rounded-md">{sentEmails.length}</span>}
        </button>
      </div>

      {/* ── TAB 1: DRAFT COLD EMAIL ── */}
      {activeTab === "draft-cold" && (
        <div className="space-y-4">
          {prospects.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <Search size={24} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted mb-1">No leads yet</p>
              <p className="text-xs text-text-muted">Use Scout to search for leads first, then come back to draft emails.</p>
            </div>
          ) : (
            <>
              {/* selection header */}
              <div className="glass-card p-4 border border-amber-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-amber-400" />
                    <h4 className="text-sm font-semibold text-text-primary">Select Leads to Email</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={toggleAll} className="text-[11px] text-brand-glow hover:underline cursor-pointer">
                      {selectedLeads.size === prospects.length ? "Deselect all" : "Select all"}
                    </button>
                    <span className="text-[11px] text-text-muted">{selectedLeads.size} selected</span>
                  </div>
                </div>

                {/* lead selection grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {prospects.map(p => {
                    const isSelected = selectedLeads.has(p.id);
                    return (
                      <button key={p.id} onClick={() => toggleLead(p.id)}
                        className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                          isSelected ? "border-amber-500/30 bg-amber-500/10" : "border-card-border bg-space-800 hover:bg-space-700"
                        }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text-primary truncate">{p.companyName}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "bg-amber-500 border-amber-500" : "border-space-500"
                          }`}>
                            {isSelected && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-text-muted truncate">{p.contactName} · {p.email}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{p.industry} · {p.employeeCount?.toLocaleString()} employees</p>
                      </button>
                    );
                  })}
                </div>

                {/* generate button */}
                <button onClick={handleGenerateDrafts} disabled={selectedLeads.size === 0 || isDrafting}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-space-700 disabled:text-text-muted text-white font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed">
                  {isDrafting ? (<><Loader2 size={16} className="animate-spin" /> Generating {selectedLeads.size} Emails...</>) : (<><Sparkles size={16} /> Generate {selectedLeads.size} Cold Email{selectedLeads.size !== 1 ? "s" : ""}</>)}
                </button>
              </div>

              {/* generated cold email drafts */}
              {coldDrafts.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Mail size={14} className="text-amber-400" /> Cold Email Drafts ({coldDrafts.length})
                  </h4>
                  {coldDrafts.map((email, i) => {
                    const prospect = prospects.find(p => p.id === email.prospectId);
                    return (
                      <div key={`cold-${i}`} className="glass-card overflow-hidden">
                        <div className="px-4 py-3 border-b border-card-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-text-muted">To: <span className="text-text-primary">{email.to}</span></p>
                              <p className="text-xs text-text-muted mt-0.5">Subject: <span className="text-text-primary font-medium">{email.subject}</span></p>
                            </div>
                            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 text-[11px] text-amber-400 font-medium">
                              <Clock size={12} /> Draft
                            </span>
                          </div>
                          {prospect && <p className="text-[10px] text-text-muted mt-1">{prospect.companyName} · {prospect.industry}</p>}
                        </div>
                        <div className="px-4 py-3">
                          <div className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">{email.body}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── TAB 2: WRITE FOLLOW-UP ── */}
      {activeTab === "followup" && (
        <div className="space-y-4">
          {sentEmails.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <Send size={24} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted mb-1">No sent emails yet</p>
              <p className="text-xs text-text-muted">Draft and send cold emails first, then come back to write follow-ups.</p>
            </div>
          ) : (
            <>
              <div className="glass-card p-4 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Send size={16} className="text-emerald-400" />
                  <h4 className="text-sm font-semibold text-text-primary">Sent Emails</h4>
                  <span className="text-[11px] text-text-muted">— Click to draft a follow-up</span>
                </div>
                <div className="space-y-2">
                  {sentEmails.map(email => {
                    const prospect = prospects.find(p => p.id === email.prospectId);
                    const hasFollowup = followupDrafts.some(f => f.prospectId === email.prospectId);
                    const isGenerating = isFollowingUp && selectedSentEmail === email.prospectId;
                    return (
                      <button key={email.prospectId} onClick={() => !hasFollowup && !isFollowingUp && handleGenerateFollowup(email)}
                        disabled={hasFollowup || isFollowingUp}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          hasFollowup ? "border-emerald-500/20 bg-emerald-500/5" :
                          isGenerating ? "border-amber-500/30 bg-amber-500/10" :
                          "border-card-border bg-space-800 hover:bg-space-700 cursor-pointer"
                        } disabled:cursor-not-allowed`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-text-primary">{prospect?.companyName || email.to}</span>
                            <p className="text-[11px] text-text-muted truncate mt-0.5">{email.subject}</p>
                            <p className="text-[10px] text-text-muted">Sent {new Date(email.sentAt!).toLocaleDateString()}</p>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            {isGenerating && <Loader2 size={14} className="text-amber-400 animate-spin" />}
                            {hasFollowup && <CheckCircle2 size={14} className="text-emerald-400" />}
                            {!hasFollowup && !isGenerating && <Mail size={14} className="text-text-muted" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* follow-up drafts */}
              {followupDrafts.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <RefreshCw size={14} className="text-amber-400" /> Follow-Up Drafts ({followupDrafts.length})
                  </h4>
                  {followupDrafts.map((email, i) => {
                    const prospect = prospects.find(p => p.id === email.prospectId);
                    return (
                      <div key={`followup-${i}`} className="glass-card overflow-hidden">
                        <div className="px-4 py-3 border-b border-card-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-text-muted">To: <span className="text-text-primary">{email.to}</span></p>
                              <p className="text-xs text-text-muted mt-0.5">Subject: <span className="text-text-primary font-medium">{email.subject}</span></p>
                            </div>
                            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 text-[11px] text-blue-400 font-medium">
                              <RefreshCw size={10} /> Follow-Up
                            </span>
                          </div>
                          {prospect && <p className="text-[10px] text-text-muted mt-1">{prospect.companyName} · {prospect.industry}</p>}
                        </div>
                        <div className="px-4 py-3">
                          <div className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">{email.body}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── EMAIL QA AGENT PANEL ──
// # 2 tabs: Scan Cold Emails + Scan Follow-Ups
// # when pipeline has already run, QA results are auto-populated from DEMO_PIPELINE_QA
function EmailQAPanel({ emails, onAddEvent }: {
  emails: EmailDraft[];
  onAddEvent: (event: AgentEvent) => void;
}) {
  const [activeTab, setActiveTab] = useState<"scan-cold" | "scan-followups">("scan-cold");
  // # auto-populate QA results if pipeline already ran (emails exist in demo mode)
  const [coldQaResults, setColdQaResults] = useState<EmailQAResult[]>(() => {
    if (DEMO_MODE && emails.length > 0) return DEMO_PIPELINE_QA;
    return [];
  });
  const [followupQaResults, setFollowupQaResults] = useState<EmailQAResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  // # auto-mark scan complete if pipeline already provided QA results
  const [coldScanComplete, setColdScanComplete] = useState(() => DEMO_MODE && emails.length > 0);
  const [followupScanComplete, setFollowupScanComplete] = useState(false);
  // # follow-up emails come from demo data directly (Reach drafts them locally)
  const followupEmails = DEMO_MODE ? (DEMO_FOLLOWUP_EMAILS as EmailDraft[]) : [];

  // # if emails arrive after mount (pipeline finishes), auto-populate QA results
  useEffect(() => {
    if (DEMO_MODE && emails.length > 0 && coldQaResults.length === 0) {
      setColdQaResults(DEMO_PIPELINE_QA);
      setColdScanComplete(true);
    }
  }, [emails.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // # verdict styling map
  const verdictConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
    approved: { label: "Approved", icon: <CheckCircle2 size={14} />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    rewrite_copy: { label: "Rewrite Copy", icon: <RefreshCw size={14} />, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    needs_personalization: { label: "Needs Personalization", icon: <AlertTriangle size={14} />, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    flagged_confidential: { label: "Confidential Flag", icon: <Lock size={14} />, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  };

  // # scan cold emails — fetches cached QA results from API
  const handleScanCold = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setColdQaResults([]);
    onAddEvent({ agent: "emailqa", status: "working", message: "Scanning cold email drafts...", timestamp: Date.now() });

    // # animate progress through each email
    const total = Math.min(emails.length, 10);
    for (let i = 0; i < total; i++) {
      setScanProgress(i + 1);
      await new Promise(r => setTimeout(r, 2000));
    }

    try {
      const res = await fetch("/api/agents/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "qa-scan" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setColdQaResults(data.results);
      const approved = (data.results as EmailQAResult[]).filter(r => r.verdict === "approved").length;
      const flagged = (data.results as EmailQAResult[]).filter(r => r.verdict !== "approved").length;
      onAddEvent({ agent: "emailqa", status: "done", message: `Cold email scan: ${approved} approved, ${flagged} flagged`, timestamp: Date.now() });
      setColdScanComplete(true);
    } catch (err) {
      onAddEvent({ agent: "emailqa", status: "error", message: err instanceof Error ? err.message : "Scan failed", timestamp: Date.now() });
    } finally {
      setIsScanning(false);
    }
  };

  // # scan follow-up emails — uses cached DEMO_FOLLOWUP_QA
  const handleScanFollowups = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setFollowupQaResults([]);
    onAddEvent({ agent: "emailqa", status: "working", message: "Scanning follow-up email drafts...", timestamp: Date.now() });

    // # animate progress through each follow-up
    const total = DEMO_FOLLOWUP_EMAILS.length;
    for (let i = 0; i < total; i++) {
      setScanProgress(i + 1);
      await new Promise(r => setTimeout(r, 2000));
    }

    // # small extra delay then load cached results
    await new Promise(r => setTimeout(r, 1000));
    setFollowupQaResults(DEMO_FOLLOWUP_QA);
    const approved = DEMO_FOLLOWUP_QA.filter(r => r.verdict === "approved").length;
    const flagged = DEMO_FOLLOWUP_QA.filter(r => r.verdict !== "approved").length;
    onAddEvent({ agent: "emailqa", status: "done", message: `Follow-up scan: ${approved} approved, ${flagged} flagged`, timestamp: Date.now() });
    setFollowupScanComplete(true);
    setIsScanning(false);
  };

  // # scanning animation (shared between both tabs)
  const renderScanAnimation = (total: number, emailList: { to: string }[]) => (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
        <Loader2 size={18} className="text-purple-400 animate-spin" />
        <div className="flex-1">
          <p className="text-sm font-medium text-text-primary">Scanning email {scanProgress} of {total}...</p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {scanProgress > 0 && emailList[scanProgress - 1]
              ? `Reviewing: ${emailList[scanProgress - 1].to}`
              : "Initializing QA agent..."}
          </p>
        </div>
      </div>
      {/* progress bar */}
      <div className="h-1.5 bg-space-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-1000"
          style={{ width: `${(scanProgress / total) * 100}%` }} />
      </div>
      {/* live scan items */}
      <div className="space-y-1.5">
        {Array.from({ length: scanProgress }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] animate-fade-in-up">
            {i < scanProgress - 1
              ? <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
              : <Loader2 size={12} className="text-purple-400 animate-spin flex-shrink-0" />}
            <span className="text-text-muted truncate">{emailList[i]?.to || `Email ${i + 1}`}</span>
            {i < scanProgress - 1 && <span className="text-emerald-400 ml-auto flex-shrink-0">Scanned</span>}
            {i === scanProgress - 1 && <span className="text-purple-400 ml-auto flex-shrink-0">Scanning...</span>}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* tab switcher — no number badges */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab("scan-cold")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "scan-cold"
              ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
              : "bg-space-800 border border-card-border text-text-muted hover:text-text-secondary"
          }`}>
          <ShieldCheck size={14} /> Scan Cold Emails
        </button>
        <button onClick={() => setActiveTab("scan-followups")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "scan-followups"
              ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
              : "bg-space-800 border border-card-border text-text-muted hover:text-text-secondary"
          }`}>
          <ShieldCheck size={14} /> Scan Follow-Ups
        </button>
      </div>

      {/* ── TAB 1: SCAN COLD EMAILS ── */}
      {activeTab === "scan-cold" && (
        <div className="space-y-4">
          {/* show drafted cold emails from Reach */}
          {emails.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <Mail size={24} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted mb-1">No cold email drafts yet</p>
              <p className="text-xs text-text-muted">Draft emails in the Reach agent first, then come back to scan them.</p>
            </div>
          ) : (
            <>
              {/* display each cold email draft */}
              <div className="space-y-3">
                {emails.map((email, i) => (
                  <div key={`cold-preview-${i}`} className="glass-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-card-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-text-muted">To: <span className="text-text-primary">{email.to}</span></p>
                          <p className="text-xs text-text-muted mt-0.5">Subject: <span className="text-text-primary font-medium">{email.subject}</span></p>
                        </div>
                        {/* show QA verdict badge — match by email address */}
                        {coldScanComplete && (() => {
                          const qaResult = coldQaResults.find(q => q.to === email.to) || coldQaResults[i];
                          if (!qaResult) return null;
                          const cfg = verdictConfig[qaResult.verdict] || verdictConfig.approved;
                          return (
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                              {cfg.icon} {cfg.label}
                            </span>
                          );
                        })()}
                        {!coldScanComplete && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 text-[11px] text-amber-400 font-medium">
                            <Clock size={12} /> Pending QA
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">{email.body}</div>
                    </div>
                    {/* show QA feedback inline — match by email address */}
                    {coldScanComplete && (() => {
                      const qaResult = coldQaResults.find(q => q.to === email.to) || coldQaResults[i];
                      if (!qaResult) return null;
                      return (
                        <div className="px-4 py-3 border-t border-card-border bg-space-800/50">
                          <p className="text-xs text-text-secondary leading-relaxed">{qaResult.reason}</p>
                          {qaResult.suggestions && qaResult.suggestions.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Suggestions</p>
                              {qaResult.suggestions.map((s, j) => (
                                <div key={j} className="flex items-start gap-1.5 text-[11px] text-text-muted">
                                  <span className="mt-0.5">&bull;</span><span>{s}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>

              {/* scan button */}
              {!isScanning && !coldScanComplete && (
                <button onClick={handleScanCold}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm font-medium text-purple-400 hover:bg-purple-500/20 transition-all cursor-pointer">
                  <ShieldCheck size={16} /> Scan Cold Emails
                </button>
              )}

              {/* scanning animation */}
              {isScanning && activeTab === "scan-cold" && renderScanAnimation(Math.min(emails.length, 10), emails)}
            </>
          )}
        </div>
      )}

      {/* ── TAB 2: SCAN FOLLOW-UPS ── */}
      {activeTab === "scan-followups" && (
        <div className="space-y-4">
          {/* show follow-up email drafts from Reach */}
          {followupEmails.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <RefreshCw size={24} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted mb-1">No follow-up drafts yet</p>
              <p className="text-xs text-text-muted">Write follow-ups in the Reach agent first, then come back to scan them.</p>
            </div>
          ) : (
            <>
              {/* display each follow-up draft */}
              <div className="space-y-3">
                {followupEmails.map((email, i) => (
                  <div key={`followup-preview-${i}`} className="glass-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-card-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-text-muted">To: <span className="text-text-primary">{email.to}</span></p>
                          <p className="text-xs text-text-muted mt-0.5">Subject: <span className="text-text-primary font-medium">{email.subject}</span></p>
                        </div>
                        {followupScanComplete && followupQaResults[i] && (() => {
                          const cfg = verdictConfig[followupQaResults[i].verdict] || verdictConfig.approved;
                          return (
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                              {cfg.icon} {cfg.label}
                            </span>
                          );
                        })()}
                        {!followupScanComplete && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 text-[11px] text-blue-400 font-medium">
                            <Clock size={12} /> Pending QA
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">{email.body}</div>
                    </div>
                    {followupScanComplete && followupQaResults[i] && (
                      <div className="px-4 py-3 border-t border-card-border bg-space-800/50">
                        <p className="text-xs text-text-secondary leading-relaxed">{followupQaResults[i].reason}</p>
                        {followupQaResults[i].suggestions && followupQaResults[i].suggestions!.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Suggestions</p>
                            {followupQaResults[i].suggestions!.map((s, j) => (
                              <div key={j} className="flex items-start gap-1.5 text-[11px] text-text-muted">
                                <span className="mt-0.5">&bull;</span><span>{s}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* scan button */}
              {!isScanning && !followupScanComplete && (
                <button onClick={handleScanFollowups}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm font-medium text-purple-400 hover:bg-purple-500/20 transition-all cursor-pointer">
                  <ShieldCheck size={16} /> Scan Follow-Ups
                </button>
              )}

              {/* scanning animation */}
              {isScanning && activeTab === "scan-followups" && renderScanAnimation(followupEmails.length, followupEmails)}
            </>
          )}
        </div>
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
  // # pre-fill with demo call transcript so judges see it ready to analyze
  const [transcript, setTranscript] = useState(DEMO_MODE ? DEMO_CALL_TRANSCRIPT : "");
  const [prospectName, setProspectName] = useState(DEMO_MODE ? "Dr. Rachel Torres" : "");
  const [companyName, setCompanyName] = useState(DEMO_MODE ? "MedVista Health Systems" : "");
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
    onAddEvent({ agent: "sales", status: "working", message: `Analyzing call with ${prospectName || "prospect"}...`, timestamp: Date.now() });

    // # demo mode: use cached analysis with realistic delay
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 1500));
      onAddEvent({ agent: "sales", status: "working", message: "Extracting key insights from 4m 42s conversation...", timestamp: Date.now() });
      await new Promise(r => setTimeout(r, 2000));
      onAddEvent({ agent: "sales", status: "working", message: "Classifying deal outcome and scoring buying signals...", timestamp: Date.now() });
      await new Promise(r => setTimeout(r, 1500));
      setResult({
        outcome: DEMO_SALES_ANALYSIS.outcome,
        summary: DEMO_SALES_ANALYSIS.summary,
        nextAction: DEMO_SALES_ANALYSIS.nextAction,
        insights: DEMO_SALES_ANALYSIS.keyInsights,
        pdfDataUrl: "",
      });
      onAddEvent({ agent: "sales", status: "done", message: `Deal classified: ${DEMO_SALES_ANALYSIS.outcome} — budget $250-400K confirmed, 6 key insights extracted`, timestamp: Date.now() });
      setIsAnalyzing(false);
      return;
    }

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
          {isAnalyzing ? (<><Loader2 size={16} className="animate-spin" /> Analyzing Call...</>) : (<><Phone size={16} /> Analyze Call</>)}
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
  const [dealDesc, setDealDesc] = useState("");
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
