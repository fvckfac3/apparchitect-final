# Architecture Object Template

**Layer:** Templates / Workflows / Architecture
**Owner:** Architecture Agent (`agents/core-pipeline/architecture.md`)
**Source Workflow:** `06 - workflows/architecture.md`
**Version:** 1.0

## Purpose

The Architecture Object is the canonical artifact produced at the end of the Architecture workflow. It is a complete, implementation-ready specification of the system's technical structure: services, data model, API contracts, infrastructure topology, security model, integration map, and non-functional requirements. It is consumed by the Implementation workflow.

## When to Use

- End of Architecture workflow (Stage 3 completion)
- Handoff to Implementation workflow
- Technical Architecture PRD generation source
- Engineering execution reference

## Structure

### Section 1 — System Topology

| Field | Type | Required |
|-------|------|----------|
| architecture_style | enum (monolith, modular_monolith, microservices, serverless, hybrid) | yes |
| service_count | integer | yes |
| service_map | diagram (component topology) | yes |
| data_flow_diagram | diagram | yes |
| deployment_topology | diagram | yes |
| rationale | textarea | yes |

### Section 2 — Frontend Architecture

| Field | Type | Required |
|-------|------|----------|
| framework | text (e.g. React, React Native, Swift, Kotlin) | yes |
| state_management | text (e.g. Redux, Zustand, Riverpod) | no |
| routing | text | no |
| component_library | text (e.g. shadcn, MUI, custom) | no |
| styling | text (e.g. Tailwind, styled-components) | no |
| build_tool | text (e.g. Vite, Webpack, Expo) | no |
| platform_targets | list (web, ios, android, desktop) | yes |
| web_framework | text | conditional |
| mobile_framework | text | conditional |

### Section 3 — Backend Architecture

| Field | Type | Required |
|-------|------|----------|
| runtime | text (e.g. Node.js, Bun, Python, Go) | yes |
| framework | text (e.g. Express, Hono, FastAPI, Gin) | yes |
| api_style | enum (rest, graphql, trpc, grpc) | yes |
| auth_strategy | text (e.g. Supabase Auth, Clerk, Auth0, custom JWT) | yes |
| middleware_stack | list | no |
| service_dependencies | list | yes |

### Section 4 — Database Architecture

| Field | Type | Required |
|-------|------|----------|
| primary_database | text (e.g. PostgreSQL via Supabase) | yes |
| secondary_databases | list | no |
| caching_layer | text (e.g. Redis, Upstash) | no |
| search_engine | text (e.g. Meilisearch, Algolia) | no |
| vector_database | text (conditional on AI features) | no |
| rls_required | boolean | yes |
| backup_strategy | text | yes |
| migration_strategy | text (e.g. Supabase migrations) | yes |

### Section 5 — API Contracts

For each API endpoint:

| Field | Type |
|-------|------|
| endpoint_id | text (e.g. api_001) |
| method | enum (GET, POST, PUT, PATCH, DELETE) |
| path | text (e.g. /api/v1/users/:id) |
| auth_required | boolean |
| rate_limit | text |
| request_schema | json_schema_ref |
| response_schema | json_schema_ref |
| error_responses | list (status, code, message) |
| owner_service | text |

Minimum: full surface area of all v1 features.

### Section 6 — Authentication & Authorization

| Field | Type | Required |
|-------|------|----------|
| auth_methods | list (email_password, oauth_google, oauth_apple, magic_link, phone_otp) | yes |
| session_strategy | text (jwt, session_cookie, oauth_token) | yes |
| session_ttl | text (e.g. 7d, 24h) | yes |
| refresh_strategy | text | conditional |
| mfa_required | boolean | no |
| password_policy | text | conditional |
| rls_policies | list (table, role, policy) | yes |
| role_definitions | list (role, permissions) | yes |

### Section 7 — Integration Map

For each integration:

| Field | Type |
|-------|------|
| integration_id | text |
| provider | text (e.g. Stripe, Twilio, SendGrid) |
| purpose | textarea |
| auth_method | text (api_key, oauth, webhook_signature) |
| data_exchanged | list |
| failure_handling | textarea |
| webhook_events | list |
| sdk_or_api | enum |

### Section 8 — Infrastructure & Hosting

| Field | Type | Required |
|-------|------|----------|
| hosting_provider | text (e.g. Vercel, AWS, Render, Fly.io) | yes |
| environments | list (dev, staging, production) | yes |
| cdn | text | no |
| edge_functions | boolean | no |
| container_strategy | text (Docker, ECS, K8s, none) | no |
| ci_cd | text (e.g. GitHub Actions) | yes |
| monitoring | text (e.g. Sentry, Logfire) | yes |
| logging | text (e.g. Loki, Datadog) | yes |
| cost_estimate_monthly | text | yes |

### Section 9 — Security Architecture

| Field | Type | Required |
|-------|------|----------|
| encryption_at_rest | boolean | yes |
| encryption_in_transit | boolean | yes |
| secret_management | text (e.g. env vars, Vault) | yes |
| threat_model_summary | textarea | yes |
| compliance_requirements | list (GDPR, HIPAA, SOC2, PCI) | no |
| audit_logging | boolean | yes |
| vulnerability_scanning | text | no |
| data_classification | text (public, internal, confidential, restricted) | yes |

### Section 10 — Non-Functional Requirements

| Metric | Target | Priority |
|--------|--------|----------|
| p95_latency | e.g. < 200ms | high |
| p99_latency | e.g. < 500ms | high |
| availability | e.g. 99.9% | high |
| concurrent_users | e.g. 10k | medium |
| data_retention | e.g. 90 days raw, indefinite aggregated | medium |
| accessibility | WCAG 2.1 AA | high |
| browser_support | list (last 2 versions of major) | medium |
| mobile_os_support | list (iOS 16+, Android 12+) | medium |

### Section 11 — Scalability Targets

| Horizon | DAU | Data Volume | Infra Cost |
|---------|-----|-------------|------------|
| launch | | | |
| 6 months | | | |
| 12 months | | | |

### Section 12 — Architecture Decision Records (ADRs)

For each significant decision:

| Field | Type |
|-------|------|
| adr_id | text |
| title | text |
| context | textarea |
| decision | textarea |
| alternatives_considered | list |
| consequences | textarea |
| decision_date | date |
| deciders | list |

## Validation Rules

- All `Required` fields populated
- API endpoint coverage >= v1 feature count
- Auth strategy specified for all protected endpoints
- RLS policies for all tables containing user data
- ADR count >= 3 (for any non-trivial system)

## Cross-References

- **Workflow:** `06 - workflows/architecture.md`
- **Discovery input:** `04 - templates/workflows/discovery/discovery-report.md`
- **Schema source:** `02 - schemas/02-architecture-object.json`
- **Next stage:** Implementation Workflow
- **Tech Spec PRD:** `reference/apparchitect-prd-suite/base-prds/06-technical-architecture-prd.md`

---

*This template is the technical single source of truth for Implementation workflow and downstream agents.*
