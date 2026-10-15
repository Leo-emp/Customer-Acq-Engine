"use client";

// ── Sidebar Navigation ──
// # main nav: Overview, Pipeline (launch + logs), Brand Brain
// # agent list: Scout, Reach, QA, Closer, Ops
// # footer: user account button (reads from localStorage)

import { useState, useEffect } from "react";
import { Search, Mail, Phone, FileText, Zap, BarChart3, ChevronRight, Brain, ShieldCheck, UserCircle, Play } from "lucide-react";
import type { AgentEvent, AgentRole, AgentStatus, PipelineStage } from "@/lib/types";

export type ViewMode = AgentRole | "overview" | "pipeline" | "brandBrain" | "account";

interface AgentNav {
  role: AgentRole;
  name: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  activeColor: string;
  bgActive: string;
}

const AGENTS: AgentNav[] = [
  { role: "research", name: "Scout", title: "Research", icon: <Search size={18} />, color: "text-blue-400", activeColor: "text-blue-400", bgActive: "bg-blue-500/10 border-blue-500/30" },
  { role: "outreach", name: "Reach", title: "Outreach", icon: <Mail size={18} />, color: "text-amber-400", activeColor: "text-amber-400", bgActive: "bg-amber-500/10 border-amber-500/30" },
  { role: "emailqa", name: "QA", title: "Email QA", icon: <ShieldCheck size={18} />, color: "text-purple-400", activeColor: "text-purple-400", bgActive: "bg-purple-500/10 border-purple-500/30" },
  { role: "sales", name: "Closer", title: "Sales", icon: <Phone size={18} />, color: "text-emerald-400", activeColor: "text-emerald-400", bgActive: "bg-emerald-500/10 border-emerald-500/30" },
  { role: "admin", name: "Invoice", title: "Invoice", icon: <FileText size={18} />, color: "text-indigo-400", activeColor: "text-indigo-400", bgActive: "bg-indigo-500/10 border-indigo-500/30" },
];

const STATUS_DOT: Record<AgentStatus, string> = {
  idle: "bg-space-500",
  thinking: "bg-amber-400 animate-pulse",
  working: "bg-blue-400 animate-pulse",
  done: "bg-emerald-400",
  error: "bg-rose-400",
};

const PIPELINE_STAGES: { key: PipelineStage; label: string }[] = [
  { key: "researching", label: "Research" },
  { key: "emailing", label: "Outreach" },
  { key: "calling", label: "Calling" },
  { key: "selling", label: "Sales" },
  { key: "closing", label: "Invoice" },
];

const STAGE_ORDER: PipelineStage[] = [
  "idle", "researching", "emailing", "calling", "selling", "closing", "complete",
];

interface SidebarProps {
  activeView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  events: AgentEvent[];
  currentStage: PipelineStage;
  companyName?: string;
  isRunning: boolean;
  hasProfile: boolean;
}

