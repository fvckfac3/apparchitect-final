# AppArchitect Consistency Validator
**Version:** 1.0
**Status:** Canonical
**Layer:** Validation Framework (Domain Validator)
**Parent engine:** `governance/13-validation-engine-spec.md`
**Rule catalog:** `governance/04-validation-rules.md` (Category 6: Security Validation, Category 7: AI Validation, Category 4: Workflow Validation, Category 5: Architecture Validation)
**Standard:** `operational-standards/04-validation-standard.md` (Stage 5 — Semantic Consistency Validation)
**Pipeline position:** Runs after Cross-Document Validation (Stage 10), before Security Validation (Stage 11) in master pipeline
**Consumes:** All generated documents, the Master Project Schema, the Architecture Object, prior validation findings
**Produces:** `output/validation-reports/04-consistency-validation-{project_id}-{timestamp}.json`

Purpose
The Consistency Validator detects semantic contradictions, policy violations, and conflict patterns within and across generated documents.
The Cross-Document Validator catches broken references. The Consistency Validator catches broken meaning.
A document set can have all references resolving perfectly and still be semantically incoherent. For example:
- Schema says authentication is optional
- PRD says users must log in to access features
- Architecture says no auth service exists
This is internally inconsistent. The Consistency Validator catches this category of failure.
This validator also enforces content policies: no placeholders, no invented entities, no contradicting assumptions, no insecure defaults.
No project advances to Security Validation with unresolved ERROR or CRITICAL consistency findings.

Scope
Applies to:
- Semantic content of all generated documents
- Cross-document meaning consistency (not just reference consistency)
- Policy compliance (RLM principles, operational standards)
- Assumption tracking and confidence score coherence
- Conflict detection between discovery input and generated output

Out of scope:
- Reference resolution (handled by 03-cross-document-validator.md)
- Schema structure (handled by 02-schema-validator.md)
- PRD section structure (handled by 01-prd-validator.md)

Validation Principles
The Consistency Validator operates on six principles:
1. Documents must not contradict each other or the schema.
2. Documents must not contradict the user's stated discovery input.
3. No placeholders, TBDs, or invented content may persist into final documents.
4. Confidence scores must be coherent across the document set.
5. Security and privacy must be respected by default, never deferred.
6. Regeneration must produce semantically equivalent outputs.

Consistency Categories

Category 1: Schema-to-Document Semantic Consistency
Every statement in a generated document that asserts something about the schema must match the schema.
Example inconsistency:
```
Schema: authentication: required: false
PRD: "Users must authenticate before accessing any feature"
Result: INCONSISTENCY DETECTED
Severity: CRITICAL
Remediation: Either update schema to require authentication, or rewrite PRD to reflect optional authentication
```

Validation:
- Extract all schema-asserting statements from documents
- Compare each to schema truth
- Identify and report all mismatches

Category 2: Document-to-Document Semantic Consistency
Related documents must not contradict each other.
Example inconsistency:
```
PRD: Feature X supports Google OAuth and Apple Sign-In
Technical Spec: API Spec lists only email/password authentication
Result: INCONSISTENCY DETECTED
Severity: ERROR
Remediation: Align API Spec with PRD authentication strategy
```

Validation:
- Build topic-keyed index of all statements
- For each topic, compare statements across documents
- Identify contradictions
- Flag mismatches

Category 3: Discovery-to-Document Consistency
Generated documents must reflect what the user actually said during discovery.
Example inconsistency:
```
Discovery input: "I'm building a meditation app for stressed professionals"
Generated PRD: "BOND - The science-backed relationship wellness app for couples"
Result: INCONSISTENCY DETECTED
Severity: CRITICAL
Remediation: Halt generation; user description does not match generated artifact
```

Validation:
- Load original discovery transcript
- Extract core intent, target users, problem domain
- Compare to generated PRD positioning
- Mismatch at the core intent level is CRITICAL

Category 4: Assumption Coherence
Assumptions must be tracked and confidence-scored coherently.
Example incoherence:
```
Schema: assumptions
  - assumption: "Users have smartphones"
    confidence: 0.95
  - assumption: "Users have unlimited data"
    confidence: 0.30
PRD: Assumes offline-first architecture
Result: INCONSISTENCY (offline-first makes unlimited data irrelevant, but it's listed as a low-confidence assumption)
Severity: WARNING
Remediation: Remove assumption or align architecture with assumption
```

