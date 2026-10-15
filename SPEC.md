# AcquireAI — Full Build Specification

## What This Is

An AI-powered customer acquisition engine. User types a goal like "Find me customers for my Thai restaurant POS system" and 5 AI agents autonomously research leads, send personalized emails, make warm voice calls, close deals, generate invoices, and provide post-sale support.

**Hackathon project. Must be demo-ready by Oct 16, 2pm.**

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **AI:** Google Gemini 2.5 Flash (all agent reasoning)
- **Search:** Serper.dev API (lead research)
- **Email:** Resend API (send + webhook tracking)
- **Voice:** ElevenLabs Conversational AI (warm calls to prospects)
- **PDF:** jspdf (invoice generation)
- **Icons:** lucide-react
- **Animation:** framer-motion
- **Fonts:** Geist Sans + Geist Mono (included by Next.js)

---

## Environment Variables (.env.local)

```
GEMINI_API_KEY=
SERPER_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=AcquireAI <onboarding@resend.dev>
ELEVENLABS_API_KEY=
ELEVENLABS_AGENT_ID=
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=
```

---

## Architecture Overview

```
┌──────────────────────────────────────────────────┐
│                   DASHBOARD UI                    │
│  Prompt input → Pipeline visualization → Agent   │
│  cards → Lead list → Email → Call → Invoice      │
└─────────────────────┬────────────────────────────┘
                      │ SSE stream
┌─────────────────────▼────────────────────────────┐
│              ORCHESTRATOR (API route)             │
│  /api/orchestrate — manages pipeline state,      │
│  dispatches agents in sequence, streams events   │
└───┬──────┬──────┬──────┬──────┬──────────────────┘
    │      │      │      │      │
┌───▼──┐┌──▼───┐┌─▼──┐┌─▼──┐┌──▼───┐
│RSRCH ││OUTRCH││SALE││ADMN││SUPRT │
│Agent ││Agent ││Agnt││Agnt││Agent │
└──────┘└──────┘└────┘└────┘└──────┘
```

---

## Pipeline Flow (Step by Step)

### Stage 1: RESEARCHING
**Agent:** Research Agent
**Input:** User's prompt (e.g., "Find customers for my restaurant POS in Bangkok")
**Process:**
1. Generate 3-4 search queries from the prompt using Gemini
2. Run searches via Serper API
3. Gemini analyzes results, extracts and scores prospects
**Output:** Array of `Prospect` objects (company, contact, email, website, score, fit reason)

### Stage 2: EMAILING
**Agent:** Outreach Agent
**Input:** Prospect list + user's product/service description
**Process:**
1. For each prospect, Gemini drafts a personalized email referencing their specific business
2. Send via Resend API
3. Resend webhook tracks opens → POST /api/webhooks/email
**Output:** Array of `EmailDraft` objects with send status

### Stage 3: CALLING (triggered by email open webhook)
**Agent:** Outreach Agent (voice module)
**Input:** Prospect data + email that was sent
**Process:**
1. Gemini generates a call script personalized to the prospect
2. ElevenLabs Conversational AI makes the call
3. The call references the email: "Hi, I sent you an email earlier about..."
4. ElevenLabs widget embedded in dashboard for live call
**Output:** Call transcript + prospect response

### Stage 4: SELLING
**Agent:** Sales Agent
**Input:** Call transcript + email thread
**Process:**
1. Gemini analyzes the call transcript to classify outcome:
   - CLOSED: prospect agreed → trigger Admin Agent
   - INTERESTED: wants more info → draft follow-up with Calendly link
   - OBJECTION: has concerns → craft response addressing objection
   - REJECTED: not interested → log reason, move on
2. If interested: send Calendly booking link email
**Output:** `CallRecord` with outcome + next action

### Stage 5: CLOSING
**Agent:** Admin Agent
**Input:** Closed deal data (prospect info + agreed terms)
**Process:**
1. Generate invoice PDF with jspdf
2. Generate contract summary
3. "Send" to client (show in UI)
4. Update pipeline status
**Output:** `Invoice` object + PDF

### Stage 6: SUPPORTING
**Agent:** Support Agent
**Input:** Customer question (chat interface)
**Process:**
1. Gemini-powered chat with context about the customer's deal
2. Answers onboarding questions, product help, issues
**Output:** Chat responses

---

## File Structure

