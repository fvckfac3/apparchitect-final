governance/07-project-intake-schema-map.md
Purpose
The Project Intake Schema Map defines how founder-provided information is transformed into the canonical AppArchitect Project Schema.
This document serves as the authoritative translation layer between:
Founder Input ↓ Discovery Intelligence ↓ Project Schema Population 
The purpose of the intake mapping system is to ensure:
• Consistent project interpretation
• Complete schema population
• Reduced ambiguity
• Structured requirement capture
• Predictable generation behavior
No schema object may exist without a defined intake mapping strategy.
Intake Philosophy
Founders rarely describe products using technical language.
AppArchitect must translate:
Ideas Goals Problems Vision Assumptions Constraints 
into:
Requirements Features Workflows Architecture Infrastructure Documentation 
The intake layer functions as the bridge between human intent and machine-readable project intelligence.
Intake Transformation Model
Founder Statement ↓ Intent Extraction ↓ Requirement Identification ↓ Schema Mapping ↓ Relationship Mapping ↓ Validation ↓ Project Schema 
Intake Categories
All founder input is classified into one or more intake categories.
Category 1: Vision
Captures the desired future state.
Example Inputs
I want to help people stay sober. I want a marketplace for local artists. 
Schema Destination
vision: 
Required Fields
vision: mission: outcome: success_definition: 
Category 2: Problem Space
Captures the problem being solved.
Example Inputs
People struggle to stay accountable. Artists cannot find local buyers. 
Schema Destination
market: problems: 
Required Fields
problem: description: severity: affected_users: 
Category 3: Target Users
Captures intended audience.
Example Inputs
People in recovery. Independent artists. 
Schema Destination
personas: 
Generated Objects
persona: id: name: goals: frustrations: behaviors: 
Category 4: Features
Captures desired functionality.
Example Inputs
Users should be able to track progress. Users should receive reminders. 
Schema Destination
features: 
Generated Structure
feature: id: name: description: priority: owner: 
Category 5: Workflows
Captures user behavior.
Example Inputs
Users sign up and complete onboarding. 
Schema Destination
workflows: 
Generated Structure
workflow: id: trigger: steps: outcome: 
Category 6: Screens
Captures interface requirements.
Example Inputs
Users should have a dashboard. There should be a profile page. 
Schema Destination
screens: 
Generated Structure
screen: id: name: purpose: components: 
Category 7: Data Requirements
Captures information the system must store.
Example Inputs
Store journal entries. Store user goals. 
Schema Destination
data_model: 
Generated Structure
entity: name: fields: relationships: 
Category 8: Authentication
Captures access requirements.
Example Inputs
Users need accounts. Allow Google login. 
Schema Destination
authentication: 
Generated Structure
authentication: required: methods: session_strategy: 
Category 9: Roles & Permissions
Captures access control.
Example Inputs
Admins can manage users. Moderators can review content. 
Schema Destination
roles: permissions: 
Category 10: AI Features
Captures AI functionality.
Example Inputs
AI should summarize journals. AI should answer questions. 
Schema Destination
ai_features: 
Generated Structure
ai_feature: purpose: inputs: outputs: model_requirements: 
Category 11: Integrations
Captures external system requirements.
Example Inputs
Connect Stripe. Integrate Google Calendar. 
Schema Destination
integrations: 
Generated Structure
integration: provider: purpose: authentication: 
Category 12: Monetization
Captures revenue requirements.
Example Inputs
Monthly subscriptions. Charge per transaction. 
Schema Destination
monetization: 
Generated Structure
monetization: model: pricing: billing_frequency: 
Category 13: Analytics
Captures measurement requirements.
Example Inputs
Track retention. Track onboarding completion. 
Schema Destination
analytics: 
Category 14: Security
Captures security requirements.
Example Inputs
Need HIPAA compliance. Encrypt all user data. 
Schema Destination
security: 
Category 15: Infrastructure
Captures deployment requirements.
Example Inputs
Must support one million users. Deploy on AWS. 
Schema Destination
infrastructure: 
Category 16: Non-Functional Requirements
Captures quality constraints.
Examples
Fast response times. Highly reliable. 
Schema Destination
non_functional_requirements: 
Generated Structure
requirement: category: metric: target: 
Intent Extraction Rules
The Discovery Agent must classify all founder statements.
Single Intent
Example:
Users should receive reminders. 
Maps to:
features: 
Multi-Intent
Example:
Users should receive AI-generated reminders by SMS. 
Maps to:
features: ai_features: integrations: 
Multiple schema sections may be populated from a single statement.
Confidence Scoring Model
Every mapped field receives a confidence score.
Scale
0.0 - 1.0 
High Confidence
confidence: 0.90+ 
Explicitly stated.
Medium Confidence
confidence: 0.60-0.89 
Reasonably inferred.
Low Confidence
confidence: <0.60 
Requires clarification.
Assumption Tracking
When required information is missing:
assumption: id: description: confidence: source: 
Assumptions must never become requirements without validation.
Gap Detection Framework
The Discovery Agent must identify missing information.
Example Gaps
Authentication undefined Target users undefined Monetization undefined 
Gap Output
gap: category: description: severity: 
Intake Completeness Model
A project intake is considered complete when all required intake domains have been evaluated.
Required domains:
Vision Problem Users Features Workflows Architecture Signals Data Requirements Security Monetization 
Intake Result Schema
intake_result: project_id: extracted_intents: mapped_schema_fields: assumptions: gaps: confidence_scores: completeness_score: readiness_status: 
Ownership
This document is owned by:
Discovery Agent Schema Agent Governance Layer 
Responsibilities include:
• Intake classification
• Intent extraction
• Schema mapping
• Assumption governance
• Gap detection
This document serves as the authoritative mapping specification between founder intent and the AppArchitect Project Schema.
End of governance/07-project-intake-schema-map.md
Next file: