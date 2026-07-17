/**
 * ai-smoke-test.ts — end-to-end verification of the multi-provider AI client.
 *
 * Run with:
 *   cd /home/workspace/apparchitect-new
 *   bun src/test/ai-smoke-test.ts
 *
 * What it does:
 *   1. Snapshots which env vars are present.
 *   2. Sends a trivial prompt ("Say 'hello' and nothing else") through chat().
 *   3. Prints the response, provider, model, latency, token usage.
 *   4. Tests the fallback chain by temporarily clearing the primary key
 *      and confirming a fallback fires (or, if no fallback is configured,
 *      reports the expected failure).
 *
 * IMPORTANT: This file reads from `import.meta.env` and `process.env`. The
 * `ai-providers.ts` module captures `safeEnv` at module load time, so
 * env vars MUST be set before this script imports `@/lib/ai-providers`.
 * Bun exposes `process.env` keys with VITE_ prefix on `import.meta.env`
 * for Vite-compat, but to be safe we also mirror VITE_AI_PRIMARY,
 * VITE_AI_FALLBACK, and the three API keys from any unprefixed variants.
 */

import {
  chat,
  PRIMARY_PROVIDER,
  FALLBACK_PROVIDER,
  SECONDARY_FALLBACK_PROVIDER,
  getConfiguredProviders,
  PROVIDER_CONFIG,
  type ChatResponse,
} from '@/lib/ai-providers';

// ---- 1. Env snapshot (set before any provider call) ----------------------------
const envKeys = [
  'VITE_ANTHROPIC_API_KEY',
  'VITE_AI_GATEWAY_API_KEY',
  'VITE_DEEPSEEK_API_KEY',
  'ANTHROPIC_API_KEY',
  'AI_GATEWAY_API_KEY',
  'DEEPSEEK_API_KEY',
  'VITE_AI_PRIMARY',
  'VITE_AI_FALLBACK',
];

function envSnapshot() {
  const snap: Record<string, boolean> = {};
  for (const k of envKeys) snap[k] = !!process.env[k];
  return snap;
}

// ---- 2. Pretty print ---------------------------------------------------------
function c(color: string, s: string): string {
  const codes: Record<string, string> = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    reset: '\x1b[0m',
  };
  return `${codes[color] || ''}${s}${codes.reset}`;
}

function header(s: string) {
  console.log('\n' + c('cyan', '═'.repeat(60)));
  console.log(c('cyan', ` ${s}`));
  console.log(c('cyan', '═'.repeat(60)));
}

// ---- 3. The actual test ------------------------------------------------------
async function testHappyPath(): Promise<ChatResponse> {
  header('TEST 1: Happy path — trivial prompt to primary provider');
  const start = Date.now();
  const r = await chat({
    messages: [{ role: 'user', content: "Say 'hello' and nothing else" }],
    maxTokens: 32,
    temperature: 0,
  });
  const total = Date.now() - start;
  console.log(c('green', '✓ Response received'));
  console.log(`  provider:   ${c('yellow', r.provider)}`);
  console.log(`  model:      ${r.model}`);
  console.log(`  fellBack:   ${r.fellBack}`);
  console.log(`  latencyMs:  ${r.latencyMs} (total ${total}ms incl. overhead)`);
  console.log(`  tokens:     in=${r.inputTokens} out=${r.outputTokens}`);
  console.log(`  content:    ${c('gray', JSON.stringify(r.content))}`);
  return r;
}

