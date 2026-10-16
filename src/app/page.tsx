"use client";

// ── AcquireAI Landing Page ──
// # Editorial, premium dark aesthetic inspired by dotsstudio.io
// # Conversion goal: sign up / start free

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Search,
  Mail,
  Phone,
  FileText,
  Zap,
  Shield,
  BarChart3,
  Clock,
  ChevronDown,
  Menu,
  X,
  Bot,
  Target,
  TrendingUp,
  Users,
  Globe,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

// ── Fade-in wrapper ──
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Navigation ──
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-space-900/90 backdrop-blur-xl border-b border-white/[0.06]" : ""}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Acquire<span className="text-brand-blue">AI</span>
            </span>
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#agents" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Agents</a>
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors">FAQ</a>
          </div>

          {/* desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/signin" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-medium text-white bg-brand-blue hover:bg-blue-500 px-5 py-2.5 rounded-lg transition-all">
              Get Started Free
            </Link>
          </div>

          {/* mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-text-secondary" aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-space-900/98 backdrop-blur-xl border-t border-white/[0.06] px-6 pb-6 pt-4"
        >
          <div className="flex flex-col gap-4">
            <a href="#agents" onClick={() => setOpen(false)} className="text-sm text-text-secondary hover:text-text-primary">Agents</a>
            <a href="#how-it-works" onClick={() => setOpen(false)} className="text-sm text-text-secondary hover:text-text-primary">How It Works</a>
            <a href="#pricing" onClick={() => setOpen(false)} className="text-sm text-text-secondary hover:text-text-primary">Pricing</a>
            <a href="#faq" onClick={() => setOpen(false)} className="text-sm text-text-secondary hover:text-text-primary">FAQ</a>
            <div className="border-t border-white/[0.06] pt-4 flex flex-col gap-3">
              <Link href="/signin" className="text-sm text-text-secondary text-center py-2">Sign In</Link>
              <Link href="/signup" className="text-sm font-medium text-white bg-brand-blue px-5 py-2.5 rounded-lg text-center">Get Started Free</Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// ── Hero ──
function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-20">
      {/* background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* gradient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-blue/[0.05] rounded-full blur-[140px]" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 w-full">
        {/* centered text */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/[0.06] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-xs font-medium text-brand-blue tracking-wide">AI-POWERED ACQUISITION</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] font-bold tracking-tight text-text-primary mb-6"
          >
            Five AI agents.{" "}
            <span className="text-brand-blue">One complete</span>{" "}
            sales pipeline.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10"
          >
            AcquireAI deploys autonomous agents that find your ideal customers,
            write personalized outreach, verify email quality, make sales calls,
            and close deals. From first touch to signed invoice, without the headcount.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-6"
          >
            <Link href="/signup" className="group inline-flex items-center gap-2 bg-brand-blue hover:bg-blue-500 text-white font-medium px-7 py-3.5 rounded-xl text-base transition-all">
              Start Acquiring Customers
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium px-5 py-3.5 text-base transition-colors">
              See How It Works
              <ChevronDown size={16} />
            </a>
          </motion.div>

          {/* trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-6 text-xs text-text-muted"
          >
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-500" /> SOC 2 Ready</span>
            <span className="w-px h-4 bg-white/[0.08]" />
            <span className="flex items-center gap-1.5"><Globe size={14} className="text-brand-blue" /> Real B2B Data</span>
            <span className="w-px h-4 bg-white/[0.08]" />
            <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-400" /> Gemini AI</span>
          </motion.div>
        </div>

        {/* dashboard preview — compact, starts from tabs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 md:mt-16 relative max-w-5xl mx-auto"
        >
          {/* glow behind the card */}
          <div className="absolute -inset-3 bg-brand-blue/[0.04] rounded-3xl blur-2xl" />

          {/* dashboard card — no title bar, starts from agent tabs */}
          <div className="relative bg-space-800 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* agent tabs row */}
            <div className="flex items-center gap-0 border-b border-white/[0.06] overflow-x-auto">
              {[
                { icon: BarChart3, label: "Overview", active: true, color: "text-brand-blue" },
                { icon: Search, label: "Scout", active: false, color: "text-cyan-400" },
                { icon: Mail, label: "Reach", active: false, color: "text-blue-400" },
                { icon: Phone, label: "Closer", active: false, color: "text-violet-400" },
                { icon: FileText, label: "Invoice", active: false, color: "text-amber-400" },
              ].map((tab) => (
                <div
                  key={tab.label}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    tab.active
                      ? "border-brand-blue text-brand-blue bg-brand-blue/[0.04]"
                      : "border-transparent text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <tab.icon size={14} className={tab.active ? tab.color : "text-text-muted"} />
                  {tab.label}
                </div>
              ))}
              <div className="ml-auto pr-4 flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
              </div>
            </div>

            {/* stats row — big impressive numbers */}
            <div className="p-4 md:p-5">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                {[
                  { label: "Leads Found", value: "2,847", sub: "↑ 312 this week", color: "text-cyan-400" },
                  { label: "Emails Sent", value: "18,439", sub: "94.2% delivered", color: "text-blue-400" },
                  { label: "Calls Made", value: "1,206", sub: "68% positive outcome", color: "text-violet-400" },
                  { label: "Deals Closed", value: "142", sub: "$4.7M total revenue", color: "text-emerald-400" },
                  { label: "Pipeline Value", value: "$12.8M", sub: "23 active deals", color: "text-amber-400" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                  >
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className={`text-lg md:text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{stat.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* agent activity feed — compact */}
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Recent Agent Activity</p>
              <div className="space-y-2">
                {[
                  { icon: Search, agent: "Scout", message: "Discovered 48 new enterprise leads in healthcare vertical — 41 verified emails", color: "text-cyan-400", bg: "bg-cyan-400/10", time: "2m ago" },
                  { icon: Mail, agent: "Reach", message: "Batch sent 24 personalized emails to financial services prospects — 3 replies received", color: "text-blue-400", bg: "bg-blue-400/10", time: "5m ago" },
                  { icon: Phone, agent: "Closer", message: "Call with Dr. Torres (MedVista) — outcome: interested, $250-400K budget confirmed", color: "text-violet-400", bg: "bg-violet-400/10", time: "12m ago" },
                  { icon: FileText, agent: "Invoice", message: "Generated 3 invoices totaling $687,400 — all PDFs exported and ready for delivery", color: "text-amber-400", bg: "bg-amber-400/10", time: "18m ago" },
                ].map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.0 + i * 0.12 }}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.03]"
                  >
                    <div className={`w-6 h-6 rounded-md ${event.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <event.icon size={12} className={event.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-text-primary">{event.agent}</span>
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-text-muted ml-auto shrink-0">{event.time}</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed truncate md:whitespace-normal">{event.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-space-900 to-transparent pointer-events-none rounded-b-2xl" />
        </motion.div>
      </div>
    </section>
  );
}

// ── Problem Section ──
function Problem() {
  const problems = [
    {
      stat: "68%",
      label: "of sales reps miss quota every quarter",
      detail: "Manual prospecting and generic outreach burns time without producing results.",
    },
    {
      stat: "23hrs",
      label: "per week spent on non-selling activities",
      detail: "Data entry, research, follow-ups, scheduling, CRM updates. Your team sells 35% of the time.",
    },
    {
      stat: "$200K+",
      label: "annual cost per SDR before closing a deal",
      detail: "Salary, tools, training, management overhead. And turnover averages 34% per year.",
    },
  ];

  return (
    <section className="py-28 md:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-brand-blue uppercase mb-4">The Problem</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl leading-tight">
            Your sales team is drowning in busywork while your pipeline stays empty.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {problems.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all h-full">
                <span className="text-5xl md:text-6xl font-bold text-text-primary tracking-tight">{p.stat}</span>
                <p className="text-base font-medium text-text-primary mt-3 mb-3">{p.label}</p>
                <p className="text-sm text-text-muted leading-relaxed">{p.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Agents Section ──
function Agents() {
  const agents = [
    {
      icon: Search,
      name: "Scout",
      role: "Research Agent",
      color: "text-cyan-400",
      border: "hover:border-cyan-400/20",
      bg: "bg-cyan-400/10",
      description: "Searches Apollo.io for verified B2B contacts, scores leads with AI based on your ideal customer profile, maps competitors, and researches your entire market.",
      capabilities: ["Lead discovery & scoring", "Competitor analysis", "Industry research", "Market mapping & TAM"],
    },
    {
      icon: Mail,
      name: "Reach",
      role: "Outreach Agent",
      color: "text-blue-400",
      border: "hover:border-blue-400/20",
      bg: "bg-blue-400/10",
      description: "Drafts hyper-personalized cold emails using your brand voice and the prospect's context. Sends via Gmail or Resend, tracks opens, and writes follow-ups automatically.",
      capabilities: ["Personalized email drafting", "Bulk send with tracking", "Automated follow-ups", "Brand voice consistency"],
    },
    {
      icon: ShieldCheck,
      name: "QA",
      role: "Email QA Agent",
      color: "text-purple-400",
      border: "hover:border-purple-400/20",
      bg: "bg-purple-400/10",
      description: "Scans every drafted email before sending. Checks personalization depth, copy quality, tone match, and flags confidential data leaks. Approved emails auto-send; flagged ones get specific fix suggestions.",
      capabilities: ["Quality scoring per email", "Confidential data detection", "Personalization audit", "Auto-send approved emails"],
    },
    {
      icon: Phone,
      name: "Closer",
      role: "Sales Agent",
      color: "text-violet-400",
      border: "hover:border-violet-400/20",
      bg: "bg-violet-400/10",
      description: "Makes outbound voice calls via Twilio, conducts the sales conversation with AI, transcribes the call in real-time, and generates a deal analysis with next steps.",
      capabilities: ["AI voice calls", "Deal analysis & scoring", "Transcript generation", "Next-action recommendations"],
    },
    {
      icon: FileText,
      name: "Invoice",
      role: "Invoice Agent",
      color: "text-amber-400",
      border: "hover:border-amber-400/20",
      bg: "bg-amber-400/10",
      description: "Generates professional invoices and proposals, creates downloadable PDFs, tracks deal financials, and handles the operational side of closing so you can focus on selling.",
      capabilities: ["Invoice generation", "PDF export", "Proposal creation", "Revenue tracking"],
    },
  ];

  return (
    <section id="agents" className="py-28 md:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-brand-blue uppercase mb-4">The Agents</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl leading-tight">
            Five autonomous agents that replace your entire outbound stack.
          </h2>
          <p className="text-lg text-text-secondary mt-5 max-w-2xl">
            Each agent is specialized for one stage of customer acquisition.
            Together, they run a complete pipeline from research to revenue, 24/7.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
          {agents.map((agent, i) => (
            <Reveal key={agent.name} delay={i * 0.08}>
              <div className={`group h-full p-7 rounded-2xl bg-white/[0.015] border border-white/[0.05] ${agent.border} transition-all`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-11 h-11 rounded-xl ${agent.bg} flex items-center justify-center`}>
                    <agent.icon size={20} className={agent.color} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{agent.name}</h3>
                    <p className="text-xs text-text-muted">{agent.role}</p>
                  </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-5">
                  {agent.description}
                </p>

                <ul className="space-y-2">
                  {agent.capabilities.map((cap) => (
                    <li key={cap} className="flex items-center gap-2 text-xs text-text-muted">
                      <span className={`w-1 h-1 rounded-full ${agent.color.replace("text-", "bg-")}`} />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* orchestrator card */}
          <Reveal delay={0.4}>
            <div className="group h-full p-7 rounded-2xl bg-brand-blue/[0.04] border border-brand-blue/10 hover:border-brand-blue/20 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-brand-blue/15 flex items-center justify-center">
                  <Bot size={20} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Orchestrator</h3>
                  <p className="text-xs text-brand-blue">Pipeline Brain</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">
                The central intelligence that coordinates all five agents in sequence.
                One prompt triggers the full pipeline: research, outreach, quality checks, calls,
                and operations, streaming real-time progress as each agent completes.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-blue font-medium">
                <Zap size={12} />
                Fully autonomous end-to-end pipeline
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Set up your Brand Brain",
      description: "Enter your company name, product, target market, and value proposition. The AI learns your brand voice, pricing, and ideal customer profile in under two minutes.",
      detail: "Paste your website URL and the AI extracts everything automatically.",
    },
    {
      number: "02",
      title: "Launch the pipeline",
      description: "Type a goal like \"Find CRM buyers in healthcare\" and hit go. The Orchestrator dispatches Scout to search for real leads, then passes qualified contacts to Reach.",
      detail: "Uses Apollo.io for verified, real-world B2B contact data.",
    },
    {
      number: "03",
      title: "Watch agents work in real-time",
      description: "See each agent think, search, draft, and execute. Emails get sent, calls get made, transcripts get generated. You see every step as it happens, streamed live.",
      detail: "Full transparency — no black-box automation.",
    },
    {
      number: "04",
      title: "Close and manage deals",
      description: "Closer analyzes call outcomes with AI. Invoice generates invoices and PDFs. You get a complete pipeline from stranger to signed deal.",
      detail: "Every artifact is downloadable: PDFs, transcripts, deal summaries.",
    },
  ];

  return (
    <section id="how-it-works" className="py-28 md:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-brand-blue uppercase mb-4">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl leading-tight">
            From zero to pipeline in four steps.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-0">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <div className="group grid md:grid-cols-[80px,1fr] gap-6 md:gap-10 py-10 border-b border-white/[0.04] last:border-0">
                <span className="text-5xl font-bold text-white/[0.06] group-hover:text-brand-blue/20 transition-colors leading-none">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-base text-text-secondary leading-relaxed max-w-2xl mb-2">
                    {step.description}
                  </p>
                  <p className="text-sm text-text-muted">{step.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Differentiators ──
function Differentiators() {
  const points = [
    {
      icon: Target,
      title: "Real data, not simulations",
      description: "Scout searches Apollo.io for actual verified B2B contacts. Every email, phone number, and company detail is real, not AI-generated placeholder data.",
    },
    {
      icon: Bot,
      title: "Actual AI agents, not workflows",
      description: "Each agent uses Gemini AI to think, reason, and adapt. Scout scores leads based on your ICP. Reach writes emails that reference specific company details. Closer conducts real phone calls.",
    },
    {
      icon: TrendingUp,
      title: "Full pipeline, not point solution",
      description: "Most tools handle one step. AcquireAI covers research, outreach, quality assurance, calls, and invoicing. One platform replaces your SDR team, email tool, dialer, and invoicing stack.",
    },
    {
      icon: Clock,
      title: "Minutes, not months",
      description: "Traditional sales pipelines take 6-18 months to build. AcquireAI produces qualified leads, sent emails, and scheduled calls within minutes of setup.",
    },
    {
      icon: Users,
      title: "Brand Brain memory",
      description: "Your company profile, tone, pricing, and ideal customer live in a persistent Brand Brain that every agent draws from. Outreach sounds like you, not a robot.",
    },
    {
      icon: BarChart3,
      title: "Complete transparency",
      description: "Watch every agent work in real-time via server-sent events. Read every email before it sends. Review every call transcript. Download every PDF. Nothing happens behind a curtain.",
    },
  ];

  return (
    <section className="py-28 md:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-brand-blue uppercase mb-4">Why AcquireAI</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl leading-tight">
            Not another CRM with AI sprinkled on top.
          </h2>
          <p className="text-lg text-text-secondary mt-5 max-w-2xl">
            This is an autonomous acquisition engine. The agents don&apos;t suggest actions for you to take.
            They take the actions.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-16">
          {points.map((point, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div>
                <point.icon size={22} className="text-brand-blue mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">{point.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{point.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ──
function Pricing() {
  return (
    <section id="pricing" className="py-28 md:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-brand-blue uppercase mb-4">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl leading-tight">
            Start free. Scale when it works.
          </h2>
          <p className="text-lg text-text-secondary mt-5 max-w-2xl">
            Every plan includes all five agents and the full autonomous pipeline.
            The difference is volume.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 mt-16">
          {/* Starter */}
          <Reveal delay={0}>
            <div className="p-8 rounded-2xl bg-white/[0.015] border border-white/[0.05] hover:border-white/[0.1] transition-all">
              <p className="text-sm font-medium text-text-muted mb-1">Starter</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-bold text-text-primary">$0</span>
                <span className="text-sm text-text-muted">/month</span>
              </div>
              <p className="text-sm text-text-secondary mb-6">
                Try the full platform with limited volume. No credit card required.
              </p>
              <ul className="space-y-3 mb-8">
                {["All 5 AI agents", "10 leads per search", "5 emails per day", "1 AI call per day", "Brand Brain setup", "PDF exports"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center py-3 rounded-xl border border-white/[0.1] hover:border-white/[0.2] text-sm font-medium text-text-primary transition-all">
                Get Started Free
              </Link>
            </div>
          </Reveal>

          {/* Pro */}
          <Reveal delay={0.1}>
            <div className="p-8 rounded-2xl bg-brand-blue/[0.04] border border-brand-blue/20 hover:border-brand-blue/30 transition-all relative">
              <div className="absolute -top-3 left-8 px-3 py-1 bg-brand-blue rounded-full text-[10px] font-semibold text-white uppercase tracking-wider">
                Most Popular
              </div>
              <p className="text-sm font-medium text-brand-blue mb-1">Pro</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-bold text-text-primary">$79</span>
                <span className="text-sm text-text-muted">/month</span>
              </div>
              <p className="text-sm text-text-secondary mb-6">
                Full-volume pipeline for growing teams closing real deals.
              </p>
              <ul className="space-y-3 mb-8">
                {["Unlimited lead searches", "Unlimited emails", "50 AI calls per month", "Priority API access", "Advanced deal analytics", "Competitor & market reports", "Email tracking & follow-ups", "Team collaboration"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="w-1 h-1 rounded-full bg-brand-blue" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center py-3 rounded-xl bg-brand-blue hover:bg-blue-500 text-sm font-medium text-white transition-all">
                Start Pro Trial
              </Link>
            </div>
          </Reveal>

          {/* Enterprise */}
          <Reveal delay={0.2}>
            <div className="p-8 rounded-2xl bg-white/[0.015] border border-white/[0.05] hover:border-white/[0.1] transition-all">
              <p className="text-sm font-medium text-text-muted mb-1">Enterprise</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-bold text-text-primary">Custom</span>
              </div>
              <p className="text-sm text-text-secondary mb-6">
                Dedicated infrastructure, custom agents, and white-label deployment.
              </p>
              <ul className="space-y-3 mb-8">
                {["Everything in Pro", "Unlimited AI calls", "Custom agent training", "Dedicated API instance", "SSO & role-based access", "White-label option", "Priority support", "Custom integrations"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="w-1 h-1 rounded-full bg-violet-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:hello@acquireai.com" className="block w-full text-center py-3 rounded-xl border border-white/[0.1] hover:border-white/[0.2] text-sm font-medium text-text-primary transition-all">
                Contact Sales
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ──
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What does AcquireAI actually do?",
      a: "AcquireAI runs five specialized AI agents that handle the entire customer acquisition pipeline. Scout finds and qualifies leads from real B2B databases. Reach writes and sends personalized cold emails. QA scans every email for quality and personalization before sending. Closer makes AI-powered sales calls and analyzes conversations. Invoice generates invoices and proposals. You give it a target market and it runs the full pipeline autonomously.",
    },
    {
      q: "Is the lead data real or AI-generated?",
      a: "Completely real. Scout searches Apollo.io, one of the largest B2B contact databases in the world. Every contact name, email, company, and phone number is a verified, real-world business contact. The AI scores and qualifies these leads based on your ideal customer profile, but the underlying data comes from a live database, not AI generation.",
    },
    {
      q: "Does it actually send emails and make phone calls?",
      a: "Yes. Reach sends emails through Gmail API or Resend (your choice) from your actual email address. Closer makes outbound voice calls through Twilio's telephony network. These are real communications to real people. You can review emails before they send and control call parameters. Nothing fires without your pipeline being active.",
    },
    {
      q: "How is this different from tools like Apollo, Outreach, or Salesloft?",
      a: "Those are point solutions that handle one step and require human operators. Apollo finds leads but doesn't email them. Outreach sends sequences but doesn't research prospects. None of them make phone calls. AcquireAI combines research, outreach, calling, operations, and support into one autonomous pipeline. One prompt replaces five tools and the humans operating them.",
    },
    {
      q: "What AI model powers the agents?",
      a: "Google Gemini. Each agent uses Gemini for reasoning, content generation, and decision-making. Scout uses it to score leads. Reach uses it to write personalized emails based on prospect context. QA uses it to scan emails for quality. Closer uses it to analyze call transcripts. The model runs server-side and your data stays private.",
    },
    {
      q: "Can I customize the agent behavior?",
      a: "Yes. The Brand Brain stores your company name, product description, value proposition, target market, pricing, and tone of voice. Every agent draws from this profile. Emails match your brand voice. Call scripts reference your actual product. Market research focuses on your real industry. Change the Brand Brain and every agent adapts.",
    },
    {
      q: "How long does setup take?",
      a: "Under two minutes. Enter your company URL and the AI extracts your brand profile automatically. Or fill in the fields manually: company name, what you sell, who you sell to, and your value proposition. Once the Brand Brain is set, launch the pipeline with a single prompt.",
    },
    {
      q: "Is my data secure?",
      a: "All data is stored in Turso (encrypted SQLite), API keys are environment variables that never touch the client, and the architecture is SOC 2-ready. No customer data is used for AI model training. Email credentials stay server-side. Call recordings are processed and stored securely.",
    },
  ];

  return (
    <section id="faq" className="py-28 md:py-36 border-t border-white/[0.04]">
      <div className="max-w-[900px] mx-auto px-6 md:px-10">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-brand-blue uppercase mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight">
            Common questions, straight answers.
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-white/[0.05]">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="py-5">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 text-left group cursor-pointer"
                >
                  <span className="text-base font-medium text-text-primary group-hover:text-brand-blue transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`mt-1 shrink-0 text-text-muted transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openIndex === i ? "auto" : 0, opacity: openIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-text-secondary leading-relaxed pt-3 pr-8">
                    {faq.a}
                  </p>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ──
function FinalCTA() {
  return (
    <section className="py-28 md:py-36 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.2em] text-brand-blue uppercase mb-6">Ready?</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-tight max-w-3xl mx-auto">
            Stop hiring SDRs.<br />
            Start deploying agents.
          </h2>
          <p className="text-lg text-text-secondary mt-6 max-w-xl mx-auto">
            Set up your Brand Brain, launch the pipeline, and watch five AI agents
            build your sales pipeline while you focus on closing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link href="/signup" className="group inline-flex items-center gap-2 bg-brand-blue hover:bg-blue-500 text-white font-medium px-8 py-4 rounded-xl text-base transition-all">
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/signin" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium px-6 py-4 text-base transition-colors border border-white/[0.08] hover:border-white/[0.15] rounded-xl">
              Sign In
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Footer ──
function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-[1.5fr,1fr,1fr,1fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-base font-semibold text-text-primary">
                Acquire<span className="text-brand-blue">AI</span>
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              AI-powered customer acquisition engine. Five autonomous agents, one complete pipeline.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">Product</p>
            <ul className="space-y-2.5">
              <li><a href="#agents" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Agents</a></li>
              <li><a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</a></li>
              <li><a href="#faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">Platform</p>
            <ul className="space-y-2.5">
              <li><Link href="/dashboard" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/signup" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Sign Up</Link></li>
              <li><Link href="/signin" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-text-muted">Privacy Policy</span></li>
              <li><span className="text-sm text-text-muted">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">&copy; 2026 AcquireAI. All rights reserved.</p>
          <p className="text-xs text-text-muted">Powered by Gemini AI, Apollo.io, Twilio</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──
export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <Problem />
      <Agents />
      <HowItWorks />
      <Differentiators />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
