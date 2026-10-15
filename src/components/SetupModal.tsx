"use client";

import { useState } from "react";
import { Globe, Loader2, Sparkles, ArrowRight, Check, Building2, Package, Target, Zap, Tag, MessageSquare, X } from "lucide-react";
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

interface SetupModalProps {
  onComplete: (profile: CompanyProfile) => void;
  onSkip: () => void;
}

export default function SetupModal({ onComplete, onSkip }: SetupModalProps) {
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
      industry: extracted.industry,
      keyFeatures: extracted.keyFeatures,
      pricing: extracted.pricing,
      tone: extracted.tone,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card p-6 sm:p-8 relative">
        <button onClick={onSkip} className="absolute top-4 right-4 text-text-muted hover:text-text-primary cursor-pointer">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-glow text-xs font-medium mb-4">
            <Sparkles size={12} /> AI-Powered Setup
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Connect your company</h2>
          <p className="text-text-muted text-sm">Enter your website URL and our AI extracts your business profile automatically.</p>
        </div>

        {!extracted ? (
          <>
            <form onSubmit={handleExtract} className="mb-4">
              <div className="flex items-center gap-3 bg-space-800 rounded-xl border border-card-border p-2">
                <div className="pl-2 text-text-muted"><Globe size={18} /></div>
                <input
                  type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                  placeholder="yourcompany.com"
                  className="flex-1 bg-transparent text-base px-2 py-2.5 outline-none placeholder:text-text-muted text-text-primary"
                  disabled={isExtracting} autoFocus
                />
                <button type="submit" disabled={!url.trim() || isExtracting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-500 disabled:bg-space-700 disabled:text-text-muted text-white font-medium rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed text-sm">
                  {isExtracting ? (<><Loader2 size={16} className="animate-spin" /> Scanning...</>) : (<><Sparkles size={16} /> Extract</>)}
                </button>
              </div>
              {error && <p className="text-rose-400 text-sm mt-3 text-center">{error}</p>}
              {isExtracting && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-3 text-sm text-text-muted">
                    <div className="flex gap-1">
                      <span className="typing-dot w-1.5 h-1.5 bg-brand-blue rounded-full" />
                      <span className="typing-dot w-1.5 h-1.5 bg-brand-blue rounded-full" />
                      <span className="typing-dot w-1.5 h-1.5 bg-brand-blue rounded-full" />
                    </div>
                    Reading your website...
                  </div>
                </div>
              )}
            </form>
            <div className="text-center">
              <button onClick={onSkip} className="text-xs text-text-muted hover:text-text-secondary cursor-pointer">
                Skip — use demo company
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
              <Check size={16} className="text-emerald-400" />
              <p className="text-xs text-emerald-300">Extracted from <span className="font-medium">{url}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <MiniCard icon={<Building2 size={14} />} label="Company" value={extracted.companyName} color="text-blue-400" />
              <MiniCard icon={<Tag size={14} />} label="Industry" value={extracted.industry} color="text-purple-400" />
              <MiniCard icon={<Package size={14} />} label="Product" value={extracted.productDescription} color="text-amber-400" span />
              <MiniCard icon={<Zap size={14} />} label="Value Prop" value={extracted.valueProposition} color="text-emerald-400" span />
              <MiniCard icon={<Target size={14} />} label="Target" value={extracted.targetMarket} color="text-rose-400" span />
              <MiniCard icon={<MessageSquare size={14} />} label="Tone" value={extracted.tone} color="text-teal-400" />
              <MiniCard icon={<Tag size={14} />} label="Pricing" value={extracted.pricing} color="text-indigo-400" />
            </div>

            <div>
              <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Your Name</label>
              <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-blue text-text-primary placeholder:text-text-muted"
                autoFocus />
            </div>

            <button onClick={handleLaunch} disabled={!senderName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-blue hover:bg-blue-500 disabled:bg-space-700 disabled:text-text-muted text-white font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed">
              Launch Engine <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniCard({ icon, label, value, color, span }: { icon: React.ReactNode; label: string; value: string; color: string; span?: boolean }) {
  return (
    <div className={`bg-space-800 border border-card-border rounded-lg p-3 ${span ? "col-span-2" : ""}`}>
      <div className={`flex items-center gap-1 text-[10px] ${color} mb-1`}>{icon}<span className="uppercase tracking-wider font-medium">{label}</span></div>
      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{value}</p>
    </div>
  );
}
