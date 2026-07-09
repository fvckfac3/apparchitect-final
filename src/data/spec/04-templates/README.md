# PRD Templates Library

**Version:** 2.0
**Status:** Canonical templates (28 base + 18 workflow = 46 total)
**Authority:** Source-of-truth for unfilled templates AppArchitect uses to generate new project PRDs.

---

## Purpose

This directory holds the **PRD template library** — the unfilled, `[Product Name]` placeholder templates that AppArchitect uses to generate new project PRDs.

Templates here are **scaffolding, not finished artifacts**. Each one is filled with project-specific truth at runtime.

## What's Here

- **28 base templates** sit directly in this directory. They are the canonical PRD library: agent PRD, analytics, build handoff, core systems, technical architecture, UX, RLM wrapper, etc.
- **18 workflow templates** live in `workflows/`, organized by the 6 canonical workflow tiers (discovery, architecture, product, implementation, business, launch).
- **Older v1 and v1.5 template sets have been retired; v2 supersedes both.**

## Base Template Index

| # | Template | Purpose |
|---|----------|---------|
| 1 | Agent PRD Template | Canonical agent PRD scaffold |
| 2 | Analytics PRD | Event taxonomy, funnels, dashboards |
| 3 | Build Handoff | Master handoff doc for implementation |
| 4 | Changelog & Decision Log | Project change/decision log |
| 5 | Codebase Audit Prompt | Repo audit / readiness prompt |
| 6 | Content & Copy PRD | Tone, voice, copy library |
| 7 | Core Systems PRD | Primary system surfaces |
| 8 | Data & Integration PRD | Data flows, integrations, webhooks |
| 9 | Design System & Component Reference | Tokens, components, patterns |
| 10 | Environment & Secrets Reference | Env vars, secrets catalog |
| 11 | Error & State Reference | Error catalog, state machines |
| 12 | Experience & Access PRD | Roles, permissions, access |
| 13 | Launch Strategy PRD | GTM launch plan |
| 14 | Master PRD Index | Suite-level index / TOC |
| 15 | Migrations & Seed Data Reference | DB migrations + seed data spec |
| 16 | Monetization PRD | Pricing, billing, entitlements |
| 17 | Project Brief | High-level project summary |
| 18 | RLM Principles Addendum | Role-Limits-Mission framework |
| 19 | RLM Wrapper Template | RLM scaffold for any agent |
| 20 | Requirements Summary | Consolidated requirements doc |
| 21 | Roles & Permissions Matrix | RBAC matrix |
| 22 | Safety, Privacy & Control PRD | Safety rails, privacy controls |
| 23 | Security PRD | Security architecture, threat model |
| 24 | Technical Architecture PRD | System architecture, data model |
| 25 | Test Plan PRD | Test strategy, cases, harness |
| 26 | UX PRD | UX flows, screens, components |
| 27 | User Instructions | End-user guide / instructions |
| 28 | User Personas | Persona library |

## Workflow Template Index (`workflows/`)

**Discovery (3):** intake-brief · discovery-report · clarification-log
**Architecture (3):** architecture-object · integration-spec · tech-decision-record
**Product (3):** feature-spec · ux-flow-spec · user-story
**Implementation (3):** implementation-plan · component-spec · test-plan-spec
**Business (3):** pricing-model · financial-model · launch-checklist
**Launch (3):** launch-plan · marketing-plan · post-launch-review

## Usage

1. **Duplicate the template** — never edit in place.
2. **Fill in** `[Product Name]` placeholders with the actual project name and content.
3. **Save the filled version** to the project workspace, not back into this templates folder.
4. **Pass the filled template through validation** (`08 - validation/`) before activating any agent on it.

## Cross-Reference: Reference Implementation

`reference/apparchitect-prd-suite/` holds the filled PRDs describing AppArchitect itself — use these as a concrete example of how each template should be filled in.

## Authority

- **Templates** are versioned in place. Bump to v2.1 only when the template structure itself changes (not the project).
- **Filled PRDs** are never stored here. Filled PRDs belong in the project workspace or in `reference/apparchitect-prd-suite/`.
- **Superseded templates** must be moved to `archive/` (this directory does not yet exist; create when first template is retired).

---

*Last Updated: 2026-07-05*
*Authority: Canonical*
