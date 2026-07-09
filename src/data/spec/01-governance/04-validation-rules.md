governance/04-validation-rules.md
Purpose
The Validation Rules framework defines how AppArchitect determines whether a project is complete, internally consistent, technically viable, generation-ready, and eligible for export.
Validation exists to prevent the generation of incomplete, contradictory, ambiguous, non-buildable, or low-confidence outputs.
All generated artifacts must pass validation before progressing to subsequent lifecycle stages.
Validation operates across:
• Discovery
• Schema Population
• Architecture Design
• Documentation Generation
• Export Packaging
Validation is a first-class system capability and is not optional.
No project may advance beyond a validation gate when blocking errors remain unresolved.
Validation Philosophy
AppArchitect follows five validation principles:
1. Completeness Before Generation
A document cannot be generated if required source information is missing.
Example:
• Authentication PRD cannot generate if authentication model is undefined.
2. Consistency Before Expansion
Generated outputs must not contradict previously generated outputs.
Example:
Schema:
authentication: required: false 
PRD:
Users must create accounts before accessing features. 
Result:
Validation Failure Contradictory Authentication Requirements 
3. Traceability Before Approval
Every generated statement must be traceable to:
• Project Schema
• Generation Rule
• User Discovery Input
• Derived Assumption
No orphaned requirements are permitted.
4. Buildability Before Export
Documentation must describe an implementable system.
Non-buildable outputs are rejected.
Example:
AI will understand user emotions perfectly. 
Result:
Validation Failure Non-Implementable Requirement 
5. Confidence Before Automation
Low-confidence assumptions require explicit visibility.
Assumptions may never be silently converted into requirements.
Validation Categories
Validation is divided into specialized domains.
Category 1: Schema Validation
Purpose:
Ensure the Master Project Schema is structurally complete.
Validates:
• Required fields
• Data types
• Enumerations
• References
• Relationships
• Ownership
Schema Validation Rules
Required sections:
metadata vision market personas features workflows architecture 
Missing required section:
Blocking Error 
Type Validation
Example:
Valid:
estimated_users: 10000 
Invalid:
estimated_users: "many" 
Enumeration Validation
Example:
authentication: type: oauth 
Allowed:
oauth password passwordless magic_link sso 
Any unsupported value fails validation.
Relationship Validation
Every referenced entity must exist.
Example:
workflow: screen_id: dashboard 
Dashboard screen must exist.
Category 2: Document Validation
Purpose:
Ensure generated documents are complete and structurally valid.
Required Sections Validation
Each document template defines mandatory sections.
Example:
Technical Architecture Document:
Required:
Overview System Components Data Flow Infrastructure Dependencies Security Deployment 
Missing section:
Error 
Content Presence Validation
Headers without content fail validation.
Invalid:
## Security 
Valid:
## Security The platform shall... 
Placeholder Validation
Disallowed:
TBD TODO PLACEHOLDER Coming Soon Insert Content Here 
Presence triggers validation failure.
Category 3: Cross-Reference Validation
Purpose:
Ensure generated documents remain synchronized.
Schema-to-Document Validation
Every major schema object must appear where required.
Example:
Schema contains:
authentication: enabled: true 
Authentication specification must exist.
Document-to-Schema Validation
Documents may not introduce unsupported requirements.
Example:
PRD introduces:
Blockchain wallet login 
Schema lacks blockchain authentication.
Result:
Validation Failure Unsupported Requirement 
Bidirectional Consistency
References must resolve in both directions.
Example:
Workflow references screen.
Screen references workflow.
Both must exist.
Category 4: Workflow Validation
Purpose:
Ensure user flows are executable.
Start State Validation
Every workflow must define:
start_state 
End State Validation
Every workflow must define:
end_state 
Transition Validation
Every transition must connect valid states.
Example:
login → dashboard 
Dashboard must exist.
Dead-End Detection
Invalid:
login → dashboard → null 
Result:
Workflow Dead End 
Loop Detection
Infinite loops must be flagged.
Allowed:
Intentional loops.
Disallowed:
Unintentional navigation loops.
Category 5: Architecture Validation
Purpose:
Ensure architecture is technically coherent.
Component Validation
All architecture components must:
• Have ownership
• Have responsibilities
• Have dependencies
Service Dependency Validation
Circular dependencies prohibited.
Invalid:
Service A → Service B Service B → Service A 
Data Flow Validation
All data flows must define:
• Source
• Destination
• Trigger
• Payload
Integration Validation
External integrations require:
• Purpose
• Authentication method
• Data exchanged
Infrastructure Validation
Required:
• Hosting
• Database
• Storage
• Monitoring
Category 6: Security Validation
Purpose:
Ensure baseline security requirements are satisfied.
Authentication Validation
Protected functionality requires authentication strategy.
Authorization Validation
Roles must define permissions.
Data Protection Validation
Sensitive data requires:
• Encryption at rest
• Encryption in transit
Compliance Validation
Applicable compliance requirements must be declared.
Examples:
• GDPR
• SOC2
• HIPAA
• CCPA
Secret Management Validation
Hardcoded secrets prohibited.
Category 7: AI Validation
Purpose:
Ensure AI systems are governable and safe.
Prompt Validation
Prompts require:
• Inputs
• Outputs
• Constraints
• Failure Handling
Model Validation
Model selection must be defined.
Example:
provider: openai model: gpt-5.5 
AI Safety Validation
Required:
• Prompt injection strategy
• Hallucination mitigation
• Escalation behavior
Confidence Validation
AI-generated assumptions require confidence scores.
Category 8: Export Validation
Purpose:
Ensure exports are complete and consumable.
Package Completeness
Export package must include:
• Schema
• Architecture
• Documentation
• Validation Report
File Integrity Validation
Required:
• Valid file names
• Valid formatting
• No corruption
Dependency Completeness
Required supporting files must exist.
Validation Severity Levels
Level 0: Informational
No action required.
Example:
Architecture could be optimized. 
Level 1: Warning
Should be reviewed.
Generation may continue.
Level 2: Error
Generation cannot proceed.
Correction required.
Level 3: Critical
Project state invalid.
Immediate remediation required.
Validation Pipeline
Validation executes in ordered stages.
Schema Validation ↓ Discovery Validation ↓ Architecture Validation ↓ Document Validation ↓ Cross Reference Validation ↓ Security Validation ↓ AI Validation ↓ Export Validation 
Failure halts progression.
Validation Outputs
Every validation run produces:
validation_run: id: timestamp: project_id: validator: result: 
Validation Summary
summary: passed: warnings: errors: critical: 
Findings
findings: - category: severity: rule: description: remediation: 
Readiness Score
readiness_score: discovery: architecture: documentation: export: 
Scale:
0-100 
Validation Result Schema
validation_result: run_id: project_id: timestamp: status: pass|fail readiness_score: findings: - id: category: severity: rule: source: description: remediation: owner: statistics: total_checks: passed_checks: warnings: errors: critical: next_actions: 
Examples
Example 1: Missing Authentication Strategy
Schema:
authentication: enabled: true 
Architecture:
authentication: null 
Result:
severity: error category: architecture rule: AUTH-001 description: Authentication enabled but no strategy defined. 
Example 2: Missing Screen Reference
Workflow:
checkout → payment 
Screen:
payment 
Missing.
Result:
severity: error category: workflow rule: WF-004 
Example 3: Unsupported Requirement
PRD:
Users can authenticate with blockchain wallets. 
Schema:
authentication: supported: - password 
Result:
severity: critical category: cross_reference rule: DOC-011 
Example 4: Export Package Failure
Export:
Missing Technical Architecture Document 
Result:
severity: critical category: export rule: EXP-002 
Ownership
Validation governance is owned by:
Validation Engine Governance Layer Agent Orchestration Layer 
Responsibilities:
Validation Engine
• Execute rules
• Produce findings
• Block invalid progression
Governance Layer
• Define validation policy
• Maintain rule catalog
• Approve validation updates
Agent Orchestration Layer
• Route validation tasks
• Resolve validation dependencies
• Enforce validation gates
This document serves as the authoritative validation standard for all AppArchitect generation, review, approval, and export workflows.