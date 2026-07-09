# Agent Contract Specification

**Version:** 1.0
**Status:** Canonical
**Layer:** Governance
**Position:** 12 of 15
**Depends On:** `01-master-project-schema.md`, `10-system-glossary.md`, `11-master-prompt-framework.md`
**Implements:** Operating Principles #4 (Explicit Assumptions), #7 (Artifact Traceability), #8 (Separation of Responsibility)
**Owner:** AppArchitect Core Team
**Last Updated:** 2026-07-06

---

## Purpose

The Agent Contract Specification defines the mandatory interface every agent must satisfy to be invoked by the Master Orchestrator. An "agent" in AppArchitect is not a free-form prompt — it is a versioned, typed, validated service that consumes a typed assignment envelope, produces a typed result envelope, and refuses to do work outside its declared contract.

This specification exists because **agents cannot be governed by convention**. Conventions drift. Agents will silently expand scope, invent inputs, accept malformed assignments, or return ambiguous results if the contract is implicit. The Agent Contract is the legal system of the agent layer: every input is checked at the boundary, every output is checked at the boundary, and anything that does not match is rejected before the agent runs.

The contract has three surfaces:

1. **Assignment envelope** — what the orchestrator sends in.
2. **Result envelope** — what the agent sends back.
3. **Behavioral clauses** — what the agent must and must not do in between.

All three are versioned, all three are machine-validated, and all three are registered in the agent registry before the agent can be dispatched.

---

## Scope

**Applies to:**

- Every agent in the 17-spec build runtime (`03 - agents/`)
- Every agent in the 19-template canonical meta-team (`03 - agents/templates/`)
- Every agent dynamically generated during orchestration
- Every prompt-embedded agent in `07 - prompt-contracts/`

**Out of scope:**

- Tool-level interfaces (each tool has its own contract)
- Human-review interfaces (governed by `11-human-review-standard.md`)
- Schema-level contracts (governed by `02 - schemas/` and `04-validation-rules.md`)

---

## Core Principles

### 1. Contract is the Source of Truth

The agent contract is the authoritative description of what an agent does. If the agent's actual behavior diverges from the contract, the contract is correct and the agent is re-registered. Generated artifacts from the agent are *not* authoritative — only the contract is.

### 2. Typed Boundaries

Every input and output has a declared type. The orchestrator validates the assignment envelope type before dispatch; the agent validates the result envelope type before return. Type drift is a BLOCKED state, not a warning.

### 3. Minimum Surface Area

An agent's contract must declare the minimum scope it needs to do its job, never more. Cross-scope work is a contract violation even if the agent is technically capable. A frontend agent must refuse to edit backend code, even if it knows how.

### 4. Idempotent Dispatch

Dispatching the same assignment envelope twice must produce the same result envelope (assuming no upstream state change). Agents may not consume non-idempotent resources (rate-limited APIs, mutable random seeds) inside a contract unless the contract explicitly declares it.

### 5. Explicit Failure

When the agent cannot satisfy its contract for any reason, it returns a `failure_envelope` (Section 4 of this spec) and stops. Silent partial completion, silent degradation, and silent exit codes are contract violations.

### 6. Version-Locked

Every agent contract carries a SemVer version. The orchestrator resolves which contract version to use per-dispatch. A MAJOR bump in the contract requires re-registration and re-validation; the orchestrator never silently upgrades.

---

## Section 1 — Assignment Envelope

Every agent dispatch is wrapped in an assignment envelope. The agent must validate the envelope against the registered contract before doing any work.

### 1.1 Envelope Schema

