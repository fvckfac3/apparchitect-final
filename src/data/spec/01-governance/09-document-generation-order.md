governance/09-document-generation-order.md
Purpose
The Document Generation Order specification defines the authoritative sequence in which AppArchitect artifacts must be generated.
The purpose of generation ordering is to ensure:
• Dependency integrity
• Reference integrity
• Validation accuracy
• Deterministic generation
• Regeneration consistency
Documents must be generated in dependency order.
No document may be generated before all required source artifacts exist.
Generation Philosophy
AppArchitect does not generate documents independently.
Documents emerge from progressively refined project intelligence.
The system follows a layered generation model:
Knowledge ↓ Structure ↓ Architecture ↓ Behavior ↓ Documentation ↓ Validation ↓ Export 
Each layer depends upon the successful completion of previous layers.
Generation Hierarchy
The complete generation hierarchy is:
Founder Input ↓ Discovery Outputs ↓ Project Schema ↓ Architecture Object ↓ Workflow Models ↓ UX Specifications ↓ Product Documentation ↓ Technical Documentation ↓ Validation Artifacts ↓ Export Artifacts 
Generation Levels
The system defines nine generation levels.
Level 0: Founder Inputs
Purpose
Capture initial project intent.
Artifacts
Founder Idea Discovery Responses Requirements Statements Business Context 
Owner
Discovery Agent
Dependency Requirement
None.
Level 1: Discovery Artifacts
Purpose
Transform founder input into structured intelligence.
Artifacts
Discovery Summary Confidence Scores Assumption Registry Gap Registry Requirement Inventory 
Dependencies
Founder Inputs 
Owner
Discovery Agent
Level 2: Project Schema Artifacts
Purpose
Create canonical project structure.
Artifacts
Master Project Schema Entity Registry Relationship Registry Dependency Registry 
Dependencies
Discovery Artifacts 
Owner
Schema Agent
Level 3: Architecture Artifacts
Purpose
Define system implementation strategy.
Artifacts
Architecture Object Service Map Infrastructure Model Security Model Integration Map Data Architecture 
Dependencies
Project Schema 
Owner
Architecture Agent
Level 4: Workflow Artifacts
Purpose
Define system behavior.
Artifacts
Workflow Definitions State Models Decision Trees User Journeys 
Dependencies
Project Schema Architecture Object 
Owner
Workflow Agent
Level 5: UX Artifacts
Purpose
Define interface behavior.
Artifacts
Screen Specifications Navigation Maps Component Maps Interaction Definitions 
Dependencies
Workflow Definitions Project Schema 
Owner
UX Specification Agent
Level 6: Product Documentation
Purpose
Generate business and product specifications.
Artifacts
Product Requirements
Master PRD Feature Specifications User Story Catalog Acceptance Criteria 
Business Documentation
Business Rules Monetization Specifications Launch Planning Documents 
Dependencies
Project Schema Architecture Object Workflow Models UX Specifications 
Owner
PRD Agent
Level 7: Technical Documentation
Purpose
Generate implementation-ready technical specifications.
Artifacts
API Documentation
API Contracts Endpoint Definitions Authentication Specifications 
Data Documentation
Database Specifications Schema Definitions Data Dictionaries 
Infrastructure Documentation
Hosting Specifications Deployment Guides Infrastructure Configurations 
Integration Documentation
Integration Specifications Provider Configurations Webhook Definitions 
Dependencies
Architecture Object Project Schema PRD Documents 
Owner
Technical Specification Agent
Level 8: Validation Artifacts
Purpose
Verify project integrity.
Artifacts
Validation Reports Cross-Reference Reports Security Reviews Readiness Reports 
Dependencies
All Generated Documentation 
Owner
Validation Agent
Level 9: Export Artifacts
Purpose
Produce build-ready packages.
Artifacts
Export Bundle Build Package Agent Handoff Package Project Manifest 
Dependencies
Validation Reports Documentation Suite 
Owner
Export Agent
Mandatory Generation Sequence
The following order is mandatory.
Discovery ↓ Schema ↓ Architecture ↓ Workflows ↓ UX ↓ PRD ↓ Technical Documentation ↓ Validation ↓ Export 
No stage may be skipped.
Conditional Generation Rules
Certain documents generate only when specific schema conditions are met.
AI Documentation
Generate when:
ai_features: enabled: true 
Generated Artifacts:
Prompt Specifications Model Specifications AI Architecture Documents 
Monetization Documentation
Generate when:
monetization: enabled: true 
Generated Artifacts:
Billing Specifications Subscription Models Revenue Workflows 
Integration Documentation
Generate when:
integrations: 
contains entries.
Compliance Documentation
Generate when:
security: compliance: 
contains requirements.
Dependency Enforcement Rules
Rule 1
A document cannot generate before its source artifacts exist.
Example
Invalid:
API Contract 
generated before:
Architecture Object 
Result
Generation Blocked 
Rule 2
A document cannot generate from invalid artifacts.
Example
Architecture failed validation.
Result:
Technical Documentation Blocked 
Rule 3
Downstream generation requires upstream validation.
Regeneration Rules
When a source artifact changes:
All affected downstream artifacts must be evaluated.
Example
Updated:
Authentication Model 
Affected:
Security Specification API Contracts PRD QA Plans 
Regeneration Policy
regeneration: required: true 
for all impacted artifacts.
Parallel Generation Rules
Parallel generation is allowed when dependencies are satisfied.
Example
Workflow Generation ↓ ---------------- ↓ ↓ UX Docs PRD Docs ---------------- 
Requirements
Parallel generation must not:
• Create dependency conflicts
• Create ownership conflicts
• Bypass validation gates
Generation Readiness Model
Before generation begins:
The orchestration layer calculates readiness.
Inputs
schema_readiness: architecture_readiness: dependency_readiness: validation_readiness: 
Output
generation_readiness_score: 
Scale:
0-100 
Generation Failure Model
Generation failures fall into three categories.
Category 1: Missing Dependency
Example:
Required Architecture Missing 
Category 2: Validation Failure
Example:
Schema Validation Failed 
Category 3: Governance Failure
Example:
Document Violates Generation Rules 
Generation Manifest
Every generated artifact must record:
generation_manifest: artifact_id: artifact_type: generated_by: source_artifacts: dependencies: validation_status: generation_timestamp: version: 
Document Generation Matrix
Generation OrderArtifact ClassOwner0Founder InputsDiscovery Agent1Discovery ArtifactsDiscovery Agent2Project SchemaSchema Agent3Architecture ArtifactsArchitecture Agent4Workflow ArtifactsWorkflow Agent5UX ArtifactsUX Agent6Product DocumentationPRD Agent7Technical DocumentationTechnical Specification Agent8Validation ArtifactsValidation Agent9Export ArtifactsExport Agent 
Generation Result Schema
generation_result: project_id: artifact: generation_order: owner: status: dependencies: validation_status: readiness_score: generated_at: 
Ownership
This document is owned by:
Governance Layer Agent Orchestration Layer Validation Layer 
Responsibilities include:
• Generation sequencing
• Dependency enforcement
• Readiness governance
• Regeneration governance
• Export eligibility control
This document serves as the authoritative generation sequencing specification for all AppArchitect artifact production workflows.
End of governance/09-document-generation-order.md
Next file: