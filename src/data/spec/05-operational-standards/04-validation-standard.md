governance/operational-standards/04-validation-standard.md
AppArchitect Validation Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 04 of 15
Depends On: 01-operating-principles.md, 02-agent-execution-standard.md, 03-document-quality-standard.md


Purpose
Defines the validation hierarchy, validation states, validation rules, escalation paths, and audit requirements for every artifact in the AppArchitect system. This standard is the implementation of Operating Principle #5 (Validation Before Progression).
No artifact advances to the next lifecycle phase without passing all applicable validation gates.


Scope
Applies to:
• All generated artifacts (PRDs, schemas, validation results, exports, builds)
• All agent outputs
• All human review decisions
• All version transitions
Out of scope:
• Source code validation (separate standards)
• Brand asset validation (brand spec)
• User feedback validation (analytics layer)


Validation Hierarchy
Validations run in 7 ordered stages. Each stage must produce a PASS or WARNING state before the next stage runs. A FAIL or BLOCKED at any stage halts the pipeline immediately.

Stage 1 — Structural Validation
Purpose: Confirm the artifact is well-formed at the syntax level.
Checks:
• Required file format (markdown, JSON, YAML)
• Valid encoding (UTF-8)
• Valid markdown structure (no broken headers, no unclosed code blocks)
• Valid JSON/YAML where applicable
On FAIL: Return structural_fixes_required; artifact is not parseable.

Stage 2 — Schema Validation
Purpose: Confirm the artifact conforms to its declared JSON Schema.
Checks:
• All required fields present
• All field types match schema
• All enum values valid
• All format constraints satisfied (e.g., UUID, ISO 8601)
On FAIL: Return schema_violations[]; each violation must be fixed before retry.

Stage 3 — Dependency Validation
Purpose: Confirm all referenced upstream artifacts exist and are in valid state.
Checks:
• All artifact_id references resolve
• All schema version references are current
• All cross-document references resolve
• No circular dependencies (per Document Dependency Matrix)
On FAIL: Return dependency_blockers[]; each blocker must be resolved.

Stage 4 — Governance Validation
Purpose: Confirm the artifact complies with all relevant governance documents.
Checks:
• Operating Principles compliance (01-operating-principles.md)
• Tier-appropriate governance rules
• No contradiction with higher-tier governance docs
On FAIL: Return governance_violations[]; principle violations cannot be waived by the agent.

Stage 5 — Quality Validation
Purpose: Score the artifact against the 6 quality dimensions (see 03-document-quality-standard.md).
Checks:
• Weighted quality score ≥ threshold for artifact type
• No auto-FAIL trigger activated
On FAIL: Return quality_score + dimension_scores; revision required.

Stage 6 — Cross-Artifact Validation
Purpose: Confirm the artifact is consistent with peer artifacts and the Master Project Schema.
Checks:
• No contradiction with Master Project Schema
• No contradiction with peer artifacts in same lifecycle phase
• Terminology consistent with system glossary
On FAIL: Return cross_artifact_conflicts[]; orchestrator resolves or escalates.

Stage 7 — Release Validation
Purpose: Final gate before the artifact is released for consumption.
Checks:
• All previous stages PASS
• All human review requirements met (see 11-human-review-standard.md)
• Version incremented correctly
• Trace envelope complete
• No active waivers
On FAIL: Release is BLOCKED; full re-run required after fix.


Validation States
Every validation produces one of 4 states:
1. PASS — All checks within stage succeeded. Proceed to next stage.
2. WARNING — All checks succeeded but with documented concerns. Proceed with concerns logged.
3. FAIL — One or more checks failed. Halts pipeline. Produces fix list.
4. BLOCKED — Validation cannot run due to upstream blocker (e.g., missing dependency). Halts pipeline. Produces dependency list.

Validation Result Envelope
Every validation produces a typed result:
result:
  validation_id: string (UUID v4)
  artifact_id: string
  artifact_version: string
  stage: integer (1-7)
  state: enum (PASS, WARNING, FAIL, BLOCKED)
  started_at: ISO 8601 timestamp
  completed_at: ISO 8601 timestamp
  duration_ms: integer
  checks_run: integer
  checks_passed: integer
  checks_failed: integer
  checks_warned: integer
  failures: array of {check_id, severity, message, evidence, suggested_fix}
  warnings: array of {check_id, message, rationale}
  evidence: array of {evidence_type, location, value}
  validator_version: string
  validator_signature: string

Validation Rules
Rule 1: Stages run in order. No stage may run before all prior stages have produced PASS or WARNING.
Rule 2: A FAIL halts progression immediately. No bypass is permitted.
Rule 3: A BLOCKED must be resolved by the blocking artifact, not the current artifact.
Rule 4: WARNINGS do not halt progression but are logged in the trace envelope.
Rule 5: Validation results are immutable once produced. Corrections require a new validation run.
Rule 6: Validation runs are recorded in the artifact's trace history (see 02-agent-execution-standard.md Section 6).

Escalation Paths
| Stage | Result | Escalation Target |
|---|---|---|
| 1 — Structural | FAIL | Producing agent (revision) |
| 2 — Schema | FAIL | Producing agent + Schema owner |
| 3 — Dependency | FAIL | Orchestrator (resolve dependency) |
| 4 — Governance | FAIL | Human Governance Lead (waiver decision) |
| 5 — Quality | FAIL | Producing agent (revision, max 3 cycles) |
| 6 — Cross-Artifact | FAIL | Orchestrator (resolution) |
| 7 — Release | FAIL | Human Release Manager |

Audit Requirements
Every validation result is:
• Stored in the artifact's validation history
• Included in the artifact's release manifest
• Available for audit for the artifact's lifetime + 7 years
• Reproducible from the same input (deterministic validation)


Cross-References
• 01-operating-principles.md — Principle 5
• 02-agent-execution-standard.md — self-validation in lifecycle Step 6
• 03-document-quality-standard.md — Stage 5 scoring
• 05-conflict-resolution-standard.md — Stage 6 conflict handling
• 11-human-review-standard.md — Stage 7 human review
• 12-release-standard.md — release gate usage
• 13-validation-engine-spec.md — implementation specification


Ownership
Component: Validation Standard
Owner: Validation Engine Lead
Reviewer: System Architect + Quality Lead
Review Cadence: Every MAJOR version bump, or on any false-negative validation incident


---

End of File
