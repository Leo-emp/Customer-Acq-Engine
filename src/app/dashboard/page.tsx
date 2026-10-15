"use client";

import { useState, useCallback, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import type { ViewMode } from "@/components/Sidebar";
import AgentPage from "@/components/AgentPage";
import OverviewDashboard from "@/components/OverviewDashboard";
import BrandBrain from "@/components/BrandBrain";
import SetupModal from "@/components/SetupModal";
import type { CompanyProfile } from "@/lib/store";
import { DEMO_MODE, DEMO_BRAND_PROFILE } from "@/lib/demo-data";
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
  // # demo mode: Brand Brain always pre-configured with Salesforce profile
  const [profile, setProfile] = useState<CompanyProfile | null>(() => {
    if (DEMO_MODE) {
      return {
        companyName: DEMO_BRAND_PROFILE.companyName,
        productDescription: DEMO_BRAND_PROFILE.productDescription,
        targetMarket: DEMO_BRAND_PROFILE.targetMarket,
        senderName: "Alex Chen",
        senderEmail: "",
        valueProposition: DEMO_BRAND_PROFILE.valueProposition,
        calendlyUrl: "",
        industry: DEMO_BRAND_PROFILE.industry,
        keyFeatures: DEMO_BRAND_PROFILE.keyFeatures,
        pricing: DEMO_BRAND_PROFILE.pricing,
        tone: DEMO_BRAND_PROFILE.tone,
        websiteUrl: "salesforce.com",
        founded: DEMO_BRAND_PROFILE.founded,
        headquarters: DEMO_BRAND_PROFILE.headquarters,
        ceo: DEMO_BRAND_PROFILE.ceo,
        employees: DEMO_BRAND_PROFILE.employees,
        revenue: DEMO_BRAND_PROFILE.revenue,
        customers: DEMO_BRAND_PROFILE.customers,
        marketCap: DEMO_BRAND_PROFILE.marketCap,
        stockTicker: DEMO_BRAND_PROFILE.stockTicker,
        competitors: DEMO_BRAND_PROFILE.competitors,
        marketPosition: DEMO_BRAND_PROFILE.marketPosition,
        differentiators: DEMO_BRAND_PROFILE.differentiators,
        idealCustomer: DEMO_BRAND_PROFILE.idealCustomer,
        painPoints: DEMO_BRAND_PROFILE.painPoints,
        website: DEMO_BRAND_PROFILE.website,
        annualEvents: DEMO_BRAND_PROFILE.annualEvents,
      } as CompanyProfile;
    }
    return null;
  });
  const [showSetup, setShowSetup] = useState(false);
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
  const [activeView, setActiveView] = useState<ViewMode>("overview");
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
    setActiveView("overview");

    const fullPrompt = profile
      ? `Company: ${profile.companyName}\nIndustry: ${profile.industry}\nProduct: ${profile.productDescription}\nValue Prop: ${profile.valueProposition}\nTarget Market: ${profile.targetMarket}\nKey Features: ${profile.keyFeatures?.join(", ")}\nPricing: ${profile.pricing}\nBrand Tone: ${profile.tone}\nSender: ${profile.senderName}\n\nGoal: ${userPrompt}`
      : userPrompt;

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, profile }),
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

  return (
    <div className="min-h-screen flex">
      {/* setup modal overlay */}
      {showSetup && !profile && (
        <SetupModal
          onComplete={(p) => { setProfile(p); setShowSetup(false); }}
          onSkip={() => {
            setProfile({ companyName: "Demo Corp", productDescription: "AI-powered SaaS platform", targetMarket: "B2B tech companies", senderName: "Alex", senderEmail: "", valueProposition: "Automate customer acquisition with AI", calendlyUrl: "", industry: "Technology", keyFeatures: ["AI Automation", "Lead Generation", "Email Outreach"], pricing: "Starting at $99/month", tone: "Professional and friendly" });
            setShowSetup(false);
          }}
        />
      )}

      {/* sidebar — always visible */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        events={events}
        currentStage={stage}
        companyName={profile?.companyName}
        isRunning={isRunning}
        hasProfile={!!profile}
      />

      {/* main content */}
      <div className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        {/* top bar */}
        <header className="sticky top-0 z-30 bg-space-900/95 backdrop-blur-sm border-b border-card-border">
          <div className="px-6 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-text-primary">
                {activeView === "overview" ? "Dashboard" : activeView === "brandBrain" ? "Brand Brain" : undefined}
              </h1>
              {profile && <p className="text-xs text-text-muted">{profile.companyName} — {profile.valueProposition}</p>}
              {!profile && <p className="text-xs text-text-muted">Set up your Brand Brain to get started</p>}
            </div>
            <div className="flex items-center gap-3">
              {isRunning && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Pipeline Active</span>
                </div>
              )}
              {!profile && (
                <button onClick={() => setActiveView("brandBrain")} className="px-4 py-1.5 bg-brand-blue hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-all cursor-pointer">
                  Setup Brand Brain
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeView === "overview" && (
            <OverviewDashboard
              profile={profile}
              stage={stage}
              isRunning={isRunning}
              events={events}
              prospects={prospects}
              emails={emails}
              callRecord={callRecord}
              onLaunch={handleLaunch}
              onSelectAgent={(role) => setActiveView(role)}
            />
          )}
          {activeView === "brandBrain" && (
            <BrandBrain profile={profile} onUpdateProfile={(p) => { setProfile(p); }} />
          )}
          {activeView !== "overview" && activeView !== "brandBrain" && (
            <AgentPage
              role={activeView}
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
              profile={profile}
              onSelectProspect={(p) => setActiveProspectId(p.id)}
              onCallComplete={handleCallComplete}
              onAddProspects={(p) => setProspects(prev => [...prev, ...p])}
              onAddEmails={(e) => { emailsRef.current = [...emailsRef.current, ...e]; setEmails([...emailsRef.current]); }}
              onAddEvent={(e) => setEvents(prev => [...prev, e])}
            />
          )}
        </main>
      </div>
    </div>
  );
}
