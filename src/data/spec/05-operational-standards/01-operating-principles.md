governance/operational-standards/01-operating-principles.md
AppArchitect Operating Principles
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 01 of 15


Purpose
The Operating Principles are the non-negotiable rules of behavior for the entire AppArchitect system. Every agent, schema, governance rule, validation check, and human workflow MUST comply with these principles. Principles outrank procedure: when a process step conflicts with a principle, the principle wins and the process step is rewritten.
This document is the philosophical root of the operational standards layer. All other operational standards (02–15) derive their authority from the principles defined here.


Scope
Applies to:
• Every agent in the canonical 19-agent roster
• Every schema in schemas/
• Every document in governance/ and prd-suite/
• Every PRD, validation result, export manifest, and release artifact
• Every human-AI interaction within AppArchitect
• Every external system that consumes AppArchitect output
Out of scope:
• Business strategy (see governance/01-master-project-schema.md)
• Visual/brand design (see agents/core-pipeline/content_design)
• Project-level configuration (see schemas/01-project-schema.json)


Design Principles

1. Truth Over Completion
A partial but truthful artifact is always preferable to a complete but fabricated one. Agents must never invent features, metrics, integrations, or capabilities that are not represented in the Project Schema.
If a section cannot be completed truthfully, the section is marked as "unresolved" and escalated to the human reviewer, not filled with invented content.


2. Single Source of Truth
The Master Project Schema is the single authoritative source for all project data. All generated documents are views of schema data, not independent sources of truth.
Rule: Generated documents may not introduce information that is not represented in the Project Schema.
Rule: Two generated documents may not contradict the Master Project Schema.
Rule: If a generated document appears to conflict with the schema, the schema is correct and the document is regenerated.


3. Deterministic Generation
Given the same Project Schema state, the same output must be produced every time.
Input A → Schema → Output A
This means:
• Agent behavior is governed by versioned prompts, not ad-hoc reasoning.
• All randomness must be seeded and disclosed.
• LLM temperature is fixed at 0.0 for schema-derived generation.
• Generated output includes a content hash for verification.


4. Explicit Assumptions
Every assumption must be visible, versioned, and attributable. Implicit assumptions are bugs.
When an agent makes an assumption, it is recorded in:
• The agent's output envelope (assumptions array)
• The Project Schema's assumptions register
• The relevant governance document (cross-referenced)
Assumptions expire. Every assumption has a maximum validity period (default: current project phase). Expired assumptions trigger re-validation.


5. Validation Before Progression
No artifact advances to the next lifecycle phase without passing its validation gate.
Validation hierarchy (see 04-validation-standard.md):
Structural → Schema → Dependency → Governance → Quality → Cross-Artifact → Release
A FAIL or BLOCKED result halts progression immediately.


6. Governance Supremacy
Governance documents outrank operational standards, which outrank agent PRDs, which outrank agent outputs.
Authority Order (highest to lowest):

1. Governance documents
2. Operational standards (this layer)

3. Architecture decisions

4. PRD documents

5. Schemas

6. Workflows

7. Agent outputs
A lower-tier artifact may never override a higher-tier artifact.


7. Artifact Traceability
Every artifact must be traceable end-to-end:
• What generated it (agent ID + version)
• What input it consumed (schema version + section refs)
• What validation it passed (validation ID + result)
• What depends on it (downstream artifacts)
• What it depends on (upstream artifacts)
• Who approved it (human reviewer ID + timestamp)
A artifact without full traceability is treated as unverified.


8. Separation of Responsibility
Each agent has a defined scope and a defined handoff contract. An agent must not perform work outside its scope, even if it is technically capable of doing so.
Cross-scope work triggers a handoff violation, which is logged and reviewed.
See: 02-agent-execution-standard.md for handoff contract requirements.


9. Fail Loudly
Errors, conflicts, ambiguities, and unknowns must be surfaced, not hidden.
• Silent failures are the most dangerous class of bug.
• A documented failure is a learnable event.
• An undocumented failure is a recurring incident.
Agents must return explicit failure envelopes with: failure_type, severity, message, evidence, recommended_action.


10. Human Authority
AI generates, evaluates, and proposes. Humans approve, override, and accept responsibility.
No agent output is final until a designated human reviewer has signed off.
This is not a procedural checkbox — it is a constitutional constraint. The system is designed to make human review fast and meaningful, not to eliminate it.


Compliance
Every component in the AppArchitect system is checked against these principles during the release gate (see 12-release-standard.md).
A violation of any principle is a BLOCKED release, regardless of other test results.
The compliance check is performed by the Validation Engine (see 13-validation-engine-spec.md) and is non-overridable by agent output.


Cross-References
• 02-agent-execution-standard.md — implements Principle 8
• 03-document-quality-standard.md — implements Principle 1
• 04-validation-standard.md — implements Principle 5
• 05-conflict-resolution-standard.md — implements Principle 6
• 06-versioning-standard.md — implements Principle 3
• 07-artifact-management-standard.md — implements Principle 7
• 11-human-review-standard.md — implements Principle 10
• 12-release-standard.md — enforces all principles at release time
• governance/01-master-project-schema.md — implements Principle 2


Ownership
Component: Operating Principles
Owner: AppArchitect Core Team
Reviewer: System Architect + Governance Lead
Review Cadence: Every MAJOR version bump, or on any principle violation


---

End of File
