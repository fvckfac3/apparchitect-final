# Workflows

**Layer:** Workflows (`06 - workflows/`)
**Status:** Canonical v1.0

## Purpose

This layer defines the **6 sequential processes** that transform a raw founder idea into a shipped, monitored, iterating product. Workflows are the operational procedures that combine agents, templates, governance, and validation into end-to-end runs.

Workflows are NOT templates (those live in `04 - templates/`) and NOT agent definitions (those live in `03 - agents/`). Workflows are **runnable sequences** that orchestrate those layers.

## The 6 Workflows

| # | Workflow | Purpose | Owner | Lines |
|---|----------|---------|-------|-------|
| 1 | `discovery.md` | Transform raw idea into validated intent, requirements, market understanding | Discovery Agent | 127 |
| 2 | `architecture.md` | Design system architecture: stack, data model, services, integrations, security, AI | Architecture Agent | 170 |
| 3 | `implementation.md` | Build, test, secure, validate, document the product through to ship-readiness | Implementation Agent | 167 |
| 4 | `product.md` | Define the product layer: UX flow, features, accessibility, content, analytics | Product Agent | 153 |
| 5 | `business.md` | Define commercial model: pricing, financials, team, GTM, legal, operations | Business Agent | 157 |
| 6 | `launch.md` | Execute production launch and manage post-launch lifecycle, incidents, iteration | Launch Agent | 170 |

## When to Run Each Workflow

The 6 workflows are **sequential dependencies**, not alternatives. A product that skips Discovery and goes straight to Implementation is guessing. A product that runs Product before Architecture lacks structural grounding.

| Scenario | Run Order |
|----------|-----------|
| New product from scratch | 1 → 2 → 3 → 4 → 5 → 6 |
| Adding a feature to existing product | 1 (lite) → 4 → 3 → 6 |
| Pricing change on existing product | 5 (lite) → 6 |
| Pivoting existing product | 1 (full) → 2 (re-architecture) → 3 → 4 → 5 → 6 |
| Hardening security on existing product | 2 (security subset) → 3 (security subset) → 6 |
| Re-launching after major refactor | 3 (rebuild) → 6 (re-launch) |

## How Workflows Connect to Other Layers

Every workflow file references:
- **Agents** (`03 - agents/`) — the agent that owns execution
- **Templates** (`04 - templates/`) — the artifacts produced
- **Governance** (`01 - governance/`) — the constitutional rules being followed
- **Operational Standards** (`05 - operational-standards/`) — the procedural rules being applied
- **Prompt Contracts** (`07 - prompt-contracts/`) — the prompt that drives the agent
- **Validation** (`08 - validation/`) — the gates that must pass

## Quick Start

1. Read `discovery.md` to understand how a raw idea becomes structured intent
2. Read `architecture.md` to understand how intent becomes a system design
3. Read `implementation.md` to understand how a design becomes code
4. Read `product.md` to understand how code becomes a usable product
5. Read `business.md` to understand how a product becomes a business
6. Read `launch.md` to understand how a business ships and grows

## Cross-References

- **Constitution:** `01 - governance/06-master-generation-pipeline.md` (the 14-stage pipeline these workflows execute)
- **Lifecycle:** `01 - governance/15-project-lifecycle-model.md` (the project phases these workflows progress through)
- **Procedural Rules:** `05 - operational-standards/` (how workflows handle errors, escalations, releases)
- **Artifact Templates:** `04 - templates/` (the templates each workflow uses)

---

*Last Updated: 2026-06-19*
*Authority: Canonical*
