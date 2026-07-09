# UX Flow Spec Template

**Layer:** Templates / Workflows / Product
**Owner:** UX Agent (`agents/specialist/ux_agent.md`)
**Source Workflow:** `06 - workflows/product.md`
**Version:** 1.0

## Purpose

Define a complete user flow from trigger to outcome, including all states, transitions, and exit conditions. The UX Flow Spec converts user stories into a navigable blueprint that design, frontend, and QA can all implement against. It bridges the gap between textual user stories and wireframe-level design.

## When to Use

- For every user journey defined in a Feature Spec
- When designing new screens or flows
- When mapping existing flows for redesign
- When coordinating design + frontend handoff

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| flow_id | text (e.g. FLOW-001) | yes |
| flow_name | text | yes |
| feature_id | text (parent feature) | yes |
| owner | text | yes |
| primary_persona | text | yes |
| secondary_personas | list | no |
| flow_type | enum (linear, branching, loop, wizard) | yes |
| complexity | enum (simple, moderate, complex) | yes |

### Trigger

| Field | Type | Required |
|-------|------|----------|
| trigger_event | text (what starts the flow) | yes |
| trigger_source | text (where it originates: deep link, button, notification, system) | yes |
| trigger_context | textarea (what state user is in) | yes |
| preconditions | list | yes |

### Goal & Success Criteria

| Field | Type | Required |
|-------|------|----------|
| user_goal | textarea | yes |
| business_goal | textarea | yes |
| success_outcome | text | yes |
| failure_outcome | text | yes |
| abandonment_acceptable | boolean | yes |

### Flow Steps

For each step in the flow:

| Field | Type | Required |
|-------|------|----------|
| step_id | text (e.g. STEP-001) | yes |
| step_name | text | yes |
| screen_id | text | yes |
| user_action | text | yes |
| system_response | text | yes |
| next_step | text (step_id) | yes |
| is_terminal | boolean | yes |
| terminal_outcome | enum (success, abandonment, error, off-flow) | conditional |

### State Diagram

Show all states and transitions:

```
[Start: Trigger]
    ↓
[Step 1: Screen A] --action--> [Step 2: Screen B]
    ↓                              ↓
[Exit: Abandonment]          [Step 3: Screen C]
                                    ↓
                               [Exit: Success]
```

### Decision Points

At each branch in the flow:

| Field | Type | Required |
|-------|------|----------|
| decision_point_id | text | yes |
| question | text | yes |
| conditions | list (condition → outcome) | yes |
| default_branch | text | yes |

### Validation Rules

For each form/input step:

| Field | Type | Required |
|-------|------|----------|
| validation_id | text | yes |
| field_name | text | yes |
| validation_type | enum (required, format, range, custom) | yes |
| error_message | text | yes |
| trigger | enum (on-blur, on-submit, on-change) | yes |

### Error Handling

| Field | Type | Required |
|-------|------|----------|
| error_scenario | text | yes |
| user_facing_message | text | yes |
| recovery_action | text | yes |
| retry_strategy | text | conditional |
| support_contact | boolean | yes |

### Edge Cases

List of unusual but valid scenarios:

- [ ] Edge case 1: [description]
- [ ] Edge case 2: [description]

### Performance Targets

| Field | Type | Required |
|-------|------|----------|
| max_steps_to_completion | integer | yes |
| target_completion_time | text | yes |
| max_load_time_per_screen | text | yes |
| animation_max_duration | text | yes |

### Accessibility Requirements

| Field | Type | Required |
|-------|------|----------|
| keyboard_navigation_required | boolean | yes |
| screen_reader_announcements | list | yes |
| focus_management_strategy | textarea | yes |
| color_contrast_target | enum (AA, AAA) | yes |
| text_scaling_support | text | yes |

### Empty / Error / Loading States

For each step with data:

| State Type | Description | Visual Reference |
|------------|-------------|------------------|
| Empty | | |
| Loading | | |
| Partial | | |
| Error | | |
| Empty after action | | |

### Cross-Platform Considerations

| Field | Type | Required |
|-------|------|----------|
| web_specific_notes | textarea | conditional |
| mobile_specific_notes | textarea | conditional |
| desktop_specific_notes | textarea | conditional |
| tablet_specific_notes | textarea | conditional |

### Analytics Events

| Field | Type | Required |
|-------|------|----------|
| flow_started_event | text | yes |
| step_completed_events | list (step_id → event_name) | yes |
| flow_completed_event | text | yes |
| abandonment_events | list (step_id → event_name) | yes |
| error_events | list | yes |

### Cross-References

| Field | Type |
|-------|------|
| parent_feature | feature_id |
| related_user_stories | list |
| related_screens | list (screen_ids) |
| related_components | list |
| related_personas | list |

## Validation Rules

- Every flow must have a clear success and failure outcome
- All decision points must have a default branch
- All error scenarios must have a recovery action
- Accessibility requirements are mandatory for all flows
- Analytics events must be defined before flow ships

## Cross-References

- **Workflow:** `06 - workflows/product.md`
- **Feature Spec:** `04 - templates/workflows/product/feature-spec.md`
- **User Story:** `04 - templates/workflows/product/user-story.md`
- **UX Agent:** `agents/specialist/ux_agent.md`

---

*A flow spec without a state diagram is incomplete. If you can't draw it, you don't understand it yet.*