/**
 * PRD Suite Template Sources v2
 * 
 * This file contains the canonical blank template strings from the PRD Suite Template directory.
 * These templates are used by the document generator to produce filled PRD suites.
 * 
 * IMPORTANT: These templates must be kept in sync with the source template files.
 * Template variables use the format: [Product Name], [Description], etc.
 */

export interface PRDTemplate {
  id: string;
  name: string;
  filename: string;
  category: 'base' | 'reference' | 'agent' | 'auxiliary';
  precedence: number | null; // null = no precedence (auxiliary)
  version: 'v2' | 'v1';
  template: string;
}

// Template variable patterns for replacement
export const TEMPLATE_VARIABLES = {
  PRODUCT_NAME: '[Product Name]',
  DATE: '[DATE]',
  VERSION: '[Version]',
  OWNER: '[NAME]',
  DESCRIPTION: '[Description]',
  ONE_LINE: '[One-Line Description]',
  WHAT_IT_DOES: '[What it does, for whom, and why it matters]',
} as const;

/**
 * Master PRD Index Template (v2)
 * Precedence: Index only — no override power
 */
export const MASTER_INDEX_TEMPLATE = `# [Product Name] – Master PRD Index

**Version:** 2.0  
**Status:** Authoritative · Locked  
**Last Updated:** [DATE]  
**Product Owner:** [NAME]

---

## 1. What This Document Is

This is the single authoritative entry point for all Product Requirements Documents (PRDs) for **[Product Name]**. Every agent, engineer, or system consuming these requirements must read this index first and fully before proceeding.

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
|---|---|
| **Product Name** | [Product Name] |
| **One-Line Description** | [What it does, for whom, and why it matters] |
| **Product Type** | [Web App / Mobile App / API / CLI / etc.] |
| **Platform** | [Web2 / iOS / Android / Cross-platform / etc.] |
| **Current Phase** | [MVP / Beta / Production] |
| **Primary Language** | [TypeScript / Python / etc.] |
| **Tenancy Model** | [Single-tenant / Multi-tenant] |

### What This Product Is
[2–3 sentences. Plain language. What does a user do here and what do they get from it?]

### What This Product Is Not
- [Explicit non-goal 1]
- [Explicit non-goal 2]
- [Explicit non-goal 3]

---

## 3. Target Audience (Canonical)

### Primary User
- **Who:** [Specific description]
- **Context:** [Where/when/why they use this]
- **Pain Point Solved:** [The core problem]
- **Technical Literacy:** [None / Basic / Intermediate / Advanced]
- **Emotional Context:** [Vulnerable / Neutral / Professional / etc.]

### Secondary User *(if applicable)*
- **Who:** [Description]
- **Role:** [Admin / Viewer / Collaborator / etc.]

### What All PRDs Must Assume About Users
- [Assumption 1]
- [Assumption 2]
- [Assumption 3]

---

## 4. Core Product Principles (Binding)

These principles govern every design, build, and AI decision. Any implementation that violates these principles is considered incorrect.

| # | Principle | Meaning in Practice |
|---|---|---|
| 1 | [Principle] | [What it means] |
| 2 | [Principle] | [What it means] |
| 3 | [Principle] | [What it means] |
| 4 | [Principle] | [What it means] |
| 5 | [Principle] | [What it means] |

---

## 5. PRD Document Registry

### 5.1 Base PRD Suite

| # | Document | Governs | Precedence |
|---|---|---|---|
| 00 | Master PRD Index *(this document)* | Structure, ownership, conflict resolution | Index only — no override power |
| 01 | Core Systems PRD | All core product logic, data models, system behavior | 2nd highest |
| 02 | Experience & Access PRD | Auth, onboarding, navigation, UX flows, layout | 3rd |
| 03 | Safety, Privacy & Control PRD | Safety, privacy, legal, crisis handling | **Highest — overrides all** |
| 04 | Technical Architecture PRD | Stack, APIs, database, infrastructure, security | 4th |
| 05 | Data & Integration PRD | External APIs, third-party services, data contracts | 5th |
| 06 | Content & Copy PRD | All UI strings, error messages, tone, legal copy | 6th (lowest) |

### 5.2 Reference Documents

| # | Document | Purpose |
|---|---|---|
| 07 | Changelog & Decision Log | Records every PRD change and product decision |
| 08 | Test Plan PRD | Defines exactly what must be tested and how |
| 09 | Error & State Reference | All states, error codes, transitions — canonical |
| 10 | Environment & Secrets Reference | All env vars, secrets management, \`.env.example\` |
| 11 | Design System & Component Reference | All visual tokens, components, interaction states |
| 12 | Migrations & Seed Data Reference | All DB migrations, rollbacks, seed data |
| 13 | Roles & Permissions Matrix | All roles, permissions, invitation lifecycle |

### 5.3 Agent PRD Suite

| # | Document | Agent Role | Depends On Base PRDs |
|---|---|---|---|
| A1 | [Agent Name] Agent PRD | [What this agent does] | [#, #, #] |
| A2 | [Agent Name] Agent PRD | [What this agent does] | [#, #, #] |
| A3 | [Agent Name] Agent PRD | [What this agent does] | [#, #, #] |

> Agent PRDs are defined on a case-by-case basis per product.

---

## 6. Precedence Rules (Critical)

When two documents conflict, resolve using this strict order:

1. **Safety, Privacy & Control PRD** — overrides everything, no exceptions
2. **Core Systems PRD** — overrides Experience, Technical, Data, Content
3. **Experience & Access PRD** — overrides Technical, Data, Content
4. **Roles & Permissions Matrix** — overrides Technical Architecture on permission decisions
5. **Data & Integration PRD** — overrides Technical and Content
6. **Technical Architecture PRD** — overrides Content only
7. **Content & Copy PRD** — lowest precedence
8. **Master PRD Index** — not a functional document; no override power

Agent PRDs inherit this hierarchy and may never override any Base PRD.

---

## 7. Cross-Document Validation Protocol

Every agent must complete this validation before beginning any task. This prevents lower-tier documents from silently violating higher-tier constraints.

### Required Cross-Reference Checks

| Check | Higher-Tier Document | Lower-Tier Document | What to Verify |
|---|---|---|---|
| Data schemas match | Core Systems PRD | Technical Architecture PRD | Column types and names in DB schema match canonical objects |
| Data schemas match | Core Systems PRD | Migrations & Seed Data Reference | Migration columns match canonical objects exactly |
| Permission fields match | Roles & Permissions Matrix | Core Systems PRD | Role enum values in profile object match matrix |
| Error codes consistent | Error & State Reference | All other documents | All error codes used anywhere match registered codes |
| Copy strings match | Content & Copy PRD | Experience & Access PRD | Screen copy references map to Content PRD keys |
| Security rules enforced | Safety PRD | Technical Architecture PRD | No logging of prohibited content, HTTPS enforced |
| Env vars documented | Environment & Secrets Reference | Data & Integration PRD | Every service credential has a corresponding env var |

---

## 8. Agent Behavior Protocol (For AI Agents Consuming These PRDs)

### Before Starting Any Task

1. Read this Master Index first
2. Read the Error & State Reference (know what error codes exist)
3. Read the Roles & Permissions Matrix (know what roles exist)
4. Read the document(s) relevant to your task in precedence order
5. If two documents conflict, apply §6 precedence rules

### When Requirements Are Unclear

- **If a requirement could be interpreted multiple ways:** Choose the most conservative interpretation, implement it, and flag the ambiguity in your output.
- **If a requirement is missing entirely:** Do not invent behavior. Stop, flag the gap, and wait for direction.
- **If you discover a conflict between documents:** Apply precedence rules (§6), implement per the higher-precedence document, and report the conflict.

### When You Cannot Proceed

Output a structured blocker report:

\`\`\`
BLOCKER REPORT
Agent: [Your Agent Name]
Task: [What you were trying to do]
Blocking Issue: [What stopped you]
Documents Consulted: [List]
Resolution Needed: [What the product owner must clarify]
\`\`\`

---

## 9. Version Control

| Version | Date | Change | Author |
|---|---|---|---|
| 2.0 | [DATE] | Initial v2 release | [NAME] |
`;

