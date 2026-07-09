# AppArchitect – AI Integration Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Implements AI/LLM provider integration, prompt construction, and response validation
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | AI Integration Agent |
| **Role** | Integrate model calls, build prompts, validate responses, manage tokens |
| **Type** | Code / AI |
| **Operates On** | LLM client, prompt templates, response schemas, retry logic, token tracking |
| **Triggered By** | Orchestrator phase unlock (after Database Agent COMPLETE) |
| **Blocking?** | Yes — blocks Backend Agent (no AI calls possible without client) |

## 2. Mission Statement

The AI Integration Agent builds the LLM client, the prompt construction system, the response validation layer, and the retry / fallback logic. Every AI call in AppArchitect must go through this layer. The agent enforces the LLM Schema Integrity Contract (Core Systems PRD §6.5), constructs prompts per Safety PRD Domain 2 (AI Role Boundaries), never sends PII to the model, and never surfaces raw model errors to the client. It also tracks token usage for cost observability and rate-limit awareness.

## 3. Scope

### 3.1 In Scope
- LLM client wrapper (single source for all model calls)
- Prompt template registry (system + user templates per use case)
- Response validation (Zod schemas per use case)
- Retry logic (exponential backoff, max retries, fallback)
- Token usage tracking
- Model selection configuration
- Streaming support (SSE-friendly response chunks)
- Cost guardrails (max tokens per call, per project, per day)
- Provider failover (if primary provider is unavailable, fallback to secondary)
- Safety boundary reminders in every system prompt

### 3.2 Out of Scope
- Generating the actual PRD content (Documentation Agent)
- Application business logic (Backend Agent)
- Model fine-tuning
- Custom model training
- Vector store / RAG (not in MVP)
- Multimodal inputs (not in MVP)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `coreSystemsPRD` | Documentation Agent | Markdown | Yes |
| `safetyPRD` | Documentation Agent | Markdown | Yes |
| `providerConfig` | Env & Secrets Reference | JSON | Yes |
| `responseSchemas` | Core Systems PRD §6.5 | Zod | Yes |

### 4.2 Input Schemas
```typescript
type LLMCallRequest = {
  useCase: 'interview_question' | 'interview_analysis' | 'team_synthesis' | 'document_generation' | 'collaboration_map';
  systemPrompt: string;        // includes safety boundaries per Safety PRD §5
  userPrompt: string;          // includes context, state, allowed actions
  responseSchema: ZodSchema;   // Zod schema for validation
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

type LLMCallResponse<T> = {
  success: true;
  data: T;                     // validated against responseSchema
  usage: { inputTokens: number; outputTokens: number; totalTokens: number };
  durationMs: number;
} | {
  success: false;
  error: {
    code: 'EXT_AI_TIMEOUT' | 'EXT_AI_INVALID_RESPONSE' | 'EXT_AI_RATE_LIMITED' | 'EXT_AI_PROVIDER_UNAVAILABLE';
    message: string;           // from Content & Copy PRD
  };
  retryable: boolean;
}
```

### 4.3 Input Validation Rules
- `useCase` must be in allowed list
- `systemPrompt` must include required safety boundary phrases
- `responseSchema` must be a valid Zod schema

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| LLM client | `/lib/llm/client.ts` | TypeScript | Yes |
| Prompt registry | `/lib/llm/prompts/*.ts` | TypeScript | Yes |
| Response schemas | `/lib/llm/schemas.ts` | Zod | Yes |
| Token tracker | `/lib/llm/usage.ts` | TypeScript | Yes |
| Cost guardrails | `/lib/llm/limits.ts` | TypeScript | Yes |
| Sign-off report | Orchestrator | JSON | Yes |

