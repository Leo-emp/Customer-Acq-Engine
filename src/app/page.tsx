"use client";

import { useState, useCallback, useRef } from "react";
import { Zap, RotateCcw } from "lucide-react";
import SetupForm from "@/components/SetupForm";
import PromptInput from "@/components/PromptInput";
import PipelineView from "@/components/PipelineView";
import AgentGrid from "@/components/AgentGrid";
import ActivityLog from "@/components/ActivityLog";
import AgentWorkspace from "@/components/AgentWorkspace";
import type { CompanyProfile } from "@/lib/store";
import type {
  PipelineStage,
  AgentEvent,
  Prospect,
  EmailDraft,
  CallRecord,
  Invoice,
} from "@/lib/types";

export default function Home() {
  // setup state
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  // pipeline state
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [prompt, setPrompt] = useState("");

  // data
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [emails, setEmails] = useState<EmailDraft[]>([]);
  const [callRecord, setCallRecord] = useState<CallRecord | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string>("");
  const [activeProspectId, setActiveProspectId] = useState<string>();

  // voice call
  const [callProspect, setCallProspect] = useState<Prospect | null>(null);
  const [callScript, setCallScript] = useState("");
  const [callAgentId, setCallAgentId] = useState("");

  const emailsRef = useRef<EmailDraft[]>([]);

  const handleSSEEvent = useCallback((data: { type: string; payload: Record<string, unknown> }) => {
    switch (data.type) {
      case "stage_change":
        setStage(data.payload.stage as PipelineStage);
        break;
      case "agent_event":
        setEvents((prev) => [...prev, {
          agent: data.payload.agent,
          status: data.payload.status,
          message: data.payload.message,
          timestamp: data.payload.timestamp,
        } as AgentEvent]);
        break;
      case "prospects":
        setProspects(data.payload.prospects as Prospect[]);
        break;
      case "email": {
        const email = data.payload.email as EmailDraft;
        emailsRef.current = [...emailsRef.current, email];
        setEmails([...emailsRef.current]);
        break;
      }
      case "call_ready":
        setCallProspect(data.payload.prospect as Prospect);
        setCallScript(data.payload.callScript as string);
        setCallAgentId(data.payload.agentId as string);
        setActiveProspectId((data.payload.prospect as Prospect).id);
        break;
      case "call":
        setCallRecord(data.payload.call as CallRecord);
        break;
      case "invoice":
        setInvoice(data.payload.invoice as Invoice);
        setPdfDataUrl((data.payload.pdfDataUrl as string) || "");
        break;
      case "done":
        setIsRunning(false);
        break;
      case "error":
        setEvents((prev) => [...prev, {
          agent: "router", status: "error",
          message: data.payload.message as string,
          timestamp: Date.now(),
        } as AgentEvent]);
        break;
    }
  }, []);

  const readSSEStream = useCallback(async (body: ReadableStream<Uint8Array>) => {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try { handleSSEEvent(JSON.parse(line.slice(6))); } catch {}
        }
      }
    }
  }, [handleSSEEvent]);

  const handleLaunch = useCallback(async (userPrompt: string) => {
    setStage("idle");
    setIsRunning(true);
    setPrompt(userPrompt);
    setEvents([]);
    setProspects([]);
    setEmails([]);
    emailsRef.current = [];
    setCallRecord(null);
    setInvoice(null);
    setPdfDataUrl("");
    setCallProspect(null);
    setCallScript("");
    setActiveProspectId(undefined);

    try {
      // include company context in the prompt
      const fullPrompt = profile
        ? `Company: ${profile.companyName}\nProduct: ${profile.productDescription}\nValue Prop: ${profile.valueProposition}\nTarget Market: ${profile.targetMarket}\nSender: ${profile.senderName}\n\nGoal: ${userPrompt}`
        : userPrompt;

      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to start pipeline");
      await readSSEStream(res.body);
    } catch {
      setEvents((prev) => [...prev, {
        agent: "router" as const, status: "error" as const,
        message: "Failed to connect to pipeline", timestamp: Date.now(),
      }]);
    } finally {
      setIsRunning(false);
    }
  }, [profile, readSSEStream]);

  const handleCallComplete = useCallback(async (transcript: string) => {
    if (!callProspect) return;
    setIsRunning(true);
    try {
      const res = await fetch("/api/orchestrate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect: callProspect,
          transcript,
          emailBody: emails.find((e) => e.prospectId === callProspect.id)?.body || "",
          productDescription: prompt,
        }),
      });
      if (res.ok && res.body) await readSSEStream(res.body);
    } finally {
      setIsRunning(false);
    }
  }, [callProspect, emails, prompt, readSSEStream]);

  const handleReset = () => {
    setProfile(null);
    setStage("idle");
    setIsRunning(false);
    setEvents([]);
    setProspects([]);
    setEmails([]);
    emailsRef.current = [];
    setCallRecord(null);
    setInvoice(null);
    setPdfDataUrl("");
    setCallProspect(null);
  };

  // ── RENDER ──

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      {/* subtle grid bg */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative">
        {/* header */}
        <header className="border-b border-[var(--border)] backdrop-blur-sm bg-[var(--background)]/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight">AcquireAI</h1>
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest">Customer Acquisition Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {profile && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-400">
                    {profile.companyName}
                  </span>
                </div>
              )}

              {stage !== "idle" && (
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-400 animate-pulse" : "bg-emerald-500"}`} />
                  <span className="text-xs text-[var(--muted)]">
                    {isRunning ? "Running" : "Complete"}
                  </span>
                </div>
              )}

              {profile && (
                <button onClick={handleReset} className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer" title="Start over">
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* PHASE 1: Setup */}
          {!profile && (
            <div className="py-8">
              <SetupForm onComplete={setProfile} />
            </div>
          )}

          {/* PHASE 2: Dashboard */}
          {profile && (
            <div className="space-y-6">
              {/* prompt input */}
              <PromptInput onSubmit={handleLaunch} isRunning={isRunning} />

              {/* agent grid — always visible once pipeline starts */}
              {stage !== "idle" && (
                <>
                  <PipelineView currentStage={stage} />
                  <AgentGrid events={events} />
                </>
              )}

              {/* agent workspace + activity log */}
              {stage !== "idle" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <AgentWorkspace
                      events={events}
                      prospects={prospects}
                      emails={emails}
                      callRecord={callRecord}
                      invoice={invoice}
                      pdfDataUrl={pdfDataUrl}
                      callProspect={callProspect}
                      callScript={callScript}
                      callAgentId={callAgentId}
                      activeProspectId={activeProspectId}
                      productDescription={prompt}
                      onSelectProspect={(p) => setActiveProspectId(p.id)}
                      onCallComplete={handleCallComplete}
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <div className="sticky top-20">
                      <ActivityLog events={events} />
                    </div>
                  </div>
                </div>
              )}

              {/* empty state */}
              {stage === "idle" && (
                <div className="text-center py-16">
                  <p className="text-[var(--muted)] text-sm">
                    Type your acquisition goal above and hit Launch. For example:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {[
                      "Find 10 restaurants in Bangkok that need a POS system",
                      "Find SaaS companies in London looking for DevOps tools",
                      "Find e-commerce brands that need better analytics",
                    ].map((example, i) => (
                      <button
                        key={i}
                        onClick={() => handleLaunch(example)}
                        disabled={isRunning}
                        className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-xs text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
                      >
                        &ldquo;{example}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
