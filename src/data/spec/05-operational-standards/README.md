governance/operational-standards/README.md
AppArchitect Operational Standards

Layer: Operational Standards
Position: Sibling of governance/, schemas/, agents/, and prd-suite/ at the AppArchitect-Foundation root.
This is a top-level layer, NOT a subdirectory of governance.
Authority: Operational Standards sit BELOW Governance and ABOVE Agents/Workflows/Artifacts.
When a Governance rule conflicts with an Operational Standard, Governance wins.
When an Operational Standard conflicts with an Agent PRD, the Operational Standard wins.

Purpose
This directory contains the 15 canonical operational standards that govern how the AppArchitect system runs day-to-day. Governance documents (in ../) define the constitutional rules of the system. The operational standards implement those rules as concrete, executable procedures.

Document Index
01. Operating Principles — the 10 non-negotiable principles
02. Agent Execution Standard — the 8-step agent lifecycle + delegation rules
03. Document Quality Standard — the 6 quality dimensions + 90/100 gate
04. Validation Standard — the 7-layer validation hierarchy + state machine
05. Conflict Resolution Standard — authority order + 6 conflict types
06. Versioning Standard — SemVer lifecycle + state machine
07. Artifact Management Standard — artifact lifecycle + ownership
08. Security Standard — 6 security domains + controls
09. Observability Standard — 4 pillars + metric definitions
10. Failure Recovery Standard — recovery workflow + RTO/RPO
11. Human Review Standard — 4 review types + AI/human boundary
12. Release Standard — 7-phase release lifecycle + rollback
13. Change Management Standard — change lifecycle + impact analysis
14. Continuous Learning Standard — learning cycle + sources
15. Master Operational Runbook — the entry point for operating the system

Authority Hierarchy
1. Governance (constitutional rules)
2. Operational Standards (this directory)
3. Schemas
4. Agent PRDs
5. Workflows
6. Artifact output

Status
All 15 standards are at v1.0, status Canonical.
Owner: AppArchitect Core Team
Review cadence: Every MAJOR version bump, or on any cross-standard incident.

End of File
