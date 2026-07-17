/**
 * ai-providers.ts — multi-provider AI client with automatic fallback.
 *
 * Providers (in priority order):
 *   1. Anthropic  (claude-sonnet-5)        — primary for most tasks
 *   2. MiniMax M3 (via Vercel AI Gateway) — fallback for cost-sensitive long-context work
 *   3. DeepSeek   (deepseek-chat)         — last-resort fallback
 *
 * Override with env vars: VITE_AI_PRIMARY, VITE_AI_FALLBACK, VITE_AI_SECONDARY
 *
 * Env vars (Zo Settings > Advanced):
 *   VITE_ANTHROPIC_API_KEY      — primary
 *   VITE_AI_GATEWAY_API_KEY     — Vercel AI Gateway (for MiniMax M3 + others)
 *   VITE_DEEPSEEK_API_KEY       — last fallback
 *   VITE_AI_PRIMARY             — override primary provider id
 *   VITE_AI_FALLBACK            — override fallback provider id
 *
 * Browser-safe: this file is imported by the Vite client bundle. Anthropic
 * is called with the "anthropic-dangerous-direct-browser-access" header;
 * Vercel AI Gateway is safe for browser use; DeepSeek uses Bearer auth.
 */

export type AIProvider = 'anthropic' | 'vercel-gateway' | 'deepseek';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  model?: string;
  context?: string;
}

export interface ChatResponse {
  content: string;
  provider: AIProvider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  fellBack: boolean;
}

export interface ProviderConfig {
  id: AIProvider;
  displayName: string;
  baseUrl: string;
  defaultModel: string;
  apiKeyEnv: string;
  authHeader: 'x-api-key' | 'Authorization' | 'bearer';
  extraHeaders?: Record<string, string>;
}

export const PROVIDER_CONFIG: Record<AIProvider, ProviderConfig> = {
  anthropic: {
    id: 'anthropic',
    displayName: 'Anthropic (Claude)',
    baseUrl: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-sonnet-5',
    apiKeyEnv: 'VITE_ANTHROPIC_API_KEY',
    authHeader: 'x-api-key',
    extraHeaders: {
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
  },
  'vercel-gateway': {
    id: 'vercel-gateway',
    displayName: 'Vercel AI Gateway (MiniMax M3)',
    baseUrl: 'https://ai-gateway.vercel.sh/v1/chat/completions',
    defaultModel: 'minimax/minimax-m3',
    apiKeyEnv: 'VITE_AI_GATEWAY_API_KEY',
    authHeader: 'bearer',
  },
  deepseek: {
    id: 'deepseek',
    displayName: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1/chat/completions',
    defaultModel: 'deepseek-chat',
    apiKeyEnv: 'VITE_DEEPSEEK_API_KEY',
    authHeader: 'Authorization',
  },
};

const safeEnv: Record<string, string | undefined> =
  typeof import.meta !== 'undefined' ? import.meta.env : {};

export const PRIMARY_PROVIDER: AIProvider =
  (safeEnv.VITE_AI_PRIMARY as AIProvider) || 'anthropic';
export const FALLBACK_PROVIDER: AIProvider =
  (safeEnv.VITE_AI_FALLBACK as AIProvider) || 'vercel-gateway';
export const SECONDARY_FALLBACK_PROVIDER: AIProvider = 'deepseek';

function buildHeaders(cfg: ProviderConfig, apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(cfg.extraHeaders || {}),
  };
  switch (cfg.authHeader) {
    case 'x-api-key':
      headers['x-api-key'] = apiKey;
      break;
    case 'Authorization':
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
    case 'bearer':
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
  }
  return headers;
}

