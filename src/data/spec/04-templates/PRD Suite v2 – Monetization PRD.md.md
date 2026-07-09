# [Product Name] – Monetization PRD

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** [Product Name] – Master PRD Index
**Precedence:** 4th (governs revenue; does not override product behavior)

---

## ⚠️ Precedence Compliance Block

This document defines how the product makes money. It governs pricing, packaging, billing, and revenue recognition. It does not change what the product does — that is governed by Core Systems PRD.

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | Pricing must not coerce | No dark patterns in pricing; no hidden fees |
| Project Brief | Pricing model and audience | Pricing must serve the documented target audience |
| UX PRD | Pricing page is a UX surface | Pricing page must follow UX document contracts |
| Content & Copy PRD | All pricing copy | Every visible pricing string must reference a Content PRD key |
| Requirements Summary | Functional requirements | Billing requirements registered as `F-*` or `NF-*` |

---

## 1. Purpose of This Document

This document defines the product's revenue model. It specifies what is sold, how it is priced, how it is packaged, how it is billed, and how revenue is recognized. It is the contract between product, finance, and engineering for everything that affects what users pay.

If a revenue decision affects what the product does, the change must be specified in Core Systems PRD first. This document only specifies *how the user is charged* and *what they get*.

---

## 2. RLM Compliance

| Field | Value |
|---|---|
| Information Density | O(P×U) — P plans × U usage dimensions |
| Density Explanation | Each plan has multiple usage dimensions; plans have different entitlements; entitlements interact |
| Decomposition Required | Yes — process one plan at a time; build entitlement matrix; verify cross-plan parity |
| Decomposition Strategy | Step 0: enumerate plans. Step 1: enumerate entitlement dimensions. Step 2: build plan × entitlement matrix. Step 3: verify edge cases (overages, downgrades, pauses). |

---

## 3. Monetization Principles

| # | Principle | What It Means |
|---|---|---|
| 1 | Transparent pricing | Every charge visible before commitment; no hidden fees; no surprise renewals |
| 2 | Aligned incentives | The product makes more money when the user gets more value |
| 3 | Easy to upgrade, easy to downgrade | No friction changing plans; no penalty for shrinking usage |
| 4 | No lock-in by artificial scarcity | Users can export their data and leave at any time |
| 5 | No dark patterns | No manipulative design to extract payment; no guilt-tripping on cancellation |

---

## 4. Revenue Model

| Field | Value |
|---|---|
| Primary Model | [Subscription / One-time / Usage-based / Marketplace take rate / Freemium / Advertising / Hybrid] |
| Secondary Model | [If hybrid — describe secondary component] |
| Billing Frequency | [Monthly / Annual / Per-use / Per-transaction] |
| Currency | [USD / Multi-currency] |
| Payment Methods | [Credit card / ACH / Wire / Crypto / Other] |
| Free Trial | [Yes — N days / No] |
| Refund Policy | [Within N days, full refund / Pro-rated / No refunds] |

---

## 5. Pricing Tiers

### 5.1 Tier Overview

| Tier | Price | Target User | Primary Value | Conversion Goal |
|---|---|---|---|---|
| Free | $0 | [Persona] trying the product | [Limited experience to validate fit] | [X]% activate to paid |
| [Tier 1] | $[X]/[period] | [Persona] | [Primary value] | [X]% retain monthly |
| [Tier 2] | $[X]/[period] | [Persona] | [Higher value] | [X]% annual conversion |
| [Tier 3] | $[X]/[period] | [Persona] | [Full value] | [X]% net retention |
| Enterprise | Custom | [Persona] | [Custom value] | [Sales-led] |

### 5.2 Tier 1: [Name]

**Price:** $[X]/[month|year]

**Includes:**
- [Feature 1 — unlimited / X per month]
- [Feature 2 — X per month]
- [Feature 3 — included]
- [Support level — e.g., "Email support, 48-hour response"]
- [Storage — X GB]

**Excludes (paywall):**
- [Feature 4 — requires Tier 2]
- [Feature 5 — requires Tier 2]
- [Feature 6 — requires Tier 3]

**Limits:**
- [Limit 1 — e.g., "Up to X projects"]
- [Limit 2 — e.g., "Up to X team members"]

**Positioning:** [One-sentence positioning vs. alternatives]