```
src/
├── lib/
│   ├── types.ts          ✅ DONE — all TypeScript interfaces
│   ├── gemini.ts         ✅ DONE — Gemini client (agentThink, agentThinkJSON)
│   ├── serper.ts         ✅ DONE — Serper search client
│   ├── resend.ts         ✅ DONE — Resend email client + HTML formatter
│   ├── elevenlabs.ts     🔨 TODO — ElevenLabs Conversational AI config
│   └── pdf.ts            🔨 TODO — jspdf invoice generator
│
├── agents/
│   ├── orchestrator.ts   🔨 TODO — Pipeline state machine, dispatches agents
│   ├── research.ts       🔨 TODO — Lead research agent
│   ├── outreach.ts       🔨 TODO — Email drafting + voice call agent
│   ├── sales.ts          🔨 TODO — Deal classification + follow-up agent
│   ├── admin.ts          🔨 TODO — Invoice + contract generation agent
│   └── support.ts        🔨 TODO — Customer support chat agent
│
├── app/
│   ├── layout.tsx        ✅ EXISTS — needs dark theme update
│   ├── page.tsx          🔨 TODO — Main dashboard page
│   ├── globals.css       ✅ EXISTS — needs dark theme styles
│   ├── api/
│   │   ├── orchestrate/
│   │   │   └── route.ts  🔨 TODO — SSE endpoint, runs full pipeline
│   │   ├── webhooks/
│   │   │   └── email/
│   │   │       └── route.ts  🔨 TODO — Resend webhook handler
│   │   └── support/
│   │       └── route.ts  🔨 TODO — Support chat endpoint
│   └── globals.css
│
└── components/
    ├── Dashboard.tsx     🔨 TODO — Main layout with all sections
    ├── PromptInput.tsx   🔨 TODO — Goal input field
    ├── PipelineView.tsx  🔨 TODO — Visual pipeline with 5 stages
    ├── AgentCard.tsx     🔨 TODO — Individual agent status card
    ├── ActivityLog.tsx   🔨 TODO — Real-time event stream
    ├── LeadList.tsx      🔨 TODO — Prospect table with scores
    ├── EmailPreview.tsx  🔨 TODO — Email draft viewer
    ├── VoiceCall.tsx     🔨 TODO — ElevenLabs call widget
    ├── InvoiceView.tsx   🔨 TODO — PDF invoice preview
    └── SupportChat.tsx   🔨 TODO — Chat interface
```

---

## Agent Specifications

### Research Agent (`src/agents/research.ts`)

**System prompt:**
```
You are a B2B lead research specialist. Given a business description and target customer profile, generate search queries and analyze results to find qualified prospects.

For each prospect, extract:
- Company name
- Contact person name (if available, otherwise "Decision Maker")
- Email (if available, otherwise construct likely email from domain)
- Website URL
- Industry
- Why they're a good fit (specific to the user's offering)
- Score (1-100 based on fit quality)

Return as JSON array of prospects, sorted by score descending.
```

**Input:** User prompt + search results from Serper
**Output:** `Prospect[]`

### Outreach Agent (`src/agents/outreach.ts`)

**System prompt:**
```
You are an expert cold outreach copywriter. Write personalized, concise sales emails that:
- Reference something specific about the prospect's business
- Clearly state the value proposition in 1-2 sentences
- Include a clear call to action
- Sound human, not templated
- Are under 150 words
- No emoji, no excessive exclamation marks

Also generate a voice call script for warm follow-up calls that references the email sent.
```

**Input:** Prospect data + user's product description
**Output:** `EmailDraft` + call script string

### Sales Agent (`src/agents/sales.ts`)

**System prompt:**
```
You are a senior sales analyst. Analyze call transcripts and email replies to classify deal outcomes.

Classify as:
- CLOSED: prospect explicitly agreed to buy/sign/proceed
- INTERESTED: positive but wants more info, a meeting, or to discuss further
- OBJECTION: raised specific concerns (price, timing, competition, etc.)
- REJECTED: clearly not interested

For INTERESTED: draft a follow-up email with a Calendly meeting link.
For OBJECTION: draft a response addressing their specific concern.
For CLOSED: summarize the deal terms for the admin agent.

Return JSON with: outcome, summary, nextAction, followUpEmail (if needed).
```

**Input:** Call transcript + email thread + prospect data
**Output:** `CallRecord`

