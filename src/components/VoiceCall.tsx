"use client";

import { useState, useCallback } from "react";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import type { Prospect } from "@/lib/types";

interface VoiceCallProps {
  prospect: Prospect | null;
  callScript: string;
  agentId: string;
  onCallComplete: (transcript: string) => void;
}

export default function VoiceCall({ prospect, callScript, agentId, onCallComplete }: VoiceCallProps) {
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<{ role: string; text: string }[]>([]);
  const [duration, setDuration] = useState(0);

  // start the ElevenLabs conversation
  const startCall = useCallback(async () => {
    if (!agentId) {
      // fallback demo mode — simulate a call
      setCallStatus("connecting");
      setTimeout(() => {
        setCallStatus("active");
        // simulate transcript entries
        const demoTranscript = [
          { role: "agent", text: `Hi! This is Alex calling about the email I sent earlier regarding your business. Do you have a quick moment?` },
          { role: "user", text: "Yes, I saw the email. Tell me more about it." },
          { role: "agent", text: `Great! I noticed ${prospect?.fitReason}. Our solution could really help streamline that for you.` },
          { role: "user", text: "That sounds interesting. Can you send me more details?" },
          { role: "agent", text: "Absolutely! I'll send you a link to book a quick 15-minute demo at a time that works. Thanks for your time!" },
        ];

        let i = 0;
        const interval = setInterval(() => {
          if (i < demoTranscript.length) {
            setTranscript((prev) => [...prev, demoTranscript[i]]);
            setDuration((d) => d + 8);
            i++;
          } else {
            clearInterval(interval);
            setCallStatus("ended");
            onCallComplete(
              demoTranscript.map((t) => `${t.role}: ${t.text}`).join("\n")
            );
          }
        }, 2000);
      }, 1500);
      return;
    }

    // real ElevenLabs integration
    try {
      setCallStatus("connecting");

      // dynamically import ElevenLabs — package may not be installed
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const elevenLabsModule = await (Function('return import("@11labs/client")')() as Promise<{ Conversation: { startSession: (config: Record<string, unknown>) => Promise<{ endSession: () => Promise<void> }> } }>).catch(() => null);
      if (!elevenLabsModule) {
        throw new Error("ElevenLabs SDK not available");
      }

      const conversation = await elevenLabsModule.Conversation.startSession({
        agentId,
        overrides: {
          agent: {
            prompt: { prompt: callScript },
            firstMessage: `Hi! This is Alex calling about the email I sent earlier to ${prospect?.contactName}. Do you have a quick moment?`,
          },
        },
        onConnect: () => setCallStatus("active"),
        onDisconnect: () => {
          setCallStatus("ended");
          const fullTranscript = transcript.map((t) => `${t.role}: ${t.text}`).join("\n");
          onCallComplete(fullTranscript);
        },
        onMessage: (message: { source: string; message: string }) => {
          setTranscript((prev) => [...prev, { role: message.source, text: message.message }]);
        },
      });

      (window as unknown as Record<string, unknown>).__acquireAiCall = conversation;
    } catch {
      // if ElevenLabs fails, fall back to demo mode
      setCallStatus("idle");
    }
  }, [agentId, callScript, prospect, onCallComplete, transcript]);

  const endCall = useCallback(async () => {
    const conversation = (window as unknown as Record<string, unknown>).__acquireAiCall;
    if (conversation && typeof (conversation as { endSession: () => Promise<void> }).endSession === "function") {
      await (conversation as { endSession: () => Promise<void> }).endSession();
    }
    setCallStatus("ended");
    const fullTranscript = transcript.map((t) => `${t.role}: ${t.text}`).join("\n");
    onCallComplete(fullTranscript);
  }, [transcript, onCallComplete]);

  if (!prospect) return null;

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
      {/* call header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Phone size={16} className="text-green-400" />
            Voice Call
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {prospect.contactName} at {prospect.companyName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {callStatus === "active" && (
            <span className="text-xs text-[var(--muted)] font-mono">
              {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
            </span>
          )}

          {callStatus === "active" && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* call controls */}
      <div className="px-4 py-4 flex items-center justify-center gap-4">
        {callStatus === "idle" && (
          <button
            onClick={startCall}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-full transition-colors cursor-pointer"
          >
            <Phone size={16} />
            Start Call
          </button>
        )}

        {callStatus === "connecting" && (
          <div className="flex items-center gap-2 text-amber-400">
            <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            Connecting...
          </div>
        )}

        {callStatus === "active" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-colors cursor-pointer ${
                isMuted ? "bg-rose-500/20 text-rose-400" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={endCall}
              className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-colors cursor-pointer"
            >
              <PhoneOff size={16} />
              End Call
            </button>
          </div>
        )}

        {callStatus === "ended" && (
          <span className="text-sm text-[var(--muted)]">Call ended</span>
        )}
      </div>

      {/* transcript */}
      {transcript.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-slate-900/50 rounded-lg p-3 max-h-60 overflow-y-auto space-y-2">
            <p className="text-xs text-[var(--muted)] font-medium mb-2">Transcript</p>
            {transcript.map((entry, i) => (
              <div key={i} className={`text-sm ${entry.role === "agent" ? "text-indigo-300" : "text-slate-300"}`}>
                <span className="font-medium text-xs uppercase text-[var(--muted)]">
                  {entry.role === "agent" ? "AI" : "Prospect"}:
                </span>{" "}
                {entry.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