/**
 * Safety, Privacy & Control PRD Template (v2)
 * Precedence: HIGHEST — overrides all other documents
 */
export const SAFETY_PRIVACY_TEMPLATE = `# [Product Name] – Safety, Privacy & Control PRD

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
[Description of how the product handles crisis scenarios, or "N/A — no crisis scenarios possible"]

### 4.2 Detection Rules

| Trigger Type | Examples | Detection Layer |
|---|---|---|
| [Trigger type] | [Examples] | [Server-side / Client-side / Both] |

### 4.3 Required Response Behavior

| Condition | System MUST | System MUST NEVER |
|---|---|---|
| [Condition] | [Required action] | [Prohibited action] |

### 4.4 Acceptance Criteria for This Domain

- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## 5. Domain 2: AI Role Boundaries

### 5.1 What the AI May Do

| Permitted Behavior | Notes |
|---|---|
| [Permitted behavior] | [Constraint] |

### 5.2 What the AI Must Never Do

| Prohibited Behavior | Error if Detected |
|---|---|
| [Prohibited behavior] | [Consequence] |

### 5.3 Required AI Language Rules

| Rule | Example of Compliant Language | Example of Non-Compliant Language |
|---|---|---|
| [Rule] | [Good example] | [Bad example] |

### 5.4 Acceptance Criteria for This Domain

- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## 6. Domain 3: User Controls & Autonomy

### 6.1 Always-Available Controls

| Control | Where Accessible | What It Does |
|---|---|---|
| [Control name] | [Location] | [Action] |

### 6.2 User Consent Requirements

| Action | Consent Required | Consent Type |
|---|---|---|
| [Action] | [Yes / No] | [Explicit / Implicit / Not required] |

### 6.3 Acceptance Criteria for This Domain

- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## 7. Domain 4: Data Privacy & Retention

### 7.1 Data Classification

| Data Type | Classification | Retention Period | Deletion Method |
|---|---|---|---|
| [Data type] | [Public / Internal / Confidential / Restricted] | [Duration] | [Method] |

### 7.2 Data Access Rules

| Data Type | Who Can Access | Under What Conditions |
|---|---|---|
| [Data type] | [Roles] | [Conditions] |

### 7.3 Acceptance Criteria for This Domain

- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## 8. Domain 5: Logging & Observability Constraints

### 8.1 Logging Rules

| Data Type | May Log? | Format | Retention |
|---|---|---|---|
| [Data type] | [Yes / No / Metadata only] | [Format] | [Duration] |

### 8.2 Prohibited in Logs

- [Prohibited item 1]
- [Prohibited item 2]

### 8.3 Acceptance Criteria for This Domain

- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## 9. Domain 6: Account Deletion & Data Export

### 9.1 Deletion Requirements

| Setting | Value |
|---|---|
| Deletion SLA | [N] days |
| What is deleted | [List] |
| What is retained | [List with justification] |

### 9.2 Data Export Requirements

| Setting | Value |
|---|---|
| Export format | [JSON / CSV / etc.] |
| Export contents | [What's included] |
| Export SLA | [N] days |

### 9.3 Acceptance Criteria for This Domain

- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## 10. Domain 7: Legal & Regulatory Compliance

### 10.1 Applicable Regulations

| Regulation | Applies? | Requirements |
|---|---|---|
| GDPR | [Yes / No] | [Requirements if yes] |
| CCPA | [Yes / No] | [Requirements if yes] |
| HIPAA | [Yes / No] | [Requirements if yes] |
| COPPA | [Yes / No] | [Requirements if yes] |

### 10.2 Required Legal Documents

- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy *(if applicable)*
- [ ] [Other required document]

### 10.3 Acceptance Criteria for This Domain

- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## 11. Safety PRD Compliance Checklist (For All Agents)

Before completing any task, verify:

- [ ] No prohibited content in logs
- [ ] No hardcoded secrets
- [ ] All user controls accessible
- [ ] All consent requirements met
- [ ] Deletion/export paths implemented
- [ ] Regulatory requirements satisfied
- [ ] AI boundaries enforced *(if applicable)*
- [ ] Crisis handling implemented *(if applicable)*
`;

