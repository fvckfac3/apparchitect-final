import type { Context } from 'hono';
import { timingSafeEqual } from 'node:crypto';

type Provider = 'anthropic' | 'vercel-gateway' | 'deepseek';
type Message = { role: 'system' | 'user' | 'assistant'; content: string };
type Body = { messages?: Message[]; maxTokens?: number; temperature?: number; model?: string };

type ProviderResult = {
  content: string;
  provider: Provider;
  model: string;
  inputTokens: number;
  outputTokens: number;
};

const PROVIDERS: Record<Provider, { key: string; model: string }> = {
  anthropic: { key: 'ANTHROPIC_API_KEY', model: 'claude-sonnet-5' },
  'vercel-gateway': { key: 'AI_GATEWAY_API_KEY', model: 'minimax/minimax-m3' },
  deepseek: { key: 'DEEPSEEK_API_KEY', model: 'deepseek-chat' },
};

function constantTimeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  const allowed = (process.env.APP_ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean);
  return allowed.length === 0 || allowed.includes(origin);
}

function validateBody(body: unknown): Body {
  if (!body || typeof body !== 'object') throw new Error('Invalid request body');
  const candidate = body as Body;
  if (!Array.isArray(candidate.messages) || candidate.messages.length === 0 || candidate.messages.length > 40) throw new Error('Messages are required');
  if (candidate.messages.some((message) => !message || !['system', 'user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || message.content.length > 120_000)) throw new Error('Invalid message');
  return {
    messages: candidate.messages,
    maxTokens: Math.min(Math.max(candidate.maxTokens ?? 4096, 1), 16_384),
    temperature: Math.min(Math.max(candidate.temperature ?? 0.3, 0), 1),
    model: candidate.model,
  };
}

async function callProvider(provider: Provider, body: Body, model: string): Promise<ProviderResult> {
  const key = process.env[PROVIDERS[provider].key];
  if (!key) throw new Error(`${provider} is not configured`);
  if (provider === 'anthropic') {
    const system = body.messages?.find((message) => message.role === 'system')?.content;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: body.maxTokens, temperature: body.temperature, ...(system ? { system } : {}), messages: body.messages?.filter((message) => message.role !== 'system') }),
      signal: AbortSignal.timeout(120_000),
    });
    const data = await response.json().catch(() => ({})) as { content?: Array<{ text?: string }>; usage?: { input_tokens?: number; output_tokens?: number }; error?: { message?: string } };
    if (!response.ok) throw new Error(data.error?.message || `Anthropic ${response.status}`);
    return { content: data.content?.[0]?.text || '', provider, model, inputTokens: data.usage?.input_tokens || 0, outputTokens: data.usage?.output_tokens || 0 };
  }
  const url = provider === 'deepseek' ? 'https://api.deepseek.com/v1/chat/completions' : 'https://ai-gateway.vercel.sh/v1/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, max_tokens: body.maxTokens, temperature: body.temperature, messages: body.messages }),
    signal: AbortSignal.timeout(120_000),
  });
  const data = await response.json().catch(() => ({})) as { choices?: Array<{ message?: { content?: string } }>; usage?: { prompt_tokens?: number; completion_tokens?: number }; error?: { message?: string } };
  if (!response.ok) throw new Error(data.error?.message || `${provider} ${response.status}`);
  return { content: data.choices?.[0]?.message?.content || '', provider, model, inputTokens: data.usage?.prompt_tokens || 0, outputTokens: data.usage?.completion_tokens || 0 };
}

export async function handleAiChat(c: Context): Promise<Response> {
  if (c.req.method !== 'POST') return c.json({ error: 'Method not allowed' }, 405);
  if (!isAllowedOrigin(c.req.header('origin'))) return c.json({ error: 'Origin not allowed' }, 403);
  const configuredToken = process.env.APP_AI_API_TOKEN;
  if (configuredToken) {
    const authorization = c.req.header('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!constantTimeEqual(token, configuredToken)) return c.json({ error: 'Unauthorized' }, 401);
  }
  let body: Body;
  try {
    body = validateBody(await c.req.json());
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Invalid request' }, 400);
  }
  const order: Provider[] = ['anthropic', 'vercel-gateway', 'deepseek'];
  let lastError = 'No AI provider configured';
  for (const provider of order) {
    const started = Date.now();
    try {
      const result = await callProvider(provider, body, body.model || PROVIDERS[provider].model);
      return c.json({ ...result, latencyMs: Date.now() - started, fellBack: provider !== order[0] });
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return c.json({ error: lastError }, 503);
}
