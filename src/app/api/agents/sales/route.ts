import { NextRequest } from "next/server";
import { agentThinkJSON } from "@/lib/gemini";
import type { CallRecord, DealOutcome } from "@/lib/types";

interface AnalysisOutput {
  outcome: DealOutcome;
  summary: string;
  nextAction: string;
  keyInsights: string[];
}

export async function POST(req: NextRequest) {
  const { transcript, prospectId } = await req.json();

  if (!transcript || typeof transcript !== "string") {
    return Response.json({ error: "transcript is required" }, { status: 400 });
  }

  try {
    const result = await agentThinkJSON<AnalysisOutput>(
      `You are a sales analyst. Analyze this call transcript or conversation and determine:
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

    return Response.json({ callRecord, insights: result.keyInsights });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
