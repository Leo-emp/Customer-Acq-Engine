"use client";

import { useState } from "react";
import { Globe, Loader2, Sparkles, ArrowRight, Check, Building2, Package, Target, Zap, Tag, MessageSquare, Search, Mail, Phone, FileText, Headphones } from "lucide-react";
import type { CompanyProfile } from "@/lib/store";

interface ExtractedProfile {
  companyName: string;
  productDescription: string;
  valueProposition: string;
  targetMarket: string;
  industry: string;
  keyFeatures: string[];
  pricing: string;
  tone: string;
}

interface SetupFormProps {
  onComplete: (profile: CompanyProfile) => void;
}

const AGENTS = [
  { name: "Scout", role: "Research Agent", icon: <Search size={20} />, color: "from-blue-500 to-cyan-500", border: "border-blue-500/30", desc: "Finds & qualifies leads from web search" },
  { name: "Reach", role: "Outreach Agent", icon: <Mail size={20} />, color: "from-amber-500 to-orange-500", border: "border-amber-500/30", desc: "Drafts personalized emails & voice calls" },
  { name: "Closer", role: "Sales Agent", icon: <Phone size={20} />, color: "from-emerald-500 to-green-500", border: "border-emerald-500/30", desc: "Analyzes deals & classifies outcomes" },
  { name: "Ops", role: "Admin Agent", icon: <FileText size={20} />, color: "from-indigo-500 to-violet-500", border: "border-indigo-500/30", desc: "Generates invoices & contracts" },
  { name: "Assist", role: "Support Agent", icon: <Headphones size={20} />, color: "from-teal-500 to-cyan-500", border: "border-teal-500/30", desc: "Post-sale customer support with context" },
];

