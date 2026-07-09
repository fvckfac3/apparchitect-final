# Tech Decision Record (ADR) Template

**Layer:** Templates / Workflows / Architecture
**Owner:** Architecture Agent (`agents/core-pipeline/architecture.md`)
**Source Workflow:** `06 - workflows/architecture.md`
**Version:** 1.0

## Purpose

Capture the reasoning behind every significant technology choice in the Architecture Object. An ADR (Architecture Decision Record) is the immutable historical record of why a decision was made, what alternatives were considered, and what consequences were accepted. ADRs prevent re-litigation of closed decisions and provide the lineage for the technical stack.

## When to Use

- Whenever a significant technology choice is made
- When an alternative is rejected
- When a decision is later reversed (new ADR supersedes old)
- When onboarding new technical contributors

## Decision Classification

Before writing an ADR, classify the decision:

| Class | Description | Example |
|-------|-------------|---------|
| reversible | Can be changed later with bounded cost | choose CSS framework |
| costly-reversible | Change requires significant rework | choose primary database |
| irreversible | Cannot be undone without rewrite | choose authentication provider, vendor lock-in |

Irreversible decisions require elevated scrutiny: explicit human review, longer evaluation window, pilot phase if possible.

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| adr_id | text (e.g. ADR-001) | yes |
| title | text | yes |
| status | enum (proposed, accepted, deprecated, superseded) | yes |
| decision_class | enum (reversible, costly-reversible, irreversible) | yes |
| decision_date | date | yes |
| last_updated | date | yes |
| deciders | list (human names + agent names) | yes |
| supersedes | adr_id | conditional |
| superseded_by | adr_id | conditional |

### Context

What is the situation that requires this decision? Force the reader to understand the forces at play without knowing the decision.

| Field | Type | Required |
|-------|------|----------|
| problem_statement | textarea | yes |
| constraints | list | yes |
| assumptions | list | yes |
| dependencies | list (other ADRs, upstream schemas, business requirements) | no |

### Decision

What did we decide? State the choice clearly and unambiguously.

| Field | Type | Required |
|-------|------|----------|
| chosen_option | text | yes |
| chosen_option_details | textarea | yes |
| rationale_summary | text (1-2 sentences) | yes |

### Alternatives Considered

For each alternative:

| Field | Type |
|-------|------|
| alternative_id | text |
| option | text |
| description | textarea |
| pros | list |
| cons | list |
| rejection_reason | textarea |
| estimated_cost_to_pivot | text |

Minimum 2 alternatives. For irreversible decisions, minimum 3.

### Consequences

What becomes easier or harder because of this decision?

| Field | Type | Required |
|-------|------|----------|
| positive_consequences | list | yes |
| negative_consequences | list | yes |
| risks | list | yes |
| mitigations | list (each risk paired with mitigation) | yes |
| follow_up_required | boolean | yes |
| follow_up_actions | list | conditional |

### Compliance & Review

| Field | Type | Required |
|-------|------|----------|
| governance_review_required | boolean | yes |
| governance_review_status | enum (pending, approved, rejected) | conditional |
| human_review_required | boolean | conditional |
| human_reviewer | text | conditional |
| review_date | date | conditional |
| approval_signature | text | conditional |

### Traceability

| Field | Type |
|-------|------|
| affects_features | list (feature_ids) |
| affects_workflows | list (workflow_ids) |
| affects_architecture_sections | list (architecture_object sections) |
| related_adrs | list (adr_ids) |

## ADR Lifecycle

```
draft → proposed → under_review → accepted → (active)
                                → rejected → (archived)
                                → superseded → (archived)
```

Status transitions:
- `draft → proposed`: when circulated for review
- `proposed → accepted`: when governance review passes
- `proposed → rejected`: when decision is not approved
- `accepted → superseded`: when a new ADR replaces it
- `accepted → deprecated`: when no longer relevant

## Validation Rules

- All ADR classes must have `consequences` populated
- `costly-reversible` and `irreversible` decisions require `governance_review_status = approved`
- `irreversible` decisions additionally require `human_reviewer` and `approval_signature`
- Superseded ADRs cannot be edited (create a new ADR with `supersedes` reference)

## ADR Index

Maintain a running index of all ADRs:

| adr_id | title | status | class | date |
|--------|-------|--------|-------|------|
| ADR-001 | | | | |
| ADR-002 | | | | |

## Cross-References

- **Workflow:** `06 - workflows/architecture.md`
- **Architecture Object:** `04 - templates/workflows/architecture/architecture-object.md` Section 12
- **Governance:** `governance/04-validation-rules.md` (decision quality criteria)
- **Schema:** `02 - schemas/03-feature.json` (affected features link)

---

*ADRs are append-only by default. They are the institutional memory of the architecture.*
