// ── ElevenLabs Conversational AI config ──

// generate the system prompt for a voice call to a specific prospect
export function buildCallPrompt(
  prospectName: string,
  companyName: string,
  productDescription: string,
  emailSubject: string,
  fitReason: string
): string {
  return `You are a friendly, professional sales development representative calling a prospect.

CONTEXT:
- You sent an email earlier with subject: "${emailSubject}"
- You're calling: ${prospectName} at ${companyName}
- Product/Service: ${productDescription}
- Why they're a good fit: ${fitReason}

INSTRUCTIONS:
1. Introduce yourself naturally: "Hi, this is Alex from [company]. I sent you an email earlier about ${productDescription} — did you get a chance to look at it?"
2. Reference something SPECIFIC about their business: "${fitReason}"
3. Keep it conversational, not scripted
4. If they're interested: "Great! I'll send you a link to book a quick 15-minute demo at a time that works for you."
5. If they have objections: address them briefly and offer to send more info
6. If not interested: thank them graciously and end the call
7. Keep the call under 60 seconds
8. Be warm but not pushy

NEVER:
- Be aggressive or manipulative
- Make promises you can't keep
- Talk for more than 30 seconds without letting them respond`;
}

// get ElevenLabs conversation widget config
export function getWidgetConfig(agentId: string, customPrompt: string) {
  return {
    agentId,
    overrides: {
      agent: {
        prompt: {
          prompt: customPrompt,
        },
        firstMessage: "Hi! This is Alex calling about the email I sent earlier. Do you have a quick moment?",
      },
    },
  };
}

// extract transcript from ElevenLabs conversation history
export async function getConversationTranscript(conversationId: string): Promise<string> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`ElevenLabs API error: ${res.status}`);
  }

  const data = await res.json();
  const transcript = data.transcript
    ?.map((t: { role: string; message: string }) => `${t.role}: ${t.message}`)
    .join("\n");

  return transcript || "";
}
