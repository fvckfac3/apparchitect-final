# Discovery Report Template

**Layer:** Templates / Workflows / Discovery
**Owner:** Discovery Agent (`agents/core-pipeline/discovery.md`)
**Source Workflow:** `06 - workflows/discovery.md`
**Version:** 1.0

## Purpose

Document the structured output of the Discovery workflow. The Discovery Report captures the Discovery Agent's complete understanding of the project after intake, research, clarification, and gap analysis. It is the canonical artifact passed to the Architecture workflow for Schema Construction.

## When to Use

- End of Discovery workflow (Stage 2 completion)
- Handoff to Architecture workflow
- Stakeholder review checkpoint
- Audit trail of discovered requirements

## Structure

### Section 1 — Project Summary

| Field | Type | Source |
|-------|------|--------|
| project_name | text | Intake Brief |
| one_paragraph_summary | textarea | Synthesized from intake |
| core_thesis | textarea | Why this product, why now |
| discovery_date | date | Auto-generated |
| discovery_agent | text | Who/what ran discovery |

### Section 2 — Structured Requirements

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| functional_requirements | list | yes | One per line, traceable |
| non_functional_requirements | list | yes | Performance, security, scale |
| business_rules | list | yes | Domain logic and constraints |
| integration_requirements | list | no | External services |
| compliance_requirements | list | no | GDPR, HIPAA, SOC2, etc. |

### Section 3 — User Personas (Structured)

For each persona:

| Field | Type |
|-------|------|
| persona_id | text (e.g. persona_001) |
| name | text |
| demographics | textarea |
| goals | list |
| pain_points | list |
| behaviors | textarea |
| technical_skill_level | enum (low, medium, high) |
| context_of_use | textarea |
| priority | enum (primary, secondary, future) |

Minimum: 1 primary persona.

### Section 4 — User Roles

For each role:

| Field | Type |
|-------|------|
| role_id | text |
| role_name | text |
| description | textarea |
| permission_level | enum (guest, user, premium, moderator, admin, superadmin) |

Examples: Guest, User, Premium, Moderator, Admin, SuperAdmin.

### Section 5 — Features (Structured)

For each feature:

| Field | Type |
|-------|------|
| feature_id | text (e.g. feat_001) |
| name | text |
| description | textarea |
| priority | enum (critical, high, medium, low) |
| business_value | enum (high, medium, low) |
| complexity | enum (small, medium, large, xlarge) |
| v1_target | boolean |

Minimum: 3 features in v1.

### Section 6 — Workflows (User Journeys)

For each workflow:

| Field | Type |
|-------|------|
| workflow_id | text |
| name | text |
| trigger | textarea |
| steps | ordered list |
| outcome | textarea |
| alternative_paths | list |

### Section 7 — Assumptions Registry

For each assumption:

| Field | Type |
|-------|------|
| assumption_id | text |
| description | textarea |
| confidence | float (0.0 - 1.0) |
| source | text |
| validation_method | textarea |
| impact_if_wrong | enum (low, medium, high, critical) |

Threshold: assumptions with confidence < 0.6 require explicit human review before advancing.

### Section 8 — Gap Registry

For each gap:

| Field | Type |
|-------|------|
| gap_id | text |
| category | enum (vision, users, features, technical, business, compliance) |
| description | textarea |
| severity | enum (blocker, high, medium, low) |
| recommended_resolution | textarea |

### Section 9 — Discovery Confidence Score

| Dimension | Score (0-100) |
|-----------|---------------|
| vision_clarity | |
| user_understanding | |
| scope_clarity | |
| technical_clarity | |
| business_clarity | |
| **overall** | |

Threshold: overall >= 70 to advance to Architecture workflow.

### Section 10 — Stakeholder Sign-Off

| Field | Type | Required |
|-------|------|----------|
| founder_name | text | yes |
| founder_signature | text | yes |
| signoff_date | date | yes |
| notes | textarea | no |

## Validation Rules

- All `Required` fields must be populated
- Persona count >= 1
- Feature count >= 3
- Overall confidence >= 70
- All gaps >= medium severity must have resolution path

## Cross-References

- **Workflow:** `06 - workflows/discovery.md`
- **Schema:** `02 - schemas/01-project-schema.json`
- **Intake:** `04 - templates/workflows/discovery/intake-brief.md`
- **Next stage:** Architecture Workflow Schema Construction
- **Governance:** `01 - governance/07-project-intake-schema-map.md`

---

*This template is the canonical handoff artifact from Discovery to Architecture workflow.*
