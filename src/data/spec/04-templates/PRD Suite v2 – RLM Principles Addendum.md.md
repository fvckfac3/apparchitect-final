# PRD Suite – RLM Principles Addendum

**Version:** 1.0  
**Status:** Authoritative · Governs AppArchitect Process & Agent Instruction Design  
**Governed by:** [Product Name] – Master PRD Index  
**Source:** Zhang, Kraska & Khattab (2025) — *Recursive Language Models*, MIT CSAIL

---

## 1. Purpose of This Document

This document translates the core findings of the Recursive Language Models (RLM) paper into binding operational principles for two distinct but related purposes:

1. **How AppArchitect plans, navigates, and executes its own tasks** when producing a PRD suite
2. **How AppArchitect designs agent instructions** within the PRD suite it produces for user projects

Both purposes are governed by the same underlying insight: a large body of structured information should never be treated as a monolithic context to be read linearly and trusted to persist. It should be treated as an **external environment to be navigated symbolically** — probed, filtered, recursively sub-queried, and verified through state-preserving iteration.

---

## 2. The Core RLM Insight (Plain Language)

A standard language model fed a long prompt degrades — not just because of length, but because of **task complexity relative to length**. Simple tasks (find one needle) degrade slowly. Complex tasks (aggregate all pairs) degrade catastrophically. This is called **context rot**.

The RLM solution is not to extend the context window. It is to **never put the full context in the window at all**. Instead:

- The input becomes a variable in an external environment
- The model *writes code* to probe, filter, and decompose that variable
- The model *recursively calls itself* on sub-problems it carves out
- Intermediate results are *stored in variables*, not held in attention
- The model *builds its answer incrementally* from verified sub-results

The result: tasks that require O(N²) information processing become tractable because the model never tries to hold O(N²) in context simultaneously.

**The principle that matters for AppArchitect:**  
Every complex task — including building a PRD suite — has an implicit information density function. Allocate depth proportionally to density. Never process everything uniformly.

---

## 3. RLM Principles for AppArchitect's Own Process

### Principle 1: Treat the PRD Suite as an External Environment, Not a Linear Read

**What this means:**  
AppArchitect must never attempt to hold the entire PRD suite in context simultaneously. The suite is an environment to navigate. AppArchitect probes it, loads relevant sections, derives conclusions, stores them as anchors, and recurses into sub-problems.

**How it changes AppArchitect's behavior:**

| Old Behavior | RLM-Informed Behavior |
|---|---|
| Read all documents top to bottom | Probe document inventory first; identify which sections are relevant to current task |
| Process each PRD domain with equal depth | Classify each domain by information density; allocate sub-call depth proportionally |
| Trust that early context persists | Re-surface critical constraints at every phase boundary |
| Single linear pass through interview | Iterative pass: confirm anchors → probe gaps → recurse into conflicts |

**Implementation:** AppArchitect maintains a **State Variable Model** (see Section 5) that stores confirmed decisions as immutable anchors. Each new domain query references the anchor set before generating new questions.

---

### Principle 2: Classify Information Density Before Allocating Depth

**What this means:**  
Not all PRD sections require the same processing depth. Some decisions are constant-complexity (one answer regardless of project size). Others are linear (one decision per system). Others are quadratic (every permission interacts with every role).

**Information Density Classification for PRD Domains:**

| PRD Domain | Density Class | Why | Required Sub-Call Depth |
|---|---|---|---|
| Product Identity | O(1) — constant | One set of answers regardless of complexity | Single pass |
| Core Principles | O(1) — constant | Fixed number of principles | Single pass |
| Auth System | O(1) — constant | One auth model per product | Single pass |
| Core Systems | O(N) — linear | One schema per system; systems interact | One sub-pass per system + cross-system check |
| State Machines | O(N×S) — linear-quadratic | Each state interacts with each trigger | Explicit transition table required per system |
| Roles & Permissions | O(R×A) — quadratic | Each role interacts with each action | Matrix verification pass required |
| Cross-Document Integrity | O(D²) — quadratic | Each document can conflict with each other | Pairwise conflict check required |
| Safety Domain | O(1) — constant but critical | Few rules, highest stakes | Single pass with mandatory verification sub-call |
| Test Coverage | O(N) — linear | One test per requirement | Systematic requirement enumeration required |

**Rule:** Before beginning any domain, AppArchitect must classify its density. High-density domains (quadratic) require decomposition into sub-tasks. Low-density domains (constant) can be processed in a single pass.

---

### Principle 3: Probe Before Processing

**What this means:**  
Before deep-processing any domain, AppArchitect probes it to understand its shape. What is the scope? What are the edge cases? Where are the likely conflicts? Probing is cheap. Deep processing is expensive. Probe first.

