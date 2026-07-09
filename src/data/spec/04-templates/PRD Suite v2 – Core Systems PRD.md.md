# [Product Name] – Core Systems PRD

**Version:** 2.0  
**Status:** Authoritative · Build-Ready  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** 2nd (overrides Experience, Technical, Data, Content PRDs)

---

## ⚠️ Precedence Compliance Block

Before implementing anything in this document, verify the following:

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | No system may store data beyond what function requires | Every data object field must have a stated functional purpose |
| Safety, Privacy & Control PRD | AI must never exceed defined role boundaries | All AI-touching systems must include boundary enforcement |
| Safety, Privacy & Control PRD | Crisis detection supersedes all system states | State machines must include safety interrupt paths |
| Master PRD Index | Canonical schemas here override Technical Architecture PRD | DB schema in Technical PRD must match objects defined here |

---

## 1. Purpose of This Document

This document defines every core system that makes [Product Name] function. It specifies what the product does, not how it is built (Technical Architecture PRD) or how users experience it (Experience & Access PRD).

Any implementation that deviates from this document is considered incorrect regardless of technical performance or UI quality.

---

## 2. Systems Covered

| # | System Name | Purpose |
|---|---|---|
| 1 | [System Name] | [One-line description] |
| 2 | [System Name] | [One-line description] |
| 3 | [System Name] | [One-line description] |
| 4 | [System Name] | [One-line description] |

These systems are interdependent and must be implemented as a cohesive unit.

---

## 3. System 1: [System Name]

### 3.1 Purpose
[What this system does and why it exists. 2–4 sentences.]

