export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantResponse {
  reply: string;
}

const DEMO_ENDPOINT = import.meta.env.VITE_ASSISTANT_ENDPOINT || '';
const TIMEOUT_MS = 8000;

const FALLBACK_REPLY =
  "I'm busy right now. Please explore the portfolio and come back in a little while.";

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms),
  );
}

function isValidResponse(data: unknown): data is AssistantResponse {
  if (typeof data !== 'object' || data === null || !('reply' in data)) return false;
  const reply = (data as Record<string, unknown>).reply;
  return typeof reply === 'string' && reply.trim().length > 0;
}

export async function sendAssistantMessage(message: string): Promise<string> {
  if (!DEMO_ENDPOINT) {
    await new Promise((r) => setTimeout(r, 600));
    return FALLBACK_REPLY;
  }

  try {
    const res = await Promise.race([
      fetch(DEMO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      }),
      timeout(TIMEOUT_MS),
    ]);

    if (!res.ok) return FALLBACK_REPLY;

    const data: unknown = await res.json();
    if (!isValidResponse(data)) return FALLBACK_REPLY;

    return data.reply;
  } catch {
    return FALLBACK_REPLY;
  }
}
