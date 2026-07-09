/**
 * PRD Suite Template Sources v2 - Extended Templates
 * 
 * Additional templates for the complete PRD suite.
 */

import type { PRDTemplate } from './prd-template-sources';

/**
 * Experience & Access PRD Template (v2)
 * Precedence: 3rd
 */
export const EXPERIENCE_ACCESS_TEMPLATE = `# [Product Name] – Experience & Access PRD

**Version:** 2.0  
**Status:** Authoritative · Build-Ready  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** 3rd (overrides Technical, Data, Content PRDs)

---

## ⚠️ Precedence Compliance Block

Before implementing anything in this document, verify:

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | No access without authentication — no anonymous access permitted | All protected routes must check auth state before rendering |
| Safety, Privacy & Control PRD | User controls always accessible — pause, exit, modify preferences | Navigation must never trap a user in an unescapable state |
| Core Systems PRD | Onboarding data object schema | Fields collected during onboarding must match canonical profile schema exactly |
| Core Systems PRD | Auth state values | Auth state enum values must match Core Systems definitions exactly |
| Error & State Reference | Auth and onboarding state transitions | All state transitions here must match registered transitions |
| Content & Copy PRD | All UI strings | Every label, button, and message on every screen must reference Content PRD keys |
| Roles & Permissions Matrix | Route access by role | Screen access rules must match the permissions matrix |

---

## 1. Purpose of This Document

This document defines how users enter, move through, and experience [Product Name]. It governs authentication, onboarding, navigation, screen structure, and responsive behavior.

This document does not define core product logic or AI behavior. Those are governed by the Core Systems PRD.

---

## 2. Systems Covered

1. Authentication System
2. Onboarding System
3. Global Navigation Model
4. Screen Hierarchy & Page Contracts
5. Responsive Layout Behavior
6. State Persistence & Recovery

---

## 3. Target User Context (Binding)

All experience decisions must assume:
- [User context assumption 1 — e.g., "Users may be on slow mobile connections"]
- [User context assumption 2 — e.g., "Users may have cognitive fatigue"]
- [User context assumption 3 — e.g., "Users may return after long gaps"]

Design must favor **[primary quality]** over **[what to deprioritize]**.

---

## 4. Authentication System

### 4.1 Purpose
[What authentication accomplishes and why it matters for this product. 2–3 sentences.]

### 4.2 Supported Methods

| Method | v1 Supported | Notes |
|---|---|---|
| Email + Password | [Yes / No] | — |
| Google OAuth | [Yes / No] | — |
| Magic Link | [Yes / No] | — |
| [Other] | [Yes / No] | — |

No other authentication methods are permitted in v1.

### 4.3 Auth States

| State | Value | Description | Allowed Transitions |
|---|---|---|---|
| Unauthenticated | \`UNAUTHENTICATED\` | No valid session | → \`AUTHENTICATED\` |
| Authenticated | \`AUTHENTICATED\` | Valid session confirmed | → \`UNAUTHENTICATED\` |

Auth state must be fully resolved before rendering any protected screen. A loading state must be shown while resolution is in progress — never flash protected content.

### 4.4 User Flows

**Flow A: New User Signup**
1. User lands on Landing Page
2. Clicks "[CTA label from Content PRD]"
3. Selects signup method
4. Enters credentials
5. Backend creates account
6. Auth state → \`AUTHENTICATED\`
7. Redirect to \`/onboarding\`

**Flow B: Returning User Login**
1. User navigates to \`/login\`
2. Submits credentials
3. Session validated
4. Redirect based on onboarding status:
   - Onboarding \`NOT_STARTED\` or \`IN_PROGRESS\` → \`/onboarding\`
   - Onboarding \`COMPLETED\` → \`/dashboard\`

### 4.5 Auth Error Handling

| Error | Copy PRD Key | Behavior |
|---|---|---|
| Invalid credentials | \`auth.error.invalid_credentials\` | Inline error on form, no redirect |
| Email already exists | \`auth.error.email_exists\` | Inline error, suggest login |
| OAuth failure | \`auth.error.oauth_failed\` | Retry option displayed |
| Network error | \`auth.error.network\` | Blocking error state |
| Session expired | \`auth.error.session_expired\` | Redirect to login with message |

### 4.6 Session Rules

| Setting | Value |
|---|---|
| Storage method | HTTP-only cookie |
| Session duration | [30] days of inactivity |
| Invalidated on | Explicit logout, password change, account deletion |
| Concurrent sessions | [Allowed / Not allowed — specify] |

---

## 5. Onboarding System

### 5.1 Purpose
[What onboarding achieves before the user accesses core features. Why completion is mandatory.]

### 5.2 Onboarding States

| State | Value | Description | Allowed Transitions |
|---|---|---|---|
| Not started | \`NOT_STARTED\` | Authenticated but onboarding not begun | → \`IN_PROGRESS\` |
| In progress | \`IN_PROGRESS\` | Started but not complete | → \`COMPLETED\` |
| Completed | \`COMPLETED\` | All steps done; full access granted | None — terminal |

### 5.3 Onboarding Steps

| Step | Data Collected | Validation | Can Skip? |
|---|---|---|---|
| [Step 1] | [Fields] | [Rules] | No |
| [Step 2] | [Fields] | [Rules] | Yes |

### 5.4 Onboarding Flow

1. [Step 1 description]
2. [Step 2 description]
3. [Step N description]
4. Onboarding state → \`COMPLETED\`
5. Redirect to \`/dashboard\`

---

## 6. Global Navigation Model

### 6.1 Navigation Structure

| Item | Route | Auth Required | Onboarding Required | Role Required |
|---|---|---|---|---|
| [Nav item] | \`/route\` | Yes / No | Yes / No | [Role or "Any"] |

### 6.2 Navigation Rules

- [Rule 1]
- [Rule 2]

---

## 7. Screen Hierarchy & Page Contracts

### 7.1 Screen Registry

| Screen | Route | Purpose | Auth | Loading State |
|---|---|---|---|---|
| Landing | \`/\` | [Purpose] | No | None |
| Login | \`/login\` | [Purpose] | No | Form submission |
| Dashboard | \`/dashboard\` | [Purpose] | Yes | Skeleton |

### 7.2 Page Contracts

**[Page Name]**
- Route: \`/route\`
- Data required: [What must load]
- Primary action: [Main CTA]
- Error states: [Error handling]

---

## 8. Responsive Layout Behavior

### 8.1 Breakpoints

| Breakpoint | Min Width | Layout Changes |
|---|---|---|
| Mobile | 0px | [Description] |
| Tablet | 768px | [Description] |
| Desktop | 1024px | [Description] |

### 8.2 Component Behavior

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navigation | [Behavior] | [Behavior] | [Behavior] |
| [Component] | [Behavior] | [Behavior] | [Behavior] |

---

## 9. State Persistence & Recovery

### 9.1 What is Persisted

| State | Storage | Duration | Cleared On |
|---|---|---|---|
| Session | HTTP-only cookie | [Duration] | Logout |
| [State] | [Storage] | [Duration] | [Event] |

### 9.2 Recovery Behavior

| Scenario | Expected Behavior |
|---|---|
| Page refresh | [What happens] |
| Browser close/reopen | [What happens] |
| Network disconnect | [What happens] |

---

## 10. Acceptance Criteria

- [ ] All authentication flows implemented
- [ ] All onboarding steps functional
- [ ] Navigation matches specification
- [ ] All screens render correctly
- [ ] Responsive behavior verified
- [ ] State persistence working
`;

