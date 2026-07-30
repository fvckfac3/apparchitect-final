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

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json',
  };
  const { supabase } = await import('@/integrations/supabase/client');
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) headers.authorization = `Bearer ${session.access_token}`;
  }
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify(req),
    signal: AbortSignal.timeout(125_000),
  });
  const data = await response.json().catch(() => ({})) as Partial<ChatResponse> & { error?: string };
  if (!response.ok) throw new Error(data.error || `AI request failed (${response.status})`);
  if (typeof data.content !== 'string' || !data.provider || !data.model) throw new Error('AI returned an invalid response');
  return {
    content: data.content,
    provider: data.provider,
    model: data.model,
    inputTokens: data.inputTokens || 0,
    outputTokens: data.outputTokens || 0,
    latencyMs: data.latencyMs || 0,
    fellBack: Boolean(data.fellBack),
  };
}

export function getConfiguredProviders(): AIProvider[] {
  return ['anthropic', 'vercel-gateway', 'deepseek'];
}
