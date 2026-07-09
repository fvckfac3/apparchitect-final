# [Product Name] – Technical Architecture PRD

**Version:** 2.0  
**Status:** Authoritative · Build-Ready  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** 4th (overrides Data & Integration and Content PRDs only)

---

## ⚠️ Precedence Compliance Block

Before implementing anything in this document, verify:

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | HTTPS enforced on all endpoints | TLS config must be present in deployment |
| Safety, Privacy & Control PRD | No prohibited content in logs | Logger config must exclude raw message content |
| Safety, Privacy & Control PRD | All secrets in env vars — never hardcoded | `grep` for API key patterns must return zero results |
| Core Systems PRD | Canonical data object schemas | DB column definitions must match Core Systems exactly |
| Roles & Permissions Matrix | Permission enforcement is backend-mandatory | All write endpoints must verify role before processing |
| Error & State Reference | Error codes are canonical | All API error responses must use registered codes only |

---

## 1. Purpose of This Document

This document defines how [Product Name] is built. It governs the technology stack, system architecture, state management, API contracts, database design, security, and developer tooling.

This document governs **how** the system is built, not **what** it does. Functional requirements live in the Core Systems PRD.

---

## 2. Architectural Principles (Binding)

| # | Principle | Meaning in Practice |
|---|---|---|
| 1 | Server-authoritative | Client never stores source of truth for persistent data |
| 2 | Stateless client | All persistent state lives on the server |
| 3 | Explicit state transitions | No implicit state changes — every transition is deliberate |
| 4 | Separation of concerns | UI, API, and database layers are strictly separated |
| 5 | Security by default | Deny is the default — access must be explicitly granted |
| 6 | Fail loudly | Errors surface clearly — never silently swallowed |
| 7 | [Principle] | [Meaning] |

---

## 3. High-Level System Architecture

### 3.1 Tenancy Architecture

| Setting | Value |
|---|---|
| Tenancy Model | [Single-tenant / Multi-tenant — logical / Multi-tenant — physical] |
| Tenant Separation | [N/A / `tenant_id` column on all user-data tables / Separate DB per tenant] |
| Row-Level Security | [Enabled / Not applicable] |
| Cross-Tenant Query Prevention | [RLS policy / Application-level filter / Both] |

**If multi-tenant:** Every query against user-data tables must include a `tenant_id` filter. An omitted `tenant_id` filter is a critical security bug.

### 3.2 Architecture Diagram

```
┌─────────────────────────────────┐
│         CLIENT LAYER            │
│   React / Next.js (TypeScript)  │
└────────────┬────────────────────┘
             │ HTTPS only
             ▼
┌─────────────────────────────────┐
│          API LAYER              │
│  Next.js API Routes / Express   │
│  Auth middleware → Role check   │
│  Input validation               │
│  LLM Schema Validation (if AI)  │
└──────┬──────────────┬───────────┘
       │              │
       ▼              ▼
┌────────────┐  ┌──────────────────┐
│  DATABASE  │  │   AI PROVIDER    │
│ PostgreSQL │  │ OpenAI / Claude  │
└────────────┘  └──────────────────┘
```

### 3.3 Component Summary

| Component | Technology | Purpose |
|---|---|---|
| Client | [React + Next.js (TypeScript)] | User interface |
| API Layer | [Next.js API Routes / Express] | Validation, auth, persistence |
| Database | [PostgreSQL] | Persistent data store |
| AI Provider | [OpenAI / Anthropic] | AI inference |
| Auth | [JWT + HTTP-only cookies] | Session management |
| Cache | [Redis / None] | [Purpose if used] |
| File Storage | [S3 / Cloudflare R2 / None] | [Purpose if used] |
| Queue | [BullMQ / None] | [Purpose if used] |

---

## 4. Frontend Architecture

### 4.1 Framework & Libraries

| Package | Version | Purpose |
|---|---|---|
| Next.js | [14+] | App framework, routing, SSR |
| React | [18+] | UI rendering |
| TypeScript | [5+] | Type safety |
| TailwindCSS | [3+] | Styling |
| [State library] | [version] | Global state management |
| [Library] | [version] | [Purpose] |

### 4.2 Routing