/**
 * Technical Architecture PRD Template (v2)
 * Precedence: 4th
 */
export const TECHNICAL_ARCHITECTURE_TEMPLATE = `# [Product Name] – Technical Architecture PRD

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
| Safety, Privacy & Control PRD | All secrets in env vars — never hardcoded | \`grep\` for API key patterns must return zero results |
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

---

## 3. High-Level System Architecture

### 3.1 Tenancy Architecture

| Setting | Value |
|---|---|
| Tenancy Model | [Single-tenant / Multi-tenant — logical / Multi-tenant — physical] |
| Tenant Separation | [N/A / \`tenant_id\` column on all user-data tables / Separate DB per tenant] |
| Row-Level Security | [Enabled / Not applicable] |
| Cross-Tenant Query Prevention | [RLS policy / Application-level filter / Both] |

### 3.2 Architecture Diagram

\`\`\`
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
└──────┬──────────────┬───────────┘
       │              │
       ▼              ▼
┌────────────┐  ┌──────────────────┐
│  DATABASE  │  │   AI PROVIDER    │
│ PostgreSQL │  │ OpenAI / Claude  │
└────────────┘  └──────────────────┘
\`\`\`

### 3.3 Component Summary

| Component | Technology | Purpose |
|---|---|---|
| Client | [React + Next.js (TypeScript)] | User interface |
| API Layer | [Next.js API Routes / Express] | Validation, auth, persistence |
| Database | [PostgreSQL] | Persistent data store |
| AI Provider | [OpenAI / Anthropic] | AI inference |
| Auth | [JWT + HTTP-only cookies] | Session management |

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

### 4.2 Routing

| Route | Component | Auth Required | Onboarding Required |
|---|---|---|---|
| \`/\` | LandingPage | No | No |
| \`/login\` | LoginPage | No | No |
| \`/signup\` | SignupPage | No | No |
| \`/dashboard\` | Dashboard | Yes | Yes |

### 4.3 Component Hierarchy

\`\`\`
App
├── AuthLayout
│   ├── LoginPage
│   └── SignupPage
├── AppShell
│   ├── Navigation
│   ├── [FeaturePage]
│   └── SettingsPage
└── SharedUI
    ├── Button
    ├── Modal
    ├── Input
    └── Toast
\`\`\`

---

## 5. State Management

### 5.1 State Layers

| Layer | Tool | Scope | Example |
|---|---|---|---|
| Server state | [TanStack Query / SWR] | API data | User profile, messages |
| UI state | [Zustand / Context] | Component state | Modals, form inputs |
| URL state | [Next.js router] | Navigation state | Current route, query params |

### 5.2 State Rules

- Server is always source of truth for persistent data
- Client state is ephemeral and reconstructable from server
- Optimistic updates must be reverted on server failure

---

## 6. Backend Architecture

### 6.1 API Design

| Method | Endpoint | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| POST | \`/api/auth/signup\` | Create account | No | \`{email, password}\` | \`{user, session}\` |
| POST | \`/api/auth/login\` | Authenticate | No | \`{email, password}\` | \`{user, session}\` |
| GET | \`/api/user/profile\` | Get profile | Yes | — | \`{profile}\` |

### 6.2 Error Response Format

\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
\`\`\`

---

## 7. Database Design

### 7.1 Tables

| Table | Purpose | Primary Key | Foreign Keys |
|---|---|---|---|
| \`users\` | User accounts | \`id\` (UUID) | — |
| \`profiles\` | User profiles | \`id\` (UUID) | \`user_id\` → \`users.id\` |

### 7.2 Schema Definitions

\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

---

## 8. Security

### 8.1 Authentication

| Setting | Value |
|---|---|
| Method | [JWT + HTTP-only cookies] |
| Token expiry | [15 minutes / 1 hour / 24 hours] |
| Refresh token | [Yes / No] |
| Password hashing | [bcrypt / argon2] |

### 8.2 Authorization

- All endpoints verify authentication before processing
- Role-based access per Roles & Permissions Matrix
- Row-level security enforced at database layer

### 8.3 Security Rules

- No secrets in code — all in environment variables
- HTTPS required on all endpoints
- CORS configured for allowed origins only
- Rate limiting on auth endpoints

---

## 9. Deployment & Infrastructure

### 9.1 Environments

| Environment | URL | Purpose |
|---|---|---|
| Development | \`localhost:3000\` | Local development |
| Staging | \`staging.[domain]\` | Pre-production testing |
| Production | \`[domain]\` | Live users |

### 9.2 Deployment Pipeline

1. Push to main branch
2. CI runs tests
3. Build artifacts created
4. Deploy to staging
5. Manual approval
6. Deploy to production

---

## 10. Acceptance Criteria

- [ ] All architecture components implemented
- [ ] All APIs functional and documented
- [ ] Database schema matches Core Systems PRD
- [ ] Security requirements met
- [ ] Deployment pipeline working
`;

