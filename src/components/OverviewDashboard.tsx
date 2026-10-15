"use client";

import { Search, Mail, Phone, FileText, Zap, ChevronRight, ShieldCheck } from "lucide-react";
import type { CompanyProfile } from "@/lib/store";
import type { PipelineStage, AgentEvent, AgentRole, Prospect, EmailDraft, CallRecord } from "@/lib/types";

interface OverviewDashboardProps {
  profile: CompanyProfile | null;
  stage: PipelineStage;
  isRunning: boolean;
  events: AgentEvent[];
  prospects: Prospect[];
  emails: EmailDraft[];
  callRecord: CallRecord | null;
  onLaunch: (prompt: string) => void;
  onSelectAgent: (role: AgentRole) => void;
}

// # 5 agent cards for the overview pipeline visualization
const AGENT_CARDS: { role: AgentRole; name: string; title: string; gradient: string; desc: string }[] = [
  { role: "research", name: "Scout", title: "Research Agent", gradient: "from-blue-500 to-cyan-500", desc: "Finds & qualifies leads from web search" },
  { role: "outreach", name: "Reach", title: "Outreach Agent", gradient: "from-amber-500 to-orange-500", desc: "Drafts personalized emails & voice calls" },
  { role: "emailqa", name: "QA", title: "Email QA Agent", gradient: "from-purple-500 to-violet-500", desc: "Scans emails for quality & compliance" },
  { role: "sales", name: "Closer", title: "Sales Agent", gradient: "from-emerald-500 to-green-500", desc: "Analyzes deals & classifies outcomes" },
  { role: "admin", name: "Invoice", title: "Invoice Agent", gradient: "from-indigo-500 to-violet-500", desc: "Generates professional invoices & PDFs" },
];

export default function OverviewDashboard({ profile, stage, isRunning, events, prospects, emails, callRecord, onLaunch, onSelectAgent }: OverviewDashboardProps) {
  const name = profile?.senderName?.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      {/* welcome */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome back, <span className="glow-text">{name}</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">Here&apos;s your acquisition command center.</p>
      </div>

      {/* stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label="Prospects" value={prospects.length} color="text-blue-400" />
        <StatCard icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} label="Emails Sent" value={emails.filter(e => e.sentAt).length} color="text-amber-400" />
        <StatCard icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} label="Calls Made" value={callRecord ? 1 : 0} color="text-emerald-400" />
        <StatCard icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Deals Closed" value={callRecord?.outcome === "closed" ? 1 : 0} color="text-purple-400" />
        <StatCard icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} label="Invoices" value={0} color="text-indigo-400" />
        <StatCard icon={<Zap size={16} />} label="AI Actions" value={events.length} color="text-brand-glow" />
      </div>

      {/* acquisition pipeline — agent grid */}
      <div className="space-y-0">
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Acquisition Pipeline</h2>
            {stage !== "idle" && (
              <span className="text-xs text-brand-glow">{stage.charAt(0).toUpperCase() + stage.slice(1)}</span>
            )}
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AGENT_CARDS.map((agent) => {
              const agentEvents = events.filter((e) => e.agent === agent.role);
              const latestStatus = agentEvents[agentEvents.length - 1]?.status || "idle";
              const latestMsg = agentEvents[agentEvents.length - 1]?.message;
              const isActive = latestStatus === "thinking" || latestStatus === "working";

              return (
                <button key={agent.role} onClick={() => onSelectAgent(agent.role)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer group ${
                    isActive ? "border-brand-blue/30 bg-brand-blue/5 agent-active"
                    : latestStatus === "done" ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-card-border bg-space-800 hover:border-card-border hover:bg-space-700"
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white ${isActive ? "" : "opacity-50 group-hover:opacity-80"} transition-opacity`}>
                      {agent.role === "research" ? <Search size={14} /> : agent.role === "outreach" ? <Mail size={14} /> : agent.role === "emailqa" ? <ShieldCheck size={14} /> : agent.role === "sales" ? <Phone size={14} /> : <FileText size={14} />}
                    </div>
                    <ChevronRight size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary">{agent.name}</h4>
                  <p className="text-[11px] text-text-muted mb-1">{agent.title}</p>
                  {latestMsg ? (
                    <p className="text-xs text-text-secondary line-clamp-1">{latestMsg}</p>
                  ) : (
                    <p className="text-xs text-text-muted">{agent.desc}</p>
                  )}
                  {agentEvents.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${latestStatus === "done" ? "bg-emerald-400" : isActive ? "bg-blue-400 animate-pulse" : "bg-space-500"}`} />
                      <span className="text-[10px] text-text-muted">{agentEvents.length} actions</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="glass-card px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span className={color}>{icon}</span>
        <span className="text-[11px] text-text-muted">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
