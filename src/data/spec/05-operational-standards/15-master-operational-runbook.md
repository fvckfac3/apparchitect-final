governance/operational-standards/15-master-operational-runbook.md
AppArchitect Master Operational Runbook
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 15 of 15
Depends On: All prior operational standards (01-14)


Purpose
The Master Operational Runbook is the single entry point for operating the AppArchitect system. It ties together every operational standard (01-14) into a coherent operational hierarchy, defines the master lifecycle, and provides the procedures for the most common operational scenarios.
This is the doc you read first when you need to operate the system. It points to the specific standards for the specific procedures.


Operational Hierarchy
AppArchitect is organized in seven layers, from most authoritative to least:
1. Governance — Constitutional rules (governance/01-15)
2. Standards — How the rules are implemented (operational-standards/01-15)
3. Schemas — Data contracts (schemas/01-10)
4. Agents — Functional capabilities (agents/19 canonical agents)
5. Workflows — How artifacts move through the system
6. Artifacts — The outputs of the system
7. Releases — Bundled deployments of artifacts

Authority flows down. Higher layers override lower layers. When in doubt, consult the higher layer first.


Master Lifecycle
The complete AppArchitect operational lifecycle has nine phases. Each phase is supported by specific standards and produces specific outputs.

Phase 1 — Initiate
Purpose: Start a new project or initiative.
Owner: Project Sponsor + Orchestrator
Key Standards: 11-human-review-standard.md
Activities:
• Project intake (per governance/07-project-intake-schema-map.md)
• Stakeholder identification
• Initial scope definition
• Success criteria definition
Exit Criteria: Approved project with charter, sponsor, success criteria.
Outputs: Project Charter, Stakeholder Map, Initial Schema

Phase 2 — Plan
Purpose: Define the build plan and dependencies.
Owner: Orchestrator + Planning Agent
Key Standards: 04-validation-standard.md, 05-conflict-resolution-standard.md, 13-change-management-standard.md
Activities:
• Generate build plan (per governance/06-master-generation-pipeline.md)
• Document dependencies
• Identify parallelizable work
• Plan agent assignments
• Plan review checkpoints
Exit Criteria: Approved build plan with dependencies, assignments, checkpoints.
Outputs: Build Plan, Dependency Graph, Agent Assignment Matrix

Phase 3 — Generate
Purpose: Produce the artifacts per the plan.
Owner: All Agents (per assignment)
Key Standards: 02-agent-execution-standard.md, 03-document-quality-standard.md, 06-versioning-standard.md, 07-artifact-management-standard.md
Activities:
• Agents execute per their scope
• Self-validate outputs
• Version artifacts
• Record traceability
Exit Criteria: All assigned artifacts generated, self-validated, versioned.
Outputs: Generated Artifacts (in Draft or Review state)

Phase 4 — Validate
Purpose: Full validation pipeline on generated artifacts.
Owner: Validation Engine
Key Standards: 04-validation-standard.md
Activities:
• Run all 7 validation stages
• Cross-artifact consistency checks
• Governance compliance checks
• Quality scoring
Exit Criteria: All artifacts pass all applicable validation stages.
Outputs: Validation Results

Phase 5 — Review
Purpose: Human review of validated artifacts.
Owner: Designated Human Reviewers
Key Standards: 11-human-review-standard.md
Activities:
• Technical review (architecture, schemas, agent PRDs)
• Product review (user-facing PRDs)
• Governance review (governance, standards)
• Document review decisions
Exit Criteria: All required reviews complete with approvals.
Outputs: Review Decisions, Approved Artifacts

Phase 6 — Approve
Purpose: Formal approval for release.
Owner: Release Manager + Approvers
Key Standards: 11-human-review-standard.md, 12-release-standard.md
Activities:
• Final approval per release type
• Release notes drafted
• Communication plan activated
Exit Criteria: All required approvals received, release notes ready.
Outputs: Approved Release Bundle, Release Notes

