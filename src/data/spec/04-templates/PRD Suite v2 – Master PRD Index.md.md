# \[Product Name\] – Master PRD Index

**Version:** 2.0
**Status:** Authoritative · Locked
**Last Updated:** \[DATE\]
**Product Owner:** \[NAME\]

---

## 1. What This Document Is

This is the single authoritative entry point for all Product Requirements Documents (PRDs) for **\[Product Name\]**. Every agent, engineer, or system consuming these requirements must read this index first and fully before proceeding.

This document defines:

- What the product is and is not
- Who it is for
- The non-negotiable principles that govern all decisions
- Which PRD document owns which domain
- How conflicts between documents are resolved
- How agents must behave when requirements are unclear

---

## 2. Product Identity

| Field | Value |
| --- | --- |
| **Product Name** | \[Product Name\] |
| **One-Line Description** | \[What it does, for whom, and why it matters\] |
| **Product Type** | \[Web App / Mobile App / API / CLI / etc.\] |
| **Platform** | \[Web2 / iOS / Android / Cross-platform / etc.\] |
| **Current Phase** | \[MVP / Beta / Production\] |
| **Primary Language** | \[TypeScript / Python / etc.\] |
| **Tenancy Model** | \[Single-tenant / Multi-tenant\] |

### What This Product Is

\[2–3 sentences. Plain language. What does a user do here and what do they get from it?\]

### What This Product Is Not

- \[Explicit non-goal 1\]
- \[Explicit non-goal 2\]
- \[Explicit non-goal 3\]

---

## 3. Target Audience (Canonical)

### Primary User

- **Who:** \[Specific description\]
- **Context:** \[Where/when/why they use this\]
- **Pain Point Solved:** \[The core problem\]
- **Technical Literacy:** \[None / Basic / Intermediate / Advanced\]
- **Emotional Context:** \[Vulnerable / Neutral / Professional / etc.\]

### Secondary User *(if applicable)*

- **Who:** \[Description\]
- **Role:** \[Admin / Viewer / Collaborator / etc.\]

### What All PRDs Must Assume About Users

- \[Assumption 1\]
- \[Assumption 2\]
- \[Assumption 3\]

---

## 4. Core Product Principles (Binding)

These principles govern every design, build, and AI decision. Any implementation that violates these principles is considered incorrect.

| \# | Principle | Meaning in Practice |
| --- | --- | --- |
| 1 | \[Principle\] | \[What it means\] |
| 2 | \[Principle\] | \[What it means\] |
| 3 | \[Principle\] | \[What it means\] |
| 4 | \[Principle\] | \[What it means\] |
| 5 | \[Principle\] | \[What it means\] |

---

## 5. PRD Document Registry

### 5.1 Base PRD Suite

The Base PRD Suite defines the product. Every document here is binding for build decisions.

| # | Document | Governs | Precedence |
| --- | --- | --- | --- |
| 00 | Master PRD Index *(this document)* | Structure, ownership, conflict resolution | Index only — no override power |
| 01 | Project Brief | What the product is, who it is for, the problem it solves | 6th (tied with Content) |
| 02 | User Personas | All user archetypes, their contexts, needs, and constraints | 5th |
| 03 | Requirements Summary | Complete catalog of functional, non-functional, and AI requirements | 4th |
| 04 | Core Systems PRD | All core product logic, data models, system behavior | 2nd highest |
| 05 | Experience & Access PRD | Auth, onboarding, navigation, screen hierarchy, layout | 3rd |
| 06 | UX PRD | Interaction patterns, motion, accessibility, error UX | 4th (tied with Requirements) |
| 07 | Safety, Privacy & Control PRD | Safety, privacy, legal, crisis handling | **Highest — overrides all** |
| 08 | Technical Architecture PRD | Stack, APIs, database, infrastructure, security architecture | 5th |
| 09 | Data & Integration PRD | External APIs, third-party services, data contracts | 5th (tied with Tech Arch) |
| 10 | Content & Copy PRD | All UI strings, error messages, tone, legal copy | 6th (lowest) |

### 5.2 Reference Documents

Reference documents support the Base PRD Suite. They define implementation specifics, not product decisions.

| # | Document | Purpose |
| --- | --- | --- |
| 11 | Changelog & Decision Log | Records every PRD change and product decision |
| 12 | Test Plan PRD | Defines exactly what must be tested and how |
| 13 | Error & State Reference | All states, error codes, transitions — canonical |
| 14 | Environment & Secrets Reference | All env vars, secrets management, `.env.example` |
| 15 | Design System & Component Reference | All visual tokens, components, interaction states |
| 16 | Migrations & Seed Data Reference | All DB migrations, rollbacks, seed data |
| 17 | Roles & Permissions Matrix | All roles, permissions, invitation lifecycle |
| 18 | Security PRD | Threat model, security requirements, authn/authz details, encryption |
| 19 | Analytics PRD | Event taxonomy, dashboards, consent flow, data retention |
| 20 | Monetization PRD | Pricing tiers, payment flows, refunds, limits, trials |
| 21 | Launch Strategy PRD | Phased rollout plan, go/no-go gates, post-launch monitoring |
| 22 | Build Handoff | Navigation layer for engineering — sources, sequence, done criteria |

