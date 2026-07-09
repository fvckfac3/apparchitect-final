# [Product Name] – Error & State Reference

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
| Unauthenticated | `UNAUTHENTICATED` | No valid session | → `AUTHENTICATED` | No |
| Authenticated | `AUTHENTICATED` | Valid session confirmed | → `UNAUTHENTICATED` | No |

### 2.2 Onboarding States

| State | Value | Description | Allowed Transitions | Terminal? |
|---|---|---|---|---|
| Not started | `NOT_STARTED` | Authenticated, onboarding not begun | → `IN_PROGRESS` | No |
| In progress | `IN_PROGRESS` | Started, not complete | → `COMPLETED` | No |
| Completed | `COMPLETED` | All steps done | None | **Yes** |

### 2.3 Invitation States

| State | Value | Description | Allowed Transitions | Terminal? |
|---|---|---|---|---|
| Issued | `ISSUED` | Created and sent | → `PENDING`, → `REVOKED` | No |
| Pending | `PENDING` | Opened, not accepted | → `CLAIMED`, → `EXPIRED`, → `REVOKED` | No |
| Claimed | `CLAIMED` | Accepted, account created | None | **Yes** |
| Expired | `EXPIRED` | TTL exceeded | → `ISSUED` (re-send only) | No |
| Revoked | `REVOKED` | Manually cancelled | None | **Yes** |

### 2.4 [Feature/System] States

| State | Value | Description | Allowed Transitions | Terminal? |
|---|---|---|---|---|
| [State] | `[VALUE]` | [Description] | → `[VALUE]`, → `[VALUE]` | No |
| [State] | `[VALUE]` | [Description] | None | **Yes** |

---

## 3. State Transition Rules

### 3.1 Auth Transitions

```
UNAUTHENTICATED
  → AUTHENTICATED         trigger: successful login or signup

AUTHENTICATED
  → UNAUTHENTICATED       trigger: logout, session expiry, password change, account deletion
```

**Illegal:** `AUTHENTICATED` → `AUTHENTICATED` — silently ignored (idempotent)  
**On illegal transition:** Return `STATE_INVALID_TRANSITION`

### 3.2 Onboarding Transitions

```
NOT_STARTED
  → IN_PROGRESS           trigger: user begins step 1

IN_PROGRESS
  → COMPLETED             trigger: all steps completed in order
  → IN_PROGRESS           trigger: refresh or return — resume at last step (idempotent)
```

**Illegal:** `NOT_STARTED` → `COMPLETED` — always blocked  
**Illegal:** `COMPLETED` → any state — always blocked (terminal)

### 3.3 Invitation Transitions

```
ISSUED
  → PENDING               trigger: recipient opens link
  → REVOKED               trigger: OWNER/ADMIN cancels

PENDING
  → CLAIMED               trigger: recipient completes signup
  → EXPIRED               trigger: TTL exceeded (default: 48 hours)
  → REVOKED               trigger: OWNER/ADMIN cancels

EXPIRED
  → ISSUED                trigger: new invitation issued (new token — old token not reused)

CLAIMED / REVOKED         → terminal — no transitions out
```

### 3.4 [Feature] Transitions

```
[STATE_A]
  → [STATE_B]             trigger: [condition]
  → [STATE_C]             trigger: [condition]

[STATE_B]
  → [STATE_D]             trigger: [condition]
  → [STATE_A]             trigger: [condition — cancel]

[STATE_D]                 → terminal
```

**Illegal:** `[STATE_A]` → `[STATE_D]` — must pass through `[STATE_B]`

---

## 4. Error Code Registry

### 4.1 Format Convention

```
[DOMAIN]_[DESCRIPTION]
```

| Domain Prefix | Covers |
|---|---|
| `AUTH_` | Authentication and session errors |
| `INPUT_` | Input validation errors |
| `STATE_` | State transition errors |
| `DB_` | Database errors |
| `EXT_` | External service errors |
| `BIZ_` | Business logic violations |
| `PERMISSION_` | Access control errors |
| `INVITE_` | Invitation lifecycle errors |
| `SEC_` | Security violations |
| `SYS_` | System-level errors |

### 4.2 Authentication Errors

| Code | HTTP Status | Copy Key | When It Occurs |
|---|---|---|---|
| `AUTH_INVALID_CREDENTIALS` | 401 | `auth.error.invalid_credentials` | Email/password combination incorrect |
| `AUTH_EMAIL_EXISTS` | 409 | `auth.error.email_exists` | Signup with existing email |
| `AUTH_SESSION_EXPIRED` | 401 | `auth.error.session_expired` | Session token has expired |
| `AUTH_UNAUTHORIZED` | 401 | `errors.unauthorized` | Request without valid session |
| `AUTH_FORBIDDEN` | 403 | `errors.forbidden` | Authenticated but not permitted |
| `AUTH_OAUTH_FAILED` | 400 | `auth.error.oauth_failed` | OAuth provider returned error |

