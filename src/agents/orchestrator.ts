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
import type { CompanyProfile } from "@/lib/store";

type EventCallback = (event: {
  type: string;
  payload: Record<string, unknown>;
}) => void;

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

export interface PipelineOptions {
  prompt: string;
  profile?: CompanyProfile | null;
}

// ── Main orchestration pipeline ──
export async function runPipeline(
  opts: PipelineOptions,
  onEvent: EventCallback
): Promise<PipelineState> {
  const { prompt, profile } = opts;

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
    const senderName = profile?.senderName || "Team";
    const senderCompany = profile?.companyName || "AcquireAI";
    const productDescription = prompt;

    // ═══════════════════════════════════════════
    // STAGE 1: RESEARCH — Scout finds leads via Apollo
    // ═══════════════════════════════════════════
    stageChange(onEvent, "researching");
    agentEvent(onEvent, "research", "thinking", "Analyzing your target market...");
    agentEvent(onEvent, "research", "working", "Searching Apollo.io for real B2B leads...");

    const prospects = await researchProspects(prompt);
    state.prospects = prospects;

    const verifiedCount = prospects.filter((p) => p.emailVerified).length;
    const noEmailCount = prospects.filter((p) => !p.email).length;

    agentEvent(
      onEvent,
      "research",
      "done",
      `Found ${prospects.length} prospects — ${verifiedCount} verified emails, ${noEmailCount} without email`
    );
    emit(onEvent, "prospects", { prospects });

    if (prospects.length === 0) {
      agentEvent(onEvent, "research", "error", "No prospects found. Try a different search.");
      emit(onEvent, "done", { state });
      return state;
    }

    // ═══════════════════════════════════════════
    // STAGE 2: OUTREACH — Reach drafts and sends emails
    // ═══════════════════════════════════════════
    stageChange(onEvent, "emailing");

    // only email prospects with verified email addresses
    const emailableProspects = prospects.filter((p) => p.email && p.emailVerified);

    if (emailableProspects.length === 0) {
      agentEvent(onEvent, "outreach", "error", "No verified email addresses found. Skipping outreach.");
    } else {
      agentEvent(onEvent, "outreach", "thinking", `Crafting personalized emails for ${emailableProspects.length} verified contacts...`);

      const drafts = await draftEmails(emailableProspects, productDescription, senderName);

      agentEvent(onEvent, "outreach", "working", `${drafts.length} emails drafted. Sending...`);

      // send emails one by one
      const sentEmails: EmailDraft[] = [];
      for (const draft of drafts) {
        const prospect = emailableProspects.find((p) => p.id === draft.prospectId);
        agentEvent(
          onEvent,
          "outreach",
          "working",
          `Sending to ${prospect?.contactName} at ${prospect?.companyName}...`
        );

        try {
          const sent = await sendDraftedEmail(draft, senderCompany);
          sentEmails.push(sent);
          const p = state.prospects.find((pr) => pr.id === draft.prospectId);
          if (p) p.status = "emailed";
          emit(onEvent, "email", { email: sent });
        } catch {
          agentEvent(onEvent, "outreach", "error", `Failed to send to ${prospect?.contactName}`);
        }
      }

      state.emails = sentEmails;
      agentEvent(
        onEvent,
        "outreach",
        "done",
        `${sentEmails.length}/${drafts.length} emails sent successfully`
      );
    }

    // ═══════════════════════════════════════════
    // STAGE 3: CALLING — prepare voice call for top prospect
    // ═══════════════════════════════════════════
    stageChange(onEvent, "calling");

    const callProspect = emailableProspects[0] || prospects[0];
    const callEmail = state.emails[0];

    if (callProspect && callEmail) {
      agentEvent(onEvent, "outreach", "working", `Preparing warm call to ${callProspect.contactName}...`);

      const callScript = generateCallScript(
        callProspect,
        productDescription,
        callEmail.subject
      );

      const p = state.prospects.find((pr) => pr.id === callProspect.id);
      if (p) p.status = "called";

      emit(onEvent, "call_ready", {
        prospect: callProspect,
        callScript,
        agentId: process.env.ELEVENLABS_AGENT_ID || "",
      });

      agentEvent(onEvent, "outreach", "done", `Voice call ready for ${callProspect.contactName}`);
    }

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
  stageChange(onEvent, "selling");
  agentEvent(onEvent, "sales", "thinking", "Analyzing call transcript...");

  const callRecord = await analyzeCall(prospect, transcript, emailBody, productDescription);

  agentEvent(onEvent, "sales", "done", `Outcome: ${callRecord.outcome.toUpperCase()} — ${callRecord.summary}`);
  emit(onEvent, "call", { call: callRecord });

  if (callRecord.outcome === "closed") {
    stageChange(onEvent, "closing");
    agentEvent(onEvent, "admin", "thinking", "Generating invoice...");

    const { invoice, pdfDataUrl } = await generateInvoice(prospect, callRecord, productDescription);

    agentEvent(onEvent, "admin", "done", `Invoice ${invoice.id} generated — $${invoice.total.toFixed(2)}`);
    emit(onEvent, "invoice", { invoice, pdfDataUrl });

    stageChange(onEvent, "supporting");
    agentEvent(onEvent, "support", "done", `Customer support activated for ${prospect.companyName}`);

    stageChange(onEvent, "complete");
    emit(onEvent, "done", {});

    return { call: callRecord, invoice, pdfDataUrl };
  }

  if (callRecord.outcome === "interested") {
    agentEvent(onEvent, "sales", "working", "Prospect is interested — scheduling follow-up...");
  } else if (callRecord.outcome === "objection") {
    agentEvent(onEvent, "sales", "working", "Prospect has concerns — preparing response...");
  } else {
    agentEvent(onEvent, "sales", "done", "Prospect declined. Moving to next lead.");
  }

  emit(onEvent, "done", {});
  return { call: callRecord };
}
