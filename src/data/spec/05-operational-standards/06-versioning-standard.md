governance/operational-standards/06-versioning-standard.md
AppArchitect Versioning Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 06 of 15
Depends On: 01-operating-principles.md, 04-validation-standard.md, 05-conflict-resolution-standard.md


Purpose
Defines the versioning scheme, version states, version transitions, version metadata, and deprecation policy for every versioned artifact in the AppArchitect system. This standard is the implementation of Operating Principle #3 (Deterministic Generation).
Versioning is the mechanism by which determinism is achieved. Given the same version of inputs, the same version of output must be producible.


Scope
Applies to:
• All PRD documents
• All governance and operational standard documents
• All schemas
• All agent PRDs
• All export manifests
• All released artifacts
Out of scope:
• Source code versions (governed by Git/standard SemVer)
• Tool versions (governed by tool spec)
• User data versions (governed by data lifecycle)

Versioning Scheme
AppArchitect uses Semantic Versioning 2.0.0 (SemVer) with AppArchitect-specific extensions.

Format: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
Example: 2.4.1-alpha.1+20250618

MAJOR
Incremented for breaking changes:
• Schema field removal or rename
• Authority order changes
• Validation rule tightening that changes PASS/FAIL outcomes
• Agent scope change (agent gains/loses artifact type ownership)
• Operating Principle additions (new principles)
Requires: Governance Council approval, migration plan, deprecation notice on prior MAJOR.

MINOR
Incremented for backward-compatible additions:
• New optional schema field
• New agent
• New validation rule that does not change PASS/FAIL outcomes
• New optional document section
• Backward-compatible governance clarification
Requires: Document owner approval, version transition log.

PATCH
Incremented for backward-compatible fixes:
• Typo corrections
• Clarifications without semantic change
• Broken cross-references fixed
• Example updates
Requires: Document owner approval.

PRERELEASE
Used for in-development versions:
• alpha — early, unstable, may not pass full validation
• beta — stable for review, passes all but Stage 7 validation
• rc — release candidate, passes all validations
Prerelease versions do not replace released versions in routing.

BUILD
Optional metadata suffix. Convention: ISO date in YYYYMMDD format.
Does not affect version precedence. Used for traceability only.


Version States
Six states are recognized:


1. Draft
Definition: Work in progress, not yet submitted for review.
Allowed Transitions: → Review
Owner: Producing agent or human author
Routing: Not visible to downstream agents


2. Review
Definition: Submitted for review but not approved.
Allowed Transitions: → Approved, → Draft (rejected back)
Owner: Producing agent
Routing: Visible to reviewers only


3. Approved
Definition: Passed all validation stages and is ready for release.
Allowed Transitions: → Released
Owner: Document owner
Routing: Available for production use


4. Released
Definition: Active production version. Available for all consumers.
Allowed Transitions: → Deprecated, → Archived
Owner: Document owner
Routing: Default routing for all consumers


5. Deprecated
Definition: Superseded by a newer version, but still in use during transition.
Allowed Transitions: → Archived
Owner: Document owner
Routing: Available with deprecation warning; no new consumers may adopt


6. Archived
Definition: Read-only historical version. No longer routable.
Allowed Transitions: None (terminal state)
Owner: Document owner
Routing: Available only for audit/reference

Version State Transitions
Draft → Review: Submitting agent/human marks complete and runs self-validation
Review → Draft: Reviewer rejects with required_changes list
Review → Approved: All review stages complete, all validations PASS
Approved → Released: Release manager publishes
Released → Deprecated: Newer version promoted, transition window opens
Deprecated → Archived: Transition window closes, all consumers migrated

Transition Windows
| Old → New Version | Transition Window |
|---|---|
| MAJOR change | 90 days from Deprecated → Archived |
| MINOR change | 30 days from Deprecated → Archived |
| PATCH change | 7 days from Deprecated → Archived |

During the transition window, both versions are routable. Routing logic:
• New consumers receive the newer version by default
• Existing consumers continue to receive the older version
• A migration guide must be available for MAJOR and MINOR transitions

Version Metadata
Every released artifact includes a version metadata block:
version_metadata:
  artifact_id: string
  version: string (SemVer)
  state: enum (Released, Deprecated, Archived)
  content_hash: string (SHA-256 of artifact body)
  released_at: ISO 8601 timestamp
  released_by: user_id or agent_id
  approvers: array of {user_id, role, approved_at}
  supersedes: array of {artifact_id, version}
  superseded_by: artifact_id | null
  valid_from: ISO 8601 timestamp
  valid_until: ISO 8601 timestamp | null
  migration_guide: url | null
  change_log: string


Deprecation Policy
When an artifact is marked Deprecated:
1. A deprecation notice is added to the artifact header.
2. All consumers are notified (per 13-change-management-standard.md).
3. A migration guide is published.
4. The artifact's valid_until date is set to the transition window end.
5. A new artifact version becomes the Recommended version.
6. The deprecation is logged in the changelog (changelog.md).

No MAJOR version may be deprecated while it is the only version of a critical artifact. A replacement must exist and be at least in Approved state.


Cross-References
• 01-operating-principles.md — Principle 3 (Deterministic Generation)
• 04-validation-standard.md — Stage 7 release validation
• 05-conflict-resolution-standard.md — version conflict resolution
• 12-release-standard.md — release lifecycle
• 13-change-management-standard.md — deprecation notification
• governance/02-document-dependency-matrix.md — version compatibility


Ownership
Component: Versioning Standard
Owner: Release Manager
Reviewer: Governance Lead + System Architect
Review Cadence: Every MAJOR version bump of the standard itself, or on any version conflict incident


---

End of File
