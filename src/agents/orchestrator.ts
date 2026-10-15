// ── Orchestrator: pipeline state machine that dispatches agents ──

import { researchProspects } from "./research";
import { draftEmails, sendDraftedEmail, generateCallScript } from "./outreach";
import { analyzeCall } from "./sales";
import { generateInvoice } from "./admin";
import type {
  PipelineState,
  PipelineStage,
  AgentEvent,
  Prospect,
  EmailDraft,
  CallRecord,
  Invoice,
} from "@/lib/types";

type EventCallback = (event: {
  type: string;
  payload: Record<string, unknown>;
}) => void;

// helper to emit events
function emit(cb: EventCallback, type: string, payload: Record<string, unknown>) {
  cb({ type, payload });
}

function agentEvent(
  cb: EventCallback,
  agent: AgentEvent["agent"],
  status: AgentEvent["status"],
  message: string,
  data?: unknown
) {
  emit(cb, "agent_event", { agent, status, message, data, timestamp: Date.now() });
}

function stageChange(cb: EventCallback, stage: PipelineStage) {
  emit(cb, "stage_change", { stage });
}

// ── Main orchestration pipeline ──
export async function runPipeline(
  prompt: string,
  onEvent: EventCallback
): Promise<PipelineState> {
  const state: PipelineState = {
    stage: "idle",
    userPrompt: prompt,
    prospects: [],
    emails: [],
    calls: [],
    invoices: [],
    events: [],
  };

  try {
    // extract product description from prompt (the prompt IS the product description)
    const productDescription = prompt;
    const senderName = "Alex";
    const senderCompany = "AcquireAI";

    // ═══════════════════════════════════════════
    // STAGE 1: RESEARCH
    // ═══════════════════════════════════════════
    stageChange(onEvent, "researching");
    agentEvent(onEvent, "research", "thinking", "Analyzing your target market...");

    agentEvent(onEvent, "research", "working", "Searching for qualified prospects...");
    const prospects = await researchProspects(prompt);
    state.prospects = prospects;

    agentEvent(
      onEvent,
      "research",
      "done",
      `Found ${prospects.length} qualified prospects`,
      prospects
    );
    emit(onEvent, "prospects", { prospects });

    if (prospects.length === 0) {
      agentEvent(onEvent, "research", "error", "No prospects found. Try a different search.");
      emit(onEvent, "done", { state });
      return state;
    }

    // ═══════════════════════════════════════════
    // STAGE 2: OUTREACH (EMAIL)
    // ═══════════════════════════════════════════
    stageChange(onEvent, "emailing");
    agentEvent(onEvent, "outreach", "thinking", "Crafting personalized emails...");

    // draft emails for top 5 prospects
    const topProspects = prospects.slice(0, 5);
    const drafts = await draftEmails(topProspects, productDescription, senderName);

    // send emails one by one with events
    const sentEmails: EmailDraft[] = [];
    for (const draft of drafts) {
      const prospect = topProspects.find((p) => p.id === draft.prospectId);
      agentEvent(
        onEvent,
        "outreach",
        "working",
        `Sending email to ${prospect?.contactName} at ${prospect?.companyName}...`
      );

      try {
        const sent = await sendDraftedEmail(draft, senderCompany);
        sentEmails.push(sent);
        // update prospect status
        const p = state.prospects.find((pr) => pr.id === draft.prospectId);
        if (p) p.status = "emailed";

        emit(onEvent, "email", { email: sent });
        agentEvent(
          onEvent,
          "outreach",
          "working",
          `Email sent to ${prospect?.contactName} ✓`
        );
      } catch {
        agentEvent(
          onEvent,
          "outreach",
          "error",
          `Failed to send email to ${prospect?.contactName}`
        );
      }
    }

    state.emails = sentEmails;
    agentEvent(
      onEvent,
      "outreach",
      "done",
      `${sentEmails.length} emails sent. Waiting for engagement...`
    );

    // ═══════════════════════════════════════════
    // STAGE 3: CALLING (voice call)
    // ═══════════════════════════════════════════
    stageChange(onEvent, "calling");

    // for the demo: prepare the call for the first prospect
    const callProspect = topProspects[0];
    const callEmail = sentEmails[0];

    if (callProspect && callEmail) {
      agentEvent(
        onEvent,
        "outreach",
        "working",
        `Preparing warm call to ${callProspect.contactName}...`
      );

      const callScript = generateCallScript(
        callProspect,
        productDescription,
        callEmail.subject
      );

      // update prospect status
      const p = state.prospects.find((pr) => pr.id === callProspect.id);
      if (p) p.status = "called";

      // emit call config for the frontend to trigger ElevenLabs widget
      emit(onEvent, "call_ready", {
        prospect: callProspect,
        callScript,
        agentId: process.env.ELEVENLABS_AGENT_ID || "",
      });

      agentEvent(
        onEvent,
        "outreach",
        "done",
        `Voice call ready for ${callProspect.contactName}. Waiting for call to complete...`
      );

      // the call happens in the browser via ElevenLabs widget
      // the transcript is sent back to /api/orchestrate/analyze when the call ends
    }

    // pipeline pauses here — call analysis continues via analyzeCallResult()
    emit(onEvent, "awaiting_call", { prospectId: callProspect?.id });
    return state;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    agentEvent(onEvent, "router", "error", `Pipeline error: ${message}`);
    emit(onEvent, "error", { message });
    return state;
  }
}

