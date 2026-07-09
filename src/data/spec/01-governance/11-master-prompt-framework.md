governance/11-master-prompt-framework.md

Purpose
The Master Prompt Framework defines the standards, structure, lifecycle, governance, validation, and execution model for every prompt used within AppArchitect.
Prompts are considered executable system assets.
They are governed with the same rigor as:
- Schemas
- Architecture Objects
- Agent Contracts
- Validation Rules
No agent may execute prompts outside this framework.

Scope
Applies to:
- Every prompt in `07 - prompt-contracts/`
- Every prompt embedded in an agent definition (`03 - agents/`)
- Every prompt shipped to a downstream consumer (UI, API, export)
- Every prompt generated dynamically during orchestration
Out of scope:
- Plain English user instructions (see `04 - templates/PRD Suite v2 – User Instructions.md`)
- README documentation (this is *about* the framework, not a prompt itself)
- API schemas (see `02 - schemas/`)

Prompt Philosophy
AppArchitect does not treat prompts as instructions.
AppArchitect treats prompts as software.
Prompts must be:
- Versioned
- Testable
- Validated
- Traceable
- Deterministic
- Governed

A prompt that cannot be tested, versioned, and validated is a liability. A prompt that can is a buildable system component.

Authority Hierarchy
Every prompt in AppArchitect sits at one of five layers, each inheriting constraints from the layer above.

Layer 0: Constitutional Layer
Source: `governance/01-master-project-schema.md` and the 10 Operating Principles in `05 - operational-standards/01-operating-principles.md`.
Authority: Highest. A prompt that violates a constitutional rule is automatically invalid, no matter what its content says.
Inheritance: All layers below must include this verbatim.

Layer 1: System Prompt
Scope: Platform-wide behavior. Defines what AppArchitect is and what it refuses to do.
Owner: Governance Layer.
Inheritance: All agent and task prompts must include the system prompt's forbidden-actions list.

Layer 2: Agent Prompt
Scope: One agent's role, capabilities, and prohibitions.
Owner: Agent definition in `03 - agents/`.
Inheritance: Each agent prompt derives from its system prompt by adding role-specific instructions, contract requirements, and output envelopes.

Layer 3: Task Prompt
Scope: A specific objective the agent is asked to accomplish in the current session.
Owner: Orchestrator or human operator.
Inheritance: Includes the agent prompt above it as a prefix. Adds the task input, expected output envelope, and any per-task constraints.

Layer 4: Context Payload
Scope: Project-specific data, interview answers, prior agent outputs, schema state.
Owner: Orchestrator.
Inheritance: This is not a prompt itself but is appended to Layer 3 to ground the agent in the current project.

Layer 5: Response Contract
Scope: Required output format, fields, validation rules.
Owner: Agent definition + governance.
Inheritance: Every prompt must declare its response contract or be rejected.

A prompt is invalid if any layer above it is missing.

Prompt Component Contract
Every prompt must contain the following named components. Missing components cause the prompt to fail registration.

prompt:
  id:                   string  (e.g., "agent.strategist.v2")
  name:                 string  (human-readable)
  version:              semver  (MAJOR.MINOR.PATCH)
  owner:                string  (agent or governance owner)
  purpose:              string  (one-sentence: what does this prompt exist to do)
  layer:                enum    (system | agent | task | response-contract)
  inputs:               array   (each: name, type, required, source)
  instructions:         string  (the actual prompt body, with placeholders)
  constraints:          array   (hard rules the agent must obey)
  output_contract:      object  (required output shape)
  validation_rules:     array   (how to know the output is correct)
  forbidden_actions:    array   (what the agent must never do)
  dependencies:         array   (other prompts required before this one can run)
  test_cases:           array   (representative inputs and expected outputs)
  metadata:             object  (created_at, updated_at, changelog)

A prompt missing any of these fields is rejected by the prompt registry.

Prompt Categories

Discovery Prompts
Used for: Interviews, clarification, gap detection, market research.
Owner: Discovery Agent (`03 - agents/00-orchestrator-agent-spec.md` and equivalents).
Output contract: Structured interview responses, schema fragments, or escalation messages.

Schema Prompts
Used for: Schema creation, entity extraction, relationship mapping, validation.
Owner: Schema Agent and Architect.
Output contract: Validated schema fragments conforming to `02 - schemas/`.

Architecture Prompts
Used for: System design, infrastructure planning, security design, integration mapping.
Owner: Architect.
Output contract: Architecture object conforming to `02 - schemas/02-architecture-object.json`.

Documentation Prompts
Used for: PRD generation, technical specs, API contracts, user-facing docs.
Owner: Documentation Agent + Specialist agents.
Output contract: Markdown documents conforming to `04 - templates/` patterns.

Validation Prompts
Used for: Consistency checks, cross-reference validation, governance audits, completeness scoring.
Owner: Validation Engine (`08 - validation/`).
Output contract: Validation result conforming to `02 - schemas/09-validation-result.json`.

Orchestration Prompts
Used for: Workflow sequencing, state management, escalation routing, inter-agent coordination.
Owner: Master Orchestrator (`07 - prompt-contracts/01-master-orchestrator-prompt.md`).
Output contract: Dispatch envelope, status update, or escalation message.

Export Prompts
Used for: Package assembly, manifest generation, format conversion, handoff preparation.
Owner: Export Agent.
Output contract: Export manifest conforming to `02 - schemas/10-export-manifest.json`.

Prompt Validation Requirements
All prompts must define, in machine-checkable form:
- Inputs (with type, required flag, source)
- Outputs (with schema reference or shape description)
- Constraints (hard rules, no exceptions)
- Failure Conditions (what output indicates the prompt failed)
- Success Conditions (what output indicates the prompt succeeded)
- Forbidden Actions (what the agent must refuse to do)
- Dependencies (other prompts or artifacts that must exist before this one runs)
- Test Cases (minimum 3 representative inputs with expected outputs)

A prompt without a complete validation block cannot be promoted from `draft` to `canonical` status.

Prompt Versioning
Prompts follow SemVer.

prompt_version:
  major: 1   # breaking: changes to inputs, outputs, or constraints
  minor: 0   # additive: new optional fields, new test cases
  patch: 0   # documentation, prompt wording tweaks, no behavior change

A MAJOR bump requires:
- Migration note in `04 - templates/PRD Suite v2 – Changelog & Decision Log.md.md` (or equivalent decision log)
- Re-validation against `08 - validation/`
- Re-test of all registered test cases

A MINOR bump requires:
- Test case additions covering the new behavior
- Changelog entry

A PATCH bump requires:
- Changelog entry only

Ownership
The Master Prompt Framework is owned by the Governance Layer.
Prompts in `07 - prompt-contracts/` are owned by their respective agents.
The Master Orchestrator owns prompt-coordination rules (which prompt runs when, in what order, with what handoff).

End of governance/11-master-prompt-framework.md
