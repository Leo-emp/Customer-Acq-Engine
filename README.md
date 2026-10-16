# AcquireAI -- Autonomous AI Customer Acquisition Engine

> **Five AI agents that autonomously find leads, draft personalized emails, quality-check outreach, make sales calls, and generate invoices -- end-to-end, in under 90 seconds.**

**Live Demo**: [customer-acq-engine.vercel.app](https://customer-acq-engine.vercel.app)

---

## What It Does

AcquireAI is a fully autonomous B2B customer acquisition platform. You configure your company identity once (Brand Brain), click "Run Pipeline", and five specialized AI agents handle the entire sales funnel without human intervention:

```
Scout (Min - 30 leads) --> Reach (Min - 30 emails) --> QA (Min - 30 scans) --> Closer (AI call) --> Ops (invoice)
```

**Total runtime: ~72 seconds. Zero human intervention.**

---

## The Five Agents

### 1. Scout (Research Agent)
Finds and qualifies B2B leads using real Apollo.io data and AI scoring.

| Tool | What It Does |
|------|-------------|
| **Lead Search** | Queries Apollo.io for verified B2B contacts, AI-scores each lead 0-100 by company fit, tech stack, and buying signals |
| **Competitor Analysis** | Maps competitive landscape with threat levels, strengths/weaknesses, strategic recommendations. Exports as PDF |
| **Industry Research** | Analyzes market size, growth rate, trends, key players, opportunities, and threats. Exports as PDF |
| **Market Mapping** | Calculates TAM/SAM, identifies segments with competition levels, builds buyer personas and positioning map. Exports as PDF |

### 2. Reach (Outreach Agent)
Drafts hyper-personalized cold emails and follow-ups for every lead.

| Mode | What It Does |
|------|-------------|
| **Cold Email** | Select any combination of leads, generates a unique email for each one referencing their specific pain points, tech stack, and industry context |
| **Follow-Up** | Click any previously sent email to generate a contextual follow-up that references the original outreach |

### 3. QA (Email Quality Agent)
Scans every drafted email before it reaches a prospect.

| Verdict | Meaning |
|---------|---------|
| **Approved** (green) | Good personalization, correct tone, compliant -- auto-sent |
| **Needs Personalization** (orange) | Missing company-specific data points -- held for revision |
| **Rewrite Copy** (amber) | Tone or structure issues need fixing |
| **Confidential Flag** (red) | Potential compliance risk detected |

Each verdict includes detailed reasoning and specific improvement suggestions displayed inline.

### 4. Closer (Sales Agent)
Makes AI-powered sales calls and analyzes conversations for deal intelligence.

| Capability | What It Does |
|------------|-------------|
| **AI Voice Call** | Real outbound call via Twilio -- AI handles the full sales conversation, discusses product, handles objections, negotiates |
| **Transcript Analysis** | Pre-loaded with a 4m42s demo call transcript. Click "Analyze Call" for AI deal classification with key insights |
| **6 Quick Actions** | Analyze call transcript, email thread, meeting notes, objection breakdown, win/loss analysis, deal report |

Deal outcomes: `closed`, `interested`, `objection`, `rejected` -- each with summary, next action, and key insights.

### 5. Ops (Admin Agent)
Generates professional invoices and administrative documents.

| Capability | What It Does |
|------------|-------------|
| **Invoice Generation** | AI creates detailed line items from deal parameters (products, quantities, unit prices) |
| **PDF Export** | Professional PDF with itemized table and totals |
| **Prospect Auto-Fill** | Select any prospect to pre-populate invoice details from pipeline data |

---

## Brand Brain

Brand Brain is the centralized company identity that provides consistent context to all agents. Configure it once by:

- **URL Extraction**: Paste any company URL -- AI auto-extracts 25+ profile fields (description, value prop, features, pricing, competitors, market position, etc.)
- **Manual Entry**: Fill in the profile form directly

The demo pre-configures Brand Brain with comprehensive Salesforce company intelligence.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS v4 + custom design tokens (space-900 dark theme) |
| Animation | Framer Motion (page reveals, micro-interactions) |
| AI Model | Google Gemini 2.0 Flash (with retry/backoff wrapper) |
| Lead Data | Apollo.io API (real verified B2B contacts) |
| Email | Gmail API (primary) + Resend (fallback) |
| Voice | Twilio Programmable Voice (fully conversational AI) |
| Database | Turso (libsql) for persistent storage |
| PDF | jsPDF (invoices + 3 report types) |
| Icons | Lucide React (50+ icons) |
| Hosting | Vercel (auto-deploy from GitHub) |

---

## Architecture

```
src/
  app/
    page.tsx                    # Landing page (conversion-optimized, 5-agent hero)
    signin/page.tsx             # Sign in
    signup/page.tsx             # Sign up with password validation
    dashboard/page.tsx          # Main dashboard (SSE pipeline + agent tabs)
    api/
      orchestrate/route.ts      # SSE pipeline (POST=run, PUT=analyze)
      extract/route.ts          # Brand Brain URL extraction
      agents/
        research/route.ts       # Scout (4 tools: leads/competitors/industry/market)
        outreach/route.ts       # Reach + QA (draft-all/followup/qa-scan)
        sales/route.ts          # Closer (transcript analysis)
        admin/route.ts          # Ops (invoice generation)
        call/                   # Twilio voice (initiate/twiml/status/transcript)
  agents/
    orchestrator.ts             # Pipeline orchestration logic
    research.ts                 # Scout agent implementation
    outreach.ts                 # Reach agent implementation
    sales.ts                    # Closer agent implementation
    admin.ts                    # Ops agent implementation
  components/
    Sidebar.tsx                 # Navigation + pipeline progress + agent status
    AgentPage.tsx               # All 5 agent UIs + workspace + event history
    OverviewDashboard.tsx       # Stats + pipeline launch
    BrandBrain.tsx              # Company identity configuration
    UserAccount.tsx             # Account management (profile/plan/usage/API)
    LeadList.tsx                # Lead table with scores
    InvoiceView.tsx             # Invoice display + PDF download
  lib/
    gemini.ts                   # Gemini client (3 retries, exp backoff)
    apollo.ts                   # Apollo.io API client
    twilio.ts                   # Twilio voice client
    pdf.ts                      # jsPDF generators (4 report types)
    demo-data.ts                # Cached demo data (Salesforce scenario)
    demo-pipeline.ts            # Pipeline data (30 emails + 30 QA results)
    types.ts                    # TypeScript type definitions
```

---

## Two Modes: Demo & Live

AcquireAI runs in two modes. Both use the exact same UI, pipeline, and agent architecture — the only difference is where the data comes from.

### Demo Mode (current default)

`DEMO_MODE = true` in `src/lib/demo-data.ts`. No API keys required. Every agent returns cached, pre-built responses so judges and reviewers can experience the full pipeline end-to-end without external dependencies:

- Brand Brain pre-configured with Salesforce company intelligence
- 30 realistic leads across healthcare, finance, manufacturing, retail, tech
- 30 personalized cold emails (one per lead, each referencing specific pain points)
- 30 QA scan results (24 approved, 6 flagged with specific improvement suggestions)
- Full 4m42s AI sales call transcript (Alex Chen + Dr. Rachel Torres)
- Deal analysis with 6 key insights and $250-400K budget confirmation
- Invoice for $233,200 with 6 itemized line items (Sales Cloud + Service Cloud + Einstein AI + implementation + migration + training)

### Live Mode

Set `DEMO_MODE = false` and provide API keys. Every agent calls real external services:

- **Scout**: Queries Apollo.io for verified B2B contacts, Gemini AI scores and qualifies each lead
- **Reach**: Gemini generates unique personalized emails per prospect, sends via Gmail API or Resend
- **QA**: Gemini analyzes each email for personalization quality, tone, and compliance
- **Closer**: Twilio makes real outbound AI voice calls, Gemini analyzes transcripts
- **Invoice**: Gemini generates line items from deal context, jsPDF creates downloadable PDFs

The architecture is identical — demo mode simply swaps API calls for cached data so the product works offline.

---

## Getting Started

```bash
git clone https://github.com/Leo-emp/Customer-Acq-Engine.git
cd Customer-Acq-Engine
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click "Get Started" or go to `/dashboard`.

---

## Environment Variables

```env
GEMINI_API_KEY=                    # Google Gemini
APOLLO_API_KEY=                    # Apollo.io (real leads)
TWILIO_ACCOUNT_SID=                # Twilio voice
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
GOOGLE_CLIENT_ID=                  # Gmail OAuth
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
RESEND_API_KEY=                    # Resend (fallback email)
TURSO_DATABASE_URL=                # Turso database
TURSO_AUTH_TOKEN=
PUBLIC_APP_URL=                    # Webhook URL
```

---

## Deployment

Deployed on Vercel with automatic deployments from `main`.

**Live**: [customer-acq-engine.vercel.app](https://customer-acq-engine.vercel.app)

---

## License

MIT