### 5.3 Tier 2: [Name]

*(Same structure as Tier 1, with expanded limits and features)*

### 5.4 Tier 3: [Name]

*(Same structure as Tier 1, with full features)*

### 5.5 Enterprise

**Engagement model:** Sales-led. Direct outreach to named accounts.
**Custom elements:** [Volume discounts, custom integrations, dedicated support, custom contracts, security review]
**Pricing basis:** Per-seat, per-usage, or flat-fee depending on customer requirements.

---

## 6. Entitlement Matrix

The canonical matrix of what each plan includes. Every cell must be filled.

| Entitlement | Free | Tier 1 | Tier 2 | Tier 3 | Enterprise |
|---|---|---|---|---|---|
| [Feature/capability] | [Y/N/limit] | [Y/N/limit] | [Y/N/limit] | [Y/N/limit] | [Y/N/limit] |
| [Feature/capability] | [Y/N/limit] | [Y/N/limit] | [Y/N/limit] | [Y/N/limit] | [Y/N/limit] |
| [Storage] | [X GB] | [X GB] | [X GB] | [X GB] | [Unlimited] |
| [Team size] | [1] | [Up to X] | [Up to X] | [Unlimited] | [Unlimited] |
| [Support] | [Community] | [Email] | [Email + chat] | [Priority] | [Dedicated] |
| [SLA] | [None] | [Best effort] | [99.5%] | [99.9%] | [99.95%] |
| [SSO] | N | N | N | Y | Y |
| [Audit logs] | N | N | N | Y | Y |
| [Custom integrations] | N | N | N | N | Y |

---

## 7. Usage-Based Dimensions

If the product has any usage-based billing, define each dimension.

### 7.1 [Usage Dimension 1]

| Field | Value |
|---|---|
| Unit of measurement | [e.g., "API call", "GB processed", "Transaction"] |
| Included in tier | [X] per [period] |
| Overage rate | $[X] per [unit] |
| Hard cap | [Yes — at X / No — overage only] |
| Notification at | [80% / 100% of included] |
| Reporting cadence | [Real-time dashboard / Daily email] |

### 7.2 [Usage Dimension 2]

*(Same structure)*

---

## 8. Trial & Promotional Pricing

### 8.1 Free Trial

| Field | Value |
|---|---|
| Trial duration | [N days] |
| Credit card required | [Yes / No] |
| Auto-conversion to paid | [Yes — at end of trial / No — requires explicit action] |
| Features available | [Same as Tier X / Limited subset] |
| Email sequence | [T-N, T-3, T-1, T+1, T+3, T+7] |
| Cancellation | [Self-serve at any time, no charge] |

### 8.2 Promotional Codes

| Code Type | Discount | Duration | Eligibility | Tracking |
|---|---|---|---|---|
| Launch promo | [X]% off first [N] months | [Period] | [All / New / Specific cohort] | [Code + UTM] |
| Annual discount | [X]% off | Annual | [All] | [Plan selector] |
| Partner code | [X]% off or $[X] credit | [Period] | [Referral partner] | [Code + partner ID] |
| Student/non-profit | [X]% off | Indefinite | [Verified status] | [SheerID / manual approval] |

### 8.3 Pricing Change Policy

When prices change for existing customers:

| Customer Cohort | Policy | Notice Period |
|---|---|---|
| Existing monthly | Honored at current price for [N] months | [N] days email notice |
| Existing annual | Honored through current term | Email notice at renewal |
| New customers | New pricing applies | Immediate |
| Grace period | [N] days to cancel without penalty after price change | — |

---

## 9. Billing Operations

### 9.1 Payment Provider

| Field | Value |
|---|---|
| Provider | [Stripe / Paddle / Chargebee / Recurly / Other] |
| Account model | [Direct merchant of record / Marketplace] |
| Tax handling | [Stripe Tax / TaxJar / Self-managed] |
| Fraud prevention | [Stripe Radar / 3DS / Manual review] |
| Refund processing | [Self-serve via dashboard / Support request only] |
| Dunning | [Stripe Smart Retries + email sequence] |

### 9.2 Invoice & Receipt