### 3.2 Plain-Language Explanation
[How this system behaves from the user's perspective. Written for a non-technical reader.]

### 3.3 Scope Boundaries

**In Scope:**
- [Capability 1]
- [Capability 2]

**Out of Scope:**
- [Excluded capability 1]
- [Excluded capability 2]

### 3.4 State Machine

**Allowed States:**

| State | Value | Description |
|---|---|---|
| [State name] | `[STATE_VALUE]` | [What it means] |
| [State name] | `[STATE_VALUE]` | [What it means] |
| [State name] | `[STATE_VALUE]` | [Terminal — no exit] |

**Transition Table:**

| From State | Trigger | To State | Blocked? |
|---|---|---|---|
| `[STATE_A]` | [Condition] | `[STATE_B]` | No |
| `[STATE_A]` | [Condition] | `[STATE_C]` | No |
| `[STATE_B]` | [Condition] | `[STATE_A]` | No |
| `[STATE_C]` | Any | Any | **Yes — terminal** |
| `[STATE_A]` | Direct jump to `[STATE_C]` | — | **Yes — must pass through B** |

**State Transition Diagram:**
```
[STATE_A] --[trigger]--> [STATE_B] --[trigger]--> [STATE_C] (terminal)
                                   --[trigger]--> [STATE_D]
[STATE_D] --[trigger]--> [STATE_A]
```

**Illegal Transition Behavior:** Any attempted illegal transition must be rejected with `STATE_INVALID_TRANSITION` (see Error & State Reference).

### 3.5 Transactional Boundaries & Failure Atomicity

| Operation | Tables / Systems Involved | Atomicity Requirement | Failure Behavior |
|---|---|---|---|
| [Operation name] | [Table A, Table B] | Full transaction — both succeed or both roll back | On failure: [exact state after rollback] |
| [Operation name] | [Table A, Service B] | Saga — compensating action if step 2 fails | On failure: [compensating action] |

**Race Condition Handling:**

| Scenario | Risk | Mitigation |
|---|---|---|
| [e.g., Concurrent writes to same record] | [e.g., Last-write-wins data loss] | [e.g., Optimistic locking with version field] |
| [Scenario] | [Risk] | [Mitigation] |

### 3.6 User Flows (Deterministic)

**Flow A: [Flow Name]**
1. [Step 1 — who does what]
2. [Step 2 — system response]
3. [Step 3]
4. [Step 4]

**Flow B: [Flow Name]**
1. [Step 1]
2. [Step 2]
3. [Step 3]

### 3.7 Data Contracts

**[Object Name] Object (Canonical)**
```json
{
  "id": "uuid — generated server-side, never client-supplied",
  "field1": "string — [constraints: min X, max Y chars]",
  "field2": "enum — [allowed values: VALUE_A | VALUE_B | VALUE_C]",
  "field3": {
    "nestedField": "boolean — default false"
  },
  "tenantId": "uuid — required if multi-tenant; references tenants.id",
  "createdAt": "ISO-8601 UTC timestamp — set on insert, immutable",
  "updatedAt": "ISO-8601 UTC timestamp — updated on every write"
}
```

**Field Rules:**
- `id`: UUID v4, generated server-side, never accepted from client
- `field1`: [Specific constraints]
- `field2`: Allowed values are [list] — any other value is rejected with `INPUT_INVALID_TYPE`
- `tenantId`: Must match authenticated user's tenant — cross-tenant values rejected with `RESOURCE_ACCESS_DENIED`

### 3.8 Business Logic Rules
- [Rule 1 — e.g., "A user may not have more than one active [resource] at a time"]
- [Rule 2 — e.g., "Completed states are immutable — no field may be updated after COMPLETED"]
- [Rule 3 — e.g., "All timestamps are UTC — no timezone conversion at storage layer"]

### 3.9 Error Conditions

| Condition | Error Code | Expected Behavior |
|---|---|---|
| [Error condition] | `[CODE]` | [What the system must do] |
| [Error condition] | `[CODE]` | [What the system must do] |

### 3.10 Copy Registry Map Keys

| UI State for This System | Content PRD Reference |
|---|---|
| [State displayed to user] | Content PRD → Section [X] → `[key_name]` |
| [State displayed to user] | Content PRD → Section [X] → `[key_name]` |

---

## 4. System 2: [System Name]

### 4.1 Purpose
[Description]

### 4.2 Plain-Language Explanation
[Non-technical description]

### 4.3 Scope Boundaries

**In Scope:**
- [Capability]

**Out of Scope:**
- [Excluded]

### 4.4 State Machine

*(Include if this system has states — use same format as Section 3.4)*

### 4.5 Transactional Boundaries & Failure Atomicity

| Operation | Tables Involved | Atomicity | Failure Behavior |
|---|---|---|---|
| [Operation] | [Tables] | [Type] | [Behavior] |

### 4.6 Data Contracts

**[Object Name] Object (Canonical)**
```json
{
  "id": "uuid",
  "field1": "type — [constraints]",
  "tenantId": "uuid — if multi-tenant",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### 4.7 Business Logic Rules
- [Rule 1]
- [Rule 2]

### 4.8 Error Conditions

| Condition | Error Code | Behavior |
|---|---|---|
| [Condition] | `[CODE]` | [Behavior] |

### 4.9 Copy Registry Map Keys

| UI State | Content PRD Reference |
|---|---|
| [State] | Content PRD → Section [X] → `[key]` |

---

## 5. System 3: [System Name]

> *(Repeat Section 3 structure for each additional system)*

---

## 6. Cross-System Rules (Critical)

These rules govern interactions between all systems and take precedence over individual system specifications.

### 6.1 Dependency Ordering
- [System B] may never be called before [System A] has initialized
- [System C] may only write after [System B] has confirmed success

### 6.2 Data Ownership Rules
- No system may mutate another system's canonical objects directly
- All inter-system data must be passed as typed objects matching the canonical schemas
- No system may bypass the API layer to read or write data

### 6.3 Failure Propagation Rules
- If [System A] fails mid-workflow, [System B] must [specific behavior — e.g., roll back / not proceed / surface error]
- Cross-system failures always return `SYS_UNKNOWN_ERROR` to the client — internal error details never exposed

### 6.4 AI System Cross-System Rules *(if applicable)*
- No AI call may be made without a fully loaded user profile context
- AI output must be validated against the LLM Schema Integrity Contract (Section 6.5) before use
- AI failures must not block non-AI system functions

### 6.5 LLM Schema Integrity Contract *(if AI is used)*

All AI/LLM response payloads must be validated at the API gateway before being passed to any other system. Unvalidated responses must never reach the client.

**Required validation framework:** [Zod / JSON Schema / Joi / custom — specify]

**Validation schema for AI responses:**
```typescript
const AIResponseSchema = z.object({
  content:  z.string().min(1).max([MAX_CHARS]),
  type:     z.enum(['[TYPE_A]', '[TYPE_B]', '[TYPE_C]']),
  metadata: z.object({
    // define expected metadata fields
  }).optional(),
});
```

**On validation failure:**
- Log event with error code `EXT_AI_INVALID_RESPONSE` (no raw content logged)
- Return fallback message to client (from Content & Copy PRD)
- Do not surface schema details in the error response

---

## 7. Acceptance Criteria

- [ ] All systems implement canonical data schemas exactly
- [ ] All state machines enforce allowed transitions and block illegal ones
- [ ] All transactional boundaries atomically succeed or roll back
- [ ] Cross-system rules enforced — no system bypasses the API layer
- [ ] LLM responses validated before use (if AI present)
- [ ] All error conditions return correct codes from Error & State Reference
- [ ] No system calls another before its dependency is initialized
- [ ] [Product-specific criterion]

## Cross-Document Validation

This section enumerates the cross-document checks that involve the Core Systems PRD. Agents must run all applicable checks before treating the suite as build-ready.

### Inbound Dependencies (this PRD consumes)

| Check ID | Source Document | Rule | Severity |
|---|---|---|---|
| CD-COR-IN-001 | Master PRD Index | productName, version, and tier anchors must match §3 of the index | Critical |
| CD-COR-IN-002 | Master PRD Index | This document's precedence declaration must be consistent with §6 of the index | Critical |

### Outbound Dependencies (this PRD produces)

| Check ID | Target Document | Rule | Severity |
|---|---|---|---|
| CD-COR-OUT-001 | All downstream documents | Every schema, error code, role, and copy key defined here must be referenced exactly as written | Critical |
| CD-COR-OUT-002 | Master PRD Index | Any change to anchors in this document must be propagated to §3 of the index | Critical |

### Tier-Specific Cross-Checks

| Check ID | Rule | Severity |
|---|---|---|
| CD-COR-TIER-001 | No field, code, or role defined in this document is duplicated by another base PRD at a different tier | Critical |
| CD-COR-TIER-002 | Conflicts between this document and any subordinate Agent PRD are resolved in favor of this document | High |

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

**END OF CORE SYSTEMS PRD**