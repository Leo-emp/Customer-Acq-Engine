// ── Main orchestration API: streams pipeline events via SSE ──

import { NextRequest } from "next/server";
import { runPipeline, analyzeCallResult } from "@/agents/orchestrator";
import type { Prospect } from "@/lib/types";

// POST /api/orchestrate — start the pipeline
export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  // create a readable stream for SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: { type: string; payload: Record<string, unknown> }) => {
        const data = JSON.stringify(event);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      try {
        await runPipeline(prompt, send);
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