| Field | Value |
|---|---|
| Invoice format | [PDF via email / Hosted URL / Both] |
| Customization | [Company logo, address, tax ID] |
| Receipts | [Automatic on payment success] |
| Customer portal | [Stripe Customer Portal / Custom portal] |
| VAT/tax display | [On invoice and portal] |

### 9.3 Failed Payment Recovery

| Event | Action | Communication |
|---|---|---|
| Card declined (insufficient funds) | Retry in [N] days | Email + portal notification |
| Card declined (expired) | Request new card immediately | Email + portal prompt |
| Card declined (fraud suspected) | Block account; require support contact | Email + security notice |
| 4 failed retries | Suspend account; preserve data | Email + final notice |
| 30 days past due | Cancel subscription; data retention begins | Email + cancellation notice |

---

## 10. Revenue Recognition

| Event | Recognition | Notes |
|---|---|---|
| Monthly subscription payment | Recognized ratably over the month | Standard SaaS |
| Annual subscription payment | Recognized ratably over 12 months | Standard SaaS |
| One-time payment | Recognized at point of sale | — |
| Usage overage | Recognized when usage is reported | Avoid estimates; report actual |
| Refund | Reversed in the period the refund is issued | — |

---

## 11. Data Exports

Users must be able to export their data at any time, in standard formats.

| Data Type | Format | Delivery |
|---|---|---|
| Account profile | JSON | Download from portal |
| [User content] | [CSV / JSON] | Download from portal |
| [Billing history] | CSV | Download from portal |
| All data | ZIP (JSON + CSV) | Email link (signed URL) |

---

## 12. Cancellation & Refund Policy

### 12.1 Self-Serve Cancellation

| Step | Behavior |
|---|---|
| User clicks "Cancel" in portal | Show clear summary of what is lost |
| User confirms cancellation | Schedule for end of current billing period |
| Cancellation confirmation email | Sent immediately with end date |
| Account state after period ends | [Read-only / Suspended / Deleted at day N] |
| Re-activation | Allowed within [N] days without data loss |

### 12.2 Refund Eligibility

| Situation | Refund | Process |
|---|---|---|
| Within trial period | Full refund | Automatic on cancellation |
| Within refund window ([N] days of initial purchase) | Full refund | Support request |
| After refund window | No refund for partial periods | — |
| Service outage > [N] hours | Pro-rated credit | Automatic |
| Billing error (e.g., double charge) | Full refund of erroneous charge | Support request |
| Cancellation during outage | Pro-rated refund for unused period | Support request |

### 12.3 No Dark Patterns

Cancellation flow must not include:
- Confusing language designed to mislead
- Multiple "are you sure" steps without value
- Hidden opt-outs (e.g., pre-checked boxes for retention offers)
- Required phone calls or live chat to cancel
- Required exit surveys as a barrier
- "Pause" presented as the only option when the user wants to cancel

The cancellation flow must be tested by an outside reviewer for dark patterns before launch.

---

## 13. Customer Lifetime Economics

These targets guide monetization decisions. If actual metrics fall below these, pricing or packaging must be re-evaluated.

| Metric | Target | Source |
|---|---|---|
| Customer Acquisition Cost (CAC) | $[X] | Marketing analytics |
| Lifetime Value (LTV) | $[X] | Billing analytics |
| LTV:CAC ratio | ≥ 3:1 | Calculated |
| Payback period | < [N] months | Calculated |
| Gross margin | ≥ [X]% | Finance |
| Net Revenue Retention | ≥ [X]% | Billing analytics |
| Monthly churn | < [X]% | Billing analytics |
| Annual plan mix | ≥ [X]% | Billing analytics |

---

## 14. Acceptance Criteria

- [ ] Pricing is transparent — every charge visible before commitment
- [ ] Entitlement matrix is complete — no `TBD` cells
- [ ] Usage-based dimensions have explicit overage rates and notifications
- [ ] Free trial terms are clear; no dark patterns in conversion
- [ ] Pricing change policy specifies notice period for existing customers
- [ ] Refund policy specifies time windows and eligibility clearly
- [ ] Data export is available in standard formats at any time
- [ ] Cancellation is self-serve, clear, and free of dark patterns
- [ ] Customer lifetime economics targets are set
- [ ] No pricing claim conflicts with the Content & Copy PRD
- [ ] All pricing copy references a Content PRD key

---

**END OF MONETIZATION PRD**