### 5.2 Output Schemas
**AISignOff**
```typescript
type AISignOff = {
  providerConfigured: 'anthropic' | 'openai' | 'google';
  modelId: string;
  maxTokensPerCall: number;
  maxTokensPerProjectPerDay: number;
  retriesConfigured: number;
  fallbackProvider: 'anthropic' | 'openai' | 'google' | null;
  allPromptsIncludeSafetyBoundaries: boolean;
  allResponsesValidatedByZod: boolean;
  costGuardrailEnforced: boolean;
  issues: Array<{ severity: string; description: string }>;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Configure Provider**
- Read provider config from env vars
- Initialize client with API key, model ID
- Set max tokens, temperature defaults
- Configure request timeout (30s default)

**Step 2: Build Prompt Registry**
- One prompt template per use case:
  - `interview_question`: asks next adaptive question
  - `interview_analysis`: detects ambiguity, extracts requirements
  - `team_synthesis`: proposes agent team
  - `document_generation`: fills a PRD template
  - `collaboration_map`: defines inter-agent interactions
- Every system prompt includes: role definition, user context placeholder, current state, allowed actions, safety boundary reminders

**Step 3: Build Response Schemas**
- One Zod schema per use case
- Strict validation: no extra fields, all required fields present
- On validation failure: log `EXT_AI_INVALID_RESPONSE` (no content logged), return fallback

**Step 4: Implement Retry & Fallback**
- Retry on: timeout, 5xx, 429 with `Retry-After`
- Max 2 retries with exponential backoff (1s, 4s)
- Fallback to secondary provider if primary fails after retries
- Final fallback: return static fallback message from Content PRD

**Step 5: Token Usage Tracking**
- Log every call's usage to `audit_logs` (event `LLM_CALL`)
- Track per-user, per-project, per-day totals
- Enforce daily limit per project; if exceeded, return `EXT_AI_RATE_LIMITED`

**Step 6: Cost Guardrails**
- `MAX_TOKENS_PER_CALL` (default: 4000)
- `MAX_TOKENS_PER_PROJECT_PER_DAY` (default: 500,000)
- On exceed: return fallback, log event

**Step 7: Streaming Support**
- For document generation: stream chunks via SSE
- Validate each chunk if schema-validatable
- Reassemble full response at end

**Step 8: Safety Boundary Enforcement**
- Every system prompt includes:
  - "You are a Senior Product Architect. Do not claim medical, legal, or therapeutic authority."
  - "Never claim to be a human. You are an AI assistant."
  - "If user input contains crisis language, do not provide therapeutic content. Output the crisis acknowledgment."
  - "Never share PII you may have seen in other contexts."

**Step 9: Sign-off**
- Emit `AISignOff`
- Set `handoffReady: true` only if all checks pass

### 6.2 Decision Logic
**Decision: Retry or fallback**
```
IF error is 429 and Retry-After is short (< 60s)
THEN wait, retry
ELSE IF error is 5xx and retries < 2
THEN retry with backoff
ELSE IF fallback provider configured
THEN call fallback
ELSE return static fallback message
```

**Decision: Stream or batch**
```
IF use case is document_generation AND total expected tokens > 1000
THEN stream
ELSE batch
```

### 6.3 Iteration Behavior
- Iterates over: use cases (interview, synthesis, generation, etc.)
- On per-use-case failure: log, continue, fix in final pass

### 6.4 Concurrency Rules
- May run concurrently with: most agents (read-only on prompts)
- Must not run concurrently with: another AI Integration Agent

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| Provider timeout | Retry, then fallback |
| Provider rate limit | Wait per `Retry-After`, retry |
| Provider returns malformed JSON | Validation fails, fallback |
| Daily token limit exceeded | Return `EXT_AI_RATE_LIMITED`, fallback |
| Provider unavailable | Fallback to secondary |
| Both providers unavailable | Return static fallback message |
| Streaming chunk fails mid-stream | Reassemble partial, return fallback at end |
| User input contains crisis language | Safety overlay: replace response with crisis acknowledgment |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Core Systems PRD | §6.5 (LLM Schema Integrity Contract) |
| Safety, Privacy & Control PRD | §5 (AI Role Boundaries), §8 (Logging) |
| Technical Architecture PRD | §8 (AI Integration) |
| Data & Integration PRD | AI provider entry |
| Environment & Secrets Reference | AI-related env vars |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must run after | Database Agent | Token usage log table |
| Must run after | Data Integration Agent | Provider API access |
| Must run before | Backend Agent | Cannot make calls without client |
| Must run before | Documentation Agent | Cannot generate without prompts |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| Primary AI provider | All LLM calls | Critical — fallback to secondary |
| Secondary AI provider | Fallback | Degraded but functional |
| Token usage store | Cost tracking | High (loss of cost visibility) |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `EXT_AI_TIMEOUT` | Provider timeout | Medium | Retry, fallback |
| `EXT_AI_INVALID_RESPONSE` | Response failed Zod validation | Medium | Retry, fallback |
| `EXT_AI_RATE_LIMITED` | Daily token limit hit | High | Wait or upgrade plan |
| `EXT_AI_PROVIDER_UNAVAILABLE` | Provider 5xx or unreachable | High | Fallback |
| `EXT_AI_AUTH_FAILED` | Invalid API key | Critical | Alert, fix env |
| `LLM_PROMPT_MISSING_SAFETY` | Prompt missing safety reminder | Critical | Add reminder, do not allow call |

## 10. Logging & Observability
- Log every LLM call (event `LLM_CALL`) with use case, model, input tokens, output tokens, duration, success/failure — no content
- Log validation failures (event `LLM_VALIDATION_FAILED`) with use case, no content
- Log fallback usage (event `LLM_FALLBACK_USED`) with from/to provider
- Never log: full prompts, full responses, user PII, raw model errors

## 11. Acceptance Criteria
- [ ] Single LLM client used by all agents
- [ ] All prompts include safety boundary reminders
- [ ] All responses validated by Zod before downstream use
- [ ] Retry + fallback logic tested
- [ ] Token usage tracked per call, per project, per day
- [ ] Cost guardrails enforced
- [ ] Streaming supported for document generation
- [ ] No raw prompts/responses in logs
- [ ] AISignOff all PASS

## 12. Test Cases
- 12.1 Happy: model returns valid schema → data returned.
- 12.2 Error: model returns invalid JSON → `EXT_AI_INVALID_RESPONSE`, fallback.
- 12.3 Edge: provider down for 30s → fallback provider used.

---

**END OF AI INTEGRATION AGENT PRD**