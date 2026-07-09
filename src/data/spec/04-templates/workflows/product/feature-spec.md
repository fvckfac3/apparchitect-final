# Feature Spec Template

**Layer:** Templates / Workflows / Product
**Owner:** PRD Agent (`agents/core-pipeline/prd_agent.md`)
**Source Workflow:** `06 - workflows/product.md`
**Version:** 1.0

## Purpose

Define a single product feature with enough detail that engineering, design, and QA can build, design, and validate it without ambiguity. The Feature Spec is the bridge between the Master PRD and the Implementation Plan — it decomposes one section of the PRD into a buildable, testable, measurable feature.

## When to Use

- For every feature defined in the Master PRD
- For every user-facing capability being added or changed
- When scoping a sprint or milestone
- When communicating feature scope to stakeholders

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| feature_id | text (e.g. FEAT-001) | yes |
| feature_name | text | yes |
| feature_owner | text (PM or agent) | yes |
| parent_prd | text (prd filename) | yes |
| prd_section_ref | text | yes |
| status | enum (drafting, approved, building, shipped, deprecated) | yes |
| priority | enum (must, should, could, won't) | yes |
| target_release | text (version or sprint) | yes |
| created_date | date | yes |
| last_updated | date | yes |

### Summary

| Field | Type | Required |
|-------|------|----------|
| one_sentence_description | text | yes |
| user_value_proposition | textarea | yes |
| business_value_proposition | textarea | yes |
| success_metric | text (e.g. 30% increase in onboarding completion) | yes |
| success_measurement_plan | textarea | yes |

### Problem Statement

| Field | Type | Required |
|-------|------|----------|
| problem_being_solved | textarea | yes |
| who_experiences_it | textarea | yes |
| how_often | textarea | yes |
| current_workaround | textarea | yes |
| cost_of_not_solving | textarea | yes |

### User Stories

At least 3 user stories using standard format:

> As a **[user type]**, I want to **[action]**, so that **[outcome]**.

For each story:
- Acceptance criteria (Given/When/Then)
- Definition of done
- Edge cases

### Functional Requirements

| ID | Requirement | Priority (Must/Should/Could) | Acceptance Criteria |
|----|-------------|------------------------------|---------------------|
| FR-001 | | | |
| FR-002 | | | |
| ... | | | |

### Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | | |
| Accessibility | | |
| Security | | |
| Privacy | | |
| Localization | | |

### User Experience Specification

| Field | Type | Required |
|-------|------|----------|
| user_flow_reference | text (flow_id) | yes |
| primary_screens | list (screen_ids) | yes |
| empty_states | list | yes |
| error_states | list | yes |
| loading_states | list | yes |
| success_states | list | yes |
| motion_requirements | textarea | no |

### Data & Telemetry

| Field | Type | Required |
|-------|------|----------|
| data_collected | list | yes |
| data_storage | textarea | yes |
| analytics_events | list (event_name + properties) | yes |
| privacy_considerations | textarea | yes |
| retention_policy | text | yes |

### Dependencies

| Field | Type | Required |
|-------|------|----------|
| upstream_features | list (feature_ids this depends on) | yes |
| downstream_features | list (feature_ids that depend on this) | yes |
| external_dependencies | list (services, APIs) | yes |
| content_dependencies | list (copy, images, translations) | conditional |
| design_dependencies | list (design specs needed) | yes |

### Rollout Strategy

| Field | Type | Required |
|-------|------|----------|
| rollout_type | enum (internal, beta, staged, GA, feature_flag) | yes |
| rollout_phases | list | conditional |
| feature_flag_required | boolean | yes |
| feature_flag_config | text | conditional |
| kill_switch | text | yes |
| rollback_procedure | textarea | yes |

### Edge Cases & Risks

| Field | Type | Required |
|-------|------|----------|
| known_edge_cases | list | yes |
| known_risks | list | yes |
| open_questions | list | yes |
| unresolved_decisions | list | yes |

### Acceptance Criteria (Release Level)

The feature is releasable when:

- [ ] All functional requirements implemented
- [ ] All non-functional requirements verified
- [ ] All test cases passing (see linked Test Plan Spec)
- [ ] Telemetry tracking confirmed in production
- [ ] Documentation updated
- [ ] Stakeholder demo completed
- [ ] Rollback procedure tested
- [ ] Accessibility audit passed

### Traceability

| Field | Type |
|-------|------|
| related_personas | list (persona_ids) |
| related_workflows | list (workflow_ids) |
| related_components | list (component_ids) |
| related_prds | list |
| related_adrs | list |

## Validation Rules

- Every feature must have at least 3 user stories
- All "Must" requirements must have acceptance criteria
- Success metric must be measurable
- Rollout strategy must include rollback procedure
- Privacy considerations required for any data collection

## Cross-References

- **Workflow:** `06 - workflows/product.md`
- **Master PRD:** `reference/apparchitect-prd-suite/base-prds/` (the relevant PRD)
- **User Story:** `04 - templates/workflows/product/user-story.md`
- **UX Flow Spec:** `04 - templates/workflows/product/ux-flow-spec.md`
- **Component Specs:** `04 - templates/workflows/implementation/component-spec.md`
- **Test Plan Spec:** `04 - templates/workflows/implementation/test-plan-spec.md`

---

*One Feature Spec per product feature. Never bundle multiple features. Scope creep is the enemy of shipping.*