/**
 * Core Systems PRD Template (v2)
 * Precedence: 2nd highest
 */
export const CORE_SYSTEMS_TEMPLATE = `# [Product Name] – Core Systems PRD

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
| [State name] | \`[STATE_VALUE]\` | [What it means] |
| [State name] | \`[STATE_VALUE]\` | [What it means] |
| [State name] | \`[STATE_VALUE]\` | [Terminal — no exit] |

**Transition Table:**

| From State | Trigger | To State | Blocked? |
|---|---|---|---|
| \`[STATE_A]\` | [Condition] | \`[STATE_B]\` | No |
| \`[STATE_A]\` | [Condition] | \`[STATE_C]\` | No |
| \`[STATE_B]\` | [Condition] | \`[STATE_A]\` | No |
| \`[STATE_C]\` | Any | Any | **Yes — terminal** |

**Illegal Transition Behavior:** Any attempted illegal transition must be rejected with \`STATE_INVALID_TRANSITION\` (see Error & State Reference).

### 3.5 Data Contracts

**[Object Name] Object (Canonical)**
\`\`\`json
{
  "id": "uuid — generated server-side, never client-supplied",
  "field1": "string — [constraints: min X, max Y chars]",
  "field2": "enum — [allowed values: VALUE_A | VALUE_B | VALUE_C]",
  "tenantId": "uuid — required if multi-tenant; references tenants.id",
  "createdAt": "ISO-8601 UTC timestamp — set on insert, immutable",
  "updatedAt": "ISO-8601 UTC timestamp — updated on every write"
}
\`\`\`

**Field Rules:**
- \`id\`: UUID v4, generated server-side, never accepted from client
- \`field1\`: [Specific constraints]
- \`field2\`: Allowed values are [list] — any other value is rejected with \`INPUT_INVALID_TYPE\`

### 3.6 Business Logic Rules
- [Rule 1 — e.g., "A user may not have more than one active [resource] at a time"]
- [Rule 2 — e.g., "Completed states are immutable — no field may be updated after COMPLETED"]
- [Rule 3 — e.g., "All timestamps are UTC — no timezone conversion at storage layer"]

### 3.7 Error Conditions

| Condition | Error Code | Expected Behavior |
|---|---|---|
| [Error condition] | \`[CODE]\` | [What the system must do] |
| [Error condition] | \`[CODE]\` | [What the system must do] |

---

## 4. System 2: [System Name]

*(Repeat structure from Section 3 for each additional system)*

---

## 5. Cross-System Dependencies

| System A | Depends On | System B | Dependency Type |
|---|---|---|---|
| [System] | [reads from / writes to / triggers] | [System] | [Sync / Async / Event-driven] |

---

## 6. Acceptance Criteria (For All Systems)

- [ ] All state machines implemented with exact states and transitions
- [ ] All data objects match canonical schemas exactly
- [ ] All business logic rules enforced
- [ ] All error codes match Error & State Reference
- [ ] All cross-system dependencies functional
- [ ] No invented behavior not specified in this document
`;

