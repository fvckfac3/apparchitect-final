content = """# Implementation Workflow

**Layer:** Workflows
**Tier:** 3 of 6 — Implementation
**Owner:** Implementation Agent
**Source Authority:** `01 - governance/06-master-generation-pipeline.md` (Stages 7–8), `01 - governance/04-validation-rules.md` (Categories 4–5)

## Purpose

Translate validated architecture into working code, configurations, and infrastructure. The Implementation workflow is where the system actually gets built — every prior stage exists to make this stage deterministic.

## When to Use

Use this workflow when:
- Architecture has passed Architecture Validation (Gate 2) with no critical findings
- The Project Schema and Architecture Object are stable
- Feature-level work needs to be broken down into tickets and shipped
- A bug fix or refactor needs structured implementation planning

Do NOT use this workflow when:
- Architecture has unresolved critical findings (run Architecture workflow first)
- The request is purely a research spike (use Spikes workflow if exists, or Discovery)
- A schema or architecture change is needed (route back to Schema or Architecture workflow)

## Inputs

- Validated `architecture_object` (passed Architecture Validation Gate 2)
- Validated `project_schema` (frozen for this implementation cycle)
- Feature specifications (from Product workflow if run sequentially)
- Development environment: local setup, CI/CD, deployment targets

## Process

Step 1: Work Breakdown
- Decompose each feature into implementable tasks (1–4 days each)
- Assign task IDs, owners, dependencies, estimates
- Sequence tasks: critical path first, parallelizable second
- Generate ticket backlog (Linear, GitHub Issues, Jira, or equivalent)

Step 2: Environment Provisioning
- Create dev/staging/prod environments per Architecture spec
- Configure secrets management, CDN, monitoring
- Wire CI/CD pipeline: build, test, lint, deploy stages
- Document rollback procedures

Step 3: Schema Implementation
- Run database migrations in dev, staging, prod (in that order)
- Apply RLS policies per Architecture spec
- Seed development data
- Verify referential integrity

Step 4: API Implementation
- Scaffold endpoints per OpenAPI contract
- Implement auth middleware per Architecture spec
- Wire validation, error handling, rate limiting
- Implement webhook receivers with signature verification + idempotency

Step 5: Frontend Implementation
- Implement screens per UX specs (from Product workflow)
- Wire API client with proper error states
- Implement offline support per Architecture decisions
- Apply design system tokens consistently

Step 6: Integration Wiring
- Configure each integration per Architecture integration map
- Set up webhook receivers with secret storage
- Implement retry/backoff per Architecture
- Test failure scenarios (provider outage, auth failure, rate limit)

Step 7: Test Implementation
- Unit tests: business logic, edge cases, error paths (≥ 80% coverage on critical paths)
- Integration tests: API contracts, database interactions, third-party mocks
- End-to-end tests: critical user journeys
- Security tests: auth bypass attempts, injection, CSRF, IDOR

Step 8: Observability Implementation
- Wire structured logging per service
- Configure error tracking (Sentry, Rollbar, equivalent)
- Configure performance monitoring (APM, RUM)
- Define and instrument key business metrics

Step 9: Documentation Implementation
- README per service with setup, run, test instructions
- API documentation auto-generated from OpenAPI
- Architecture Decision Records (ADRs) for major decisions
- Runbook for on-call (common alerts + remediation)

Step 10: Pre-Launch Validation
- Run all 8 validators (Schema, Discovery, Architecture, Document, Cross-Reference, Security, AI, Export)
- Address all Error and Critical findings
- Smoke test all critical paths in production
- Verify rollback procedure works

## Outputs

- Source code in repository (organized per Architecture)
- Migration scripts applied to all environments
- Test suite with ≥ 80% coverage on critical paths
- CI/CD pipeline operational
- Observability dashboards live
- Documentation: README, API docs, ADRs, runbook
- Pre-launch validation report

## Validation Gates

Gate 1: Test Coverage
- Rule: ≥ 80% coverage on critical paths; 100% on security-sensitive code
- Severity: Error (blocking)

Gate 2: Lint + Type Check
- Rule: Zero lint errors; zero type errors
- Severity: Error (blocking)

Gate 3: Build Success
- Rule: Production build succeeds in CI
- Severity: Critical (blocking)

Gate 4: Security Scan
- Rule: No Critical or High vulnerabilities in dependency scan + SAST
- Severity: Critical (blocking, requires human sign-off)

Gate 5: Smoke Test
- Rule: All critical user journeys work end-to-end in production-like environment
- Severity: Critical (blocking)

Gate 6: Rollback Verified
- Rule: Rollback procedure executed successfully in staging
- Severity: Error (blocking)

Gate 7: Observability Live
- Rule: Logs, errors, metrics flowing; alerts configured
- Severity: Error (blocking)

## Failure Modes

- Skipping tests under time pressure: Short-term gain, long-term debt. Remediation: Gate 1 is non-negotiable.
- Silent security findings: Critical vulns left in "we'll fix it later." Remediation: Gate 4 requires human sign-off.
- Premature optimization: Building for scale that hasn't materialized. Remediation: Profile first, optimize what's measured.
- Incomplete error handling: Happy path works, error paths crash. Remediation: Every error path tested explicitly.
- Configuration drift: Dev works, prod breaks due to env differences. Remediation: IaC for all environments; parity testing.

## Worked Example

Implementation of the dating app from Discovery:
- Tasks: 47 tickets created across 3 sprints (2 weeks each)
- Sprint 1: Schema migrations, auth, basic CRUD
- Sprint 2: Matching logic, AllTrails integration, Stripe wiring
- Sprint 3: Frontend screens, premium tier, observability
- Validation: All gates passed except Gate 4 (1 high vuln in dependency) → remediated within 2 hours

## Cross-References

- Governance: `01 - governance/04-validation-rules.md`, `01 - governance/06-master-generation-pipeline.md`
- Schemas: All schemas are reference; no new schemas created in this workflow
- Templates: `04 - templates/workflows/implementation/implementation-plan.md`, `04 - templates/workflows/implementation/test-plan-spec.md`
- Validation: All 8 validators run in Step 10
- Prompt Contracts: `07 - prompt-contracts/06-prd-agent-prompt.md`, `07 - prompt-contracts/07-technical-spec-agent-prompt.md`

End of Implementation Workflow
