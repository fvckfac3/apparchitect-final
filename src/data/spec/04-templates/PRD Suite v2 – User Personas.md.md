# [Product Name] – User Personas

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** [Product Name] – Master PRD Index
**Precedence:** 1st (foundational alongside Project Brief)

---

## ⚠️ Precedence Compliance Block

This document expands the persona references in the Project Brief into actionable detail. If a persona attribute here conflicts with the brief, the brief is authoritative unless amended via the Changelog & Decision Log.

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Project Brief | Primary persona definition | Primary persona attributes here must match the brief exactly |
| Safety, Privacy & Control PRD | Vulnerability classification | Persona vulnerability levels must align with the risk profile |
| Roles & Permissions Matrix | Role-to-capability mapping | Persona-to-role mapping must be consistent with the matrix |

---

## 1. Purpose of This Document

This document defines every persona that interacts with the product — the people the product is designed for, the people who interact with it incidentally, and the people it must actively repel (anti-personas).

Personas here are **decision tools, not demographics**. Each persona exists to force specific product decisions. If a persona attribute doesn't change a product decision, it's trivia and should be cut.

---

## 2. RLM Compliance

| Field | Value |
|---|---|
| Information Density | O(N×A) — linear-quadratic. N personas × A attributes per persona, plus N personas interacting with the system |
| Density Explanation | Each persona has the same attribute schema; personas interact with each role and capability in the Roles & Permissions Matrix |
| Decomposition Required | Yes — process one persona at a time; do not attempt to generate all personas in a single pass |
| Decomposition Strategy | Step 0: probe number of personas. Step N.1: for each persona, enumerate attribute set. Step N.2: cross-check persona × role interactions against Roles Matrix |

---

## 3. Persona Schema (Canonical)

Every persona in this document must include every field below. Fields may be marked "N/A" but must not be omitted.

```json
{
  "id": "string — slug-form, unique, e.g., 'primary_user'",
  "name": "string — human-readable persona name",
  "role": "string — one-line role description",
  "context": "string — when/where this persona encounters the product",
  "goals": ["array of 2–5 specific goals this persona has when using the product"],
  "painPoints": ["array of 2–5 specific pain points this product addresses"],
  "successState": "string — what 'good' looks like for this persona after using the product",
  "technicalLiteracy": "low | medium | high",
  "devicePreference": "mobile-first | desktop-first | both",
  "vulnerabilityLevel": "low | medium | high | critical",
  "frequencyOfUse": "daily | weekly | monthly | occasional | one-time",
  "sessionLength": "short (< 2 min) | medium (2–10 min) | long (> 10 min)",
  "primaryCapabilities": ["array of capability IDs this persona primarily uses"],
  "permissions": ["array of permission IDs this persona holds — see Roles & Permissions Matrix"],
  "emotionalContext": "string — emotional state this persona brings to the product (stressed, curious, time-pressed, etc.)",
  "successLooksLike": "string — specific measurable outcome this persona achieves"
}
```

---

## 4. Primary Persona

### 4.1 Identity

| Field | Value |
|---|---|
| ID | `[primary_persona_id]` |
| Name | [Persona name] |
| Role | [One-line role description] |

### 4.2 Context

**When they use this product:**
[Specific moment/situation. Not "every day" — the specific moment.]

**Where they use it:**
[Specific location/context. Mobile in transit? Desktop at office? In bed at night?]

**What's happening just before they open the product:**
[Prior state — what just occurred that brings them here]