/**
 * Error & State Reference Template (v2)
 */
export const ERROR_STATE_TEMPLATE = `# [Product Name] – Error & State Reference

**Version:** 2.0  
**Status:** Authoritative · Single Source of Truth for All States and Error Codes  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** Peer to Technical Architecture PRD — this document wins on error codes and state definitions

---

## ⚠️ Precedence Compliance Block

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | Crisis detection must produce state changes | Crisis-triggered state transitions must be defined here |
| Core Systems PRD | All system states defined in Core Systems | Every state mentioned in Core Systems PRD must have a canonical definition here |
| Roles & Permissions Matrix | Permission error codes defined | All permission-related error codes must align with matrix enforcement rules |
| Content & Copy PRD | All error messages have copy keys | Every error code here must have a corresponding message key in Content PRD |

---

## 1. Purpose of This Document

This document is the single source of truth for every application state, every error code, every status enum, and every allowed state transition in [Product Name]. These definitions appear in other PRDs for context but are canonically defined here.

**Rules for agents:**
- All error codes used anywhere in the codebase must appear in this document
- All status enums used in data objects must be defined here
- No agent may invent a state or error code not listed here
- If a state or error is needed but not listed, stop and flag it — do not invent it
- Every error code must have a corresponding copy key in the Content & Copy PRD

---

## 2. Application-Level States

### 2.1 Auth States

| State | Value | Description | Allowed Transitions | Terminal? |
|---|---|---|---|---|
| Unauthenticated | \`UNAUTHENTICATED\` | No valid session | → \`AUTHENTICATED\` | No |
| Authenticated | \`AUTHENTICATED\` | Valid session confirmed | → \`UNAUTHENTICATED\` | No |

### 2.2 Onboarding States

| State | Value | Description | Allowed Transitions | Terminal? |
|---|---|---|---|---|
| Not started | \`NOT_STARTED\` | Authenticated, onboarding not begun | → \`IN_PROGRESS\` | No |
| In progress | \`IN_PROGRESS\` | Started, not complete | → \`COMPLETED\` | No |
| Completed | \`COMPLETED\` | All steps done | None | **Yes** |

### 2.3 [Feature/System] States

| State | Value | Description | Allowed Transitions | Terminal? |
|---|---|---|---|---|
| [State] | \`[VALUE]\` | [Description] | → \`[VALUE]\`, → \`[VALUE]\` | No |
| [State] | \`[VALUE]\` | [Description] | None | **Yes** |

---

## 3. State Transition Rules

### 3.1 Auth Transitions

\`\`\`
UNAUTHENTICATED
  → AUTHENTICATED         trigger: successful login or signup

AUTHENTICATED
  → UNAUTHENTICATED       trigger: logout, session expiry, password change, account deletion
\`\`\`

**Illegal:** \`AUTHENTICATED\` → \`AUTHENTICATED\` — silently ignored (idempotent)  
**On illegal transition:** Return \`STATE_INVALID_TRANSITION\`

### 3.2 Onboarding Transitions

\`\`\`
NOT_STARTED
  → IN_PROGRESS           trigger: user begins step 1

IN_PROGRESS
  → COMPLETED             trigger: all steps completed in order
  → IN_PROGRESS           trigger: refresh or return — resume at last step (idempotent)
\`\`\`

**Illegal:** \`NOT_STARTED\` → \`COMPLETED\` — always blocked  
**Illegal:** \`COMPLETED\` → any state — always blocked (terminal)

---

## 4. Error Code Registry

### 4.1 Format Convention

\`\`\`
[DOMAIN]_[DESCRIPTION]
\`\`\`

| Domain Prefix | Covers |
|---|---|
| \`AUTH_\` | Authentication and session errors |
| \`INPUT_\` | Input validation errors |
| \`STATE_\` | State transition errors |
| \`DB_\` | Database errors |
| \`EXT_\` | External service errors |
| \`BIZ_\` | Business logic violations |
| \`PERM_\` | Permission/authorization errors |

### 4.2 Authentication Errors

| Code | HTTP Status | Description | User-Facing Message Key |
|---|---|---|---|
| \`AUTH_INVALID_CREDENTIALS\` | 401 | Email/password mismatch | \`error.auth.invalid_credentials\` |
| \`AUTH_SESSION_EXPIRED\` | 401 | Session token expired | \`error.auth.session_expired\` |
| \`AUTH_EMAIL_EXISTS\` | 409 | Email already registered | \`error.auth.email_exists\` |
| \`AUTH_ACCOUNT_LOCKED\` | 403 | Too many failed attempts | \`error.auth.account_locked\` |

### 4.3 Input Validation Errors

| Code | HTTP Status | Description | User-Facing Message Key |
|---|---|---|---|
| \`INPUT_MISSING\` | 400 | Required field not provided | \`error.input.missing\` |
| \`INPUT_INVALID_TYPE\` | 400 | Field has wrong type | \`error.input.invalid_type\` |
| \`INPUT_INVALID_FORMAT\` | 400 | Field format incorrect | \`error.input.invalid_format\` |
| \`INPUT_OUT_OF_RANGE\` | 400 | Value outside allowed range | \`error.input.out_of_range\` |

### 4.4 State Errors

| Code | HTTP Status | Description | User-Facing Message Key |
|---|---|---|---|
| \`STATE_INVALID_TRANSITION\` | 400 | Attempted illegal state change | \`error.state.invalid_transition\` |
| \`STATE_NOT_FOUND\` | 404 | Resource does not exist | \`error.state.not_found\` |
| \`STATE_CONFLICT\` | 409 | State conflict with existing data | \`error.state.conflict\` |

### 4.5 Permission Errors

| Code | HTTP Status | Description | User-Facing Message Key |
|---|---|---|---|
| \`PERM_UNAUTHORIZED\` | 401 | Not authenticated | \`error.perm.unauthorized\` |
| \`PERM_FORBIDDEN\` | 403 | Authenticated but not permitted | \`error.perm.forbidden\` |
| \`PERM_ROLE_REQUIRED\` | 403 | Specific role required | \`error.perm.role_required\` |

### 4.6 Business Logic Errors

| Code | HTTP Status | Description | User-Facing Message Key |
|---|---|---|---|
| \`BIZ_LIMIT_REACHED\` | 403 | Usage limit exceeded | \`error.biz.limit_reached\` |
| \`BIZ_UPGRADE_REQUIRED\` | 403 | Feature requires paid tier | \`error.biz.upgrade_required\` |
| \`BIZ_RULE_VIOLATION\` | 400 | Business rule violated | \`error.biz.rule_violation\` |

---

## 5. Error Response Format

\`\`\`json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "The email or password you entered is incorrect.",
    "httpStatus": 401,
    "details": {},
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

---

## 6. Acceptance Criteria

- [ ] All states defined and documented
- [ ] All transitions mapped
- [ ] All error codes registered
- [ ] All error codes have copy keys
- [ ] No invented states or errors in codebase
`;

