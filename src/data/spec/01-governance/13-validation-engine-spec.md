# Validation Engine Specification

**Version:** 1.0
**Status:** Canonical
**Layer:** Governance
**Position:** 13 of 15
**Depends On:** `01-master-project-schema.md`, `04-validation-rules.md`, `12-agent-contract-spec.md`
**Implements:** Operating Principles #1 (Truth Over Completion), #5 (Validation Before Progression), #6 (Governance Supremacy)
**Owner:** AppArchitect Core Team
**Last Updated:** 2026-07-06

---

## Purpose

The Validation Engine is the final authority on generation readiness. It is the system component that **executes validation rules against artifacts, produces findings, calculates readiness scores, and enforces pipeline gates**. No artifact advances to the next lifecycle phase without passing the gates defined here.

This specification is the architectural contract for the engine. The rule catalog (which rules to run) lives in `04-validation-rules.md`. The procedural standard (how the engine is invoked) lives in `05 - operational-standards/04-validation-standard.md`. The seven domain validator implementations live in `08 - validation/`. This document defines the engine's responsibility, inputs, outputs, internal architecture, and the rules of engagement for every other component that depends on it.

The engine does not generate artifacts. It does not edit artifacts. It does not approve exceptions. It evaluates, returns verdicts, and stops. The orchestrator routes the verdict; the engine produces it.

---

## Scope

**Applies to:**

- Every artifact produced by an agent (PRDs, schemas, architecture objects, exports, etc.)
- Every state transition in the project lifecycle (`15-project-lifecycle-model.md`)
- Every agent contract at registration time
- Every prompt contract at version-bump time
- Every export package at handoff time

**Out of scope:**

- Source code validation (governed by the QA agent + `08 - validation/07-production-readiness-validator.md`)
- External service validation (handled by the Integrations agent)
- Live production telemetry (governed by `05 - operational-standards/09-observability-standard.md`)

---

## Core Responsibilities

The engine has exactly six responsibilities. Any other action is out of scope.

1. **Execute validation rules** against the artifacts in its dispatch envelope.
2. **Produce findings** in the canonical `ValidationResult` format.
3. **Calculate readiness** using the scoring formula in Section 5 of this spec.
4. **Enforce gates** by returning a verdict the orchestrator can use to block or permit progression.
5. **Generate reports** in the human-readable format defined in Section 7.
6. **Maintain audit trail** of every validation run, including the rule set used, the artifact version checked, and the orchestrator trace ID.

The engine does not remediate, does not suggest fixes inline, does not skip rules, and does not bend severity. Severity is set by the rule; the engine reports it as-is.

---

## Validation Architecture

```
            ┌────────────────────────────┐
            │  Assignment Envelope       │
            │  - artifact_ref            │
            │  - rule_set_id             │
            │  - severity_floor          │
            │  - context_bundle          │
            └─────────────┬──────────────┘
                          │
                          ▼
            ┌────────────────────────────┐
            │  Artifact Loader           │
            │  - parse artifact          │
            │  - resolve references      │
            │  - compute content_hash    │
            └─────────────┬──────────────┘
                          │
                          ▼
            ┌────────────────────────────┐
            │  Rule Selector             │
            │  - filter rules by         │
            │    artifact_type           │
            │  - filter by severity_floor│
            │  - dedupe by rule_id       │
            └─────────────┬──────────────┘
                          │
                          ▼
            ┌────────────────────────────┐
            │  Rule Executor             │
            │  - for each rule:          │
            │    • construct inputs      │
            │    • invoke rule function  │
            │    • capture finding       │
            │  - run in parallel where   │
            │    rules are independent   │
            └─────────────┬──────────────┘
                          │
                          ▼
            ┌────────────────────────────┐
            │  Finding Aggregator        │
            │  - group by category       │
            │  - dedupe by finding_key    │
            │  - escalate by severity    │
            └─────────────┬──────────────┘
                          │
                          ▼
            ┌────────────────────────────┐
            │  Severity Classifier       │
            │  - assign each finding:    │
            │    INFO | WARNING | ERROR  │
            │    | CRITICAL              │
            │  - apply severity_floor    │
            └─────────────┬──────────────┘
                          │
                          ▼
            ┌────────────────────────────┐
            │  Readiness Scorer          │
            │  - compute readiness_score │
            │  - compute gate_decision   │
            │  - generate remediation    │
            └─────────────┬──────────────┘
                          │
                          ▼
            ┌────────────────────────────┐
            │  Report Generator          │
            │  - ValidationResult JSON   │
            │  - human-readable report   │
            │  - audit trail entry       │
            └────────────────────────────┘
```

