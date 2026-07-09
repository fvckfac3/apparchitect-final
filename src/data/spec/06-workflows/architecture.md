content = """# Architecture Workflow

**Layer:** Workflows
**Tier:** 2 of 6 — Architecture
**Owner:** Architecture Agent
**Source Authority:** `01 - governance/06-master-generation-pipeline.md` (Stages 5–6), `02 - schemas/02-architecture-object.json`

## Purpose

Transform a validated Project Schema into a buildable system architecture: service topology, data model, API contracts, infrastructure, security model, integration map, and non-functional requirement coverage. The Architecture workflow is where strategy becomes structure.

## When to Use

Use this workflow when:

- Discovery and Schema Construction are complete with no blocking gaps
- The Project Schema has passed Schema Validation (Gate 1)
- A re-architecture is needed after a major schema change
- An existing system needs to be re-platformed or restructured

Do NOT use this workflow when:

- The Project Schema has unresolved blocking gaps (run Discovery → Schema first)
- The request is purely a feature addition (use Feature workflow)
- The system is being deprecated

## Inputs

- Validated `project_schema` (passed Schema Validation Gate 1)
- Non-functional requirements (performance, scale, availability, compliance)
- Constraint set (hosting region, cost ceiling, tech stack preferences)
- Optional: existing architecture diagrams, infrastructure inventory, team skill inventory

## Process

Step 1: Domain Decomposition

- Break the system into architecture domains: Frontend, Backend API, Database, Auth, File Storage, Edge Functions, Third-party Integrations, Analytics, AI/ML, Background Jobs, Notifications, Search
- For each domain, identify ownership (which agent/team owns this slice)

Step 2: Service Topology Design

- Map domains to services (monolith, modular monolith, microservices)
- Define service boundaries: input contracts, output contracts, data ownership
- Identify shared vs. domain-specific concerns
- Document the topology decision and tradeoffs

Step 3: Data Model Construction

- Translate `entities` from Project Schema into database tables/collections
- Define fields, types, relationships, indexes, constraints
- Identify row-level security (RLS) requirements per table
- Define data retention and archival strategy
- Generate migration scripts and seed data specifications

Step 4: API Contract Generation

- Generate endpoint definitions for every workflow in the schema
- Specify request/response schemas, auth requirements, rate limits, error codes
- Identify webhook receivers vs. polling endpoints
- Generate OpenAPI 3.0 specification as canonical contract

Step 5: Infrastructure Specification

- Map services to hosting platforms
- Define environments (dev, staging, prod) with promotion rules
- Specify CDN, caching, CDN, secrets management
- Document scaling strategy: vertical vs. horizontal, autoscale triggers, cost ceilings
- Generate Terraform/Pulumi/Bicep specs where applicable

Step 6: Security Architecture

- Authentication: providers, MFA strategy, session management, token rotation
- Authorization: role model, permission matrix, RLS policies
- Encryption: at-rest, in-transit, key rotation policy
- Secrets: storage, access pattern, rotation schedule
- Compliance: applicable frameworks (GDPR, SOC2, HIPAA, CCPA)
- Threat model: top 5 threats, mitigations, residual risk

Step 7: Integration Mapping

- For each integration in the schema: provider, auth method, data exchanged, rate limits, failure handling, cost model
- Webhook receive vs. send: signature verification, idempotency, retry policy
- Identify single-points-of-failure and mitigations

Step 8: Non-Functional Coverage

- For each NFR: target metric, measurement method, current state, gap
- Performance: P50, P95, P99 latency targets per endpoint
- Scalability: concurrent users, requests/sec, data volume at launch and 12mo
- Availability: target uptime, RTO, RPO
- Accessibility: WCAG level, screen reader support, keyboard navigation

Step 9: Validation Pass

- Run all 7 Architecture validators (component, service dependency, data flow, integration, infrastructure, security, NFR coverage)
- Address all Error-level findings before handoff
- Document Warning-level findings with mitigation plans

## Outputs

- `architecture_object` per `02 - schemas/02-architecture-object.json`
- `data_model` — full SQL/Prisma schema with migrations
- `api_contract` — OpenAPI 3.0 spec
- `infra_spec` — hosting + deployment topology
- `security_model` — auth, authz, encryption, compliance
- `integration_map` — every third-party with contract
- `architecture_validation_report` — findings + remediation
- `system_diagram` — visual topology (D2 or equivalent)

## Validation Gates

Gate 1: Service Boundary Integrity

- Rule: Every service has defined ownership and contract
- Severity: Error (blocking)

Gate 2: Data Model Referential Integrity

- Rule: All foreign keys resolve; all enums are closed
- Severity: Error (blocking)

Gate 3: API Contract Completeness

- Rule: Every workflow in Project Schema has at least one API endpoint
- Severity: Error (blocking)

Gate 4: Security Baseline

- Rule: Auth strategy defined for every protected endpoint; encryption at rest + in transit; secrets in vault (not env)
- Severity: Critical (blocking, requires human sign-off)

Gate 5: NFR Coverage

- Rule: Every NFR has a measurement method
- Severity: Warning (not blocking, must be acknowledged)

Gate 6: Integration Auth

- Rule: Every integration specifies auth method and credential storage
- Severity: Error (blocking)

## Failure Modes

- Over-decomposition: Splitting into microservices before scale demands it. Remediation: default to modular monolith unless scale proves otherwise.
- Missing NFR coverage: Architecture looks complete but no availability target exists. Remediation: Gate 5 enforces NFR pairing.
- Auth afterthought: Architecture designed without auth, auth retrofitted. Remediation: Auth is Step 6, never optional.
- Integration optimism: Assuming third-party APIs are reliable. Remediation: every integration has failure handling + circuit breaker.
- Data model drift: Schema changes after architecture locks data model. Remediation: regeneration protocol triggers architecture refresh.

## Worked Example

Input: Dating app for hikers (from Discovery example)

- Entities: User, Profile, Trail, Match, Message, Subscription
- Auth: Email + OAuth (Google, Apple)
- Monetization: Freemium with Stripe
- Integration: AllTrails API

Architecture output:

- Frontend: React Native (iOS + Android), Expo, Reanimated
- Backend: Supabase (Postgres + Auth + Storage + Edge Functions)
- API: Supabase auto-generated REST + custom Edge Functions for matching logic
- Data: 6 tables with RLS (User, Profile, Trail, Match, Message, Subscription)
- Infra: Supabase managed + Vercel for marketing site + Expo EAS for builds
- Security: Supabase Auth + RLS + Stripe webhooks with signature verification
- Integrations: AllTrails (API key in Supabase Vault), Stripe (webhooks + idempotency)
- NFRs: P95 &lt; 500ms, 10k MAU at launch, 99.5% uptime, GDPR compliant

Result: Architecture validated in 3 minutes, 0 critical findings, 2 warnings (CDN not yet configured, automated backup policy needs definition)

## Cross-References

- Governance: `02 - schemas/02-architecture-object.json`, `01 - governance/06-master-generation-pipeline.md`
- Schemas: `02 - schemas/02-architecture-object.json`, `02 - schemas/03-feature.json`
- Templates: `04 - templates/workflows/architecture/architecture-object.md`, `04 - templates/workflows/architecture/architecture-object.md`, `04 - templates/workflows/architecture/integration-spec.md`
- Validation: `08 - validation/02-schema-validator.md`, `08 - validation/06-dependency-validator.md`
- Prompt Contracts: `07 - prompt-contracts/03-architecture-agent-prompt.md`

End of Architecture Workflow
