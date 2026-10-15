// ── Shared call context type + global accessor ──

export interface CallContext {
  prospectName: string;
  companyName: string;
  salesContext: string;
  transcript: { role: string; text: string }[];
  turnCount: number;
  callSid?: string;
  finalStatus?: string;
  duration?: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __callContexts: Map<string, CallContext> | undefined;
}

export function getCallContexts(): Map<string, CallContext> {
  if (!globalThis.__callContexts) {
    globalThis.__callContexts = new Map();
  }
  return globalThis.__callContexts;
}
