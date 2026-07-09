# \[Product Name\] – Data & Integration PRD

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** \[Product Name\] – Master PRD Index
**Precedence:** 5th (overrides Technical Architecture and Content PRDs)

---

## ⚠️ Precedence Compliance Block

Before implementing anything in this document, verify:

| Higher-Tier Document | Rule That Governs This File | Verification Required |
| --- | --- | --- |
| Safety, Privacy & Control PRD | No PII transmitted to third parties beyond stated purposes | Every integration data contract must be audited for PII exposure |
| Safety, Privacy & Control PRD | No prohibited content in logs | Integration request/response logging must exclude message content and AI prompts |
| Safety, Privacy & Control PRD | Data minimization — only send what the service requires | Request payloads must be trimmed to minimum required fields |
| Core Systems PRD | Canonical data object schemas | Any object sent to or received from an external service must be mapped to/from canonical schemas |
| Technical Architecture PRD | Secrets via environment variables only | Every credential in this document must reference an env var, never a hardcoded value |
| Error & State Reference | External service error codes | All `EXT_*` error codes used here must exist in the Error & State Reference registry |
| Environment & Secrets Reference | All credentials documented | Every API key and service credential must have a corresponding entry |

---

## 1. Purpose of This Document

This document defines every external service, third-party API, data contract, webhook, and integration that \[Product Name\] depends on. It is the single source of truth for all data that crosses a system boundary.

This document does not define internal system behavior. That belongs in the Core Systems PRD.

---

## 2. Integration Inventory

| \# | Service | Type | Purpose | Required for MVP | Env Var Prefix |
| --- | --- | --- | --- | --- | --- |
| 1 | \[e.g., OpenAI\] | AI Provider | \[Purpose\] | Yes | `OPENAI_` |
| 2 | \[e.g., Stripe\] | Payments | \[Purpose\] | \[Yes/No\] | `STRIPE_` |
| 3 | \[e.g., SendGrid\] | Email | Transactional email | Yes | `SENDGRID_` |
| 4 | \[e.g., Google OAuth\] | Auth | OAuth authentication | Yes | `GOOGLE_` |
| 5 | \[Service\] | \[Type\] | \[Purpose\] | \[Yes/No\] | `[PREFIX]_` |

---

## 3. Integration 1: \[Service Name\]

### 3.1 Purpose

\[Why this service is used and what it provides to the product. 2–3 sentences.\]

### 3.2 Credentials & Configuration

| Setting | Environment Variable | Rotation Policy | Notes |
| --- | --- | --- | --- |
| API Key | `[SERVICE]_API_KEY` | Default: 90 days / On breach | See Environment & Secrets Reference §6 |
| \[Setting\] | `[VAR_NAME]` | \[Policy\] | \[Notes\] |

### 3.3 Endpoints Used

| Method | Endpoint | Purpose | Called When | Rate Limit |
| --- | --- | --- | --- | --- |
| \[POST\] | `[/endpoint]` | \[Purpose\] | \[Trigger condition\] | \[N req/min\] |
| \[GET\] | `[/endpoint]` | \[Purpose\] | \[Trigger condition\] | \[N req/min\] |

### 3.4 Request Contract

```json
{
  "field1": "type — description, constraints",
  "field2": "type — description",
  "field3": {
    "nestedField": "type — description"
  }
}
```

**PII Audit:** Fields transmitted: \[list any PII fields\]. Justification: \[why each is required\].

### 3.5 Response Contract

```json
{
  "field1": "type — description",
  "field2": "type — description"
}
```

**Schema Validation:** Response must be validated against this schema before use. Validation library: \[Zod / JSON Schema / Joi\]. On mismatch: return `EXT_[SERVICE]_INVALID_RESPONSE`.

### 3.6 Error Handling

