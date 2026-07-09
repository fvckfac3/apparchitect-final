governance/05-agent-orchestration-map.md
Purpose
The Agent Orchestration Map defines how autonomous agents within AppArchitect collaborate to transform an initial founder idea into a validated, build-ready handoff package.
This document serves as the authoritative specification for:
• Agent responsibilities
• Agent ownership boundaries
• Agent communication contracts
• Agent execution order
• Agent dependencies
• Agent escalation procedures
• Agent failure recovery
• Agent governance enforcement
The orchestration layer exists to ensure that all generated outputs remain:
• Consistent
• Traceable
• Validated
• Governed
• Reproducible
Without requiring manual coordination between individual agents.
Orchestration Philosophy
AppArchitect does not use a single monolithic AI agent.
Instead, it employs a distributed specialist-agent architecture.
Each agent:
• Owns a specific domain
• Has clearly defined inputs
• Produces defined outputs
• Operates within governance constraints
• Cannot modify unauthorized artifacts
The orchestration layer functions as the operating system for all agent activity.
Core Principles
Principle 1: Single Responsibility
Every agent owns one domain.
Example:
Discovery Agent
Owns:
• Discovery
• Interviewing
• Schema population
Does not own:
• Architecture
• Validation
• Export generation
Principle 2: Deterministic Outputs
Identical inputs should produce materially identical outputs.
Agents may not introduce arbitrary requirements.
Principle 3: Traceability
Every output must identify:
source_agent: source_inputs: generation_timestamp: generation_version: 
Principle 4: Governance First
Governance rules override agent decisions.
If agent output conflicts with governance:
Governance wins.
Always.
Principle 5: Validation Before Handoff
Agents never pass outputs directly to downstream agents.
Outputs must pass validation gates.
Orchestration Architecture
Founder ↓ Discovery Agent ↓ Schema Agent ↓ Architecture Agent ↓ Documentation Agents ↓ Validation Agent ↓ Export Agent ↓ AI Development Team 
Each stage consumes validated outputs from the previous stage.
Agent Registry
Agent: Discovery Agent
Purpose
Transform founder ideas into structured project intelligence.
Responsibilities
• Discovery interviews
• Clarification questioning
• Ambiguity detection
• Assumption identification
• Confidence scoring
• Schema population
Inputs
founder_input: conversation_history: existing_schema: 
Outputs
project_schema: assumptions: confidence_scores: discovery_summary: 
Ownership
Owns:
• Discovery
Does Not Own:
• Architecture
• Documentation
Agent: Schema Agent
Purpose
Transform discovery outputs into canonical project structures.
Responsibilities
• Schema normalization
• Entity creation
• Relationship mapping
• Requirement organization
• Dependency registration
Inputs
project_schema: 
Outputs
normalized_schema: dependency_map: entity_graph: 
Ownership
Owns:
• Schema structure
Does Not Own:
• User interviews
• Architecture decisions
Agent: Architecture Agent
Purpose
Design implementation-ready system architecture.
Responsibilities
• System decomposition
• Service architecture
• Infrastructure planning
• Integration design
• Data architecture
• Security architecture
Inputs
normalized_schema: dependency_map: 
Outputs
architecture_object: service_map: data_model: integration_map: 
Ownership
Owns:
• Architecture
Does Not Own:
• Discovery
• Documentation generation
Agent: Workflow Agent
Purpose
Generate executable user and system workflows.
Responsibilities
• User journeys
• State transitions
• Workflow diagrams
• Decision trees
Inputs
schema: architecture: 
Outputs
workflow_definitions: state_models: journey_maps: 
Ownership
Owns:
• Workflows
Agent: UX Specification Agent
Purpose
Generate screen-level specifications.
Responsibilities
• Screen definitions
• Navigation mapping
• Layout structures
• Component mapping
Outputs
screen_specs: navigation_maps: component_inventory: 
Agent: PRD Agent
Purpose
Generate Product Requirement Documents.
Responsibilities
• Feature specifications
• Business requirements
• Functional requirements
• User stories
Outputs
prd_documents: 
Agent: Technical Specification Agent
Purpose
Generate implementation documentation.
Responsibilities
• API specifications
• Database specifications
• Infrastructure specifications
• Integration specifications
Outputs
technical_documents: 
Agent: Validation Agent
Purpose
Evaluate system completeness and correctness.
Responsibilities
• Execute validation rules
• Generate findings
• Calculate readiness
• Enforce gates
Inputs
All generated artifacts.
Outputs
validation_report: readiness_score: findings: 
Authority
Can block all downstream progression.
Agent: Export Agent
Purpose
Generate build-ready handoff packages.
Responsibilities
• Packaging
• File generation
• Formatting
• Export assembly
Inputs
Validated project artifacts.
Outputs
export_package: handoff_bundle: 
Agent: Governance Agent
Purpose
Enforce platform standards.
Responsibilities
• Rule enforcement
• Policy enforcement
• Escalation handling
• Agent compliance monitoring
Authority
Highest system authority.
Orchestration Layer
Purpose
Coordinate all agents.
The orchestration layer is not a content-generating agent.
It is a coordination system.
Responsibilities
• Agent routing
• Dependency management
• Queue management
• Retry handling
• Failure recovery
• State tracking
Agent Communication Model
Agents communicate exclusively through structured artifacts.
Agents do not communicate through natural language.
Communication Format
message: source_agent: destination_agent: timestamp: artifact_type: artifact_id: version: 
Agent Dependency Graph
Discovery Agent ↓ Schema Agent ↓ Architecture Agent ↓ Workflow Agent ↓ UX Specification Agent ↓ PRD Agent ↓ Technical Specification Agent ↓ Validation Agent ↓ Export Agent 
Validation Gates
Gate 1
Discovery Complete
Required:
• Discovery summary
• Confidence score
• Schema population
Gate 2
Schema Complete
Required:
• Required entities
• Relationships
• Dependency map
Gate 3
Architecture Complete
Required:
• Architecture object
• Data model
• Service map
Gate 4
Documentation Complete
Required:
• All mandatory documents
Gate 5
Validation Complete
Required:
• No blocking findings
Gate 6
Export Approval
Required:
• Export package passes validation
Failure Handling
Recoverable Failure
Examples:
• Missing field
• Invalid relationship
• Incomplete workflow
Action:
Retry Repair Revalidate 
Non-Recoverable Failure
Examples:
• Corrupted schema
• Contradictory requirements
• Governance violations
Action:
Escalate Pause Pipeline Require Intervention 
Retry Policy
Maximum retries:
max_retries: 3 
After third failure:
Escalation Required 
Escalation Model
Escalations are routed to:
Governance Agent 
Governance determines:
• Reject
• Repair
• Re-run
• Human Review
Agent Versioning
All agents must expose:
agent: name: version: release_date: owner: 
Agent Contract Requirements
Every agent must define:
inputs: outputs: dependencies: ownership: validation_rules: failure_modes: 
No agent may be deployed without a contract.
Execution States
Queued Running Waiting Blocked Failed Validated Completed 
All orchestration activity must maintain state visibility.
Observability Requirements
The orchestration layer must record:
• Agent executions
• Runtime duration
• Inputs
• Outputs
• Validation results
• Failures
• Escalations
All execution history must be auditable.
Orchestration Result Schema
orchestration_run: run_id: project_id: current_stage: status: active_agent: completed_agents: blocked_agents: validation_status: readiness_score: failures: escalations: outputs: 
Ownership
This document is owned by:
Governance Layer Agent Orchestration Layer 
Responsibilities include:
• Agent lifecycle management
• Agent coordination policy
• Dependency enforcement
• Execution governance
• Validation gate enforcement
This document serves as the authoritative orchestration specification for all AppArchitect autonomous systems.
Good catch. The structure and depth were consistent with the earlier governance files, but for true repository-grade governance documentation, 05 should continue beyond the orchestration mechanics and define execution governance, lifecycle ownership, state management, concurrency controls, agent capability registration, orchestration policies, and future extensibility.
Continue directly below the existing document:
Agent Capability Registry
Every agent within AppArchitect must be registered in the Agent Capability Registry before being eligible for orchestration.
The registry serves as the authoritative inventory of platform agents.
Registry Requirements
Each agent record must include:
agent: id: name: version: owner: status: capabilities: inputs: outputs: dependencies: validation_rules: execution_priority: retry_policy: 
Agent Status Types
Allowed statuses:
Draft Testing Active Deprecated Disabled Retired 
Active Agent Requirement
Only agents with status:
Active 
may participate in production orchestration pipelines.
Agent Lifecycle Model
Every agent follows a standardized lifecycle.
Draft ↓ Testing ↓ Approved ↓ Active ↓ Deprecated ↓ Retired 
Draft
Agent specification exists.
Not executable.
Testing
Agent may execute within isolated environments.
Outputs are not eligible for production usage.
Approved
Agent has passed governance review.
Ready for activation.
Active
Agent is available for orchestration.
May participate in production generation pipelines.
Deprecated
Agent remains operational but should no longer be assigned to new projects.
Retired
Agent removed from orchestration eligibility.
Historical executions remain accessible.
Execution Priority Framework
When multiple agents become eligible simultaneously, orchestration must prioritize execution according to dependency requirements.
Priority values:
priority: critical: 1 high: 2 normal: 3 low: 4 
Lower numbers execute first.
Critical Agents
Examples:
• Discovery Agent
• Validation Agent
• Governance Agent
High Priority Agents
Examples:
• Schema Agent
• Architecture Agent
Normal Priority Agents
Examples:
• PRD Agent
• UX Agent
• Workflow Agent
Low Priority Agents
Examples:
• Export Agent
• Reporting Agent
• Analytics Agent
Parallel Execution Rules
The orchestration layer may execute agents concurrently when dependencies do not conflict.
Example:
Architecture Agent ↓ ------------------- ↓ ↓ Workflow Agent UX Agent ------------------- ↓ Validation Agent 
Workflow and UX generation may execute simultaneously.
Parallel Eligibility Requirements
Agents may execute in parallel only when:
• Inputs are immutable
• Outputs do not overlap
• Ownership boundaries remain isolated
• Validation requirements are satisfied
Parallel Execution Prohibitions
Parallel execution is prohibited when:
• Two agents modify the same artifact
• Two agents modify the same schema region
• A dependency relationship exists
Artifact Ownership Model
Every artifact must have a single authoritative owner.
Ownership Rules
Example:
Project Schema Owner: Schema Agent Architecture Object Owner: Architecture Agent Validation Report Owner: Validation Agent 
Ownership Enforcement
Agents may:
• Create owned artifacts
• Update owned artifacts
• Validate owned artifacts
Agents may not:
• Modify artifacts owned by other agents
without orchestration approval.
State Management Framework
The orchestration layer maintains global project state.
Project States
Discovery Schema Architecture Documentation Validation Export Completed 
State Advancement Rules
Projects advance only when:
• Current state passes validation
• Required artifacts exist
• No blocking findings remain
State Rollback
The orchestration layer may rollback project state when:
• Critical validation failures occur
• Corrupted artifacts are detected
• Governance violations are discovered
Agent Memory Model
Agents are stateless execution units.
Persistent memory exists within project artifacts.
Prohibited Memory Behavior
Agents must not:
• Maintain hidden project context
• Invent undocumented requirements
• Store undisclosed assumptions
Required Context Sources
Agents may use only:
• Project Schema
• Architecture Object
• Governance Documents
• Approved Artifacts
Governance Intervention Framework
The Governance Agent may intervene at any stage.
Automatic Intervention Triggers
Examples:
Validation Score Below Threshold Conflicting Requirements Detected Security Policy Violation Cross-Reference Failure 
Governance Actions
Available actions:
Approve Reject Pause Repair Revalidate Escalate 
Audit Trail Requirements
Every orchestration event must be recorded.
Audit Event Schema
audit_event: event_id: timestamp: project_id: agent: action: artifact: result: validation_status: 
Immutable Logging Requirement
Audit records may never be modified after creation.
Corrections must be appended as new events.
Performance Requirements
The orchestration layer must track:
• Agent runtime
• Validation runtime
• Retry counts
• Failure rates
• Escalation frequency
Optimization Objectives
The orchestration system should continuously minimize:
• Redundant generation
• Validation rework
• Duplicate artifacts
• Orchestration bottlenecks
Future Agent Classes
The orchestration framework must support future agent categories.
Examples include:
• Market Research Agent
• Competitive Analysis Agent
• Monetization Agent
• Compliance Agent
• Prompt Engineering Agent
• QA Agent
• Release Planning Agent
• Development Oversight Agent
The orchestration model must remain extensible without requiring modifications to existing agent contracts.
Success Criteria
The Agent Orchestration Layer is considered successful when:
• All generation flows are deterministic
• All artifacts have ownership
• All dependencies are enforced
• All outputs are validated
• All actions are auditable
• All governance rules are applied automatically
End of governance/05-agent-orchestration-map.md
This now feels much closer to the same level of completeness as 01-04 and provides a solid foundation for the next document, governance/06-master-generation-pipeline.md, which is where the entire end-to-end AppArchitect production flow gets formalized.