**What's happening just after they close the product:**
[Next state — what they do once they're done]

### 4.3 Goals & Pain Points

| Goals (what they're trying to do) | Pain Points (what gets in the way) |
|---|---|
| [Goal 1 — specific, actionable] | [Pain point 1 — concrete friction] |
| [Goal 2] | [Pain point 2] |
| [Goal 3] | [Pain point 3] |

### 4.4 Success State

**What "good" looks like for this persona:**
[2–3 sentences describing the specific outcome the persona achieves. This must be measurable — not "feels better" but "completes the task in under 3 minutes without confusion."]

**What "bad" looks like:**
[The negative outcome the persona wants to avoid. This is the failure state the product must prevent.]

### 4.5 Attributes

| Attribute | Value |
|---|---|
| Technical Literacy | low / medium / high |
| Device Preference | mobile-first / desktop-first / both |
| Vulnerability Level | low / medium / high / critical |
| Frequency of Use | daily / weekly / monthly / occasional / one-time |
| Session Length | short / medium / long |
| Emotional Context | [Specific emotional state] |

**Vulnerability justification:**
[If vulnerability level is medium or higher, explain what specifically makes this persona vulnerable in the product context. This drives safety requirements in the Safety PRD.]

### 4.6 Capabilities & Permissions

**Primary capabilities this persona uses:**

| Capability | Why It Matters To This Persona |
|---|---|
| [Capability ID from Core Systems PRD] | [Specific use case for this persona] |
| [Capability ID] | [Use case] |

**Permissions this persona holds:**
[Reference Roles & Permissions Matrix for the role this persona maps to. If a custom role is required, document why and add it to the matrix.]

### 4.7 Representative User Story

A single concrete story that captures how this persona uses the product end-to-end.

> *"[Name] is a [context]. They [action] because [motivation]. The product [system response], and [outcome]. The persona [post-state]."*

---

## 5. Secondary Persona: [Name]

*(Repeat Section 4 structure — keep brief but include all required fields. Each secondary persona is a real persona, not a copy of the primary.)*

### 5.1 Identity
[table]

### 5.2 Context
[3-4 sentences]

### 5.3 Goals & Pain Points
[table]

### 5.4 Success State
[2-3 sentences]

### 5.5 Attributes
[table with vulnerability justification if applicable]

### 5.6 Capabilities & Permissions
[tables]

### 5.7 Representative User Story
[One paragraph]

---

## 6. Tertiary Persona: [Name] (Optional)

*(Same structure. Include only if the product genuinely serves a third meaningfully different user.)*

---

## 7. Anti-Personas

Anti-personas are users the product is **explicitly not designed for**. Documenting them prevents scope creep and clarifies positioning. For each anti-persona, document who they are, what they'd want from the product, and why the product is wrong for them.

### 7.1 Anti-Persona: [Name]

| Field | Value |
|---|---|
| Who they are | [Specific description] |
| What they would want from this product | [Their use case] |
| Why this product is wrong for them | [Specific reason — what they'd have to compromise] |
| Where we will tell them to go instead | [Specific alternative product or path] |

### 7.2 Anti-Persona: [Name]
*(Repeat as needed)*

---

## 8. Persona × Role Mapping

This table maps each persona to the role(s) they hold in the Roles & Permissions Matrix. If a persona requires a custom role, document why.

| Persona | Primary Role | Secondary Roles | Custom Role Required? |
|---|---|---|---|
| [Primary persona] | [Role ID] | [Role IDs] | [Yes/No — why if yes] |
| [Secondary persona] | [Role ID] | [Role IDs] | [Yes/No] |
| [Tertiary persona] | [Role ID] | [Role IDs] | [Yes/No] |

**Cross-check requirement:** Each role in the Roles & Permissions Matrix must be mappable to at least one persona. If a role has no persona, it's either dead code or covering an undocumented user. Resolve before delivery.

---

## 9. Persona × Capability Coverage Matrix

Every Core System capability must be used by at least one persona. If a capability has no persona, it's unused and should be cut or reassigned.

| Capability | Primary Persona | Secondary Persona | Tertiary Persona |
|---|---|---|---|
| [Capability 1] | ✓ | — | — |
| [Capability 2] | ✓ | ✓ | — |
| [Capability 3] | — | ✓ | — |

**Coverage gaps to resolve before delivery:**
- [Any capability with no persona assigned]
- [Any persona with no primary capabilities]

---

## 10. Persona-Driven Design Implications

The personas here drive specific design decisions in downstream documents. Each downstream document must reference the personas it serves.

| Design Decision | Driven By Persona | Document Where It's Specified |
|---|---|---|
| [Decision 1] | [Persona ID] | [Document → Section] |
| [Decision 2] | [Persona ID] | [Document → Section] |
| [Decision 3] | [Persona ID] | [Document → Section] |

---

## 11. Verification Sub-Call Requirements

Before this document is marked complete, the orchestrator must:

1. **Coverage verification:** Every Core Systems PRD capability appears in the Persona × Capability matrix
2. **Role verification:** Every Roles & Permissions Matrix role maps to a persona (or is marked for removal)
3. **Vulnerability verification:** All medium+ vulnerability levels are explicitly justified and trace to Safety PRD requirements
4. **Anchor verification:** Primary persona attributes match the Project Brief exactly

---

## 12. Acceptance Criteria

- [ ] All required schema fields present for every persona
- [ ] Primary persona has full detail per Section 4
- [ ] Each secondary persona has a meaningfully different use case
- [ ] Anti-personas are documented with where-to-instead direction
- [ ] Persona × Role matrix is complete and consistent with Roles & Permissions Matrix
- [ ] Persona × Capability matrix covers all Core Systems capabilities
- [ ] No dead capabilities (capabilities with no persona)
- [ ] No dead roles (roles with no persona)
- [ ] All high-vulnerability personas have safety requirements traced to Safety PRD
- [ ] Vulnerability justifications are specific, not generic

---

**END OF USER PERSONAS**