| Route | Component | Auth Required | Onboarding Required |
|---|---|---|---|
| `/` | LandingPage | No | No |
| `/login` | LoginPage | No | No |
| `/signup` | SignupPage | No | No |
| `/onboarding` | OnboardingFlow | Yes | No |
| `/dashboard` | Dashboard | Yes | Yes |
| `/settings` | Settings | Yes | Yes |
| `/[route]` | [Component] | Yes | Yes |

### 4.3 Component Hierarchy

```
App
├── AuthLayout
│   ├── LoginPage
│   └── SignupPage
├── AppShell
│   ├── Navigation
│   ├── [FeaturePage]
│   │   ├── [FeatureComponent]
│   │   └── [FeatureComponent]
│   └── SettingsPage
└── SharedUI
    ├── Button
    ├── Modal
    ├── Input
    └── Toast
```

---

## 5. State Management

### 5.1 State Layers

| Layer | Tool | Scope | Example |
|---|---|---|---|
| Local State | React `useState` / `useReducer` | Component-level | Modal open/closed |
| Global State | [Zustand / Redux Toolkit] | App-wide | Auth state, user profile |
| Server State | [React Query / SWR] | Cached API data | Resource lists |
| Session State | In-memory + cookie | Current session | Active flow state |
| Persistent State | Server-side only | Cross-session | All user data |

### 5.2 State Flow Rules
- Client state always reflects server state — never the inverse
- Optimistic updates permitted only for non-data-critical UI feedback
- Server reconciliation required on any state mismatch
- Client may never be the source of truth for any persistent value

---

## 6. Backend Architecture

### 6.1 API Design
- Style: RESTful
- Base URL: `/api/v1`
- Auth: JWT in HTTP-only cookie, verified on every protected request
- All write endpoints verify role against Roles & Permissions Matrix before processing

### 6.2 Endpoint Contracts

| Method | Endpoint | Auth | Role Required | Purpose |
|---|---|---|---|---|
| POST | `/api/v1/auth/login` | No | None | Authenticate user |
| POST | `/api/v1/auth/signup` | No | None | Create account |
| POST | `/api/v1/auth/logout` | Yes | Any | Invalidate session |
| GET | `/api/v1/profile` | Yes | Any | Get own profile |
| PUT | `/api/v1/profile` | Yes | Any | Update own profile |
| DELETE | `/api/v1/account` | Yes | Any | Delete own account |
| [METHOD] | `/api/v1/[endpoint]` | [Auth] | [Role] | [Purpose] |

### 6.3 Standard Response Envelopes

