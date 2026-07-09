# AppArchitect – Backend Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Implements AppArchitect API routes, state transitions, and orchestration logic
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Backend Agent |
| **Role** | Build API routes, business logic, state transitions, document generation orchestration |
| **Type** | Code |
| **Operates On** | API route handlers, business logic modules, state machines, SSE endpoints |
| **Triggered By** | Orchestrator phase unlock (after Documentation Agent COMPLETE) |
| **Blocking?** | Yes — blocks DevOps and Frontend integration |

## 2. Mission Statement

The Backend Agent builds all server-side logic for AppArchitect: the four-round interview engine API, the team synthesis engine, the document generation orchestrator (which drives Documentation Agent and streams results), the collaboration map generator, the user/project/session APIs, and the SSE streaming layer. Every route must enforce Roles & Permissions Matrix, return error codes from the Error & State Reference, log only permitted content, and validate all LLM responses against the LLM Schema Integrity Contract.

## 3. Scope

### 3.1 In Scope
- All API routes under `/api/v1/*`
- State machine implementations for Interview, Generation, Project, Collaboration
- SSE streaming layer for live document generation
- LLM prompt construction (delegating model choice to AI Integration Agent)
- LLM response validation per LLM Schema Integrity Contract
- Permission enforcement on every write endpoint
- Error handling matrix per Error & State Reference
- Webhook handlers (Stripe, if payments added; OAuth callbacks, if added)
- Rate limiting on auth endpoints
- Standard response envelopes (success + error)

### 3.2 Out of Scope
- UI components (Frontend Agent)
- Database schema and migrations (Database Agent)
- Auth provider integration (Auth & Security Agent)
- DevOps / deployment (DevOps Agent)
- Document content generation (Documentation Agent owns Base PRD content)
- Test code (QA Agent)
- Visual design (Content & Design Agent)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `basePRDs` | Documentation Agent | Markdown | Yes |
| `routesSpec` | Experience & Access PRD | OpenAPI | Yes |
| `rolesMatrix` | Roles & Permissions Matrix | JSON | Yes |
| `errorCodes` | Error & State Reference | JSON | Yes |
| `llmSchemaContract` | Core Systems PRD §6.5 | Zod schema | Yes |
| `aiProviderConfig` | AI Integration Agent | JSON | Yes |
| `userSession` | Auth & Security Agent | JWT | Yes (per request) |

### 4.2 Input Schemas
```typescript
type RouteRequest<T> = {
  body: T;
  query: Record<string, string>;
  params: Record<string, string>;
  headers: Record<string, string>;
  session: UserSession;
}

type StandardSuccessResponse<T> = {
  success: true;
  data: T;
  meta: { timestamp: string; requestId: string };
}

type StandardErrorResponse = {
  success: false;
  error: {
    code: string;                 // from Error & State Reference
    message: string;              // from Content & Copy PRD
    field?: string;               // for validation errors
  };
}
```

### 4.3 Input Validation Rules
- Every request body validated against Zod schema before any processing
- Auth required for every non-public route
- Role check before every write
- LLM response validation (Zod) before any downstream use

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| API route handlers | `/api/v1/*` | TypeScript | Yes |
| State machine modules | `/lib/state/*.ts` | TypeScript | Yes |
| LLM response validators | `/lib/llm/schemas.ts` | Zod | Yes |
| Webhook handlers | `/api/v1/webhooks/*` | TypeScript | Yes |
| OpenAPI spec | `/api/openapi.json` | JSON | Yes |
| Backend sign-off | Orchestrator | JSON | Yes |

### 5.2 Output Schemas
**BackendSignOff**
```typescript
type BackendSignOff = {
  routesImplemented: number;
  openApiMatchesImplementation: boolean;
  allWriteEndpointsRoleChecked: boolean;
  allErrorsUseRegisteredCodes: boolean;
  llmResponseValidatorCoverage: number;   // %
  rateLimitingOnAuthEndpoints: boolean;
  issues: Array<{ severity: string; description: string }>;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Bootstrap Server**
- Initialize server with all required env vars (validated at startup)
- Wire global error handler (logs server-side, returns sanitized client response)
- Wire request ID middleware
- Wire auth middleware
- Wire rate limit middleware on auth endpoints

**Step 2: Implement Auth-Related Routes**
- `POST /api/v1/auth/signup` (email + password)
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/password-reset/request`
- `POST /api/v1/auth/password-reset/confirm`
- `GET /api/v1/auth/session`

