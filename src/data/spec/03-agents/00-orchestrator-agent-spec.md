# AppArchitect – Orchestrator Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Coordinates the AppArchitect build team and gates all phase transitions
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
| --- | --- |
| **Agent Name** | Orchestrator Agent |
| **Role** | Project-wide coordination, sequencing, conflict resolution, and quality gating |
| **Type** | Orchestrator |
| **Operates On** | Agent task queue, Base PRD set, generated PRD suite, audit reports |
| **Triggered By** | User approval, suite generation events, agent completion signals |
| **Blocking?** | Yes — every downstream agent's release depends on this agent's prior approval |

## 2. Mission Statement

The Orchestrator Agent owns the integrity of the build from suite generation through delivery. It sequences the AppArchitect generated agents (Documentation, Frontend, Backend, Database, Auth & Security, AI Integration, DevOps, QA, Content & Design, Experience, Data Integration), enforces PRD precedence at every handoff, resolves responsibility overlaps before they become code conflicts, and gates every phase transition on a passing validation report. It does not write production code, content, or data; it only routes work, records decisions, and approves transitions.

## 3. Scope

### 3.1 In Scope (This Agent's Responsibility)

- Maintain the master task graph for the AppArchitect build
- Sequence agent work based on declared dependencies in each Agent PRD
- Enforce Base PRD precedence at every handoff (Safety &gt; Core Systems &gt; Experience &gt; Roles &gt; Data &gt; Technical &gt; Content)
- Resolve overlaps detected by Documentation Agent (`AGENT_OVERLAP_DETECTED`) and unblockers reported by QA Agent
- Gate every phase transition on a clean audit report
- Maintain the live Changelog & Decision Log entries for orchestration decisions
- Surface critical safety, schema, or precedence violations to the user immediately

### 3.2 Out of Scope (Explicitly Not This Agent's Job)

- Writing or modifying any production code in the AppArchitect codebase
- Writing user-facing copy, design tokens, or components
- Modifying any Base PRD document
- Modifying agent PRDs authored by Documentation Agent
- Running tests directly (delegates to QA Agent)
- Making schema decisions (delegates to Database Agent)

> If a task seems adjacent to this agent's scope but isn't listed in 3.1, it is out of scope. Do not expand scope unilaterally.

## 4. Inputs

### 4.1 Input Summary

| Input | Source | Format | Required |
| --- | --- | --- | --- |
| Approved team configuration | Documentation Agent | JSON manifest of agent IDs and roles | Yes |
| Per-agent completion reports | All agents | JSON with `status`, `outputs`, `deviations[]`, `handoffReady` | Yes |
| Master PRD Index | Suite | Markdown | Yes |
| Cross-document audit reports | Documentation Agent | JSON with `allChecksPassed` | Yes |
| User directives | User | Markdown/JSON | No |

### 4.2 Input Schemas

**AgentCompletionReport**

```typescript
type AgentCompletionReport = {
  agentId: string;                    // e.g., "00", "01"
  agentName: string;                  // e.g., "Frontend Agent"
  phase: string;                      // e.g., "MVP_FOUNDATION", "MVP_BACKEND", "MVP_FRONTEND", "QA_MVP"
  status: 'COMPLETE' | 'PARTIAL' | 'FAILED';
  outputs: {
    files: string[];                  // repo-relative file paths
    artifacts: string[];              // e.g., "OpenAPI spec at /api/openapi.json"
  };
  deviations: {
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    prdReference: string;            // e.g., "Technical Architecture §6.2"
  }[];
  crossDocChecks: {
    checkId: string;                  // e.g., "VAL_SCHEMA_DRIFT"
    pass: boolean;
    note?: string;
  }[];
  handoffReady: boolean;              // true if next agent can begin
  durationMinutes: number;
}
```

**UserDirective**

```typescript
type UserDirective = {
  directiveType: 'PAUSE' | 'RESUME' | 'REPLAN' | 'PRIORITY_CHANGE' | 'OVERRIDE_DEVIATION';
  targetAgentId?: string;
  context: string;
  reason: string;
}
```

### 4.3 Input Validation Rules

- `AgentCompletionReport.status` must be one of the three enum values; abort if not
- `handoffReady` may only be `true` when `status === 'COMPLETE'` and zero `critical` deviations
- If `crossDocChecks` contains any `pass: false` for a check marked `critical`, Orchestrator must halt regardless of `status`

## 5. Outputs

### 5.1 Output Summary

| Output | Destination | Format | Always Produced |
| --- | --- | --- | --- |
| Phase transition approval | All agents | Markdown | Yes |
| Conflict resolution note | Changelog | Markdown | Yes |
| Replan summary | User | Markdown | No (only on REPLAN) |
| Orchestrator decision log | Changelog | Markdown | Yes |

### 5.2 Output Schemas

**PhaseTransition**

```typescript
type PhaseTransition = {
  transitionId: string;
  fromPhase: string;
  toPhase: string;
  approver: 'Orchestrator Agent';
  approverVersion: string;          // Orchestrator PRD version
  approved: boolean;
  reason: string;
  conditions: string[];              // what the next agent must satisfy
  unlocksAgents: string[];           // agent IDs that may now begin
}
```

