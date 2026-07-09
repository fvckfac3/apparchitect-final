# AppArchitect Cross-Document Validator
**Version:** 1.0
**Status:** Canonical
**Layer:** Validation Framework (Domain Validator)
**Parent engine:** `governance/13-validation-engine-spec.md`
**Rule catalog:** `governance/04-validation-rules.md` (Category 3: Cross-Reference Validation)
**Standard:** `operational-standards/04-validation-standard.md` (Stage 4 — Cross-Reference Validation)
**Pipeline position:** Runs after all PRD + Technical Spec generation, before Security Validation (Stage 11 in master pipeline)
**Consumes:** All PRD documents, all Technical Spec documents, all UX documents, all Workflow documents, the Master Project Schema, the Architecture Object
**Produces:** `output/validation-reports/03-cross-document-validation-{project_id}-{timestamp}.json`

Purpose
The Cross-Document Validator detects reference drift, orphan references, and bidirectional inconsistencies across the entire generated document set.
Every reference must resolve in both directions: if Document A references Document B, Document B must reference Document A, OR there must be a documented reason for the unidirectional reference.
This is the validator that catches the orphan screen, orphan API, and broken agent reference failures that humans miss.
The validator does not judge whether the content of each document is correct. It judges whether the documents form a connected, consistent graph.
No project advances to Security Validation, AI Validation, or Export Validation without passing this validator with status PASS or PASS_WITH_WARNINGS.

Scope
Applies to:
- All 30+ generated documents (PRD suite, Technical Specs, UX specs, Workflow specs)
- All references between documents (feature_id, screen_id, workflow_id, entity_id, api_endpoint_id, etc.)
- All references from documents to the Project Schema
- All references from documents to the Architecture Object

Out of scope:
- Internal document structure (handled by 01-prd-validator.md, by the agent layer)
- Schema correctness (handled by 02-schema-validator.md)
- Implementation traceability (handled by 04-consistency-validator.md)

Validation Principles
The Cross-Document Validator operates on five principles:
1. Every reference must resolve. A reference to a non-existent target is a hard failure.
2. References must be bidirectional where semantically required. Screen to workflow and workflow to screen must both exist.
3. Reference names must be stable. A reference must not silently change name across regenerations.
4. Reference cardinality must be honored. A many reference must have one or more targets, never zero.
5. No document may introduce entities that do not exist in the schema. Documents may only reference, never invent.

Reference Types Validated

Type 1: Document-to-Schema References
Documents frequently reference schema objects by ID.
Example reference:
```
PRD: feature_id: F-014
Schema: feature_id: F-014 exists
Result: PASS
```

Validation:
- Pattern: `*_id: [A-Z]+-[0-9]+`
- Target must exist in schema
- Target type must match (feature_id must reference feature, not persona)

Type 2: Document-to-Document References
Documents reference each other through IDs.
Examples:
- PRD references screen_id (from UX document)
- Technical Spec references api_endpoint_id (from API contract)
- Workflow references both screen_id and entity_id

Validation:
- Reference must point to an existing document
- Referenced document must have been generated
- Forward references (Document A references Document B before B is generated) are blocked by pipeline ordering, but if found, flagged as ERROR

Type 3: Bidirectional References
Some reference types MUST exist in both directions.
Critical bidirectional pairs:
- Screen to Workflow (every screen used by a workflow must have that workflow referencing the screen back)
- Workflow to Feature (every workflow implementing a feature must have the feature reference the workflow back)
- API to Feature (every API endpoint serving a feature must have the feature reference the endpoint back)
- Entity to Screen (every entity displayed on a screen must have the screen reference the entity back)
- Persona to Workflow (every persona performing a workflow must have the workflow reference the persona back)

Validation:
- For each forward reference, check for matching reverse reference
- Mismatch produces a CROSS_REF_ASYMMETRY finding at severity WARNING by default
- Asymmetry for security-critical pairs (e.g., screen to entity with sensitive data) produces ERROR

Type 4: Schema-to-Document References (Reverse Direction)
The schema may mandate that certain documents exist when certain schema objects exist.
Example:
```
Schema: ai_features: enabled: true
Required document: AI-Features-Specification.md
Missing: Validation Failure
```

Validation:
- For each schema object, determine required documents
- Check that each required document exists
- Missing required documents produce ERROR (blocking) or CRITICAL (blocking with halt)

