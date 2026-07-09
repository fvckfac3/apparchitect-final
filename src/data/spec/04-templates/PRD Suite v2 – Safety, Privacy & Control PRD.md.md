# [Product Name] – Safety, Privacy & Control PRD

**Version:** 2.0  
**Status:** Authoritative · Overrides All Other PRDs Where Applicable  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** HIGHEST — overrides all other documents in all conflicts, no exceptions

---

## 1. Purpose of This Document

This document defines all user safety protections, privacy policies, legal constraints, and control mechanisms for [Product Name]. In any conflict with any other PRD, this document wins without exception.

---

## 2. Risk Profile of This Product

| Dimension | Assessment | Implication |
|---|---|---|
| **User Vulnerability** | [Low / Medium / High / Critical] | [What this means for design decisions] |
| **Data Sensitivity** | [Low / Medium / High / Critical] | [Storage and logging implications] |
| **AI Decision Scope** | [Narrow / Moderate / Broad] | [Validation and boundary requirements] |
| **Regulatory Exposure** | [GDPR / HIPAA / COPPA / CCPA / None / Multiple] | [Compliance requirements] |
| **Minor User Possibility** | [Yes / No / Possible] | [Age verification requirements] |
| **Crisis Scenario Possibility** | [Yes / No / Possible] | [Crisis detection requirements] |

---

## 3. Safety Domains Covered

All seven domains below are fully specified. Each uses a standardized layout to prevent implementation gaps.

1. Crisis & High-Risk Content Handling
2. AI Role Boundaries
3. User Controls & Autonomy
4. Data Privacy & Retention
5. Logging & Observability Constraints
6. Account Deletion & Data Export
7. Legal & Regulatory Compliance

---

## 4. Domain 1: Crisis & High-Risk Content Handling

### 4.1 Purpose
Detect and respond safely to language indicating self-harm, suicidal ideation, or imminent danger without positioning the system as a replacement for professional help.

### 4.2 Detection Rules

| Trigger Type | Examples | Detection Layer |
|---|---|---|
| Explicit suicidal intent | "I want to end my life", "I'm going to kill myself" | Server-side, pre-response |
| Self-harm ideation | "I want to hurt myself", references to self-injury methods | Server-side, pre-response |
| Imminent danger | "Someone is threatening me right now" | Server-side, pre-response |
| [Additional trigger] | [Examples] | [Layer] |

Detection occurs **server-side before any response is delivered to the client.**

### 4.3 Required Response Behavior

| Condition | System MUST | System MUST NEVER |
|---|---|---|
| Crisis detected | Display non-intrusive resource banner | Claim to be sufficient support |
| Crisis detected | Provide region-agnostic emergency guidance | Provide step-by-step crisis coping techniques |
| Crisis detected | Maintain calm, non-alarmist tone | Discourage seeking external help |
| Crisis detected | Stop all therapeutic exercises or active flows | Continue exercises or structured sessions |

### 4.4 State Changes on Crisis Detection

| State | Behavior |
|---|---|
| Conversation/session state | Frozen — no new actions processed until banner dismissed |
| Active exercise or flow | Paused immediately |
| Banner visibility | Displayed until manually dismissed by user |
| Future detection | Remains active — dismissal does not disable detection |

### 4.5 Logging Constraints for Crisis Content

- Crisis-flagged message content: **NEVER logged** (raw content prohibited)
- Crisis detection event: **MAY be logged** as metadata only (event type, timestamp, session ID — no content)

### 4.6 Acceptance Criteria for This Domain

- [ ] Crisis detection triggers on every message matching detection rules
- [ ] Detection runs server-side before response delivery
- [ ] Crisis banner displayed on every trigger
- [ ] Active exercises stop on trigger
- [ ] Raw message content never appears in logs
- [ ] Dismissal does not disable future detection

---

## 5. Domain 2: AI Role Boundaries

### 5.1 What the AI May Do

| Permitted Behavior | Notes |
|---|---|
| [Permitted behavior 1] | [Constraint] |
| [Permitted behavior 2] | [Constraint] |
| [Permitted behavior 3] | [Constraint] |