export default function SetupForm({ onComplete }: SetupFormProps) {
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedProfile | null>(null);
  const [error, setError] = useState("");
  const [senderName, setSenderName] = useState("");

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsExtracting(true);
    setError("");
    setExtracted(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to extract"); return; }
      setExtracted(data.profile);
    } catch {
      setError("Failed to connect. Check the URL and try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleLaunch = () => {
    if (!extracted || !senderName.trim()) return;
    onComplete({
      companyName: extracted.companyName,
      productDescription: extracted.productDescription,
      targetMarket: extracted.targetMarket,
      senderName: senderName.trim(),
      senderEmail: "",
      valueProposition: extracted.valueProposition,
      calendlyUrl: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* header bar */}
      <header className="border-b border-card-border bg-space-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary tracking-tight">AcquireAI</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">Customer Acquisition Engine</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
        {!extracted ? (
          <>
            {/* hero */}
            <div className="text-center mb-10 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-glow text-xs font-medium mb-5">
                <Sparkles size={12} />
                5 AI Agents Working Together
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="text-text-primary">From prompt to </span>
                <span className="glow-text-strong">paying customer</span>
              </h2>
              <p className="text-text-secondary text-base max-w-lg mx-auto mb-8">
                Enter your website URL. Our AI extracts your business profile, then 5 autonomous agents research leads, send emails, make calls, close deals, and handle support.
              </p>

              {/* URL input */}
              <form onSubmit={handleExtract} className="max-w-2xl mx-auto mb-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-blue via-purple-500 to-brand-blue rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity blur-sm" />
                  <div className="relative flex items-center gap-3 glass-card p-2">
                    <div className="pl-3 text-text-muted"><Globe size={20} /></div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="yourcompany.com"
                      className="flex-1 bg-transparent text-lg px-2 py-3 outline-none placeholder:text-text-muted text-text-primary"
                      disabled={isExtracting}
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!url.trim() || isExtracting}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-500 disabled:bg-space-700 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isExtracting ? (<><Loader2 size={18} className="animate-spin" /> Scanning...</>) : (<><Sparkles size={18} /> Extract</>)}
                    </button>
                  </div>
                </div>

                {error && <p className="text-rose-400 text-sm mt-3 text-center">{error}</p>}

                {isExtracting && (
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-3 text-sm text-text-muted">
                      <div className="flex gap-1">
                        <span className="typing-dot w-1.5 h-1.5 bg-brand-blue rounded-full" />
                        <span className="typing-dot w-1.5 h-1.5 bg-brand-blue rounded-full" />
                        <span className="typing-dot w-1.5 h-1.5 bg-brand-blue rounded-full" />
                      </div>
                      AI is reading your website and extracting business intelligence...
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* agent pipeline preview */}
            <div className="mb-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-px flex-1 max-w-[80px] bg-card-border" />
                <span className="text-xs text-text-muted uppercase tracking-widest">The Pipeline</span>
                <div className="h-px flex-1 max-w-[80px] bg-card-border" />
              </div>

              {/* 5 agent cards in a row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {AGENTS.map((agent, i) => (
                  <div key={agent.name} className="relative group">
                    {/* connector arrow (hidden on first card and mobile) */}
                    {i > 0 && (
                      <div className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 text-text-muted">
                        <ArrowRight size={12} />
                      </div>
                    )}
                    <div className={`glass-card p-4 h-full hover:${agent.border} transition-all`}>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white mb-3 shadow-lg`}>
                        {agent.icon}
                      </div>
                      <h4 className="text-sm font-bold text-text-primary">{agent.name}</h4>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">{agent.role}</p>
                      <p className="text-xs text-text-secondary leading-relaxed">{agent.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* how it works */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { step: "01", title: "Enter URL", desc: "AI scans your website and extracts your company profile automatically" },
                { step: "02", title: "Set Your Goal", desc: "Tell the engine who you want to reach — industry, location, use case" },
                { step: "03", title: "Agents Execute", desc: "5 AI agents research, email, call, close, and support — autonomously" },
              ].map((item) => (
                <div key={item.step} className="glass-card p-5 text-center">
                  <div className="text-2xl font-bold text-brand-blue/30 mb-2">{item.step}</div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">{item.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* extracted profile view */
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <Check size={18} className="text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-emerald-300">
                Successfully extracted business intelligence from <span className="font-medium text-emerald-200">{url}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ProfileCard icon={<Building2 size={16} />} label="Company" value={extracted.companyName} color="text-blue-400" />
              <ProfileCard icon={<Tag size={16} />} label="Industry" value={extracted.industry} color="text-purple-400" />
              <ProfileCard icon={<Package size={16} />} label="Product" value={extracted.productDescription} color="text-amber-400" fullWidth />
              <ProfileCard icon={<Zap size={16} />} label="Value Proposition" value={extracted.valueProposition} color="text-emerald-400" fullWidth />
              <ProfileCard icon={<Target size={16} />} label="Target Market" value={extracted.targetMarket} color="text-rose-400" fullWidth />
              <ProfileCard icon={<MessageSquare size={16} />} label="Brand Tone" value={extracted.tone} color="text-teal-400" />
              <ProfileCard icon={<Tag size={16} />} label="Pricing" value={extracted.pricing} color="text-indigo-400" />
            </div>

            {extracted.keyFeatures.length > 0 && (
              <div className="glass-card p-4">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {extracted.keyFeatures.map((feature, i) => (
                    <span key={i} className="px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-xs text-brand-glow">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-card p-4">
              <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">
                Your Name (for outreach emails & calls)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-blue text-text-primary placeholder:text-text-muted"
                autoFocus
              />
            </div>

            <button
              onClick={handleLaunch}
              disabled={!senderName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-blue to-purple-600
                hover:from-blue-500 hover:to-purple-500 disabled:from-space-700 disabled:to-space-700
                disabled:text-text-muted text-white font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Launch Acquisition Engine
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function ProfileCard({ icon, label, value, color, fullWidth }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`glass-card p-4 ${fullWidth ? "md:col-span-2" : ""}`}>
      <div className={`flex items-center gap-1.5 text-xs ${color} mb-1.5`}>
        {icon}
        <span className="uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{value}</p>
    </div>
  );
}
