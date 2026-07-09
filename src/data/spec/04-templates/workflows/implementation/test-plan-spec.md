# Test Plan Spec Template

**Layer:** Templates / Workflows / Implementation
**Owner:** QA Agent (`agents/specialist/qa_agent.md`)
**Source Workflow:** `06 - workflows/implementation.md`
**Version:** 1.0

## Purpose

Define the complete testing strategy for the system — unit, integration, end-to-end, accessibility, performance, security. The Test Plan Spec converts quality requirements into executable test cases that the Implementation workflow can run, measure, and gate on. Every component ships with passing tests, and every release gate is defined here.

## When to Use

- After Architecture Object is approved
- For every major feature release
- When adding a new integration or external dependency
- When changing authentication, payment, or data model

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| test_plan_id | text (e.g. TEST-001) | yes |
| project_id | text | yes |
| version | text (semver) | yes |
| owner | text (team or agent) | yes |
| status | enum (draft, active, archived) | yes |
| last_run_date | date | no |
| last_run_result | enum (pass, fail, partial) | no |

### Test Strategy Overview

| Field | Type | Required |
|-------|------|----------|
| testing_pyramid_distribution | text (e.g. 70% unit, 20% integration, 10% e2e) | yes |
| in_scope | list | yes |
| out_of_scope | list (e.g. load testing handled separately) | yes |
| tools_used | list (e.g. Jest, Playwright, k6) | yes |
| test_data_strategy | textarea | yes |
| test_environment_strategy | textarea | yes |

### Coverage Targets

| Layer | Target | Measurement Tool |
|-------|--------|------------------|
| Unit | 80% | jest --coverage |
| Integration | 60% | coverage report |
| E2E critical paths | 100% | Playwright trace |
| Accessibility | WCAG-AA | axe-core |
| Performance P95 | <200ms | Lighthouse CI |

### Unit Test Specification

| Field | Type | Required |
|-------|------|----------|
| unit_test_framework | text | yes |
| mock_strategy | textarea | yes |
| per_component_targets | list (component_id → target %) | yes |
| naming_convention | text | yes |

### Integration Test Specification

| Field | Type | Required |
|-------|------|----------|
| integration_scope | list (service boundaries) | yes |
| test_database_strategy | textarea (ephemeral, snapshot, mock) | yes |
| external_service_mocking | list (services + mocks used) | yes |
| scenarios | list | yes |

### End-to-End Test Specification

| Field | Type | Required |
|-------|------|----------|
| e2e_framework | text | yes |
| critical_user_journeys | list | yes |
| browser_coverage | list | yes |
| device_coverage | list | conditional |
| data_fixtures | list | yes |

### Accessibility Test Specification

| Field | Type | Required |
|-------|------|----------|
| compliance_target | enum (WCAG-A, WCAG-AA, WCAG-AAA) | yes |
| automated_tool | text (e.g. axe-core, Pa11y) | yes |
| manual_test_required | boolean | yes |
| manual_scenarios | list (keyboard nav, screen reader) | conditional |
| remediation_workflow | textarea | yes |

### Performance Test Specification

| Field | Type | Required |
|-------|------|----------|
| performance_metrics | list (P50, P95, P99 latency) | yes |
| performance_targets | list (component_id → target) | yes |
| load_test_required | boolean | yes |
| load_test_tool | text (e.g. k6, Artillery) | conditional |
| load_test_scenarios | list | conditional |
| continuous_performance_monitoring | boolean | yes |

### Security Test Specification

| Field | Type | Required |
|-------|------|----------|
| vulnerability_scanning_tool | text (e.g. Snyk, npm audit) | yes |
| sast_tool | text | conditional |
| dast_tool | text | conditional |
| penetration_test_required | boolean | yes |
| auth_test_scenarios | list | yes |
| data_handling_test_scenarios | list | yes |

### Test Cases by Component

For each component being tested:

| Field | Type | Required |
|-------|------|----------|
| component_id | text | yes |
| happy_path_cases | list | yes |
| edge_case_cases | list | yes |
| error_case_cases | list | yes |
| security_case_cases | list | conditional |
| performance_case_cases | list | conditional |

### Regression Strategy

| Field | Type | Required |
|-------|------|----------|
| regression_test_scope | textarea | yes |
| regression_frequency | enum (per-PR, per-deploy, nightly, weekly) | yes |
| full_regression_duration_estimate | text | yes |
| smoke_test_set | list | yes |
| smoke_test_duration_target | text | yes |

### Release Gate Tests

Tests that must pass before any release:

| Gate | Tests | Blocking? |
|------|-------|-----------|
| Unit | all | yes |
| Integration | all | yes |
| E2E critical journeys | all | yes |
| Accessibility | WCAG-AA automated | yes |
| Performance | P95 targets | yes |
| Security scan | no high/critical vulns | yes |
| Smoke | all | yes |

### Test Reporting

| Field | Type | Required |
|-------|------|----------|
| test_report_format | text (e.g. junit.xml, HTML) | yes |
| report_storage | text (e.g. CI artifact, dashboard) | yes |
| flaky_test_policy | textarea (quarantine threshold, owner) | yes |
| failure_investigation_workflow | textarea | yes |

### CI/CD Integration

| Field | Type | Required |
|-------|------|----------|
| tests_run_on_pr | list | yes |
| tests_run_on_merge | list | yes |
| tests_run_nightly | list | yes |
| tests_run_pre_deploy | list | yes |
| failure_blocks_deploy | boolean | yes |

## Validation Rules

- Coverage targets must be measurable
- All release gate tests must be defined before launch
- Flaky test policy must include quarantine threshold
- E2E critical journeys must have 100% coverage
- Performance tests must have rollback criteria if targets missed

## Cross-References

- **Workflow:** `06 - workflows/implementation.md`
- **Component Specs:** `04 - templates/workflows/implementation/component-spec.md`
- **Architecture Object:** `04 - templates/workflows/architecture/architecture-object.md`
- **QA Agent:** `agents/specialist/qa_agent.md`
- **PRD source:** `reference/apparchitect-prd-suite/base-prds/08-test-plan-prd.md`

---

*The Test Plan Spec is the contract between engineering and quality. It defines what "done" means and what "shippable" means.*