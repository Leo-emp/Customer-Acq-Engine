import { NextRequest } from "next/server";
import { agentThinkJSON } from "@/lib/gemini";
import { generateCallNotePDF } from "@/lib/pdf";
import { buildBrandContext } from "@/lib/brand-context";
import { DEMO_MODE, DEMO_SALES_ANALYSIS } from "@/lib/demo-data";
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
    // # demo mode: return pre-cached Salesforce sales analysis with realistic delay
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 2500));
      const demoResult = DEMO_SALES_ANALYSIS;
      const callRecord: CallRecord = { prospectId: prospectId || "p1", transcript, duration: 480, outcome: demoResult.outcome, summary: demoResult.summary, nextAction: demoResult.nextAction };
      const pdfDataUrl = generateCallNotePDF(prospectName || "Dr. Rachel Torres", companyName || "MedVista Health Systems", demoResult.outcome, demoResult.summary, demoResult.nextAction, transcript, demoResult.keyInsights);
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