### 4.3 Input Validation Errors

| Code | HTTP Status | Copy Key | When It Occurs |
|---|---|---|---|
| `INPUT_FIELD_REQUIRED` | 400 | `validation.required` | Required field empty |
| `INPUT_INVALID_FORMAT` | 400 | `validation.[field].format` | Value fails format check |
| `INPUT_TOO_SHORT` | 400 | `validation.[field].too_short` | Value below minimum length |
| `INPUT_TOO_LONG` | 400 | `validation.[field].too_long` | Value exceeds maximum length |
| `INPUT_INVALID_EMAIL` | 400 | `validation.email.format` | Email format invalid |
| `INPUT_INVALID_TYPE` | 400 | `validation.[field].type` | Wrong data type |

### 4.4 State Transition Errors

| Code | HTTP Status | Copy Key | When It Occurs |
|---|---|---|---|
| `STATE_INVALID_TRANSITION` | 400 | `errors.state.invalid_transition` | Attempted illegal state transition |
| `STATE_ALREADY_TERMINAL` | 400 | `errors.state.terminal` | Attempted to transition from terminal state |
| `STATE_PREREQUISITE_UNMET` | 400 | `errors.state.prerequisite` | Required prior state not reached |

### 4.5 Database Errors

| Code | HTTP Status | Copy Key | When It Occurs |
|---|---|---|---|
| `DB_RECORD_NOT_FOUND` | 404 | `errors.not_found` | Requested record does not exist |
| `DB_DUPLICATE_RECORD` | 409 | `errors.duplicate` | Unique constraint violated |
| `DB_WRITE_FAILED` | 500 | `errors.server` | Write operation failed |
| `DB_CONNECTION_FAILED` | 500 | `errors.server` | Cannot connect to database |

### 4.6 External Service Errors

| Code | HTTP Status | Copy Key | When It Occurs |
|---|---|---|---|
| `EXT_AI_TIMEOUT` | 503 | `errors.service_unavailable` | AI provider timeout |
| `EXT_AI_INVALID_RESPONSE` | 500 | `errors.server` | AI response schema validation failed |
| `EXT_AI_RATE_LIMITED` | 429 | `errors.service_unavailable` | AI provider rate limit hit |
| `EXT_[SERVICE]_UNAVAILABLE` | 503 | `errors.service_unavailable` | External service unreachable |
| `EXT_[SERVICE]_AUTH_FAILED` | 500 | `errors.server` | External service credential rejected |
| `EXT_[SERVICE]_INVALID_RESPONSE` | 500 | `errors.server` | External service response failed schema validation |

### 4.7 Permission Errors

| Code | HTTP Status | Copy Key | When It Occurs |
|---|---|---|---|
| `PERMISSION_DENIED` | 403 | `errors.permission.role_required` | Lacks required permission |
| `ROLE_REQUIRED` | 403 | `errors.permission.role_required` | Lacks required role |
| `RESOURCE_ACCESS_DENIED` | 403 | `errors.permission.resource_denied` | Cannot access specific resource |
| `OWNER_REQUIRED` | 403 | `errors.permission.owner_required` | Action requires ownership |
| `ROLE_CANNOT_BE_CHANGED` | 400 | `errors.permission.role_locked` | Role change violates guardrail |

### 4.8 Invitation Errors

| Code | HTTP Status | Copy Key | When It Occurs |
|---|---|---|---|
| `INVITE_TOKEN_INVALID` | 400 | `errors.invite.invalid` | Token does not match any invitation |
| `INVITE_TOKEN_EXPIRED` | 400 | `errors.invite.expired` | Token TTL exceeded |
| `INVITE_TOKEN_CLAIMED` | 400 | `errors.invite.claimed` | Token already used |
| `INVITE_TOKEN_REVOKED` | 400 | `errors.invite.revoked` | Token manually cancelled |
| `INVITE_EMAIL_MISMATCH` | 400 | `errors.invite.email_mismatch` | Signup email doesn't match invitation |

### 4.9 Security Errors (Internal — Not Exposed to Client)

| Code | HTTP Status | Logged As | When It Occurs |
|---|---|---|---|
| `SEC_WEBHOOK_VERIFICATION_FAILED` | 401 | Event metadata only | Inbound webhook signature invalid |
| `SEC_RATE_LIMIT_EXCEEDED` | 429 | Event metadata only | Rate limit hit on sensitive endpoint |
| `SEC_SUSPICIOUS_INPUT` | 400 | Event metadata only | Input matches known attack pattern |

### 4.10 Business Logic Errors

| Code | HTTP Status | Copy Key | When It Occurs |
|---|---|---|---|
| `BIZ_[RULE_VIOLATION]` | 400 | `errors.biz.[rule]` | [Specific business rule violated] |
| `BIZ_[RULE_VIOLATION]` | 400 | `errors.biz.[rule]` | [Rule] |