### 5.2 What the AI Must Never Do

| Prohibited Behavior | Error if Detected |
|---|---|
| Present itself as human | Immediate response override required |
| Claim therapeutic or medical authority | Response must include explicit disclaimer |
| Make promises of recovery or outcomes | All language must be non-committal |
| Suggest stopping medication or treatment | Automatic safety filter must catch this |
| [Prohibited behavior] | [Consequence] |

### 5.3 Required AI Language Rules

| Rule | Example of Compliant Language | Example of Non-Compliant Language |
|---|---|---|
| Supportive, non-directive | "That sounds really difficult." | "You need to do X." |
| No moral framing | "That's a hard situation." | "That was wrong of you." |
| No urgency manipulation | "Take your time." | "You need to act now." |
| [Rule] | [Compliant] | [Non-compliant] |

### 5.4 AI Output Validation

All AI responses must pass validation before delivery:

| Validation Check | Method | On Failure |
|---|---|---|
| Does not claim human identity | Keyword + semantic check | Override with compliant fallback |
| Does not claim authority | Pattern matching | Override with disclaimer |
| Schema compliance | Zod / JSON Schema (see Core Systems §6.5) | Return fallback message |
| No prohibited content | [Classifier / keyword filter] | Block and log event (no content) |

### 5.5 Acceptance Criteria for This Domain

- [ ] AI never claims human identity in any response
- [ ] AI never claims professional authority
- [ ] AI output validation runs before every client delivery
- [ ] Prohibited content never reaches the client
- [ ] All fallback messages match Content & Copy PRD

---

## 6. Domain 3: User Controls & Autonomy

### 6.1 Always-Available Controls

These controls must be accessible to users at all times regardless of system state:

| Control | Where Accessible | What It Does |
|---|---|---|
| Pause any active process | [Location in UI] | Immediately suspends active flow |
| Decline any suggestion | [Location] | Dismisses suggestion, no penalty |
| Exit conversation freely | [Location] | Returns to neutral state |
| Modify tone/pace preferences | Settings | Applied to all future interactions |

### 6.2 Irrevocable User Rights

These actions require confirmation but must never be blocked by any role, system state, or business logic:

| Right | Confirmation Required | Reversible | SLA |
|---|---|---|---|
| Full account deletion | Yes — explicit confirmation dialog | No — irreversible after confirm | Data purged within [30] days |
| Data export | Yes — request confirmation | N/A | Delivered within [48 hours] |

### 6.3 Acceptance Criteria for This Domain

- [ ] Pause control accessible during all active flows
- [ ] Users can exit any flow without penalty
- [ ] Account deletion is accessible from Settings at all times
- [ ] Data export is accessible from Settings at all times
- [ ] Neither deletion nor export can be blocked by system state or user role

---

## 7. Domain 4: Data Privacy & Retention

### 7.1 Data Minimization Rules

| Rule | What It Means |
|---|---|
| Collect only what function requires | Every stored field must have a stated functional purpose — see Core Systems PRD |
| No speculative collection | Do not collect data "for future use" not specified in a PRD |
| No sensitive inference | Do not derive sensitive attributes (health, identity, beliefs) from behavioral data |

### 7.2 Data Sharing Policy

| Category | Shared? | With Whom | Purpose |
|---|---|---|---|
| User messages | Never | — | — |
| Profile data | Never for sale | [Third parties if any — e.g., email service for transactional email only] | [Purpose] |
| Analytics | Yes — anonymized only | [Analytics platform] | Product improvement |
| [Data type] | [Yes/No] | [Who] | [Purpose] |

### 7.3 Retention Schedule

| Data Type | Retention Period | Deletion Trigger | Cascade Effect |
|---|---|---|---|
| Messages | Indefinite unless deleted | Account deletion or user request | Purged within 30 days |
| Profile data | Indefinite unless deleted | Account deletion | Purged within 30 days |
| Session tokens | Until expiry | Expiry or logout | Immediate |
| Logs (event metadata) | [30 / 60 / 90] days | Automatic rotation | Permanent deletion |
| [Data type] | [Duration] | [Trigger] | [Effect] |

