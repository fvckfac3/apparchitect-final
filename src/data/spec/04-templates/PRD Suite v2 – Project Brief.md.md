# [Product Name] – Project Brief

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** [Product Name] – Master PRD Index
**Precedence:** 1st (foundational — all downstream documents derive from this)

---

## ⚠️ Precedence Compliance Block

This document is the foundation. No other document may override it. If a later document conflicts with this brief, the brief is the source of truth unless explicitly amended via the Changelog & Decision Log.

---

## 1. Purpose of This Document

The Project Brief defines what the product is, who it serves, what it does, and why it exists. Every downstream document — Core Systems, Experience, Technical Architecture, Marketing — derives its scope from this brief.

This document does not define how the product is built. That is the Technical Architecture PRD. It does not define how users experience it. That is the Experience & Access PRD. It defines **what and why** only.

---

## 2. Product Identity

| Field | Value |
|---|---|
| Product Name | [Name] |
| One-line Description | [Single sentence describing the product] |
| Product Type | [SaaS / Marketplace / Tool / Platform / Mobile App / Other] |
| Tenancy Model | single / multi-logical / multi-physical |
| Pricing Model | [Free / Freemium / Paid / Tiered / Enterprise] |
| Platforms | [Web / iOS / Android / Desktop] |
| Target Launch | [Date or quarter] |

---

## 3. Problem Statement

What specific problem does this product solve? For whom? Why is the problem worth solving now?

**Problem (plain language):**
[2–4 sentences describing the problem in terms a non-technical reader understands. Avoid jargon. State the cost of the problem — what does the user lose by not solving it?]

**Why now:**
[What changed in the world, technology, or market that makes this product possible or necessary now? What alternatives exist and why are they insufficient?]

**Cost of inaction:**
[What does the user continue to lose by not adopting this product? Quantify if possible — time, money, missed opportunities, relationship damage, health impact.]

---

## 4. Proposed Solution

**Solution summary:**
[3–5 sentences describing what the product does, in concrete terms. What does the user do, and what does the product do in response?]

**Core value proposition:**
[The single most important benefit a user gets from this product. One sentence. This is the headline of every marketing surface.]

**How it works (high level):**
1. [Step 1 — what the user does]
2. [Step 2 — what the system does]
3. [Step 3 — what the user gets]

