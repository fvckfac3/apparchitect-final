governance/operational-standards/05-conflict-resolution-standard.md
AppArchitect Conflict Resolution Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 05 of 15
Depends On: 01-operating-principles.md, 04-validation-standard.md


Purpose
Defines the types of conflicts that can occur within the AppArchitect system, the authority order for resolution, the procedures for resolution, and the escalation paths when resolution is not automatable. This standard is the implementation of Operating Principle #6 (Governance Supremacy).
Conflicts are inevitable in a multi-agent system. The cost of conflict is determined by how quickly and consistently it is resolved.


Scope
Applies to:
• Conflicts between two or more agents' outputs
• Conflicts between an agent's output and the Master Project Schema
• Conflicts between two governance documents
• Conflicts between two versions of the same document
• Conflicts between an agent's output and a human review decision
• Conflicts between an AppArchitect artifact and an external system contract
Out of scope:
• Conflicts resolved within a single agent's reasoning
• Conflicts in user feedback (analytics layer)
• Conflicts in brand/visual decisions (brand spec)


Conflict Types
Six types of conflicts are recognized in AppArchitect.

Type 1 — Requirement Conflict
Definition: Two or more required behaviors, features, or constraints cannot be simultaneously satisfied.
Example: "All data must be encrypted at rest" conflicts with "Analytics queries must run on raw data."
Detection: Stage 6 Cross-Artifact Validation (see 04-validation-standard.md) or explicit agent report.

Type 2 — Schema Conflict
Definition: An artifact's structure contradicts the JSON Schema definition it claims to conform to.
Example: A PRD document has a "permissions" section that does not match the permissions schema in schemas/01-project-schema.json.
Detection: Stage 2 Schema Validation.

Type 3 — Architecture Conflict
Definition: A proposed architectural decision contradicts a higher-tier architecture decision.
Example: An engineer proposes using PostgreSQL, but the Master Architecture specifies Supabase (Postgres under the hood) with specific RLS patterns.
Detection: Stage 4 Governance Validation or Architecture Review Agent.

Type 4 — Version Conflict
Definition: Two versions of the same document exist with overlapping validity windows.
Example: PRD v1.2 is Approved but PRD v1.3 is also marked Approved.
Detection: Versioning Audit (06-versioning-standard.md) or Orchestrator routing logic.

Type 5 — Agent Conflict
Definition: Two agents have produced outputs that cannot be reconciled.
Example: The Brand Director and the UX Designer produce inconsistent tone guidelines.
Detection: Stage 6 Cross-Artifact Validation or peer agent report.

Type 6 — Governance Conflict
Definition: A governance document contradicts another governance document.
Example: Two governance documents assign different owners to the same artifact type.
Detection: Governance Audit or explicit human report.


Authority Order
The single most important rule in conflict resolution. When in doubt, this order determines the winner.
Authority Order (highest to lowest authority):
1. Operating Principles (01-operating-principles.md)

2. Governance documents
3. Operational Standards (this layer)

4. Architecture decisions

5. PRD documents

6. Schemas

7. Workflows

8. Agent outputs
A higher-tier artifact always wins over a lower-tier artifact. If the conflict is between two artifacts of the same tier, recency + version semantics apply (newer MAJOR version wins, then MINOR, then PATCH).

Resolution Procedures

Auto-Resolution (no human required)
Triggered when:
• Conflict type is clear
• Authority order produces an unambiguous winner
• No human review threshold (see 11-human-review-standard.md) is exceeded
• No MAJOR-version implication

Procedure:

1. Detect conflict and classify type

2. Determine winner via authority order

3. Mark loser as superseded

4. Trigger regeneration of loser if needed
5. Log resolution in conflict register

Semi-Auto Resolution (orchestrator decides)
Triggered when:
• Conflict is between two agent outputs of same tier
• Authority order does not break the tie
• No human review threshold exceeded

Procedure:

1. Detect conflict and classify type
2. Orchestrator requests clarification from both producing agents
3. Orchestrator applies authority order + recency

4. Orchestrator issues resolution decision

5. Decision logged with full reasoning trace
6. If either agent disputes, escalate to human lead

Human Resolution (required)
Triggered when:
• Conflict involves a governance document
• Conflict involves a MAJOR version boundary
• Conflict involves a principle violation
• Orchestrator cannot break a tie
• Any agent explicitly requests human review

Procedure:

1. Detect conflict and classify type
2. Produce a conflict brief (one page: what conflicts, candidates, options, recommendation)
3. Route to the appropriate human reviewer (per conflict type)

4. Human reviewer issues resolution decision
5. Decision is recorded with reviewer ID + rationale
6. Resolution may produce a new governance document or operating principle update

Conflict Register
Every conflict (auto, semi-auto, or human) is recorded:
register_entry:
  conflict_id: string (UUID v4)
  conflict_type: enum (requirement, schema, architecture, version, agent, governance)
  detected_at: ISO 8601 timestamp
  detected_by: agent_id or human_id
  conflicting_artifacts: array of {artifact_id, version, owner}
  resolution_path: enum (auto, semi_auto, human)
  resolution_decision: string
  resolution_rationale: string
  resolved_at: ISO 8601 timestamp
  resolved_by: agent_id or human_id
  affected_downstream: array of artifact_ids
  lessons_learned: string | null

The conflict register is append-only and is the source for pattern analysis (see 14-continuous-learning-standard.md).

Escalation Paths
| Conflict Type | Auto-Resolution | Semi-Auto | Human Required |
|---|---|---|---|
| Requirement | No (always semi-auto or human) | Orchestrator | Product Lead |
| Schema | Yes (if authority order clear) | Schema Owner | Schema Lead |
| Architecture | No (always human) | System Architect | Architecture Council |
| Version | Yes (per versioning rules) | Versioning Owner | Release Manager |
| Agent | Yes (if same tier) | Orchestrator | Agent Platform Lead |
| Governance | No (never auto) | N/A | Governance Council |

Principle Violations
Any conflict that requires violating an Operating Principle (01-operating-principles.md) is escalated immediately to the Governance Council. Principle violations cannot be auto-resolved under any circumstance.


Cross-References
• 01-operating-principles.md — Principle 6 (Governance Supremacy)
• 04-validation-standard.md — Stage 6 Cross-Artifact Validation
• 06-versioning-standard.md — version conflict resolution
• 11-human-review-standard.md — human review thresholds
• 14-continuous-learning-standard.md — lessons learned flow
• governance/05-agent-orchestration-map.md — agent ownership boundaries


Ownership
Component: Conflict Resolution Standard
Owner: Governance Lead
Reviewer: System Architect + Operations Lead
Review Cadence: Every MAJOR version bump, or on any unresolved conflict incident


---

End of File
