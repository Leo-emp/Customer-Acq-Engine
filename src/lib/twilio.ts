// ── Twilio voice call client ──

const TWILIO_API = "https://api.twilio.com/2010-04-01";

function getAuth() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) throw new Error("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER must be set");
  return { sid, token, from };
}

// initiate an outbound call with a TwiML webhook
export async function makeOutboundCall(toNumber: string, webhookUrl: string): Promise<{ callSid: string; status: string }> {
  const { sid, token, from } = getAuth();

  const params = new URLSearchParams({
    To: toNumber,
    From: from,
    Url: webhookUrl,
    Method: "POST",
    Record: "true",
    StatusCallback: webhookUrl.replace("/twiml", "/status"),
    StatusCallbackMethod: "POST",
    StatusCallbackEvent: "completed",
  });

  const res = await fetch(`${TWILIO_API}/Accounts/${sid}/Calls.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twilio call failed (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return { callSid: data.sid, status: data.status };
}

// get call recording URL after call completes
export async function getCallRecording(callSid: string): Promise<string | null> {
  const { sid, token } = getAuth();

  const res = await fetch(`${TWILIO_API}/Accounts/${sid}/Calls/${callSid}/Recordings.json`, {
    headers: {
      Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (data.recordings?.length > 0) {
    return `${TWILIO_API}/Accounts/${sid}/Recordings/${data.recordings[0].sid}.mp3`;
  }
  return null;
}