### 5.3 Agent PRD Suite

| \# | Document | Agent Role | Depends On Base PRDs |
| --- | --- | --- | --- |
| A1 | \[Agent Name\] Agent PRD | \[What this agent does\] | \[#, #, #\] |
| A2 | \[Agent Name\] Agent PRD | \[What this agent does\] | \[#, #, #\] |
| A3 | \[Agent Name\] Agent PRD | \[What this agent does\] | \[#, #, #\] |

> Agent PRDs are defined on a case-by-case basis per product.

---

## 6. Precedence Rules (Critical)

When two documents conflict, resolve using this strict order:

1. **Safety, Privacy & Control PRD** — overrides everything, no exceptions
2. **Core Systems PRD** — overrides Experience, UX, Technical, Data, Content, and all reference docs
3. **Experience & Access PRD** — overrides UX, Technical, Data, Content
4. **UX PRD** — overrides Technical, Data, Content (within UX-defined surfaces)
5. **Requirements Summary** — overrides Technical and Content when in conflict about a requirement's existence or scope
6. **Roles & Permissions Matrix** — overrides Technical Architecture on permission decisions
7. **Data & Integration PRD** — overrides Technical and Content
8. **Technical Architecture PRD** — overrides Content only
9. **Content & Copy PRD** — lowest functional precedence
10. **Reference documents** (Changelog, Test Plan, Error Reference, etc.) — never override any Base PRD
11. **Build Handoff** — never overrides any document; it is a navigation layer only
12. **Master PRD Index** — not a functional document; no override power

Agent PRDs inherit this hierarchy and may never override any Base PRD.

---

## 7. Cross-Document Validation Protocol

Every agent must complete this validation before beginning any task. This prevents lower-tier documents from silently violating higher-tier constraints.

### Required Cross-Reference Checks

| Check | Higher-Tier Document | Lower-Tier Document | What to Verify |
| --- | --- | --- | --- |
| Personas referenced | User Personas | All PRDs | Every PRD that mentions a user cites a persona from the registry |
| Requirements addressed | Requirements Summary | Core Systems PRD, UX PRD, Technical Architecture PRD | Every F-*, NF-*, AI-* requirement is implemented in at least one lower-tier doc |
| UX flows exist | UX PRD | Experience & Access PRD | Every flow in UX PRD is reflected in Experience's screen contracts |
| Data schemas match | Core Systems PRD | Technical Architecture PRD | Column types and names in DB schema match canonical objects |
| Data schemas match | Core Systems PRD | Migrations & Seed Data Reference | Migration columns match canonical objects exactly |
| Permission fields match | Roles & Permissions Matrix | Core Systems PRD | Role enum values in profile object match matrix |
| Error codes consistent | Error & State Reference | All other documents | All error codes used anywhere match registered codes |
| Copy strings match | Content & Copy PRD | Experience & Access PRD, UX PRD | Screen copy references map to Content PRD keys |
| Security rules enforced | Safety, Privacy & Control PRD | Security PRD, Technical Architecture PRD | No logging of prohibited content, HTTPS enforced, encryption per Safety PRD |
| Security threats mitigated | Security PRD | Technical Architecture PRD | Every threat from Security PRD §3 has a corresponding control implemented |
| Analytics events align | Analytics PRD | Core Systems PRD, Experience & Access PRD | Every event in Analytics PRD has a corresponding emit point in a system |
| Monetization limits enforced | Monetization PRD | Core Systems PRD, Experience & Access PRD | Every limit in Monetization PRD has a corresponding enforcement point |
| Launch phases met | Launch Strategy PRD | All other PRDs | Every launch phase exit criterion is achievable from the current suite |
| Build sequence realistic | Build Handoff §5 | Core Systems PRD, Technical Architecture PRD | The build sequence references systems and tasks that actually exist in the suite |

**Instruction to agents:** Before beginning work, state which of these checks apply to your task and confirm each one passes.

---

## 8. Placeholder Detection — Automated Check

Before any agent proceeds, run the following check against all PRD documents. Any document containing unfilled placeholders must be completed before the agent begins work.

**Shell command (run from** `/docs` **directory):**

```bash
grep -rn "\[" --include="*.md" . | grep -v "^\s*//" | grep -v "^.*\`\`\`"
```

**CI/CD enforcement (add to pipeline):**

```bash
#!/bin/bash
# Fail build if any PRD placeholder remains unfilled
PLACEHOLDERS=$(grep -rn "\[" --include="*.md" ./docs | 
  grep -v "^\s*//" | 
  grep -v "\`\`\`" | 
  grep -v "^Binary" | 
  wc -l)

if [ "$PLACEHOLDERS" -gt "0" ]; then
  echo "ERROR: Unfilled PRD placeholders detected:"
  grep -rn "\[" --include="*.md" ./docs | grep -v "\`\`\`"
  exit 1
fi

echo "PRD placeholder check passed."
```

**Also scan for:**

```bash
grep -rn "TODO\|TBD\|FIXME\|PLACEHOLDER" --include="*.md" ./docs
```

If any matches are found, the build must fail and the agent must stop.

---

## 9. Instructions to All Agents (Binding)

### General Rules

- Read ALL base PRDs before beginning any task
- Read your specific Agent PRD before beginning assigned work
- Run the cross-document validation in Section 7 before starting
- Run the placeholder detection check in Section 8 before starting
- Do not invent features, flows, or behavior not specified in a PRD
- Do not merge responsibilities across documents
- Do not reinterpret intent — implement what is written

### When Requirements Are Unclear

- Ambiguous requirement → default to the more conservative, safe, or minimal implementation
- Partially specified feature → implement only what is specified; flag what is missing
- Two requirements conflict → apply precedence rules in Section 6
- Something not mentioned anywhere → do not implement it; flag it

### Quality Standards

- All code must pass linting and formatting rules defined in the Technical Architecture PRD
- All UI must match specifications in the Experience & Access PRD exactly
- All copy must match the Content & Copy PRD exactly — no paraphrasing
- All data structures must match canonical schemas exactly
- All error codes must exist in the Error & State Reference

---

## 10. Agent PRD Structure (Template Reference)

Every Agent PRD must contain:

```markdown
1. Agent Identity         — Name, role, type, trigger
2. Mission Statement      — Purpose in 2–4 sentences
3. Scope                  — Exactly in scope / exactly out of scope
4. Inputs                 — Schema, source, validation rules
5. Outputs                — Schema, destination, quality rules
6. Behavior Rules         — Ordered steps, decision logic, iteration rules
7. Edge Cases             — Every known failure mode and response
8. Dependencies           — Base PRDs, other agents, external services
9. Error Code Registry    — All codes this agent produces
10. Logging Rules         — What to log, what never to log
11. Acceptance Criteria   — Binary pass/fail conditions
12. Test Cases            — Happy path, error cases, edge cases
```

---

## 11. Document Versioning

| Document | Version | Last Updated | Status |
| --- | --- | --- | --- |
| Master PRD Index | 2.0 | \[DATE\] | Locked |
| Project Brief | 2.0 | \[DATE\] | Active |
| User Personas | 2.0 | \[DATE\] | Active |
| Requirements Summary | 2.0 | \[DATE\] | Active |
| Core Systems PRD | 2.0 | \[DATE\] | Active |
| Experience & Access PRD | 2.0 | \[DATE\] | Active |
| UX PRD | 2.0 | \[DATE\] | Active |
| Safety, Privacy & Control PRD | 2.0 | \[DATE\] | Active |
| Technical Architecture PRD | 2.0 | \[DATE\] | Active |
| Data & Integration PRD | 2.0 | \[DATE\] | Active |
| Content & Copy PRD | 2.0 | \[DATE\] | Active |
| Changelog & Decision Log | 2.0 | \[DATE\] | Active |
| Test Plan PRD | 2.0 | \[DATE\] | Active |
| Error & State Reference | 2.0 | \[DATE\] | Active |
| Environment & Secrets Reference | 2.0 | \[DATE\] | Active |
| Design System & Component Reference | 2.0 | \[DATE\] | Active |
| Migrations & Seed Data Reference | 2.0 | \[DATE\] | Active |
| Roles & Permissions Matrix | 2.0 | \[DATE\] | Active |
| Security PRD | 2.0 | \[DATE\] | Active |
| Analytics PRD | 2.0 | \[DATE\] | Active |
| Monetization PRD | 2.0 | \[DATE\] | Active |
| Launch Strategy PRD | 2.0 | \[DATE\] | Active |
| Build Handoff | 2.0 | \[DATE\] | Active |

---

## 12. Glossary

| Term | Definition |
| --- | --- |
| Canonical | The single authoritative definition — no other definition is valid |
| Terminal state | A state from which no transition is possible |
| Idempotent | An operation that produces the same result whether run once or many times |
| Backfill | Populating a new column with data derived from existing records |
| Tenant | An isolated organizational unit in a multi-tenant system |
| PRD | Product Requirements Document |
| Agent | An AI system assigned a specific scoped task within the build |
| Guardrail | A constraint that limits what even high-privilege roles can do |
| \[Term\] | \[Definition\] |

## Version History

| Version | Date | Author | Changes |
|---|---|---|---|
| 2.0 | [Date] | [Name] | Initial v2 release with RLM principles |
| 2.1 | [Date] | [Name] | Added Cross-Document Validation and Version History sections per RLM compliance |

---

**END OF MASTER PRD INDEX**