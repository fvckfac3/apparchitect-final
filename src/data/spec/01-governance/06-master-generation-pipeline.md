governance/06-master-generation-pipeline.md
Purpose
The Master Generation Pipeline defines the authoritative process through which AppArchitect transforms an unstructured founder idea into a validated, build-ready project package.
This document governs:
• Pipeline stages
• Stage ownership
• Stage inputs
• Stage outputs
• Validation gates
• Escalation rules
• Recovery procedures
• Completion criteria
Every AppArchitect project must pass through this pipeline.
No alternate generation path may bypass pipeline governance.
Pipeline Philosophy
AppArchitect is not a document generator.
AppArchitect is a structured project intelligence system.
The pipeline exists to progressively reduce uncertainty while increasing implementation specificity.
The system transforms:
Unknown ↓ Known ↓ Structured ↓ Architected ↓ Specified ↓ Validated ↓ Buildable 
Each stage increases project maturity.
Pipeline Overview
Founder Idea ↓ Discovery ↓ Schema Construction ↓ Schema Validation ↓ Architecture Design ↓ Architecture Validation ↓ Workflow Generation ↓ UX Specification ↓ Documentation Generation ↓ Cross-Reference Validation ↓ Security Validation ↓ Export Generation ↓ Export Validation ↓ Build Handoff Package 
Pipeline Stage Model
Every stage must define:
stage: name: owner: inputs: outputs: validation_gate: success_criteria: 
No stage may execute without a formal definition.
Stage 1: Founder Input
Purpose
Capture initial project intent.
Inputs
founder: idea: goals: constraints: 
Outputs
initial_project_context: 
Success Criteria
Project concept exists.
Owner
Discovery Agent
Stage 2: Discovery
Purpose
Transform founder intent into structured understanding.
Activities
• Interviewing
• Clarification
• Ambiguity detection
• Gap identification
• Assumption capture
Outputs
discovery_output: requirements: assumptions: confidence_scores: 
Validation Gate
Discovery Validation
Success Criteria
Required discovery domains completed.
Owner
Discovery Agent
Stage 3: Schema Construction
Purpose
Convert discovery outputs into canonical project structure.
Activities
• Entity creation
• Relationship mapping
• Requirement normalization
• Dependency registration
Outputs
project_schema: 
Validation Gate
Schema Validation
Success Criteria
Required schema sections populated.
Owner
Schema Agent
Stage 4: Schema Validation
Purpose
Verify schema completeness and integrity.
Validation Areas
• Required fields
• Relationships
• Enumerations
• Dependencies
• Ownership
Outputs
schema_validation_report: 
Success Criteria
No blocking schema failures.
Owner
Validation Agent
Stage 5: Architecture Design
Purpose
Generate implementation-ready system architecture.
Activities
• Service decomposition
• Infrastructure design
• Data modeling
• Integration design
• Security architecture
Outputs
architecture_object: 
Validation Gate
Architecture Validation
Owner
Architecture Agent
Stage 6: Architecture Validation
Purpose
Verify architecture feasibility and consistency.
Validation Areas
• Scalability
• Security
• Data flow
• Service boundaries
• Integration compatibility
Outputs
architecture_validation_report: 
Success Criteria
Architecture approved.
Owner
Validation Agent
Stage 7: Workflow Generation
Purpose
Define executable user and system behavior.
Activities
• User journeys
• State machines
• Decision trees
• Process mapping
Outputs
workflow_models: 
Owner
Workflow Agent
Stage 8: UX Specification
Purpose
Define user-facing application structure.
Activities
• Screen inventory
• Navigation mapping
• Component definition
• Layout specification
Outputs
ux_specification: 
Owner
UX Specification Agent
Stage 9: Documentation Generation
Purpose
Produce complete project documentation.
Document Classes
Product Documents
Examples:
• PRDs
• Feature Specs
• User Stories
Architecture Documents
Examples:
• System Design
• Data Models
• Service Maps
Technical Documents
Examples:
• API Contracts
• Infrastructure Specs
• Integration Specs
Operational Documents
Examples:
• QA Plans
• Validation Reports
• Deployment Guides
Outputs
documentation_suite: 
Owner
Documentation Agents
Stage 10: Cross-Reference Validation
Purpose
Verify documentation consistency.
Validation Areas
• Schema consistency
• Architecture consistency
• Workflow consistency
• Requirement traceability
Outputs
cross_reference_report: 
Owner
Validation Agent
Stage 11: Security Validation
Purpose
Verify security requirements.
Validation Areas
• Authentication
• Authorization
• Encryption
• Compliance
• Secrets Management
Outputs
security_validation_report: 
Owner
Validation Agent
Stage 12: Export Generation
Purpose
Assemble project deliverables.
Activities
• Packaging
• Formatting
• Bundling
• Metadata creation
Outputs
export_package: 
Owner
Export Agent
Stage 13: Export Validation
Purpose
Verify export completeness.
Validation Areas
• Required files
• Package integrity
• Dependency completeness
• File structure
Outputs
export_validation_report: 
Owner
Validation Agent
Stage 14: Build Handoff
Purpose
Deliver implementation-ready project package.
Deliverables
handoff_package: schema: architecture: workflows: documentation: validation_reports: 
Owner
Export Agent
Pipeline Gates
No stage may advance without passing its validation gate.
Gate Types
Informational
Proceed automatically.
Warning
Proceed with audit record.
Error
Block advancement.
Critical
Terminate pipeline execution.
Pipeline Recovery Model
Retry
Used for recoverable failures.
Examples
• Missing field
• Invalid reference
• Incomplete document
Repair
Used when automated correction is possible.
Examples
• Broken references
• Missing metadata
Escalation
Used when governance review is required.
Examples
• Contradictory requirements
• Security violations
• Architecture conflicts
Pipeline State Machine
Allowed states:
Initialized Discovery Schema Architecture Workflows UX Documentation Validation Export Completed Failed Paused Escalated 
Artifact Evolution Model
Artifacts mature throughout pipeline progression.
Example:
Founder Idea ↓ Discovery Notes ↓ Structured Requirements ↓ Project Schema ↓ Architecture Object ↓ Documentation Suite ↓ Export Package 
Every artifact must preserve lineage.
Traceability Requirements
Every generated artifact must reference:
traceability: project_id: source_artifacts: source_agents: generation_timestamp: generation_version: 
Pipeline Metrics
The system shall record:
• Total runtime
• Stage runtime
• Validation duration
• Retry count
• Failure count
• Escalation count
• Artifact count
• Readiness score
Readiness Model
Pipeline readiness is measured across:
readiness: discovery: schema: architecture: documentation: validation: export: 
Scale:
0-100 
Completion Criteria
A project is considered complete when:
• All pipeline stages finished
• Validation passed
• Required documents generated
• Required exports generated
• No blocking findings remain
• Readiness score exceeds threshold
Pipeline Result Schema
pipeline_result: project_id: status: current_stage: completed_stages: readiness_score: validation_summary: generated_artifacts: export_package: completion_timestamp: 
Ownership
This document is owned by:
Governance Layer Agent Orchestration Layer Validation Layer 
Responsibilities include:
• Pipeline governance
• Stage definitions
• Validation gate enforcement
• Lifecycle management
• Progression policy
This document serves as the authoritative generation pipeline specification for all AppArchitect project creation workflows.
End of governance/06-master-generation-pipeline.md
Next file: