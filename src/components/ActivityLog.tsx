"use client";

import { useEffect, useRef } from "react";
import { Search, Mail, Phone, FileText, Headphones, Bot } from "lucide-react";
import type { AgentEvent } from "@/lib/types";

const AGENT_ICONS: Record<string, React.ReactNode> = {
  router: <Bot size={14} />,
  research: <Search size={14} />,
  outreach: <Mail size={14} />,
  sales: <Phone size={14} />,
  admin: <FileText size={14} />,
  support: <Headphones size={14} />,
};

const AGENT_COLORS: Record<string, string> = {
  router: "text-purple-400",
  research: "text-blue-400",
  outreach: "text-amber-400",
  sales: "text-green-400",
  admin: "text-indigo-400",
  support: "text-teal-400",
};

const STATUS_DOT: Record<string, string> = {
  thinking: "bg-amber-400 animate-pulse",
  working: "bg-blue-400 animate-pulse",
  done: "bg-emerald-400",
  error: "bg-rose-400",
  idle: "bg-slate-500",
};

interface ActivityLogProps {
  events: AgentEvent[];
}

export default function ActivityLog({ events }: ActivityLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="px-4 py-3 border-b border-card-border">
        <h3 className="text-sm font-semibold text-text-primary">Activity Log</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[500px]">
        {events.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">
            Waiting for pipeline to start...
          </p>
        )}

        {events.map((event, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${STATUS_DOT[event.status] || STATUS_DOT.idle}`} />
            <span className={`flex-shrink-0 mt-0.5 ${AGENT_COLORS[event.agent] || "text-text-muted"}`}>
              {AGENT_ICONS[event.agent] || <Bot size={14} />}
            </span>
            <div className="flex-1 min-w-0">
              <span className={`font-medium ${AGENT_COLORS[event.agent] || "text-text-muted"}`}>
                {event.agent.charAt(0).toUpperCase() + event.agent.slice(1)}:
              </span>{" "}
              <span className="text-text-secondary">{event.message}</span>
            </div>
            <span className="text-xs text-text-muted flex-shrink-0">
              {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
