# [Product Name] – Requirements Summary

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** [Product Name] – Master PRD Index
**Precedence:** 1st (foundational — all downstream documents derive from this)

---

## ⚠️ Precedence Compliance Block

This document synthesizes requirements from the Project Brief and User Personas. It is the **executable checklist** for everything the product must do. If a downstream document contradicts a requirement here, the contradiction must be resolved via the Changelog & Decision Log.

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Project Brief | Scope, principles, constraints | Every requirement here must trace to a brief attribute or a persona |
| User Personas | What each persona needs | Every functional requirement must have at least one persona who needs it |
| Safety, Privacy & Control PRD | Safety requirements are non-negotiable | Safety requirements have the highest priority and cannot be deprioritized |

---

## 1. Purpose of This Document

This document is the **traceability hub**. Every requirement in the product — functional, non-functional, safety, performance, accessibility, compliance — is registered here, given an ID, traced to its source, and given a verification method.

If a requirement is not in this document, it is not a requirement. If a feature is built without a requirement ID, it is unverified scope.

---

## 2. RLM Compliance

| Field | Value |
|---|---|
| Information Density | O(N) — linear, where N is total requirement count |
| Density Explanation | Each requirement is independent; no requirement × requirement interactions in this document (those are checked in Cross-Document Integrity) |
| Decomposition Required | Yes if N > 30. Process by category. |
| Decomposition Strategy | Step 0: probe requirement count. Group by category. Process one category at a time. Verify trace at end. |

---

## 3. Requirement ID Schema

Every requirement has a stable, structured ID. The format is:

```
[DOMAIN_CODE]-[CATEGORY_CODE]-[NUMBER]

Where:
  DOMAIN_CODE: F (Functional) | NF (Non-Functional) | S (Safety) | 
               P (Performance) | A (Accessibility) | C (Compliance) | 
               DX (Developer Experience) | O (Operational)
  CATEGORY_CODE: Two-letter abbreviation of the system/area
  NUMBER: 3-digit zero-padded sequence number
```

**Examples:**
- `F-AUTH-001` — Functional requirement, Auth system, requirement 1
- `NF-PERF-003` — Non-functional, Performance, requirement 3
- `S-CRISIS-001` — Safety, Crisis detection, requirement 1

---

## 4. Functional Requirements

Functional requirements describe what the system does. Each is verifiable by a test.

### 4.1 [System Name]

#### F-[CATEGORY]-001: [Requirement Title]

| Field | Value |
|---|---|
| ID | `F-[CATEGORY]-001` |
| Description | [2-3 sentences describing what the system does. Written in active voice — "The system does X when Y occurs."] |
| Source | [Project Brief §X / User Personas §X / User Story X] |
| Personas Served | [Persona IDs] |
| Priority | Must / Should / Could |
| Acceptance Criteria | [Specific testable condition. "Given X, when Y, then Z."] |
| Verification Method | Unit Test / Integration Test / E2E Test / Manual / Production Metric |
| Verified By | [Test ID or verification step] |
| Status | Not Started / In Progress / Implemented / Verified |

#### F-[CATEGORY]-002: [Requirement Title]
*(Repeat structure for each requirement)*

---

## 5. Non-Functional Requirements

Non-functional requirements describe how the system performs. They are often the most under-specified and most over-looked.

### 5.1 Performance

| ID | Requirement | Target | Measurement |
|---|---|---|---|
| `NF-PERF-001` | [e.g., Page load time on 3G] | [< 2 seconds] | [Lighthouse, RUM, synthetic] |
| `NF-PERF-002` | [e.g., API response time P95] | [< 300ms] | [APM, server logs] |
| `NF-PERF-003` | [e.g., Concurrent user capacity] | [1,000 simultaneous] | [Load test] |

### 5.2 Availability & Reliability

| ID | Requirement | Target |
|---|---|---|
| `NF-AVAIL-001` | [e.g., Uptime SLA] | [99.9% monthly] |
| `NF-AVAIL-002` | [e.g., Recovery Time Objective] | [< 1 hour] |
| `NF-AVAIL-003` | [e.g., Recovery Point Objective] | [< 5 minutes data loss] |

### 5.3 Scalability

| ID | Requirement | Target |
|---|---|---|
| `NF-SCALE-001` | [e.g., User growth capacity] | [10x current peak] |
| `NF-SCALE-002` | [e.g., Data storage growth] | [Plan for X GB/year] |

### 5.4 Accessibility

| ID | Requirement | Standard |
|---|---|---|
| `NF-A11Y-001` | [e.g., WCAG compliance level] | [AA / AAA] |
| `NF-A11Y-002` | [e.g., Keyboard navigation coverage] | [100% of interactive elements] |
| `NF-A11Y-003` | [e.g., Screen reader support] | [NVDA + VoiceOver tested] |

### 5.5 Internationalization

| ID | Requirement |
|---|---|
| `NF-I18N-001` | [e.g., Languages supported in v1] |
| `NF-I18N-002` | [e.g., Currency handling] |
| `NF-I18N-003` | [e.g., Date/time zone handling] |

