# AcquireAI -- Technical Specification

> Autonomous AI Customer Acquisition Engine  
> Version 1.0 | October 2026  
> Live: [customer-acq-engine.vercel.app](https://customer-acq-engine.vercel.app)

---

## 1. System Overview

AcquireAI is a multi-agent AI system that automates the complete B2B customer acquisition funnel. Five specialized agents operate in a sequential pipeline, each consuming the output of the previous agent and producing structured data for the next. A single company configuration (Brand Brain) provides consistent context across all agents.

### 1.1 Problem Statement

B2B customer acquisition is fragmented across 5+ disconnected tools:

| Tool Category | Examples | Cost |
|---------------|----------|------|
| Lead generation | Apollo, ZoomInfo, Clearbit | $50-150/user/mo |
| Email outreach | Outreach, Salesloft, Mailshake | $45-100/user/mo |
| Call intelligence | Gong, Chorus, Otter | $100-200/user/mo |
| CRM | Salesforce, HubSpot | $50-300/user/mo |
| Invoicing | QuickBooks, FreshBooks | $15-55/user/mo |

This creates data silos (lead intelligence doesn't flow into emails), manual handoffs (2-4 hours per prospect), no quality gates (emails go out unchecked), and costs $500-1,500/user/month for the full stack.

### 1.2 Solution

AcquireAI replaces the entire stack with a single platform. One AI configuration provides company context to all agents. Agents pass structured data through the pipeline automatically. A dedicated QA agent gates outreach quality before emails reach prospects.

**Result**: 30 qualified leads researched, emailed, quality-checked, called, and invoiced in under 90 seconds with zero human intervention.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 16 (App Router, React 19, TypeScript) | Full-stack web application |
| Styling | Tailwind CSS v4 | Utility-first styling with custom design tokens |
| Animation | Framer Motion | Page transitions, scroll reveals, micro-interactions |
| AI Model | Google Gemini 2.0 Flash | All agent reasoning, analysis, and generation |
| Lead Data | Apollo.io API | Real verified B2B company + contact data |
| Email (Primary) | Gmail API (OAuth2) | Send personalized outreach via user's Gmail |
| Email (Fallback) | Resend API | Transactional email delivery |
| Voice | Twilio Programmable Voice | Real outbound AI-powered sales calls |
| Database | Turso (libsql) | Persistent lead and deal storage |
| PDF | jsPDF | Invoice, competitor, industry, and market report generation |
| Icons | Lucide React | Consistent icon system (50+ icons used) |
| Hosting | Vercel | Automatic deployments from GitHub |
| Font | Geist (variable weight) | Typography system |

---

## 3. Architecture

### 3.1 Agent Pipeline

```
                     Brand Brain (Company Identity)
                              |
                     +--------v--------+
                     |   Orchestrator   |  POST /api/orchestrate (SSE)
                     +--------+--------+
                              |
         +--------------------+--------------------+
         |                    |                    |
    +----v----+         +-----v-----+        +-----v-----+
    |  Scout  |         |   Reach   |        |    QA     |
    | 4 tools |  -----> | 2 modes   | -----> | 4 verdicts|
    +---------+         +-----------+        +-----+-----+
                                                   |
                                      +------------+
                                      |
                                +-----v-----+    +----------+
                                |  Closer   |    |   Ops    |
                                | call+anlys|    | invoice  |
                                +-----------+    +----------+
```

### 3.2 Data Flow

```
Brand Brain Config (CompanyProfile)
       |
       v
Scout: Apollo.io API --> 30 scored leads (Prospect[])
       |
       v
Reach: Gemini AI + Brand Context --> 30 personalized cold emails (EmailDraft[])
       |
       v
QA: Gemini AI scan --> 30 verdicts with reasons (EmailQAResult[])
       |
       v
Closer: Twilio call + Gemini analysis --> transcript + deal classification (CallRecord)
       |
       v
Ops: Gemini AI + deal params --> invoice with line items + PDF (Invoice)
```

### 3.3 Communication: Server-Sent Events

The pipeline uses SSE for real-time streaming from the orchestrator to the frontend:

| Event Type | Payload | Emitted When |
|------------|---------|--------------|
| `stage_change` | `{ stage: PipelineStage }` | Agent transitions |
| `agent_event` | `{ agent, status, message, timestamp }` | Every agent action |
| `prospects` | `{ prospects: Prospect[] }` | Scout finds leads |
| `email` | `{ email: EmailDraft }` | Each email drafted |
| `call` | `{ call: CallRecord }` | Call analyzed |
| `invoice` | `{ invoice: Invoice }` | Invoice generated |
| `done` | `{}` | Pipeline complete |
| `error` | `{ message: string }` | Error occurred |

---

## 4. Agent Specifications

### 4.1 Scout (Research Agent)

**File**: `src/agents/research.ts`  
**Route**: `POST /api/agents/research`  
**Purpose**: Find and qualify B2B leads matching the company's target market.

**4 Independent Tools**:

| Tool | Action | Input | Output |
|------|--------|-------|--------|
| **Lead Search** | `leads` | Search query + Brand Brain | `Prospect[]` (30 scored leads with verified emails from Apollo.io) |
| **Competitor Analysis** | `competitors` | Brand Brain profile | Competitors with threat levels, strengths, weaknesses, strategic recommendations + PDF |
| **Industry Research** | `industry` | Brand Brain profile | Market size, growth rate, trends, key players, opportunities, threats + PDF |
| **Market Mapping** | `market` | Brand Brain profile | TAM/SAM, segments, buyer personas, positioning map + PDF |

**Lead Scoring**: AI scores each lead 0-100 based on company fit, tech stack alignment, buying signals, and industry relevance.

**PDF Export**: Competitor, industry, and market reports all export as downloadable PDFs via jsPDF.

### 4.2 Reach (Outreach Agent)

**File**: `src/agents/outreach.ts`  
**Route**: `POST /api/agents/outreach`  
**Purpose**: Draft hyper-personalized cold emails and follow-ups for qualified leads.

**2 Modes**:

| Mode | Action | Input | Output |
|------|--------|-------|--------|
| **Cold Email** | `draft-all` | Selected `Prospect[]` + Brand Brain | `EmailDraft[]` (one per lead, referencing specific pain points) |
| **Follow-Up** | `followup` | Original `EmailDraft` + `Prospect` + Brand Brain | Single `EmailDraft` (contextual follow-up) |

**Personalization**: Each email references the prospect's specific company, industry, tech stack, pain points, and recent business events. No templates -- every email is unique.

**Pipeline mode**: Drafts emails for all 30 leads in batches of 5 with progress events.

### 4.3 QA (Email Quality Agent)

**Route**: `POST /api/agents/outreach` (action: `qa-scan`)  
**Purpose**: Quality-gate all drafted emails before sending to prospects.

**4 Verdict Levels**:

| Verdict | Meaning | Typical Rate |
|---------|---------|-------------|
| `approved` | Ready to send -- good personalization, correct tone, compliant | 75-85% |
| `needs_personalization` | Missing company-specific data points | 10-15% |
| `rewrite_copy` | Tone or structure issues need fixing | 3-5% |
| `flagged_confidential` | Potential compliance risk detected | 1-2% |

**Each result includes**:
- Confidence score (0-100)
- Detailed reasoning explaining the verdict
- Specific improvement suggestions (for non-approved emails)
- Auto-sent flag (approved emails are auto-sent)

**Display**: Results shown inline next to each email with color-coded badges (green/amber/orange/red) and expandable feedback sections.

### 4.4 Closer (Sales Agent)

**File**: `src/agents/sales.ts`  
**Route**: `POST /api/agents/sales` (analysis), `POST /api/agents/call` (initiate call)  
**Purpose**: Conduct AI sales calls and analyze conversations for deal classification.

**Capabilities**:

| Capability | Description |
|------------|-------------|
| **AI Voice Call** | Real outbound call via Twilio. AI handles the full sales conversation, discusses product, handles objections. Live transcript polling at 5s intervals. |
| **Transcript Analysis** | Paste any call transcript -- AI extracts deal outcome, key insights, budget signals, competitor mentions, next actions. |
| **Call Script** | AI generates prospect-specific call scripts referencing their company, pain points, and the email sent. |
| **PDF Report** | Auto-generated call analysis report with deal classification. |

**Deal Classification**:

| Outcome | Trigger | Next Action |
|---------|---------|-------------|
| `closed` | Prospect explicitly agreed | Generate invoice |
| `interested` | Positive but wants more info | Send proposal, schedule deep-dive |
| `objection` | Raised specific concerns | Craft targeted response |
| `rejected` | Not interested | Log reason, move to next lead |

**6 Quick Actions**: Analyze call transcript, Analyze email thread, Analyze meeting notes, Objection breakdown, Win/loss analysis, Generate deal report.

### 4.5 Ops (Admin Agent)

**File**: `src/agents/admin.ts`  
**Route**: `POST /api/agents/admin`  
**Purpose**: Generate professional invoices and administrative documents.

**Capabilities**:

| Capability | Description |
|------------|-------------|
| **Invoice Generation** | AI creates detailed line items from deal parameters (products, quantities, unit prices) |
| **PDF Export** | Professional PDF with company branding, itemized table, subtotals, and grand total |
| **Prospect Auto-Fill** | Select any prospect to pre-populate invoice details from pipeline data |
| **6 Quick Actions** | Generate invoice, Download PDF, Edit line items, Create proposal, Deal summary, Revenue report |

---

## 5. Brand Brain

### 5.1 Overview

Brand Brain is the centralized company identity store. Configured once (manually or via URL extraction), it provides consistent context to all AI agents. Persists via localStorage.

### 5.2 URL Extraction

```
POST /api/extract
Body: { url: "salesforce.com" }
Response: Full CompanyProfile (25+ fields auto-populated via Gemini AI)
```

### 5.3 Profile Fields

| Category | Fields |
|----------|--------|
| **Identity** | companyName, productDescription, valueProposition, industry, tone |
| **Market** | targetMarket, idealCustomer, painPoints, differentiators |
| **Products** | keyFeatures (array), pricing |
| **Company Info** | founded, headquarters, ceo, employees, revenue, customers |
| **Financial** | marketCap, stockTicker, revenue |
| **Competitive** | competitors (array), marketPosition |
| **Web** | websiteUrl, website (extended data) |
| **Events** | annualEvents |
| **Outreach** | senderName, senderEmail, calendlyUrl |

---

## 6. Pipeline Orchestration

### 6.1 Stage Sequence

```typescript
type PipelineStage = "idle" | "researching" | "emailing" | "calling" | "selling" | "closing" | "complete";
```

### 6.2 Pipeline Timing

| Stage | Agent | Duration | Actions |
|-------|-------|----------|---------|
| Researching | Scout | ~7s | Analyze market, search Apollo, score 85 leads, return top 30 |
| Emailing | Reach | ~24s | Draft 30 personalized emails in 6 batches of 5 |
| (QA sub-stage) | QA | ~20s | Scan 30 emails in 5 batches of 6, report per-batch findings |
| Calling | Closer | ~8s | Initiate AI call, simulate 4m42s conversation |
| Selling | Closer | ~6s | Analyze transcript, classify deal, extract insights |
| Closing | Ops | ~7s | Generate invoice with line items, create PDF |
| **Total** | | **~72s** | **Full autonomous pipeline** |

### 6.3 Pipeline vs Independent Mode

| Aspect | Pipeline Mode | Independent Mode |
|--------|---------------|------------------|
| Trigger | "Run Pipeline" button | Individual agent quick actions |
| Route | `POST /api/orchestrate` | Individual agent routes |
| Data | `demo-pipeline.ts` (30 emails + 30 QA) | `demo-data.ts` (3 emails + 3 QA) |
| Flow | Sequential, all agents | Single agent execution |
| Sidebar | Shows "Complete" on agents | No sidebar status change |

---

## 7. API Reference

### 7.1 Pipeline

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orchestrate` | Start full pipeline (SSE stream response) |
| `PUT` | `/api/orchestrate` | Analyze call result mid-pipeline (SSE stream) |

### 7.2 Agent Routes

| Method | Endpoint | Actions | Description |
|--------|----------|---------|-------------|
| `POST` | `/api/agents/research` | leads, competitors, industry, market | Scout agent |
| `POST` | `/api/agents/outreach` | draft-all, followup, qa-scan | Reach + QA agents |
| `POST` | `/api/agents/sales` | (transcript analysis) | Closer transcript analysis |
| `POST` | `/api/agents/admin` | generate | Ops invoice generation |
| `POST` | `/api/agents/call` | (initiate call) | Start Twilio voice call |
| `GET` | `/api/agents/call/transcript` | (poll) | Live transcript polling |
| `POST` | `/api/agents/call/twiml` | (webhook) | Twilio TwiML voice instructions |
| `POST` | `/api/agents/call/status` | (webhook) | Call status updates |
| `POST` | `/api/agents/replies` | (webhook) | Email reply handler |

### 7.3 Utility Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/extract` | Brand Brain URL extraction |
| `GET` | `/api/companies` | Company search |
| `POST` | `/api/support` | Support chat |
| `POST` | `/api/webhooks/email` | Email reply webhook |

---

## 8. Data Models

```typescript
interface Prospect {
  id: string;
  companyName: string;
  contactName: string;
  title?: string;
  email: string;
  emailVerified?: boolean;
  website: string;
  industry: string;
  location?: string;
  employeeCount?: number;
  linkedinUrl?: string;
  fitReason: string;
  score: number;                    // 0-100 AI fit score
  status: "new" | "emailed" | "opened" | "called" | "interested" | "closed" | "rejected";
}

interface EmailDraft {
  to: string;
  subject: string;
  body: string;
  prospectId: string;
  sentAt?: string;
  openedAt?: string;
}

interface EmailQAResult {
  emailIndex: number;
  to: string;
  companyName: string;
  verdict: "approved" | "rewrite_copy" | "needs_personalization" | "flagged_confidential";
  confidence: number;               // 0-100
  reason: string;
  suggestions?: string[];
  autoSent?: boolean;
}

interface CallRecord {
  prospectId: string;
  transcript: string;
  duration: number;                  // seconds
  outcome: "closed" | "interested" | "objection" | "rejected";
  summary: string;
  nextAction: string;
}

interface Invoice {
  id: string;
  prospectId: string;
  companyName: string;
  contactName: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  total: number;
  createdAt: string;
}

interface AgentEvent {
  agent: AgentRole;
  status: "idle" | "thinking" | "working" | "done" | "error";
  message: string;
  data?: unknown;
  timestamp: number;
}
```

---

## 9. File Structure

```
src/
  app/
    page.tsx                        Landing page (5-agent hero, How It Works, FAQ)
    signin/page.tsx                 Sign in (redirects to dashboard)
    signup/page.tsx                 Sign up with validation (redirects to dashboard)
    dashboard/page.tsx              Main dashboard (SSE pipeline + all agent tabs)
    layout.tsx                      Root layout (dark theme, Geist font)
    api/
      orchestrate/route.ts          SSE pipeline controller (POST=run, PUT=analyze)
      extract/route.ts              Brand Brain extraction from URL
      companies/route.ts            Company search API
      support/route.ts              Support chat API
      webhooks/email/route.ts       Email reply webhook
      agents/
        research/route.ts           Scout agent API (4 tools)
        outreach/route.ts           Reach + QA agent API
        sales/route.ts              Closer agent API (transcript analysis)
        admin/route.ts              Ops agent API (invoice generation)
        call/route.ts               Initiate outbound Twilio call
        call/twiml/route.ts         TwiML voice instructions
        call/status/route.ts        Call status webhook
        call/transcript/route.ts    Live transcript polling
        replies/route.ts            Email reply handler
  agents/
    orchestrator.ts                 Pipeline orchestration logic
    research.ts                     Scout agent (Apollo + Gemini)
    outreach.ts                     Reach agent (email drafting)
    sales.ts                        Closer agent (deal classification)
    admin.ts                        Ops agent (invoice generation)
    support.ts                      Support chat agent
  components/
    Sidebar.tsx                     Navigation (pipeline progress, agent status, user)
    AgentPage.tsx                   All 5 agent UIs + quick actions + event history
    OverviewDashboard.tsx           Overview with launch button + stats
    BrandBrain.tsx                  Company identity configuration
    UserAccount.tsx                 Account management (profile/plan/usage/API/notifs)
    LeadList.tsx                    Lead table with scores + status badges
    EmailPreview.tsx                Email preview component
    InvoiceView.tsx                 Invoice display with PDF download
    VoiceCall.tsx                   Real-time voice call interface
    SupportChat.tsx                 Support chat interface
    SetupModal.tsx                  Initial setup flow
    SetupForm.tsx                   Brand Brain setup form
  lib/
    gemini.ts                       Gemini client (retry wrapper, 3 attempts, exp backoff)
    apollo.ts                       Apollo.io API client
    gmail.ts                        Gmail API client (OAuth2)
    resend.ts                       Resend email client (fallback)
    twilio.ts                       Twilio voice client
    db.ts                           Turso database client
    pdf.ts                          jsPDF generators (invoice + 3 report types)
    types.ts                        All TypeScript type definitions
    store.ts                        CompanyProfile interface
    brand-context.ts                Brand context builder for AI prompts
    call-context.ts                 Call context store for Twilio conversations
    demo-data.ts                    Pre-cached demo data (Salesforce scenario)
    demo-pipeline.ts                Pipeline-specific demo data (30 emails + 30 QA)
    serper.ts                       Serper search client (alternative to Apollo)
    elevenlabs.ts                   ElevenLabs config (alternative to Twilio)
```

---

## 10. Frontend Architecture

### 10.1 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `space-900` | `#0a0a0f` | Page background |
| `space-800` | `#12121a` | Card backgrounds |
| `space-700` | `#1a1a28` | Elevated surfaces |
| `space-600` | `#252536` | Borders, dividers |
| `space-500` | `#32324a` | Muted elements |
| `brand-blue` | `#3b82f6` | Primary accent |
| `brand-glow` | `#60a5fa` | Active states, highlights |
| `text-primary` | `#f1f5f9` | Headings, emphasis |
| `text-secondary` | `#94a3b8` | Body text |
| `text-muted` | `#64748b` | Labels, timestamps |

**Glass cards**: `bg-white/[0.02]` with `border border-white/[0.06]` and subtle backdrop blur.

### 10.2 Dashboard Layout

```
+--[Sidebar 256px]--+--[Main Content]-------------------------+
|                   |                                          |
| AcquireAI logo    | [Top Bar: title + pipeline indicator]    |
| Company badge     |                                          |
|                   | [Content Area]                           |
| PIPELINE          |   Overview: stats + launch button         |
|  Research   Done  |   Brand Brain: config form                |
|  Outreach   Done  |   Agent Pages: tools + workspace          |
|  Calling    Done  |   User Account: profile/plan/usage        |
|  Sales      Done  |                                          |
|  Invoice    Done  |                                          |
|                   |                                          |
| MAIN              |                                          |
|  Overview         |                                          |
|  Brand Brain      |                                          |
|                   |                                          |
| AI AGENTS         |                                          |
|  Scout       4    |                                          |
|  Reach       8    |                                          |
|  QA         13    |                                          |
|  Closer      6    |                                          |
|  Ops         3    |                                          |
|                   |                                          |
| [User Account]    |                                          |
+-------------------+------------------------------------------+
```

### 10.3 Landing Page Sections

1. **Hero**: Centered headline + CTA + full dashboard preview below
2. **How It Works**: 5-step flow showing each agent's role
3. **Agent Feature Cards**: Detailed capability breakdown for each agent
4. **Differentiators**: Why AcquireAI vs. existing tools (cost, speed, quality)
5. **FAQ**: Accordion with 6 common questions
6. **CTA**: Final sign-up prompt

---

## 11. Demo Mode

`DEMO_MODE = true` (hardcoded in `src/lib/demo-data.ts`)

### 11.1 What Demo Mode Does

- Pre-configures Brand Brain with comprehensive Salesforce company intelligence (25+ fields)
- Returns cached responses from all agent APIs (no API keys required)
- Adds 2-3 second delays between outputs for natural progression feel
- Pre-fills Closer agent with a 4m42s call transcript ready to analyze

### 11.2 Demo Data

| Data | Count | Source File |
|------|-------|-------------|
| Prospect leads | 30 | `demo-data.ts` (DEMO_PROSPECTS) |
| Pipeline cold emails | 30 | `demo-pipeline.ts` (DEMO_PIPELINE_EMAILS) |
| Pipeline QA results | 30 | `demo-pipeline.ts` (DEMO_PIPELINE_QA) |
| Independent cold emails | 3 | `demo-data.ts` (DEMO_EMAILS) |
| Independent QA results | 3 | `demo-data.ts` (DEMO_EMAIL_QA) |
| Sent emails (for follow-ups) | 3 | `demo-data.ts` (DEMO_SENT_EMAILS) |
| Follow-up emails | 3 | `demo-data.ts` (DEMO_FOLLOWUP_EMAILS) |
| Follow-up QA results | 3 | `demo-data.ts` (DEMO_FOLLOWUP_QA) |
| Call transcript | 1 (4m42s) | `demo-data.ts` (DEMO_CALL_TRANSCRIPT) |
| Sales analysis | 1 (6 insights) | `demo-data.ts` (DEMO_SALES_ANALYSIS) |
| Invoice | 1 ($233,200) | `demo-data.ts` (DEMO_INVOICE_FULL) |
| Brand profile | 1 (Salesforce) | `demo-data.ts` (DEMO_BRAND_PROFILE) |

### 11.3 Demo Scenario

The demo uses **Salesforce** as the configured company, selling CRM solutions to enterprise B2B buyers. The pipeline finds 30 leads across healthcare, financial services, manufacturing, retail, and technology sectors. The featured call is with **Dr. Rachel Torres** (CIO at MedVista Health Systems), discussing a $250-400K Health Cloud migration. The resulting invoice is $233,200 for Sales Cloud + Service Cloud + Einstein AI + implementation.

---

## 12. Gemini AI Configuration

```typescript
// Model: gemini-2.0-flash
// Retry: 3 attempts with exponential backoff (2s, 4s, 8s)
// Model fallback: gemini-2.0-flash-lite on repeated failures
// Temperature: 0.7 (balanced creativity/consistency)
// Max tokens: varies by task (1024-4096)
```

Each agent prompt includes:
- System role with agent identity and capabilities
- Full Brand Brain profile for company context
- Structured output format (JSON schema)
- Task-specific instructions

---

## 13. Environment Variables

```env
# AI
GEMINI_API_KEY=                    # Google Gemini API key

# Lead Data
APOLLO_API_KEY=                    # Apollo.io for real B2B leads

# Email
GOOGLE_CLIENT_ID=                  # Gmail OAuth
GOOGLE_CLIENT_SECRET=              # Gmail OAuth
GOOGLE_REFRESH_TOKEN=              # Gmail OAuth
RESEND_API_KEY=                    # Resend (fallback email)

# Voice
TWILIO_ACCOUNT_SID=                # Twilio account
TWILIO_AUTH_TOKEN=                 # Twilio auth
TWILIO_PHONE_NUMBER=               # Outbound phone number

# Database
TURSO_DATABASE_URL=                # Turso libsql URL
TURSO_AUTH_TOKEN=                  # Turso auth token

# App
PUBLIC_APP_URL=                    # Public URL for webhooks
NEXT_PUBLIC_APP_URL=               # Client-side URL
```

---

## 14. Hackathon Scoring Alignment

| Criteria | Weight | Implementation |
|----------|--------|----------------|
| **App Execution** | 40% | 5 fully functional AI agents with 15+ independent tools, autonomous end-to-end pipeline (72s), real API integrations (Apollo.io, Twilio, Gmail, Gemini), SSE streaming, PDF generation for 4 report types, persistent database |
| **Practicality** | 40% | Solves a real $50B+ market problem, replaces 5+ separate tools, configurable for any B2B company via Brand Brain URL extraction, QA agent prevents bad outreach, revenue-generating from day one |
| **Usability & Design** | 10% | Premium dark glass-card UI, intuitive sidebar navigation, one-click autonomous pipeline, responsive design, account management, Framer Motion animations, pipeline progress visualization |
| **Innovation & Ecosystem** | 5% | Multi-agent orchestration (not a chatbot), QA agent as quality gate, Brand Brain auto-extraction from any URL, real-time voice AI with transcript analysis, PDF report generation |
