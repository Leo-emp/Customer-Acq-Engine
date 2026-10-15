"use client";

// ── User Account Management Tab ──
// # Shows user profile, plan, usage stats, and settings
// # Pre-populated in demo mode with realistic data

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Building2,
  CreditCard,
  BarChart3,
  Shield,
  Bell,
  LogOut,
  Check,
  Crown,
  Zap,
  ArrowUpRight,
  Copy,
  Key,
} from "lucide-react";

// # user profile shape stored in localStorage
interface UserProfile {
  name: string;
  email: string;
  company: string;
  role: string;
  avatar: string; // # initials-based avatar
  plan: "free" | "pro" | "enterprise";
  joinedAt: string;
}

// # usage stats for the current billing period
interface UsageStats {
  leadsFound: number;
  leadsLimit: number;
  emailsSent: number;
  emailsLimit: number;
  callsMade: number;
  callsLimit: number;
  invoicesGenerated: number;
  invoicesLimit: number;
  aiCreditsUsed: number;
  aiCreditsLimit: number;
}

// # demo user profile — what judges see
const DEMO_USER: UserProfile = {
  name: "Alex Chen",
  email: "alex.chen@salesforce.com",
  company: "Salesforce",
  role: "VP of Sales",
  avatar: "AC",
  plan: "pro",
  joinedAt: "2026-10-15",
};

// # demo usage stats — shows realistic activity
const DEMO_USAGE: UsageStats = {
  leadsFound: 30,
  leadsLimit: 500,
  emailsSent: 24,
  emailsLimit: 1000,
  callsMade: 1,
  callsLimit: 100,
  invoicesGenerated: 1,
  invoicesLimit: 50,
  aiCreditsUsed: 847,
  aiCreditsLimit: 10000,
};

// # plan details for the pricing cards
const PLANS = [
  {
    name: "Free",
    key: "free" as const,
    price: "$0",
    period: "/month",
    features: ["50 leads/month", "100 emails/month", "5 AI calls", "Basic analytics", "Email support"],
    color: "text-text-secondary",
    border: "border-white/[0.06]",
    bg: "bg-white/[0.02]",
  },
  {
    name: "Pro",
    key: "pro" as const,
    price: "$79",
    period: "/month",
    features: ["500 leads/month", "1,000 emails/month", "100 AI calls", "Advanced analytics", "Priority support", "Custom Brand Brain", "API access"],
    color: "text-brand-blue",
    border: "border-brand-blue/30",
    bg: "bg-brand-blue/[0.05]",
    popular: true,
  },
  {
    name: "Enterprise",
    key: "enterprise" as const,
    price: "$299",
    period: "/month",
    features: ["Unlimited leads", "Unlimited emails", "Unlimited calls", "Custom AI models", "Dedicated CSM", "SSO & SAML", "SLA guarantee", "White-label option"],
    color: "text-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-400/[0.05]",
  },
];

