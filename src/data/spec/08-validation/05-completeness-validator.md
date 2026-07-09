# AppArchitect Completeness Validator
**Version:** 1.0
**Status:** Canonical
**Layer:** Validation Framework (Domain Validator)
**Parent engine:** `governance/13-validation-engine-spec.md`
**Rule catalog:** `governance/04-validation-rules.md` (Category 1, Category 8: Export Validation)
**Standard:** `operational-standards/04-validation-standard.md` (Stage 6 — Completeness Validation)
**Pipeline position:** Runs after Consistency Validation (Stage 11), before Export Validation (Stage 12) in master pipeline
**Consumes:** All generated documents, the Master Project Schema, the Architecture Object, all prior validation findings
**Produces:** `output/validation-reports/05-completeness-validation-{project_id}-{timestamp}.json`

Purpose
The Completeness Validator answers the question: Is the project complete enough to build?
A project can have all references resolving, all documents consistent, and still be incomplete. Completeness is a separate dimension.
Completeness checks:
- All required sections present in each document (already checked by 01-prd-validator for PRDs, but expanded to all docs)
- All required documents present (already checked by 03-cross-document for schema-conditioned, but expanded to all required artifacts)
- All required fields filled (no empty sections, no "TBD" values)
- All required business logic expressed (every workflow has every step, every feature has every acceptance criterion)
- All required stakeholders addressed (every persona has at least one workflow)
The validator produces a completeness score and a build-readiness verdict.
No project advances to Export Validation with completeness score below 95.

Scope
Applies to:
- All generated documents
- All required sections within each document
- All required fields within each section
- All required artifacts in the build handoff package
- All required stakeholders (personas, roles)

Out of scope:
- Reference resolution (handled by 03-cross-document-validator.md)
- Semantic consistency (handled by 04-consistency-validator.md)

Validation Principles
The Completeness Validator operates on five principles:
1. Every required field has a value. Empty is failure.
2. Every required section has content. Headers without content are failure.
3. Every required stakeholder is addressed. Orphaned stakeholders are failure.
4. Every required artifact exists. Missing artifacts are failure.
5. Build-readiness is binary: either complete or not. 95% is not enough.

Completeness Categories

Category 1: Required Documents Present
Every document type that the project requires must be generated.
Required documents (full enumeration):
- Master Project Schema (always)
- Architecture Object (always)
- Master PRD (always)
- Feature Specifications (one per feature in schema)
- User Story Catalog (always)
- Acceptance Criteria Catalog (always)
- API Contract (always if backend, conditional if no-backend)
- Database Schema (always if data persistence, conditional if data is external)
- UX Specification (always if UI exists)
- Screen Inventory (always if UI exists)
- Component Map (always if UI exists)
- Navigation Map (always if UI exists)
- Workflow Definitions (one per workflow)
- State Models (one per entity with state)
- Decision Trees (one per branching workflow)
- User Journeys (one per persona)
- Brand & Logo Asset PRD (always)
- Collaboration Map (always)
- Master Prompt Framework (always)
- Roles & Permissions Matrix (always)
- Test Plan (always)
- User Instructions (always)
- Error & State Reference (always)
- Environment & Secrets Reference (always)
- Data & Integration PRD (conditional: only if integrations exist)
- AI Features Specification (conditional: only if ai_features.enabled)
- Monetization PRD (conditional: only if monetization.enabled)
- Security PRD (always)
- Analytics PRD (conditional: only if analytics defined)
- Compliance Documentation (conditional: only if compliance requirements exist)
- Performance Specification (conditional: only if performance requirements defined)
- DevOps & Deployment Plan (always)
- 5-Year Financial Model (conditional: only if business modeling required)
- Export Manifest (always)

Validation:
- For each document type, check if file exists
- Missing required document = CRITICAL
- Missing conditional document that should be present = ERROR

Category 2: Required Sections Within Each Document
Each document type defines required sections.
For example, the Master PRD requires:
- Overview
- Problem Statement
- Target Users
- Success Metrics
- Scope (In/Out)
- User Stories (sample)
- Feature List (linked)
- Non-Functional Requirements
- Constraints
- Open Questions

Validation:
- For each document, parse section headers
- Verify each required section exists
- Missing required section = ERROR