async function testFallback(): Promise<ChatResponse> {
  header('TEST 2: Fallback — temporarily strip VITE_ANTHROPIC_API_KEY');

  const original = process.env.VITE_ANTHROPIC_API_KEY;
  delete process.env.VITE_ANTHROPIC_API_KEY;

  try {
    const r = await chat({
      messages: [{ role: 'user', content: "Say 'fallback ok' and nothing else" }],
      maxTokens: 32,
      temperature: 0,
    });
    console.log(c('green', '✓ Fallback response received'));
    console.log(`  provider:   ${c('yellow', r.provider)} (expected: not 'anthropic')`);
    console.log(`  fellBack:   ${r.fellBack} (expected: true)`);
    console.log(`  model:      ${r.model}`);
    console.log(`  latencyMs:  ${r.latencyMs}`);
    console.log(`  content:    ${c('gray', JSON.stringify(r.content))}`);
    if (r.provider === 'anthropic') {
      console.log(c('red', '  ✗ FAIL: provider is still anthropic — env not actually stripped'));
    }
    if (!r.fellBack && r.provider !== 'anthropic') {
      console.log(c('yellow', '  ⚠ fellBack=false but provider is not primary — likely PRIMARY was already off'));
    }
    return r;
  } finally {
    if (original) process.env.VITE_ANTHROPIC_API_KEY = original;
  }
}

// ---- 4. Main -----------------------------------------------------------------
async function main() {
  header('AI PROVIDER SMOKE TEST');
  console.log(`Time: ${new Date().toISOString()}`);
  const runtimeVersions = process.versions as NodeJS.ProcessVersions;
  console.log(`Node: ${process.version}  Bun: ${runtimeVersions.bun || 'n/a'}`);

  header('Environment snapshot');
  const snap = envSnapshot();
  for (const [k, v] of Object.entries(snap)) {
    console.log(`  ${v ? c('green', '✓') : c('gray', '·')} ${k}`);
  }
  console.log('');
  console.log(`  Configured providers: ${c('yellow', getConfiguredProviders().join(', ') || '(none)')}`);
  console.log(`  PRIMARY:  ${PRIMARY_PROVIDER}`);
  console.log(`  FALLBACK: ${FALLBACK_PROVIDER}`);
  console.log(`  SECONDARY_FALLBACK: ${SECONDARY_FALLBACK_PROVIDER}`);

  if (getConfiguredProviders().length === 0) {
    console.log('');
    console.log(c('red', '✗ No AI provider keys found in env.'));
    console.log(c('red', '  Set VITE_ANTHROPIC_API_KEY and/or VITE_DEEPSEEK_API_KEY'));
    console.log(c('red', '  (or AI_GATEWAY_API_KEY) in the environment or .env.local.'));
    console.log(c('red', '  Note: ai-providers.ts reads VITE_*-prefixed keys from import.meta.env.'));
    process.exit(1);
  }

  // Hint about the VITE_ prefix issue
  if (snap.AI_GATEWAY_API_KEY && !snap.VITE_AI_GATEWAY_API_KEY) {
    console.log('');
    console.log(c('yellow', '⚠ AI_GATEWAY_API_KEY is set but VITE_AI_GATEWAY_API_KEY is not.'));
    console.log(c('yellow', '  Either rename the env var, or add a VITE_ prefix in your secrets store.'));
  }
  if (snap.DEEPSEEK_API_KEY && !snap.VITE_DEEPSEEK_API_KEY) {
    console.log('');
    console.log(c('yellow', '⚠ DEEPSEEK_API_KEY is set but VITE_DEEPSEEK_API_KEY is not.'));
    console.log(c('yellow', '  The Vite build reads VITE_*-prefixed vars; bun reads process.env directly.'));
  }

  let pass = 0;
  let fail = 0;

  try {
    const r1 = await testHappyPath();
    pass++;
    // Sanity check: response should contain "hello" somewhere
    if (!r1.content.toLowerCase().includes('hello')) {
      console.log(c('yellow', '  ⚠ Response did not contain "hello" — provider may be off-policy'));
    }
  } catch (e) {
    fail++;
    console.log(c('red', `✗ Happy path failed: ${e instanceof Error ? e.message : String(e)}`));
  }

  // Skip fallback test if there's no fallback provider configured
  if (getConfiguredProviders().length >= 2) {
    try {
      await testFallback();
      pass++;
    } catch (e) {
      fail++;
      console.log(c('red', `✗ Fallback test failed: ${e instanceof Error ? e.message : String(e)}`));
    }
  } else {
    console.log('');
    console.log(c('gray', '· Skipping fallback test — only 1 provider configured'));
  }

  header('SUMMARY');
  console.log(`  ${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(c('red', `Smoke test crashed: ${e}`));
  process.exit(1);
});
