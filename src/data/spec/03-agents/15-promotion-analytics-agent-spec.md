# AppArchitect – Promotion Analytics Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Tracks and reports on all marketing/promotion performance
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Promotion Analytics Agent |
| **Role** | Owns measurement of all marketing efforts — acquisition, activation, conversion, retention |
| **Type** | Analytics |
| **Operates On** | PostHog, Stripe, Resend, social APIs, internal database |
| **Triggered By** | Scheduled (daily) + on-event (campaign milestone) |
| **Blocking?** | No (but blocks campaign close-out until report filed) |

## 2. Mission Statement

The Promotion Analytics Agent is the single source of truth for marketing performance. It consolidates data from every channel and the product itself into a coherent narrative: which campaigns are working, which aren't, why, and what to do next. It does not run campaigns (Launch Marketing Agent) or create content (Social Media Agent) — it measures and reports.

## 3. Scope

### 3.1 In Scope
- Tracking waitlist signups and conversion
- Tracking social media engagement and growth
- Tracking email campaign performance
- Tracking referral program performance
- Tracking free → paid conversion
- Tracking churn and retention cohorts
- Generating weekly and monthly performance reports
- Computing CAC, LTV, and other key growth metrics
- Building and maintaining a marketing dashboard in PostHog

### 3.2 Out of Scope
- Running campaigns (Launch Marketing Agent)
- Creating content (Social Media Agent)
- Making pricing decisions (Product Owner)
- Modifying product analytics events (delegated to DevOps Agent via spec)
- A/B testing implementation (delegated to Frontend/Backend Agent)
- Customer support

## 4. Inputs

### 4.1 Input Summary

| Input | Source | Format | Required |
|---|---|---|---|
| Campaign spec | Launch Marketing Agent | JSON | Per campaign |
| Social post engagement | Social Media Agent | JSON | Daily |
| Email send events | Resend webhooks | JSON | Real-time |
| Stripe events | Stripe webhooks | JSON | Real-time |
| Product analytics events | PostHog | JSON | Real-time |
| Waitlist signups | Database | JSON | Real-time |
| Referral events | Backend Agent | JSON | Real-time |

## 5. Outputs

### 5.1 Output Summary

| Output | Destination | Format | Always Produced |
|---|---|---|---|
| Daily marketing snapshot | Orchestrator | JSON | Daily |
| Weekly performance report | Product Owner | Markdown | Weekly |
| Monthly business review | Product Owner | Markdown | Monthly |
| Channel attribution | PostHog dashboard | Live | Continuous |
| Campaign retrospective | Changelog & Decision Log | Markdown | Per campaign end |
| Funnel breakdown | PostHog dashboard | Live | Continuous |

### 5.2 Output Schemas

**MarketingSnapshot**
```typescript
type MarketingSnapshot = {
  date: string;            // YYYY-MM-DD
  period: 'daily' | 'weekly' | 'monthly';

  // Acquisition
  waitlistSignups: number;
  waitlistSignupsByChannel: Record<string, number>;
  newSignups: number;
  newSignupsByChannel: Record<string, number>;

  // Activation
  firstGeneration: number;
  activationRate: number;  // % of signups who generated

  // Conversion
  freeToPro: number;
  freeToTeam: number;
  conversionRate: number;  // % of signups to paid

  // Revenue
  newMRR: number;
  churnedMRR: number;
  netNewMRR: number;
  totalARR: number;

  // Engagement
  dau: number;             // Daily active users
  wau: number;             // Weekly active users
  mau: number;             // Monthly active users
  avgGenerationsPerUser: number;

  // Referral
  referralSignups: number;
  viralCoefficient: number;  // K-factor

  // Email
  emailsSent: number;
  emailOpenRate: number;
  emailClickRate: number;
  emailUnsubscribes: number;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Data Collection (Daily 8 AM)**
- Pull from PostHog: events from last 24h
- Pull from Stripe: new subscriptions, churns, MRR
- Pull from Resend: email events
- Pull from social APIs: engagement data
- Pull from database: waitlist + signup counts

**Step 2: Compute Metrics (Daily 8:30 AM)**
- Compute funnel: visitor → signup → activation → paid
- Compute cohort retention: weekly cohorts over 8 weeks
- Compute LTV by channel: 30/60/90 day cohort value
- Compute CAC by channel: spend / new signups
- Compute LTV/CAC ratio per channel

**Step 3: Anomaly Detection (Daily 9 AM)**
- Flag any metric that moved >30% from 7-day average
- Flag any channel where conversion dropped >20%
- Flag any cohort where 7-day retention dropped >10%
- Alert Orchestrator + Product Owner on critical anomalies

**Step 4: Reporting**
- Daily: snapshot to Orchestrator
- Weekly (Monday 10 AM): full report to Product Owner
- Monthly (1st of month): business review with previous month + YTD + forecast

**Step 5: Insights**
- Identify top 3 performing channels
- Identify bottom 3 performing channels
- Recommend reallocation of budget / effort
- Identify best-converting user personas
- Identify features correlated with retention

### 6.2 Decision Logic

**Decision: Flag a metric anomaly**

```
IF metric value moved >30% from 7-day rolling average
   OR conversion rate dropped >20% WoW
   OR 7-day retention dropped >10% in any cohort