### 4.11 System Errors

| Code | HTTP Status | Copy Key | When It Occurs |
|---|---|---|---|
| `SYS_UNKNOWN_ERROR` | 500 | `errors.server` | Unexpected system failure |
| `SYS_MAINTENANCE` | 503 | `errors.service_unavailable` | System in maintenance mode |
| `SYS_NETWORK_ERROR` | 503 | `auth.error.network` | Network connectivity failure |

---

## 5. Status Enums

### 5.1 [Object Name] Status

```typescript
enum [ObjectName]Status {
  [VALUE_A] = '[value_a]',   // [Description — when set, allowed transitions]
  [VALUE_B] = '[value_b]',   // [Description]
  [VALUE_C] = '[value_c]',   // [Description — terminal, no transitions out]
}
```

**Rules:**
- `[VALUE_C]` is terminal — no transitions out, no field mutations after this state
- `[VALUE_A]` may only transition to `[VALUE_B]` or `[VALUE_C]`

---

## 6. Boolean Flags Reference

| Object | Field | True Means | False Means | Default | Mutable After Set? |
|---|---|---|---|---|---|
| `[Object]` | `[field]` | [Meaning] | [Meaning] | [true/false] | [Yes/No] |
| `user` | `emailVerified` | Email confirmed | Email not yet confirmed | false | No — immutable once true |

---

## 7. Error Handling Matrix

| Error Code | Server Action | Client Display | Recovery Available? |
|---|---|---|---|
| `AUTH_INVALID_CREDENTIALS` | Log event (no PII), return 401 | Inline error on form | Yes — retry |
| `AUTH_SESSION_EXPIRED` | Invalidate session | Redirect to login with message | Yes — re-login |
| `INPUT_FIELD_REQUIRED` | Return 400 with field name | Inline error on specific field | Yes — correct input |
| `DB_CONNECTION_FAILED` | Log error, alert ops, return 500 | Generic error message | No — wait and retry |
| `EXT_AI_TIMEOUT` | Retry once, then return fallback | Fallback message shown | No — automatic |
| `EXT_AI_INVALID_RESPONSE` | Log event (no content), return fallback | Fallback message | No — automatic |
| `PERMISSION_DENIED` | Log event, return 403 | Permission denied message | No — role upgrade needed |
| `SEC_WEBHOOK_VERIFICATION_FAILED` | Log event, return 401 | Never exposed to client | No |
| `SYS_UNKNOWN_ERROR` | Log full stack trace (no PII), return 500 | Generic error message | No |
| `[CODE]` | [Server action] | [Client display] | [Yes/No] |

---

## 8. State Persistence Reference

| State | Persistence Layer | Duration | Cleared By |
|---|---|---|---|
| Auth session | HTTP-only cookie | [30] days inactivity | Logout, expiry, password change, deletion |
| Onboarding progress | Database | Until `COMPLETED` | N/A — retained in profile |
| Invitation token | Database (hashed) | [48] hours from issue | Claim, revoke, expiry |
| [State] | [Layer] | [Duration] | [What clears it] |

---

## 9. Acceptance Criteria

- [ ] Every error code used anywhere in the codebase exists in this document
- [ ] Every status enum used in data objects is defined here
- [ ] Every error code has a corresponding copy key in the Content & Copy PRD
- [ ] Every state transition is listed and illegal transitions are blocked in implementation
- [ ] Error handling matrix implemented correctly for all codes
- [ ] No error codes in the codebase that are not in this document

## Cross-Document Validation

This section enumerates the cross-document checks that involve the Error & State Reference. Agents must run all applicable checks before treating the suite as build-ready.

### Inbound Dependencies (this PRD consumes)

| Check ID | Source Document | Rule | Severity |
|---|---|---|---|
| CD-ERR-IN-001 | Master PRD Index | productName, version, and tier anchors must match §3 of the index | Critical |
| CD-ERR-IN-002 | Master PRD Index | This document's precedence declaration must be consistent with §6 of the index | Critical |

### Outbound Dependencies (this PRD produces)

| Check ID | Target Document | Rule | Severity |
|---|---|---|---|
| CD-ERR-OUT-001 | All downstream documents | Every schema, error code, role, and copy key defined here must be referenced exactly as written | Critical |
| CD-ERR-OUT-002 | Master PRD Index | Any change to anchors in this document must be propagated to §3 of the index | Critical |

### Tier-Specific Cross-Checks

| Check ID | Rule | Severity |
|---|---|---|
| CD-ERR-TIER-001 | No field, code, or role defined in this document is duplicated by another base PRD at a different tier | Critical |
| CD-ERR-TIER-002 | Conflicts between this document and any subordinate Agent PRD are resolved in favor of this document | High |

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

**END OF ERROR & STATE REFERENCE**