import { createClient } from '@supabase/supabase-js';
import type { IncomingMessage, ServerResponse } from 'node:http';

type Provider = 'anthropic' | 'vercel-gateway' | 'deepseek';
type Message = { role: 'system' | 'user' | 'assistant'; content: string };
type Body = { messages?: Message[]; maxTokens?: number; temperature?: number; model?: string };
type Request = IncomingMessage & { body?: unknown };
type Response = ServerResponse & {
  status: (code: number) => Response;
  json: (body: unknown) => void;
};

type ProviderResult = {
  content: string;
  provider: Provider;
  model: string;
  inputTokens: number;
  outputTokens: number;
};

const PROVIDERS: Record<Provider, { key: string; fallbackKey: string; model: string }> = {
  anthropic: { key: 'ANTHROPIC_API_KEY', fallbackKey: 'VITE_ANTHROPIC_API_KEY', model: 'claude-sonnet-5' },
  'vercel-gateway': { key: 'AI_GATEWAY_API_KEY', fallbackKey: 'VITE_AI_GATEWAY_API_KEY', model: 'minimax/minimax-m3' },
  deepseek: { key: 'DEEPSEEK_API_KEY', fallbackKey: 'VITE_DEEPSEEK_API_KEY', model: 'deepseek-chat' },
};

function configuredValue(name: string, fallbackName: string): string | undefined {
  return process.env[name] || process.env[fallbackName];
}

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  const configured = process.env.APP_ALLOWED_ORIGINS || 'https://apparchitect-final.vercel.app';
  const allowed = configured.split(',').map((item) => item.trim()).filter(Boolean);
  return allowed.includes(origin);
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

async function readBody(req: Request): Promise<unknown> {
  if (req.body !== undefined) return req.body;
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function requireUser(req: Request): Promise<boolean> {
  const authorization = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  if (!authorization.startsWith('Bearer ')) return false;
  const token = authorization.slice(7).trim();
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!token || !url || !key) return false;
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getUser(token);
  return !error && Boolean(data.user);
}

async function callProvider(provider: Provider, body: Body, model: string): Promise<ProviderResult> {
  const definition = PROVIDERS[provider];
  const key = configuredValue(definition.key, definition.fallbackKey);
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

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!isAllowedOrigin(typeof req.headers.origin === 'string' ? req.headers.origin : undefined)) {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }
  if (!(await requireUser(req))) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  let body: Body;
  try {
    body = validateBody(await readBody(req));
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    return;
  }
  const order: Provider[] = ['anthropic', 'vercel-gateway', 'deepseek'];
  let lastError = 'No AI provider configured';
  for (const provider of order) {
    const started = Date.now();
    try {
      const result = await callProvider(provider, body, body.model || PROVIDERS[provider].model);
      res.status(200).json({ ...result, latencyMs: Date.now() - started, fellBack: provider !== order[0] });
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  res.status(503).json({ error: lastError });
}
