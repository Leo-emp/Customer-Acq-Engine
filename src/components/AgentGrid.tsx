"use client";

import { Search, Mail, Phone, FileText, Headphones } from "lucide-react";
import type { AgentEvent, AgentRole, AgentStatus } from "@/lib/types";

interface AgentConfig {
  role: AgentRole;
  name: string;
  title: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  bgActive: string;
  description: string;
}

const AGENTS: AgentConfig[] = [
  { role: "research", name: "Scout", title: "Research Agent", icon: <Search size={22} />, gradient: "from-blue-500 to-cyan-500", borderColor: "border-blue-500/40", bgActive: "bg-blue-500/10", description: "Finds and qualifies leads" },
  { role: "outreach", name: "Reach", title: "Outreach Agent", icon: <Mail size={22} />, gradient: "from-amber-500 to-orange-500", borderColor: "border-amber-500/40", bgActive: "bg-amber-500/10", description: "Drafts emails & makes calls" },
  { role: "sales", name: "Closer", title: "Sales Agent", icon: <Phone size={22} />, gradient: "from-emerald-500 to-green-500", borderColor: "border-emerald-500/40", bgActive: "bg-emerald-500/10", description: "Analyzes deals & follows up" },
  { role: "admin", name: "Ops", title: "Admin Agent", icon: <FileText size={22} />, gradient: "from-indigo-500 to-violet-500", borderColor: "border-indigo-500/40", bgActive: "bg-indigo-500/10", description: "Invoices & contracts" },
  { role: "support", name: "Assist", title: "Support Agent", icon: <Headphones size={22} />, gradient: "from-teal-500 to-cyan-500", borderColor: "border-teal-500/40", bgActive: "bg-teal-500/10", description: "Post-sale customer support" },
];

const STATUS_CONFIG: Record<AgentStatus, { label: string; dotClass: string }> = {
  idle: { label: "Standby", dotClass: "bg-slate-500" },
  thinking: { label: "Thinking", dotClass: "bg-amber-400 animate-pulse" },
  working: { label: "Working", dotClass: "bg-blue-400 animate-pulse" },
  done: { label: "Complete", dotClass: "bg-emerald-400" },
  error: { label: "Error", dotClass: "bg-rose-400" },
};

interface AgentGridProps {
  events: AgentEvent[];
}

export default function AgentGrid({ events }: AgentGridProps) {
  const agentStates = AGENTS.map((agent) => {
    const agentEvents = events.filter((e) => e.agent === agent.role);
    const latest = agentEvents[agentEvents.length - 1];
    return {
      ...agent,
      status: (latest?.status || "idle") as AgentStatus,
      message: latest?.message || agent.description,
      eventCount: agentEvents.length,
    };
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {agentStates.map((agent) => {
        const statusConfig = STATUS_CONFIG[agent.status];
        const isActive = agent.status === "thinking" || agent.status === "working";

        return (
          <div
            key={agent.role}
            className={`
              relative rounded-xl border p-4 transition-all duration-500 overflow-hidden
              ${isActive ? `${agent.borderColor} ${agent.bgActive} agent-active` : "border-card-border bg-card-bg"}
              ${agent.status === "done" ? "border-emerald-500/20 bg-emerald-500/5" : ""}
            `}
          >
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-5`} />
            )}

            <div className="relative">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center mb-3
                ${isActive ? `bg-gradient-to-br ${agent.gradient} text-white shadow-lg` : "bg-space-700 text-text-muted"}
                ${agent.status === "done" ? "bg-emerald-500/20 text-emerald-400" : ""}
                transition-all duration-500
              `}>
                {agent.icon}
              </div>

              <h4 className="text-sm font-bold text-text-primary">{agent.name}</h4>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">{agent.title}</p>

              <div className="flex items-center gap-1.5 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                <span className="text-[11px] text-text-muted">{statusConfig.label}</span>
                {agent.eventCount > 0 && (
                  <span className="text-[10px] text-text-muted ml-auto">{agent.eventCount} events</span>
                )}
              </div>

              <p className="text-xs text-text-secondary line-clamp-2 min-h-[2rem] leading-relaxed">
                {agent.message}
              </p>

              {agent.status === "thinking" && (
                <div className="flex gap-1 mt-2">
                  <span className="typing-dot w-1 h-1 bg-text-muted rounded-full" />
                  <span className="typing-dot w-1 h-1 bg-text-muted rounded-full" />
                  <span className="typing-dot w-1 h-1 bg-text-muted rounded-full" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