### 7.4 Acceptance Criteria for This Domain

- [ ] Every stored field has a stated functional purpose
- [ ] No user data sold or shared beyond stated purposes
- [ ] Retention schedule implemented and enforced
- [ ] Cascade deletes propagate correctly on account deletion

---

## 8. Domain 5: Logging & Observability Constraints

### 8.1 Prohibited from All Logs

The following must **never** appear in any log output, in any environment, under any circumstances:

| Prohibited Item | Reason |
|---|---|
| Raw user message content | Privacy |
| Full AI prompt text | Privacy + security |
| Crisis-flagged message content | Safety + privacy |
| Passwords or password hashes | Security |
| Session tokens or JWT values | Security |
| PII in plaintext (email, name, address) | Privacy |
| Payment card data | PCI compliance |
| [Prohibited item] | [Reason] |

### 8.2 Permitted in Logs

| Permitted Item | Format | Retention |
|---|---|---|
| Event type and timestamp | `{event: "MESSAGE_SENT", sessionId: "uuid", timestamp: "ISO-8601"}` | [30] days |
| Error codes and stack traces (dev only) | Structured JSON | [7] days |
| Anonymous usage metrics | Aggregated counts only | [90] days |
| Auth events (login, logout, failed attempt) | Event type + timestamp + anonymized session ID | [30] days |

### 8.3 Log Access Control

- Log access restricted to: [Role — e.g., OWNER and designated ops personnel]
- Logs may not be modified or deleted by any user role
- Log exports require: [approval process]

### 8.4 Acceptance Criteria for This Domain

- [ ] Zero instances of prohibited content in log outputs across all environments
- [ ] Log retention schedules enforced automatically
- [ ] Log access restricted to specified roles
- [ ] Test: trigger crisis content, verify no raw content in logs

---

## 9. Domain 6: Account Deletion & Data Export

### 9.1 Deletion Flow

| Step | Action | System Behavior |
|---|---|---|
| 1 | User navigates to Settings | Deletion option visible to all authenticated users |
| 2 | User selects "Delete Account" | Confirmation dialog displayed |
| 3 | User confirms deletion | Backend queues deletion job; session invalidated |
| 4 | Confirmation | Email sent to user confirming deletion initiated |
| 5 | Purge | All user data purged within [30] days |

**Deletion is irreversible after confirmation. No grace period unless explicitly specified.**

### 9.2 Data Purge Scope

| Data | Purged? | Timing | Notes |
|---|---|---|---|
| Profile | Yes | Within 30 days | — |
| Messages | Yes | Within 30 days | — |
| Session tokens | Yes | Immediate | — |
| [Data type] | Yes / No | [Timing] | [Notes] |
| Anonymized analytics | No | N/A | Not attributable to user |

### 9.3 Data Export

| Attribute | Specification |
|---|---|
| Format | JSON |
| Contents | Profile, [all user-generated content], insights, preferences |
| Delivery | [Email link / In-app download] |
| SLA | Within [48] hours of request |
| Availability | Must be offered before and during deletion flow |

### 9.4 Acceptance Criteria for This Domain

- [ ] Deletion flow matches specified steps exactly
- [ ] All data purged within SLA
- [ ] Deletion is irreversible after confirmation
- [ ] Data export delivers correct contents within SLA
- [ ] Export offered in deletion flow

---

## 10. Domain 7: Legal & Regulatory Compliance

### 10.1 Applicable Regulations

| Regulation | Applicable | Key Requirements for This Product |
|---|---|---|
| GDPR | [Yes / Partial / No] | [Key requirements — e.g., right to erasure, data portability, consent] |
| CCPA | [Yes / Partial / No] | [Key requirements — e.g., right to know, opt-out of sale] |
| HIPAA | [Yes / Partial / No] | [Key requirements — note: most apps are not covered entities] |
| COPPA | [Yes / Partial / No] | [Key requirements — e.g., parental consent for under-13] |
| [Regulation] | [Applicability] | [Requirements] |