**Step 3: Implement Interview Engine Routes**
- `POST /api/v1/interview/sessions` — start new interview
- `GET /api/v1/interview/sessions/:id` — get current state
- `POST /api/v1/interview/sessions/:id/responses` — submit answer
- `POST /api/v1/interview/sessions/:id/finalize` — declare complete
- Implement domain coverage tracking and adaptive question selection

**Step 4: Implement Team Configuration & Document Generation Routes**
- `POST /api/v1/configurations` — generate team config
- `PATCH /api/v1/configurations/:id` — modify team
- `POST /api/v1/configurations/:id/approve` — user approval
- `POST /api/v1/suites` — start suite generation
- `GET /api/v1/suites/:id` — get suite status
- `GET /api/v1/suites/:id/stream` — SSE stream of generation events
- `POST /api/v1/suites/:id/regenerate` — re-run a specific document

**Step 5: Implement LLM Layer**
- All LLM calls go through `lib/llm/client.ts`
- Build prompts per Core Systems PRD §6.4 (system role, user context, state, allowed actions, safety boundaries)
- Validate every response against Zod schema in `lib/llm/schemas.ts`
- On validation failure: log `EXT_AI_INVALID_RESPONSE`, return fallback message

**Step 6: Implement Error Handling Matrix**
- Global error handler maps to `StandardErrorResponse`
- All error codes from Error & State Reference used consistently
- No internal error details exposed to client

**Step 7: Implement State Transitions**
- For each state machine (Interview, Project, Generation), encode allowed transitions
- Reject illegal transitions with `STATE_INVALID_TRANSITION`
- Persist state changes transactionally

**Step 8: Webhook Handlers**
- Verify signatures (HMAC) before any processing
- Idempotency: track processed event IDs
- Reject unverified with `SEC_WEBHOOK_VERIFICATION_FAILED`

**Step 9: Generate OpenAPI Spec**
- All routes documented
- Spec regenerated on every backend commit
- Mismatches with implementation are a sign-off blocker

**Step 10: Sign-off**
- Emit `BackendSignOff` to Orchestrator
- Set `handoffReady: true` only if all checks pass

### 6.2 Decision Logic
**Decision: Return error vs. fallback**
```
IF error is user-actionable (validation, permission, not found)
THEN return StandardErrorResponse with code from Error & State Reference
ELSE IF error is recoverable (timeout, retry-able)
THEN retry once, then return fallback
ELSE log server-side, return generic error to client
```

**Decision: Persist state vs. return error**
```
IF state transition is legal per state machine
THEN persist in transaction, return new state
ELSE return STATE_INVALID_TRANSITION
```

### 6.3 Iteration Behavior
- Iterates over: route groups (auth, interview, configuration, generation, webhooks)
- On per-route failure: log, continue, fix in final pass
- Always final pass before sign-off

### 6.4 Concurrency Rules
- May run concurrently with: Frontend (different route surfaces), Database (read-only schema inspection)
- Must not run concurrently with: another Backend Agent
- Locking strategy: route-level pessimistic lock during write

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| AI provider timeout | Retry once, return fallback |
| Schema validation failure on LLM response | Log, return fallback, do not surface to client |
| Concurrent state transition attempts | Reject second, return `STATE_INVALID_TRANSITION` |
| Webhook signature invalid | Reject with 401, log `SEC_WEBHOOK_VERIFICATION_FAILED` |
| Rate limit hit | Return 429 with `Retry-After` header |
| User has no session but hits protected route | Return 401 `AUTH_UNAUTHORIZED` |
| DB connection lost mid-transaction | Roll back, return 500 with generic message |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Technical Architecture PRD | §6 (Backend), §7 (Database), §8 (AI Integration), §9 (Error Handling), §10 (Security) |
| Core Systems PRD | §6.5 (LLM Schema Integrity Contract) |
| Error & State Reference | All |
| Roles & Permissions Matrix | All |
| Safety, Privacy & Control PRD | §8 (Logging & Observability Constraints) |
| Data & Integration PRD | All |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must run after | Documentation Agent | Base PRDs |
| Must run after | Database Agent | Schema |
| Must run after | AI Integration Agent | Model client ready |
| May run concurrently | Frontend Agent | Different concerns |
| Must run before | QA Agent | Needs APIs to test |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| AI Provider | All LLM calls | Critical — fallback message |
| Database | All persistence | Critical |
| Auth provider | Session verification | Critical |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `ROUTE_BUILD_FAILED` | TypeScript or build error in route | Critical | Fix, rebuild |
| `LLM_VALIDATION_FAILED` | LLM response failed Zod validation | Medium | Retry, fallback |
| `STATE_INVALID_TRANSITION` | Illegal state transition attempted | High | Reject, return error |
| `WEBHOOK_VERIFICATION_FAILED` | Webhook signature invalid | High | Reject, log |
| `ROLE_CHECK_MISSING` | Write endpoint missing role check | Critical | Add check before sign-off |
| `OPENAPI_DRIFT` | OpenAPI doesn't match implementation | High | Regenerate spec, fix |

