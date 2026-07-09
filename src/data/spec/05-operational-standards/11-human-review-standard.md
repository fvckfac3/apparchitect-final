governance/operational-standards/11-human-review-standard.md
AppArchitect Human Review Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 11 of 15
Depends On: 01-operating-principles.md, 02-agent-execution-standard.md, 04-validation-standard.md, 12-release-standard.md


Purpose
Defines when human review is required, what types of review exist, who is authorized to review, how review is conducted, and how review decisions are recorded. This standard is the implementation of Operating Principle #10 (Human Authority).
AI generates, evaluates, and proposes. Humans approve, override, and accept responsibility. This is constitutional, not procedural.


Scope
Applies to:
• All PRD approvals
• All governance and operational standard approvals
• All schema approvals
• All release approvals
• All conflict resolutions
• All waiver decisions
• All cross-tier architectural decisions
Out of scope:
• Routine operational approvals (handled by automation)
• End-user feedback (analytics layer)
• Internal team communications


Review Types
Four review types, each with defined scope and authority.

Type 1 — Technical Review
Purpose: Validate technical accuracy, feasibility, and implementation completeness.
Reviewer: Designated technical lead (architect, senior engineer, or domain expert)
Required For:
• All Technical Architecture PRDs
• All Schema definitions
• All agent PRD updates
• All MAJOR version bumps of operational standards
SLA: 3 business days
Output: Technical sign-off (approved | changes_requested | rejected)

Type 2 — Product Review
Purpose: Validate product/market fit, user value, and feature completeness.
Reviewer: Product Lead, Product Manager, or Founder
Required For:
• All Core Systems PRDs
• All user-facing features
• All MAJOR version bumps affecting product behavior
SLA: 5 business days
Output: Product sign-off (approved | changes_requested | rejected)

Type 3 — Governance Review
Purpose: Validate compliance with operating principles, governance, and operational standards.
Reviewer: Governance Lead or designated governance council member
Required For:
• All governance document creation/updates
• All operating principle changes
• All conflict resolutions involving governance
• All waivers for principle violations
SLA: 5 business days
Output: Governance sign-off (approved | changes_requested | rejected)

Type 4 — Release Review
Purpose: Validate release readiness, rollback plan, and risk acceptance.
Reviewer: Release Manager + designated release approver (typically engineering lead)
Required For:
• All production releases
• All customer-facing changes
• All infrastructure changes
SLA: 1 business day
Output: Release sign-off (approved | hold | rejected)

Human Review Thresholds
Human review is automatically required when ANY of the following are true:

Schema Thresholds
• New required field added to Master Project Schema
• Field type changed
• Field removed
• Enum values changed
• Schema version is MAJOR bump

Validation Thresholds
• Validation rule added that changes PASS/FAIL outcomes
• Validation stage added or removed
• Validation rule loosened (becomes easier to pass)

Architecture Thresholds
• Cross-tier architectural change
• New external integration added
• Authentication or authorization model changed
• Data model or storage changed
• Performance or scalability target changed

Release Thresholds
• First production release
• Release affects > 25% of users
• Release is irreversible or hard to roll back
• Release is on a Friday or holiday
• Release includes security fix (mandatory review)
• Release includes data migration (mandatory review)

Conflict Thresholds
• Conflict requires violating an operating principle
• Conflict cannot be auto-resolved
• Conflict involves governance documents
• Conflict involves a MAJOR version boundary

Quality Thresholds
• Document quality score below threshold
• Quality regression detected
• Defect escaped to production

Other Thresholds
• Any change to an operating principle
• Any change to security controls
• Any change to SLOs
• Any change to data retention policy

Authorization Matrix
| Review Type | Required Role | Backup Role |
|---|---|---|
| Technical | Architect | Senior Engineer (domain) |
| Product | Product Lead | Founder |
| Governance | Governance Lead | Governance Council Member |
| Release | Release Manager | Engineering Director |
| Security | CISO | Security Council Member |
| Schema | Schema Owner | Architect |
| Conflict (Principle) | Governance Council | Executive Sponsor |
| Waiver | Document Owner + Domain Lead | Executive Sponsor |

Review Process
Standard Review Cycle
1. Author (agent or human) submits artifact for review

2. Reviewer is notified via standard channel

3. Reviewer examines artifact against review checklist

4. Reviewer issues decision with rationale
5. Decision is recorded with reviewer ID + timestamp
6. If approved: artifact proceeds to next stage
7. If changes requested: artifact returns to author with required_changes list
8. If rejected: artifact is archived with rejection rationale

Maximum review cycles: 3
After 3 cycles, the artifact is escalated to executive review with a full history.

Review SLAs
| Review Type | Target | Maximum |
|---|---|---|
| Technical | 2 days | 3 days |
| Product | 3 days | 5 days |
| Governance | 3 days | 5 days |
| Release | 4 hours | 1 day |
| Security | 1 day | 2 days |

SLAs are business days for non-urgent reviews, calendar hours for urgent.

SLA Breach Handling
If a review SLA is breached:

1. Reviewer is reminded
2. After 2x SLA: Reviewer's manager is notified
3. After 3x SLA: Artifact is reassigned to backup role
4. After reassignment: Original reviewer's record is flagged for capacity review

Override Authority
Any review decision can be overridden by a higher-authority role.
Override Requirements:

1. Overriding role is documented

2. Override rationale is recorded
3. Original reviewer's dissent is preserved

4. Override is reviewed in the next governance cycle
5. Pattern of overrides (> 2 per quarter by same role) is reviewed for systemic issues

Decision Recording
Every review decision is recorded:
decision:
  decision_id: string (UUID v4)
  artifact_id: string
  artifact_version: string
  review_type: enum (technical, product, governance, release, security, schema)
  reviewer_id: string
  reviewer_role: string
  decision: enum (approved, changes_requested, rejected, hold)
  rationale: string
  conditions: array of strings (for conditional approvals)
  required_changes: array of strings (for changes_requested)
  rejection_reasons: array of strings (for rejected)
  reviewed_at: ISO 8601 timestamp
  due_at: ISO 8601 timestamp
  artifacts_reviewed: array of artifact_ids
  evidence: array of {evidence_type, location, value}
  override_of: decision_id | null
  signature: string

Waivers
Under exceptional circumstances, a required review can be waived.
Waiver Requirements (all must be met):

1. Written justification with specific business context

2. Risk assessment with mitigation plan

3. Approval from artifact owner

4. Approval from one role higher than the required reviewer
5. Expiration date (max 30 days)
6. Post-hoc review scheduled

Waivers are logged, tracked, and reviewed quarterly. Repeat waivers for the same artifact type are a governance concern.

Emergency Provisions
In genuine emergencies (active security incident, production outage), review requirements can be temporarily suspended by:
• Incident Commander (for security/availability incidents)
• Release Manager + On-call Engineer (for hotfixes)

Post-hoc review is mandatory within 5 business days. The waiver log captures the suspension and post-hoc review.


Cross-References
• 01-operating-principles.md — Principle 10
• 04-validation-standard.md — Stage 7 release validation
• 05-conflict-resolution-standard.md — human resolution paths
• 12-release-standard.md — release review
• governance/05-agent-orchestration-map.md — agent ownership informs reviewer assignment


Ownership
Component: Human Review Standard
Owner: Governance Lead
Reviewer: Executive Sponsor + Governance Council
Review Cadence: Every MAJOR version bump, or on any review SLA systemic breach


---

End of File
