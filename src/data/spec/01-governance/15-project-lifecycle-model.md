governance/15-project-lifecycle-model.md
Purpose
The Project Lifecycle Model defines the complete lifecycle of every AppArchitect project.
Lifecycle Philosophy
Projects mature through controlled stages.
Each stage increases certainty, structure, and implementation readiness.
Lifecycle States
Idea ↓ Discovery ↓ Schema ↓ Architecture ↓ Documentation ↓ Validation ↓ Export ↓ Handoff ↓ Completed 
State Definitions
Idea
Project concept exists.
Discovery
Requirements gathering active.
Schema
Project structure established.
Architecture
System design established.
Documentation
Specifications generated.
Validation
Quality verification active.
Export
Packaging active.
Handoff
Delivery package generated.
Completed
Project package finalized.
Lifecycle Gates
Each transition requires:
gate: required_artifacts: validation_status: readiness_threshold: 
Lifecycle Readiness
Measured across:
readiness: discovery: schema: architecture: documentation: validation: export: 
Lifecycle Events
Examples:
Project Created Discovery Started Schema Approved Architecture Approved Validation Passed Export Generated Handoff Completed 
Lifecycle Audit Trail
Every lifecycle event must be recorded.
audit_event: project_id: event: timestamp: actor: result: 
Lifecycle Failure States
Paused Blocked Failed Escalated 
Recovery Paths
Blocked:
Fix Revalidate Resume 
Failed:
Repair Restart Stage 
Escalated:
Governance Review 
Lifecycle Completion Criteria
A project is complete when:
• All stages completed
• Validation passed
• Export package generated
• Handoff package delivered
• No blocking findings remain
Lifecycle Result Schema
project_lifecycle: project_id: current_state: completed_states: readiness_score: validation_status: completion_timestamp: 
Ownership
Governance Layer
Agent Orchestration Layer
Validation Layer
Export Layer
End of governance/15-project-lifecycle-model.md