// ═══════════════════════════════════════════
// Called after the voice call completes
// ═══════════════════════════════════════════
export async function analyzeCallResult(
  prospect: Prospect,
  transcript: string,
  emailBody: string,
  productDescription: string,
  onEvent: EventCallback
): Promise<{ call: CallRecord; invoice?: Invoice; pdfDataUrl?: string }> {
  // ── STAGE 4: SALES ANALYSIS ──
  stageChange(onEvent, "selling");
  agentEvent(onEvent, "sales", "thinking", "Analyzing call transcript...");

  const callRecord = await analyzeCall(prospect, transcript, emailBody, productDescription);

  agentEvent(
    onEvent,
    "sales",
    "done",
    `Outcome: ${callRecord.outcome.toUpperCase()} — ${callRecord.summary}`
  );
  emit(onEvent, "call", { call: callRecord });

  // ── STAGE 5: ADMIN (if deal closed) ──
  if (callRecord.outcome === "closed") {
    stageChange(onEvent, "closing");
    agentEvent(onEvent, "admin", "thinking", "Generating invoice and contract...");

    const { invoice, pdfDataUrl } = await generateInvoice(
      prospect,
      callRecord,
      productDescription
    );

    agentEvent(
      onEvent,
      "admin",
      "done",
      `Invoice ${invoice.id} generated — $${invoice.total.toFixed(2)}`
    );
    emit(onEvent, "invoice", { invoice, pdfDataUrl });

    // ── STAGE 6: SUPPORT READY ──
    stageChange(onEvent, "supporting");
    agentEvent(
      onEvent,
      "support",
      "done",
      `Customer support activated for ${prospect.companyName}`
    );

    stageChange(onEvent, "complete");
    emit(onEvent, "done", {});

    return { call: callRecord, invoice, pdfDataUrl };
  }

  // for non-closed outcomes, pipeline pauses
  if (callRecord.outcome === "interested") {
    agentEvent(
      onEvent,
      "sales",
      "working",
      "Prospect is interested — sending Calendly link..."
    );
  } else if (callRecord.outcome === "objection") {
    agentEvent(
      onEvent,
      "sales",
      "working",
      "Prospect has concerns — crafting response..."
    );
  } else {
    agentEvent(
      onEvent,
      "sales",
      "done",
      "Prospect declined. Moving to next lead."
    );
  }

  emit(onEvent, "done", {});
  return { call: callRecord };
}
