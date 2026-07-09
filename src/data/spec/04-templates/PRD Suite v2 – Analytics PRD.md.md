# [Product Name] – Analytics PRD

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** [Product Name] – Master PRD Index
**Precedence:** 4th (governs what is measured; does not override how systems work)

---

## ⚠️ Precedence Compliance Block

Analytics is what we measure, not what we build. This document does not change product behavior — it documents the measurements. If a measurement requires a product change, that change must be specified in Core Systems PRD first.

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | Privacy is non-negotiable | Every event must be checked against the data classification registry |
| Safety, Privacy & Control PRD | User consent is required for non-essential tracking | Analytics must respect consent state |
| Core Systems PRD | What events the system can emit | Analytics events here must be producible by the canonical systems |
| Requirements Summary | What success looks like | Every success metric in the brief must be measurable via the events defined here |
| UX PRD | What user actions exist | Every user-tracked event must trace to a UX flow step |

---

## 1. Purpose of This Document

This document defines every measurement the product makes — what events are tracked, what properties they have, what dashboards they feed, and what business questions they answer. It is the canonical reference for "what does the data mean."

If a number appears in a report, meeting, or decision and is not defined here, the number is unverified and must be either documented or removed.

---

## 2. RLM Compliance

| Field | Value |
|---|---|
| Information Density | O(E×P) — E events × P properties per event, plus E events × D destinations |
| Density Explanation | Each event has multiple properties; events flow to multiple destinations (warehouse, BI, product analytics) |
| Decomposition Required | Yes if E > 50. Process by category. |
| Decomposition Strategy | Step 0: enumerate event categories. Step 1: for each category, list events. Step 2: for each event, list properties. Step 3: verify event × flow coverage. |

---

## 3. Analytics Principles

These principles govern every measurement decision in this document.

| # | Principle | What It Means |
|---|---|---|
| 1 | Privacy first | No event is tracked if the user has not consented |
| 2 | One event, one meaning | An event name must mean the same thing everywhere it appears |
| 3 | Properties are typed | Every property has a defined type; no free-text fields on critical events |
| 4 | Testable | Every event must have at least one test verifying it fires correctly |
| 5 | Reversible | An event can be removed or changed without breaking the product |
| 6 | Documented | No event is added without being added to this document first |
| 7 | Sampled where possible | High-volume low-value events are sampled; high-value low-volume events are not |

---

## 4. Data Classification Registry

Every piece of data that flows through the product has a classification. The classification determines whether it can be tracked and under what conditions.

| Classification | Definition | Examples | Tracking Allowed? |
|---|---|---|---|
| `PUBLIC` | Safe to log anywhere | Page view, button click, feature used | Yes |
| `INTERNAL` | Safe to log in own systems | User ID, tenant ID, account ID | Yes (pseudonymized) |
| `SENSITIVE` | Requires user consent | Email, phone, name, location | Only with consent |
| `PROHIBITED` | Cannot be tracked | Passwords, payment data, health data, content of private messages | Never |

**Rule:** Every event property must be tagged with its classification. Any property classified `PROHIBITED` triggers immediate rejection of the event.

---

## 5. Consent State Machine

Analytics respects the user's consent. The system must check consent before firing any event containing `SENSITIVE` properties.

| Consent State | Value | Description | Allowed Events |
|---|---|---|---|
| All granted | `CONSENT_ALL` | User has accepted all categories | All events |
| Analytics only | `CONSENT_ANALYTICS` | User accepted analytics, declined marketing | All events except marketing |
| Required only | `CONSENT_REQUIRED` | User accepted only required | Public + internal only, no sensitive |
| Declined | `CONSENT_DECLINED` | User declined all non-required | Public events only, no PII |

**Default state:** `CONSENT_DECLINED` for all new users. Opt-in, not opt-out.

---

## 6. Event Taxonomy

Every event follows the structure:

```
[category]_[object]_[action]

Examples:
  user_signed_up
  user_signed_in
  flow_checkout_completed
  feature_search_performed
  error_occurred
```

**Categories:**
- `user_*` — User account events
- `auth_*` — Authentication events
- `flow_*` — User flow events
- `feature_*` — Feature usage events
- `billing_*` — Subscription and payment events
- `error_*` — Error events
- `perf_*` — Performance events
- `admin_*` — Administrative events

---

## 7. Event Catalog

### 7.1 User Events

#### `user_signed_up`

