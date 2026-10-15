"use client";

// ── Sign Up Page ──
// # Clean, dark, minimal auth form matching AcquireAI brand

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, Eye, EyeOff, Check } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // # password strength checks
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Contains uppercase", ok: /[A-Z]/.test(password) },
  ];
  const allValid = name.trim() && email.trim() && checks.every((c) => c.ok);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!allValid) return;
    setLoading(true);
    setError("");

    // # hackathon: save user info to localStorage, skip real auth
    try {
      await new Promise((r) => setTimeout(r, 800));
      // # persist name + email so UserAccount tab shows what user entered
      localStorage.setItem("userProfile", JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        joinedAt: new Date().toISOString(),
      }));
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-space-800 border-r border-white/[0.04] items-center justify-center p-16">
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-blue/[0.05] rounded-full blur-[100px]" />

        <div className="relative max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-lg bg-brand-blue flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-semibold text-text-primary">
              Acquire<span className="text-brand-blue">AI</span>
            </span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight mb-6">
            Deploy your AI<br />sales team today.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed mb-10">
            Five autonomous agents that find leads, send emails, make calls,
            generate invoices, and handle support. Set up in under two minutes.
          </p>

          {/* feature list */}
          <div className="space-y-4">
            {[
              "Real B2B leads from Apollo.io",
              "AI-personalized email outreach",
              "Automated voice calls via Twilio",
              "Professional PDF invoices",
              "No credit card required",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <Check size={12} className="text-brand-blue" />
                </div>
                <span className="text-sm text-text-secondary">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[420px]">
          {/* mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-text-primary">
              Acquire<span className="text-brand-blue">AI</span>
            </span>
          </Link>

          <h2 className="text-2xl font-bold text-text-primary mb-1">Create your account</h2>
          <p className="text-sm text-text-muted mb-8">
            Already have an account?{" "}
            <Link href="/signin" className="text-brand-blue hover:underline">Sign in</Link>
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
              />
            </div>

            {/* email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">Work email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
              />
            </div>

            {/* password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* strength indicators */}
              {password.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {checks.map((c) => (
                    <div key={c.label} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${c.ok ? "bg-emerald-500/20" : "bg-white/[0.04]"}`}>
                        {c.ok && <Check size={8} className="text-emerald-400" />}
                      </div>
                      <span className={`text-xs ${c.ok ? "text-emerald-400" : "text-text-muted"}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={!allValid || loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-blue hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-white transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-xs text-text-muted mt-6 text-center leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
