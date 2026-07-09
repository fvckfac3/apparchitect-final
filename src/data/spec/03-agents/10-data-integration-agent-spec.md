# AppArchitect – Data Integration Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Owns external services, env vars, and contracts
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Data Integration Agent |
| **Role** | Manage external services, env vars, webhooks, and integration contracts |
| **Type** | Integration / Data |
| **Operates On** | Data & Integration PRD, env vars, third-party SDKs, webhook handlers |
| **Triggered By** | Orchestrator (initial) + Backend Agent (contract requests) + DevOps Agent (env var requests) |
| **Blocking?** | No (but required for all backend and infra work) |

## 2. Mission Statement

The Data Integration Agent is the single owner of every external service the app depends on, every environment variable, and every cross-system data contract. It defines request and response schemas, error handling strategies, rate limit handling, and fallback behavior for every integration. It also owns webhook signature verification and idempotency, and the startup validation that ensures no required env var is missing. It enforces the "no PII transmitted beyond stated purposes" and "no prohibited content in logs" invariants.

## 3. Scope

### 3.1 In Scope
- All external service integrations (auth, email, payments, AI, analytics, storage)
- API request and response schemas per integration
- Webhook signature verification and idempotency
- Environment variable registry
- Startup validation
- Secret rotation policies
- Rate limit handling per service
- Fallback behavior per service
- Cross-system data contracts (shared types and enums)
- Data flow diagrams

### 3.2 Out of Scope
- Internal API design (Backend Agent)
- Database schema (Database Agent)
- Visual UI (Frontend Agent)
- Authentication (Auth & Security Agent — this agent only handles auth provider integrations)
- Deployment (DevOps Agent)
- AI model selection and prompt construction (AI Integration Agent — this agent handles the SDK integration)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `technicalArchitecturePRD` | Documentation Agent | Markdown | Yes |
| `safetyPRD` | Documentation Agent | Markdown | Yes |
| `coreSystemsPRD` | Documentation Agent | Markdown | Yes |
| `errorStateRef` | Documentation Agent | Markdown | Yes |
| `serviceProviderDocs` | Various | URL/PDF | Per integration |
| `integrationRequest` | Backend / AI / Auth agents | JSON | Continuous |

### 4.2 Input Schemas
```typescript
type IntegrationSpec = {
  service: string;                // e.g. "OpenAI", "Stripe", "SendGrid"
  purpose: string;
  endpoints: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    purpose: string;
    calledWhen: string;
    rateLimit?: string;
  }>;
  credentials: Array<{
    envVar: string;
    description: string;
    required: boolean;
  }>;
  requestSchema: object;
  responseSchema: object;
  errors: Array<{
    trigger: string;
    errorCode: string;            // from Error & State Reference
    behavior: string;
  }>;
  fallback: string;
}

type EnvVar = {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'secret';
  required: boolean;
  environments: Array<'development' | 'preview' | 'staging' | 'production'>;
  rotationPolicy?: string;
  usedBy: string[];
}
```

### 4.3 Input Validation Rules
- Every integration must have at least one credential, one endpoint, and one error
- Every env var must be listed before any code that uses it is written
- Every error code used must exist in the Error & State Reference

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| Updated Data & Integration PRD | Documentation Agent | Markdown | On change |
| Updated Environment & Secrets Reference | Documentation Agent | Markdown | On change |
| `.env.example` (canonical) | Repository root | Bash | Yes |
| Startup validation module | Backend Agent | TypeScript | Yes |
| Webhook handlers | Backend Agent | TypeScript | Yes |
| Service client SDKs | Backend Agent | TypeScript | Yes |
| Integration tests | QA Agent | TypeScript | Yes |
| Sign-off report | Orchestrator | JSON | Yes |