Every step is logged. The engine must be restartable from any checkpoint by re-running with the same inputs and the same rule set version.

---

## Validation Types

The engine runs seven validation types, each implemented as one validator file in `08 - validation/`.

### 1. Schema Validation

**Validator:** `08 - validation/02-schema-validator.md`
**Runs at:** After every artifact load; mandatory gate before any domain validation.

Validates that the artifact:

- Parses as its declared format (JSON, YAML, Markdown)
- Matches the registered JSON Schema in `02 - schemas/`
- Resolves all internal `$ref` pointers
- Has the required `metadata + references + content` envelope
- Has a content_hash that matches the metadata

Failure mode: CRITICAL — the artifact is malformed and cannot be evaluated.

### 2. Document Validation

**Validator:** `08 - validation/01-prd-validator.md`
**Runs at:** After PRD, technical spec, and UX document generation.

Validates that the document:

- Contains every required section (per the PRD template in `04 - templates/`)
- Meets the minimum content thresholds (no placeholder text, no empty sections)
- Has testable, atomic, traceable, implementable requirements
- References valid upstream artifacts

Failure mode: ERROR (missing section); WARNING (sub-threshold content).

### 3. Cross-Reference Validation

**Validator:** `08 - validation/03-cross-document-validator.md`
**Runs at:** After any set of documents is generated; mandatory before any cross-document synthesis.

Validates that:

- Every cross-reference (`See X`, `Per Y`, link, file path) resolves to an existing artifact
- Every artifact is referenced by at least one other artifact (no orphans)
- The dependency graph is acyclic
- Versions match across references (referencing v1 when only v2 exists = ERROR)

Failure mode: ERROR (broken reference); CRITICAL (cycle in dependency graph).

### 4. Consistency Validation

**Validator:** `08 - validation/04-consistency-validator.md`
**Runs at:** Parallel with completeness and dependency validation.

Validates that:

- The same term is used the same way across documents
- Numbers, names, and identifiers are consistent
- A field defined as required in the schema is populated everywhere it's referenced
- No two artifacts contradict each other on the same fact

Failure mode: WARNING (terminology drift); ERROR (numeric or identifier inconsistency); CRITICAL (factual contradiction).

### 5. Completeness Validation

**Validator:** `08 - validation/05-completeness-validator.md`
**Runs at:** Parallel with consistency and dependency validation.

Validates that:

- Every declared feature in the schema has a corresponding architecture coverage
- Every workflow has at least one screen
- Every screen has at least one persona assigned
- Every persona has at least one user story
- The readiness threshold for the current lifecycle phase is met (per `15-project-lifecycle-model.md`)

Failure mode: ERROR (missing coverage); CRITICAL (lifecycle threshold not met).

### 6. Dependency Validation

**Validator:** `08 - validation/06-dependency-validator.md`
**Runs at:** Parallel with consistency and completeness validation.

Validates that:

- Every declared dependency in the architecture is real (provider exists, package is in registry, etc.)
- Every required integration is configured (auth, secrets, rate limits)
- The dependency closure matches what the orchestrator pre-computed
- No circular imports in generated code structures

Failure mode: WARNING (unversioned dependency); ERROR (missing dependency); CRITICAL (circular dependency).

### 7. Production-Readiness Validation

**Validator:** `08 - validation/07-production-readiness-validator.md`
**Runs at:** Final gate before export. NEVER skipped.

Validates that the project is safe to ship:

- All CRITICAL findings from the prior 6 validators are resolved
- All ERROR findings are resolved or have human-acknowledged remediation
- Security baseline is met (auth on every protected endpoint, secrets in vault)
- Compliance posture is documented (GDPR, SOC2, HIPAA, etc., as applicable)
- Operational readiness (runbooks, monitoring, on-call rotation) is documented
- Rollback plan exists and is tested

Failure mode: CRITICAL on any failure. This validator returns GO / CONDITIONAL_GO / NO_GO.

