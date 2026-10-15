// ── Main orchestration API: streams pipeline events via SSE ──

import { NextRequest } from "next/server";
import { runPipeline, analyzeCallResult } from "@/agents/orchestrator";
import { DEMO_MODE, DEMO_PROSPECTS, DEMO_CALL_RECORD, DEMO_SALES_ANALYSIS, DEMO_INVOICE_FULL } from "@/lib/demo-data";
import { DEMO_PIPELINE_EMAILS, DEMO_PIPELINE_QA } from "@/lib/demo-pipeline";
import type { Prospect } from "@/lib/types";

// # realistic delay for demo mode
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// POST /api/orchestrate — start the full pipeline
export async function POST(req: NextRequest) {
  const { prompt, profile } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: { type: string; payload: Record<string, unknown> }) => {
        const data = JSON.stringify(event);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      try {
        if (DEMO_MODE) {
          await runDemoPipeline(send, profile?.senderName || "Team", profile?.companyName || "Our Company");
        } else {
          await runPipeline({ prompt, profile }, send);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Pipeline failed";
        send({ type: "error", payload: { message } });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// ── Demo pipeline: sequential agents with realistic 3s delays ──
async function runDemoPipeline(
  send: (event: { type: string; payload: Record<string, unknown> }) => void,
  senderName: string,
  _companyName: string,
) {
  const prospects = DEMO_PROSPECTS;
  // # pipeline uses all 30 emails (separate from independent agent route's 3)
  const emails = DEMO_PIPELINE_EMAILS.map((e) => ({
    ...e,
    body: e.body.replace("{senderName}", senderName),
  }));

  // ═══ STAGE 1: SCOUT ═══
  send({ type: "stage_change", payload: { stage: "researching" } });
  send({ type: "agent_event", payload: { agent: "research", status: "thinking", message: "Analyzing target market for enterprise CRM buyers...", timestamp: Date.now() } });
  await wait(2000);

  send({ type: "agent_event", payload: { agent: "research", status: "working", message: "Searching Apollo.io for B2B companies needing CRM modernization...", timestamp: Date.now() } });
  await wait(3000);

  send({ type: "agent_event", payload: { agent: "research", status: "working", message: "AI scoring 85 raw leads by CRM readiness, budget signals, and tech stack...", timestamp: Date.now() } });
  await wait(2500);

  send({ type: "agent_event", payload: { agent: "research", status: "done", message: `Found ${prospects.length} qualified prospects — 27 verified emails across 20+ industries`, timestamp: Date.now() } });
  send({ type: "prospects", payload: { prospects } });
  await wait(1000);

  // ═══ STAGE 2: REACH ═══
  send({ type: "stage_change", payload: { stage: "emailing" } });
  send({ type: "agent_event", payload: { agent: "outreach", status: "thinking", message: `Crafting personalized cold emails for top ${emails.length} prospects (first batch)...`, timestamp: Date.now() } });
  await wait(3000);

  // # send emails in batches of 5 with progress updates
  for (let batch = 0; batch < emails.length; batch += 5) {
    const end = Math.min(batch + 5, emails.length);
    const batchEmails = emails.slice(batch, end);
    const names = batchEmails.map(e => {
      const p = prospects.find(p => p.id === e.prospectId);
      return p?.companyName || e.to;
    }).join(", ");

    send({ type: "agent_event", payload: { agent: "outreach", status: "working", message: `Drafting emails ${batch + 1}-${end}/${emails.length}: ${names}...`, timestamp: Date.now() } });
    await wait(2000);

    // # stream each email in the batch
    for (const email of batchEmails) {
      send({ type: "email", payload: { email: { ...email } } });
      await wait(200);
    }
  }

  send({ type: "agent_event", payload: { agent: "outreach", status: "done", message: `${emails.length} emails drafted — passing to QA Agent for review`, timestamp: Date.now() } });
  await wait(1000);

  // ═══ STAGE 2.5: EMAIL QA ═══
  send({ type: "agent_event", payload: { agent: "emailqa", status: "thinking", message: `Email QA Agent initializing — scanning all ${emails.length} drafted emails...`, timestamp: Date.now() } });
  await wait(2000);

  // # scan in batches of 6 for realistic progress without 90s wait
  const batchSize = 6;
  for (let batch = 0; batch < emails.length; batch += batchSize) {
    const end = Math.min(batch + batchSize, emails.length);
    const batchQA = DEMO_PIPELINE_QA.slice(batch, end);
    const companies = batchQA.map(q => q.companyName).join(", ");
    send({ type: "agent_event", payload: { agent: "emailqa", status: "working", message: `Scanning emails ${batch + 1}-${end}/${emails.length}: ${companies}...`, timestamp: Date.now() } });
    await wait(2500);
  }

  // # report QA results
  const approved = DEMO_PIPELINE_QA.filter(r => r.verdict === "approved");
  const flagged = DEMO_PIPELINE_QA.filter(r => r.verdict !== "approved");
  send({ type: "agent_event", payload: { agent: "emailqa", status: "working", message: `QA complete: ${approved.length} approved, ${flagged.length} need revision — auto-sending approved emails...`, timestamp: Date.now() } });
  await wait(2000);

  send({ type: "agent_event", payload: { agent: "emailqa", status: "done", message: `${approved.length}/${emails.length} emails approved & sent — ${flagged.length} held for personalization review`, timestamp: Date.now() } });
  await wait(1000);

  // ═══ STAGE 3: CLOSER — auto-dial + analyze call transcript ═══
  send({ type: "stage_change", payload: { stage: "calling" } });
  send({ type: "agent_event", payload: { agent: "sales", status: "thinking", message: `Initiating AI voice call to ${prospects[0].contactName} — CIO at ${prospects[0].companyName}...`, timestamp: Date.now() } });
  await wait(2500);

  send({ type: "agent_event", payload: { agent: "sales", status: "working", message: `Call connected — AI sales agent speaking with ${prospects[0].contactName}...`, timestamp: Date.now() } });
  await wait(3000);

  send({ type: "agent_event", payload: { agent: "sales", status: "working", message: "Call in progress — discussing Health Cloud capabilities and migration timeline...", timestamp: Date.now() } });
  await wait(3000);

  send({ type: "agent_event", payload: { agent: "sales", status: "working", message: "Call completed (4m 42s) — analyzing transcript with AI...", timestamp: Date.now() } });
  await wait(2500);

  // # send call record + analysis
  send({ type: "stage_change", payload: { stage: "selling" } });
  send({ type: "agent_event", payload: { agent: "sales", status: "working", message: `Deal classified: INTERESTED — ${DEMO_SALES_ANALYSIS.keyInsights.length} key insights extracted`, timestamp: Date.now() } });
  await wait(2000);

  send({ type: "call", payload: { call: DEMO_CALL_RECORD } });
  send({ type: "agent_event", payload: { agent: "sales", status: "done", message: `Call analysis complete — ${prospects[0].contactName} is interested. Budget: $250-400K pre-approved. Next: send phased migration proposal within 48 hours`, timestamp: Date.now() } });
  await wait(1000);

  // ═══ STAGE 4: OPS — auto-generate invoice ═══
  send({ type: "stage_change", payload: { stage: "closing" } });
  send({ type: "agent_event", payload: { agent: "admin", status: "thinking", message: "Generating invoice based on deal parameters discussed in call...", timestamp: Date.now() } });
  await wait(2500);

  send({ type: "agent_event", payload: { agent: "admin", status: "working", message: `Building line items: ${DEMO_INVOICE_FULL.items.length} products/services for ${DEMO_INVOICE_FULL.companyName}...`, timestamp: Date.now() } });
  await wait(2000);

  send({ type: "agent_event", payload: { agent: "admin", status: "working", message: `Invoice ${DEMO_INVOICE_FULL.id} generated — Total: $${DEMO_INVOICE_FULL.total.toLocaleString()}`, timestamp: Date.now() } });
  await wait(1500);

  send({ type: "invoice", payload: { invoice: DEMO_INVOICE_FULL, pdfDataUrl: "" } });
  send({ type: "agent_event", payload: { agent: "admin", status: "done", message: `Invoice ${DEMO_INVOICE_FULL.id} ready for ${DEMO_INVOICE_FULL.companyName} — $${DEMO_INVOICE_FULL.total.toLocaleString()}`, timestamp: Date.now() } });
  await wait(1000);

  // ═══ PIPELINE COMPLETE — all 5 agents finished ═══
  send({ type: "stage_change", payload: { stage: "complete" } });
  send({ type: "agent_event", payload: { agent: "router", status: "done", message: `Pipeline complete — ${prospects.length} leads found, ${approved.length} emails sent, ${flagged.length} held for QA, call analyzed (interested), invoice generated ($${DEMO_INVOICE_FULL.total.toLocaleString()})`, timestamp: Date.now() } });
  send({ type: "done", payload: {} });
}

// PUT /api/orchestrate — analyze call result (after voice call completes)
export async function PUT(req: NextRequest) {
  const { prospect, transcript, emailBody, productDescription } = (await req.json()) as {
    prospect: Prospect;
    transcript: string;
    emailBody: string;
    productDescription: string;
  };

  if (!prospect || !transcript) {
    return Response.json({ error: "prospect and transcript required" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: { type: string; payload: Record<string, unknown> }) => {
        const data = JSON.stringify(event);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      try {
        await analyzeCallResult(prospect, transcript, emailBody, productDescription, send);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Analysis failed";
        send({ type: "error", payload: { message } });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