## 10. Logging & Observability
- Log every route entry (event `ROUTE_HIT`) with method, path, status, request ID, user ID (no PII)
- Log every state transition (event `STATE_TRANSITION`)
- Log every LLM call result (event `LLM_RESPONSE_VALIDATED`)
- Never log: raw PRD bodies, user interview answers, PII, secrets

## 11. Acceptance Criteria
- [ ] All routes implemented per Experience PRD
- [ ] All write endpoints enforce Roles & Permissions Matrix
- [ ] All error responses use codes from Error & State Reference
- [ ] All LLM responses validated before downstream use
- [ ] OpenAPI spec regenerated and matches implementation
- [ ] Webhook signatures verified
- [ ] Rate limiting on auth endpoints
- [ ] No secrets in source code
- [ ] No PII in logs
- [ ] BackendSignOff report all PASS

## 12. Test Cases
- 12.1 Happy: user starts interview, completes 13 domains, triggers generation, suite streams correctly.
- 12.2 Error: illegal state transition → `STATE_INVALID_TRANSITION`.
- 12.3 Edge: AI provider down → fallback message returned, suite marked PARTIAL.

---

**END OF BACKEND AGENT PRD**
### Monetization-Related Tasks

**MON-001: Stripe Checkout integration**
- Priority: P0
- Description: Implement `POST /api/billing/checkout` that creates a Stripe Checkout session for upgrade
- Acceptance criteria: Returns Stripe redirect URL; logged-in user can upgrade from Free → Pro or Pro → Team
- Depends on: Backend Agent TASK-001
- Complexity: M

**MON-002: Stripe Customer Portal**
- Priority: P0
- Description: Implement `POST /api/billing/portal` that returns a Stripe Customer Portal URL
- Acceptance criteria: User with `stripeCustomerId` can manage payment method, view invoices, cancel
- Depends on: MON-001
- Complexity: S

**MON-003: Stripe webhook handler**
- Priority: P0
- Description: Implement `POST /api/webhooks/stripe` with HMAC signature verification
- Acceptance criteria: All 7 event types from Data & Integration PRD §5.2 handled; signature verified; idempotent
- Depends on: Backend Agent TASK-001
- Complexity: L

**MON-004: Feature-gate middleware**
- Priority: P0
- Description: Implement `middleware/feature-gate.ts` that checks tier limits server-side
- Acceptance criteria: `canUseFeature(userId, 'createProject')` returns boolean; respects Free=1, Pro=10, Team=∞
- Depends on: Backend Agent TASK-001
- Complexity: M

**MON-005: Tier-cached subscription lookup**
- Priority: P0
- Description: Implement `lib/features/access.ts` for fast tier checks
- Acceptance criteria: Reads `user.subscriptionTier` from cache; fallback to DB on miss; cache invalidated on webhook
- Depends on: MON-003
- Complexity: S

**MON-006: Project creation with tier enforcement**
- Priority: P0
- Description: Modify `POST /api/projects` to check `canUseFeature(userId, 'createProject')` before insert
- Acceptance criteria: Returns 402 `BIZ_TIER_LIMIT_REACHED` if at limit; otherwise creates project
- Depends on: MON-004
- Complexity: S

**MON-007: Billing status endpoint**
- Priority: P1
- Description: Implement `GET /api/billing/status` returning current tier, project count, period end, cancel-at-period-end flag
- Acceptance criteria: Returns object matching Monetization PRD §5.1 schema; cached
- Depends on: MON-005
- Complexity: S

**MON-008: Webhook idempotency**
- Priority: P0
- Description: Store processed Stripe event IDs; skip duplicates
- Acceptance criteria: M-BILL-011 and M-BILL-020 pass
- Depends on: MON-003
- Complexity: S

**MON-009: Downgrade grace period**
- Priority: P0
- Description: When tier downgrades (Pro → Free), projects over limit become read-only, not deleted
- Acceptance criteria: M-BILL-018 passes; existing projects remain accessible
- Depends on: MON-003
- Complexity: M

**Cross-references:** Monetization & Pricing PRD §3, §4, §5; Roles & Permissions Matrix §3.6; Error & State Reference §4.12