---

## Section 5 — Readiness Score

The readiness score is a single number (0–100) the engine produces per validation run. It is **not** the gate decision; the gate decision is derived from severity-weighted findings (Section 6). The score is a progress indicator for human reviewers.

### 5.1 Formula

```
readiness_score = round(
    (passed_checks / total_checks) × 100
    × severity_penalty_multiplier
)
```

Where:

- `passed_checks` = number of rules that returned `PASS` or `PASS_WITH_WARNING`
- `total_checks` = total rules evaluated (excludes rules filtered out by `severity_floor`)
- `severity_penalty_multiplier`:
  - 0 critical findings, 0 error findings: 1.00
  - 0 critical findings, ≥1 error findings: 0.90
  - ≥1 critical findings: 0.70

### 5.2 Score Interpretation

| Score | Interpretation | Typical Phase |
|-------|----------------|---------------|
| 90–100 | Production-ready | Export / Handoff |
| 80–89 | Near-ready; minor remediations outstanding | Late validation |
| 60–79 | Significant gaps; remediation in progress | Mid-pipeline |
| 40–59 | Major gaps; re-dispatch required | Early validation |
| 0–39 | Foundational issues; back to discovery | Pre-architecture |

### 5.3 What the Score Is Not

The readiness score is **not**:

- A prediction of business success
- A substitute for human review
- A quality guarantee of the generated product
- A measure of code quality (the QA agent owns that)

A score of 100 with all CRITICAL findings suppressed is worse than a score of 80 with no findings. The score plus the findings list is the truth.

---

## Section 6 — Gate Decision

The engine's gate decision is the binary (or ternary) verdict the orchestrator uses to permit or block progression. It is **derived from findings, not the score**.

### 6.1 Decision Algorithm

```
gate_decision = NO_GO
if critical_findings_count == 0 and error_findings_count == 0:
    gate_decision = GO
elif critical_findings_count == 0 and error_findings_count <= 3:
    gate_decision = CONDITIONAL_GO
else:
    gate_decision = NO_GO
```

A CONDITIONAL_GO requires the orchestrator to surface every ERROR finding with its remediation to a human reviewer before proceeding.

### 6.2 Per-Phase Gate Thresholds

Some lifecycle phases have stricter gates than the default. The orchestrator sets the threshold via `severity_floor` in the assignment envelope.

| Phase | Default Gate | Strict Gate | Critical-Only Gate |
|-------|--------------|-------------|---------------------|
| Discovery → Schema | CONDITIONAL_GO | NO_GO on errors | NO_GO on critical |
| Schema → Architecture | CONDITIONAL_GO | NO_GO on errors | NO_GO on critical |
| Architecture → Documentation | GO | CONDITIONAL_GO | NO_GO on critical |
| Documentation → Validation | GO | CONDITIONAL_GO | NO_GO on critical |
| Validation → Export | GO | GO | NO_GO on critical |
| Export → Handoff | GO | GO | NO_GO on critical |

The strict gate is used when the downstream phase has no rollback. The critical-only gate is used for patch-level updates to an already-shipped product.

### 6.3 Bypass

A gate is **never** bypassed. There is no override. There is no `force_pass: true` parameter. The orchestrator cannot dispatch an artifact to the next phase while the engine holds a `gate_decision: NO_GO`.

The only way to clear a NO_GO is to remediate the findings and re-validate.

---

## Section 7 — Validation Result Schema

The engine returns a `ValidationResult` envelope:

