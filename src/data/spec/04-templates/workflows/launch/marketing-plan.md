# Marketing Plan Template

**Layer:** Templates / Workflows / Launch
**Owner:** Orchestrator Agent + Marketing
**Source Workflow:** `06 - workflows/launch.md`
**Version:** 1.0

## Purpose

Define the ongoing marketing strategy for the product beyond launch: positioning, channels, content strategy, growth tactics, and measurement framework. The Marketing Plan provides the strategic foundation that the Launch Plan executes against.

## When to Use

- 60-90 days before launch (initial plan)
- Quarterly refresh
- When launching a major new feature or entering a new market
- When current acquisition channels are saturating

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| plan_id | text (e.g. MKT-001) | yes |
| product_name | text | yes |
| plan_owner | text | yes |
| plan_horizon | text (e.g. "Q3-Q4 2026") | yes |
| last_updated | date | yes |

### Market Context

| Field | Type | Required |
|-------|------|----------|
| market_definition | text | yes |
| market_size | text (TAM/SAM/SOM) | yes |
| market_maturity | enum (emerging, growing, mature, declining) | yes |
| competitive_landscape | list (3-5 key competitors) | yes |
| market_trends | list (3-5 trends affecting strategy) | yes |

### Target Audience

#### Primary Segment

| Field | Type | Required |
|-------|------|----------|
| segment_name | text | yes |
| segment_size | text | yes |
| demographic_profile | textarea | yes |
| psychographic_profile | textarea | yes |
| jobs_to_be_done | list | yes |
| pain_points | list | yes |
| buying_behavior | textarea | yes |

#### Secondary Segments

(repeat structure for each)

#### Anti-Personas

Who is explicitly NOT the target? (helps focus)

| Anti-Persona | Why Excluded |
|--------------|--------------|
| | |

### Positioning

#### Positioning Statement

> For [target audience] who [need/opportunity], [product name] is [category] that [key benefit]. Unlike [alternatives], [product name] [key differentiator].

#### Value Proposition Canvas

| Gains | Pains | Jobs |
|-------|-------|------|
| | | |

#### Brand Voice

| Attribute | Do | Don't |
|----------|-----|-------|
| Tone | | |
| Vocabulary | | |
| Personality | | |
| Boundaries | | |

### Marketing Goals

#### North Star Metric

The single metric that best captures the value the product delivers to users.

| Field | Type | Required |
|-------|------|----------|
| metric_name | text | yes |
| definition | text | yes |
| current_value | text | yes |
| 12_month_target | text | yes |

#### Supporting Metrics

| Metric | Current | 90-Day Target | 12-Month Target |
|--------|---------|---------------|-----------------|
| Active users | | | |
| Sign-ups | | | |
| Conversion rate | | | |
| Retention (D7/D30) | | | |
| NPS | | | |
| Brand awareness | | | |
| Organic traffic | | | |

### Channel Strategy

#### Channel Mix

| Channel | Role | Investment | Expected ROI |
|---------|------|------------|--------------|
| Content marketing | | | |
| SEO | | | |
| Paid search | | | |
| Paid social | | | |
| Email | | | |
| Social organic | | | |
| Partnerships | | | |
| Community | | | |
| PR | | | |
| Events | | | |
| Referral | | | |

#### Channel Detail (per channel)

For each priority channel:

| Field | Type | Required |
|-------|------|----------|
| channel_name | text | yes |
| target_audience | text | yes |
| content_types | list | yes |
| posting_frequency | text | yes |
| success_metrics | list | yes |
| owner | text | yes |
| tools_used | list | yes |

### Content Strategy

#### Content Pillars

| Pillar | Topic Area | Audience | Goal | Frequency |
|--------|------------|----------|------|-----------|
| | | | | |

#### Content Types

| Type | Purpose | Channel | Frequency | Owner |
|------|---------|---------|-----------|-------|
| Blog posts | | | | |
| Long-form guides | | | | |
| Video tutorials | | | | |
| Case studies | | | | |
| Webinars | | | | |
| Podcasts (guest) | | | | |
| Infographics | | | | |
| Templates/tools | | | | |

#### Editorial Calendar

| Week | Content | Channel | Owner | Status |
|------|---------|---------|-------|--------|
| | | | | |

### Growth Tactics

#### Acquisition Tactics

| Tactic | Description | Cost | Expected Impact | Priority |
|--------|-------------|------|-----------------|----------|
| SEO content | | | | |
| Paid ads | | | | |
| Referral program | | | | |
| Partnerships | | | | |
| Product Hunt | | | | |
| Guest posting | | | | |
| Community presence | | | | |
| Influencer | | | | |

#### Activation Tactics

| Tactic | Description | Cost | Expected Impact | Priority |
|--------|-------------|------|-----------------|----------|
| Onboarding optimization | | | | |
| Welcome emails | | | | |
| First-run experience | | | | |
| Empty states | | | | |

#### Retention Tactics

| Tactic | Description | Cost | Expected Impact | Priority |
|--------|-------------|------|-----------------|----------|
| Email re-engagement | | | | |
| Feature education | | | | |
| Loyalty program | | | | |
| Win-back campaigns | | | | |

#### Referral Tactics

| Tactic | Description | Cost | Expected Impact | Priority |
|--------|-------------|------|-----------------|----------|
| In-product referral | | | | |
| Affiliate program | | | | |
| Customer advocacy | | | | |

### Budget Allocation

| Category | Monthly Budget | % of Total |
|----------|----------------|------------|
| Paid acquisition | | |
| Content production | | |
| Tools & software | | |
| Agencies/contractors | | |
| Events | | |
| **Total** | | 100% |

### Measurement Framework

#### Attribution Model

Which model? (first-touch, last-touch, multi-touch, data-driven)

#### Reporting Cadence

| Report | Frequency | Audience | Owner |
|--------|-----------|----------|-------|
| Channel performance | Weekly | Marketing team | |
| Acquisition cost | Weekly | Marketing + Finance | |
| Conversion funnel | Weekly | Marketing + Product | |
| Campaign performance | Per campaign | Marketing + Stakeholders | |
| Full marketing review | Monthly | All stakeholders | |

#### Key Reports

- **Weekly dashboard:** All channel metrics, spend, ROI
- **Monthly review:** Goal progress, channel performance, tactic effectiveness
- **Quarterly review:** Strategy refresh, budget reallocation, new tactics

### Risks & Constraints

| Risk | Mitigation |
|------|------------|
| Channel saturation | |
| Algorithm changes | |
| Competitor moves | |
| Budget cuts | |
| Brand reputation | |
| Compliance/legal | |

### Experimentation Roadmap

| Experiment | Hypothesis | Success Metric | Timeline |
|------------|------------|----------------|----------|
| | | | |

### Team & Resources

| Role | Responsibility | FTE/Contractor |
|------|----------------|----------------|
| Marketing lead | | |
| Content writer | | |
| Designer | | |
| Performance marketer | | |
| Community manager | | |
| PR/Comms | | |

## Validation Rules

- Plan must include measurable goals with specific timeframes
- Budget allocation must sum to 100%
- Each tactic must have an expected impact estimate
- Attribution model must be explicitly chosen
- Quarterly refresh cadence must be committed

## Cross-References

- **Workflow:** `06 - workflows/launch.md`
- **Launch Plan:** `04 - templates/workflows/launch/launch-plan.md`
- **Post-Launch Review:** `04 - templates/workflows/launch/post-launch-review.md`
- **Pricing Model:** `04 - templates/workflows/business/pricing-model.md`

---

*Marketing without measurement is hope. Measurement without marketing is reporting. You need both, working in a tight loop.*