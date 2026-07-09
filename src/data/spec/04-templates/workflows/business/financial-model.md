# Financial Model Template

**Layer:** Templates / Workflows / Business
**Owner:** Orchestrator Agent + Finance
**Source Workflow:** `06 - workflows/business.md`
**Version:** 1.0

## Purpose

Project the financial trajectory of a product over a defined time horizon, including revenue, costs, profitability milestones, and key assumptions. The Financial Model makes the business case concrete, surfaces risk early, and provides the baseline against which actual performance is measured.

## When to Use

- Before requesting funding or investment
- Quarterly business reviews
- When pricing or cost structure changes significantly
- When planning major product expansion

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| model_id | text (e.g. FIN-001) | yes |
| product_name | text | yes |
| model_owner | text | yes |
| projection_horizon_months | integer | yes |
| currency | text (USD, EUR, etc.) | yes |
| last_updated | date | yes |
| status | enum (drafting, approved, active, superseded) | yes |

### Executive Summary

| Field | Type | Required |
|-------|------|----------|
| one_line_summary | text | yes |
| key_assumptions | list | yes |
| projected_month_to_break_even | integer | conditional |
| projected_year_to_profitability | integer | conditional |
| total_capital_required | text | conditional |
| funding_ask | text | conditional |

### Revenue Model

#### Revenue Streams

For each revenue stream:

| Field | Type | Required |
|-------|------|----------|
| stream_id | text | yes |
| stream_name | text | yes |
| revenue_type | enum (subscription, one-time, usage, ad, marketplace-take) | yes |
| pricing_model | text (reference Pricing Model) | yes |
| launch_date | date | conditional |
| ramp_up_curve | textarea | yes |

#### Revenue Projections

Monthly breakdown by stream (show first 12 months + annual years 2-5):

| Month/Year | Stream 1 | Stream 2 | Stream 3 | Total |
|------------|----------|----------|----------|-------|
| Month 1 | | | | |
| Month 3 | | | | |
| Month 6 | | | | |
| Month 12 | | | | |
| Year 2 | | | | |
| Year 3 | | | | |

#### Key Revenue Metrics

| Metric | Month 3 | Month 6 | Month 12 | Year 2 | Year 3 |
|--------|---------|---------|----------|--------|--------|
| MRR | | | | | |
| ARR | | | | | |
| ARPU | | | | | |
| Customer count | | | | | |
| ARPA | | | | | |

### Cost Structure

#### Fixed Costs (Monthly)

| Category | Month 1 | Month 6 | Month 12 | Year 2 |
|----------|---------|---------|----------|--------|
| Infrastructure (hosting, DB) | | | | |
| SaaS tooling | | | | |
| Salaries (founders, employees) | | | | |
| Contractors | | | | |
| Office/operational | | | | |
| Insurance/legal | | | | |
| **Total Fixed** | | | | |

#### Variable Costs

| Category | Calculation Basis | Rate | Month 6 Est | Month 12 Est |
|----------|-------------------|------|-------------|--------------|
| Payment processing | % of revenue | | | |
| Customer support | per customer | | | |
| Infrastructure scaling | per user/GB | | | |
| API costs (third-party) | per call | | | |
| **Total Variable** | | | | |

#### One-Time Costs

| Item | Amount | Date |
|------|--------|------|
| Initial development | | |
| Legal incorporation | | |
| Initial marketing | | |
| Equipment | | |
| **Total One-Time** | | |

### Headcount Plan

| Role | Hire Month | Salary | Benefits | Fully Loaded | Month 12 Total |
|------|------------|--------|----------|--------------|----------------|
| Founder | Month 0 | | | | |
| Engineer 1 | | | | | |
| Engineer 2 | | | | | |
| Designer | | | | | |
| PM | | | | | |
| Marketing | | | | | |
| Sales | | | | | |
| Support | | | | | |
| **Total Headcount Cost** | | | | | |

### Customer Acquisition

#### CAC Model

| Field | Type | Required |
|-------|------|----------|
| blended_cac_month_1 | text | yes |
| blended_cac_month_6 | text | yes |
| blended_cac_month_12 | text | yes |
| cac_by_channel | list (channel → CAC) | yes |
| payback_period_months | text | yes |

#### Conversion Funnel Assumptions

| Stage | Month 1 | Month 6 | Month 12 |
|-------|---------|---------|----------|
| Visitors | | | |
| Sign-ups | | | |
| Activated | | | |
| Paid | | | |

### Profitability Analysis

#### Monthly Burn & Runway

| Month | Revenue | Costs | Net | Cash Balance |
|-------|---------|-------|-----|--------------|
| Month 1 | | | | |
| Month 3 | | | | |
| Month 6 | | | | |
| Month 12 | | | | |
| Month 18 | | | | |
| Month 24 | | | | |

#### Break-Even Analysis

| Field | Type | Required |
|-------|------|----------|
| monthly_break_even_revenue | text | yes |
| customer_break_even_count | text | yes |
| projected_break_even_date | date | yes |
| break_even_assumptions | list | yes |

#### Unit Economics

| Metric | Value | Target |
|--------|-------|--------|
| LTV | | |
| CAC | | |
| LTV/CAC | | >3 |
| CAC Payback | | <12 mo |
| Gross Margin | | >70% |
| Net Revenue Retention | | >100% |

### Scenario Analysis

#### Conservative Scenario

| Month | MRR | Costs | Cash |
|-------|-----|-------|------|
| 6 | | | |
| 12 | | | |
| 24 | | | |

#### Base Scenario

(same format)

#### Optimistic Scenario

(same format)

#### Sensitivity Analysis

Which 2-3 assumptions, if wrong, would break the model?

1. [Assumption]: [Impact if 50% worse]
2. [Assumption]: [Impact if 50% worse]
3. [Assumption]: [Impact if 50% worse]

### Key Metrics Dashboard

| Metric | Definition | Target |
|--------|------------|--------|
| MRR | Monthly recurring revenue | |
| ARR | MRR × 12 | |
| Net New MRR | New MRR + Expansion - Churn | |
| Gross Margin | (Revenue - COGS) / Revenue | |
| Net Revenue Retention | (Start MRR + Expansion - Churn) / Start MRR | |
| Logo Churn | % customers lost per month | |
| Revenue Churn | % MRR lost per month | |

### Funding Requirements (if applicable)

| Round | Amount | Date | Use of Funds | Investors |
|-------|--------|------|--------------|-----------|
| Pre-seed | | | | |
| Seed | | | | |
| Series A | | | | |
| Series B | | | | |

### Assumptions Registry

| Assumption | Confidence | Impact if Wrong |
|------------|------------|-----------------|
| | | |
| | | |

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| | | | |
| | | | |

## Validation Rules

- All projections must show monthly granularity for first 12 months
- Three scenarios (conservative, base, optimistic) required
- Unit economics must meet LTV/CAC >3 threshold
- Sensitivity analysis must identify top 3 assumption risks
- Assumptions registry must include confidence levels

## Cross-References

- **Workflow:** `06 - workflows/business.md`
- **Pricing Model:** `04 - templates/workflows/business/pricing-model.md`
- **Launch Checklist:** `04 - templates/workflows/business/launch-checklist.md`
- **Financial 5-Year Model:** `09 - templates/v1.5/PRD Suite Template – 5-Year Financial Model.md.md` (deeper template)

---

*A financial model without assumptions is fiction. A financial model with unverified assumptions is dangerous. Always test your assumptions against reality every quarter.*