```typescript
type ValidationResult = {
  validation_id: string;              // UUID
  run_at: string;                    // ISO 8601
  artifact_ref: {
    artifact_id: string;
    artifact_type: string;
    artifact_version: string;
    content_hash: string;
  };
  rule_set: {
    rule_set_id: string;             // e.g., "core-pipeline-v1.0"
    rule_set_version: string;        // SemVer
    rules_evaluated: number;
    rules_skipped: number;           // Due to severity_floor
  };
  findings: Finding[];
  readiness_score: number;           // 0–100
  gate_decision: 'GO' | 'CONDITIONAL_GO' | 'NO_GO';
  remediation_actions: RemediationAction[];
  audit_metadata: {
    project_id: string;
    pipeline_stage: string;
    trace_id: string;
    engine_version: string;          // Engine's own SemVer
  };
};

type Finding = {
  finding_id: string;
  rule_id: string;                   // e.g., "PRD-REQ-TESTABLE-001"
  rule_category: string;             // e.g., "Document Quality"
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;                   // Human-readable, max 500 chars
  location: {
    file: string;
    line_start?: number;
    line_end?: number;
    selector?: string;               // CSS or XPath for HTML/MD
  };
  evidence: Record<string, unknown>;
  remediation: string;               // What to do to resolve
  finding_key: string;               // For deduplication across runs
};

type RemediationAction = {
  action_id: string;
  description: string;
  estimated_effort: 'TRIVIAL' | 'SMALL' | 'MEDIUM' | 'LARGE';
  blocking: boolean;
  suggested_agent: string;           // Who should re-dispatch to fix
};
```

This schema is the canonical contract for validation results. It is registered in `02 - schemas/09-validation-result.json` and validated on emission.

---

## Section 8 — Rule Registry

The rule registry is the catalog of every rule the engine can execute. Rules are versioned, owned, and registered before they can be invoked.

### 8.1 Rule Definition

```typescript
type ValidationRule = {
  rule_id: string;                   // e.g., "PRD-REQ-TESTABLE-001"
  rule_version: string;              // SemVer
  display_name: string;
  description: string;
  category: 'Structural' | 'Schema' | 'Document Quality' | 'Cross-Reference' | 'Consistency' | 'Completeness' | 'Dependency' | 'Security' | 'Production Readiness';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  applies_to: string[];              // Artifact types this rule applies to
  inputs: string[];                  // What the rule consumes
  outputs: string[];                 // What the rule produces
  implementation_ref: string;        // Path to the rule function
  owner: string;                     // Team or person
  registered_at: string;
  test_cases: Array<{
    input: Record<string, unknown>;
    expected_severity: string;
    expected_message_substring?: string;
  }>;
};
```

### 8.2 Rule Registration Gate

A rule is registered only if:

- All required fields are populated
- All `test_cases` pass on the registered implementation
- The owner has signed off
- The `implementation_ref` resolves to an existing file
- At least 3 test cases are present (positive, negative, edge)

A rule that fails any of these is rejected with a `rule_registration_rejection` report.

### 8.3 Rule Versioning

| Bump | When |
|------|------|
| MAJOR | Severity change, scope change, behavioral change |
| MINOR | New optional test case, new optional input |
| PATCH | Wording, metadata, performance |

A MAJOR bump in a rule does NOT require re-validating already-validated artifacts, but the next validation run uses the new version.

---

## Section 9 — Severity Levels

Severity is the impact the engine assigns to a finding. The rule declares the severity; the engine reports it.

| Level | Meaning | Engine Behavior | Orchestrator Behavior |
|-------|---------|-----------------|------------------------|
| INFO | Informational; no action required | Report | Log; proceed |
| WARNING | Should be reviewed; generation may continue | Report | Log; proceed; surface to human reviewer |
| ERROR | Generation cannot proceed without correction | Report; mark gate CONDITIONAL_GO | Block; request remediation; re-validate |
| CRITICAL | Project state is invalid | Report; mark gate NO_GO | Halt pipeline; alert; require human review |

The engine does not auto-resolve findings. It reports. Remediation is the responsibility of the agent that produced the artifact.

---

## Section 10 — Engine Lifecycle

The engine is itself a service with a lifecycle.

### 10.1 Boot

On boot, the engine:

1. Loads the rule registry from the canonical path
2. Verifies every registered rule's `implementation_ref` resolves
3. Runs a self-test (Section 11)
4. Subscribes to the orchestrator's dispatch queue
5. Begins accepting assignments

A failed self-test prevents the engine from accepting assignments.

### 10.2 Steady State

The engine processes one assignment at a time per worker. Workers can be parallelized (the engine is stateless). Each worker:

1. Receives an assignment
2. Loads the artifact
3. Selects the rule set
4. Executes rules
5. Aggregates findings
6. Computes readiness + gate decision
7. Returns the ValidationResult

### 10.3 Shutdown

The engine drains its queue, completes in-flight assignments, and persists the final state. A clean shutdown writes an audit entry per in-flight assignment.