### Admin Agent (`src/agents/admin.ts`)

**System prompt:**
```
You are a business operations assistant. When a deal is closed:
1. Generate invoice line items based on the deal discussion
2. Create a professional contract summary
3. Prepare onboarding instructions for the customer

Return JSON with: invoiceItems (array of {description, quantity, unitPrice}), contractSummary, onboardingSteps.
```

**Input:** Deal summary + prospect data
**Output:** Invoice data for PDF generation

### Support Agent (`src/agents/support.ts`)

**System prompt:**
```
You are a friendly, knowledgeable customer support assistant. You have context about the customer's deal, their business, and the product they purchased.

Answer questions about:
- Onboarding and setup
- Product features and usage
- Billing and invoicing
- Technical issues

Be concise, helpful, and proactive. If you can't answer something, say so clearly.
```

**Input:** Customer question + deal context
**Output:** Chat response string

---

## API Route Specifications

### POST /api/orchestrate

**Request body:** `{ prompt: string }`
**Response:** Server-Sent Events (SSE) stream

Each SSE event is JSON:
```typescript
{
  type: "agent_event" | "stage_change" | "prospects" | "email" | "call" | "invoice" | "done" | "error",
  payload: {
    // for agent_event:
    agent: AgentRole,
    status: AgentStatus,
    message: string,

    // for stage_change:
    stage: PipelineStage,

    // for prospects:
    prospects: Prospect[],

    // for email:
    email: EmailDraft,

    // for call:
    call: CallRecord,

    // for invoice:
    invoice: Invoice,
  }
}
```

**Flow:**
1. Parse prompt
2. Set stage → "researching", stream event
3. Run Research Agent → stream prospects
4. Set stage → "emailing", stream event
5. Run Outreach Agent for top prospects → stream emails
6. Send emails via Resend → stream sent status
7. Wait for webhook (email opened) OR proceed to calling for demo
8. Set stage → "calling", stream event
9. Trigger ElevenLabs call → stream call config
10. After call → Sales Agent analyzes transcript → stream outcome
11. If closed → Admin Agent generates invoice → stream invoice
12. Stream "done"

### POST /api/webhooks/email

**Resend webhook payload:**
```json
{
  "type": "email.opened",
  "data": { "email_id": "...", "to": ["..."] }
}
```

**Action:** Update prospect status to "opened", trigger voice call stage

### POST /api/support

**Request body:** `{ message: string, context: { prospect: Prospect, deal: CallRecord } }`
**Response:** `{ reply: string }`

---

## UI Specification

### Theme
- **Dark mode** — slate-900 background, slate-800 cards
- **Accent:** indigo-500 (primary), emerald-500 (success), amber-500 (warning), rose-500 (error)
- **Font:** Geist Sans (body), Geist Mono (data/code)
- Premium, clean, minimal — like a Bloomberg terminal meets modern SaaS

### Dashboard Layout (single page)

```
┌────────────────────────────────────────────────────────┐
│  HEADER: AcquireAI logo + tagline                      │
├────────────────────────────────────────────────────────┤
│  PROMPT INPUT: Large input with "Find me customers..." │
│  placeholder + "Launch" button                         │
├────────────────────────────────────────────────────────┤
│  PIPELINE BAR: 5 stages as connected nodes             │
│  [Research] → [Outreach] → [Sales] → [Admin] → [Spt]  │
│  Active stage glows, completed stages check-marked     │
├──────────────────────────┬─────────────────────────────┤
│  AGENT WORKSPACE (left)  │  ACTIVITY LOG (right)       │
│                          │                             │
│  Shows the active view:  │  Real-time event stream     │
│  - Lead list (research)  │  "Research Agent: Found 8   │
│  - Email preview (email) │   qualified prospects..."   │
│  - Voice call (calling)  │  "Outreach Agent: Drafting  │
│  - Deal status (sales)   │   email for Bangkok Bistro" │
│  - Invoice PDF (admin)   │  "Email sent to john@..."   │
│  - Chat (support)        │  "Email opened! Triggering  │
│                          │   warm call..."             │
│                          │                             │
├──────────────────────────┴─────────────────────────────┤
│  PROSPECT TABLE: All leads with status, score, actions │
└────────────────────────────────────────────────────────┘
```

### Component Specifications