**AppArchitect's Probe Protocol:**

For every interview domain before asking full questions:

1. **Scope probe:** "Is this domain applicable to this product?" (Yes/No/Partial)
2. **Complexity probe:** "How many distinct items does this domain contain?" (count of systems, roles, screens, etc.)
3. **Conflict probe:** "Does anything stated so far conflict with this domain?" (check anchor set)
4. **Density classification:** Assign O(1) / O(N) / O(N²) based on item count

Only after this probe does AppArchitect allocate processing depth for the domain.

---

### Principle 4: Store Confirmed Decisions as Immutable Anchors

**What this means:**  
RLMs store intermediate results in variables to avoid re-deriving them. AppArchitect stores confirmed interview answers as anchors. Anchors are immutable once confirmed. All subsequent questions are constrained by the anchor set.

**Anchor Categories:**

| Anchor Type | Examples | Immutable After |
|---|---|---|
| Product Identity Anchors | Product name, type, platform, tenancy model | Domain 1 confirmation |
| Audience Anchors | User vulnerability level, technical literacy | Domain 2 confirmation |
| Principle Anchors | Core product principles | Domain 3 confirmation |
| Safety Anchors | Risk profile, crisis detection requirements | Domain 6 confirmation |
| Stack Anchors | Framework, database, auth method | Domain 7 confirmation |
| Schema Anchors | All canonical data object fields and types | Domain 4 confirmation |

**Rule:** When a later domain produces a conflict with an anchor, AppArchitect must surface the conflict explicitly and ask the user to resolve it — not silently override the anchor.

---

### Principle 5: Recurse into Conflicts; Don't Paper Over Them

**What this means:**  
RLMs use recursive sub-calls to verify uncertain conclusions before committing. AppArchitect uses recursive sub-passes to resolve conflicts before writing documents.

**Conflict Resolution Sub-Pass Protocol:**

When AppArchitect detects a conflict between a new answer and an existing anchor:

```
CONFLICT DETECTED:
  Domain [X] answer: [statement]
  Conflicts with: [anchor from Domain Y]
  Nature of conflict: [description]

Options:
  A. Update Domain Y anchor to align with new answer
     Downstream impact: [list affected documents]
  B. Update Domain X answer to align with existing anchor
  C. Both are valid — need product owner decision

Which do you choose?
```

AppArchitect does not proceed until the conflict is resolved and the anchor set is updated.

---

### Principle 6: Verify at Phase Boundaries, Not Just at the End

**What this means:**  
The paper shows that answer verification through sub-calls is a key RLM behavior. AppArchitect performs explicit verification at three phase boundaries — not just at the final self-audit.

**Phase Boundary Verification:**

| Phase Boundary | Verification Sub-Pass |
|---|---|
| After interview complete, before writing | Pre-write validation: consistency, completeness, conflict checks (Fill-In Agent Prompt Phase 2) |
| After each document written | Anchor compliance check: does this document violate any anchor? |
| After all documents written | Cross-document integrity check: full pairwise conflict scan |

Each verification sub-pass is a distinct process — not a re-read of documents already processed.

---

### Principle 7: Context Rot Is Assumed; Architecture Around It

**What this means:**  
AppArchitect assumes context rot will occur during long sessions. It does not trust that constraints stated early in a conversation will persist accurately into later stages. It actively re-surfaces critical constraints.

**Anti-Context-Rot Mechanisms:**

1. **Anchor surfacing:** At the start of each phase, AppArchitect displays the current anchor set and asks for confirmation before proceeding
2. **Critical constraint re-injection:** Safety anchors and schema anchors are re-stated at the top of every document written, not just stored in memory
3. **Phase summary:** At the end of each interview domain, AppArchitect produces a summary of what was confirmed in that domain and surfaces any conflicts with prior anchors

---

## 4. RLM Principles for Agent Instruction Design

These principles govern how AppArchitect writes agent instructions within the PRD suite it produces. Every agent PRD AppArchitect generates must embed these principles.

### Principle A: Every Agent Gets an Information Density Rating

Every Agent PRD must include an explicit information density classification for the agent's domain.

**Required field in every Agent PRD Section 1:**

```
Information Density: [O(1) / O(N) / O(N²)]
Density Explanation: [Why — what are the N items and how do they interact]
Decomposition Required: [Yes / No]
Decomposition Strategy: [How to chunk if Yes]
```

---

### Principle B: Agents Must Probe Before Processing

Every agent execution sequence must begin with a probe step before any deep processing.

**Required Step 0 in every Agent PRD Section 6.1:**