/**
 * Agent PRD Template (v2)
 */
export const AGENT_PRD_TEMPLATE = `# [Product Name] – [Agent Name] Agent PRD

**Version:** 2.0  
**Status:** Authoritative · Build-Ready  
**Governed by:** [Product Name] – Master PRD Index  
**Agent Role:** [One-line description of what this agent does]  
**Precedence:** Agent PRDs never override Base PRDs. All Base PRD rules apply.

---

\`\`\`
═══════════════════════════════════════════════════════════
ROLE
═══════════════════════════════════════════════════════════
You are [Agent Name], a [type] agent for [Product Name].
You are a specialist. Your domain is [domain].
You have complete authority over decisions within your
defined scope. Outside your scope, you have no authority
and must not act.

Your output is a direct input to [downstream agent or
production system]. Errors in your output propagate
forward and compound. Precision is not optional.

You do not improvise. You do not expand your scope.
You do not make assumptions when requirements are unclear.
You stop, flag the gap, and wait for direction.

═══════════════════════════════════════════════════════════
LIMITS
═══════════════════════════════════════════════════════════
Your scope boundary is absolute.

IN SCOPE — you are responsible for:
  - [Responsibility 1]
  - [Responsibility 2]
  - [Responsibility N]

OUT OF SCOPE — you must not touch:
  - [Boundary 1]
  - [Boundary 2]
  - [Boundary N]

You must not:
  - Implement anything not specified in the PRD Suite
  - Use any technology not in the Technical Architecture PRD
  - Use any copy not in the Content & Copy PRD
  - Use any error code not in the Error & State Reference
  - Use any permission logic not in the Roles & Permissions Matrix
  - Modify files outside your defined scope
  - Resolve PRD conflicts yourself
  - Proceed with a missing dependency

If a task seems adjacent but is not in your IN SCOPE list:
  → It is out of scope. Do not do it.
  → Report: "Task [X] is outside my defined scope.
    Flagging for product owner direction."

If a requirement is ambiguous:
  → Default to the most conservative, minimal implementation
  → Flag: "Requirement [X] is ambiguous. Implemented
    as [Y] — the most conservative interpretation.
    Confirm or correct before I proceed."

If a requirement is missing from all PRDs:
  → Do not implement it
  → Report: "Requirement missing — [description].
    No PRD specifies this behavior. Awaiting direction."

If your output depends on something a prior agent should
have produced but did not:
  → Stop immediately
  → Report: "Dependency missing — [what's missing].
    [Agent Name]'s output is required before I can
    proceed. I have not begun this step."

If two PRDs conflict:
  → Apply Master PRD Index §6 precedence order
  → Report the conflict before proceeding
  → Do not resolve it silently by choosing one

If the Safety, Privacy & Control PRD conflicts with
any other document:
  → The Safety PRD wins. Always. No exceptions.

═══════════════════════════════════════════════════════════
MISSION
═══════════════════════════════════════════════════════════
Your singular objective: [One specific, measurable goal
stated in one sentence.]

You succeed when:
  - [Acceptance criterion 1 — binary pass/fail]
  - [Acceptance criterion 2 — binary pass/fail]
  - [Acceptance criterion 3 — binary pass/fail]
  - All tests specified for your domain in the Test Plan PRD pass
  - Your output contains no invented behavior
  - Your output contains no hardcoded secrets
  - Your output contains no unfilled placeholders

You fail if:
  - Any acceptance criterion in Section 11 is unmet
  - Any output falls outside your defined scope
  - Any PRD requirement in your domain is unimplemented
  - Any output contains invented behavior not in the PRDs
  - Any output contains hardcoded secrets or placeholders
  - You marked a step complete without verifying it

Begin with: Read all documents listed in the confirmation
protocol below. Do not begin Step 1 of your execution
sequence until the confirmation protocol is complete
and accepted.
═══════════════════════════════════════════════════════════
\`\`\`

---

## Confirmation Protocol

After reading all required documents, respond with:

**1. IDENTITY**
"I am [Agent Name]. My role is [role]. My scope is [in-scope list]. I will not touch [out-of-scope list]."

**2. TOP THREE CONSTRAINTS**
"My three highest-priority constraints are:
1. [Safety/security constraint — always first]
2. [Scope constraint]
3. [Quality/correctness constraint]"

**3. CROSS-DOCUMENT CHECKS**
For each check in Master PRD Index §7 that applies to your task: state PASS / FAIL / N/A with a one-line reason.

**4. DEPENDENCY VERIFICATION**
"Required inputs from prior agents:
- [Agent Name]: [output] — [PRESENT / MISSING]
- [Agent Name]: [output] — [PRESENT / MISSING]"

**5. CONFLICT REPORT**
"Conflicts detected: [list any conflicts found, or NONE]"

**6. READINESS**
"I am ready to begin Step 1: [step name]"
OR
"I cannot proceed. Blocking issue: [description]"

Do not begin any task until confirmation is accepted by the product owner or orchestrating agent.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | [Name — e.g., "DatabaseAgent", "FrontendAgent", "AuditAgent"] |
| **Role** | [One-line role description] |
| **Type** | [Code / Content / Orchestrator / Reviewer / Data / UI / Test] |
| **Operates On** | [Codebase / API / Database / UI / Files / External Services] |
| **Triggered By** | [Manual / CI event / Another agent / User action / Schedule] |
| **Blocking?** | [Yes — nothing proceeds until this agent completes / No] |
| **Depends On** | [Agent names that must complete first, or "None"] |
| **Feeds Into** | [Agent names that consume this agent's output, or "Production"] |

---

## 2. Mission Statement

[2–4 sentences. What does this agent exist to accomplish? What problem does it solve? What does the product look like before vs. after this agent runs? Be specific — no generic descriptions.]

---

## 3. Scope

### 3.1 In Scope

- [Specific responsibility 1 — granular enough that there is no ambiguity]
- [Specific responsibility 2]
- [Specific responsibility N]

### 3.2 Out of Scope

- [What this agent must NOT do — specific]
- [e.g., "Must not write to the database directly — all writes through the API layer"]
- [e.g., "Must not modify files outside /src/[path]"]
- [e.g., "Must not define business logic — only implement what Core Systems PRD specifies"]

> If a task is not listed in 3.1, it is out of scope. Do not expand scope unilaterally.

---

## 4. Inputs

### 4.1 Input Summary

| Input | Source | Format | Required | Provided By |
|---|---|---|---|---|
| [Input name] | [Source — CLI / file / API / prior agent] | [JSON / string / file path / etc.] | Yes / No | [Agent or "Product Owner"] |

### 4.2 Input Validation Rules

| Input | Validation Rule | On Failure |
|---|---|---|
| [Input name] | [Rule — e.g., "Must be valid UUID v4"] | Abort with \`INPUT_MISSING\` |

---

## 5. Outputs

### 5.1 Output Summary

| Output | Destination | Format | Always Produced | Consumed By |
|---|---|---|---|---|
| [Output name] | [Destination] | [Format] | Yes / No | [Next agent or "Production"] |

---

## 6. Execution Sequence

### Step 1: [Step Name]

**What:** [Description of what happens in this step]
**Inputs:** [What this step needs]
**Process:** [How to do it]
**Outputs:** [What this step produces]
**Done when:** [Completion criteria]

### Step 2: [Step Name]

*(Repeat for each step)*

---

## 7. Collaboration Points

| With Agent | Trigger | What Is Exchanged | Format |
|---|---|---|---|
| [Agent Name] | [When this happens] | [Data/artifact passed] | [Schema/format] |

---

## 8. Error Handling

| Error Type | Detection | Response | Escalation |
|---|---|---|---|
| [Error type] | [How detected] | [What to do] | [Who to notify] |

---

## 9. DO's and DON'Ts

### DO's
- [Do 1]
- [Do 2]
- [Do N]

### DON'Ts
- [Don't 1]
- [Don't 2]
- [Don't N]

---

## 10. Quality Checklist

Before marking this agent's work complete:

- [ ] All acceptance criteria met
- [ ] All outputs produced
- [ ] All error codes from Error & State Reference
- [ ] No hardcoded secrets
- [ ] No unfilled placeholders
- [ ] All tests passing
- [ ] Handoff to next agent ready
`;

