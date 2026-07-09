# AppArchitect Agent Roster

**Version:** 2.0
**Status:** Canonical
**Layer:** Agents (`03 - agents/`)
**Last Updated:** 2026-07-05

This directory contains two parallel systems that must not be conflated:

1. **Agent PRD Templates** — In `templates/<tier>/*-template.md`. The canonical blank template for each of the **19 meta-agents**. These are the meta-team that would build any product, including AppArchitect itself. Unfilled scaffolding.
2. **Agent Specs** — In the root of this directory, named `NN-<name>-agent-spec.md`. Build-ready, populated agent specifications for the **17 AppArchitect runtime agents**. These are the agents that actually run when AppArchitect executes a project.

The 19-template library and the 17-spec taxonomy are deliberately different. The 19 are the canonical agent library (the design palette); the 17 are the runtime team (the production cast). Several runtime specs merge multiple meta-agent capabilities — a single spec file may consume two or more templates.

---

## Template Library (19 meta-agents)

The 19 template files live in `templates/<tier>/` and are generated from the JSX source in `_meta/apparchitect-agent-prd-v2.jsx`. Each template file is a merge of:

- The hand-authored polished template (sections 00–07, with cleaned-up field tables)
- A "v2 Source Mirror" appendix containing the raw v2 field prompts as a complete reference

### Core Pipeline (8)

- **Strategist** (`strategist`) — Vision → Architecture
- **Architect** (`architect`) — Structure → Systems
- **Brand Director** (`brand_director`) — Identity → Expression
- **UX Designer** (`ux_designer`) — Flow → Interface
- **Engineer · Frontend** (`engineer_frontend`) — Component → Screen
- **Engineer · Backend** (`engineer_backend`) — Contract → API
- **DB Engineer** (`db_engineer`) — Model → Storage
- **QA Agent** (`qa_agent`) — Output → Validation

### Specialist (6)

- **Doc Writer** (`doc_writer`) — System → Documentation
- **Data Analyst** (`data_analyst`) — Events → Insight
- **Payments Agent** (`payments_agent`) — Model → Revenue
- **Auth Agent** (`auth_agent`) — Identity → Access
- **Notification Agent** (`notification_agent`) — Events → Engagement
- **AI Feature Agent** (`ai_feature_agent`) — Capability → Intelligence

### Growth & Marketing (2)

- **Growth Agent** (`growth_agent`) — Users → Loops
- **Content Agent** (`content_agent`) — Strategy → Copy

### Infrastructure (2)

- **DevOps Agent** (`devops_agent`) — Code → Deployed
- **Security Agent** (`security_agent`) — System → Hardened

### Meta / Orchestration (1)

- **Orchestrator** (`orchestrator`) — Agents → Coordination

### Filled examples

Ten of the 19 templates have a worked `*-filled.md` companion in the same tier folder (architect, brand_director, db_engineer, engineer_backend, engineer_frontend, qa_agent, strategist, ux_designer, auth_agent, payments_agent). The filled versions are reference output — they are how a completed template looks for a specific product.

---

## Agent Specs (17, build-ready)

The 17 files in the root of this directory (`NN-<name>-agent-spec.md`) are populated, version-controlled agent specifications for the AppArchitect runtime. They are not the same as the 19-template library above — the spec taxonomy maps to the AppArchitect build system, not the 19 canonical agents.

### Spec Index

| # | Spec File | Role | Primary Templates Consumed |
|---|-----------|------|----------------------------|
| 00 | `00-orchestrator-agent-spec.md` | Master coordination, sequencing, gate enforcement | orchestrator |
| 01 | `01-documentation-agent-spec.md` | PRD, technical spec, content drafting | doc_writer, content_agent |
| 02 | `02-frontend-agent-spec.md` | UI implementation, component build | engineer_frontend, ux_designer |
| 03 | `03-backend-agent-spec.md` | API endpoints, services, business logic | engineer_backend |
| 04 | `04-database-agent-spec.md` | Schema, migrations, query layer | db_engineer |
| 05 | `05-auth-security-agent-spec.md` | Auth flows, RBAC, secrets, threat model | auth_agent, security_agent |
| 06 | `06-ai-integration-agent-spec.md` | Model integration, prompts, evals | ai_feature_agent |
| 07 | `07-devops-agent-spec.md` | CI/CD, infra, deployment, observability | devops_agent |
| 08 | `08-qa-agent-spec.md` | Test plans, test execution, audit | qa_agent, data_analyst |
| 09 | `09-experience-agent-spec.md` | UX flows, accessibility, content tone | ux_designer, brand_director |
| 10 | `10-data-integration-agent-spec.md` | ETL, webhooks, third-party connectors | data_analyst, payments_agent |
| 11 | `11-content-design-agent-spec.md` | Brand voice, copy, design tokens | brand_director, content_agent |
| 12 | `12-orchestration-agent-spec.md` | Multi-agent workflow orchestration | orchestrator, notification_agent |
| 13 | `13-launch-marketing-agent-spec.md` | GTM launch, marketing campaigns | growth_agent, content_agent |
| 14 | `14-social-media-agent-spec.md` | Social channel execution | growth_agent, content_agent |
| 15 | `15-promotion-analytics-agent-spec.md` | Funnel analytics, attribution, growth loops | data_analyst, growth_agent |
| 16 | `16-landing-page-builder-agent-spec.md` | Marketing site, landing pages, waitlist | ux_designer, growth_agent |

A spec is "build-ready" when its corresponding template is filled with the project schema, validated against the canonical PRDs, and merged into the AppArchitect runtime.

### Naming convention

Specs use a 2-digit prefix (`00–16`) reflecting pipeline execution order: 00 runs first (orchestration), 01–02 run during documentation/UX, 03–04 during build, 05–06 during security/AI integration, 07 during deployment, 08 during QA, and 09–16 during launch/iteration. Lower numbers run earlier; later specs may depend on earlier outputs.

---

## Regenerating the templates

```bash
cd AppArchitect-Foundation/_meta
node parse_jsx.mjs             # Extracts agents from both JSX files
node generate_agent_prds.mjs   # Generates the per-agent template docs
node merge_into_templates.mjs  # Merges into templates/<tier>/, renames root spec files
```

The build pipeline produces three file classes per agent: `*-template.md` (blank scaffold), `*-filled.md` (worked example), and `*.md.superseded` (prior generation, kept for diff reference). Superseded files are read-only and never edited.

---

## Source files

| File | Status |
| --- | --- |
| `_meta/apparchitect-agent-prd-v2.jsx` | Canonical JSX source for the 19-agent template library |
| `_meta/agent-prd-template-builder.jsx` | Older draft of the same 19 agents; used for cross-reference |

---

## Cross-References

- **Pipeline stage assignments:** `01 - governance/06-master-generation-pipeline.md`
- **Agent execution contract:** `01 - governance/12-agent-contract-spec.md` (in progress — see N4 audit)
- **Master orchestrator (the brainstem):** `07 - prompt-contracts/01-master-orchestrator-prompt.md`
- **Operational lifecycle for agents:** `05 - operational-standards/02-agent-execution-standard.md`
- **QA gate on agent output:** `08 - validation/01-prd-validator.md`, `08 - validation/04-consistency-validator.md`

---

*Authority: AppArchitect Core Team*
*Last Updated: 2026-07-05*