async function callAnthropic(apiKey: string, req: ChatRequest, model: string): Promise<ChatResponse> {
  const cfg = PROVIDER_CONFIG.anthropic;
  const systemMsg = req.messages.find((m) => m.role === 'system')?.content;
  const body = {
    model,
    max_tokens: req.maxTokens ?? 4096,
    temperature: req.temperature ?? 0.7,
    ...(systemMsg ? { system: systemMsg } : {}),
    messages: req.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content })),
  };
  const r = await fetch(cfg.baseUrl, {
    method: 'POST',
    headers: buildHeaders(cfg, apiKey),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  if (!r.ok) {
    const errText = (await r.text().catch(() => '')).slice(0, 300);
    throw new Error(`Anthropic ${r.status}: ${errText}`);
  }
  const d = await r.json();
  return {
    content: d.content?.[0]?.text ?? '',
    provider: 'anthropic',
    model,
    inputTokens: d.usage?.input_tokens ?? 0,
    outputTokens: d.usage?.output_tokens ?? 0,
    latencyMs: 0,
    fellBack: false,
  };
}

async function callVercelGateway(
  apiKey: string,
  req: ChatRequest,
  model: string,
): Promise<ChatResponse> {
  const cfg = PROVIDER_CONFIG['vercel-gateway'];
  const body = {
    model,
    max_tokens: req.maxTokens ?? 4096,
    temperature: req.temperature ?? 0.7,
    messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
  };
  const r = await fetch(cfg.baseUrl, {
    method: 'POST',
    headers: buildHeaders(cfg, apiKey),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  if (!r.ok) {
    const errText = (await r.text().catch(() => '')).slice(0, 300);
    throw new Error(`VercelGateway ${r.status}: ${errText}`);
  }
  const d = await r.json();
  return {
    content: d.choices?.[0]?.message?.content ?? '',
    provider: 'vercel-gateway',
    model,
    inputTokens: d.usage?.prompt_tokens ?? 0,
    outputTokens: d.usage?.completion_tokens ?? 0,
    latencyMs: 0,
    fellBack: false,
  };
}

async function callDeepSeek(apiKey: string, req: ChatRequest, model: string): Promise<ChatResponse> {
  const cfg = PROVIDER_CONFIG.deepseek;
  const body = {
    model,
    max_tokens: req.maxTokens ?? 4096,
    temperature: req.temperature ?? 0.7,
    messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
  };
  const r = await fetch(cfg.baseUrl, {
    method: 'POST',
    headers: buildHeaders(cfg, apiKey),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  if (!r.ok) {
    const errText = (await r.text().catch(() => '')).slice(0, 300);
    throw new Error(`DeepSeek ${r.status}: ${errText}`);
  }
  const d = await r.json();
  return {
    content: d.choices?.[0]?.message?.content ?? '',
    provider: 'deepseek',
    model,
    inputTokens: d.usage?.prompt_tokens ?? 0,
    outputTokens: d.usage?.completion_tokens ?? 0,
    latencyMs: 0,
    fellBack: false,
  };
}

type Caller = (apiKey: string, req: ChatRequest, model: string) => Promise<ChatResponse>;

const CALLERS: Record<AIProvider, Caller> = {
  anthropic: callAnthropic,
  'vercel-gateway': callVercelGateway,
  deepseek: callDeepSeek,
};

function shouldFallback(err: unknown): boolean {
  if (!(err instanceof Error)) return true;
  return /timeout|abort|network|429|5\d\d|401|403|400/.test(err.message);
}

async function tryProvider(
  id: AIProvider,
  req: ChatRequest,
): Promise<ChatResponse | null> {
  const cfg = PROVIDER_CONFIG[id];
  const apiKey = safeEnv[cfg.apiKeyEnv];
  if (!apiKey) return null;
  const caller = CALLERS[id];
  const model = req.model ?? cfg.defaultModel;
  const t0 = Date.now();
  const result = await caller(apiKey, req, model);
  result.latencyMs = Date.now() - t0;
  return result;
}

/**
 * Call the primary provider, with automatic fallback to two backup
 * providers in order. If all providers fail or none are configured,
 * throws an Error with the last underlying error message.
 */
export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const chain: AIProvider[] = [
    PRIMARY_PROVIDER,
    FALLBACK_PROVIDER,
    SECONDARY_FALLBACK_PROVIDER,
  ];
  // Dedupe so primary==fallback doesn't double-call.
  const seen = new Set<AIProvider>();
  const ordered = chain.filter((p) => (seen.has(p) ? false : (seen.add(p), true)));

  let lastError: Error | null = null;
  let fellBack = false;
  for (const id of ordered) {
    try {
      const result = await tryProvider(id, req);
      if (result) {
        if (fellBack) result.fellBack = true;
        return result;
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (!shouldFallback(lastError)) throw lastError;
    }
    fellBack = true;
  }
  throw new Error(
    `No AI provider available. Last error: ${lastError?.message || 'no providers configured'}. ` +
      `Set VITE_ANTHROPIC_API_KEY, VITE_AI_GATEWAY_API_KEY, or VITE_DEEPSEEK_API_KEY.`,
  );
}

export function getConfiguredProviders(): AIProvider[] {
  return (Object.keys(PROVIDER_CONFIG) as AIProvider[]).filter((id) => {
    return !!safeEnv[PROVIDER_CONFIG[id].apiKeyEnv];
  });
}