### 5.2 Output Schemas
**DataIntegrationSignOff**
```typescript
type DataIntegrationSignOff = {
  allIntegrationsHaveContracts: boolean;
  allEnvVarsDocumented: boolean;
  allEnvVarsInEnvExample: boolean;
  allWebhooksSignatureVerified: boolean;
  allWebhooksIdempotent: boolean;
  startupValidationCatchesMissingVars: boolean;
  allExternalCallsTrimmedToMinimumFields: boolean;
  noSecretsInSource: boolean;
  issues: Array<{ severity: string; description: string }>;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Inventory All Integrations**
- For each external service the app uses, document:
  - Service name
  - Purpose
  - Endpoints called
  - Credentials required
  - Errors handled
  - Fallback behavior

**Step 2: Build Environment Variable Registry**
- For each env var:
  - Name
  - Description
  - Type
  - Required/optional
  - Environments
  - Used by
  - Rotation policy (if secret)
- Sync with `.env.example` (canonical template in Environment & Secrets Reference §7)

**Step 3: Build Service Client SDKs**
- For each integration, wrap the provider's SDK (or hand-rolled HTTP) in a typed client
- Validate every request against the request schema
- Validate every response against the response schema
- On schema failure: log `EXT_[SERVICE]_INVALID_RESPONSE`, return fallback
- On rate limit: retry after Retry-After
- On timeout: retry once, then fallback
- On auth failure: alert ops, do not retry

**Step 4: Build Webhook Handlers**
- One handler per inbound webhook
- Verify signature (HMAC or provider equivalent) before any processing
- Reject with 401 and `SEC_WEBHOOK_VERIFICATION_FAILED` if invalid
- Implement idempotency (store event ID, skip duplicates)
- Return 200 quickly; do heavy processing async

**Step 5: Build Startup Validation**
- Module that runs before server starts
- Checks all required env vars are present
- Logs clear error naming every missing var
- Exits with code 1 if any required var is absent
- Never silently continues

**Step 6: Document Cross-System Data Contracts**
- Shared types (used across multiple integrations)
- Shared enums
- Internal-only types that match external service shapes

**Step 7: PII Audit**
- For each integration, audit what PII is transmitted
- Justify every PII field
- Trim requests to minimum required fields
- Document in integration spec

**Step 8: Build Integration Tests**
- Each integration: valid creds → success
- Invalid creds → `EXT_[SERVICE]_AUTH_FAILED`
- Rate limit → retry logic fires
- Timeout → fallback
- Webhook: valid sig → processed; invalid sig → 401; duplicate event → skipped
- Schema mismatch → `EXT_[SERVICE]_INVALID_RESPONSE`

**Step 9: Coordinate with Backend Agent**
- Hand off service client SDKs
- Coordinate on integration into API routes

**Step 10: Coordinate with DevOps Agent**
- Hand off env var registry
- Coordinate on secrets management

**Step 11: Sign-off**
- Emit `DataIntegrationSignOff`
- Set `handoffReady: true` only if all checks pass

### 6.2 Decision Logic
**Decision: Error handling strategy**
```
IF error is transient (timeout, 5xx, rate limit)
THEN retry with exponential backoff, then fallback
ELSE IF error is auth failure
THEN alert ops, do not retry
ELSE IF error is schema validation failure
THEN log event (no content), return fallback
ELSE IF error is unknown
THEN return generic fallback, alert ops
```

**Decision: Should this field be sent?**
```
IF field is required for the service to function
THEN send
ELSE IF field is PII and not required
THEN do not send (data minimization)
ELSE IF field is optional
THEN send only if user provided it
```

### 6.3 Iteration Behavior
- Iterates over: integrations, env vars, webhooks
- Loops on test failures until all pass
- Loops on missing env vars until startup validation is added

### 6.4 Concurrency Rules
- May run concurrently with: most agents
- Must coordinate with: Backend Agent, DevOps Agent, AI Integration Agent, Auth & Security Agent
- Must not run concurrently with: another Data Integration Agent

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| Provider returns malformed JSON | Schema validation fails, fallback |
| Provider rate limit hit | Queue or retry with backoff |
| Provider auth key invalid | Alert ops, do not retry |
| Provider down for >N minutes | Fallback, log to monitoring |
| Webhook arrives without signature | 401, log event |
| Duplicate webhook event | Idempotency check, skip |
| Webhook arrives with future timestamp | Validate, accept if within clock skew tolerance |
| Env var missing in production | Startup validation fails, exit |
| Secret rotation in progress | Old value may be valid briefly, transition gracefully |
| Service client called with empty input | Validate, return 400 from internal layer |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Data & Integration PRD | All (this agent's own output) |
| Environment & Secrets Reference | All (this agent's own output) |
| Safety, Privacy & Control PRD | §7 (data sharing), §8 (logging constraints) |
| Technical Architecture PRD | Stack defines which services used |
| Error & State Reference | All EXT_ and SEC_ codes |
| Core Systems PRD | Canonical data object schemas (for mapping) |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must coordinate with | Backend Agent | Service client integration |
| Must coordinate with | DevOps Agent | Env vars and secrets management |
| Must coordinate with | AI Integration Agent | AI provider integration |
| Must coordinate with | Auth & Security Agent | OAuth provider integration |
| May run concurrently | Frontend Agent | Independent |
| Reports to | Orchestration Agent | Status |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| All integrated services | This agent's domain | Per integration |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `EXT_[SERVICE]_UNAVAILABLE` | Provider unreachable | High | Retry once, fallback |
| `EXT_[SERVICE]_AUTH_FAILED` | Provider rejected credentials | Critical | Alert ops, do not retry |
| `EXT_[SERVICE]_TIMEOUT` | Provider did not respond in time | High | Retry once, fallback |
| `EXT_[SERVICE]_RATE_LIMITED` | Provider rate-limited us | Medium | Queue, retry after Retry-After |
| `EXT_[SERVICE]_INVALID_RESPONSE` | Response failed schema validation | High | Log event, fallback |
| `SEC_WEBHOOK_VERIFICATION_FAILED` | Webhook signature invalid | Critical | Reject, do not process |
| `SYS_ENV_MISSING` | Required env var missing | Critical | Startup validation, exit |
| `SYS_ENV_INVALID` | Env var present but malformed | High | Startup validation, exit |

## 10. Logging & Observability
- Log every external API call (event `EXT_API_CALL`) with service, endpoint, status, duration — no PII, no request/response bodies
- Log every webhook receipt (event `WEBHOOK_RECEIVED`) with source, event type, verification result
- Log every rate limit hit (event `RATE_LIMITED`) with service
- Log every env var validation (event `ENV_VALIDATED`) with result
- Log every secret rotation (event `SECRET_ROTATED`) with var name (not value)
- Never log: raw request/response bodies, PII, secret values, AI prompt content

## 11. Acceptance Criteria
- [ ] Every integration has a complete contract
- [ ] Every env var used in code is in the registry
- [ ] `.env.example` matches the registry exactly
- [ ] Startup validation fails the build on missing required env vars
- [ ] Every webhook verifies signature before processing
- [ ] Every webhook is idempotent
- [ ] Every service client validates responses against schema
- [ ] Every external call trims request to minimum required fields
- [ ] No secrets present in source code (grep returns zero)
- [ ] All `EXT_*` and `SEC_*` error codes match Error & State Reference
- [ ] Integration tests pass for every service
- [ ] DataIntegrationSignOff all PASS

## 12. Test Cases
- 12.1 Happy: all integrations configured, all env vars set, startup validation passes, all calls succeed → all flows work.
- 12.2 Error: missing required env var in production → startup validation fails, process exits with code 1.
- 12.3 Edge: webhook arrives with duplicate event ID → first event processed, second skipped (idempotency holds).

---

**END OF DATA INTEGRATION AGENT PRD**
### Monetization-Related Integration Tasks

**MON-INT-001: Stripe API contract**
- Priority: P0
- Description: Document all Stripe endpoints used (Checkout, Customer Portal, Subscriptions API)
- Acceptance criteria: Data & Integration PRD §5.2 has all 7 webhook event types + their handlers
- Depends on: Data Integration Agent DI-001
- Complexity: M

**MON-INT-002: Webhook retry handling**
- Priority: P0
- Description: All webhook handlers must be idempotent (Stripe may retry)
- Acceptance criteria: 100 duplicate webhooks processed once; see Test Plan M-BILL-020
- Depends on: Backend Agent MON-003
- Complexity: S

**MON-INT-003: Stripe error code mapping**
- Priority: P0
- Description: Map all Stripe API error codes to Error & State Reference §4.12
- Acceptance criteria: Every Stripe error has a corresponding BIZ_* or STRIPE_* code
- Depends on: Data Integration Agent DI-001
- Complexity: S

**Cross-references:** Data & Integration PRD §5.2; Error & State Reference §4.12; Technical Architecture PRD §14