Validation:
- Load all assumption registries
- Verify assumptions are not contradicted by generated architecture
- Verify confidence scores are coherent (related assumptions should have similar confidence)
- Identify orphan assumptions (assumptions that don't relate to any decision)

Category 5: Policy Compliance (RLM Principles)
All generated documents must comply with the Role Limits Mandate (RLM) defined in governance/01 and operational-standards/01.
RLM violations to detect:
- Agent claims capability outside its defined role
- Document introduces a feature not in the project schema
- Document invents integrations, services, or APIs not declared by the user
- Document defers security decisions
- Document defers privacy decisions
- Document uses placeholder content
- Document makes ungrounded promises

Category 6: Security Default Consistency
Security must be on by default. The validator checks for secure defaults.
Checks:
- All protected endpoints have authentication declared
- All sensitive data has encryption declared
- All PII handling has compliance declared
- All role-based access has authorization declared
- All third-party integrations have threat model declared

Category 7: Privacy Default Consistency
Privacy must be respected by default.
Checks:
- User data minimization declared
- Data retention policies declared
- Right-to-deletion workflows declared
- Consent flows declared where applicable
- No silent telemetry without disclosure

Validation Rules (18 Rules)

CSV-001: Schema-Statement Contradiction
Severity: CRITICAL
A document statement contradicting the schema is a CRITICAL failure.

CSV-002: Cross-Document Contradiction
Severity: ERROR (CRITICAL if contradiction affects security, billing, or core feature)

CSV-003: Discovery Input Drift
Severity: CRITICAL
Generated document drifts from what user described.

CSV-004: Placeholder Persistence
Severity: ERROR
Final documents must not contain: TBD, TODO, FIXME, XXX, PLACEHOLDER, "Coming Soon", "Insert Here", lorem ipsum.

CSV-005: Invented Entity Detection
Severity: ERROR
Documents must not introduce entities (features, screens, APIs, integrations) not present in the schema.

CSV-006: Invented Integration Detection
Severity: CRITICAL
Documents must not introduce third-party integrations not approved during discovery.

CSV-007: Capability Out-of-Role
Severity: ERROR
An agent must not generate content outside its defined role.

CSV-008: Security Default Violation
Severity: ERROR
Protected functionality without authentication declared.

CSV-009: Security Default Violation - Encryption
Severity: ERROR
Sensitive data without encryption declared.

CSV-010: Security Default Violation - Authorization
Severity: ERROR
Role-based access without authorization model.

CSV-011: Privacy Default Violation - Data Minimization
Severity: ERROR
PII collection without minimization declared.

CSV-012: Privacy Default Violation - Retention
Severity: WARNING
User data without retention policy.

CSV-013: Privacy Default Violation - Consent
Severity: ERROR
User data collection without consent flow.

CSV-014: Assumption Contradicts Architecture
Severity: WARNING

CSV-015: Assumption Confidence Incoherence
Severity: WARNING

CSV-016: Orphan Assumption
Severity: WARNING

CSV-017: Deferred Security Decision
Severity: ERROR
Security decisions must not be deferred to implementation.

CSV-018: Ungrounded Promise Detection
Severity: ERROR
Marketing-style language without technical backing.

Validation Result Schema
```
{
  "validator": "consistency-validator",
  "version": "1.0",
  "run_id": "uuid",
  "timestamp": "ISO-8601",
  "project_id": "string",
  "status": "PASS|PASS_WITH_WARNINGS|FAIL|CRITICAL",
  "summary": {
    "documents_validated": 32,
    "contradictions_detected": 3,
    "policy_violations": 2,
    "placeholder_instances": 0,
    "invented_entities": 1,
    "rlm_violations": 0,
    "security_default_violations": 1,
    "privacy_default_violations": 0
  },
  "contradictions": [
    {
      "id": "CSV-001-001",
      "rule": "CSV-001",
      "severity": "CRITICAL",
      "topic": "authentication_requirement",
      "source_a": {
        "document": "Master-PRD.md",
        "section": "User Authentication",
        "statement": "Users must authenticate before accessing any feature"
      },
      "source_b": {
        "document": "Master-Project-Schema.json",
        "section": "authentication.required",
        "value": false
      },
      "description": "PRD asserts authentication is required; schema says it is optional",
      "remediation": "Either update schema to require authentication, or rewrite PRD",
      "blocking": true
    }
  ],
  "policy_violations": [],
  "placeholder_instances": [],
  "invented_entities": [],
  "rlm_violations": [],
  "security_violations": [],
  "privacy_violations": [],
  "readiness_score": {
    "schema_consistency": 92,
    "cross_document_consistency": 85,
    "policy_compliance": 100,
    "security_defaults": 80,
    "privacy_defaults": 100,
    "discovery_fidelity": 95,
    "overall": 89
  },
  "next_actions": [
    "Resolve CRITICAL contradiction between PRD and schema on authentication requirement",
    "Remove invented integration 'magic-link-service' (not approved during discovery)"
  ]
}
```

Severity Rules
- Schema-asserting contradiction: CRITICAL (blocking, requires halt)
- Discovery drift: CRITICAL (blocking, requires halt)
- Security default violation: ERROR (blocking)
- Privacy default violation: ERROR or CRITICAL depending on jurisdiction
- Invented integration: CRITICAL
- Placeholder in final document: ERROR
- Cross-document contradiction on billing/security/core feature: CRITICAL
- Cross-document contradiction on minor feature: ERROR
- Policy violation: ERROR or WARNING depending on policy
- Assumption incoherence: WARNING
- Deferred security decision: ERROR

Failure Examples

Example 1: Authentication Schema Contradiction
Input:
```
Schema: authentication: required: false
PRD Section 3.2: "All users must log in before accessing any feature"
Result: CRITICAL CSV-001
Remediation: Update schema to require authentication
```

Example 2: Invented Integration
Input:
```
Discovery transcript: User mentions Stripe only
Generated Technical Spec references: Stripe, Plaid, Magic Link Service, SendGrid
Result: CRITICAL CSV-006
Remediation: Remove Plaid, Magic Link Service, SendGrid references
```

Example 3: Placeholder Persistence
Input:
```
Generated PRD Section 8: "Pricing details TBD"
Result: ERROR CSV-004
Remediation: Replace with actual pricing or remove section if pricing is not yet defined
```

Example 4: Discovery Drift
Input:
```
User: "I want to build a fitness app for seniors"
Generated PRD: "BOND - Couple's relationship wellness platform"
Result: CRITICAL CSV-003
Remediation: Halt generation; the generated project does not match user intent
```

Example 5: Deferred Security Decision
Input:
```
PRD: "Authentication strategy will be decided during implementation"
Result: ERROR CSV-017
Remediation: Authentication must be defined in PRD, not deferred
```

Example 6: Capability Out-of-Role
Input:
```
UX Agent generated document contains: API endpoint definitions
Result: ERROR CSV-007
Remediation: API definitions belong to Technical Spec Agent, not UX Agent
```

Pipeline Integration
The validator is invoked after Cross-Document Validation (Stage 10) and before Security Validation (Stage 11).
Invocation sequence:
1. Cross-Document Validator (03) completes
2. Consistency Validator (04) runs
3. Findings categorized by owner agent and severity
4. CRITICAL findings halt the pipeline immediately
5. ERROR findings block advancement to Stage 11 until remediated
6. WARNING findings logged for human review
7. PASS advances to Security Validation

Remediation Routing
- Schema-asserting contradiction -> schema-agent (and document owner)
- Cross-document contradiction -> all involved document owners
- Discovery drift -> discovery-agent + meta-orchestrator
- Placeholder persistence -> original document generator
- Invented entity/integration -> original document generator + meta-orchestrator
- Capability out-of-role -> meta-orchestrator
- Security default violation -> security-agent (or designated owner)
- Privacy default violation -> privacy-agent (or designated owner)

Performance Characteristics
For typical AppArchitect projects:
- 30 documents, ~10,000 statements
- Validation runtime: 10-30 seconds (semantic analysis is more expensive than reference checks)
- Memory footprint: 200-500 MB
- Uses LLM-based semantic comparison for cross-document contradictions
- Idempotent

Ownership
This validator is owned by:
- Validation Engine (executes rules)
- Consistency Validator Module (rule logic)
- Master Orchestrator (invocation and remediation routing)

End of File
**Authority:** Consistency Validator is the semantic immune system. Catches what reference validators miss.
**Next file:** `07-validation/05-completeness-validator.md`