### 10.4 Crash Recovery

If a worker crashes mid-run, the orchestrator's re-dispatch mechanism re-issues the assignment to a fresh worker. The engine is idempotent: re-running the same assignment against the same artifact version produces the same ValidationResult.

---

## Section 11 — Self-Test

On boot and at configurable intervals, the engine runs a self-test that exercises:

- The rule registry load
- A representative subset of rules against synthetic artifacts
- The scoring algorithm
- The gate decision algorithm
- The report generator

A self-test failure halts the engine and emits a `engine_self_test_failure` alert.

---

## Section 12 — Cross-References

- **Master Project Schema:** `01 - governance/01-master-project-schema.md`
- **System Glossary:** `01 - governance/10-system-glossary.md`
- **Validation Rules Catalog:** `01 - governance/04-validation-rules.md`
- **Document Dependency Matrix:** `01 - governance/02-document-dependency-matrix.md`
- **Agent Contract Spec:** `01 - governance/12-agent-contract-spec.md`
- **Project Lifecycle Model:** `01 - governance/15-project-lifecycle-model.md`
- **Document Generation Order:** `01 - governance/09-document-generation-order.md`
- **Validation Standard:** `05 - operational-standards/04-validation-standard.md`
- **Human Review Standard:** `05 - operational-standards/11-human-review-standard.md`
- **Failure Recovery Standard:** `05 - operational-standards/10-failure-recovery-standard.md`
- **Validation Engine Prompt:** `07 - prompt-contracts/02-validation-engine-prompt.md`
- **Master Orchestrator Prompt:** `07 - prompt-contracts/01-master-orchestrator-prompt.md`
- **Seven Validators:** `08 - validation/01-07-*.md`

---

## Section 13 — Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2026-07-06 | Initial canonical spec defining engine architecture, 7 validation types, scoring algorithm, gate decision algorithm, rule registry, and self-test | AppArchitect Core Team |

---

*End of governance/13-validation-engine-spec.md*
shold unmet).

### 6. Dependency Validation

**Validator:** `08 - validation/06-dependency-validator.md`
**Runs at:** Parallel with consistency and completeness validation.

Validates that:

- Every upstream artifact referenced exists and is in a valid state
- The dependency closure for any artifact is computable
- No artifact depends on a `draft` status artifact (only `canonical` or `locked`)
- Reversibility classification is recorded for every action

Failure mode: ERROR (broken dependency); CRITICAL (irreversible action with no human sign-off).

### 7. Production-Readiness Validation

**Validator:** `08 - validation/07-production-readiness-validator.md`
**Runs at:** The FINAL gate. Runs once per release candidate. No artifact can be exported without this passing.

Validates the full production-readiness checklist (security, performance, accessibility, compliance, monitoring, rollback plan, incident response, on-call coverage). See `07-production-readiness-validator.md` for the 30-rule catalog.

Failure mode: CRITICAL finding blocks the export. NO-GO is the default verdict on any unresolvable finding.

---

## Rule Registry

Every rule the engine executes is registered in the rule registry before it can run. The registry is a versioned catalog with these properties:

```typescript
type ValidationRule = {
  rule_id: string;                    // e.g., "DOC-001"
  category: 'SCHEMA' | 'DOCUMENT' | 'CROSS_REF' | 'CONSISTENCY' | 'COMPLETENESS' | 'DEPENDENCY' | 'PRODUCTION';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  applies_to: string[];               // Artifact types this rule applies to
  description: string;                // What the rule checks
  remediation: string;                // What the agent/owner should do to fix
  rule_function: string;              // Path to the rule's executable function
  test_cases: Array<{
    name: string;
    artifact_fixture: string;         // Path to a fixture file
    expected_outcome: 'PASS' | 'FAIL';
    expected_finding_substring: string;
  }>;
  registered_at: string;              // ISO 8601
  registered_by: string;              // Validator owner
};
```

A rule is not valid for execution unless:

- All fields are populated
- `test_cases` includes at least 2 PASS and 1 FAIL case
- The rule's owner has signed off
- The validator file in `08 - validation/` declares the rule

The rule catalog is loaded at engine startup. A rule added mid-run is not picked up until the next run. A rule removed from the catalog cannot be cited in a finding produced after the removal.

---

## Severity Levels

The engine uses four severity levels, defined in `04-validation-rules.md` and reproduced here for completeness.

| Level | Name | Definition | Engine Action |
|-------|------|------------|---------------|
| 0 | INFO | Observation; not an issue | Report; do not block |
| 1 | WARNING | Should be reviewed; may be acceptable | Report; allow progression with audit-required flag |
| 2 | ERROR | Generation cannot proceed without correction | Report; block progression; require remediation before re-run |
| 3 | CRITICAL | Project state is invalid | Report; halt pipeline; immediate human review required |

A severity is **assigned by the rule**, not by the engine. The engine classifies the finding under the rule's declared severity. A rule author who wants to escalate a finding from WARNING to ERROR must do so in the rule definition, not at the engine level.

The engine does, however, support a `severity_floor` parameter on the assignment envelope. If `severity_floor: 'ERROR'`, the engine downgrades any WARNING-or-below finding to a non-reported status (they still count toward the score, but are not in the output envelope). This is used in production-readiness runs to suppress noise.

---

## Readiness Score Formula

The readiness score is the single most important number the engine produces. It is the input to the orchestrator's gate decision.

```
ReadinessScore = (passedChecks / totalChecks) × 100 − (criticalCount × 5) − (errorCount × 2)
```

Where:

- `passedChecks` = number of rules that ran and returned PASS
- `totalChecks` = number of rules that ran (passed or failed)
- `criticalCount` = number of CRITICAL findings produced
- `errorCount` = number of ERROR findings produced

The score is clamped to `[0, 100]`. A score of 100 is reachable only with zero CRITICAL and zero ERROR findings. The score is **not** a confidence interval; it is a deterministic function of the rule set and the artifact state.

The score is recomputed on every run. A new run with different rules produces a different score; this is expected. The engine does not average scores across runs.

---

## Validation Result Schema

The engine emits a `ValidationResult` object conforming to `02 - schemas/09-validation-result.json`. The full schema is in the schemas layer; the key fields are reproduced here for engine-internal reference.

```typescript
type ValidationResult = {
  metadata: {
    result_id: string;                // UUID v4
    project_id: string;
    trace_id: string;                 // Orchestrator trace correlation
    engine_version: string;           // SemVer of the Validation Engine
    rule_set_version: string;         // SemVer of the rule catalog
    generated_at: string;             // ISO 8601
    generated_by: string;             // engine + trace_id
  };
  references: {
    artifact_evaluated: ArtifactRef;
    rule_set: string;                 // Path to the rule catalog used
    upstream_results: string[];       // ValidationResult IDs the engine depended on
  };
  content: {
    status: 'PASS' | 'PASS_WITH_WARNINGS' | 'FAIL' | 'BLOCKED';
    readiness_score: number;          // 0–100
    findings: Finding[];
    remediation_actions: RemediationAction[];
    gate_decision: GateDecision;
  };
};

type Finding = {
  finding_id: string;                 // UUID v4
  rule_id: string;                    // e.g., "DOC-001"
  category: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;                    // Human-readable
  evidence: {
    file_path: string;
    line_number?: number;
    snippet: string;                  // The exact text or value that failed
  };
  remediation_hint: string;
  finding_key: string;                // Hash for deduplication across runs
};

type GateDecision = 'PROCEED' | 'PROCEED_WITH_AUDIT' | 'BLOCK' | 'HALT';
```

---

## Enforcement Actions

| Finding Severity | Engine Action | Orchestrator Behavior |
|------------------|---------------|----------------------|
| INFO | Report in result; do not block | Continue |
| WARNING | Report in result; flag for audit | Continue but require acknowledgement |
| ERROR | Report in result; block progression | Re-dispatch agent with remediation; re-validate after fix |
| CRITICAL | Halt pipeline | Escalate to `07 - prompt-contracts/11-human-review-interface-prompt.md` |

The engine does not auto-remediate. The orchestrator reads the result, decides whether to re-dispatch, escalate, or override (with human approval for CRITICAL). The engine has no "approve exception" path; that lives in the orchestrator and requires explicit human authorization per Operating Principle #10.

---

## Engine Lifecycle

The engine is itself an agent-like service with a strict lifecycle.

### Startup