Phase 7 — Release
Purpose: Deploy to production.
Owner: Release Manager + Deployment Agents
Key Standards: 12-release-standard.md, 08-security-standard.md
Activities:
• Deploy via canary
• Monitor at each stage
• Promote or rollback
• Confirm full rollout
Exit Criteria: Successful full deployment, no rollback needed.
Outputs: Released Artifacts in Released state

Phase 8 — Monitor
Purpose: Watch the release in production.
Owner: SRE + On-call
Key Standards: 09-observability-standard.md, 10-failure-recovery-standard.md
Activities:
• Monitor SLOs
• Monitor error rates
• Monitor user feedback
• Respond to incidents
Exit Criteria: Stable operation for rollback_window duration.
Outputs: Monitoring Reports, Incident Reports (if any)

Phase 9 — Improve
Purpose: Learn from the release and feed continuous learning.
Owner: Continuous Improvement Lead + All Roles
Key Standards: 14-continuous-learning-standard.md, 12-release-standard.md
Activities:
• Conduct retrospective
• Identify learnings
• Update learning repository
• Initiate improvements
Exit Criteria: Retrospective complete, learnings captured, improvements initiated.
Outputs: Retrospective Document, Learning Repository Updates

Common Operational Scenarios

Scenario 1 — Agent Execution Fails
Detection: 09-observability-standard.md alert fires
Response Path:
1. Check 02-agent-execution-standard.md Section 4 for error classification
2. If TRANSIENT: Automatic retry (no action)
3. If RECOVERABLE: Check trace envelope for last successful checkpoint
4. If INPUT_ERROR: Route to requesting agent with correction request
5. If SCOPE_ERROR: Route to orchestrator for scope review
6. If CRITICAL: Halt all downstream work, alert on-call
Reference Standards: 02, 04, 09, 10

Scenario 2 — Validation Failure
Detection: 04-validation-standard.md Stage N returns FAIL
Response Path:

1. Identify the failed stage

2. Review the failure envelope for specific failures
3. Route to producing agent for revision (max 3 cycles)

4. After 3 cycles, escalate to human lead
5. After human decision, update artifact or escalate to conflict resolution
Reference Standards: 02, 03, 04, 05, 11

Scenario 3 — Cross-Artifact Conflict
Detection: 04-validation-standard.md Stage 6 reports cross_artifact_conflicts
Response Path:
1. Classify conflict type per 05-conflict-resolution-standard.md

2. Apply authority order to determine winner
3. If auto-resolvable: Trigger regeneration
4. If semi-auto: Orchestrator decides
5. If human required: Route to appropriate human reviewer

6. Log in conflict register
Reference Standards: 04, 05, 11

Scenario 4 — Production Incident
Detection: 09-observability-standard.md alert fires OR user report OR anomaly detection
Response Path:
1. Activate 10-failure-recovery-standard.md workflow
2. Phase 1: Detect (Severity classification, Incident Commander)
3. Phase 2: Assess (Impact, root cause)
4. Phase 3: Contain (Rollback, disable, block)
5. Phase 4: Recover (Deploy fix, restore, failover)
6. Phase 5: Validate (Test, confirm, regression)
7. Phase 6: Document (Incident report, post-mortem)
8. Feed to 14-continuous-learning-standard.md
Reference Standards: 09, 10, 11, 12, 14

Scenario 5 — Security Incident
Detection: 08-security-standard.md alert OR threat intelligence OR external report
Response Path:
1. Activate 08-security-standard.md incident response

2. Containment priority over availability
3. Coordinate with 10-failure-recovery-standard.md if service-impacting

4. Preserve evidence per audit retention
5. Coordinate with external entities (regulators, law enforcement) as required
6. Post-incident: full security review and control updates
Reference Standards: 08, 09, 10, 14

Scenario 6 — Change Request
Detection: Change need identified by anyone
Response Path:
1. Create change request per 13-change-management-standard.md
2. Phase 1: Request (Create CR, assign owner)
3. Phase 2: Assess (Impact, risk, resources)
4. Phase 3: Approve (Route to approvers, CAB if needed)
5. Phase 4: Implement (Dev → Staging → Prod)
6. Phase 5: Validate (Confirm effect, check regressions)
7. Phase 6: Close (Document, communicate, archive)
Reference Standards: 11, 12, 13, 14

