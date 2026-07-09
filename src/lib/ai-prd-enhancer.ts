/**
 * ai-prd-enhancer.ts — wraps a template-filled PRD with real LLM-generated prose.
 *
 * The template-filler produces a structurally complete PRD but leaves
 * `[USER-UNSPECIFIED]` placeholders everywhere the user didn't give detail.
 * This module sends each doc through the multi-provider AI to flesh out
 * the skeleton into real, RLM-compliant, domain-specific content.
 *
 * Falls back to the template-only output if the AI call fails or no
 * provider is configured. The skeleton is always shippable; the AI
 * enhancement is an upgrade, not a requirement.
 *
 * Used by: hooks/use-prd-generator-v2.ts
 */

import { chat, type ChatResponse } from './ai-providers';
import type { InterviewAnswers } from '@/types/interview';

// ============================================================================
// §1 - ENHANCEMENT PROMPT
// ============================================================================

const SYSTEM_PROMPT = `You are a senior product manager writing build-ready PRDs. You produce zero-ambiguity, RLM-compliant, dense prose. Never use filler phrases like "it's important to note" or "in conclusion." Output ONLY the enhanced document — no preamble, no apology, no markdown code fences wrapping the whole document unless the section calls for code.

Rules:
1. Keep all existing structure (headings, tables, code blocks, placeholders that are NOT [USER-UNSPECIFIED]).
2. Replace every [USER-UNSPECIFIED] with concrete content derived from the interview answers provided.
3. If a section has no placeholders but lacks detail, expand it with realistic, RLM-compliant content using the interview context.
4. Match the section's required density: tier-1 PRDs (Safety, Core Systems) need O(P×U) density where P=plans, U=users; reference PRDs need O(1)-O(N) density.
5. Never invent specific numbers unless the interview gave them — use "TBD" or "configurable" instead.
6. Cross-reference higher-tier PRDs (Safety overrides everything) when relevant.
7. Preserve any precedence compliance blocks, mermaid diagrams, and acceptance criteria tables verbatim.`;

function buildUserPrompt(
  document: string,
  answers: InterviewAnswers,
  docTitle: string,
  docCategory: 'base' | 'reference' | 'operational' | 'auxiliary' | 'agent'
): string {
  const answersJson = JSON.stringify(answers, null, 2);
  return `# Enhancement Task

## Target Document
- Title: ${docTitle}
- Category: ${docCategory}

## Interview Answers (source of truth)
\`\`\`json
${answersJson}
\`\`\`

## Current Document (with [USER-UNSPECIFIED] placeholders)
\`\`\`markdown
${document}
\`\`\`

## Your Task
Return the fully enhanced document with every [USER-UNSPECIFIED] replaced by concrete content derived from the interview answers. Keep structure, expand where needed, maintain RLM compliance. Return ONLY the enhanced document.`;
}

// ============================================================================
// §2 - SINGLE-DOC ENHANCEMENT
// ============================================================================

export interface EnhancementResult {
  content: string;
  enhanced: boolean;
  provider: string | null;
  model: string | null;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  error: string | null;
}

export async function enhanceDocument(
  document: string,
  answers: InterviewAnswers,
  docTitle: string,
  docCategory: 'base' | 'reference' | 'operational' | 'auxiliary' | 'agent' = 'base',
  options: {
    maxTokens?: number;
    temperature?: number;
    timeoutMs?: number;
  } = {}
): Promise<EnhancementResult> {
  const start = Date.now();
  const { maxTokens = 4096, temperature = 0.3, timeoutMs = 120_000 } = options;

  // If there are no [USER-UNSPECIFIED] markers and the doc is already
  // dense, skip the round-trip to save tokens.
  if (!document.includes('[USER-UNSPECIFIED]') && document.length > 2000) {
    return {
      content: document,
      enhanced: false,
      provider: null,
      model: null,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      error: null,
    };
  }

  try {
    const response: ChatResponse = await Promise.race([
      chat({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(document, answers, docTitle, docCategory) },
        ],
        maxTokens,
        temperature,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Enhancement timed out after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);

    return {
      content: response.content,
      enhanced: true,
      provider: response.provider,
      model: response.model,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      latencyMs: Date.now() - start,
      error: null,
    };
  } catch (err) {
    // Fall back to the template — never fail the generation pipeline.
    return {
      content: document,
      enhanced: false,
      provider: null,
      model: null,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ============================================================================
// §3 - BATCH ENHANCEMENT (PARALLEL, RATE-LIMITED)
// ============================================================================

export interface BatchEnhancementOptions {
  concurrency?: number;
  maxTokens?: number;
  onProgress?: (completed: number, total: number, currentTitle: string) => void;
}

export async function enhanceDocumentBatch(
  documents: Array<{ id: string; title: string; content: string; category: 'base' | 'reference' | 'operational' | 'auxiliary' | 'agent' }>,
  answers: InterviewAnswers,
  options: BatchEnhancementOptions = {}
): Promise<Map<string, EnhancementResult>> {
  const { concurrency = 3, onProgress } = options;
  const results = new Map<string, EnhancementResult>();
  const queue = [...documents];
  let completed = 0;

  async function worker() {
    while (queue.length > 0) {
      const doc = queue.shift();
      if (!doc) return;
      const result = await enhanceDocument(doc.content, answers, doc.title, doc.category);
      results.set(doc.id, result);
      completed++;
      onProgress?.(completed, documents.length, doc.title);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, documents.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