| Field | Value |
|---|---|
| Trigger | New user account created |
| Source | Core Systems PRD → Auth System |
| Flow traced | UX PRD → §6.1 Signup Flow |
| Properties | See below |
| Volume estimate | [Daily estimate] |
| Sampling | None — always tracked |
| Destinations | Product analytics, data warehouse |

**Properties:**

| Property | Type | Classification | Required | Description |
|---|---|---|---|---|
| `user_id` | string (UUID) | INTERNAL | Yes | Pseudonymous user ID |
| `signup_method` | enum: email, google, apple, other | PUBLIC | Yes | How the user signed up |
| `referrer_source` | enum: organic, paid, referral, direct | PUBLIC | No | Acquisition source |
| `referrer_campaign` | string | PUBLIC | No | Campaign ID, if any |
| `time_to_complete` | number (seconds) | PUBLIC | Yes | Time from form open to submit |
| `device_type` | enum: mobile, tablet, desktop | PUBLIC | Yes | Device class |
| `country` | string (ISO-3166) | SENSITIVE | No | User country (requires consent) |

**Test:** `analytics.test.user_signed_up` verifies event fires with correct properties on signup completion.

#### `user_signed_in`
*(Same structure — properties: user_id, signin_method, device_type, country)*

#### `user_signed_out`
*(Properties: user_id)*

#### `user_deleted_account`
*(Properties: user_id, deletion_reason. CRITICAL: after this event, no further events for this user.)*

---

### 7.2 Flow Events

#### `flow_[flow_id]_started`

| Field | Value |
|---|---|
| Trigger | User enters the first step of the flow |
| Properties | `user_id`, `flow_id`, `entry_point` |
| Volume estimate | [Estimate] |

#### `flow_[flow_id]_step_completed`

| Field | Value |
|---|---|
| Trigger | User completes a step in the flow |
| Properties | `user_id`, `flow_id`, `step_id`, `time_on_step`, `previous_step_id` |

#### `flow_[flow_id]_completed`

| Field | Value |
|---|---|
| Trigger | User reaches the terminal success state |
| Properties | `user_id`, `flow_id`, `total_time`, `step_count`, `abandoned_steps` |

#### `flow_[flow_id]_abandoned`

| Field | Value |
|---|---|
| Trigger | User exits the flow before completion |
| Properties | `user_id`, `flow_id`, `last_step_id`, `time_in_flow`, `abandon_reason` (if known) |

*(Repeat for each flow defined in the UX PRD)*

---

### 7.3 Feature Usage Events

For each feature in the Core Systems PRD, define:

#### `feature_[feature_id]_used`

| Field | Value |
|---|---|
| Trigger | User activates the feature |
| Properties | `user_id`, `feature_id`, `action`, `result` |

*(List each feature with its events)*

---

### 7.4 Billing Events

#### `billing_subscription_started`
#### `billing_subscription_renewed`
#### `billing_subscription_canceled`
#### `billing_payment_succeeded`
#### `billing_payment_failed`
#### `billing_refund_issued`

Each with the same structure: trigger, source (Data & Integration PRD), properties, volume, sampling, destinations, and a test.

---

### 7.5 Error Events

#### `error_occurred`

| Field | Value |
|---|---|
| Trigger | An error condition is hit |
| Properties | `user_id` (or null for unauthenticated), `error_code`, `error_message` (no PII), `error_source` (client/server/api), `flow_id` (if in flow), `screen_id` (if applicable), `error_class` (recoverable/fatal/unexpected) |

**Critical rule:** `error_message` must be scrubbed of PII before sending. Server-side scrubbing required.

---

### 7.6 Performance Events

#### `perf_page_load_completed`
#### `perf_api_response_time`
#### `perf_render_time`

**Properties:** `page_id` / `endpoint` / `component`, `duration_ms`, `device_type`, `connection_type` (if available).

---

## 8. Identity & Stitching

Events from the same user across sessions, devices, and platforms must be stichable to a single user identity.

| Identifier | Type | Used For | Privacy |
|---|---|---|---|
| `user_id` | UUID (pseudonymous) | All authenticated events | INTERNAL |
| `anonymous_id` | UUID (rotates on signup) | Pre-auth events | INTERNAL |
| `device_id` | UUID (rotates on app reinstall) | Device-level events | INTERNAL |
| `session_id` | UUID (rotates on session end) | Session-level events | INTERNAL |

**Stitching rules:**
- `anonymous_id` → `user_id` on signup
- `device_id` + `user_id` identifies "this user on this device"
- `session_id` is per-session; not stitchable across sessions

