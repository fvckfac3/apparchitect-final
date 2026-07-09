# Component Spec Template

**Layer:** Templates / Workflows / Implementation
**Owner:** Implementation Agent (`agents/core-pipeline/implementation_agent.md`)
**Source Workflow:** `06 - workflows/implementation.md`
**Version:** 1.0

## Purpose

Define a single implementation component (UI element, backend module, database table, service handler, etc.) with enough precision that a developer or coding agent can build it without further clarification. The Component Spec is the atomic unit of implementation — every ticket in the Implementation Plan produces one or more Component Specs.

## When to Use

- For every UI component, screen, or interaction
- For every backend module, API route, or service handler
- For every database table, view, or stored procedure
- For every shared utility, hook, or middleware

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| component_id | text (e.g. COMP-001) | yes |
| component_name | text | yes |
| component_type | enum (ui, api_route, service, database, util, middleware, hook, schema) | yes |
| layer | enum (presentation, business, data, infrastructure) | yes |
| owner | text (human or agent) | yes |
| status | enum (spec, building, live, deprecated) | yes |
| version | text (semver) | yes |
| related_tickets | list (ticket_ids) | yes |

### Purpose & Scope

| Field | Type | Required |
|-------|------|----------|
| one_sentence_purpose | text | yes |
| user_facing_description | textarea | conditional |
| system_facing_description | textarea | conditional |
| in_scope | list | yes |
| out_of_scope | list | yes |

### Interfaces

| Field | Type | Required |
|-------|------|----------|
| inputs | list (typed) | yes |
| outputs | list (typed) | yes |
| public_api | textarea (function signatures, route paths, etc.) | conditional |
| events_emitted | list (event names + payloads) | conditional |
| events_consumed | list (event names + handlers) | conditional |
| state_owned | textarea (what state this component manages) | conditional |

### Dependencies

| Field | Type | Required |
|-------|------|----------|
| upstream_dependencies | list (component_ids, external services) | yes |
| downstream_consumers | list (component_ids that depend on this) | yes |
| shared_state_with | list (component_ids sharing state) | conditional |
| required_env_vars | list (env var names) | yes |

### Behavior Specification

Define behavior with executable precision. Use table form for conditional logic.

#### State Machine (if applicable)

| From State | Event | To State | Side Effects |
|-----------|-------|----------|--------------|
| idle | user submits form | validating | log analytics |
| validating | validation passes | submitting | show spinner |
| validating | validation fails | error | show errors |
| submitting | success | success | redirect, notify |
| submitting | failure | error | show error |

#### Conditional Logic Table

| Condition | Action |
|-----------|--------|
| user authenticated AND has_subscription | show premium features |
| user authenticated AND no_subscription | show upgrade prompt |
| user not authenticated | show login prompt |

#### Error Handling

| Error Class | Detection | Recovery | User Feedback |
|-------------|-----------|----------|---------------|
| validation | client-side check | highlight field | inline message |
| network | fetch failure | retry with backoff | toast + retry button |
| auth | 401 response | redirect to login | session expired message |
| server | 500 response | log + alert | generic error + support link |

### Data Contracts

| Field | Type |
|-------|------|
| input_schema | json_schema_ref |
| output_schema | json_schema_ref |
| database_tables | list (table names) |
| cache_keys | list |
| file_storage_paths | list (paths/s3 keys) |

### UI Specification (for UI components)

| Field | Type | Required |
|-------|------|----------|
| layout | textarea (description or ASCII wireframe) | yes |
| states | list (empty, loading, error, partial, complete) | yes |
| responsive_breakpoints | list | yes |
| accessibility_requirements | list | yes |
| motion_spec | text (e.g. fade-in 200ms) | no |
| design_tokens_used | list (token names) | yes |

### Non-Functional Requirements

| Field | Type | Required |
|-------|------|----------|
| performance_target | text (e.g. <200ms P95) | yes |
| accessibility_compliance | enum (WCAG-A, WCAG-AA, WCAG-AAA) | yes |
| browser_support | list | conditional |
| device_support | list | conditional |
| i18n_support | boolean | yes |
| offline_behavior | textarea | conditional |

### Testing Requirements

| Field | Type | Required |
|-------|------|----------|
| unit_tests_required | boolean | yes |
| integration_tests_required | boolean | yes |
| e2e_tests_required | boolean | yes |
| accessibility_tests_required | boolean | yes |
| visual_regression_required | boolean | conditional |
| test_coverage_target | text (e.g. 80%) | yes |
| test_cases | list | yes |

### Acceptance Criteria

The Definition of Done for this component:

- [ ] All required fields populated
- [ ] All dependencies exist or are scheduled
- [ ] All test scenarios pass
- [ ] Accessibility checks pass
- [ ] Performance target verified
- [ ] Documentation updated
- [ ] Review approved
- [ ] Deployed to staging
- [ ] Smoke tested in production

### Traceability

| Field | Type |
|-------|------|
| affects_features | list (feature_ids) |
| affects_workflows | list (workflow_ids) |
| related_prds | list (prd filenames) |
| related_adrs | list (adr_ids) |

## Validation Rules

- All components must have `in_scope` and `out_of_scope` defined
- State machines must cover all reachable states
- Error handling must include `User Feedback`
- UI components must have `accessibility_requirements`
- Performance target must be measurable

## Cross-References

- **Workflow:** `06 - workflows/implementation.md`
- **Implementation Plan:** `04 - templates/workflows/implementation/implementation-plan.md`
- **Test Plan Spec:** `04 - templates/workflows/implementation/test-plan-spec.md`
- **Architecture Object:** `04 - templates/workflows/architecture/architecture-object.md`

---

*One Component Spec per atomic implementation unit. Bundle related sub-components only when they share state or have no independent lifecycle.*