export default function UserAccount() {
  // # load user from localStorage or fall back to demo
  const [user, setUser] = useState<UserProfile>(DEMO_USER);
  const [usage] = useState<UsageStats>(DEMO_USAGE);
  const [activeSection, setActiveSection] = useState<"profile" | "plan" | "usage" | "api" | "notifications">("profile");
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // # load persisted user data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  // # save profile changes
  const handleSave = () => {
    try {
      localStorage.setItem("userProfile", JSON.stringify(user));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // # copy API key to clipboard (demo key)
  const handleCopyKey = () => {
    navigator.clipboard.writeText("acq_sk_live_demo_7f8a9b2c3d4e5f6g7h8i9j0k");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // # usage bar helper — returns percentage and color
  const usageBar = (used: number, limit: number) => {
    const pct = Math.min((used / limit) * 100, 100);
    const color = pct > 80 ? "bg-rose-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500";
    return { pct, color };
  };

  // # section nav items
  const sections = [
    { key: "profile" as const, label: "Profile", icon: <User size={16} /> },
    { key: "plan" as const, label: "Plan & Billing", icon: <CreditCard size={16} /> },
    { key: "usage" as const, label: "Usage", icon: <BarChart3 size={16} /> },
    { key: "api" as const, label: "API Keys", icon: <Key size={16} /> },
    { key: "notifications" as const, label: "Notifications", icon: <Bell size={16} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Account Settings</h2>
          <p className="text-sm text-text-muted mt-1">Manage your profile, plan, and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {/* # plan badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            user.plan === "enterprise" ? "bg-amber-400/10 border border-amber-400/20" :
            user.plan === "pro" ? "bg-brand-blue/10 border border-brand-blue/20" :
            "bg-white/[0.04] border border-white/[0.06]"
          }`}>
            <Crown size={14} className={
              user.plan === "enterprise" ? "text-amber-400" :
              user.plan === "pro" ? "text-brand-blue" : "text-text-muted"
            } />
            <span className={`text-xs font-medium capitalize ${
              user.plan === "enterprise" ? "text-amber-400" :
              user.plan === "pro" ? "text-brand-blue" : "text-text-secondary"
            }`}>
              {user.plan} Plan
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* left nav */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  activeSection === s.key
                    ? "bg-white/[0.06] border border-white/[0.08] text-text-primary font-medium"
                    : "text-text-muted hover:text-text-secondary hover:bg-white/[0.02]"
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}

            {/* # sign out button at bottom */}
            <div className="pt-4 mt-4 border-t border-white/[0.06]">
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* right content */}
        <div className="flex-1 min-w-0">
          {/* ═══ PROFILE SECTION ═══ */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              {/* # avatar + name card */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-blue/20">
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{user.name}</h3>
                    <p className="text-sm text-text-muted">{user.role} at {user.company}</p>
                    <p className="text-xs text-text-muted mt-0.5">Member since {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                  </div>
                </div>

                {/* # editable fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value, avatar: e.target.value.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Company</label>
                    <input
                      type="text"
                      value={user.company}
                      onChange={(e) => setUser({ ...user, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Role</label>
                    <input
                      type="text"
                      value={user.role}
                      onChange={(e) => setUser({ ...user, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                </div>

                {/* # save button */}
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-500 text-white text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
                  >
                    {saved ? <><Check size={14} /> Saved</> : "Save Changes"}
                  </button>
                  {saved && <span className="text-xs text-emerald-400">Profile updated successfully</span>}
                </div>
              </div>

              {/* # security section */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={18} className="text-text-secondary" />
                  <h3 className="text-sm font-semibold text-text-primary">Security</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div>
                      <p className="text-sm text-text-primary">Password</p>
                      <p className="text-xs text-text-muted">Last changed 3 days ago</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-text-secondary hover:text-text-primary hover:border-white/[0.15] transition-all cursor-pointer">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-text-primary">Two-Factor Authentication</p>
                      <p className="text-xs text-emerald-400">Enabled via authenticator app</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10">
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ PLAN & BILLING SECTION ═══ */}
          {activeSection === "plan" && (
            <div className="space-y-6">
              {/* # current plan highlight */}
              <div className="p-6 rounded-2xl bg-brand-blue/[0.05] border border-brand-blue/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Crown size={18} className="text-brand-blue" />
                      <h3 className="text-lg font-semibold text-text-primary">Pro Plan</h3>
                    </div>
                    <p className="text-sm text-text-muted">$79/month — billed monthly. Next invoice: Nov 15, 2026</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-text-secondary hover:text-text-primary hover:border-white/[0.15] transition-all cursor-pointer">
                    Manage Billing
                  </button>
                </div>
              </div>

              {/* # plan comparison */}
              <div className="grid grid-cols-3 gap-4">
                {PLANS.map((plan) => (
                  <div
                    key={plan.key}
                    className={`p-5 rounded-2xl border relative ${
                      plan.key === user.plan ? plan.border + " " + plan.bg : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-blue text-white text-[10px] font-medium">
                        Most Popular
                      </div>
                    )}
                    {plan.key === user.plan && (
                      <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-medium">
                        Current
                      </div>
                    )}
                    <h4 className={`text-sm font-semibold mb-1 ${plan.color}`}>{plan.name}</h4>
                    <div className="flex items-baseline gap-0.5 mb-4">
                      <span className="text-2xl font-bold text-text-primary">{plan.price}</span>
                      <span className="text-xs text-text-muted">{plan.period}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-text-secondary">
                          <Check size={12} className={plan.key === user.plan ? "text-emerald-400" : "text-text-muted"} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {plan.key !== user.plan && (
                      <button className={`w-full mt-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        plan.key === "enterprise"
                          ? "bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20"
                          : "bg-white/[0.04] border border-white/[0.08] text-text-secondary hover:text-text-primary hover:border-white/[0.15]"
                      }`}>
                        {plan.key === "enterprise" ? "Contact Sales" : plan.key === "free" ? "Downgrade" : "Upgrade"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ USAGE SECTION ═══ */}
          {activeSection === "usage" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-text-primary">Current Billing Period</h3>
                  <span className="text-xs text-text-muted">Oct 15 — Nov 15, 2026</span>
                </div>

                {/* # usage bars */}
                <div className="space-y-5">
                  {[
                    { label: "Leads Found", used: usage.leadsFound, limit: usage.leadsLimit, icon: <User size={14} /> },
                    { label: "Emails Sent", used: usage.emailsSent, limit: usage.emailsLimit, icon: <Mail size={14} /> },
                    { label: "AI Calls Made", used: usage.callsMade, limit: usage.callsLimit, icon: <Zap size={14} /> },
                    { label: "Invoices Generated", used: usage.invoicesGenerated, limit: usage.invoicesLimit, icon: <CreditCard size={14} /> },
                    { label: "AI Credits Used", used: usage.aiCreditsUsed, limit: usage.aiCreditsLimit, icon: <BarChart3 size={14} /> },
                  ].map((item) => {
                    const { pct, color } = usageBar(item.used, item.limit);
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-text-muted">{item.icon}</span>
                            <span className="text-sm text-text-primary">{item.label}</span>
                          </div>
                          <span className="text-xs text-text-muted">
                            {item.used.toLocaleString()} / {item.limit.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${color} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* # quick stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Response Rate", value: "34%", change: "+8%", positive: true },
                  { label: "Avg. Deal Size", value: "$233,200", change: "+12%", positive: true },
                  { label: "Pipeline Value", value: "$1.2M", change: "+23%", positive: true },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-xs text-text-muted mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-text-primary">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight size={12} className={stat.positive ? "text-emerald-400" : "text-rose-400"} />
                      <span className={`text-xs ${stat.positive ? "text-emerald-400" : "text-rose-400"}`}>{stat.change} this month</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ API KEYS SECTION ═══ */}
          {activeSection === "api" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-text-primary mb-1">API Keys</h3>
                <p className="text-xs text-text-muted mb-6">Use these keys to integrate AcquireAI with your existing tools</p>

                {/* # live key */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-sm text-text-primary font-medium">Live Key</span>
                    </div>
                    <span className="text-[10px] text-text-muted">Created Oct 15, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded-lg bg-space-800 text-xs text-text-secondary font-mono">
                      acq_sk_live_••••••••••••••••7h8i9j0k
                    </code>
                    <button
                      onClick={handleCopyKey}
                      className="p-2 rounded-lg border border-white/[0.08] hover:border-white/[0.15] text-text-muted hover:text-text-primary transition-all cursor-pointer"
                    >
                      {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* # test key */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-sm text-text-primary font-medium">Test Key</span>
                    </div>
                    <span className="text-[10px] text-text-muted">Created Oct 15, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded-lg bg-space-800 text-xs text-text-secondary font-mono">
                      acq_sk_test_••••••••••••••••3d4e5f6g
                    </code>
                    <button className="p-2 rounded-lg border border-white/[0.08] hover:border-white/[0.15] text-text-muted hover:text-text-primary transition-all cursor-pointer">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <button className="mt-4 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-text-secondary hover:text-text-primary hover:border-white/[0.15] transition-all cursor-pointer">
                  + Generate New Key
                </button>
              </div>

              {/* # API docs link */}
              <div className="p-5 rounded-2xl bg-brand-blue/[0.05] border border-brand-blue/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-1">API Documentation</h4>
                    <p className="text-xs text-text-muted">Integrate lead generation, email outreach, and call scheduling into your workflow</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-500 text-white text-sm font-medium transition-all cursor-pointer">
                    View Docs <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ NOTIFICATIONS SECTION ═══ */}
          {activeSection === "notifications" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-text-primary mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: "Pipeline Completion", desc: "Get notified when a full pipeline run finishes", enabled: true },
                    { label: "New Leads Found", desc: "Alert when new high-score leads are discovered", enabled: true },
                    { label: "Email Responses", desc: "Notification when a prospect replies to your outreach", enabled: true },
                    { label: "Call Summaries", desc: "Receive AI-generated call summary after each call", enabled: true },
                    { label: "Invoice Payments", desc: "Alert when a prospect pays an invoice", enabled: false },
                    { label: "Weekly Digest", desc: "Summary of all pipeline activity sent every Monday", enabled: true },
                    { label: "Usage Alerts", desc: "Warning when approaching plan limits", enabled: true },
                  ].map((notif) => (
                    <div key={notif.label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                      <div>
                        <p className="text-sm text-text-primary">{notif.label}</p>
                        <p className="text-xs text-text-muted mt-0.5">{notif.desc}</p>
                      </div>
                      {/* # toggle switch */}
                      <button className={`relative w-10 h-6 rounded-full transition-all cursor-pointer ${
                        notif.enabled ? "bg-brand-blue" : "bg-white/[0.08]"
                      }`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                          notif.enabled ? "left-5" : "left-1"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* # delivery channels */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Delivery Channels</h3>
                <div className="space-y-3">
                  {[
                    { channel: "Email", detail: user.email, enabled: true },
                    { channel: "Slack", detail: "Not connected", enabled: false },
                    { channel: "Webhook", detail: "Not configured", enabled: false },
                  ].map((ch) => (
                    <div key={ch.channel} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${ch.enabled ? "bg-emerald-400" : "bg-space-500"}`} />
                        <div>
                          <p className="text-sm text-text-primary">{ch.channel}</p>
                          <p className="text-xs text-text-muted">{ch.detail}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-text-secondary hover:text-text-primary hover:border-white/[0.15] transition-all cursor-pointer">
                        {ch.enabled ? "Configure" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
