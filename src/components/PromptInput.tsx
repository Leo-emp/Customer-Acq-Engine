"use client";

import { useState } from "react";
import { Rocket, Loader2 } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isRunning: boolean;
}

export default function PromptInput({ onSubmit, isRunning }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isRunning) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        {/* gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity blur-sm" />

        <div className="relative flex items-center gap-3 bg-[var(--card)] rounded-2xl p-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Find me customers for my Thai restaurant POS system in Bangkok..."
            className="flex-1 bg-transparent text-lg px-4 py-3 outline-none placeholder:text-[var(--muted)] text-[var(--foreground)]"
            disabled={isRunning}
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:opacity-50 text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Running
              </>
            ) : (
              <>
                <Rocket size={18} />
                Launch
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
