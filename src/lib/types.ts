// ── Core types for the AI acquisition engine ──

export type AgentRole = "router" | "research" | "outreach" | "sales" | "admin" | "support";

export type AgentStatus = "idle" | "thinking" | "working" | "done" | "error";

export type DealOutcome = "closed" | "interested" | "objection" | "rejected";

export type PipelineStage =
  | "idle"
  | "researching"
  | "emailing"
  | "calling"
  | "selling"
  | "closing"
  | "supporting"
  | "complete";

// ── Prospect / Lead ──

export interface Prospect {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  emailVerified?: boolean;
  website: string;
  industry: string;
  fitReason: string; // why they're a good lead
  score: number; // 1-100
  status: "new" | "emailed" | "opened" | "called" | "interested" | "closed" | "rejected";
}

// ── Email ──

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
  prospectId: string;
  sentAt?: string;
  openedAt?: string;
}

// ── Call ──

export interface CallRecord {
  prospectId: string;
  transcript: string;
  duration: number;
  outcome: DealOutcome;
  summary: string;
  nextAction: string;
}

// ── Invoice ──

export interface Invoice {
  id: string;
  prospectId: string;
  companyName: string;
  contactName: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  total: number;
  createdAt: string;
}

// ── Agent Activity (streamed to UI) ──

export interface AgentEvent {
  agent: AgentRole;
  status: AgentStatus;
  message: string;
  data?: unknown;
  timestamp: number;
}

// ── Pipeline State ──

export interface PipelineState {
  stage: PipelineStage;
  userPrompt: string;
  prospects: Prospect[];
  emails: EmailDraft[];
  calls: CallRecord[];
  invoices: Invoice[];
  events: AgentEvent[];
  activeProspectId?: string;
}

// ── API ──

export interface OrchestrateRequest {
  prompt: string;
}

export interface OrchestrateEvent {
  type: "agent_event" | "stage_change" | "prospects" | "email" | "call" | "invoice" | "error" | "done";
  payload: unknown;
}