export default function Sidebar({
  activeView,
  onSelectView,
  events,
  currentStage,
  companyName,
  isRunning,
  hasProfile,
}: SidebarProps) {
  // # load user name from localStorage for footer avatar
  const [userName, setUserName] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("U");
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setUserName(parsed.name);
          // # build initials from first letters of each word
          setUserInitials(parsed.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2));
        }
      }
    } catch {}
  }, []);
  const getAgentStatus = (role: AgentRole): AgentStatus => {
    // # only show "done" (Complete) when the pipeline is running or just finished
    // # individual button clicks should not mark the sidebar as Complete
    const agentEvents = events.filter((e) => e.agent === role);
    const lastStatus = (agentEvents[agentEvents.length - 1]?.status || "idle") as AgentStatus;
    if (lastStatus === "done" && !isRunning && currentStage === "idle") return "idle";
    return lastStatus;
  };

  const getAgentEventCount = (role: AgentRole): number => {
    return events.filter((e) => e.agent === role).length;
  };

  const currentStageIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <aside className="w-64 h-screen bg-space-900 border-r border-card-border flex flex-col fixed left-0 top-0 z-40">
      {/* logo */}
      <div className="px-5 py-5 border-b border-card-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary tracking-tight">AcquireAI</h1>
            <p className="text-[10px] text-text-muted">Customer Acquisition</p>
          </div>
        </div>
        {companyName && (
          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-space-800 border border-card-border">
            <p className="text-[11px] text-text-muted">Company</p>
            <p className="text-xs font-medium text-text-primary truncate">{companyName}</p>
          </div>
        )}
      </div>

      {/* pipeline progress */}
      {currentStage !== "idle" && (
        <div className="px-5 py-4 border-b border-card-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium">Pipeline</p>
            {isRunning && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400">Live</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            {PIPELINE_STAGES.map((stage) => {
              const stageIdx = STAGE_ORDER.indexOf(stage.key);
              const isDone = currentStageIndex > stageIdx;
              const isActive = stage.key === currentStage || (stage.key === "selling" && currentStage === "closing");
              return (
                <div key={stage.key} className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isDone ? "bg-emerald-400" : isActive ? "bg-brand-blue animate-pulse" : "bg-space-600"
                  }`} />
                  <span className={`text-xs ${
                    isDone ? "text-emerald-400" : isActive ? "text-brand-glow font-medium" : "text-text-muted"
                  }`}>
                    {stage.label}
                  </span>
                  {isDone && <span className="text-[10px] text-emerald-400/60 ml-auto">Done</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {/* main nav */}
        <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium px-2 mb-2">Main</p>

        <button
          onClick={() => onSelectView("overview")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all cursor-pointer ${
            activeView === "overview"
              ? "bg-space-700 border border-card-border text-text-primary"
              : "text-text-muted hover:text-text-secondary hover:bg-space-800"
          }`}
        >
          <BarChart3 size={18} />
          <span className="text-sm font-medium">Overview</span>
        </button>

        {/* # pipeline tab — launch + activity logs */}
        <button
          onClick={() => onSelectView("pipeline")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all cursor-pointer ${
            activeView === "pipeline"
              ? "bg-brand-blue/10 border border-brand-blue/30 text-brand-blue"
              : "text-text-muted hover:text-text-secondary hover:bg-space-800"
          }`}
        >
          <Play size={18} />
          <div className="flex-1 text-left">
            <span className="text-sm font-medium">Pipeline</span>
            {isRunning && <p className="text-[10px] text-emerald-400 animate-pulse">Running...</p>}
          </div>
        </button>

        <button
          onClick={() => onSelectView("brandBrain")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all cursor-pointer ${
            activeView === "brandBrain"
              ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
              : "text-text-muted hover:text-text-secondary hover:bg-space-800"
          }`}
        >
          <Brain size={18} />
          <div className="flex-1 text-left">
            <span className="text-sm font-medium">Brand Brain</span>
            {!hasProfile && <p className="text-[10px] text-amber-400">Not configured</p>}
            {hasProfile && <p className="text-[10px] text-emerald-400">Configured</p>}
          </div>
        </button>

        {/* agent list */}
        <p className="text-[11px] text-text-muted uppercase tracking-wider font-medium px-2 mb-2 mt-4">AI Agents</p>
        <div className="space-y-1">
          {AGENTS.map((agent) => {
            const status = getAgentStatus(agent.role);
            const count = getAgentEventCount(agent.role);
            const isActive = activeView === agent.role;

            return (
              <button
                key={agent.role}
                onClick={() => onSelectView(agent.role)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group ${
                  isActive
                    ? `${agent.bgActive} border`
                    : "text-text-muted hover:text-text-secondary hover:bg-space-800 border border-transparent"
                }`}
              >
                <span className={isActive ? agent.color : "text-text-muted group-hover:text-text-secondary"}>
                  {agent.icon}
                </span>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isActive ? agent.color : ""}`}>{agent.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
                  </div>
                  {(status === "thinking" || status === "working") ? (
                    <p className="text-[10px] text-brand-glow font-medium animate-pulse truncate">Working...</p>
                  ) : status === "done" ? (
                    <p className="text-[10px] text-emerald-400 truncate">Complete</p>
                  ) : (
                    <p className="text-[10px] text-text-muted truncate">{agent.title} Agent</p>
                  )}
                </div>
                {count > 0 && (
                  <span className="text-[10px] text-text-muted bg-space-700 px-1.5 py-0.5 rounded-md">{count}</span>
                )}
                <ChevronRight size={14} className={`flex-shrink-0 transition-colors ${isActive ? agent.color : "text-transparent group-hover:text-text-muted"}`} />
              </button>
            );
          })}
        </div>
      </nav>

      {/* footer — user account */}
      <div className="px-3 py-3 border-t border-card-border">
        <button
          onClick={() => onSelectView("account")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeView === "account"
              ? "bg-space-700 border border-card-border text-text-primary"
              : "text-text-muted hover:text-text-secondary hover:bg-space-800"
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
            {userInitials}
          </div>
          <div className="flex-1 text-left min-w-0">
            <span className="text-xs font-medium block truncate">{userName || "Account"}</span>
            <span className="text-[10px] text-text-muted block truncate">Pro Plan</span>
          </div>
          <ChevronRight size={14} className={`flex-shrink-0 ${activeView === "account" ? "text-text-secondary" : "text-transparent"}`} />
        </button>
      </div>
    </aside>
  );
}
