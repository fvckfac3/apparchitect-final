# Pricing Model Template

**Layer:** Templates / Workflows / Business
**Owner:** Payments Agent (`agents/specialist/payments_agent.md`)
**Source Workflow:** `06 - workflows/business.md`
**Version:** 1.0

## Purpose

Define the complete pricing strategy for a product: tiers, features per tier, billing mechanics, and the rationale that connects pricing to user value and business outcomes. The Pricing Model is the source of truth for what users pay, what they get, and how money flows.

## When to Use

- At product launch
- When introducing new tiers or features
- When changing pricing strategy
- When designing free → paid conversion flows

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| model_id | text (e.g. PRICE-001) | yes |
| model_name | text | yes |
| owner | text | yes |
| effective_date | date | yes |
| review_cadence | enum (monthly, quarterly, annually) | yes |
| status | enum (drafting, approved, active, retired) | yes |

### Strategy

| Field | Type | Required |
|-------|------|----------|
| pricing_philosophy | textarea (value-based, cost-plus, competitor-matched, penetration) | yes |
| target_customer_segments | list | yes |
| willingness_to_pay_analysis | textarea | yes |
| competitive_positioning | textarea | yes |
| differentiation_anchor | textarea | yes |

### Pricing Tiers

For each tier:

| Field | Type | Required |
|-------|------|----------|
| tier_id | text | yes |
| tier_name | text | yes |
| tier_positioning | text (who is this for) | yes |
| monthly_price | text | yes |
| annual_price | text | yes |
| annual_discount_percent | integer | conditional |
| price_per_seat | text | conditional |
| free_tier_limits | textarea | conditional |
| feature_inclusions | list (feature_ids) | yes |
| usage_limits | list | yes |
| support_level | enum (community, email, chat, dedicated) | yes |

### Tier Comparison Matrix

| Feature | Free | Tier 1 | Tier 2 | Tier 3 | Enterprise |
|---------|------|--------|--------|--------|------------|
| Feature A | | | | | |
| Feature B | | | | | |
| Usage limit 1 | | | | | |
| Support level | | | | | |

### Billing Mechanics

| Field | Type | Required |
|-------|------|----------|
| billing_intervals | enum (monthly, annual, both, custom) | yes |
| trial_offered | boolean | yes |
| trial_length_days | integer | conditional |
| trial_credit_card_required | boolean | conditional |
| payment_methods_accepted | list | yes |
| currencies_supported | list | yes |
| tax_handling | textarea | yes |

### Free-to-Paid Conversion

| Field | Type | Required |
|-------|------|----------|
| conversion_trigger | text | yes |
| upgrade_prompt_strategy | textarea | yes |
| paywall_design | text | yes |
| friction_reduction | list | yes |
| trial_to_paid_conversion_target | text | yes |

### Discounts & Promotions

| Field | Type | Required |
|-------|------|----------|
| launch_discount_strategy | textarea | yes |
| promotional_pricing_rules | list | yes |
| volume_discounts | list | conditional |
| loyalty_discounts | list | conditional |
| referral_pricing | text | conditional |

### Revenue Recovery (Dunning)

| Field | Type | Required |
|-------|------|----------|
| payment_failure_retry_strategy | textarea | yes |
| dunning_email_sequence | list (day → message) | yes |
| grace_period_days | integer | yes |
| service_suspension_trigger | text | yes |
| cancellation_workflow | textarea | yes |

### Price Change Management

| Field | Type | Required |
|-------|------|----------|
| grandfather_policy | textarea | yes |
| change_communication_strategy | textarea | yes |
| notice_period_days | integer | yes |
| opt_out_provisions | textarea | conditional |

### Competitive Analysis

| Competitor | Their Tiers | Their Pricing | Our Advantage |
|------------|------------|---------------|---------------|
| | | | |

### Compliance & Legal

| Field | Type | Required |
|-------|------|----------|
| applicable_compliance | list (PCI, GDPR, etc.) | yes |
| refund_policy | textarea | yes |
| terms_of_service_link | text | yes |
| privacy_policy_link | text | yes |

### Success Metrics

| Field | Type | Required |
|-------|------|----------|
| target_arpu | text | yes |
| target_conversion_rate | text | yes |
| target_churn_rate | text | yes |
| target_ltv | text | yes |
| measurement_methodology | textarea | yes |

### Cross-References

| Field | Type |
|-------|------|
| related_features | list |
| related_personas | list |
| related_user_stories | list |
| payment_platform | text (Stripe, Paddle, etc.) |
| pricing_page_url | text |

## Validation Rules

- Pricing must align with target customer willingness to pay
- Tier differentiation must be clear (no feature in every tier)
- All prices must include tax handling approach
- Dunning strategy required for any paid tier
- Compliance requirements must be documented

## Cross-References

- **Workflow:** `06 - workflows/business.md`
- **Launch Checklist:** `04 - templates/workflows/business/launch-checklist.md`
- **Financial Model:** `04 - templates/workflows/business/financial-model.md`
- **Payments Agent:** `agents/specialist/payments_agent.md`

---

*If users can't tell why tier 2 is worth more than tier 1, your pricing model is broken. Differentiation is everything.*