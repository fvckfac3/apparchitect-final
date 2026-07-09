/**
 * ai-enhance-smoke.ts - end-to-end test for enhanceDocument().
 * Calls the multi-provider AI to enhance a real PRD document with
 * [USER-UNSPECIFIED] placeholders, asserts the placeholders are filled
 * and reports the actual cost/latency.
 *
 * Run with: bun src/test/ai-enhance-smoke.ts
 */
import { enhanceDocument } from '@/lib/ai-prd-enhancer';
import type { InterviewAnswers } from '@/types/interview';

const sampleDoc = `
# Test PRD

## Overview
[USER-UNSPECIFIED] is the core value proposition.

## Target audience
[USER-UNSPECIFIED] are the primary users we serve.

## Pricing
[USER-UNSPECIFIED]
`;

const sampleAnswers: InterviewAnswers = {
  appName: 'TestApp',
  appDescription: 'A test application for verifying AI enhancement',
  targetAudience: 'Solo founders building their first MVP',
  pricingModel: 'freemium',
} as unknown as InterviewAnswers;

const start = Date.now();
const result = await enhanceDocument(
  sampleDoc,
  sampleAnswers,
  'Test PRD',
  'base',
  { maxTokens: 1024, timeoutMs: 30_000 },
);
const elapsed = Date.now() - start;

const placeholdersBefore = (sampleDoc.match(/\[USER-UNSPECIFIED\]/g) || []).length;
const placeholdersAfter = (result.content.match(/\[USER-UNSPECIFIED\]/g) || []).length;

console.log('---');
console.log('enhanceDocument() end-to-end:');
console.log('  enhanced:    ', result.enhanced);
console.log('  provider:    ', result.provider ?? '(none - template fallback)');
console.log('  model:       ', result.model ?? '(none)');
console.log('  in/out tok:  ', result.inputTokens, '/', result.outputTokens);
console.log('  latencyMs:   ', result.latencyMs, '(total', elapsed, 'ms)');
console.log('  error:       ', result.error ?? '(none)');
console.log('  placeholders:', placeholdersBefore, '->', placeholdersAfter);
console.log('  content len: ', sampleDoc.length, '->', result.content.length);
console.log('---');
console.log(result.content.slice(0, 400));
console.log('...');
process.exit(placeholdersAfter < placeholdersBefore ? 0 : 1);