**OrchestratorError (standard)**

```typescript
type OrchestratorError = {
  code:
    | 'PREREQ_MISSING'
    | 'CONFLICT_UNRESOLVED'
    | 'PRECEDENCE_VIOLATION'
    | 'HALF_BUILT_ARTIFACT'
    | 'AGENT_HANGTIME';
  message: string;
  location?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  nextAction: string;
}
```

### 5.3 Output Quality Rules

- Every transition MUST be approved or rejected — never silently passed
- Every conflict resolution MUST be logged to the Changelog with a citation
- Every "halt" decision MUST be visible to the user (no silent halts)
- Output MUST NOT invent new agents or rename existing ones

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Initialize Orchestration**

- Load Master PRD Index, all Base PRDs, all Agent PRDs, and the Changelog
- Validate that every Base PRD required by the Master Index exists and is non-empty
- Validate that the team configuration from Documentation Agent has at least: Orchestrator, Documentation, Frontend, Backend, Database, Auth & Security, AI Integration, DevOps, QA
- Emit `PhaseTransition` from `INIT` to `MVP_FOUNDATION`
- On failure: abort with `PREREQ_MISSING`

**Step 2: Gate Documentation Agent's Base PRD Generation**

- Wait for Documentation Agent's completion report
- Verify all 16 base documents produced with `placeholders: 0`
- Verify `allChecksPassed: true` in audit
- If pass: unlock Frontend, Backend, Database, Auth & Security, AI Integration
- If fail: return failure list to Documentation Agent for re-runs; do not unlock specialists

**Step 3: Sequence Specialist Work**

- Maintain a dependency graph based on each agent PRD's "Dependencies" section
- Release each specialist only when all its declared prerequisites have completed with `handoffReady: true`
- Never release DevOps until at least one specialist has produced a runnable artifact
- Never release QA until DevOps confirms a deployable build

**Step 4: Process Completion Reports**

- For each incoming `AgentCompletionReport`:
  1. Verify `status` and `deviations`
  2. Run cross-doc checks against the agent's claimed outputs
  3. Decide: approve transition, return for fix, or escalate to user
  4. Emit a `PhaseTransition` describing the decision
  5. Log to Changelog if deviation is `medium` or above

**Step 5: Resolve Conflicts**

- On `AGENT_OVERLAP_DETECTED`: read both agents' PRD scope sections, determine the natural owner per Base PRD, reassign in the Changelog, and notify both agents
- On `CONFLICT_UNRESOLVED`: halt the pipeline and surface the conflict to the user with both sides' payloads
- On `VALID_PRECEDENCE_VIOLATION`: revert the violating change, log to Changelog as a safety-grade entry

**Step 6: Gate QA Signoff**

- Require QA Agent's report to be `PASS` for release
- On `FAIL` with critical bugs: route bug reports to the owning agent, halt release
- On `FAIL` with non-critical bugs: log for backlog, allow release only with explicit user approval
- Final Orchestrator approval is a `PhaseTransition` from `QA_MVP` to `RELEASED`

**Step 7: Maintain Orchestrator Decision Log**

- Every conflict resolution, every precedence enforcement, every replan must be written to the Changelog
- Entries must include timestamp, decision type, decided by (Orchestrator Agent), and rationale

### 6.2 Decision Logic

**Decision: Release Specialist**

```markdown
IF documentation_base_prds_complete (placeholders == 0 AND allChecksPassed)
  AND no critical safety violations pending
  AND no AGENT_OVERLAP_DETECTED unresolved
THEN release all specialists with phase "MVP_FOUNDATION"
ELSE return failure list to Documentation Agent
```

**Decision: Allow Release**

```markdown
IF qa_report.status == "PASS"
  AND zero critical bugs open
  AND all user-facing strings match Content PRD
  AND all error codes match Error & State Reference
THEN approve release
ELSE halt release and route to owning agent
```

**Decision: Override Deviation**

```markdown
IF user_directive.directiveType == "OVERRIDE_DEVIATION"
  AND deviation.severity != "critical"
  AND override is logged to Changelog
THEN accept deviation, log rationale, continue
ELSE refuse override and explain
```

### 6.3 Iteration Behavior

