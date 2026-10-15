"use client";

import { useState } from "react";
import { Globe, Loader2, Sparkles, ArrowRight, Check, Building2, Package, Target, Zap, Tag, MessageSquare } from "lucide-react";
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

      if (!res.ok) {
        setError(data.error || "Failed to extract");
        return;
      }

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
    <div className="max-w-3xl mx-auto">
      {/* header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-5">
          <Sparkles size={12} />
          AI-Powered Setup
        </div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Enter your website
        </h2>
        <p className="text-[var(--muted)] text-sm max-w-md mx-auto">
          Our AI will scan your site and extract everything it needs — company details, product info, value proposition, and target market.
        </p>
      </div>

      {/* URL input */}
      {!extracted && (
        <form onSubmit={handleExtract} className="mb-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity blur-sm" />

            <div className="relative flex items-center gap-3 bg-[var(--card)] rounded-2xl p-2">
              <div className="pl-3 text-[var(--muted)]">
                <Globe size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourcompany.com"
                className="flex-1 bg-transparent text-lg px-2 py-3 outline-none placeholder:text-slate-600 text-[var(--foreground)]"
                disabled={isExtracting}
                autoFocus
              />
              <button
                type="submit"
                disabled={!url.trim() || isExtracting}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isExtracting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Extract
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-rose-400 text-sm mt-3 text-center">{error}</p>
          )}

          {isExtracting && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 text-sm text-[var(--muted)]">
                <div className="flex gap-1">
                  <span className="typing-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  <span className="typing-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  <span className="typing-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                </div>
                AI is reading your website and extracting business intelligence...
              </div>
            </div>
          )}
        </form>
      )}

      {/* extracted profile */}
      {extracted && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* success banner */}
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
            <Check size={18} className="text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-emerald-300">
              Successfully extracted business intelligence from <span className="font-medium text-emerald-200">{url}</span>
            </p>
          </div>

          {/* profile cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ProfileCard icon={<Building2 size={16} />} label="Company" value={extracted.companyName} color="text-blue-400" />
            <ProfileCard icon={<Tag size={16} />} label="Industry" value={extracted.industry} color="text-purple-400" />
            <ProfileCard icon={<Package size={16} />} label="Product" value={extracted.productDescription} color="text-amber-400" fullWidth />
            <ProfileCard icon={<Zap size={16} />} label="Value Proposition" value={extracted.valueProposition} color="text-emerald-400" fullWidth />
            <ProfileCard icon={<Target size={16} />} label="Target Market" value={extracted.targetMarket} color="text-rose-400" fullWidth />
            <ProfileCard icon={<MessageSquare size={16} />} label="Brand Tone" value={extracted.tone} color="text-teal-400" />
            <ProfileCard icon={<Tag size={16} />} label="Pricing" value={extracted.pricing} color="text-indigo-400" />
          </div>

          {/* key features */}
          {extracted.keyFeatures.length > 0 && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">Key Features</p>
              <div className="flex flex-wrap gap-2">
                {extracted.keyFeatures.map((feature, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* sender name input */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <label className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 block">
              Your Name (for outreach emails & calls)
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Alex Chen"
              className="w-full bg-slate-900/50 border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-[var(--foreground)] placeholder:text-slate-600"
              autoFocus
            />
          </div>

          {/* launch button */}
          <button
            onClick={handleLaunch}
            disabled={!senderName.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800
              disabled:text-slate-500 text-white font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Launch Acquisition Engine
            <ArrowRight size={18} />
          </button>
        </div>
      )}
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
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 ${fullWidth ? "md:col-span-2" : ""}`}>
      <div className={`flex items-center gap-1.5 text-xs ${color} mb-1.5`}>
        {icon}
        <span className="uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{value}</p>
    </div>
  );
}