**PromptInput:** Full-width input, large text (text-xl), indigo gradient border, "Launch Acquisition" button with rocket icon. Disabled while pipeline is running.

**PipelineView:** Horizontal bar with 5 circular nodes connected by lines. Each node: icon + label. States: idle (gray), active (indigo pulse animation), done (emerald check), error (rose). Use framer-motion for transitions.

**AgentCard:** Shows agent avatar/icon, name, current status message with typing animation while thinking. Expandable to show full output.

**LeadList:** Table with columns: Score (color-coded bar), Company, Contact, Email, Industry, Fit Reason, Status badge. Sortable by score.

**EmailPreview:** Shows the drafted email in a realistic email client-style card. To, Subject, Body. "Sent" checkmark animation when sent.

**VoiceCall:** ElevenLabs Conversational AI widget embedded. Shows call status (ringing, connected, ended). Displays live transcript below.

**InvoiceView:** Professional invoice card with logo placeholder, line items table, total. "Download PDF" button.

**SupportChat:** Chat bubbles interface. User types at bottom, AI responds. Shows customer context at top.

**ActivityLog:** Scrolling list of events. Each event: timestamp, agent icon, message. New events slide in from bottom with framer-motion. Auto-scrolls.

---

## ElevenLabs Conversational AI Integration

### Setup
1. Create an agent at elevenlabs.io/conversational-ai
2. Configure the agent with the outreach script
3. The agent ID goes in ELEVENLABS_AGENT_ID env var

### How the call works
- ElevenLabs provides an embeddable widget
- The widget connects to their Conversational AI
- We pass the prospect-specific script as the system prompt
- The AI makes the call, handles the conversation
- After the call, we get the transcript via their API
- Gemini analyzes the transcript for deal outcome

### Widget integration
```tsx
// In VoiceCall.tsx — embed ElevenLabs widget
// Use their JavaScript SDK: @11labs/client
// Start a conversation session with custom prompt per prospect
```

### Call script template (generated by Outreach Agent per prospect)
```
Hi, this is [Agent Name] from [User's Company]. I sent you an email earlier about [product/service] — did you get a chance to look at it?

[If yes]: Great! I noticed that [specific thing about prospect's business from research]. I think [product] could help you [specific benefit]. Would you be open to a quick 15-minute call to discuss?

[If no]: No worries! In brief, [1-sentence pitch]. Given that you're [something specific about their business], I think this could save you [specific benefit]. Would you like me to send over some more information?

[If interested]: Perfect! I'll send you a link to schedule a time that works for you. What email should I send it to?

[If not interested]: I understand. Thanks for your time. If anything changes, feel free to reach out.
```

---

## PDF Invoice Generation (`src/lib/pdf.ts`)

Using jspdf to generate a professional invoice:
- Header: Company name, invoice number, date
- Bill to: Prospect company + contact
- Line items table: Description, Qty, Unit Price, Total
- Subtotal, Tax, Grand Total
- Footer: Payment terms, contact info
- Returns base64 data URL for preview + download

---

## Demo Script (2 minutes)

1. **[0:00]** Type: "Find me 10 potential customers for my Thai restaurant POS system in Bangkok"
2. **[0:05]** Research Agent activates → leads stream in with scores
3. **[0:25]** Outreach Agent drafts emails → show personalized email
4. **[0:35]** Email sent → show on your phone (real email arrives)
5. **[0:40]** Open email on phone → webhook fires → "Email opened!"
6. **[0:45]** Voice call triggers → ElevenLabs AI calls
7. **[0:50]** Friend/judge answers, has 30-sec conversation with AI
8. **[1:20]** Call ends → Sales Agent: "CLOSED — prospect agreed to demo"
9. **[1:25]** Admin Agent generates invoice PDF
10. **[1:35]** Support chat: ask a question → instant answer
11. **[1:45]** End: "From prompt to paying customer in under 2 minutes"

---

## What Makes This Win First Prize

1. **Obvious value:** "This gets you paying customers" — instant business impact
2. **Real AI orchestration:** 5 agents with clear roles, handoffs, and context passing
3. **Everything is real:** Real search, real emails, real voice calls, real PDFs
4. **Live demo:** Judge talks to the AI, email arrives on a phone
5. **Fully autonomous:** One prompt → entire sales pipeline runs
6. **Production-viable:** Real APIs, real integrations, real business workflow
