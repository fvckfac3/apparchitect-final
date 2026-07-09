# User Story Template

**Layer:** Templates / Workflows / Product
**Owner:** PRD Agent (`agents/core-pipeline/prd_agent.md`)
**Source Workflow:** `06 - workflows/product.md`
**Version:** 1.0

## Purpose

Define a single atomic unit of user value as a user story with full acceptance criteria, edge cases, and testable conditions. The User Story is the smallest deployable piece of a feature — every story should be completable in a single sprint and independently shippable.

## When to Use

- During PRD drafting and feature decomposition
- During sprint planning
- When creating implementation tickets
- When defining test cases

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| story_id | text (e.g. STORY-001) | yes |
| feature_id | text (parent feature) | yes |
| epic | text (optional parent epic) | no |
| title | text (short imperative phrase) | yes |
| owner | text | yes |
| priority | enum (must, should, could) | yes |
| story_points | integer | yes |
| status | enum (backlog, ready, in_progress, in_review, done) | yes |

### User Story

> **As a** [user type / persona],
> **I want** [action / capability],
> **so that** [outcome / value].

### Narrative

| Field | Type | Required |
|-------|------|----------|
| context | textarea (why this story exists) | yes |
| who_benefits | text (persona name) | yes |
| value_to_user | textarea | yes |
| value_to_business | textarea | yes |

### Acceptance Criteria (Given/When/Then)

At minimum 3 scenarios, ideally covering happy path, edge case, and error case:

```
Scenario 1: [Happy path]
Given [precondition]
When [action]
Then [expected outcome]

Scenario 2: [Edge case]
Given [precondition]
When [action]
Then [expected outcome]

Scenario 3: [Error case]
Given [precondition]
When [action]
Then [expected outcome]
```

### Definition of Done

- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Accessibility checks passing
- [ ] Documentation updated
- [ ] Acceptance criteria verified by QA
- [ ] Feature flag configured (if applicable)
- [ ] Telemetry tracking verified
- [ ] Deployed to staging
- [ ] Stakeholder demo completed

### UI/UX Notes

| Field | Type | Required |
|-------|------|----------|
| affected_screens | list (screen_ids) | yes |
| design_spec_link | text | yes |
| interaction_notes | textarea | conditional |
| responsive_considerations | list | yes |
| empty_state_design | text | conditional |
| loading_state_design | text | conditional |
| error_state_design | text | conditional |

### Technical Notes

| Field | Type | Required |
|-------|------|----------|
| affected_components | list (component_ids) | yes |
| api_endpoints | list (route + method) | conditional |
| data_changes | list (schema changes) | conditional |
| external_integrations | list | conditional |
| performance_notes | textarea | conditional |
| security_notes | textarea | conditional |

### Dependencies

| Field | Type | Required |
|-------|------|----------|
| blocks_stories | list (story_ids) | yes |
| blocked_by_stories | list (story_ids) | yes |
| external_dependencies | list | yes |

### Test Scenarios

List of specific test cases QA should execute:

| Scenario | Type (unit, integration, e2e, manual) | Priority |
|----------|---------------------------------------|----------|
| | | |
| | | |

### Out of Scope

Explicitly list what this story does NOT do:

- [ ] Does not include [thing]
- [ ] Does not handle [edge case] (handled in STORY-XXX)
- [ ] Does not support [platform] (separate story)

### Traceability

| Field | Type |
|-------|------|
| parent_feature | feature_id |
| related_prd | prd_filename |
| related_personas | list |
| related_workflows | list |

## Validation Rules

- Every story must follow the standard user story format
- Acceptance criteria must include at least 3 scenarios
- All "must" priority stories must be testable
- Story points must be 1, 2, 3, 5, 8, 13, or 21
- Definition of done must be reviewed before story can be marked done

## INVEST Check

The story should meet INVEST criteria — verify before marking ready:

- [ ] **I**ndependent — can be developed in any order
- [ ] **N**egotiable — details can be discussed
- [ ] **V**aluable — delivers user value
- [ ] **E**stimable — team can estimate effort
- [ ] **S**mall — fits within one sprint
- [ ] **T**estable — has clear acceptance criteria

## Cross-References

- **Workflow:** `06 - workflows/product.md`
- **Feature Spec:** `04 - templates/workflows/product/feature-spec.md`
- **UX Flow Spec:** `04 - templates/workflows/product/ux-flow-spec.md`
- **Component Specs:** `04 - templates/workflows/implementation/component-spec.md`

---

*One user story = one atomic user value. If you can't write a single Given/When/Then for it, it's too big. Split it.*