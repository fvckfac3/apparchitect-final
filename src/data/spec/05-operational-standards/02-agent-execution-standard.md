governance/operational-standards/02-agent-execution-standard.md
AppArchitect Agent Execution Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 02 of 15
Depends On: 01-operating-principles.md


Purpose
Defines the canonical execution lifecycle, delegation rules, scope enforcement, error handling, validation, and completion criteria for every agent in the 19-agent canonical roster.
This standard is the procedural implementation of Operating Principles #5 (Validation Before Progression), #7 (Artifact Traceability), #8 (Separation of Responsibility), and #9 (Fail Loudly).


Scope
Applies to:
• All 19 canonical agents (orchestrator + 18 functional)
• Agent-to-agent handoffs
• Agent-to-tool invocations
• Agent-to-human escalations
Out of scope:
• Agent internal reasoning (governed by agent PRD)
• Tool implementation details (governed by tool spec)
• User-facing prompts (governed by 11-human-review-standard.md)

Section 1: Execution Lifecycle
Every agent invocation follows this 8-step lifecycle. Skipping a step is a scope violation.

Step 1 — Receive Assignment
• Agent receives a typed assignment envelope from the Orchestrator or a peer agent.
• Envelope must contain: assignment_id, requesting_agent_id, target_schema_sections, deadline, priority, context_bundle.
• Agent validates envelope completeness; incomplete envelopes are rejected with BLOCKED status.

Step 2 — Validate Inputs
• Agent confirms it has read access to all target_schema_sections referenced in the assignment.
• Agent confirms all referenced upstream artifacts exist and are in a valid state.
• Missing inputs are escalated as BLOCKED with required_artifacts list.

Step 3 — Analyze Dependencies
• Agent computes its dependency closure using the Document Dependency Matrix (governance/02-document-dependency-matrix.md).
• If a dependency is unsatisfied, the agent halts and returns a dependency_blocked response.

Step 4 — Generate Plan
• Agent produces a step-by-step plan of work to be done, including:
  - Sub-artifacts to produce
  - Validation checks to run
  - Tools to invoke
  - Estimated token cost
• Plan is logged to the trace envelope.

Step 5 — Execute Work
• Agent executes the plan in the prescribed order.
• All side effects are recorded (file writes, tool calls, external API requests).
• Token usage is tracked and reported in the trace.

Step 6 — Validate Output
• Agent runs self-validation against the relevant quality dimensions (see 03-document-quality-standard.md).
• Self-validation is not the final gate — it is a pre-flight check.
• Failed self-validation triggers a re-execution attempt (max 2 retries) before escalation.

Step 7 — Record Traceability
• Agent produces a complete trace envelope (see Section 6) for the entire execution.
• Trace is appended to the artifact's metadata.
• Trace is signed with the agent's versioned identifier.

Step 8 — Return Deliverable
• Agent returns the deliverable + trace + validation results + assumptions.
• Return is typed (success, partial_success, failed, blocked).
• Orchestrator verifies the return envelope before routing the deliverable downstream.

Section 2: Delegation Rules
Agents may delegate sub-tasks to other agents under these conditions:
1. The sub-task is explicitly in the delegatee's scope (per the agent's PRD).
2. The orchestrator has approved the delegation graph (no cycles, no diamond dependencies).
3. The delegatee's PRD version is compatible (no breaking version mismatches).
4. The delegating agent remains accountable for the delegated work — it cannot delegate away responsibility.
5. All delegations are logged in the trace envelope with a delegation_chain array.

Forbidden Delegations:
• Cross-tier delegations (e.g., a Specialist delegating to a Core Pipeline agent)
• Same-scope delegations that bypass the Orchestrator
• Delegations that exceed the delegatee's current scope version

Section 3: Scope Enforcement
Each agent has a defined scope, expressed as:
scope:
  can_produce: [list of artifact types]
  can_consume: [list of schema sections]
  can_invoke_tools: [list of tool IDs]
  can_request_human_review: true|false
  can_modify_master_schema: true|false

Scope violations:
• Type 1 (soft): Agent attempts a sub-task outside its scope but within a related tier. Logged as warning, requires human review acknowledgment.
• Type 2 (hard): Agent attempts to produce an artifact type it does not own. Halts immediately, returns scope_violation error.
• Type 3 (critical): Agent attempts to modify the Master Project Schema without orchestrator approval. Triggers agent quarantine.

Section 4: Error Handling
Errors are classified into 5 levels:
1. TRANSIENT — retry automatically with exponential backoff (max 3 retries)
2. RECOVERABLE — re-execute from the last successful checkpoint
3. INPUT_ERROR — escalate to requesting agent with input_correction_required
4. SCOPE_ERROR — escalate to orchestrator with scope_violation
5. CRITICAL — halt all downstream work, alert human reviewers

Every error produces:
• error_type (one of the 5 above)
• error_message (human-readable)
• error_context (full state at time of error)
• error_recovery_attempts (array of recovery actions tried)
• recommended_action (what should happen next)

Section 5: Validation
Self-validation is mandatory and runs at Step 6 of the lifecycle.
Self-validation checks:
• All required fields present
• All cross-references resolve
• Schema conformance (JSON Schema validation)
• Quality dimensions (see 03-document-quality-standard.md)
• Token budget not exceeded
Final validation runs at the artifact level (see 04-validation-standard.md) and is not the agent's responsibility.

Section 6: Traceability Envelope
Every agent execution produces a trace envelope:
envelope:
  trace_id: string (UUID v4)
  agent_id: string
  agent_version: string
  assignment_id: string
  requesting_agent_id: string
  lifecycle_steps: array of {step_name, timestamp, duration_ms, outcome}
  inputs_consumed: array of {artifact_id, version, section_refs}
  outputs_produced: array of {artifact_id, version, content_hash}
  tools_invoked: array of {tool_id, parameters_hash, result_hash}
  delegations: array of {delegatee_id, sub_assignment_id, outcome}
  errors: array of error objects
  assumptions: array of {assumption_id, statement, source, valid_until}
  token_usage: {input_tokens, output_tokens, total}
  validation_results: array of {check_id, result, evidence}
  signature: string (agent version + content hash, signed)

Trace envelopes are immutable once signed.

Section 7: Completion Criteria
An agent execution is "complete" only when ALL of the following are true:
1. All lifecycle steps reached their terminal state successfully.
2. All self-validation checks passed.
3. Trace envelope is signed and recorded.
4. Deliverable return envelope is typed success or partial_success.
5. No critical (Level 5) errors are unresolved.
6. All assumptions are within their validity period.
7. Token budget is within limits.
Partial completions are allowed only with explicit partial_success typing and a list of explicitly_unresolved items.


Cross-References
• 01-operating-principles.md — Principles 5, 7, 8, 9
• 03-document-quality-standard.md — self-validation quality dimensions
• 04-validation-standard.md — final validation hierarchy
• 05-conflict-resolution-standard.md — conflict handling between agents
• 11-human-review-standard.md — escalation path
• governance/05-agent-orchestration-map.md — delegation graph topology


Ownership
Component: Agent Execution Standard
Owner: Agent Platform Lead
Reviewer: System Architect + Operations Lead
Review Cadence: Every MAJOR version bump, or on any cross-agent incident


---

End of File
