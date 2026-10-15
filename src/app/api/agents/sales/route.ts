import { NextRequest } from "next/server";
import { agentThinkJSON } from "@/lib/gemini";
import { generateCallNotePDF } from "@/lib/pdf";
import { buildBrandContext } from "@/lib/brand-context";
import { DEMO_MODE } from "@/lib/demo-data";
import type { CallRecord, DealOutcome } from "@/lib/types";

interface AnalysisOutput {
  outcome: DealOutcome;
  summary: string;
  nextAction: string;
  keyInsights: string[];
}

export async function POST(req: NextRequest) {
  const { transcript, prospectId, prospectName, companyName, profile } = await req.json();

  if (!transcript || typeof transcript !== "string") {
    return Response.json({ error: "transcript is required" }, { status: 400 });
  }

  const brandCtx = buildBrandContext(profile);

  try {
    // # demo mode: return pre-cached analysis
    if (DEMO_MODE) {
      const demoResult = { outcome: "interested" as DealOutcome, summary: "The prospect expressed strong interest in our design and development services. They mentioned upcoming product redesign plans and budget availability in Q1. Key concern was timeline — they need delivery within 8 weeks.", nextAction: "Schedule a follow-up call next Tuesday to discuss project scope and timeline in detail. Prepare a preliminary proposal with 8-week delivery plan.", keyInsights: ["Prospect has budget allocated for Q1 product redesign", "Main concern is delivery speed — 8-week deadline is firm", "Currently evaluating 2 other agencies — we need to move fast", "Decision maker is the VP of Product, not the CTO", "They want to start with a small pilot project first"] };
      const callRecord: CallRecord = { prospectId: prospectId || "manual", transcript, duration: 180, outcome: demoResult.outcome, summary: demoResult.summary, nextAction: demoResult.nextAction };
      const pdfDataUrl = generateCallNotePDF(prospectName || "Unknown", companyName || "Unknown", demoResult.outcome, demoResult.summary, demoResult.nextAction, transcript, demoResult.keyInsights);
      return Response.json({ callRecord, insights: demoResult.keyInsights, pdfDataUrl });
    }

    const result = await agentThinkJSON<AnalysisOutput>(
      `You are a sales analyst.${brandCtx ? ` You work for the company described below.\n\n${brandCtx}\n\n` : " "}Analyze this call transcript or conversation and determine:
      1. Deal outcome: "closed" (they agreed to buy), "interested" (positive but not committed), "objection" (had concerns), "rejected" (said no)
      2. A summary of the conversation
      3. Recommended next action
      4. Key insights from the conversation

      Return JSON: { "outcome": "...", "summary": "...", "nextAction": "...", "keyInsights": ["..."] }`,
      `Transcript:\n${transcript}`
    );

    const callRecord: CallRecord = {
      prospectId: prospectId || "manual",
      transcript,
      duration: Math.ceil(transcript.length / 50),
      outcome: result.outcome,
      summary: result.summary,
      nextAction: result.nextAction,
    };

    const pdfDataUrl = generateCallNotePDF(
      prospectName || "Unknown",
      companyName || "Unknown",
      result.outcome,
      result.summary,
      result.nextAction,
      transcript,
      result.keyInsights
    );

    return Response.json({ callRecord, insights: result.keyInsights, pdfDataUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
