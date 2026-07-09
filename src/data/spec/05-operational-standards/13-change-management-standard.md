governance/operational-standards/13-change-management-standard.md
AppArchitect Change Management Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 13 of 15
Depends On: 01-operating-principles.md, 06-versioning-standard.md, 07-artifact-management-standard.md, 11-human-review-standard.md, 12-release-standard.md


Purpose
Defines the change request lifecycle, change types, impact analysis, approval paths, implementation procedures, and audit requirements for all changes to the AppArchitect system. This standard is the implementation of Operating Principle #7 (Artifact Traceability).
Every change has a story. The change management system is that story's permanent record.


Scope
Applies to:
• All changes to governance documents
• All changes to operational standards
• All changes to schemas
• All changes to agent PRDs
• All changes to release processes
• All changes to security controls
• All changes to data retention policies
Out of scope:
• Routine operational changes (reboots, scaling) — logged in observability only
• End-user application changes — governed by generated app's change spec
• Dependency updates within PATCH level

Change Types
Five change types, each with defined risk profile and approval requirements.

Type 1 — Documentation Change
Definition: Change to a document that does not affect behavior.
Examples: Typo fix, clarification, broken cross-reference, example update
Risk: Very Low
Approval: Document owner
SLA: 1 business day
Validation: Documentation quality check

Type 2 — Configuration Change
Definition: Change to settings that affect behavior but not structure.
Examples: SLO threshold, retention period, sampling rate, feature flag
Risk: Low
Approval: Domain owner (e.g., SRE Lead for SLOs, Security Lead for security configs)
SLA: 3 business days
Validation: Configuration validation, dry-run if possible

Type 3 — Schema Change
Definition: Change to a JSON Schema definition.
Examples: Add optional field, add enum value, add validation rule
Risk: Medium
Approval: Schema Owner + Technical Lead
SLA: 10 business days
Validation: Full schema validation suite, downstream impact analysis
Version Bump: Per 06-versioning-standard.md

Type 4 — Process Change
Definition: Change to a workflow, lifecycle, or operational procedure.
Examples: Add validation stage, change release cadence, change review SLA
Risk: Medium-High
Approval: Process owner + Governance Lead
SLA: 15 business days
Validation: Process simulation, stakeholder review
Version Bump: Per 06-versioning-standard.md

Type 5 — Principle Change
Definition: Change to an operating principle or a system-wide invariant.
Examples: Add new principle, modify existing principle, change authority order
Risk: Critical
Approval: Governance Council + Executive Sponsor
SLA: 30 business days
Validation: Full system impact analysis, all-stakeholder review
Version Bump: Per 06-versioning-standard.md (MAJOR)

Change Request Lifecycle
Six-phase lifecycle. Each phase has defined entry/exit criteria.

Phase 1 — Request
Definition: A change need is identified and formally requested.
Entry: Change need identified by anyone (agent, human, customer, incident).
Activities:
• Create change request with: title, description, rationale, type, urgency
• Initial severity assessment
• Assign change owner
• Record in change register
Exit Criteria: Change request created with all required fields.
Output: Change request (aa-cr-{id})

Phase 2 — Assess
Definition: The change is analyzed for impact, risk, and required resources.
Entry: Change request created.
Activities:
• Impact analysis (what is affected)
• Risk analysis (what could go wrong)
• Resource estimation (effort, cost, time)
• Dependency analysis (other changes needed)
• Backout plan development
• Validation strategy definition
Exit Criteria: Complete impact analysis, risk assessment, backout plan, validation strategy.
Output: Change impact assessment

Phase 3 — Approve
Definition: The change is reviewed and approved by appropriate authorities.
Entry: Impact assessment complete.
Activities:
• Route to appropriate approvers per change type
• CAB (Change Advisory Board) review for high-risk changes
• Address approver concerns
• Obtain all required approvals
Exit Criteria: All required approvals received, no unresolved concerns.
Output: Approved change request

Phase 4 — Implement
Definition: The change is implemented in a controlled manner.
Entry: Change approved.
Activities:
• Implement in development
• Run validation
• Deploy to staging
• Run integration tests
• Deploy to production (per release standard)
• Execute canary rollout
• Confirm successful implementation
Exit Criteria: Change deployed to production, validation passed, no rollback needed.
Output: Implemented change with deployment record