| HTTP Code / Error | Error Code (from Error & State Reference) | Behavior |
| --- | --- | --- |
| 429 — Rate limited | `EXT_[SERVICE]_RATE_LIMITED` | Retry after `Retry-After` header value; queue if available |
| 401 — Auth failure | `EXT_[SERVICE]_AUTH_FAILED` | Alert ops immediately; do not retry |
| 500 — Server error | `EXT_[SERVICE]_UNAVAILABLE` | Retry once after 2s; then fallback behavior |
| Timeout | `EXT_[SERVICE]_TIMEOUT` | Retry once; then fallback behavior |
| Schema mismatch | `EXT_[SERVICE]_INVALID_RESPONSE` | Fallback behavior; log event (no content) |
| \[Error\] | `[Code]` | \[Behavior\] |

### 3.7 Rate Limits

| Limit Type | Value | Strategy |
| --- | --- | --- |
| Requests per minute | \[N\] | \[Queue / exponential backoff / cache\] |
| \[Other limit\] | \[Value\] | \[Strategy\] |

### 3.8 Fallback Behavior

If this service is unavailable after retry: \[Exact fallback — e.g., "Return cached response if available; otherwise return fallback message from Content PRD key `errors.service_unavailable`"\].

### 3.9 Data Flow Diagram

```markdown
[Trigger in application]
        ↓
[Internal validation]
        ↓
[Request construction — trim to minimum required fields]
        ↓
[API call to [Service]]
        ↓
[Schema validation of response]
        ↓ (pass)               ↓ (fail)
[Map to canonical schema]   [Return fallback]
        ↓
[Continue application flow]
```

---

## 4. Integration 2: \[Service Name\]

### 4.1 Purpose

\[Description\]

### 4.2 Credentials & Configuration

| Setting | Environment Variable | Rotation Policy | Notes |
| --- | --- | --- | --- |
| \[Key\] | `[VAR]` | Default: 90 days / On breach | \[Notes\] |

### 4.3 Endpoints Used

| Method | Endpoint | Purpose | Called When | Rate Limit |
| --- | --- | --- | --- | --- |
| \[Method\] | `[endpoint]` | \[Purpose\] | \[Trigger\] | \[Limit\] |

### 4.4 Request Contract

```json
{
  "field1": "type — description"
}
```

**PII Audit:** \[Fields transmitted / "No PII transmitted"\]

### 4.5 Response Contract

```json
{
  "field1": "type — description"
}
```

### 4.6 Error Handling

| Error | Error Code | Behavior |
| --- | --- | --- |
| \[Error\] | `[Code]` | \[Behavior\] |

### 4.7 Fallback Behavior

\[Fallback if unavailable\]

---

> *(Repeat Section 3 structure for each integration in the inventory)*

---

## 5. Webhooks

### 5.1 Inbound Webhooks

| Source | Event Type | Receiving Endpoint | Verification Method | Handler Behavior |
| --- | --- | --- | --- | --- |
| \[Service\] | `[event.type]` | `/api/v1/webhooks/[name]` | HMAC signature (`[header name]`) | \[What happens on receipt\] |
| \[Service\] | `[event.type]` | `/api/v1/webhooks/[name]` | \[Method\] | \[Handler\] |

**Verification Rule:** All inbound webhooks must verify the signature before any processing. An unverified webhook must be rejected with HTTP 401 and logged as `SEC_WEBHOOK_VERIFICATION_FAILED`.

**Idempotency Rule:** All webhook handlers must be idempotent. Store processed event IDs and skip duplicates.

### 5.2 Outbound Webhooks *(if applicable)*

| Internal Event | Destination URL | Payload Schema | Retry Policy |
| --- | --- | --- | --- |
| \[Event\] | `[URL]` | \[Schema reference\] | Retry \[N\] times with exponential backoff |

---

## 6. Internal Data Contracts

### 6.1 Shared Types (Used Across Integrations)

**\[TypeName\]**

```typescript
type [TypeName] = {
  id:         string;    // UUID v4
  [field]:    [type];    // [description, constraints]
  [field]:    [type];    // [description]
  tenantId?:  string;    // UUID — required if multi-tenant
  createdAt:  string;    // ISO-8601 UTC
  updatedAt:  string;    // ISO-8601 UTC
}
```

> *(Repeat for each shared type)*

### 6.2 Enum Values

```typescript
enum [EnumName] {
  [VALUE_A] = '[value_a]',   // [Description]
  [VALUE_B] = '[value_b]',   // [Description]
}
```

---

## 7. Data Flow Diagrams