**Success:**
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "ISO-8601"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_FROM_ERROR_STATE_REFERENCE",
    "message": "Human-readable message from Content & Copy PRD",
    "field": "field_name (validation errors only)"
  }
}
```

**Rule:** Error codes must match the Error & State Reference exactly. Messages must match the Content & Copy PRD exactly. Never expose internal error details.

### 6.4 API Rules
- All input validated before any processing occurs
- Invalid state transitions rejected with `STATE_INVALID_TRANSITION`
- All endpoints versioned under `/api/v1/`
- Rate limiting applied to: [auth endpoints minimum — specify others]
- No endpoint may accept or return raw AI prompt content

---

## 7. Database Design

### 7.1 Configuration

| Setting | Value |
|---|---|
| Engine | [PostgreSQL] |
| ORM / Query Builder | [Prisma / Drizzle / Knex] |
| Migrations | [Tool and location] |
| Connection Pooling | [PgBouncer / built-in — max pool size: N] |

### 7.2 Tenancy Schema Rule *(multi-tenant only)*

Every table storing user-attributed data must include:
```sql
tenant_id UUID NOT NULL REFERENCES tenants(id)
```
A migration that adds a user-data table without `tenant_id` is a blocking error.

### 7.3 Schema

**Table: `users`**

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | UUID | No | `gen_random_uuid()` | Primary key |
| `email` | VARCHAR(255) | No | — | Unique |
| `password_hash` | VARCHAR(255) | No | — | bcrypt hash |
| `role` | VARCHAR(50) | No | `'MEMBER'` | Must match Roles & Permissions Matrix enum |
| `tenant_id` | UUID | [No if MT] | — | FK → tenants.id (multi-tenant only) |
| `created_at` | TIMESTAMPTZ | No | `NOW()` | |
| `updated_at` | TIMESTAMPTZ | No | `NOW()` | |

> *(Add a table block for every table. Column definitions must match Core Systems PRD canonical objects exactly.)*

### 7.4 Storage Rules
- All writes go through the API layer — no direct DB writes from client
- No sensitive data in client-accessible storage (localStorage, cookies without HttpOnly)
- Prepared statements or ORM required — no raw string interpolation in queries

---

## 8. AI Integration *(remove if not applicable)*

### 8.1 Provider Configuration

| Setting | Value |
|---|---|
| Provider | [OpenAI / Anthropic / etc.] |
| Model | [e.g., `gpt-4o` / `claude-sonnet-4-6`] |
| Max Tokens | [1000] |
| Temperature | [0.7] |
| Request Timeout | [30,000ms] |
| Retry Policy | Retry once on timeout; fail on second timeout |

### 8.2 Prompt Construction Requirements

Every AI call must include in its system prompt:
- System role definition
- User profile context (loaded before call — see Core Systems PRD)
- Current conversation/session state
- Allowed actions for current state
- Safety boundary reminders

Prompt construction logic lives in: `[file path]`

### 8.3 LLM Schema Integrity Contract

All AI responses must be validated at the API layer before any further processing. See Core Systems PRD §6.5 for the validation schema.

**Validation must occur:** Between AI provider response receipt and any downstream system call.

**On validation failure:**
- Log `EXT_AI_INVALID_RESPONSE` event (no content logged)
- Return fallback message from Content & Copy PRD
- Do not surface schema details in client error

### 8.4 Failure Handling

| Condition | Behavior |
|---|---|
| Timeout (first attempt) | Retry once after [2,000ms] |
| Timeout (second attempt) | Return fallback message; log `EXT_AI_TIMEOUT` |
| Schema validation failure | Return fallback; log `EXT_AI_INVALID_RESPONSE` |
| Rate limit hit | Queue request; retry after [60s]; log `EXT_AI_RATE_LIMITED` |
| Provider unavailable | Return fallback; log `EXT_[PROVIDER]_UNAVAILABLE`; alert ops |

---

## 9. Error Handling

### 9.1 HTTP Status Code Conventions

| Code | When Used |
|---|---|
| 200 | Successful GET, PUT |
| 201 | Successful POST (resource created) |
| 400 | Validation failure, invalid state transition |
| 401 | No valid session |
| 403 | Authenticated but not permitted |
| 404 | Resource does not exist |
| 409 | Duplicate or state conflict |
| 429 | Rate limit exceeded |
| 500 | Unexpected server failure |
| 503 | External dependency unavailable |

### 9.2 Client-Side Error Handling

| Error | Behavior |
|---|---|
| Network failure | Retry once, then display error from Content PRD |
| Validation error | Inline field-level feedback from Content PRD |
| Auth error (401) | Redirect to login |
| Forbidden (403) | Display permission denied message from Content PRD |
| Server error (500) | Display generic error from Content PRD |

### 9.3 Server-Side Error Handling
- Global error handler catches all unhandled exceptions
- Internal error details never sent to client
- PII must never appear in error logs
- All errors logged with: timestamp, error code, request ID (no user content)

---

## 10. Security Requirements

### 10.1 Transport
- HTTPS enforced on all routes and environments
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- No HTTP fallback under any circumstance

### 10.2 Authentication & Sessions
- JWT stored in HTTP-only, SameSite=Strict cookie
- CSRF protection via SameSite cookie policy + [CSRF token if needed]
- Session expiry: [30 days inactivity]
- Session invalidated on: logout, password change, account deletion

### 10.3 Input Security
- All user input sanitized before processing
- SQL injection: prevented via parameterized queries / ORM (no string interpolation)
- XSS: prevented via output encoding + Content Security Policy headers
- File uploads (if any): type validation, size limit, virus scan

### 10.4 Secrets Management
- All secrets via environment variables — never hardcoded
- `.env` files gitignored — only `.env.example` committed
- Secrets manager: [Vercel Env / Doppler / AWS Secrets Manager]
- Secret rotation: per Environment & Secrets Reference §6

### 10.5 Dependency Security
- `npm audit` run in CI — build fails on critical vulnerabilities
- Dependencies pinned to exact versions
- Automated dependency update PR tool: [Dependabot / Renovate / None]

---

## 11. Infrastructure & Deployment

### 11.1 Hosting

| Component | Platform | Environment |
|---|---|---|
| Frontend | [Vercel / Netlify] | All |
| API | [Vercel / Railway / Render] | All |
| Database | [Supabase / Neon / RDS] | All |
| File Storage | [S3 / Cloudflare R2] | All |

### 11.2 Environments

| Environment | Purpose | URL Pattern | Secrets Source |
|---|---|---|---|
| Development | Local development | `localhost:[port]` | `.env.local` |
| Preview | PR previews | `[*.vercel.app]` | Platform env vars |
| Staging | Pre-production | `staging.[domain]` | Secrets manager |
| Production | Live | `[domain]` | Secrets manager |

### 11.3 CI/CD Pipeline

1. Push to branch → lint + type check + unit tests + **placeholder detection check**
2. PR opened → integration tests + preview deploy
3. PR merged to `main` → staging deploy + regression tests + smoke tests
4. Manual promote → production deploy + smoke tests

**Placeholder detection is a required CI step.** See Master PRD Index §8 for the shell command.

---

## 12. Developer Tooling

| Tool | Purpose | Config File |
|---|---|---|
| ESLint | Linting | `.eslintrc` |
| Prettier | Formatting | `.prettierrc` |
| TypeScript | Type checking | `tsconfig.json` |
| Jest | Unit testing | `jest.config.ts` |
| Playwright | E2E testing | `playwright.config.ts` |
| Husky | Git hooks | `.husky/` |
| [Tool] | [Purpose] | [Config] |

---

## 13. Acceptance Criteria

- [ ] All API endpoints return correct status codes per Section 9.1
- [ ] All error responses use codes from Error & State Reference
- [ ] No client-side source of truth for persistent data
- [ ] No secrets hardcoded anywhere — grep returns zero matches
- [ ] HTTPS enforced across all environments
- [ ] SQL injection protection verified
- [ ] XSS protection verified
- [ ] All write endpoints verify role before processing
- [ ] AI responses validated before downstream use
- [ ] CI placeholder detection step passes
- [ ] `tenant_id` present on all user-data tables (if multi-tenant)

## Cross-Document Validation

This section enumerates the cross-document checks that involve the Technical Architecture PRD. Agents must run all applicable checks before treating the suite as build-ready.

### Inbound Dependencies (this PRD consumes)

| Check ID | Source Document | Rule | Severity |
|---|---|---|---|
| CD-TEC-IN-001 | Master PRD Index | productName, version, and tier anchors must match §3 of the index | Critical |
| CD-TEC-IN-002 | Master PRD Index | This document's precedence declaration must be consistent with §6 of the index | Critical |

### Outbound Dependencies (this PRD produces)

| Check ID | Target Document | Rule | Severity |
|---|---|---|---|
| CD-TEC-OUT-001 | All downstream documents | Every schema, error code, role, and copy key defined here must be referenced exactly as written | Critical |
| CD-TEC-OUT-002 | Master PRD Index | Any change to anchors in this document must be propagated to §3 of the index | Critical |

### Tier-Specific Cross-Checks

| Check ID | Rule | Severity |
|---|---|---|
| CD-TEC-TIER-001 | No field, code, or role defined in this document is duplicated by another base PRD at a different tier | Critical |
| CD-TEC-TIER-002 | Conflicts between this document and any subordinate Agent PRD are resolved in favor of this document | High |

### Resolution Protocol

1. Identify the conflict and the documents involved.
2. Apply the Master PRD Index §6 precedence order.
3. If this document is higher-precedence: the other document must be updated and its version incremented.
4. If this document is lower-precedence: update this document to match.
5. Record the resolution in the Master PRD Index §5 (Known Conflicts) and in the Version History below.

---

## Version History

| Version | Date | Author | Changes |
|---|---|---|---|
| 2.0 | [Date] | [Name] | Initial v2 release with RLM principles |
| 2.1 | [Date] | [Name] | Added Cross-Document Validation and Version History sections per RLM compliance |

---

**END OF TECHNICAL ARCHITECTURE PRD**