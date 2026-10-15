"use client";

import { Search, Mail, Phone, FileText, Headphones, Check } from "lucide-react";
import type { PipelineStage } from "@/lib/types";

const STAGES: { key: PipelineStage; label: string; icon: React.ReactNode }[] = [
  { key: "researching", label: "Research", icon: <Search size={18} /> },
  { key: "emailing", label: "Outreach", icon: <Mail size={18} /> },
  { key: "calling", label: "Call", icon: <Phone size={18} /> },
  { key: "selling", label: "Sales", icon: <FileText size={18} /> },
  { key: "supporting", label: "Support", icon: <Headphones size={18} /> },
];

const STAGE_ORDER: PipelineStage[] = [
  "idle", "researching", "emailing", "calling", "selling", "closing", "supporting", "complete",
];

interface PipelineViewProps {
  currentStage: PipelineStage;
}

export default function PipelineView({ currentStage }: PipelineViewProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {STAGES.map((stage, i) => {
        const stageIndex = STAGE_ORDER.indexOf(stage.key);
        const isActive = stage.key === currentStage || (stage.key === "selling" && currentStage === "closing");
        const isDone = currentIndex > stageIndex;
        const isIdle = currentIndex < stageIndex;

        return (
          <div key={stage.key} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500
                  ${isDone ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : ""}
                  ${isActive ? "bg-brand-blue/20 border-brand-blue text-brand-glow pipeline-glow" : ""}
                  ${isIdle ? "bg-card-bg border-card-border text-text-muted" : ""}
                `}
              >
                {isDone ? <Check size={18} /> : stage.icon}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isDone ? "text-emerald-400" : isActive ? "text-brand-glow" : "text-text-muted"
                }`}
              >
                {stage.label}
              </span>
            </div>

            {i < STAGES.length - 1 && (
              <div className="flex items-center px-1 -mt-6">
                <div
                  className={`w-12 h-0.5 transition-colors duration-500 ${
                    isDone ? "bg-emerald-500" : isActive ? "bg-brand-blue" : "bg-card-border"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
