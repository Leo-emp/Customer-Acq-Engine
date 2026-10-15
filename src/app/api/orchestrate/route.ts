// ── Main orchestration API: streams pipeline events via SSE ──

import { NextRequest } from "next/server";
import { runPipeline, analyzeCallResult } from "@/agents/orchestrator";
import { DEMO_MODE, DEMO_PROSPECTS, DEMO_EMAILS, DEMO_EMAIL_QA } from "@/lib/demo-data";
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
  const emails = DEMO_EMAILS.map((e) => ({
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

  // # send emails one by one with delays
  for (let i = 0; i < emails.length; i++) {
    const prospect = prospects.find((p) => p.id === emails[i].prospectId);
    send({ type: "agent_event", payload: { agent: "outreach", status: "working", message: `Drafting email ${i + 1}/${emails.length} for ${prospect?.contactName} at ${prospect?.companyName}...`, timestamp: Date.now() } });
    await wait(2000);

    send({ type: "email", payload: { email: { ...emails[i] } } });
    await wait(500);
  }

  send({ type: "agent_event", payload: { agent: "outreach", status: "done", message: `${emails.length} emails drafted — passing to QA Agent for review`, timestamp: Date.now() } });
  await wait(1000);

  // ═══ STAGE 2.5: EMAIL QA ═══
  send({ type: "agent_event", payload: { agent: "emailqa", status: "thinking", message: "Email QA Agent initializing — scanning all drafted emails...", timestamp: Date.now() } });
  await wait(2000);

  // # scan each email with progress
  for (let i = 0; i < emails.length; i++) {
    const qa = DEMO_EMAIL_QA[i];
    send({ type: "agent_event", payload: { agent: "emailqa", status: "working", message: `Scanning email ${i + 1}/${emails.length}: ${qa?.companyName || emails[i].to}...`, timestamp: Date.now() } });
    await wait(3000);
  }

  // # report QA results
  const approved = DEMO_EMAIL_QA.filter(r => r.verdict === "approved");
  const flagged = DEMO_EMAIL_QA.filter(r => r.verdict !== "approved");
  send({ type: "agent_event", payload: { agent: "emailqa", status: "working", message: `QA complete: ${approved.length} approved, ${flagged.length} flagged — auto-sending approved emails...`, timestamp: Date.now() } });
  await wait(2000);

  // # auto-send approved emails
  for (const qa of approved) {
    const email = emails[qa.emailIndex];
    if (email) {
      send({ type: "email", payload: { email: { ...email, sentAt: new Date().toISOString() } } });
      await wait(500);
    }
  }

  send({ type: "agent_event", payload: { agent: "emailqa", status: "done", message: `${approved.length} emails approved & sent — ${flagged.length} held for review (${flagged.map(f => f.verdict.replace("_", " ")).join(", ")})`, timestamp: Date.now() } });
  await wait(1000);

  // ═══ STAGE 3: CLOSER (call ready) ═══
  send({ type: "stage_change", payload: { stage: "calling" } });
  send({ type: "agent_event", payload: { agent: "sales", status: "thinking", message: `Preparing warm call script for top prospect: ${prospects[0].contactName} — CIO at ${prospects[0].companyName}...`, timestamp: Date.now() } });
  await wait(3000);

  send({ type: "agent_event", payload: { agent: "sales", status: "done", message: `Voice call ready for ${prospects[0].contactName} at ${prospects[0].companyName}`, timestamp: Date.now() } });
  send({ type: "call_ready", payload: { prospect: prospects[0], callScript: `Hi ${prospects[0].contactName}, this is ${senderName} from Salesforce. I just sent you an email about how we could help ${prospects[0].companyName} modernize your CRM and unify patient data across your facilities. I know you're evaluating options for FY2027 — do you have a quick minute to discuss how Health Cloud could fit into your digital transformation?`, agentId: "" } });
  await wait(1000);

  // ═══ DONE ═══
  send({ type: "agent_event", payload: { agent: "router", status: "done", message: `Pipeline complete — ${prospects.length} leads found, ${approved.length} emails sent, ${flagged.length} held for QA review, call ready`, timestamp: Date.now() } });
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
