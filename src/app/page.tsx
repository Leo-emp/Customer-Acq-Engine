"use client";

import { useState, useCallback, useRef } from "react";
import SetupForm from "@/components/SetupForm";
import PipelineView from "@/components/PipelineView";
import AgentWorkspace from "@/components/AgentWorkspace";
import ActivityLog from "@/components/ActivityLog";
import type { CompanyProfile } from "@/lib/store";
import type {
  PipelineStage,
  AgentEvent,
  Prospect,
  EmailDraft,
  CallRecord,
  Invoice,
} from "@/lib/types";

// stat card SVG paths
const STAT_ICONS: Record<string, { path: string; color: string }> = {
  prospects: { path: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "text-blue-400" },
  emails: { path: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "text-amber-400" },
  calls: { path: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", color: "text-emerald-400" },
  deals: { path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-purple-400" },
};

export default function Home() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [emails, setEmails] = useState<EmailDraft[]>([]);
  const [callRecord, setCallRecord] = useState<CallRecord | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState("");
  const [activeProspectId, setActiveProspectId] = useState<string>();
  const [callProspect, setCallProspect] = useState<Prospect | null>(null);
  const [callScript, setCallScript] = useState("");
  const [callAgentId, setCallAgentId] = useState("");
  const emailsRef = useRef<EmailDraft[]>([]);

  const handleSSEEvent = useCallback((data: { type: string; payload: Record<string, unknown> }) => {
    switch (data.type) {
      case "stage_change": setStage(data.payload.stage as PipelineStage); break;
      case "agent_event":
        setEvents((prev) => [...prev, { agent: data.payload.agent, status: data.payload.status, message: data.payload.message, timestamp: data.payload.timestamp } as AgentEvent]);
        break;
      case "prospects": setProspects(data.payload.prospects as Prospect[]); break;
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
      case "call": setCallRecord(data.payload.call as CallRecord); break;
      case "invoice":
        setInvoice(data.payload.invoice as Invoice);
        setPdfDataUrl((data.payload.pdfDataUrl as string) || "");
        break;
      case "done": setIsRunning(false); break;
      case "error":
        setEvents((prev) => [...prev, { agent: "router", status: "error", message: data.payload.message as string, timestamp: Date.now() } as AgentEvent]);
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

    const fullPrompt = profile
      ? `Company: ${profile.companyName}\nProduct: ${profile.productDescription}\nValue Prop: ${profile.valueProposition}\nTarget Market: ${profile.targetMarket}\nSender: ${profile.senderName}\n\nGoal: ${userPrompt}`
      : userPrompt;

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      if (!res.ok || !res.body) throw new Error("Pipeline failed");
      await readSSEStream(res.body);
    } catch {
      setEvents((prev) => [...prev, { agent: "router" as const, status: "error" as const, message: "Failed to connect", timestamp: Date.now() }]);
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
        body: JSON.stringify({ prospect: callProspect, transcript, emailBody: emails.find((e) => e.prospectId === callProspect.id)?.body || "", productDescription: prompt }),
      });
      if (res.ok && res.body) await readSSEStream(res.body);
    } finally {
      setIsRunning(false);
    }
  }, [callProspect, emails, prompt, readSSEStream]);

  // ── SETUP PHASE ──
  if (!profile) {
    return <SetupForm onComplete={setProfile} />;
  }

  // ── DASHBOARD PHASE ──
  return (
    <div className="min-h-screen">
      {/* header */}
      <header className="border-b border-card-border sticky top-0 z-50 bg-space-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary tracking-tight">AcquireAI</h1>
              <p className="text-[10px] text-text-muted uppercase tracking-widest">Customer Acquisition Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-text-muted px-2.5 py-1 rounded-lg bg-space-700 border border-card-border">
              {profile.companyName}
            </span>
            {isRunning && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-text-secondary">Running</span>
              </div>
            )}
            <button
              onClick={() => { setProfile(null); setStage("idle"); setEvents([]); setProspects([]); setEmails([]); }}
              className="text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* welcome + prompt */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              <span className="glow-text">{profile.companyName}</span>
            </h1>
            <p className="text-text-secondary text-sm">{profile.valueProposition}</p>
          </div>

          {stage !== "idle" && (
            <div className="glass-card px-5 py-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-text-muted">Pipeline:</span>
                <span className={`font-medium ${isRunning ? "text-brand-glow" : "text-emerald-400"}`}>
                  {isRunning ? stage.charAt(0).toUpperCase() + stage.slice(1) : "Complete"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* prompt input */}
        <div className="glass-card p-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).elements.namedItem("prompt") as HTMLInputElement;
              if (input.value.trim() && !isRunning) {
                handleLaunch(input.value.trim());
                input.value = "";
              }
            }}
            className="flex items-center gap-3"
          >
            <input
              name="prompt"
              type="text"
              placeholder={`Find customers for ${profile.productDescription.slice(0, 50)}...`}
              className="flex-1 bg-transparent text-base sm:text-lg px-4 py-3 outline-none placeholder:text-text-muted text-text-primary"
              disabled={isRunning}
            />
            <button
              type="submit"
              disabled={isRunning}
              className="px-6 py-3 bg-brand-blue hover:bg-blue-500 disabled:bg-space-600 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-sm"
            >
              {isRunning ? "Running..." : "Launch"}
            </button>
          </form>
        </div>

        {/* stat cards (only when pipeline has data) */}
        {prospects.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
            {[
              { key: "prospects", label: "Prospects Found", value: prospects.length },
              { key: "emails", label: "Emails Sent", value: emails.filter((e) => e.sentAt).length },
              { key: "calls", label: "Calls Made", value: callRecord ? 1 : 0 },
              { key: "deals", label: "Deals Closed", value: callRecord?.outcome === "closed" ? 1 : 0 },
            ].map((stat) => {
              const icon = STAT_ICONS[stat.key];
              return (
                <div key={stat.key} className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className={`w-4 h-4 ${icon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
                    </svg>
                    <span className="text-xs text-text-muted">{stat.label}</span>
                  </div>
                  <div className={`text-2xl font-bold ${icon.color}`}>{stat.value}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* pipeline progress */}
        {stage !== "idle" && <PipelineView currentStage={stage} />}

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
              <div className="sticky top-16">
                <ActivityLog events={events} />
              </div>
            </div>
          </div>
        )}

        {/* empty state with example prompts */}
        {stage === "idle" && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-14 h-14 rounded-2xl bg-brand-blue/15 border border-brand-blue/20 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-brand-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2 text-text-primary">Ready to acquire customers</h2>
            <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
              Type your acquisition goal and hit Launch. Our 5 AI agents will handle the rest.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Find 10 restaurants in Bangkok that need a POS system",
                "Find SaaS companies in London looking for DevOps tools",
                "Find e-commerce brands that need better analytics",
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleLaunch(example)}
                  className="glass-card px-4 py-2 text-xs text-text-secondary hover:text-brand-glow hover:border-brand-blue/30 transition-all cursor-pointer"
                >
                  &ldquo;{example}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