```typescript
type AssignmentEnvelope = {
  assignment_id: string;              // UUID v4, unique per dispatch
  requesting_agent_id: string;       // Who sent this (orchestrator or peer)
  target_agent_id: string;            // Must match a registered agent
  target_agent_version: string;       // SemVer, must match a registered version
  task_type: string;                  // Must be in agent.declared_task_types
  target_schema_sections: string[];   // e.g., ["project.metadata", "project.features"]
  inputs: Record<string, unknown>;    // Typed per agent contract (see 1.2)
  context_bundle: {
    upstream_artifacts: ArtifactRef[];  // Read-only references
    dependency_closure: string[];       // What the orchestrator already validated
    assumptions_register: Assumption[]; // Assumptions the agent inherits
  };
  constraints: {
    max_runtime_ms: number;            // Hard deadline
    max_tokens: number;                // Token budget
    temperature: number;               // LLM temperature (fixed at 0.0 for schema-derived work)
    forbidden_actions: string[];       // Inherited from parent prompt
  };
  priority: 'low' | 'normal' | 'high' | 'critical';
  deadline: string;                    // ISO 8601 timestamp
  audit_metadata: {
    project_id: string;
    pipeline_stage: string;            // e.g., "Stage 5: Architecture Design"
    trace_id: string;                  // End-to-end trace correlation ID
  };
};
```

### 1.2 Input Validation

Inputs are validated in this order:

1. **Envelope schema check** — does the envelope match the registered agent's expected envelope type?
2. **Required inputs present** — are all `inputs.<name>` with `required: true` populated?
3. **Input type check** — does each input match the declared TypeScript type?
4. **Enum check** — are enum inputs within the declared allowed set?
5. **Range check** — are numeric inputs within the declared min/max?
6. **Cross-reference check** — do all `upstream_artifacts` actually exist in the audit trail?

Any failure at any step → return `failure_envelope` with `failure_type: 'INVALID_ASSIGNMENT'` and stop.

### 1.3 Scope Check

The agent must verify the assignment is within its declared scope:

- `task_type` is in `agent.declared_task_types`
- `target_schema_sections` are all in `agent.declared_schema_sections`
- No `inputs.<name>` is outside `agent.declared_inputs`

If the assignment is out of scope, return `failure_envelope` with `failure_type: 'SCOPE_VIOLATION'` and `recommended_action: 'REASSIGN_TO_<correct_agent>'`.

---

## Section 2 — Result Envelope

Every agent returns a result envelope. The result envelope is the **only** authoritative return type; agents may not return bare JSON, plain text, or partial structures.

### 2.1 Success Envelope

```typescript
type SuccessEnvelope = {
  assignment_id: string;              // Must match the AssignmentEnvelope
  agent_id: string;
  agent_version: string;
  status: 'COMPLETE' | 'PARTIAL';
  outputs: {
    primary_artifact: ArtifactRef;    // The main deliverable
    secondary_artifacts: ArtifactRef[];// Supporting artifacts
    derived_data: Record<string, unknown>;  // Typed per agent contract
  };
  schema_deltas: SchemaDelta[];       // What the agent changed in the schema
  assumptions_made: Assumption[];     // NEW assumptions added (not inherited)
  handoff_ready: boolean;             // Can downstream agents consume this?
  generation_manifest: {
    generated_at: string;             // ISO 8601
    generated_by: string;             // agent_id + version
    content_hash: string;             // SHA-256 of primary_artifact
    schema_version: string;           // Schema version the agent operated on
    prompt_version: string;           // Prompt version the agent used
  };
};
```

If `status: 'PARTIAL'`, the envelope must include `partial_reason: string` and `remaining_work: TaskRef[]`.

### 2.2 Failure Envelope

```typescript
type FailureEnvelope = {
  assignment_id: string;
  agent_id: string;
  agent_version: string;
  status: 'FAILED';
  failure_type:
    | 'INVALID_ASSIGNMENT'
    | 'SCOPE_VIOLATION'
    | 'MISSING_DEPENDENCY'
    | 'INTERNAL_ERROR'
    | 'TIMEOUT'
    | 'TOKEN_LIMIT_EXCEEDED'
    | 'BLOCKED_BY_VALIDATION'
    | 'EXTERNAL_SERVICE_FAILURE'
    | 'NEEDS_CLARIFICATION'
    | 'IRREVERSIBLE_ACTION_REQUIRES_HUMAN';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;                    // Human-readable, max 500 chars
  evidence: {
    failed_check: string;             // e.g., "schema_validation.stage_2"
    input_state: Record<string, unknown>;  // Sanitized (no secrets)
    stack_trace?: string;             // Only if INTERNAL_ERROR
  };
  recommended_action: string;         // What the orchestrator should do next
  escalation_target?: 'ORCHESTRATOR' | 'HUMAN_REVIEW' | 'VALIDATION_ENGINE';
};
```