THEN alert Orchestrator + Product Owner
ELSE log normally
```

**Decision: Recommend budget reallocation**

```
IF channel A has CAC 2x higher than channel B AND
   LTV is equal across both
THEN recommend shifting 50% of channel A budget to channel B
```

### 6.3 Iteration Behavior
- Runs daily, weekly, monthly
- Stops only on explicit human directive

## 7. Edge Cases & Failure Modes

| Scenario | Expected Behavior |
|---|---|
| PostHog down | Fall back to direct database queries for last 24h events |
| Stripe webhook delay | Use Stripe API directly to pull current state |
| Data inconsistency (e.g., negative signups) | Flag in report, do not auto-correct |
| Tracking event missing | Document gap, request DevOps to add event |
| Privacy request (GDPR delete) | Mark user as deleted in analytics, exclude from cohorts |

## 8. Dependencies

### 8.1 Base PRD Dependencies
- **Core Systems PRD** §3 — user personas
- **Monetization & Pricing PRD** §3, §4 — tier definitions
- **Error & State Reference** §4 — error codes

### 8.2 Agent Dependencies
- **Receives data from:** Launch Marketing Agent (campaign events), Social Media Agent (engagement), Backend Agent (signup events), Stripe webhooks, Resend webhooks, PostHog
- **Reports to:** Orchestrator Agent + Product Owner
- **Provides data to:** Product Owner decisions

### 8.3 External Services
- PostHog (product analytics)
- Stripe (revenue)
- Resend (email)
- Twitter/LinkedIn/Reddit APIs (engagement)
- Internal database (waitlist, signups, generations)

## 9. Error Code Registry

| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `DATA_SOURCE_UNAVAILABLE` | PostHog / Stripe / Resend down | High | Fall back to direct queries, retry with backoff |
| `ANOMALY_DETECTED` | Metric moved beyond threshold | Medium | Alert, document, investigate |
| `INSUFFICIENT_DATA` | Not enough events to compute a metric | Low | Report N/A for that period |
| `TRACKING_GAP` | Expected event not firing | High | Document gap, request fix from DevOps |
| `PRIVACY_REQUEST_PENDING` | GDPR delete pending | Medium | Exclude user, complete purge within 30 days |

## 10. Logging & Observability

### 10.1 What This Agent Must Log
- All data pulls (source, time, count, errors)
- All metric computations (formula, input, output)
- All anomaly alerts
- All report generations
- All recommendations made

### 10.2 What This Agent Must Never Log
- Full user PII (use anonymized IDs)
- Full email contents
- Full API response bodies
- API keys or tokens

## 11. Core Metrics Tracked

### Acquisition
- Visitors (unique)
- Signups (total + by channel)
- Signup → first action (activation)
- Channel-level CAC

### Engagement
- DAU / WAU / MAU
- Generations per user
- Days to first generation
- Days to paid

### Conversion
- Free → Pro conversion rate
- Pro → Team conversion rate
- Trial → paid conversion rate
- Time to paid

### Revenue
- MRR / ARR
- ARPU (average revenue per user)
- LTV (cohort-based, 90-day)
- LTV/CAC ratio
- Churn rate (monthly)
- Net revenue retention

### Viral
- K-factor (referrals per user)
- % of signups from referrals
- Top referrers

## 12. Acceptance Criteria

- [ ] All metrics computed and reported daily
- [ ] All anomalies flagged and alerted within 1 hour
- [ ] All weekly reports generated by Monday 10 AM
- [ ] All monthly business reviews generated by 1st of month
- [ ] LTV/CAC reported by channel
- [ ] Cohort retention tracked for 8+ weeks
- [ ] All privacy requests honored (GDPR/CCPA)
- [ ] All report data traceable back to source events
- [ ] No invented metrics (mark N/A when data insufficient)
- [ ] No PII in reports

## 13. Test Cases

- 13.1 Happy: all metrics computed, reports generated on schedule.
- 13.2 Error: PostHog down → fall back to DB queries, retry, log.
- 13.3 Edge: anomaly detected → alert sent within 1 hour, recommendation made.

---

**END OF PROMOTION ANALYTICS AGENT PRD**
