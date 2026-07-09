governance/01-master-project-schema.md
Master Project Schema Specification
Version: 1.0
Purpose
The Master Project Schema is the canonical source of truth for all AppArchitect-generated assets.
Every generated document, validation check, architecture model, workflow, export package, and build artifact must be traceable back to this schema.
No generated document may introduce information that is not represented in the Project Schema.
The Project Schema serves as the system-wide contract between:
• Discovery Agents
• Architecture Agents
• Documentation Agents
• Validation Agents
• Export Agents
• External Build Systems
Design Principles
Single Source of Truth
All project information originates from the Project Schema.
Generated documents are views of schema data.
Generated documents are not authoritative.
Schema data is authoritative.
Deterministic Generation
Given the same schema:
Input A ↓ Schema ↓ Output A 
The same outputs must be generated every time.
Agent Independence
Agents may consume schema data.
Agents may enrich schema data.
Agents may not bypass schema data.
Validation First
All outputs must be validated against schema definitions.
Root Schema Structure
project: metadata: vision: market: personas: roles: features: workflows: screens: authentication: permissions: data_model: ai_features: integrations: monetization: analytics: security: architecture: infrastructure: non_functional_requirements: launch_strategy: roadmap: 
Section 1
Project Metadata
Purpose
Defines project identity.
Schema
metadata: project_name: project_tagline: project_description: project_type: industry: project_stage: primary_goal: success_metrics: 
Required Fields
required: - project_name - project_description - project_type 
Section 2
Founder Vision
Purpose
Defines why the project exists.
Schema
vision: problem_statement: current_alternative: proposed_solution: why_now: long_term_vision: 
Required Fields
required: - problem_statement - proposed_solution 
Section 3
Target Market
Schema
market: target_market: geographic_scope: market_size_estimate: market_maturity: 
Section 4
User Personas
Schema
personas: - persona_id: name: description: pain_points: goals: behaviors: technical_skill_level: 
Validation Rules
minimum_personas: 1 
Section 5
User Roles
Schema
roles: - role_id: role_name: description: permission_level: 
Examples
Guest User PremiumUser Moderator Admin SuperAdmin 
Section 6
Features
Schema
features: - feature_id: name: description: priority: business_value: complexity: 
Priority Levels
Critical High Medium Low 
Section 7
Workflows
Schema
workflows: - workflow_id: name: trigger: steps: outcome: 
Section 8
Screens
Schema
screens: - screen_id: name: purpose: accessible_roles: 
Section 9
Authentication
Schema
authentication: required: providers: passwordless: mfa: 
Providers
Email Google Apple GitHub Facebook MagicLink 
Section 10
Permissions
Schema
permissions: - permission_id: role: resource: actions: 
Section 11
Data Model
Schema
entities: - entity_id: entity_name: description: fields: 
Section 12
AI Features
Schema
ai_features: enabled: use_cases: models: prompting_strategy: memory_required: vector_database_required: 
Section 13
Integrations
Schema
integrations: - integration_id: service: purpose: required: 
Section 14
Monetization
Schema
monetization: revenue_model: pricing_tiers: billing_frequency: free_plan: 
Section 15
Analytics
Schema
analytics: events: kpis: reporting_frequency: 
Section 16
Security
Schema
security: compliance: audit_logging: encryption: data_classification: 
Section 17
Architecture
Schema
architecture: frontend: backend: database: hosting: storage: caching: search: 
Section 18
Infrastructure
Schema
infrastructure: environments: - development - staging - production 
Section 19
Non Functional Requirements
Schema
non_functional_requirements: performance: scalability: availability: accessibility: 
Section 20
Launch Strategy
Schema
launch_strategy: launch_type: marketing_channels: acquisition_strategy: 
Section 21
Roadmap
Schema
roadmap: mvp_features: phase_2_features: phase_3_features: 
Document Generation Mapping
Schema SectionDocuments GeneratedMetadataProject BriefVisionProject BriefPersonasUser Personas PRDRolesRoles MatrixFeaturesCore Systems PRDWorkflowsUX PRDArchitectureTechnical Architecture PRDData ModelData & Integration PRDMonetizationMonetization PRDSecuritySecurity PRDAnalyticsAnalytics PRDEntire SchemaTest PlanEntire SchemaBuild Handoff 
Schema Completion Requirements
Minimum generation readiness:
required_completion_percentage: 95 required_sections: - metadata - vision - personas - features - workflows - architecture 
Ownership
ComponentOwnerSchema CreationDiscovery AgentSchema ExpansionArchitect AgentSchema ValidationValidation AgentSchema ConsumptionDocumentation AgentSchema ExportExport Agent 
End of File