Category 3: Required Fields Within Each Section
Each section defines required fields.
For example, "Problem Statement" requires:
- problem_description (string, non-empty)
- target_audience (string, non-empty)
- pain_severity (enum: low|medium|high|critical)
- alternatives_considered (list, ≥1 entry)

Validation:
- For each section, parse field schema
- For each required field, check it has a value
- Empty required field = ERROR

Category 4: Persona Coverage
Every persona in the schema must have at least one workflow.
Already checked by 03-cross-document-validator (CDV-012), but here checked with strictness.
Personas without workflows are CRITICAL.

Category 5: Feature Coverage
Every feature in the schema must have:
- At least one user story
- At least one acceptance criterion
- At least one workflow (or marked as non-user-facing)
- At least one screen (or marked as non-UI)

Validation:
- Cross-reference schema features against story catalog, acceptance criteria, workflow catalog, UX specs
- Missing any required artifact = ERROR

Category 6: Workflow Coverage
Every workflow must have:
- start_state defined
- end_state defined
- at least 1 transition
- at least 1 screen reference (or marked as non-UI)
- at least 1 persona reference
- error states defined

Validation:
- Parse all workflow definitions
- For each, verify all required components
- Missing component = ERROR

Category 7: API Coverage
Every API endpoint must have:
- HTTP method defined
- Path defined
- Authentication required (yes/no)
- Request schema defined
- Response schema defined
- Error responses defined (at least 400, 401, 403, 404, 500)
- Rate limit defined
- At least one feature reference

Validation:
- Parse API contract
- For each endpoint, verify required fields
- Missing field = ERROR

Category 8: Screen Coverage
Every screen must have:
- Purpose statement
- Component list (non-empty)
- Role-based access defined
- At least one workflow reference
- State handling defined

Validation:
- Parse UX spec
- For each screen, verify required fields
- Missing field = ERROR

Category 9: Test Coverage
The Test Plan must define tests for:
- Every feature (at least 1 test case)
- Every API endpoint (at least 1 happy path + 1 error path)
- Every workflow (at least 1 happy path)
- Every role-based access (at least 1 test)

Validation:
- Parse Test Plan
- Verify coverage of every artifact
- Missing coverage = ERROR

Category 10: Stakeholder Coverage
The Roles & Permissions Matrix must address every role defined in the schema.
Every role must have at least one permission set.

Validation Rules (20 Rules)

CMV-001: Required Document Presence
Severity: CRITICAL

CMV-002: Required Section Presence (per document type)
Severity: ERROR

CMV-003: Required Field Presence (per section)
Severity: ERROR

CMV-004: Persona Has Workflow
Severity: CRITICAL

CMV-005: Feature Has User Story
Severity: ERROR

CMV-006: Feature Has Acceptance Criteria
Severity: ERROR

CMV-007: Feature Has Workflow
Severity: WARNING (ERROR if user-facing)

CMV-008: Feature Has Screen
Severity: WARNING (ERROR if UI)

CMV-009: Workflow Has Start State
Severity: ERROR

CMV-010: Workflow Has End State
Severity: ERROR

CMV-011: Workflow Has Transition
Severity: ERROR

CMV-012: Workflow Has Screen Reference
Severity: WARNING (ERROR if UI workflow)

CMV-013: Workflow Has Error States
Severity: ERROR

CMV-014: API Endpoint Has Method
Severity: ERROR

CMV-015: API Endpoint Has Auth Definition
Severity: ERROR

CMV-016: API Endpoint Has Error Responses
Severity: ERROR

CMV-017: API Endpoint Has Feature Reference
Severity: ERROR

CMV-018: Screen Has Role-Based Access
Severity: ERROR

CMV-019: Test Plan Coverage
Severity: ERROR

CMV-020: Build-Readiness Threshold
Severity: CRITICAL
Completeness score must be ≥ 95 to proceed.