Type 5: Inheritance References
Some documents inherit from others (e.g., Feature PRD inherits from Master PRD).
Validation:
- Parent document must exist
- Inherited fields must be present in parent
- Circular inheritance (A inherits B, B inherits A) is CRITICAL

Type 6: Version References
Documents may reference a specific version of another document.
Validation:
- Referenced version must exist
- Version must be compatible (no breaking change references)
- Broken version reference is ERROR

Validation Rules (15 Rules)

CDV-001: Reference Target Existence
Severity: ERROR
Every reference must point to an existing target.
Example failure:
```
feature_id: F-999
Schema feature_ids: [F-001, F-002, F-003]
Result: ERROR - Orphan reference
```

CDV-002: Reference Type Match
Severity: ERROR
Reference type must match target type.
Example failure:
```
workflow references persona_id: user-001
persona_id "user-001" does not exist in personas (it exists in users)
Result: ERROR - Type mismatch
```

CDV-003: Bidirectional Reference - Screen to Workflow
Severity: WARNING (ERROR if security-sensitive)
Every screen used by a workflow must have that workflow referencing the screen.
Example failure:
```
Workflow checkout references screen_id: payment-confirmation
Screen payment-confirmation does not reference workflow: checkout
Result: WARNING - Asymmetric reference
```

CDV-004: Bidirectional Reference - Workflow to Feature
Severity: WARNING
Every workflow implementing a feature must have the feature reference the workflow.

CDV-005: Bidirectional Reference - API to Feature
Severity: ERROR
Every API endpoint serving a feature must have the feature reference the endpoint.

CDV-006: Bidirectional Reference - Entity to Screen
Severity: WARNING
Every entity displayed on a screen must have the screen reference the entity.

CDV-007: Bidirectional Reference - Persona to Workflow
Severity: WARNING

CDV-008: Forward Reference Detection
Severity: ERROR
No document may reference another document that has not yet been generated.
This is a pipeline ordering check, not a content check.

CDV-009: Orphan Screen Detection
Severity: ERROR
Every screen in the UX document must be referenced by at least one workflow.
Orphan screens (no inbound workflow references) are dead UI.
Example:
```
Screens: [login, dashboard, settings, legacy-admin]
Workflows reference: [login, dashboard, settings]
legacy-admin: orphaned
Result: ERROR - Orphan screen: legacy-admin
```

CDV-010: Orphan API Endpoint Detection
Severity: ERROR
Every API endpoint in the API Contract must be referenced by at least one feature or workflow.
Orphan endpoints are dead code.

CDV-011: Orphan Entity Detection
Severity: ERROR
Every entity in the Data Model must be referenced by at least one feature, screen, or workflow.
Orphan entities are dead schema.

CDV-012: Orphan Persona Detection
Severity: WARNING
Every persona should be referenced by at least one workflow.
Orphan personas may indicate scope bloat or a missing user story.

CDV-013: Orphan Feature Detection
Severity: ERROR
Every feature in the schema must be referenced by at least one PRD section, one workflow, one screen, or one API endpoint.
Orphan features are unimplemented requirements.

CDV-014: Schema-Conditioned Document Existence
Severity: ERROR
If a schema object is enabled, the corresponding document must exist.
Required document mappings:
- ai_features.enabled: true -> AI-Features-Specification.md
- monetization.enabled: true -> Monetization-PRD.md
- integrations.count > 0: Integration-Specifications.md
- security.compliance contains entries: Compliance-Documentation.md
- authentication.required: true: Authentication-Specification.md
- non_functional_requirements.performance defined: Performance-Specification.md

CDV-015: Agent Reference Integrity
Severity: ERROR
Every agent reference in the document set must resolve to a real agent definition in agents/.
Broken agent references (e.g., references to agent-99 when only 00-orchestrator through 16-roadmap exist) are CRITICAL.

