"use client";

// ── Pipeline View ──
// # dedicated tab for launching the pipeline and viewing activity logs
// # moved out of overview dashboard to give pipeline its own space

import { Zap, Play, Search, Mail, ShieldCheck, Phone, FileText, ArrowRight } from "lucide-react";
import ActivityLog from "./ActivityLog";
import type { CompanyProfile } from "@/lib/store";
import type { PipelineStage, AgentEvent } from "@/lib/types";

interface PipelineViewProps {
  profile: CompanyProfile | null;
  stage: PipelineStage;
  isRunning: boolean;
  events: AgentEvent[];
  onLaunch: (prompt: string) => void;
}

// # pipeline stage config for the visual flow
const PIPELINE_FLOW = [
  { name: "Scout", icon: <Search size={16} />, color: "from-blue-500 to-cyan-500", stage: "researching" },
  { name: "Reach", icon: <Mail size={16} />, color: "from-amber-500 to-orange-500", stage: "emailing" },
  { name: "QA", icon: <ShieldCheck size={16} />, color: "from-purple-500 to-violet-500", stage: "emailing" },
  { name: "Closer", icon: <Phone size={16} />, color: "from-emerald-500 to-green-500", stage: "calling" },
  { name: "Invoice", icon: <FileText size={16} />, color: "from-indigo-500 to-violet-500", stage: "closing" },
];

const STAGE_ORDER: PipelineStage[] = [
  "idle", "researching", "emailing", "calling", "selling", "closing", "complete",
];

export default function PipelineView({ profile, stage, isRunning, events, onLaunch }: PipelineViewProps) {
  const currentStageIndex = STAGE_ORDER.indexOf(stage);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* # header with status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Launch Pipeline</h2>
          <p className="text-sm text-text-muted mt-1">
            {isRunning
              ? "Pipeline is running \u2014 all 5 agents are working autonomously."
              : "Enter your acquisition goal and let all 5 AI agents handle the rest."}
          </p>
        </div>
        {isRunning && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Pipeline Active</span>
          </div>
        )}
        {stage === "complete" && !isRunning && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Complete</span>
          </div>
        )}
      </div>

      {/* # launch prompt bar */}
      <div className="glass-card p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).elements.namedItem("prompt") as HTMLInputElement;
            if (input.value.trim() && !isRunning) {
              onLaunch(input.value.trim());
              input.value = "";
            }
          }}
          className="flex items-center gap-3"
        >
          <div className="pl-3">
            <Zap size={18} className="text-brand-blue" />
          </div>
          <input
            name="prompt"
            type="text"
            defaultValue="Find me customers"
            placeholder={
              profile
                ? `Find customers for ${profile.productDescription.slice(0, 50)}...`
                : "e.g. Find SaaS companies that need AI automation"
            }
            className="flex-1 bg-transparent text-base px-2 py-3.5 outline-none placeholder:text-text-muted text-text-primary"
            disabled={isRunning}
          />
          <button
            type="submit"
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3.5 bg-brand-blue hover:bg-blue-500 disabled:bg-space-600 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-sm"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play size={14} />
                Launch Pipeline
              </>
            )}
          </button>
        </form>
      </div>

      {/* # pipeline flow visualization */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Pipeline Flow</h3>
        <div className="flex items-center justify-between">
          {PIPELINE_FLOW.map((agent, i) => {
            const agentStageIdx = STAGE_ORDER.indexOf(agent.stage as PipelineStage);
            const isDone = currentStageIndex > agentStageIdx;
            const isActive = agent.stage === stage;

            return (
              <div key={agent.name} className="flex items-center gap-0 flex-1">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isActive
                        ? `bg-gradient-to-br ${agent.color} text-white shadow-lg animate-pulse`
                        : "bg-space-700 text-text-muted border border-card-border"
                    }`}
                  >
                    {agent.icon}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isDone ? "text-emerald-400" : isActive ? "text-brand-blue" : "text-text-muted"
                    }`}
                  >
                    {agent.name}
                  </span>
                </div>
                {i < PIPELINE_FLOW.length - 1 && (
                  <ArrowRight
                    size={14}
                    className={`flex-shrink-0 -mx-1 ${
                      isDone ? "text-emerald-400" : "text-space-600"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* # activity log */}
      <div>
        {events.length > 0 ? (
          <ActivityLog events={events} />
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-3">
              <Zap size={20} className="text-brand-blue" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">No Activity Yet</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Launch a pipeline above to see real-time agent activity. All 5 agents run autonomously in sequence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