---

## 6. Safety Requirements

Safety requirements come from the Safety, Privacy & Control PRD. They are **must-have** and have the highest priority. None may be deprioritized without an explicit decision in the Changelog.

| ID | Requirement | Source | Criticality |
|---|---|---|---|
| `S-CRISIS-001` | [e.g., Crisis detection must intercept within 500ms] | [Safety PRD §X] | Critical |
| `S-DATA-001` | [e.g., All data exports logged for audit] | [Safety PRD §X] | High |
| `S-CONSENT-001` | [e.g., Explicit consent required for [data type]] | [Safety PRD §X] | High |

**Full detail in Safety PRD.** This document is the index.

---

## 7. Compliance Requirements

| ID | Requirement | Standard | Verification |
|---|---|---|---|
| `C-GDPR-001` | [e.g., Right to erasure within 30 days] | GDPR | [Audit log + manual review] |
| `C-CCPA-001` | [e.g., "Do Not Sell" honored] | CCPA | [Manual opt-out flow] |
| `C-HIPAA-001` | [e.g., PHI encrypted at rest and in transit] | HIPAA | [Infrastructure audit] |
| `C-SOC2-001` | [e.g., Access controls per SOC 2] | SOC 2 Type II | [Annual audit] |
| `C-[STANDARD]-001` | [Additional compliance requirements] | [Standard] | [Verification] |

---

## 8. Developer Experience Requirements

| ID | Requirement | Target |
|---|---|---|
| `DX-BUILD-001` | [e.g., Local dev setup time] | [< 5 minutes from clone to running] |
| `DX-BUILD-002` | [e.g., Test suite runtime] | [< 5 minutes total] |
| `DX-DEPLOY-001` | [e.g., Deploy time] | [< 10 minutes from merge to production] |
| `DX-DOCS-001` | [e.g., Public API documentation coverage] | [100% of public endpoints] |

---

## 9. Operational Requirements

| ID | Requirement | Target |
|---|---|---|
| `O-MON-001` | [e.g., Logging coverage] | [All API endpoints] |
| `O-MON-002` | [e.g., Alert response time] | [Page on-call within 5 minutes for P0] |
| `O-BACKUP-001` | [e.g., Backup frequency] | [Daily, 30-day retention] |
| `O-INCIDENT-001` | [e.g., Incident postmortem SLA] | [Within 48 hours of resolution] |

---

## 10. Requirement Traceability Matrix

Every requirement must trace to: (a) at least one source (brief, persona, or safety/compliance standard), and (b) at least one verification method.

| Requirement ID | Source(s) | Persona(s) | Verification | Status |
|---|---|---|---|---|
| `F-AUTH-001` | Brief §3 (problem) | primary_user | E2E: signup flow | Not Started |
| `F-AUTH-002` | Brief §3 (problem) | primary_user | Unit: token validation | Not Started |
| `NF-PERF-001` | Brief §9 (assumptions) | primary_user | Lighthouse, RUM | Not Started |
| `S-CRISIS-001` | Safety PRD §X | primary_user | Integration test + manual review | Not Started |
| `C-GDPR-001` | Brief §9 (constraints) | all | Manual audit + log review | Not Started |

**Traceability gaps (must be zero before delivery):**
- [ ] Requirements with no source → must be sourced or removed
- [ ] Requirements with no verification → must add verification or document why
- [ ] Requirements with no persona → must identify persona or document why product serves no persona
- [ ] Sources referenced but not in source documents → must reconcile

---

## 11. Requirements NOT Included

Documenting what's *not* a requirement is as important as documenting what is. This prevents re-litigation of out-of-scope items.

| Considered but excluded | Reason for exclusion |
|---|---|
| [Feature 1] | [Reason — see Project Brief §7.2] |
| [Feature 2] | [Reason — deferred to v2] |
| [Feature 3] | [Reason — out of scope entirely] |

---

## 12. Verification Sub-Call Requirements

Before this document is marked complete, the orchestrator must:

1. **Source verification:** Every requirement traces to a documented source
2. **Persona verification:** Every functional requirement serves at least one persona
3. **Safety verification:** All Safety PRD requirements appear here
4. **Coverage verification:** Every Core Systems PRD system has requirements
5. **Acceptance criteria verification:** Every requirement has at least one acceptance criterion that is testable

---

## 13. Acceptance Criteria

- [ ] Every requirement has a unique ID matching the schema
- [ ] Every requirement has a source trace
- [ ] Every functional requirement serves at least one persona
- [ ] Every requirement has a verification method
- [ ] Every requirement has at least one acceptance criterion
- [ ] All Safety PRD requirements are present here
- [ ] All hard constraints from Project Brief have at least one non-functional requirement
- [ ] Requirements NOT Included list is populated
- [ ] No orphan requirements (no source, no persona, no verification)
- [ ] Traceability matrix is complete

---

**END OF REQUIREMENTS SUMMARY**