```
Step 0: Probe
- Load input and assess scope
- Count the N items in your domain (files, endpoints, 
  tables, components, etc.)
- Classify information density: O(1) / O(N) / O(N²)
- If O(N²): decompose into sub-problems before proceeding
- If N > [threshold]: split into batches; process one batch
  at a time; store results in state variables between batches
- Report: "Probed [N] items. Density: [class]. 
  Decomposition strategy: [strategy]."
```

---

### Principle C: Agents Must Maintain State Variables

Every agent must maintain explicit state variables rather than re-deriving from scratch at each step.

**Required in every Agent PRD Section 6.1:**

Each step must specify:
- What state variable(s) it reads
- What state variable(s) it writes
- What the state variable represents

**Standard state variable schema:**
```typescript
type AgentState = {
  anchorSet:      Record<string, any>;  // Confirmed facts — immutable
  workingSet:     Record<string, any>;  // Current step's working data
  errorLog:       AgentError[];         // Accumulated errors
  warningLog:     AgentWarning[];       // Accumulated warnings
  completedSteps: string[];             // Steps verified complete
  pendingItems:   string[];             // Items not yet processed
}
```

---

### Principle D: High-Density Steps Require Explicit Decomposition

Any agent step classified O(N²) or higher must be explicitly decomposed in the Agent PRD into sub-tasks. The agent must never attempt to process a high-density step in a single pass.

**Required decomposition template for high-density steps:**

```
Step [N]: [High-Density Step Name]
Density: O(N²)
Decomposition:
  Sub-step [N].1: Process first axis (enumerate all [items])
  Sub-step [N].2: For each item, process second axis
  Sub-step [N].3: Store results in state variable [name]
  Sub-step [N].4: Verification sub-call — check N random samples
  Sub-step [N].5: Report: "[N×M] combinations checked. 
                   [X] conflicts found."
```

---

### Principle E: Verification Sub-Calls Are Mandatory for Critical Domains

Every agent whose domain includes safety, security, or canonical schema definitions must include explicit verification sub-calls — separate processes that re-check critical outputs before the agent marks its work complete.

**Required verification sub-call template:**

```
Step Final-1: Verification Sub-Call
  Load: State variable [output from Step N]
  Check: Does output conform to [PRD reference]?
  Method: [Specific check — e.g., "compare each field 
           to Core Systems PRD canonical schema"]
  On mismatch: Log to errorLog; do not mark complete
  On pass: Add "verification_passed" to completedSteps
```

---

### Principle F: Re-Surface Critical Constraints at Every Step Boundary

Agents must re-state their highest-priority constraints at every major step boundary — not just at the start of the session. This directly counteracts context rot.

**Required in every Agent PRD Section 6.1, at each step:**

```
Step [N]: [Step Name]
Critical constraint re-check before proceeding:
  [ ] Safety PRD §[X] still satisfied?
  [ ] Anchor [name] not violated by this step's output?
  [ ] Error log empty? (or documented and accepted)
```

---

### Principle G: Cost-Aware Decomposition

The paper shows RLMs have high-variance costs due to unbounded sub-call depth. Agent instructions must specify explicit decomposition depth limits to prevent runaway processing.

**Required field in every high-density Agent PRD step:**

```
Max Sub-Iterations: [N]
Batch Size: [M items per sub-call]
On Limit Exceeded: [Report partial; flag; await direction]
Estimated Cost Class: [Low / Medium / High / Variable]
```

---

## 5. AppArchitect State Variable Model

This section defines the canonical state variables AppArchitect maintains across its entire interview and document production process.

### 5.1 Anchor Set (Immutable Once Confirmed)

```typescript
type AnchorSet = {
  // Product Identity Anchors
  productName:        string;
  productType:        string;
  tenancyModel:       'single' | 'multi-logical' | 'multi-physical';
  
  // Audience Anchors
  userVulnerability:  'low' | 'medium' | 'high' | 'critical';
  crisisScenarioPossible: boolean;
  
  // Safety Anchors
  riskProfile:        RiskProfile;
  safetyDomains:      SafetyDomain[];
  
  // Stack Anchors
  frontendFramework:  string;
  database:           string;
  authMethod:         string;
  
  // Schema Anchors
  canonicalSchemas:   Record<string, DataObjectSchema>;
  
  // Principle Anchors
  coreProprinciples:  ProductPrinciple[];
}
```

### 5.2 Working Set (Mutable Per Domain)

```typescript
type WorkingSet = {
  currentDomain:      number;
  confirmedDomains:   number[];
  pendingConflicts:   Conflict[];
  deferredDecisions:  DeferredDecision[];
  documentsComplete:  string[];
  currentDocument:    string | null;
}
```

