"use client";

import { useState, useCallback, useRef } from "react";
import SetupForm from "@/components/SetupForm";
import Sidebar from "@/components/Sidebar";
import AgentWorkspace from "@/components/AgentWorkspace";
import ActivityLog from "@/components/ActivityLog";
import type { CompanyProfile } from "@/lib/store";
import type {
  PipelineStage,
  AgentEvent,
  AgentRole,
  Prospect,
  EmailDraft,
  CallRecord,
  Invoice,
} from "@/lib/types";

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
  const [activeAgent, setActiveAgent] = useState<AgentRole>("research");
  const [showOverview, setShowOverview] = useState(true);
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
    setShowOverview(true);

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

  const handleSelectAgent = (role: AgentRole) => {
    setActiveAgent(role);
    setShowOverview(false);
  };

  // ── SETUP PHASE ──
  if (!profile) {
    return <SetupForm onComplete={setProfile} />;
  }

  // ── DASHBOARD PHASE ──
  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <Sidebar
        activeAgent={activeAgent}
        onSelectAgent={handleSelectAgent}
        events={events}
        currentStage={stage}
        companyName={profile.companyName}
        isRunning={isRunning}
        onShowOverview={() => setShowOverview(true)}
        showOverview={showOverview}
      />

      {/* main content */}
      <div className="flex-1 ml-64">
        {/* top bar */}
        <header className="sticky top-0 z-30 bg-space-900/95 backdrop-blur-sm border-b border-card-border">
          <div className="px-6 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-text-primary">
                {showOverview ? "Dashboard" : `${activeAgent.charAt(0).toUpperCase() + activeAgent.slice(1)} Agent`}
              </h1>
              <p className="text-xs text-text-muted">{profile.valueProposition}</p>
            </div>

            <div className="flex items-center gap-3">
              {isRunning && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Pipeline Running</span>
                </div>
              )}
              <button
                onClick={() => { setProfile(null); setStage("idle"); setEvents([]); setProspects([]); setEmails([]); setShowOverview(true); }}
                className="text-xs text-text-muted hover:text-text-primary px-3 py-1.5 rounded-lg hover:bg-space-700 transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {showOverview ? (
            /* ── OVERVIEW DASHBOARD ── */
            <div className="space-y-6">
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
                    placeholder={`Find customers for ${profile.productDescription.slice(0, 60)}...`}
                    className="flex-1 bg-transparent text-base px-4 py-3 outline-none placeholder:text-text-muted text-text-primary"
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

              {/* stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Prospects Found" value={prospects.length} icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="text-blue-400" />
                <StatCard label="Emails Sent" value={emails.filter((e) => e.sentAt).length} icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" color="text-amber-400" />
                <StatCard label="Calls Made" value={callRecord ? 1 : 0} icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" color="text-emerald-400" />
                <StatCard label="Deals Closed" value={callRecord?.outcome === "closed" ? 1 : 0} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="text-purple-400" />
              </div>

              {/* agent cards grid — clickable */}
              <div>
                <h2 className="text-sm font-semibold text-text-primary mb-3">AI Agents</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {([
                    { role: "research" as const, name: "Scout", desc: "Research & qualify leads", color: "text-blue-400", gradient: "from-blue-500 to-cyan-500", border: "border-blue-500/30" },
                    { role: "outreach" as const, name: "Reach", desc: "Email & voice outreach", color: "text-amber-400", gradient: "from-amber-500 to-orange-500", border: "border-amber-500/30" },
                    { role: "sales" as const, name: "Closer", desc: "Deal analysis & close", color: "text-emerald-400", gradient: "from-emerald-500 to-green-500", border: "border-emerald-500/30" },
                    { role: "admin" as const, name: "Ops", desc: "Invoice & contracts", color: "text-indigo-400", gradient: "from-indigo-500 to-violet-500", border: "border-indigo-500/30" },
                    { role: "support" as const, name: "Assist", desc: "Customer support", color: "text-teal-400", gradient: "from-teal-500 to-cyan-500", border: "border-teal-500/30" },
                  ]).map((agent) => {
                    const agentEvents = events.filter((e) => e.agent === agent.role);
                    const latestStatus = (agentEvents[agentEvents.length - 1]?.status || "idle") as string;
                    const latestMessage = agentEvents[agentEvents.length - 1]?.message || agent.desc;
                    const isActive = latestStatus === "thinking" || latestStatus === "working";

                    return (
                      <button
                        key={agent.role}
                        onClick={() => handleSelectAgent(agent.role)}
                        className={`glass-card p-4 text-left transition-all cursor-pointer group hover:border-brand-blue/20 ${
                          isActive ? `${agent.border} agent-active` : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white shadow-lg ${
                            isActive ? "" : "opacity-60 group-hover:opacity-100"
                          } transition-opacity`}>
                            {agent.role === "research" ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            : agent.role === "outreach" ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            : agent.role === "sales" ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            : agent.role === "admin" ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            }
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            latestStatus === "done" ? "bg-emerald-400"
                            : isActive ? "bg-blue-400 animate-pulse"
                            : latestStatus === "error" ? "bg-rose-400"
                            : "bg-space-500"
                          }`} />
                        </div>
                        <h4 className="text-sm font-bold text-text-primary mb-0.5">{agent.name}</h4>
                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{latestMessage}</p>
                        {agentEvents.length > 0 && (
                          <div className="mt-2 text-[10px] text-text-muted">{agentEvents.length} events</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* activity log */}
              {events.length > 0 && (
                <ActivityLog events={events} />
              )}

              {/* empty state */}
              {stage === "idle" && (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/15 border border-brand-blue/20 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-brand-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold mb-2 text-text-primary">Ready to acquire customers</h2>
                  <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                    Enter your acquisition goal above and hit Launch. 5 AI agents will execute the full pipeline.
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
            </div>
          ) : (
            /* ── AGENT WORKSPACE ── */
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
              activeAgent={activeAgent}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <svg className={`w-4 h-4 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