### 10.2 Required Legal Documents

| Document | Status | Location |
|---|---|---|
| Terms of Service | [Draft / Final / Published] | [URL or file path] |
| Privacy Policy | [Draft / Final / Published] | [URL or file path] |
| Cookie Policy | [Draft / Final / Published] | [URL or file path] |
| [Document] | [Status] | [Location] |

### 10.3 Consent Requirements

| Consent Type | When Collected | Method | Stored? |
|---|---|---|---|
| Terms of Service | Signup | Required checkbox | Yes — timestamp + version |
| Privacy Policy | Signup | Required checkbox | Yes — timestamp + version |
| [Consent type] | [When] | [Method] | [Yes/No] |

### 10.4 Age Restrictions

| Setting | Value |
|---|---|
| Minimum age | [13 / 16 / 18 / None] |
| Verification method | [Self-declaration / DOB entry / ID verification / None] |
| Under-age behavior | [Block signup / Require parental consent / N/A] |

### 10.5 Geographic Restrictions

| Region | Available | Blocked | Reason |
|---|---|---|---|
| [Region] | [Yes] | — | — |
| [Region] | — | [Yes] | [Legal / sanctions / etc.] |

### 10.6 Acceptance Criteria for This Domain

- [ ] All required legal documents exist and are published
- [ ] Consent collected at signup with version and timestamp stored
- [ ] Age restriction enforced at signup
- [ ] GDPR right-to-erasure fulfilled by account deletion flow
- [ ] GDPR data portability fulfilled by data export flow
- [ ] [Additional criterion per regulations that apply]

---

## 11. Global Safety Boundary Checklist

*This checklist must be run against the Test Plan PRD to confirm every safety domain has corresponding test coverage. A build may not ship if any item below lacks a passing test.*

| Safety Requirement | Test Plan Reference | Status |
|---|---|---|
| Crisis detection triggers correctly | Test Plan PRD → S-001 | [ ] |
| AI never claims human identity | Test Plan PRD → S-002 | [ ] |
| AI never claims professional authority | Test Plan PRD → S-003 | [ ] |
| Prohibited content absent from logs | Test Plan PRD → S-004 | [ ] |
| Account deletion purges all data | Test Plan PRD → [ID] | [ ] |
| Data export delivers correct contents | Test Plan PRD → [ID] | [ ] |
| Consent stored with timestamp | Test Plan PRD → [ID] | [ ] |
| [Safety requirement] | Test Plan PRD → [ID] | [ ] |

## Cross-Document Validation

This section enumerates the cross-document checks that involve the Safety, Privacy & Control PRD. Agents must run all applicable checks before treating the suite as build-ready.

### Inbound Dependencies (this PRD consumes)

| Check ID | Source Document | Rule | Severity |
|---|---|---|---|
| CD-SAF-IN-001 | Master PRD Index | productName, version, and tier anchors must match §3 of the index | Critical |
| CD-SAF-IN-002 | Master PRD Index | This document's precedence declaration must be consistent with §6 of the index | Critical |

### Outbound Dependencies (this PRD produces)

| Check ID | Target Document | Rule | Severity |
|---|---|---|---|
| CD-SAF-OUT-001 | All downstream documents | Every schema, error code, role, and copy key defined here must be referenced exactly as written | Critical |
| CD-SAF-OUT-002 | Master PRD Index | Any change to anchors in this document must be propagated to §3 of the index | Critical |

### Tier-Specific Cross-Checks

| Check ID | Rule | Severity |
|---|---|---|
| CD-SAF-TIER-001 | No field, code, or role defined in this document is duplicated by another base PRD at a different tier | Critical |
| CD-SAF-TIER-002 | Conflicts between this document and any subordinate Agent PRD are resolved in favor of this document | High |

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

**END OF SAFETY, PRIVACY & CONTROL PRD**