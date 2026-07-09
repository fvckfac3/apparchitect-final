governance/10-system-glossary.md
Purpose
The System Glossary establishes the canonical vocabulary of AppArchitect.
This document serves as the authoritative definition source for:
• Governance documents
• Agents
• Schemas
• Prompts
• Workflows
• Architecture objects
• Validation systems
• Export systems
• Generated project artifacts
Every term defined here has a specific meaning within AppArchitect.
When conflicts occur between common-language definitions and glossary definitions:
The glossary definition prevails.
Glossary Governance
Rule 1
A defined term must always be used consistently.
Rule 2
New platform concepts require glossary entries.
Rule 3
Deprecated terms must remain documented for backward compatibility.
Rule 4
Synonyms are prohibited in system documentation when a canonical term exists.
Example:
Approved:
Project Schema 
Not Approved:
Master Object 
unless explicitly defined.
Section A: Core Platform Concepts
AppArchitect
Definition
The AI Product Architecture platform responsible for transforming founder ideas into build-ready implementation packages.
Responsibilities
• Discovery
• Structuring
• Architecture
• Documentation
• Validation
• Export
Not Responsible For
• Application development
• Runtime hosting
• Software deployment
Founder
Definition
The individual or organization providing project requirements.
Examples
Startup Founder Business Owner Product Manager Agency Client 
Project
Definition
A complete product initiative managed within AppArchitect.
Includes
• Discovery
• Schema
• Architecture
• Documentation
• Validation
• Export
Project Intelligence
Definition
The aggregate body of knowledge accumulated about a project throughout the generation lifecycle.
Sources
• Discovery
• Schema
• Architecture
• Documentation
Section B: Discovery Concepts
Discovery
Definition
The structured process of transforming unstructured founder intent into machine-readable project intelligence.
Discovery Agent
Definition
The specialized agent responsible for conducting discovery workflows.
Responsibilities
• Interviewing
• Clarification
• Gap Detection
• Assumption Tracking
Discovery Session
Definition
A bounded interaction used to collect project intelligence.
Discovery Output
Definition
Structured information produced by the Discovery Agent.
Assumption
Definition
Information inferred but not explicitly confirmed.
Example
Founder requests subscriptions. Billing provider assumed to be Stripe. 
Gap
Definition
Required information that has not yet been provided.
Example
Authentication model undefined. 
Confidence Score
Definition
A numerical estimate representing confidence in a generated interpretation.
Range
0.0 - 1.0 
Section C: Schema Concepts
Project Schema
Definition
The canonical representation of all project requirements.
Role
The single source of truth for project generation.
Canonical
Definition
Official, authoritative, and governing.
Schema Object
Definition
Any individual object contained within the Project Schema.
Examples
Feature Workflow Persona Integration 
Entity
Definition
A distinct business or technical object represented within the project.
Examples
User JournalEntry Subscription Invoice 
Relationship
Definition
A defined connection between two schema objects.
Example
User owns JournalEntry 
Dependency
Definition
A required relationship in which one object relies on another.
Section D: Architecture Concepts
Architecture Object
Definition
The complete implementation design derived from the Project Schema.
Includes
• Services
• Infrastructure
• Integrations
• Security
• Data Models
Service
Definition
An independently defined system capability.
Examples
Authentication Service Billing Service Notification Service 
Infrastructure
Definition
The underlying technical environment supporting a system.
Integration
Definition
A connection between the platform and an external provider.
Examples
Stripe OpenAI Twilio 
Data Flow
Definition
The movement of information between system components.
Component
Definition
A discrete architectural element.
Section E: Product Concepts
Feature
Definition
A user-visible capability that delivers value.
Example
Goal Tracking 
Persona
Definition
A modeled user archetype representing a target audience segment.
User Story
Definition
A requirement expressed from a user's perspective.
Format
As a user, I want... So that... 
Workflow
Definition
A sequence of actions resulting in an outcome.
User Journey
Definition
A user-centered representation of workflow progression.
Screen
Definition
A defined interface view.
Navigation Flow
Definition
The movement between screens.
Section F: AI Concepts
AI Feature
Definition
A feature requiring AI model participation.
Prompt
Definition
A structured instruction sent to an AI model.
Prompt Contract
Definition
A formal specification governing prompt inputs and outputs.
Model
Definition
The AI system responsible for generating outputs.
Hallucination
Definition
Generated information unsupported by source data.
Prompt Injection
Definition
An attempt to alter system behavior through malicious instructions.
Context Window
Definition
The total information available to a model during execution.
Section G: Documentation Concepts
Documentation Suite
Definition
The complete collection of generated project documents.
PRD
Definition
Product Requirements Document.
Technical Specification
Definition
Implementation-focused engineering documentation.
API Contract
Definition
A formal definition of interface behavior.
Acceptance Criteria
Definition
Conditions that determine completion.
Deliverable
Definition
A generated artifact intended for consumption.
Section H: Validation Concepts
Validation
Definition
The process of determining whether outputs satisfy requirements.
Validation Rule
Definition
A machine-executable governance requirement.
Validation Gate
Definition
A checkpoint that must be passed before progression.
Finding
Definition
A validation result.
Severity
Definition
The impact level of a finding.
Values
Info Warning Error Critical 
Readiness Score
Definition
A numerical indicator of project maturity.
Range
0-100 
Section I: Orchestration Concepts
Agent
Definition
A specialized autonomous system responsible for a defined domain.
Agent Contract
Definition
The formal specification governing agent behavior.
Orchestration
Definition
The coordination of agent execution.
Pipeline
Definition
The ordered sequence of generation stages.
Stage
Definition
A discrete step within the pipeline.
Escalation
Definition
Transfer of decision authority to a higher-governance system.
Retry
Definition
A controlled re-execution attempt.
Section J: Export Concepts
Export
Definition
The process of packaging generated artifacts.
Export Package
Definition
The final collection of project deliverables.
Handoff Package
Definition
The build-ready package intended for development systems.
Manifest
Definition
Metadata describing package contents.
Section K: Governance Concepts
Governance
Definition
The framework responsible for enforcing platform standards.
Governance Rule
Definition
A mandatory policy governing system behavior.
Policy
Definition
A formal operating requirement.
Compliance
Definition
Conformance with governance requirements.
Ownership
Definition
Assigned responsibility for a system, artifact, or process.
Authority
Definition
The right to approve, reject, modify, or enforce decisions.
Section L: Lifecycle Concepts
Lifecycle
Definition
The complete progression of a project through AppArchitect.
Generation
Definition
Creation of structured outputs from source inputs.
Regeneration
Definition
Rebuilding artifacts due to upstream changes.
Version
Definition
A uniquely identifiable state of an artifact.
Lineage
Definition
The chain of source artifacts from which an artifact was produced.
Traceability
Definition
The ability to connect outputs back to their origins.
Reserved Terms
The following terms are reserved platform vocabulary:
Project Schema Architecture Object Discovery Agent Validation Agent Governance Layer Generation Pipeline Readiness Score Export Package Handoff Package Agent Contract 
Reserved terms may not be redefined elsewhere.
Deprecation Policy
Deprecated terms must include:
deprecated_term: replacement: reason: deprecation_version: 
Historical references must remain resolvable.
Glossary Entry Schema
glossary_entry: term: category: definition: related_terms: status: 
Ownership
This document is owned by:
Governance Layer Schema Layer Agent Orchestration Layer 
Responsibilities include:
• Vocabulary governance
• Terminology standardization
• Definition management
• Cross-document consistency
• Semantic integrity
This document serves as the authoritative vocabulary and terminology standard for all AppArchitect systems, agents, schemas, workflows, prompts, validations, exports, and generated artifacts.
End of governance/10-system-glossary.md
