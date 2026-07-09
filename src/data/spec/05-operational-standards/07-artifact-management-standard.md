governance/operational-standards/07-artifact-management-standard.md
AppArchitect Artifact Management Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 07 of 15
Depends On: 01-operating-principles.md, 04-validation-standard.md, 06-versioning-standard.md


Purpose
Defines the artifact lifecycle, artifact identification, ownership, dependencies, and storage rules for every artifact in the AppArchitect system. This standard is the implementation of Operating Principle #7 (Artifact Traceability).
Every artifact is a first-class object with a unique identity, a complete history, and a defined owner. Orphaned artifacts are bugs.


Scope
Applies to:
• All PRD documents
• All governance and operational standard documents
• All schemas
• All agent PRDs
• All validation results
• All export manifests and build handoffs
• All released artifacts
Out of scope:
• Source code artifacts (governed by code standards)
• Runtime data (governed by data lifecycle)
• External system artifacts

Artifact Lifecycle
Seven-phase lifecycle. Each phase has defined entry/exit criteria.

Phase 1 — Create
Entry: An agent or human initiates a new artifact with a typed intent.
Activities:
• Generate artifact_id (UUID v4, never reused)
• Assign artifact_type (from canonical list)
• Set initial state = Draft
• Define artifact_owner
• Define initial dependencies
• Record creation in artifact register
Exit Criteria: artifact_id assigned, owner set, dependencies declared, registration complete.
Output: New artifact in Draft state with empty content.

Phase 2 — Validate
Entry: Artifact content has been written.
Activities:
• Run all 7 validation stages (see 04-validation-standard.md)
• Record validation results
• Address all FAILs and BLOCKEDs
Exit Criteria: All validation stages PASS or WARNING.
Output: Validated artifact ready for review.

Phase 3 — Approve
Entry: Artifact has passed all validations.
Activities:
• Route to designated human reviewers per artifact_type
• Collect approvals (minimum count varies by artifact_type)
• Record approver IDs + timestamps
Exit Criteria: Required number of approvals received from authorized roles.
Output: Approved artifact with full approval record.

Phase 4 — Release
Entry: Artifact is Approved.
Activities:
• Increment version per 06-versioning-standard.md
• Publish to artifact registry
• Generate release manifest entry
• Update cross-references in dependent artifacts
• Notify consumers
Exit Criteria: Artifact is in Released state, version is set, consumers notified.
Output: Released artifact in production.

Phase 5 — Maintain
Entry: Artifact is Released and in active use.
Activities:
• Process change requests (see 13-change-management-standard.md)
• Apply patches and minor versions
• Update validation when underlying schemas change
• Track usage and feedback
Exit Criteria: Triggered by change request, deprecation, or incident.
Output: New artifact versions or hotfixes.

Phase 6 — Deprecate
Entry: Newer version released, transition window begins.
Activities:
• Add deprecation notice
• Set valid_until date
• Publish migration guide
• Notify remaining consumers
Exit Criteria: All consumers migrated or transition window expired.
Output: Deprecated artifact with migration guide.

Phase 7 — Archive
Entry: Transition window complete.
Activities:
• Move to read-only storage
• Update routing rules to remove from active routing
• Preserve in artifact history
Exit Criteria: Artifact in Archived state, read-only, retained per retention policy.
Output: Archived artifact.

Artifact Identification
Every artifact receives a unique, immutable identifier.
Format: aa-{type}-{scope}-{slug}-{8char_hash}
Example: aa-prd-core-systems-couple-profiling-3a7b9c2d
Components:
• aa — AppArchitect prefix (distinguishes from external artifact systems)
• {type} — canonical artifact type
• {scope} — owning agent scope or governance layer
• {slug} — lowercase-kebab-case name
• {8char_hash} — first 8 chars of UUID v4

Artifact IDs are immutable. A new ID is generated if content is split, merged, or restructured. Versioning captures evolution; IDs capture identity.

Canonical Artifact Types
prd — Product Requirements Document
governance — Governance document
operational-standard — Operational standard
schema — JSON Schema
agent-prd — Agent PRD
validation-result — Validation result envelope
export-manifest — Export manifest
build-handoff — Build handoff document
release-notes — Release notes
changelog — Changelog entry
migration-guide — Migration guide
incident-report — Incident report
runbook — Operational runbook


Ownership
Every artifact has exactly one primary owner.
owner:
  user_id: string | agent_id
  role: string
  responsibilities:
    - "Maintain artifact quality and freshness"
    - "Process change requests"
    - "Coordinate deprecation when needed"
    - "Ensure cross-references remain valid"
Secondary reviewers may exist but do not transfer ownership.

Dependencies
Every artifact declares its dependencies:
dependencies:
  upstream:
    - artifact_id: string
      version: string (SemVer range or exact)
      required: boolean
      reason: string
  downstream:
    - artifact_id: string
      version: string
      reason: string
  peer:
    - artifact_id: string
      version: string
      consistency_required: boolean
  schemas:
    - schema_id: string
      version: string
      sections_consumed: array of paths

A missing or invalid upstream dependency blocks the artifact's progression (see 04-validation-standard.md Stage 3).


Storage
Released artifacts are stored in the canonical artifact registry:
registry_path: /registry/{type}/{scope}/{slug}/{version}/
Naming: artifact_id + version + format extension
Example: /registry/prd/core-systems/couple-profiling/2.4.1/aa-prd-core-systems-couple-profiling-3a7b9c2d-2.4.1.md

All artifacts include:
• The artifact body
• The version metadata (see 06-versioning-standard.md)
• The full validation history
• The artifact's trace envelopes
• The cross-reference index

Retention Policy
Released artifacts are retained indefinitely.
Deprecated artifacts are retained for transition_window + 7 years.
Archived artifacts are retained for the project's lifetime + 7 years.
Validation results are retained for 7 years.
Trace envelopes are retained for the artifact's lifetime + 7 years.


Cross-References
• 01-operating-principles.md — Principle 7
• 04-validation-standard.md — full validation pipeline
• 06-versioning-standard.md — version metadata
• 13-change-management-standard.md — change request handling
• governance/08-document-cross-reference-map.md — cross-reference index


Ownership
Component: Artifact Management Standard
Owner: Artifact Platform Lead
Reviewer: System Architect + Operations Lead
Review Cadence: Every MAJOR version bump, or on any orphan/dependency incident


---

End of File
