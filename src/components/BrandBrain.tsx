"use client";

import { useState, useEffect } from "react";
import { Globe, Loader2, Sparkles, Check, Building2, Package, Target, Zap, Tag, MessageSquare, RefreshCw, Brain, ChevronDown, Users, DollarSign, Trophy, Shield, Calendar, MapPin, User, BarChart3, Crosshair, AlertTriangle } from "lucide-react";
import type { CompanyProfile } from "@/lib/store";
import { DEMO_MODE } from "@/lib/demo-data";

interface ExtractedProfile {
  companyName: string;
  productDescription: string;
  valueProposition: string;
  targetMarket: string;
  industry: string;
  keyFeatures: string[];
  pricing: string;
  tone: string;
  // # extended fields from demo extraction
  founded?: string;
  headquarters?: string;
  ceo?: string;
  employees?: string;
  revenue?: string;
  customers?: string;
  marketCap?: string;
  stockTicker?: string;
  competitors?: string;
  marketPosition?: string;
  differentiators?: string[];
  idealCustomer?: string;
  painPoints?: string[];
  website?: string;
  annualEvents?: string;
}

interface BrandBrainProps {
  profile: CompanyProfile | null;
  onUpdateProfile: (profile: CompanyProfile) => void;
}

export default function BrandBrain({ profile, onUpdateProfile }: BrandBrainProps) {
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedProfile | null>(null);
  const [error, setError] = useState("");
  const [senderName, setSenderName] = useState(profile?.senderName || "");
  const [confirmed, setConfirmed] = useState(!!profile);
  const [isSaving, setIsSaving] = useState(false);

  // # load saved companies from Turso on mount
  const [savedCompanies, setSavedCompanies] = useState<CompanyProfile[]>([]);
  const [showSwitcher, setShowSwitcher] = useState(false);

  useEffect(() => {
    // # fetch all saved company profiles from DB
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (data.companies?.length) {
          setSavedCompanies(data.companies);
          // # if no active profile, auto-load the most recent one
          if (!profile && data.companies.length > 0) {
            onUpdateProfile(data.companies[0]);
            setConfirmed(true);
          }
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsExtracting(true);
    setError("");
    setExtracted(null);
    setConfirmed(false);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to extract"); return; }
      setExtracted(data.profile);

      // # demo mode: auto-activate with default sender name — no manual step needed
      if (DEMO_MODE) {
        const autoProfile: CompanyProfile = {
          companyName: data.profile.companyName,
          productDescription: data.profile.productDescription,
          targetMarket: data.profile.targetMarket,
          senderName: "Alex Chen",
          senderEmail: "",
          valueProposition: data.profile.valueProposition,
          calendlyUrl: "",
          industry: data.profile.industry,
          keyFeatures: data.profile.keyFeatures,
          pricing: data.profile.pricing,
          tone: data.profile.tone,
          websiteUrl: url.trim(),
          founded: data.profile.founded,
          headquarters: data.profile.headquarters,
          ceo: data.profile.ceo,
          employees: data.profile.employees,
          revenue: data.profile.revenue,
          customers: data.profile.customers,
          marketCap: data.profile.marketCap,
          stockTicker: data.profile.stockTicker,
          competitors: data.profile.competitors,
          marketPosition: data.profile.marketPosition,
          differentiators: data.profile.differentiators,
          idealCustomer: data.profile.idealCustomer,
          painPoints: data.profile.painPoints,
          website: data.profile.website,
          annualEvents: data.profile.annualEvents,
        };
        setSenderName("Alex Chen");
        onUpdateProfile(autoProfile);
        setConfirmed(true);
      }
    } catch {
      setError("Failed to connect. Check the URL and try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  // # save profile to Turso DB then update parent state
  const handleConfirm = async () => {
    if (!extracted || !senderName.trim()) return;
    setIsSaving(true);

    const newProfile: CompanyProfile = {
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
      websiteUrl: url.trim(),
    };

    try {
      // # persist to Turso
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });
      const data = await res.json();
      if (data.id) {
        newProfile.id = data.id;
        // # add to saved list
        setSavedCompanies((prev) => [newProfile, ...prev.filter((c) => c.id !== data.id)]);
      }
    } catch {
      // # still activate locally even if DB save fails
    } finally {
      setIsSaving(false);
    }

    onUpdateProfile(newProfile);
    setConfirmed(true);
  };

  // # switch to a different saved company
  const handleSwitchCompany = (company: CompanyProfile) => {
    onUpdateProfile(company);
    setConfirmed(true);
    setShowSwitcher(false);
    setExtracted(null);
  };

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-black/20">
          <Brain size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Brand Brain</h1>
          <p className="text-sm text-text-muted">Your company intelligence — extracted by AI from your website</p>
        </div>
      </div>

      {/* saved companies switcher */}
      {savedCompanies.length > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Saved Companies</p>
              <p className="text-sm text-text-secondary">{savedCompanies.length} company profile{savedCompanies.length !== 1 ? "s" : ""} in database</p>
            </div>
            <button onClick={() => setShowSwitcher(!showSwitcher)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-space-700 hover:bg-space-600 border border-card-border rounded-lg text-xs text-text-secondary transition-colors cursor-pointer">
              <Building2 size={12} />
              Switch Company
              <ChevronDown size={12} className={`transition-transform ${showSwitcher ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showSwitcher && (
            <div className="mt-3 space-y-2 border-t border-card-border pt-3">
              {savedCompanies.map((company) => (
                <button
                  key={company.id || company.companyName}
                  onClick={() => handleSwitchCompany(company)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer ${
                    profile?.id === company.id
                      ? "bg-brand-blue/10 border-brand-blue/30"
                      : "bg-space-800 border-card-border hover:border-brand-blue/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-text-primary">{company.companyName}</span>
                      <span className="text-xs text-text-muted ml-2">{company.industry}</span>
                    </div>
                    {profile?.id === company.id && (
                      <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/10 rounded-full">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1 truncate">{company.valueProposition}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* URL extractor */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-1">Website Scanner</h3>
        <p className="text-xs text-text-muted mb-4">Enter your website URL and our AI will extract your company profile, product info, value proposition, target market, and brand tone.</p>

        <form onSubmit={handleExtract} className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-space-800 rounded-xl border border-card-border px-3 py-2.5">
            <Globe size={16} className="text-text-muted flex-shrink-0" />
            <input
              type="text" value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="yourcompany.com"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted text-text-primary"
              disabled={isExtracting}
            />
          </div>
          <button type="submit" disabled={!url.trim() || isExtracting}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue hover:bg-blue-500 disabled:bg-space-700 disabled:text-text-muted text-white font-medium rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed text-sm whitespace-nowrap">
            {isExtracting ? (<><Loader2 size={16} className="animate-spin" /> Scanning...</>) : (<><Sparkles size={16} /> Extract</>)}
          </button>
        </form>

        {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}

        {isExtracting && (
          <div className="mt-4 flex items-center gap-3 text-sm text-text-muted">
            <div className="flex gap-1">
              <span className="typing-dot w-1.5 h-1.5 bg-brand-blue rounded-full" />
              <span className="typing-dot w-1.5 h-1.5 bg-brand-blue rounded-full" />
              <span className="typing-dot w-1.5 h-1.5 bg-brand-blue rounded-full" />
            </div>
            AI is reading your website and extracting business intelligence...
          </div>
        )}
      </div>

      {/* extracted profile */}
      {extracted && !confirmed && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
            <Check size={16} className="text-emerald-400" />
            <p className="text-sm text-emerald-300">Extracted from <span className="font-medium text-emerald-200">{url}</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ProfileCard icon={<Building2 size={16} />} label="Company" value={extracted.companyName} color="text-blue-400" />
            <ProfileCard icon={<Tag size={16} />} label="Industry" value={extracted.industry} color="text-purple-400" />
            <ProfileCard icon={<Package size={16} />} label="Product" value={extracted.productDescription} color="text-amber-400" span />
            <ProfileCard icon={<Zap size={16} />} label="Value Proposition" value={extracted.valueProposition} color="text-emerald-400" span />
            <ProfileCard icon={<Target size={16} />} label="Target Market" value={extracted.targetMarket} color="text-rose-400" span />
            <ProfileCard icon={<MessageSquare size={16} />} label="Brand Tone" value={extracted.tone} color="text-teal-400" />
            <ProfileCard icon={<Tag size={16} />} label="Pricing" value={extracted.pricing} color="text-indigo-400" />
          </div>

          {extracted.keyFeatures.length > 0 && (
            <div className="glass-card p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Key Features</p>
              <div className="flex flex-wrap gap-2">
                {extracted.keyFeatures.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-xs text-brand-glow">{f}</span>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card p-4">
            <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5 block">Your Name (for outreach)</label>
            <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="e.g. Alex Chen"
              className="w-full bg-space-800 border border-card-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-brand-blue text-text-primary placeholder:text-text-muted" />
          </div>

          <button onClick={handleConfirm} disabled={!senderName.trim() || isSaving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-blue hover:bg-blue-500 disabled:bg-space-700 disabled:text-text-muted text-white font-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed">
            {isSaving ? (<><Loader2 size={16} className="animate-spin" /> Saving to Database...</>) : "Activate Brand Brain"}
          </button>
        </div>
      )}

      {/* active profile display — shows ALL extracted intelligence permanently */}
      {profile && confirmed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Brand Brain Active</span>
              {profile.id && <span className="text-[10px] text-text-muted bg-space-700 px-2 py-0.5 rounded-full">Saved to DB</span>}
            </div>
            <button onClick={() => { setConfirmed(false); setExtracted(null); }}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary cursor-pointer">
              <RefreshCw size={12} /> Re-scan
            </button>
          </div>

          {/* core identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ProfileCard icon={<Building2 size={16} />} label="Company" value={profile.companyName} color="text-blue-400" />
            <ProfileCard icon={<Tag size={16} />} label="Industry" value={profile.industry} color="text-purple-400" />
            <ProfileCard icon={<Package size={16} />} label="Product & Services" value={profile.productDescription} color="text-amber-400" span />
            <ProfileCard icon={<Zap size={16} />} label="Value Proposition" value={profile.valueProposition} color="text-emerald-400" span />
            <ProfileCard icon={<Target size={16} />} label="Target Market" value={profile.targetMarket} color="text-rose-400" span />
            <ProfileCard icon={<MessageSquare size={16} />} label="Brand Tone" value={profile.tone} color="text-teal-400" span />
            <ProfileCard icon={<DollarSign size={16} />} label="Pricing" value={profile.pricing} color="text-indigo-400" span />
          </div>

          {/* key features / products */}
          {profile.keyFeatures?.length > 0 && (
            <div className="glass-card p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5"><Sparkles size={12} className="text-amber-400" /> Products & Key Features</p>
              <div className="space-y-2">
                {profile.keyFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-brand-glow mt-0.5 flex-shrink-0">&#8226;</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* company details — extended intelligence */}
          {(profile.founded || profile.headquarters || profile.ceo || profile.employees) && (
            <div className="glass-card p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5"><Building2 size={12} className="text-blue-400" /> Company Details</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.founded && <DetailItem label="Founded" value={profile.founded} />}
                {profile.headquarters && <DetailItem label="Headquarters" value={profile.headquarters} />}
                {profile.ceo && <DetailItem label="CEO" value={profile.ceo} />}
                {profile.employees && <DetailItem label="Employees" value={profile.employees} />}
                {profile.revenue && <DetailItem label="Revenue" value={profile.revenue} />}
                {profile.customers && <DetailItem label="Customers" value={profile.customers} />}
                {profile.marketCap && <DetailItem label="Market Cap" value={profile.marketCap} />}
                {profile.stockTicker && <DetailItem label="Stock" value={profile.stockTicker} />}
              </div>
            </div>
          )}

          {/* competitive positioning */}
          {(profile.marketPosition || profile.competitors) && (
            <div className="glass-card p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5"><Trophy size={12} className="text-amber-400" /> Competitive Positioning</p>
              {profile.marketPosition && <p className="text-sm text-text-secondary mb-3">{profile.marketPosition}</p>}
              {profile.competitors && (
                <div>
                  <p className="text-xs text-text-muted mb-2">Key Competitors</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.competitors.split(", ").map((c, i) => (
                      <span key={i} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs text-rose-400">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* differentiators */}
          {profile.differentiators && profile.differentiators.length > 0 && (
            <div className="glass-card p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5"><Shield size={12} className="text-emerald-400" /> Key Differentiators</p>
              <div className="space-y-2">
                {profile.differentiators.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ideal customer & pain points */}
          {(profile.idealCustomer || profile.painPoints) && (
            <div className="glass-card p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5"><Crosshair size={12} className="text-rose-400" /> Ideal Customer Profile</p>
              {profile.idealCustomer && <p className="text-sm text-text-secondary mb-3">{profile.idealCustomer}</p>}
              {profile.painPoints && profile.painPoints.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted mb-2 flex items-center gap-1"><AlertTriangle size={10} className="text-amber-400" /> Customer Pain Points</p>
                  <div className="space-y-1.5">
                    {profile.painPoints.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-amber-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* events & web presence */}
          {(profile.website || profile.annualEvents) && (
            <div className="glass-card p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5"><Calendar size={12} className="text-indigo-400" /> Presence & Events</p>
              {profile.website && (
                <div className="mb-2">
                  <span className="text-xs text-text-muted">Website: </span>
                  <span className="text-sm text-brand-glow">{profile.website}</span>
                </div>
              )}
              {profile.annualEvents && (
                <div>
                  <span className="text-xs text-text-muted">Annual Events: </span>
                  <span className="text-sm text-text-secondary">{profile.annualEvents}</span>
                </div>
              )}
            </div>
          )}

          {/* outreach name */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted flex items-center gap-1"><User size={12} /> Outreach Name</span>
              <span className="text-sm font-medium text-text-primary">{profile.senderName}</span>
            </div>
          </div>

          {/* how it works */}
          <div className="glass-card p-5 border-brand-blue/20">
            <h3 className="text-sm font-semibold text-text-primary mb-2">How Brand Brain works</h3>
            <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
              <p>All 6 AI agents use your Brand Brain data to personalize their work:</p>
              <ul className="space-y-1 ml-4">
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">&#8226;</span> Scout searches for prospects matching your target market</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">&#8226;</span> Reach writes emails using your value proposition and brand tone</li>
                <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">&#8226;</span> QA scans emails for compliance, personalization, and tone</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#8226;</span> Closer references your product when analyzing deals</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">&#8226;</span> Ops includes your company details in invoices</li>
                <li className="flex items-start gap-2"><span className="text-teal-400 mt-0.5">&#8226;</span> Assist answers support questions with product knowledge</li>
              </ul>
              <p className="mt-3 pt-3 border-t border-card-border">Company profiles are <span className="text-brand-glow font-medium">persistently stored</span> in Turso database — they survive restarts and are shared across all agents automatically.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileCard({ icon, label, value, color, span }: { icon: React.ReactNode; label: string; value: string; color: string; span?: boolean }) {
  return (
    <div className={`glass-card p-4 ${span ? "md:col-span-2" : ""}`}>
      <div className={`flex items-center gap-1.5 text-xs ${color} mb-1.5`}>
        {icon}
        <span className="uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{value}</p>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-text-muted mb-0.5">{label}</p>
      <p className="text-sm text-text-primary font-medium">{value}</p>
    </div>
  );
}