**What this product is not:**
- [Misconception 1 — what people might think this is, but it isn't]
- [Misconception 2]

---

## 5. Target Users

### 5.1 Primary Persona

| Attribute | Value |
|---|---|
| Name | [Persona name] |
| Role | [Who they are] |
| Context | [When/where they use this product] |
| Pain Point | [Specific problem they have] |
| Success State | [What "good" looks like for them after using this product] |
| Technical Literacy | low / medium / high |
| Device Preference | [Mobile / Desktop / Both] |
| Vulnerability Level | low / medium / high / critical |

For detailed persona definitions, see User Personas document.

### 5.2 Secondary Personas
[List 1–3 secondary personas. Each gets the same treatment but with briefer detail. If there are no secondary personas, write "None in v1" and explain why.]

### 5.3 Anti-Personas
Who is this product explicitly NOT for? This list is as important as the target personas — it prevents scope creep and clarifies positioning.

- [Anti-persona 1 — and why this product is wrong for them]
- [Anti-persona 2]

---

## 6. Core Principles

The 3–7 principles that govern every product and engineering decision. Every feature must satisfy these or be rejected. Every conflict between features is resolved by these.

| # | Principle | What It Means In Practice |
|---|---|---|
| 1 | [Principle name] | [Concrete decision this principle forces] |
| 2 | [Principle name] | [Concrete decision this principle forces] |
| 3 | [Principle name] | [Concrete decision this principle forces] |
| 4 | [Principle name] | [Concrete decision this principle forces] |
| 5 | [Principle name] | [Concrete decision this principle forces] |

**Example of a principle in action:**
"Principle 3 (User controls always accessible) — When a user is in an active flow, the Pause and Exit controls remain visible and tappable at all times. This forced the redesign of our [feature] to keep those controls persistent on mobile."

---

## 7. Scope Boundaries

### 7.1 In Scope (v1)

The complete list of capabilities the v1 product must ship with. Anything not on this list is not in v1.

- [Capability 1]
- [Capability 2]
- [Capability 3]
- [Capability 4]
- [Capability 5]

### 7.2 Out of Scope (v1, explicit non-goals)

These are features the team has considered and explicitly chosen to defer. Documenting them prevents repeated re-litigation.

- [Deferred capability 1 — and why deferred]
- [Deferred capability 2 — and why deferred]
- [Deferred capability 3 — and why deferred]

### 7.3 Future Considerations (v2+)

Capabilities the product roadmap includes but does not commit to for v1. These are *known* future work, not deferred-v1 work.

- [v2 capability 1]
- [v2 capability 2]

---

## 8. Success Metrics

How the team will know the product is succeeding. Each metric must be measurable with current tooling and tied to a specific date or milestone.

| Metric | Current Baseline | Target (90 days post-launch) | Measurement Method |
|---|---|---|---|
| [Metric 1 — e.g., Weekly active users] | [Current] | [Target] | [How measured] |
| [Metric 2 — e.g., Activation rate] | [Current] | [Target] | [How measured] |
| [Metric 3 — e.g., Retention D7] | [Current] | [Target] | [How measured] |
| [Metric 4 — e.g., NPS] | [Current] | [Target] | [How measured] |

**Counter-metrics:** Metrics the team will watch to ensure success metrics are not achieved at the cost of user harm.

| Counter-Metric | Trigger Threshold | Action |
|---|---|---|
| [e.g., Support tickets per 1k users] | [e.g., > 50/week] | [e.g., Escalate to product review] |
| [e.g., Voluntary churn] | [e.g., > 20%/month] | [e.g., Trigger user research] |

---

## 9. Constraints & Assumptions

### 9.1 Hard Constraints
Non-negotiable constraints. The product cannot violate these under any circumstances.

- [Constraint 1 — e.g., "Must be HIPAA compliant"]
- [Constraint 2 — e.g., "Cannot store payment card data directly (PCI scope)"]
- [Constraint 3]

### 9.2 Soft Constraints (Preferences)
Preferences that should be honored when possible but can be traded off against other priorities.

- [Preference 1 — e.g., "Prefer serverless over server-based to minimize ops overhead"]
- [Preference 2]

### 9.3 Assumptions
Beliefs the team holds that, if wrong, would materially change the product. These must be re-validated at each major phase.

- [Assumption 1 — e.g., "Users have reliable internet on mobile"]
- [Assumption 2 — e.g., "Average user session length is < 10 minutes"]
- [Assumption 3]

---

## 10. Stakeholders & Decision Authority

| Role | Name | Decision Authority |
|---|---|---|
| Product Owner | [Name] | Final say on scope, priorities, trade-offs |
| Engineering Lead | [Name] | Final say on technical architecture and feasibility |
| Design Lead | [Name] | Final say on UX, visual direction, content |
| Safety/Compliance Lead | [Name] | Veto power on any safety, privacy, or compliance concern |
| [Other role] | [Name] | [Scope of authority] |

**Decision protocol:**
- [How decisions are made — e.g., "Product owner proposes; engineering lead approves feasibility; safety lead holds veto on safety issues"]
- [When escalation is required]
- [What gets decided by whom without group discussion]

---

## 11. RLM Compliance

| Field | Value |
|---|---|
| Information Density | O(1) — constant. This document is answered once and referenced everywhere |
| Density Explanation | One product, one set of users, one set of principles. No N-axis to iterate over |
| Decomposition Required | No |
| Anchor Types Stored | Product Identity, Audience, Principle, Constraint, Stakeholder |

**Verification sub-call requirement:** Before this brief is marked complete, the orchestrator must re-surface every anchored field and confirm it has not been silently overridden by any subsequent interview answer.

---

## 12. Acceptance Criteria

- [ ] Problem statement is concrete and quantified
- [ ] Solution summary fits in 5 sentences without jargon
- [ ] All personas are named, contextualized, and have a clear success state
- [ ] Anti-personas are explicit
- [ ] Core principles are 3–7 items, each with a concrete decision it forces
- [ ] In-scope list is exhaustive for v1
- [ ] Out-of-scope items are documented with reasons
- [ ] Success metrics have current baseline, target, and measurement method
- [ ] Counter-metrics exist for each user-harm risk
- [ ] All hard constraints are documented
- [ ] All assumptions are explicit and validation-dated

---

**END OF PROJECT BRIEF**