// Export all templates
export const PRD_TEMPLATES: PRDTemplate[] = [
  {
    id: 'master-index',
    name: 'Master PRD Index',
    filename: '00-master-prd-index.md',
    category: 'base',
    precedence: 0,
    version: 'v2',
    template: MASTER_INDEX_TEMPLATE,
  },
  {
    id: 'safety-privacy',
    name: 'Safety, Privacy & Control PRD',
    filename: '03-safety-privacy-control-prd.md',
    category: 'base',
    precedence: 1,
    version: 'v2',
    template: SAFETY_PRIVACY_TEMPLATE,
  },
  {
    id: 'core-systems',
    name: 'Core Systems PRD',
    filename: '01-core-systems-prd.md',
    category: 'base',
    precedence: 2,
    version: 'v2',
    template: CORE_SYSTEMS_TEMPLATE,
  },
  {
    id: 'agent-prd',
    name: 'Agent PRD Template',
    filename: 'agent-prd-template.md',
    category: 'agent',
    precedence: null,
    version: 'v2',
    template: AGENT_PRD_TEMPLATE,
  },
];

export function getTemplateById(id: string): PRDTemplate | undefined {
  return PRD_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: PRDTemplate['category']): PRDTemplate[] {
  return PRD_TEMPLATES.filter(t => t.category === category);
}
