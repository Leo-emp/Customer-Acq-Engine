"use client";

// ── Sign In Page ──
// # Matching dark auth form, same visual language as signup

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");

    // # hackathon: skip real auth, go straight to dashboard
    try {
      await new Promise((r) => setTimeout(r, 600));
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* subtle background */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-blue/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-9 h-9 rounded-lg bg-brand-blue flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-semibold text-text-primary">
            Acquire<span className="text-brand-blue">AI</span>
          </span>
        </Link>

        {/* card */}
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <h2 className="text-2xl font-bold text-text-primary mb-1 text-center">Welcome back</h2>
          <p className="text-sm text-text-muted mb-8 text-center">
            Sign in to your AcquireAI dashboard
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 transition-all"
              />
            </div>

            {/* password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Password</label>
                <button type="button" className="text-xs text-brand-blue hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={!email.trim() || !password.trim() || loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-blue hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-white transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* demo access */}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl border border-white/[0.08] hover:border-white/[0.15] text-sm font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer"
          >
            Enter Demo Mode
          </button>
        </div>

        <p className="text-sm text-text-muted mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-blue hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