Scenario 7 — Release Execution
Detection: Release plan approved
Response Path:
1. Execute 12-release-standard.md lifecycle
2. Phase 1: Plan (already done)
3. Phase 2: Prepare (Build, validate, stage)
4. Phase 3: Validate (Full validation suite, security scan)
5. Phase 4: Approve (Final sign-off, communication)
6. Phase 5: Release (Canary deploy, monitor, promote)
7. Phase 6: Monitor (Watch SLOs, error rates)
8. Phase 7: Retrospective (Capture learnings)
Reference Standards: 04, 06, 08, 09, 11, 12, 14

Scenario 8 — New Agent Onboarding
Detection: Need for new agent identified
Response Path:
1. Define agent scope per governance/05-agent-orchestration-map.md
2. Create agent PRD per agent-prd-template-builder.jsx
3. Run full validation per 04-validation-standard.md
4. Get human review per 11-human-review-standard.md

5. Update agent registry, collaboration map, orchestration map

6. Add to canonical roster
7. Document in agents/README.md
Reference Standards: 02, 03, 04, 05, 07, 11, 13

Scenario 9 — Schema Evolution
Detection: Schema change need identified
Response Path:
1. Create change request per 13-change-management-standard.md Type 3

2. Run impact analysis on all consuming artifacts
3. Determine version bump per 06-versioning-standard.md

4. Develop migration plan
5. Update schema with backward compatibility (or transition plan)

6. Update all consuming artifacts

7. Validate full system

8. Release with deprecation plan if MAJOR
Reference Standards: 04, 06, 07, 11, 12, 13

Scenario 10 — Quality Regression
Detection: 03-document-quality-standard.md score drop OR escape defect discovered
Response Path:

1. Identify regression pattern
2. Update validation rules to catch earlier (if possible)
3. Revise producing agent's instructions

4. Re-run recent artifacts through updated validation

5. Update quality rubric if needed
6. Document learning in 14-continuous-learning-standard.md
Reference Standards: 03, 04, 13, 14

Standard Reference Index
Quick reference to all 15 operational standards:
01 — Operating Principles — Constitutional rules
02 — Agent Execution Standard — Agent lifecycle
03 — Document Quality Standard — Quality dimensions and scoring
04 — Validation Standard — Validation hierarchy
05 — Conflict Resolution Standard — Authority order, conflict types
06 — Versioning Standard — SemVer, version states
07 — Artifact Management Standard — Artifact lifecycle
08 — Security Standard — Security domains, threat model
09 — Observability Standard — Telemetry, SLOs, alerting
10 — Failure Recovery Standard — Recovery workflow, RTO/RPO
11 — Human Review Standard — Review types, SLAs
12 — Release Standard — Release lifecycle, types
13 — Change Management Standard — Change lifecycle
14 — Continuous Learning Standard — Learning cycle
15 — Master Operational Runbook — This document

Onboarding
New operators should:
1. Read 01-operating-principles.md (constitutional context)
2. Read this document (15-master-operational-runbook.md)
3. Skim 04-validation-standard.md (validation is central)
4. Skim 09-observability-standard.md (you will use this daily)
5. Read 11-human-review-standard.md (human authority is paramount)
6. Deep-read 02-agent-execution-standard.md and 12-release-standard.md (most common procedures)
7. Reference others as needed for specific scenarios


Cross-References
This document ties together all other operational standards and references:
• governance/01-15 — All governance documents
• All operational-standards/01-14 — Detailed procedures
• schemas/01-10 — Data contracts
• agents/ — Agent capabilities


Ownership
Component: Master Operational Runbook
Owner: Operations Lead
Reviewer: All standard owners + Executive Sponsor
Review Cadence: Every MAJOR version bump, or on any major operational incident


---

End of File
