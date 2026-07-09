# Clarification Log Template

**Layer:** Templates / Workflows / Discovery
**Owner:** Discovery Agent (`agents/core-pipeline/discovery.md`)
**Source Workflow:** `06 - workflows/discovery.md`
**Version:** 1.0

## Purpose

Capture every clarification question asked and answer received during Discovery. The Clarification Log is the audit trail that proves how ambiguities were resolved. It prevents re-litigation of decisions and provides the lineage for every requirement in the Discovery Report.

## When to Use

- During Discovery workflow (concurrent with research)
- When ambiguity is detected in intake
- When assumption confidence < 0.6
- When stakeholder provides new information

## Structure

### Header

| Field | Type |
|-------|------|
| log_id | text (e.g. clar_log_001) |
| project_name | text |
| discovery_session | text |
| started_at | timestamp |
| closed_at | timestamp |
| total_entries | integer (auto) |

### Entry Format

For each clarification entry:

| Field | Type | Required |
|-------|------|----------|
| entry_id | text (e.g. entry_001) | yes |
| timestamp | timestamp | yes |
| category | enum (vision, scope, users, features, technical, business, compliance, other) | yes |
| question | textarea | yes |
| rationale | textarea | yes |
| asked_by | text (agent name or human name) | yes |
| answered_by | text (human stakeholder) | yes |
| answer | textarea | yes |
| confidence_after | float (0.0 - 1.0) | yes |
| artifacts_affected | list (file paths or schema sections) | yes |
| follow_up_required | boolean | yes |
| follow_up_notes | textarea | no |

### Entry Categories

| Category | Example Questions |
|----------|-------------------|
| vision | Why does this product need to exist? What does success look like at scale? |
| scope | What is v1 vs future? What is explicitly NOT being built? |
| users | Who is the primary user? What jobs are they hiring this product to do? |
| features | Which features are critical for v1? What is the one thing that must work? |
| technical | What platforms? What are the hard constraints (compliance, performance, infra)? |
| business | How does this make money? What is the pricing model? |
| compliance | What regulations apply? What data sensitivity rules exist? |
| other | Anything that does not fit the above |

## Special Entry Types

### Ambiguity Resolution Entry

Use when a single statement has multiple possible interpretations:

| Field | Type |
|-------|------|
| original_statement | textarea |
| interpretations | list (each with rationale) |
| chosen_interpretation | text |
| interpretation_rationale | textarea |

### Contradiction Entry

Use when two statements conflict:

| Field | Type |
|-------|------|
| statement_a | textarea |
| statement_b | textarea |
| conflict_type | enum (direct, partial, implicit) |
| resolution | textarea |
| approved_by | text (stakeholder name) |

### Assumption Confirmation Entry

Use when an assumption is elevated to confirmed requirement:

| Field | Type |
|-------|------|
| assumption_id | text |
| original_assumption | textarea |
| confirmation_method | enum (direct_answer, evidence, validation_test) |
| new_confidence | float (0.0 - 1.0) |
| downstream_impact | list |

## Entry Index

| entry_id | timestamp | category | status |
|----------|-----------|----------|--------|
| (auto-populated) | | | |

## Summary Statistics

| Metric | Value |
|--------|-------|
| total_entries | (auto) |
| resolved_entries | (auto) |
| open_entries | (auto) |
| avg_confidence_after | (auto) |
| entries_by_category | (auto, dict) |
| follow_up_pending | (auto) |

## Validation Rules

- Every entry has `question`, `answer`, and `confidence_after` populated
- Confidence after answer >= 0.6 for entry to count as resolved
- Contradiction entries require explicit `approved_by` human
- All follow_up_required entries must be closed before Discovery Report can be finalized

## Cross-References

- **Workflow:** `06 - workflows/discovery.md`
- **Intake:** `04 - templates/workflows/discovery/intake-brief.md`
- **Report:** `04 - templates/workflows/discovery/discovery-report.md`
- **Assumption Registry:** Embedded in Discovery Report Section 7
- **Gap Registry:** Embedded in Discovery Report Section 8

---

*This template provides the audit trail that makes Discovery auditable and re-runnable.*
