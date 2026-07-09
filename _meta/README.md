# Meta Layer

This folder contains the meta-tools that build the agent PRD documents from raw data.

## `file agent-prd-template-builder.jsx`

The primary builder. A React JSX file (originally a UI prototype) that defines:

- The shared project schema section (00)
- The shared agent identity section (01)
- The shared handoff section (06)
- The shared evaluation section (07)
- All 17 canonical agents with their full template definitions

**Important note on this file:**

The original upload was truncated mid-line in the `devops_agent` definition. The file ends abruptly with no closing brackets. A repaired version is in place: the truncation point is closed with a stub React component (`export default function AgentPRDBuilder() { return null; }`) and the devops_agent object is marked as partial.

**Status:**

- 16 agents are complete (Strategist through Content Agent)
- 1 agent is partial (DevOps Agent) — identity block is preserved, template body is lost
- 1 template (`file orchestrator_agent.md`) was hand-authored in the `agents/templates/meta-orchestration/` directory to fill the missing meta tier

**To regenerate the agent markdown files:**

The original extraction logic is preserved in the conversation workspace as `file extract_agents.mjs`. Running it with Node.js will regenerate all 16 complete agent markdown files from this JSX source.

## `agent-prd-template-builder.jsx.bak`

A backup of the original truncated upload, preserved for reference. Do not edit.