Phase 5 — Validate
Definition: The change is confirmed to achieve its intended effect.
Entry: Change implemented.
Activities:
• Confirm intended effect is achieved
• Confirm no unintended side effects
• Run regression tests
• Monitor key metrics
• Collect user feedback (if applicable)
Exit Criteria: Intended effect confirmed, no regressions, metrics stable.
Output: Change validation report

Phase 6 — Close
Definition: The change is formally closed and lessons are captured.
Entry: Change validated.
Activities:
• Update documentation
• Update training materials
• Communicate completion to stakeholders
• Capture lessons learned
• Archive change artifacts
• Update change history
Exit Criteria: Change fully closed, documentation updated, stakeholders informed.
Output: Closed change request


Impact Analysis
Every change requires an impact analysis:
impact:
  affected_artifacts: array of artifact_ids
  affected_users: string (count, segment)
  affected_dependencies: array of artifact_ids
  performance_impact: enum (none, low, medium, high)
  security_impact: enum (none, low, medium, high)
  data_impact: enum (none, low, medium, high)
  compatibility_impact: enum (none, low, medium, high)
  user_experience_impact: enum (none, low, medium, high)
  rollback_complexity: enum (simple, moderate, complex, impossible)
  estimated_effort: string (person-days)
  estimated_cost: string (USD)
  dependencies: array of change_request_ids that must complete first
  conflicts: array of change_request_ids that conflict
  regulatory_implications: array of strings

Risk Assessment
Every change requires a risk assessment:
risk:
  overall_risk: enum (very_low, low, medium, high, critical)
  risk_score: integer (1-25)
  risk_factors: array of {factor, likelihood, impact, mitigation}
  residual_risk: enum (very_low, low, medium, high, critical)
  risk_owner: string
  review_frequency: string
  contingency_plans: array of {scenario, response}

Risk Matrix:
Likelihood: Very Low (1), Low (2), Medium (3), High (4), Very High (5)
Impact: Negligible (1), Minor (2), Moderate (3), Major (4), Severe (5)
Score = Likelihood × Impact
• 1-4: Very Low
• 5-9: Low
• 10-14: Medium
• 15-19: High
• 20-25: Critical

Change Advisory Board (CAB)
For high-risk changes, a CAB review is required.
CAB Composition:
• Release Manager (chair)
• Engineering Lead
• Operations Lead
• Security Lead (for security-impacting changes)
• Product Lead (for customer-impacting changes)
• Governance Lead (for governance-impacting changes)
CAB Cadence: Weekly, or ad-hoc for emergencies
CAB Output: Decision (approved | approved_with_conditions | deferred | rejected)

Audit Logs
Every change produces an audit log:
audit:
  change_id: string
  change_type: enum
  requestor: string
  approvers: array of {user_id, role, decision, timestamp}
  implementation_steps: array of {step, actor, timestamp, outcome}
  validations_run: array of {validation_id, result}
  rollback_executions: array of {timestamp, reason, actor}
  communications_sent: array of {channel, timestamp, content_link}
  lessons_learned: string
  related_incidents: array of incident_ids
  related_changes: array of change_ids

Audit logs are:
• Append-only (immutable)
• Retained for 7 years
• Encrypted at rest
• Searchable for audit purposes
• Replicated to offline storage quarterly

Emergency Changes
For emergency changes (active security incident, production outage):
• CAB review can be deferred
• Incident Commander has approval authority
• Post-hoc review is mandatory within 5 business days
• Full audit log is still required
• Lessons learned are captured in post-incident report


Cross-References
• 01-operating-principles.md — Principle 7
• 06-versioning-standard.md — version semantics for changes
• 07-artifact-management-standard.md — artifact lifecycle integration
• 10-failure-recovery-standard.md — change failures trigger incidents
• 11-human-review-standard.md — approval integration
• 12-release-standard.md — release lifecycle for change deployment
• 14-continuous-learning-standard.md — lessons learned loop


Ownership
Component: Change Management Standard
Owner: Change Management Lead
Reviewer: Governance Council + Release Manager
Review Cadence: Every MAJOR version bump, or on any change-related incident


---

End of File
