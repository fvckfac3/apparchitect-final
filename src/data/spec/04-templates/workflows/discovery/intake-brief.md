# Intake Brief Template

**Layer:** Templates / Workflows / Discovery
**Owner:** Discovery Agent (`agents/core-pipeline/discovery.md`)
**Source Workflow:** `06 - workflows/discovery.md`
**Version:** 1.0

## Purpose

Capture raw founder/project intent at the start of the Discovery workflow. This is the structured intake form used by the Discovery Agent when gathering requirements. All fields feed directly into the Project Schema (see `02 - schemas/01-project-schema.json`).

## When to Use

- New project intake
- Re-intake after major scope change
- Discovery Agent interview session
- Initial stakeholder consultation

## Structure

### Section 1 — Project Identity

| Field | Type | Required | Example |
|-------|------|----------|---------|
| project_name | text | yes | e.g. BOND, AppArchitect, ROOTSTOCK |
| project_tagline | text | yes | e.g. The science-backed relationship wellness app for couples |
| project_type | enum | yes | web, mobile, api, desktop, embedded |
| current_phase | enum | yes | ideation, pre-prd, architecture, build, beta, launch, growth |
| org_name | text | yes | e.g. SENET |
| contact_email | email | yes | founder@example.com |

### Section 2 — Vision

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| vision_statement | textarea | yes | What does the world look like if this succeeds? |
| core_problem | textarea | yes | The specific pain or gap |
| why_now | textarea | no | Why is this the right moment? |
| success_definition | textarea | yes | How do you measure success? |

### Section 3 — Audience

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| primary_audience | textarea | yes | Demographics + psychographics + context of use |
| secondary_audience | textarea | no | Adjacent or future segments |
| user_pain_points | list | yes | One per line |
| user_goals | list | yes | One per line |

### Section 4 — Scope

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| in_scope_v1 | list | yes | What is in the first release |
| out_of_scope_v1 | list | yes | Explicitly excluded |
| hard_constraints | list | no | Compliance, budget, timeline, tech |
| assumptions | list | no | Assumptions to validate later |

### Section 5 — Monetization Signal

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| revenue_model | enum | no | freemium, subscription, one-time, marketplace, b2b-licensing, ads, none |
| pricing_intuition | text | no | Even rough estimates help |
| target_arr_12mo | number | no | Or any revenue metric |

### Section 6 — Tech & Platform

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| target_platforms | list | no | web, ios, android, desktop, api |
| tech_stack_preference | text | no | If known |
| integration_requirements | list | no | Third-party services |

### Section 7 — Team & Timeline

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| team_size | number | no | Solo, 2-5, 6-20, 20+ |
| target_launch_date | date | no | Best estimate |
| budget_signal | text | no | Runway, funding, bootstrapped |

## Usage Notes

1. Discovery Agent conducts interview using this template as the guide
2. All `Required = yes` fields must be filled before intake can advance to Schema Construction
3. Confidence scores recorded per field (see `01 - governance/07-project-intake-schema-map.md`)
4. Missing fields produce assumptions in the gap registry
5. Template output feeds Project Schema directly

## Validation

- Validate against `02 - schemas/01-project-schema.json`
- Run intake completeness check (all required domains evaluated)
- Confidence threshold: 0.6 minimum for assumptions to advance without human review

## Cross-References

- **Workflow:** `06 - workflows/discovery.md`
- **Schema:** `02 - schemas/01-project-schema.json`
- **Governance:** `01 - governance/07-project-intake-schema-map.md`
- **Owner:** Discovery Agent
- **Output of:** Founder interview, stakeholder consultation
- **Input to:** Schema Construction (Architecture Workflow Stage 2)

---

*This template is used by the Discovery workflow to capture structured intake before schema construction.*