Validation Result Schema
```
{
  "validator": "completeness-validator",
  "version": "1.0",
  "run_id": "uuid",
  "timestamp": "ISO-8601",
  "project_id": "string",
  "status": "PASS|PASS_WITH_WARNINGS|FAIL|CRITICAL",
  "summary": {
    "documents_required": 32,
    "documents_present": 30,
    "documents_missing": 2,
    "required_sections_total": 280,
    "required_sections_present": 275,
    "required_sections_missing": 5,
    "required_fields_total": 1850,
    "required_fields_present": 1820,
    "required_fields_empty": 30,
    "features_total": 47,
    "features_with_stories": 47,
    "features_with_acceptance_criteria": 45,
    "features_with_workflows": 42,
    "personas_total": 4,
    "personas_with_workflows": 4,
    "workflows_total": 38,
    "workflows_complete": 36,
    "api_endpoints_total": 64,
    "api_endpoints_complete": 60,
    "screens_total": 52,
    "screens_complete": 52
  },
  "missing_documents": [
    {
      "rule": "CMV-001",
      "severity": "CRITICAL",
      "document": "AI-Features-Specification.md",
      "reason": "Schema declares ai_features.enabled=true but document not generated",
      "remediation": "Run ai-features-agent to generate",
      "blocking": true
    }
  ],
  "missing_sections": [...],
  "empty_fields": [...],
  "incomplete_features": [...],
  "incomplete_workflows": [...],
  "incomplete_apis": [...],
  "readiness_score": {
    "documents_complete": 94,
    "sections_complete": 98,
    "fields_complete": 98,
    "feature_coverage": 96,
    "workflow_coverage": 95,
    "api_coverage": 94,
    "persona_coverage": 100,
    "overall": 96
  },
  "build_ready": true,
  "next_actions": [
    "Generate AI-Features-Specification.md",
    "Add acceptance criteria for 2 features",
    "Complete 5 empty required fields"
  ]
}
```

Build-Readiness Algorithm
```
build_ready = (
  completeness_score >= 95 AND
  zero_critical_findings AND
  zero_missing_required_documents AND
  zero_features_without_user_stories AND
  zero_features_without_acceptance_criteria AND
  zero_personas_without_workflows AND
  zero_workflows_without_start_state AND
  zero_workflows_without_end_state AND
  zero_api_endpoints_without_auth_definition AND
  zero_api_endpoints_without_error_responses
)
```

Failure Examples

Example 1: Missing Conditional Document
Input:
```
Schema: ai_features: enabled: true
AI-Features-Specification.md: missing
Result: CRITICAL CMV-001
Remediation: Run ai-features-agent
```

Example 2: Feature Without Acceptance Criteria
Input:
```
Schema feature F-014: User Profile Customization
Feature PRD: present
Acceptance Criteria Catalog: F-014 not found
Result: ERROR CMV-006
Remediation: Add acceptance criteria for F-014
```

Example 3: Workflow Without Error States
Input:
```
Workflow: checkout-flow
Steps: [cart, address, payment, confirmation]
Error states: undefined
Result: ERROR CMV-013
Remediation: Define error states (payment_failed, address_invalid, etc.)
```

Example 4: API Endpoint Without Auth Definition
Input:
```
API Contract: POST /api/users
Auth: undefined
Result: ERROR CMV-015
Remediation: Either define auth or document as public endpoint
```

Example 5: Persona Without Workflows
Input:
```
Schema persona: admin
Workflows: []
Result: CRITICAL CMV-004
Remediation: Add at least one admin workflow or remove persona
```

Example 6: Test Plan Missing Coverage
Input:
```
Features: 47
Test Plan references: 45 features
Missing: F-022, F-039
Result: ERROR CMV-019
Remediation: Add tests for F-022 and F-039
```

Pipeline Integration
The validator is invoked after Consistency Validation (Stage 11) and before Export Validation (Stage 12).
Invocation sequence:
1. Consistency Validator (04) completes with PASS
2. Completeness Validator (05) runs
3. Completeness score computed
4. If score < 95 OR CRITICAL findings exist: pipeline halts
5. If score 95-99 with no CRITICAL: pipeline proceeds with warning log
6. If score = 100: pipeline proceeds cleanly
7. Build-readiness verdict emitted
8. Orchestrator routes missing artifact generation requests

Performance Characteristics
For typical AppArchitect projects:
- 32 documents, ~2,000 required fields
- Validation runtime: 15-45 seconds
- Memory footprint: 300-800 MB
- Idempotent
- Can be parallelized across document types

Ownership
This validator is owned by:
- Validation Engine (executes rules)
- Completeness Validator Module (rule logic)
- Master Orchestrator (invocation and remediation routing)

End of File
**Authority:** Completeness Validator determines if the project is build-ready. The 95% threshold is non-negotiable.
**Next file:** `07-validation/06-dependency-validator.md`