A failure envelope is the agent's **only** valid response when the assignment cannot be completed. Returning success after a partial completion is a contract violation and a CRITICAL severity finding.

### 2.3 Clarification Envelope

When the agent needs information that is not in the assignment envelope:

```typescript
type ClarificationEnvelope = {
  assignment_id: string;
  agent_id: string;
  status: 'NEEDS_CLARIFICATION';
  questions: Array<{
    question_id: string;
    question: string;                 // Plain language, max 200 chars
    type: 'TEXT' | 'YES_NO' | 'CHOICE' | 'NUMBER';
    choices?: string[];               // For CHOICE type
    required: boolean;
    context: string;                  // Why the agent needs this to proceed
  }>;
  can_proceed_partially: boolean;     // Can the agent do partial work without the answer?
};
```

A clarification envelope pauses the pipeline until the orchestrator routes the questions (typically to `07 - prompt-contracts/11-human-review-interface-prompt.md`) and returns answers in a new assignment envelope.

---

## Section 3 — Behavioral Clauses

Behavioral clauses are the rules an agent must follow during execution. They are checked at registration time (the agent's contract must declare compliance) and at audit time (post-dispatch).

### 3.1 Compliance Clauses (Must Declare at Registration)

| ID | Clause | Required For |
|----|--------|--------------|
| BC-01 | Does not modify artifacts outside its declared scope | All agents |
| BC-02 | Returns explicit failure envelope on any unresolvable error | All agents |
| BC-03 | Records `generation_manifest` for every emitted artifact | All agents |
| BC-04 | Operates only on schema versions declared in its contract | All agents |
| BC-05 | Does not call other agents directly (orchestrator is the only caller) | All non-orchestrator agents |
| BC-06 | Does not bypass validation; waits for orchestrator to dispatch validator | All agents |
| BC-07 | Treats inherited assumptions as non-authoritative; adds new assumptions explicitly | All agents |
| BC-08 | Honors `max_runtime_ms`, `max_tokens`, and `temperature` constraints | All agents |
| BC-09 | Returns idempotent results for the same assignment envelope | All agents |
| BC-10 | Refuses to perform irreversible actions without explicit human approval | All agents |

### 3.2 Forbidden Actions (Runtime Blacklist)

The agent must refuse and return `failure_envelope(failure_type: 'IRREVERSIBLE_ACTION_REQUIRES_HUMAN')` if asked to:

| ID | Forbidden Action | Reason |
|----|------------------|--------|
| FA-01 | Delete data outside its declared scope | Cross-scope write |
| FA-02 | Modify the Master Project Schema directly | Schema authority violation |
| FA-03 | Deploy to production | DevOps is a separate agent |
| FA-04 | Activate billing / monetization in production | Monetization is irreversible |
| FA-05 | Send communications to end users | Marketing agent owns this |
| FA-06 | Promote a release without `07-production-readiness-validator.md: GO` | Release gate bypass |
| FA-07 | Modify governance documents | Governance is constitution |
| FA-08 | Execute operations against schemas it did not declare in its contract | Schema scope violation |
| FA-09 | Call another agent without going through the orchestrator | Layering violation |
| FA-10 | Skip the audit metadata in any returned envelope | Traceability requirement |

### 3.3 Self-Validation Requirements

Before returning any envelope, the agent must run the following self-checks:

1. **Envelope schema check** — does the returned envelope match the registered envelope type?
2. **Generation manifest check** — is every field in `generation_manifest` populated?
3. **Scope check** — is every emitted artifact within the agent's declared scope?
4. **Forbidden action check** — did the agent perform any action in the FA-01..FA-10 list?
5. **Assumption check** — if `assumptions_made` is non-empty, is each assumption accompanied by a `validity_period` and a `trigger_for_revalidation`?

Any self-check failure → discard the work-in-progress, return `failure_envelope(failure_type: 'INTERNAL_ERROR')`.

---

## Section 4 — Agent Registration

Every agent must be registered in the agent registry before the orchestrator can dispatch to it. Registration is a formal process, not a file convention.

### 4.1 Registration Requirements

```typescript
type AgentRegistration = {
  agent_id: string;                   // e.g., "architect"
  agent_version: string;              // SemVer
  display_name: string;
  description: string;
  tier: 'orchestration' | 'core-pipeline' | 'specialist' | 'growth' | 'infrastructure' | 'meta';
  declared_task_types: string[];
  declared_schema_sections: string[];
  declared_inputs: Array<{
    name: string;
    type: string;                     // TypeScript type expression
    required: boolean;
    description: string;
  }>;
  declared_outputs: {
    envelope_type: 'SuccessEnvelope' | 'FailureEnvelope' | 'ClarificationEnvelope';
    primary_artifact_type: string;    // e.g., "ArchitectureObject"
  };
  declared_compliance: string[];      // BC-01..BC-10 IDs the agent complies with
  prompt_contract_ref: string;        // Path to the prompt file
  schema_refs: string[];              // Schema versions this agent operates on
  test_cases: Array<{
    name: string;
    input_envelope: AssignmentEnvelope;
    expected_envelope_type: string;
    expected_outputs_subset: Record<string, unknown>;
  }>;
  owner: string;                      // Team or person responsible
  registered_at: string;              // ISO 8601
};
```

### 4.2 Registration Gate

A registration is accepted only if:

- All required fields in `AgentRegistration` are populated
- All `test_cases` pass on the registered prompt version
- All `declared_compliance` BC-IDs are demonstrably satisfied by the prompt
- The `schema_refs` exist in `02 - schemas/` and are at status `canonical`
- The owner has signed off in the changelog

A registration that fails any of these is rejected with a `registration_rejection` report listing every failed check.

### 4.3 Re-registration

Any change to:

- `declared_task_types`
- `declared_schema_sections`
- `declared_inputs` (addition, removal, type change, requiredness change)
- `declared_outputs.envelope_type`
- `declared_compliance` (removal of a BC)

…requires a MAJOR version bump and re-registration. Additive test cases, documentation changes, and prompt-wording tweaks are PATCH or MINOR.

---

## Section 5 — Contract Validation

The Validation Engine (`08 - validation/`) is responsible for verifying agent contract compliance. Three validation passes are run at registration and on every MAJOR version bump:

### 5.1 Static Contract Validation

Checks the `AgentRegistration` document against this specification:

| Check | Severity |
|-------|----------|
| All required fields present | CRITICAL |
| `declared_compliance` ⊆ {BC-01..BC-10} | ERROR |
| `prompt_contract_ref` resolves to an existing file | CRITICAL |
| All `test_cases` are well-formed | ERROR |
| `schema_refs` resolve to existing canonical schemas | ERROR |
| `agent_version` parses as SemVer | CRITICAL |
| No duplicate `assignment_id` across test cases | WARNING |

### 5.2 Behavioral Validation

Re-runs every `test_case` against the registered prompt and compares the actual envelope to `expected_envelope_type` and `expected_outputs_subset`. Failure of any test case → registration rejected.

### 5.3 Runtime Compliance Audit

Periodically (per `05 - operational-standards/11-human-review-standard.md`), a random sample of past dispatches is re-validated to check:

- The envelope types match what was registered
- The `generation_manifest` is fully populated
- No `FA-01..FA-10` action was performed
- The agent did not exceed its `declared_schema_sections`

Audit findings feed into `08 - validation/04-consistency-validator.md`.

---

## Section 6 — Inter-Agent Contracts

When an agent produces an artifact that is consumed by another agent, the producer's `primary_artifact` becomes a dependency for the consumer. The orchestrator mediates this by:

1. Validating the producer's `SuccessEnvelope.handoff_ready === true`
2. Verifying the consumer's `target_schema_sections` overlaps with the producer's declared scope
3. Emitting the consumer's assignment with the producer's artifact in `context_bundle.upstream_artifacts`

A consumer may NOT modify the upstream artifact. A consumer that needs a change to the upstream must return `ClarificationEnvelope` or `FailureEnvelope(SCOPE_VIOLATION)`, not silently edit.

---

## Section 7 — Contract Versioning

Agent contracts follow SemVer:

| Bump | When | Required Action |
|------|------|-----------------|
| MAJOR | Breaking change to inputs, outputs, or compliance scope | Re-register; re-validate; orchestrator refuses to dispatch old contract after grace period |
| MINOR | Additive: new optional input, new declared task type | Re-register; re-test; existing dispatches unaffected |
| PATCH | Wording, metadata, non-behavioral changes | Update registration timestamp; no re-test required |

A MAJOR bump in the agent contract does NOT require a MAJOR bump in the consuming prompt; the orchestrator handles both contract versions during a deprecation window.

---

## Section 8 — Failure Mode Catalog

The following failure modes are anticipated by this specification. Each has a defined recovery path.

| Failure Mode | Detection | Recovery |
|--------------|-----------|----------|
| Agent returns bare JSON without envelope | Orchestrator envelope parser | BLOCKED; re-dispatch with `INVALID_RESULT` failure back to agent |
| Agent modifies schema outside declared scope | Validation Engine schema-audit pass | CRITICAL finding; revoke agent registration |
| Agent calls another agent directly | Orchestrator call-trace audit | CRITICAL finding; alert security agent |
| Agent returns success on partial completion | Cross-document validator | CRITICAL finding; re-dispatch with PARTIAL clarification |
| Agent uses temperature > 0.0 for schema-derived work | Audit metadata check | ERROR finding; re-dispatch with constraint |
| Agent silently consumes a rate-limited external API | Runtime monitoring | WARNING; throttle; re-dispatch if rate limit clears |
| Agent schema version drift (operates on v1 while registry lists v2) | Contract validator | BLOCKED; re-dispatch against declared version |
| Agent refuses to declare an assumption | Assumption audit | WARNING; re-dispatch requiring assumption declaration |

---

## Section 9 — Compliance Matrix

| Compliance ID | Validated By | Frequency |
|---------------|--------------|-----------|
| BC-01 (Scope) | `08 - validation/04-consistency-validator.md` | Per dispatch + audit |
| BC-02 (Failure) | `08 - validation/01-prd-validator.md` (artifact-level) + runtime monitor | Per dispatch |
| BC-03 (Manifest) | `08 - validation/03-cross-document-validator.md` | Per dispatch |
| BC-04 (Schema version) | `08 - validation/02-schema-validator.md` | Per dispatch |
| BC-05 (No peer calls) | Orchestrator call-trace | Continuous |
| BC-06 (No self-validation) | `08 - validation/06-dependency-validator.md` | Per dispatch |
| BC-07 (Assumption declaration) | `08 - validation/05-completeness-validator.md` | Per dispatch |
| BC-08 (Constraint honor) | Runtime monitor | Continuous |
| BC-09 (Idempotency) | Re-dispatch test in test suite | At registration |
| BC-10 (Human approval) | `07 - prompt-contracts/11-human-review-interface-prompt.md` | Per dispatch |

---

## Section 10 — Cross-References

- **Master Project Schema:** `01 - governance/01-master-project-schema.md`
- **System Glossary:** `01 - governance/10-system-glossary.md`
- **Master Prompt Framework:** `01 - governance/11-master-prompt-framework.md`
- **Validation Rules:** `01 - governance/04-validation-rules.md`
- **Validation Engine Spec:** `01 - governance/13-validation-engine-spec.md`
- **Agent Execution Standard:** `05 - operational-standards/02-agent-execution-standard.md`
- **Document Quality Standard:** `05 - operational-standards/03-document-quality-standard.md`
- **Validation Standard:** `05 - operational-standards/04-validation-standard.md`
- **Master Orchestrator Prompt:** `07 - prompt-contracts/01-master-orchestrator-prompt.md`
- **Agent Roster:** `03 - agents/README.md`

---

## Section 11 — Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2026-07-06 | Initial canonical spec defining assignment/result/clarification envelopes, behavioral clauses, registration gate, and failure catalog | AppArchitect Core Team |

---

*End of governance/12-agent-contract-spec.md*

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2026-07-06 | Initial canonical spec defining 12-section agent contract, the execution envelope, scope enforcement, and the agent registry | AppArchitect Core Team |

---

*End of governance/12-agent-contract-spec.md*