---

## 9. Destinations

| Destination | Events Sent | Purpose | Retention |
|---|---|---|---|
| Product analytics (e.g., PostHog, Amplitude) | All user/flow/feature events | Product analytics, funnels, cohorts | [Retention period] |
| Data warehouse (e.g., BigQuery, Snowflake) | All events | Long-term analysis, BI | [Retention period] |
| Error tracking (e.g., Sentry) | All error events | Error monitoring and alerting | [Retention period] |
| Performance monitoring | All perf events | Performance tracking and alerting | [Retention period] |
| Marketing automation | Marketing-consented events only | Lifecycle marketing | [Retention period] |

**Sending rules:**
- Events are sent only after consent check passes
- Events are batched where supported
- Failed sends are retried with exponential backoff, then dropped after [N] retries
- PII is never sent to destinations that don't need it

---

## 10. Dashboards & Reports

### 10.1 Real-Time Dashboards

| Dashboard | Audience | Refresh | Key Metrics |
|---|---|---|---|
| [Dashboard 1] | [Role] | Real-time | [Metrics] |
| [Dashboard 2] | [Role] | Real-time | [Metrics] |

### 10.2 Scheduled Reports

| Report | Frequency | Audience | Contents |
|---|---|---|---|
| [Report 1] | Daily | [Role] | [Summary] |
| [Report 2] | Weekly | [Role] | [Summary] |
| [Report 3] | Monthly | [Role] | [Summary] |

### 10.3 Ad-Hoc Analysis

Ad-hoc analysis uses the data warehouse directly. Common questions the schema should answer:

| Question | Required Events | Notes |
|---|---|---|
| [Question 1 — e.g., "What's our D7 retention?"] | [Events] | [Calculation method] |
| [Question 2 — e.g., "Which feature drives upgrades?"] | [Events] | [Calculation method] |
| [Question 3] | [Events] | [Calculation method] |

---

## 11. Metric Definitions

Each metric in the Project Brief Success Metrics section is defined here with calculation method.

| Metric ID | Name | Definition | Calculation | Source Events | Update Frequency |
|---|---|---|---|---|---|
| `M-001` | [Metric name] | [Plain-language definition] | [Formula — e.g., "count(distinct user_id) WHERE event='user_signed_in' AND timestamp >= 7 days ago"] | [Event names] | [Frequency] |
| `M-002` | [Metric name] | [Definition] | [Formula] | [Events] | [Frequency] |
| `M-003` | [Metric name] | [Definition] | [Formula] | [Events] | [Frequency] |

**Metric versioning:** Metric definitions are versioned. Changes to a definition are documented in the Changelog & Decision Log.

---

## 12. Event × Flow × Requirement Traceability

| Event | Flow | Requirement | Persona |
|---|---|---|---|
| `user_signed_up` | Signup | `F-AUTH-001` | [Primary persona] |
| `flow_checkout_completed` | Checkout | `F-BILLING-001` | [Primary persona] |
| `error_occurred` | All | `NF-OBSERV-001` | All |

**Coverage gaps (must be zero before delivery):**
- [ ] Flows with no events → cannot measure completion
- [ ] Requirements with no measurable metric → cannot verify
- [ ] Metrics with no source event → cannot be computed

---

## 13. Verification Sub-Call Requirements

Before this document is marked complete:

1. **Consent verification:** Every event with SENSITIVE properties has a consent-check specified
2. **PII verification:** No event contains PROHIBITED-classified data
3. **Coverage verification:** Every UX flow has at least start, step, complete, and abandon events
4. **Traceability verification:** Every metric traces to at least one source event
5. **Test verification:** Every event has at least one test in the test plan
6. **Retention verification:** All retention periods are documented and comply with privacy policy

---

## 14. Acceptance Criteria

- [ ] Every event has a unique, semantic name following the taxonomy
- [ ] Every event has documented trigger, source, and destinations
- [ ] Every event property has a type and classification
- [ ] No event contains PROHIBITED data
- [ ] Every SENSITIVE property is gated by consent
- [ ] Every UX flow has start/step/complete/abandon events
- [ ] Every success metric in the Project Brief has a metric definition here
- [ ] Every metric traces to at least one event
- [ ] Every event has at least one test in the Test Plan PRD
- [ ] Consent state machine is fully specified
- [ ] All destinations are documented with retention periods
- [ ] PII scrubbing is required for error messages
- [ ] No event is added without being added to this document first

---

**END OF ANALYTICS PRD**