### 5.3 Conflict Log

```typescript
type Conflict = {
  id:           string;
  domain:       number;
  description:  string;
  anchorRef:    string;       // Which anchor is conflicted
  options:      string[];     // Resolution options presented to user
  resolution:   string | null; // Null until resolved
  resolvedAt:   string | null; // ISO-8601 timestamp
}
```

---

## 6. AppArchitect Process Map (RLM-Informed)

This is the complete process AppArchitect follows, redesigned around RLM principles.

```
PHASE 0: ENVIRONMENT INITIALIZATION
  ├── Load PRD Suite template inventory
  ├── Initialize AnchorSet (all null)
  ├── Initialize WorkingSet
  └── Probe: classify density of each PRD domain

PHASE 1: INTERVIEW (RLM-Informed)
  For each domain in interview order:
    ├── 0. Probe domain scope and complexity
    ├── 1. Check anchor set for pre-existing constraints
    ├── 2. Ask questions proportional to density
    ├── 3. Confirm answers → store as anchors
    ├── 4. Check for conflicts with prior anchors
    │   ├── Conflict found → recurse into conflict resolution
    │   └── No conflict → continue
    └── 5. Phase boundary verification:
           Re-surface all anchors; confirm before proceeding

PHASE 2: PRE-WRITE VALIDATION
  ├── Schema consistency check (O(N×D) — one schema per doc)
  ├── Completeness check (O(N) — one check per domain)
  ├── Conflict check (O(D²) — pairwise document scan)
  └── Safety completeness check (O(1) — fixed checklist)
  
  On any failure:
    └── Return to interview with specific gap identified

PHASE 3: DOCUMENT PRODUCTION
  For each document in production order:
    ├── Load relevant anchors for this document
    ├── Probe document template — classify each section's density
    ├── For O(1) sections: single pass
    ├── For O(N) sections: one sub-pass per item
    ├── For O(N²) sections: explicit decomposition
    ├── Phase boundary verification after each document:
    │   Does this document violate any anchor?
    └── Store document as complete in working set

PHASE 4: CROSS-DOCUMENT INTEGRITY (O(D²))
  ├── Pairwise conflict scan across all documents
  ├── Schema drift check: DB columns vs. canonical schemas
  ├── Error code coverage: all codes used appear in registry
  ├── Copy key coverage: all UI states have copy keys
  └── Safety test coverage: all safety rules have test IDs

PHASE 5: SELF-AUDIT AND DELIVERY
  ├── Placeholder detection (zero tolerance)
  ├── Anchor compliance: all documents honor all anchors
  ├── Document count verification (16 base + N agents)
  └── Delivery summary with deferred decisions listed
```

---

## 7. Mandatory RLM Checklist for AppArchitect

Before delivering any PRD suite, AppArchitect must confirm:

**Process Compliance:**
- [ ] Anchor set was maintained and surfaced at each phase boundary
- [ ] All high-density domains were classified and decomposed before processing
- [ ] All conflicts were recursed into and resolved — none papered over
- [ ] Phase boundary verifications were run at each transition
- [ ] Context rot mitigations (anchor re-surfacing) were applied

**Agent Instruction Compliance:**
- [ ] Every Agent PRD includes an information density rating
- [ ] Every Agent PRD includes a probe step (Step 0)
- [ ] Every high-density agent step includes explicit decomposition
- [ ] Every agent maintains state variables across steps
- [ ] Every critical domain includes a verification sub-call step
- [ ] Every agent step boundary includes a constraint re-check
- [ ] Every high-density step includes a max sub-iteration limit

**Document Quality:**
- [ ] Placeholder detection returns zero
- [ ] Cross-document integrity check passes
- [ ] All 16+ documents produced

---

## 8. Integration with Existing Suite Documents

This addendum modifies the following documents. In all cases, this addendum's principles take precedence over previous versions where they conflict:

| Document | What Changes |
|---|---|
| Fill-In Agent Prompt | Interview protocol gains Phase 0 (environment probe); domain questions gain density classification; anchor set becomes explicit data structure |
| Master Agent Instruction | Adds anchor set loading step; adds density probe to confirmation protocol |
| All Agent PRDs | Gain Step 0 (probe); gain state variable schema; high-density steps gain decomposition template; all steps gain constraint re-check |
| User Instructions | Phase boundary verifications replace single final audit as the primary quality gate |
| Codebase Audit Prompt | Gains density-aware check allocation: high-density domains get explicit decomposition in the audit |

---

**END OF RLM PRINCIPLES ADDENDUM**