Validation Result Schema
The validator emits a structured result file:
```
{
  "validator": "cross-document-validator",
  "version": "1.0",
  "run_id": "uuid",
  "timestamp": "ISO-8601",
  "project_id": "string",
  "status": "PASS|PASS_WITH_WARNINGS|FAIL|CRITICAL",
  "summary": {
    "documents_validated": 32,
    "references_checked": 1247,
    "references_passed": 1240,
    "references_failed": 7,
    "orphan_screens": 1,
    "orphan_apis": 2,
    "orphan_entities": 0,
    "orphan_features": 0,
    "bidirectional_asymmetries": 4
  },
  "findings": [
    {
      "id": "CDV-009-001",
      "rule": "CDV-009",
      "severity": "ERROR",
      "category": "orphan_screen",
      "source_document": "UX-Specification.md",
      "source_location": "screen: legacy-admin",
      "target_reference": "N/A",
      "description": "Screen legacy-admin is not referenced by any workflow",
      "remediation": "Either remove screen legacy-admin or add it to a workflow",
      "owner": "ux-agent",
      "blocking": true
    }
  ],
  "readiness_score": {
    "cross_reference_integrity": 87,
    "orphan_free": 75,
    "bidirectional_consistency": 92,
    "overall": 84
  },
  "next_actions": [
    "Remove orphaned screen legacy-admin or add it to the admin-tools workflow",
    "Resolve 2 orphan API endpoints in payment-service",
    "Re-run validator after remediation"
  ],
  "blocking_findings_count": 3,
  "warning_findings_count": 4,
  "remediation_estimated_effort": "low"
}
```

Severity Rules
Reference type determines default severity:
- Orphan feature, orphan API, orphan entity, broken agent reference: ERROR (blocking)
- Orphan screen: ERROR (blocking)
- Orphan persona: WARNING (non-blocking)
- Bidirectional asymmetry: WARNING (default), ERROR for security-critical pairs
- Forward reference: ERROR (indicates pipeline violation)
- Schema-conditioned document missing: ERROR or CRITICAL depending on criticality

Failure Examples

Example 1: Orphan Screen
Input:
```
UX Spec defines screens: [home, profile, settings, admin-panel]
Workflows reference screens: [home, profile, settings]
Admin-panel: orphaned
Result: ERROR CDV-009
Remediation: Remove admin-panel or add to admin workflow
```

Example 2: Broken Agent Reference
Input:
```
Document references: agent_id: "agent-22"
Agents directory contains: 00 through 16
Result: CRITICAL CDV-015
Remediation: Correct agent reference to a valid agent ID or create the missing agent definition
```

Example 3: Missing Required Document
Input:
```
Schema: ai_features: enabled: true
Documents directory does not contain: AI-Features-Specification.md
Result: ERROR CDV-014
Remediation: Run AI Integration agent to generate the missing document
```

Example 4: Bidirectional Asymmetry (Security)
Input:
```
Workflow: payment-processing
References screen: credit-card-entry
Screen: credit-card-entry
Does not reference workflow: payment-processing
But: screen handles PCI-sensitive data
Result: ERROR CDV-003 (elevated from WARNING due to security sensitivity)
Remediation: Add the workflow reference back to the screen definition
```

Example 5: Forward Reference (Pipeline Violation)
Input:
```
Document: PRD-v1.md
References: api_endpoint_id: "ep-checkout-create"
Document api-contract.md not yet generated
Result: ERROR CDV-008
Remediation: Pipeline ordering violation; regenerate PRD after API Contract is generated
```

Pipeline Integration
The validator is invoked by the master orchestrator after Stage 9 (Documentation Generation) completes and before Stage 11 (Security Validation).
Invocation sequence:
1. Discovery Agent collects schema and document manifest
2. Schema Validator runs (02)
3. All agents generate their documents in dependency order
4. Cross-Document Validator runs (03)
5. If FAIL: orchestrator routes findings back to specific agents for remediation
6. If PASS_WITH_WARNINGS: warnings logged for human review at Stage 11
7. If PASS: orchestrator advances to Stage 11

Remediation Routing
The validator categorizes findings by owner agent and routes remediation requests:
- Orphan screens -> ux-agent
- Orphan APIs -> technical-spec-agent or backend-engineer
- Orphan entities -> schema-agent
- Broken agent references -> meta-orchestrator-agent
- Missing schema-conditioned documents -> corresponding specialized agent
- Forward references -> meta-orchestrator-agent (pipeline violation)

Performance Characteristics
For typical AppArchitect projects:
- 30 documents, ~1,200 references
- Validation runtime: 2-8 seconds
- Memory footprint: 50-150 MB
- Can be parallelized across document pairs
- Idempotent: safe to re-run after every regeneration

Ownership
This validator is owned by:
- Validation Engine (executes rules)
- Cross-Document Validator Module (rule logic)
- Master Orchestrator (invocation and remediation routing)

End of File
**Authority:** Cross-Document Validator is the third gate in the validation pipeline. Catches what no human reviewer can reliably detect.
**Next file:** `07-validation/04-consistency-validator.md`
