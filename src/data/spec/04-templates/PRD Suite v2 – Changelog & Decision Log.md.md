# \[Product Name\] – Changelog & Decision Log

**Version:** 2.0
**Status:** Living Document · Updated Continuously
**Governed by:** \[Product Name\] – Master PRD Index
**Owner:** Product Owner / Project Lead
**Access:** Read-only for all agents — agents may never modify this document

---

## ⚠️ Precedence Compliance Block

| Higher-Tier Document | Rule That Governs This File | Verification Required |
| --- | --- | --- |
| Safety, Privacy & Control PRD | Safety-related decisions cannot be reversed without explicit re-review | Any decision that touches safety domains must be re-reviewed if changed |
| Master PRD Index | Precedence order is binding | Any decision that reorders document precedence is invalid |

---

## 1. Purpose of This Document

This document records every change made to any PRD document and every significant product decision made during the build. It exists so that any agent, engineer, or stakeholder can understand not just what a requirement is, but why it is that way, who decided it, when, and what it replaced.

**Rules:**

- Every PRD change must be logged here before the updated PRD is committed
- Every significant product or architectural decision must be logged here, even if no PRD changed
- Entries are never deleted — superseded entries are marked `SUPERSEDED`
- Entries are added in reverse chronological order (newest first)
- This document is read-only for agents — agents may never write to it
- Agents must read this document before beginning work to understand current product state and any decisions that affect their task

---

## 2. How to Read This Document

| Term | Meaning |
| --- | --- |
| **PRD Change** | A modification to any document in the suite |
| **Decision** | A product, architectural, or design choice that affects behavior |
| **Superseded** | An entry replaced by a newer decision |
| **Deferred** | A decision consciously postponed |
| **Blocking** | A deferred decision that prevents a specific agent or feature from proceeding |

---

## Part 1: PRD Changelog

*Every change to every document in the suite, newest first.*

---

### \[DATE\] — \[Document Name\] — v\[X.X\]

**Change Type:** `Addition` / `Modification` / `Removal` / `Clarification`
**Section Affected:** \[Section number and name\]
**Changed By:** \[Name or role\]
**Reviewed By:** \[Name or role\]
**Related Decision:** \[DECISION-NNN / None\]

**What Changed:**

> \[Exactly what was added, modified, or removed. Specific enough that someone reading without the diff can understand the full change.\]

**Previous Version:**

```markdown
[Exact text that was replaced, or "N/A — new addition"]
```

**New Version:**

```markdown
[Exact new text, or "N/A — removal"]
```

**Why:**

> \[The reason. Reference a Decision entry if applicable.\]

**Downstream Impact:**

| Impacted Document | Section | Action Required |
| --- | --- | --- |
| \[Document name\] | \[Section\] | \[What must change or be verified\] |
| \[Document name\] | \[Section\] | \[Action\] |

**Agent Re-briefing Required:** \[Yes — list agents / No\]

---

*\[Add new entries above this line, newest first\]*

---

## Part 2: Decision Log

*Every significant product, architectural, or design decision, newest first.*

---

### DECISION-001 — \[DATE\] — \[Short Title\]

**Status:** `Active` / `Superseded by DECISION-NNN` / `Deferred`
**Decision Type:** `Product` / `Architecture` / `Design` / `Security` / `Integration` / `Process` / `Safety`
**Decided By:** \[Name or role\]
**Stakeholders Consulted:** \[Names, roles, or "None"\]
**Safety Impact:** \[Yes — describe / No\]

**Context:**

> \[What situation or question prompted this decision? What was unclear, conflicting, or at risk?\]

**Options Considered:**

| Option | Description | Pros | Cons | Rejected? |
| --- | --- | --- | --- | --- |
| A | \[Description\] | \[Pros\] | \[Cons\] | \[Yes/No\] |
| B | \[Description\] | \[Pros\] | \[Cons\] | \[Yes/No\] |
| C *(chosen)* | \[Description\] | \[Pros\] | \[Cons\] | No — selected |

**Decision:**

> \[State the decision completely. Someone reading in isolation must fully understand what was decided.\]

**Rationale:**

> \[Why this option over the others. Be honest about tradeoffs accepted.\]

**Constraints Resolved:**

> \[What ambiguity, conflict, or question does this eliminate?\]

**Constraints Created:**

> \[What does this lock in or rule out going forward?\]

**PRD Impact:**

| Document Updated | Section | Nature of Change |
| --- | --- | --- |
| \[Document name\] | \[Section\] | \[What changed\] |
| \[Document name\] | \[Section\] | \[What changed\] |

**Expiry Condition:**

> \[Under what circumstances should this be revisited? Or "No expiry — permanent."\]

---

### DECISION-002 — \[DATE\] — \[Short Title\]

**Status:** `Active`
**Decision Type:** `[Type]`
**Decided By:** \[Name\]
**Stakeholders Consulted:** \[Names\]
**Safety Impact:** \[Yes/No\]

**Context:**

> \[Context\]

**Options Considered:**

| Option | Description | Pros | Cons | Rejected? |
| --- | --- | --- | --- | --- |
| A *(chosen)* | \[Description\] | \[Pros\] | \[Cons\] | No |
| B | \[Description\] | \[Pros\] | \[Cons\] | Yes |

**Decision:**

> \[Decision\]

**Rationale:**

> \[Rationale\]

**Constraints Resolved:**

> \[What it resolves\]

**Constraints Created:**

> \[What it locks in\]

**PRD Impact:**

| Document | Section | Change |
| --- | --- | --- |
| \[Document\] | \[Section\] | \[Change\] |

**Expiry Condition:**

> \[Condition or "No expiry"\]

---

*\[Add new entries above this line, newest first\]*

---

## Part 3: Deferred Decisions

*Decisions consciously postponed. Not forgotten — tracked here until resolved.*

| ID | Decision Needed | Deferred By | Date Deferred | Target Resolution | Blocking? | Blocking What |
| --- | --- | --- | --- | --- | --- | --- |
| DEF-001 | \[What needs to be decided\] | \[Name\] | \[Date\] | \[Date or milestone\] | Yes / No | \[Agent or feature blocked\] |
| DEF-002 | \[Decision\] | \[Name\] | \[Date\] | \[Target\] | Yes / No | \[What's blocked\] |

---

## Part 4: Superseded Decisions Index

*Quick reference for replaced decisions.*

| Original Decision | Superseded By | Date Superseded | One-Line Reason |
| --- | --- | --- | --- |
| DECISION-\[NNN\]: \[Title\] | DECISION-\[NNN\] | \[Date\] | \[Reason\] |

---

## Part 5: Safety Decision Audit Trail

*All decisions that touched safety domains, regardless of whether they were changes or confirmations. Required for compliance and audit purposes.*

| Decision ID | Date | Safety Domain Affected | Outcome | Reviewed By |
| --- | --- | --- | --- | --- |
| \[DECISION-NNN\] | \[Date\] | \[Domain — e.g., Crisis Detection\] | \[What was decided\] | \[Name\] |
| \[DECISION-NNN\] | \[Date\] | \[Domain\] | \[Outcome\] | \[Name\] |

---

## Document Version History

| Version | Date | Summary |
| --- | --- | --- |
| 2.0 | \[DATE\] | Added downstream impact table, safety audit trail, agent re-briefing field |
| 1.0 | \[DATE\] | Document created |

---

**END OF CHANGELOG & DECISION LOG**