1. Load the rule catalog from the registered version
2. Load the schema registry from `02 - schemas/`
3. Load the agent contract registry
4. Self-validate against `01 - governance/13-validation-engine-spec.md` (this document)
5. Emit a `engine_ready` event with engine_version and rule_set_version

### Steady State

The engine waits for assignment envelopes. On receipt:

1. Validate the envelope
2. Load the artifact
3. Select rules
4. Execute rules
5. Aggregate findings
6. Score readiness
7. Emit the `ValidationResult`

### Shutdown

On graceful shutdown, the engine emits a `engine_shutdown` event with the in-flight assignment IDs. The orchestrator re-dispatches any in-flight assignments to a fresh engine instance.

A crash mid-run is detectable by the absence of a `ValidationResult` for the in-flight assignment. The orchestrator times out after `max_runtime_ms` and re-dispatches.

---

## Performance and Throughput

The engine is a hot path in the pipeline. It must be fast.

| Metric | Target | Maximum |
|--------|--------|---------|
| Time to validate a single PRD | <2 seconds | 10 seconds |
| Time to validate a full project (all artifacts) | <30 seconds | 2 minutes |
| Rule execution parallelism | Up to 10 concurrent | Engine-configurable |
| Memory per run | <500 MB | 2 GB |
| Findings emitted per run | <1000 typical | 10000 maximum |

Rules that exceed the maximum are flagged for refactoring. A rule that takes >5 seconds for a typical artifact is split into smaller rules or moved to async batch validation.

---

## Observability

The engine emits the following metrics to the observability layer (`05 - operational-standards/09-observability-standard.md`):

- `validation.runs.total` — counter, per project, per validator
- `validation.runs.duration_ms` — histogram, per validator
- `validation.findings.total` — counter, by severity, by validator
- `validation.findings.deduped` — counter, by validator
- `validation.readiness.score` — gauge, per project, per lifecycle phase
- `validation.gate.decisions` — counter, by decision type, by project
- `validation.rules.executed` — counter, by rule_id
- `validation.rules.skipped` — counter, by reason (no_fixture, disabled, etc.)

The engine also emits structured logs at INFO, WARNING, and ERROR levels for every run. Logs include the trace_id for cross-system correlation.

---

## Failure Mode Catalog

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Rule catalog fails to load | Engine startup | Engine refuses to start; orchestrator alerted |
| Artifact fails to parse | Artifact loader | CRITICAL finding; orchestration halts |
| Rule function throws | Rule executor | ERROR finding with stack trace; other rules continue |
| Rule exceeds `max_runtime_ms` | Rule executor timeout | ERROR finding; rule marked for refactor |
| Readiness score out of bounds | Scorer | Internal error; auto-clamp + WARNING log |
| Schema registry out of date | Schema validator | CRITICAL finding; engine refuses to run validation until schema registry updated |
| Engine crash mid-run | Orchestrator timeout | Re-dispatch assignment; fresh engine instance |
| Result envelope malformed | Orchestrator parser | Engine validation: BLOCKED; re-run with fixed emitter |

---

## Cross-References

- **Rule catalog:** `01 - governance/04-validation-rules.md`
- **Validation Standard (procedure):** `05 - operational-standards/04-validation-standard.md`
- **Schema definitions:** `02 - schemas/09-validation-result.json`
- **Domain validators:** `08 - validation/01-prd-validator.md` through `08 - validation/07-production-readiness-validator.md`
- **Lifecycle model:** `01 - governance/15-project-lifecycle-model.md`
- **Agent contracts:** `01 - governance/12-agent-contract-spec.md`
- **Master orchestrator:** `07 - prompt-contracts/01-master-orchestrator-prompt.md`
- **Validation prompt:** `07 - prompt-contracts/02-validation-engine-prompt.md`
- **Operating principles:** `05 - operational-standards/01-operating-principles.md`

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2026-07-06 | Initial canonical spec defining engine architecture, rule registry, severity model, readiness formula, and lifecycle | AppArchitect Core Team |

---

*End of governance/13-validation-engine-spec.md*

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2026-07-06 | Initial canonical spec defining validation architecture, the 7 validator types, rule registry, severity levels, finding schema, and pipeline integration | AppArchitect Core Team |

---

*End of governance/13-validation-engine-spec.md*