### 7.1 \[Key Flow — e.g., "User Message → AI Response"\]

```markdown
User Input (client)
        ↓ POST /api/v1/messages
API Layer — validate input, load profile
        ↓
Database — persist user message
        ↓
Prompt construction (profile + state + message)
        ↓
AI Provider ([Service])
        ↓
Schema validation (Zod / JSON Schema)
        ↓ (pass)               ↓ (fail)
Database — persist AI response    Fallback message
        ↓
Response to client
```

### 7.2 \[Key Flow — e.g., "Payment Processing"\]

```markdown
[Step 1]
        ↓
[Step 2]
        ↓
[Step 3]
```

---

## 8. Integration Testing Requirements

| Test | Condition | Pass Condition |
| --- | --- | --- |
| \[Service\] authenticates successfully | Valid credentials | HTTP 200 returned |
| \[Service\] rejects invalid credentials | Invalid API key | Error code `EXT_[SERVICE]_AUTH_FAILED` returned |
| \[Service\] rate limit handled | Simulate 429 response | Retry logic fires; no crash |
| \[Service\] timeout handled | Simulate timeout | Retry once; fallback message returned |
| Webhook signature verified | Valid signature | Webhook processed |
| Webhook signature rejected | Invalid signature | HTTP 401; `SEC_WEBHOOK_VERIFICATION_FAILED` logged |
| Duplicate webhook rejected | Repeat event ID | Handler skips; no duplicate processing |
| Schema validation rejects malformed response | Malformed payload | `EXT_[SERVICE]_INVALID_RESPONSE`; fallback returned |

---

## 9. Acceptance Criteria

- [ ] All integrations authenticate successfully in all environments

- [ ] All external API errors handled with correct error codes and fallback behavior

- [ ] All webhook signatures verified before processing

- [ ] All webhook handlers are idempotent

- [ ] All request payloads trimmed to minimum required fields — no excess PII transmitted

- [ ] All response payloads validated against schema before use

- [ ] No API keys or secrets present in source code

- [ ] Rate limiting handled for all external services

- [ ] All integrations have entries in Environment & Secrets Reference

- [ ] All error codes used here exist in Error & State Reference

## Cross-Document Validation

This section enumerates the cross-document checks that involve the Data & Integration PRD. Agents must run all applicable checks before treating the suite as build-ready.

### Inbound Dependencies (this PRD consumes)

| Check ID | Source Document | Rule | Severity |
| --- | --- | --- | --- |
| CD-DAT-IN-001 | Master PRD Index | productName, version, and tier anchors must match §3 of the index | Critical |
| CD-DAT-IN-002 | Master PRD Index | This document's precedence declaration must be consistent with §6 of the index | Critical |

### Outbound Dependencies (this PRD produces)

| Check ID | Target Document | Rule | Severity |
| --- | --- | --- | --- |
| CD-DAT-OUT-001 | All downstream documents | Every schema, error code, role, and copy key defined here must be referenced exactly as written | Critical |
| CD-DAT-OUT-002 | Master PRD Index | Any change to anchors in this document must be propagated to §3 of the index | Critical |

### Tier-Specific Cross-Checks

| Check ID | Rule | Severity |
| --- | --- | --- |
| CD-DAT-TIER-001 | No field, code, or role defined in this document is duplicated by another base PRD at a different tier | Critical |
| CD-DAT-TIER-002 | Conflicts between this document and any subordinate Agent PRD are resolved in favor of this document | High |

### Resolution Protocol

1. Identify the conflict and the documents involved.
2. Apply the Master PRD Index §6 precedence order.
3. If this document is higher-precedence: the other document must be updated and its version incremented.
4. If this document is lower-precedence: update this document to match.
5. Record the resolution in the Master PRD Index §5 (Known Conflicts) and in the Version History below.

---

## Version History

| Version | Date | Author | Changes |
| --- | --- | --- | --- |
| 2.0 | \[Date\] | \[Name\] | Initial v2 release with RLM principles |
| 2.1 | \[Date\] | \[Name\] | Added Cross-Document Validation and Version History sections per RLM compliance |

---

**END OF DATA & INTEGRATION PRD**