/**
 * Collaboration Map Template
 */
export const COLLABORATION_MAP_TEMPLATE = `# [Product Name] – Collaboration Map

**Version:** 2.0  
**Status:** Authoritative · Build-Ready  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** Auxiliary document — describes agent interactions  
**Information Density:** O(A×I) where A = agents, I = interactions

---

\`\`\`
═══════════════════════════════════════════════════════════════
PRECEDENCE COMPLIANCE BLOCK
═══════════════════════════════════════════════════════════════
This document defines how agents collaborate and communicate.

This document is subordinate to:
1. Master PRD Index (anchors, structure)
2. All Base PRDs (system definitions)
3. All Agent PRDs (agent specifications)

This document governs:
- Informational only (no subordinate documents)
═══════════════════════════════════════════════════════════════
\`\`\`

---

## §1. Precedence Compliance Table

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | No agent may pass data outside tenant boundary | Every payload references tenant_id |
| Core Systems PRD | Agent-to-agent interactions implement system contracts | Every interaction traceable to a system |
| Experience & Access PRD | Role checks at interaction boundary | Every protected interaction has \`requiredRole\` |
| Master PRD Index | Precedence applies to interactions | Conflicts resolved per precedence |

---

## 1. Purpose

This document defines every inter-agent interaction in the [Product Name] generated build. Every interaction has a defined initiator, trigger, payload format, receiver, confirmation, and failure handling.

**Why this exists:** Without a written collaboration map, two agents will invent their own interaction shape and produce inconsistent payloads. With it, the system is auditable, debuggable, and substitutable.

---

## 2. How to Read This Document

Each \`INT-NNN\` block follows this structure:

\`\`\`markdown
## INT-NNN — [Short Title]

**Trigger:** [Exact condition that initiates this interaction]
**Initiating Agent:** [Agent A]
**Receiving Agent:** [Agent B]

**Payload Passed:**
[JSON schema or example payload with field names, types, examples]

**Receiving Agent Action:** [What Agent B does with the payload]

**Confirmation Returned:**
[JSON schema or example response]

**Failure Handling:** [What happens if Agent B cannot process]
\`\`\`

---

## 3. Interaction Categories

### 3.1 Orchestration Category
Interactions between the Orchestrator Agent and other top-level agents.

### 3.2 Build Category
Interactions between build agents (Frontend, Backend, Database, etc.).

### 3.3 Verification Category
Interactions involving the QA Agent reviewing deliverables.

### 3.4 External Category
Interactions between agents and third-party services or APIs.

---

## 4. Interaction Blocks

### INT-001 — [Title]

**Trigger:** [Condition]
**Initiating Agent:** [Agent A]
**Receiving Agent:** [Agent B]

**Payload Passed:**
\`\`\`json
{
  "interactionId": "INT-001",
  "field1": "value",
  "field2": "value"
}
\`\`\`

**Receiving Agent Action:** [Description]

**Confirmation Returned:**
\`\`\`json
{
  "interactionId": "INT-001",
  "status": "SUCCESS | PARTIAL | FAILED",
  "result": {}
}
\`\`\`

**Failure Handling:** [Retry count, escalation path]

---

### INT-002 — [Title]

*(Repeat for each interaction)*

---

## 5. Interaction Summary Table

| ID | From Agent | To Agent | Trigger | Payload Summary |
|---|---|---|---|---|
| INT-001 | [Agent A] | [Agent B] | [Trigger] | [Summary] |
| INT-002 | [Agent A] | [Agent C] | [Trigger] | [Summary] |

---

## 6. Acceptance Criteria

- [ ] All inter-agent interactions documented
- [ ] All payloads specified with exact schema
- [ ] All failure paths defined
- [ ] All interactions traceable to Core Systems PRD
`;

// Export extended templates
export const EXTENDED_PRD_TEMPLATES: PRDTemplate[] = [
  {
    id: 'experience-access',
    name: 'Experience & Access PRD',
    filename: '02-experience-access-prd.md',
    category: 'base',
    precedence: 3,
    version: 'v2',
    template: EXPERIENCE_ACCESS_TEMPLATE,
  },
  {
    id: 'technical-architecture',
    name: 'Technical Architecture PRD',
    filename: '04-technical-architecture-prd.md',
    category: 'base',
    precedence: 4,
    version: 'v2',
    template: TECHNICAL_ARCHITECTURE_TEMPLATE,
  },
  {
    id: 'error-state-reference',
    name: 'Error & State Reference',
    filename: '09-error-state-reference.md',
    category: 'reference',
    precedence: null,
    version: 'v2',
    template: ERROR_STATE_TEMPLATE,
  },
  {
    id: 'collaboration-map',
    name: 'Collaboration Map',
    filename: 'collaboration-map.md',
    category: 'auxiliary',
    precedence: null,
    version: 'v2',
    template: COLLABORATION_MAP_TEMPLATE,
  },
];