- Iterates over: incoming `AgentCompletionReport` events
- Iteration limit: unlimited (one report per phase, typically 8–12 phases for MVP)
- On iteration failure: log and continue (don't crash the orchestration)
- Batch size: one agent report per iteration

### 6.4 Concurrency Rules

- May run concurrently with: any agent that is in waiting state
- Must not run concurrently with: another Orchestrator instance (single Orchestrator per build)
- Locking strategy: optimistic with a build-level lock in the audit log

## 7. Edge Cases & Failure Modes

| Scenario | Expected Agent Behavior |
| --- | --- |
| Two agents report completion at the same time | Process serially in arrival order |
| Agent reports `PARTIAL` with critical deviation | Reject and route back for fix |
| Agent reports `PARTIAL` with low deviation | Approve and continue, log deviation |
| User issues `PAUSE` while specialist running | Do not release the next phase; wait for `RESUME` |
| User issues `REPLAN` | Generate a new dependency graph, restart from current phase |
| Master PRD Index is updated mid-build | Pause specialists, re-run cross-doc checks, resume |
| Discovery of a missing base PRD | Halt, route to Documentation Agent for backfill |
| Same file claimed modified by two agents | Lock file to first agent; second agent must request reassignment |
| Build runtime exceeds 48 hours with no progress | Surface to user as `AGENT_HANGTIME` and offer to cancel/restart |

## 8. Dependencies

### 8.1 Base PRD Dependencies

This agent is governed by and must comply with:

| PRD | Relevant Sections |
| --- | --- |
| Safety, Privacy & Control PRD | All — highest precedence always applies |
| Core Systems PRD | §3–§5 (Interview Engine, Doc Generation, Validation, Team Synthesis, User Instructions) |
| Roles & Permissions Matrix | §3, §6 (Permission enforcement, OWNER-only powers) |
| Error & State Reference | All (error codes used in any output must be registered) |
| Changelog & Decision Log | All (every Orchestrator decision must be logged) |

### 8.2 Agent Dependencies

| Dependency Type | Agent | Nature of Dependency |
| --- | --- | --- |
| Must run before | Documentation Agent | Confirms team configuration before any doc writing |
| Must run before | All specialists | Gates phase transitions |
| Must run after | User approval | Cannot orchestrate without user sign-off to begin |
| May run concurrently | None | Single Orchestrator per build |

### 8.3 External Service Dependencies

| Service | Used For | Failure Impact |
| --- | --- | --- |
| Database | Persist orchestration events and decisions | Critical — events must be durable |
| Changelog service | Append-only decision log | Critical — audits require it |
| Notification service | Surface halts to user | Degraded — fallback to UI banner |

## 9. Error Code Registry

| Code | Meaning | Severity | Recovery Action |
| --- | --- | --- | --- |
| `PREREQ_MISSING` | Required agent output missing | Critical | Halt build, route to owning agent |
| `CONFLICT_UNRESOLVED` | Precedence did not resolve a conflict | High | Surface to user with both payloads |
| `PRECEDENCE_VIOLATION` | Lower-tier doc/agent overrides higher-tier | Critical | Revert, log, restart from violation point |
| `HALF_BUILT_ARTIFACT` | An artifact has only partial agent signoff | High | Mark artifact as "draft", block dependent agents |
| `AGENT_HANGTIME` | Agent has not progressed in expected window | Medium | Surface to user, offer cancel/restart |
| `INVALID_HANDOFF` | Handoff payload missing required fields | High | Reject handoff, ask for re-submit |

## 10. Logging & Observability

### 10.1 What This Agent Must Log

- Every phase transition (event type `PHASE_TRANSITION`)
- Every conflict and resolution (event type `CONFLICT_RESOLVED`)
- Every precedence enforcement action (event type `PRECEDENCE_ENFORCED`)
- Every user directive received (event type `USER_DIRECTIVE`)
- Every halt or rollback (event type `BUILD_HALT`)

### 10.2 What This Agent Must Never Log

- Raw PRD content bodies
- User interview answers
- Secrets or API keys
- PII (names, emails, addresses)

## 11. Acceptance Criteria

All of the following must be true for this agent to be considered correctly implemented:

- [ ]     Init step blocks until all 16 base PRDs exist and pass audit

- [ ]     Specialist release never happens without all declared prerequisites complete

- [ ]     Every `AgentCompletionReport` produces a `PhaseTransition` (no silent pass-throughs)

- [ ]     Every conflict (`AGENT_OVERLAP_DETECTED`, `CONFLICT_UNRESOLVED`, `VALID_PRECEDENCE_VIOLATION`) results in a Changelog entry with rationale

- [ ]     Release never happens without QA `PASS` and zero critical bugs open

- [ ]     User directives (PAUSE/RESUME/REPLAN/OVERRIDE) are honored exactly as specified

- [ ]     No production code is ever written or modified by this agent

- [ ]     Logging never contains raw PRD bodies, user content, or secrets

- [ ]     Single Orchestrator per build (no concurrent Orchestrator instances)

- [ ]     Decision log entries are append-only (no edits or deletes)

## 12. Test Cases

### 12.1 Happy Path

- 16 base PRDs generated, audit passes, specialists released in order, all complete, QA passes, release approved.

### 12.2 Error Cases

- Base PRD contains a placeholder: Orchestrator halts, routes to Documentation Agent.
- Two agents report conflicting scope on the same file: Orchestrator detects `AGENT_OVERLAP_DETECTED`, reassigns, logs.
- QA reports a critical safety bug: Orchestrator halts release, routes to owning agent.

### 12.3 Edge Cases

- User issues `PAUSE` mid-phase: Orchestrator halts new releases, awaits `RESUME`.
- Master PRD Index updated mid-build: Orchestrator pauses, re-runs cross-doc checks, resumes.
- Two agents modify the same file: Orchestrator locks to first, requires second to request reassignment.

---

**END OF ORCHESTRATOR AGENT PRD**