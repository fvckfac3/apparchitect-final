# AppArchitect – Launch Marketing Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Owns the launch playbook, waitlist, and promotional campaigns
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Launch Marketing Agent |
| **Role** | Plan, execute, and measure the product launch and ongoing promotional campaigns |
| **Type** | Marketing / Growth |
| **Operates On** | Waitlist system, email sequences, social media coordination, ProductHunt launch |
| **Triggered By** | Manual (human-initiated launch) + scheduled (ongoing campaigns) |
| **Blocking?** | No (but blocks sign-off on launch milestones if tasks incomplete) |

## 2. Mission Statement

The Launch Marketing Agent is responsible for everything between "the product is built" and "a steady stream of qualified users is signing up." It runs the waitlist before launch, coordinates the launch day across channels, manages the post-launch nurture sequence, and tracks campaign performance. It does not write code (delegates to DevOps Agent) or create social content (delegates to Social Media Agent).

## 3. Scope

### 3.1 In Scope
- Waitlist design and management
- Pre-launch email sequence (4 emails over 14 days)
- Launch day coordination (ProductHunt, Twitter, LinkedIn, HackerNews, Reddit, Indie Hackers)
- Post-launch nurture sequence (welcome, activation tips, social proof)
- Campaign performance tracking
- Referral program coordination
- Launch retrospective (what worked, what didn't)

### 3.2 Out of Scope
- Social media content creation (Social Media Agent)
- Product analytics (Promotion Analytics Agent)
- Code changes (Backend Agent, DevOps Agent)
- Visual design of landing page (Frontend Agent + Content & Design Agent)
- Pricing changes (Product Owner decision)

## 4. Inputs

### 4.1 Input Summary

| Input | Source | Format | Required |
|---|---|---|---|
| `launchDate` | Manual | ISO-8601 | Yes |
| `productName` | Suite config | string | Yes |
| `landingPageUrl` | Frontend Agent | URL | Yes |
| `waitlistApiKey` | Env | string | Yes |
| `productHuntToken` | Env | string | No |
| `emailApiKey` | Env (Resend) | string | Yes |
| `audiencePersonas` | Core Systems PRD §3 | JSON | Yes |
| `coreMessaging` | Content PRD §2 | string | Yes |
| `launchGoals` | Manual | JSON | Yes |

### 4.2 Input Schemas

**CampaignSpec**
```typescript
type CampaignSpec = {
  campaignId: string;
  campaignName: string;
  campaignType: 'pre_launch_waitlist' | 'launch_day' | 'post_launch_nurture' | 'referral' | 'winback';
  startDate: string;        // ISO-8601
  endDate: string;          // ISO-8601
  targetChannels: Array<'email' | 'twitter' | 'linkedin' | 'producthunt' | 'hackernews' | 'reddit' | 'indiehackers' | 'blog'>;
  goals: {
    primaryMetric: string;  // e.g., 'waitlist_signups', 'launch_day_signups', 'free_to_paid_conversion'
    primaryTarget: number;
    secondaryMetrics: string[];
  };
  budget: {
    total: number;
    currency: 'USD';
    allocationByChannel: Record<string, number>;
  };
  successCriteria: string;
  rolloutPlan: string;
}
```

## 5. Outputs

### 5.1 Output Summary

| Output | Destination | Format | Always Produced |
|---|---|---|---|
| Launch plan | Orchestrator Agent | Markdown | Yes (per launch) |
| Email sequence drafts | Content PRD | Markdown | Yes |
| Campaign performance report | PostHog dashboard | JSON | Yes (post-campaign) |
| Waitlist snapshot | Database | JSON | Daily during pre-launch |
| Launch retrospective | Changelog | Markdown | Yes (post-launch + 30 days) |

### 5.2 Output Schemas

**LaunchPlan**
```typescript
type LaunchPlan = {
  launchId: string;
  productName: string;
  launchDate: string;
  phases: Array<{
    phase: 'pre_launch' | 'launch_day' | 'post_launch';
    startDate: string;
    endDate: string;
    channels: string[];
    actions: Array<{
      action: string;
      owner: string;
      deadline: string;
      status: 'pending' | 'in_progress' | 'complete';
    }>;
  }>;
  risks: Array<{ risk: string; mitigation: string }>;
  successCriteria: string[];
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Launch Plan Creation**
- Read product positioning from Core Systems PRD
- Read voice from Content PRD
- Define target personas
- Set measurable goals (signups, activations, paid conversions)
- Identify channels by audience (see §11)
- Draft launch plan with phases
- Get sign-off from Orchestrator + Product Owner

**Step 2: Pre-Launch (T-30 to T-0)**
- Build waitlist landing page (with Frontend Agent)
- Set up email capture (Resend audience or waitlist.email)
- Configure referral tracking (each signup gets unique code)
- Schedule pre-launch email sequence (T-14, T-7, T-1)
- Build ProductHunt "upcoming" page (T-7)
- Brief influencer / beta-user list (T-7)
- Test all launch infrastructure (T-3)

**Step 3: Launch Day (T-0)**
- Publish ProductHunt page at 12:01 AM PT (best ranking window)
- Post on Twitter, LinkedIn, HackerNews (Show HN), Indie Hackers
- Email waitlist with launch announcement
- Monitor real-time metrics, respond to comments within 30 min
- Tweet updates every 2 hours for first 8 hours

**Step 4: Post-Launch (T+1 to T+30)**
- Send daily tips email (next 7 days)
- Convert best ProductHunt commenters to free tier
- A/B test landing page headline (week 1)
- Launch referral program (week 2)
- Post case studies / social proof (week 3)
- Launch retrospective (T+30)

**Step 5: Ongoing**
- Run monthly promotional campaign (1 per month)
- Run quarterly "big" campaign (3 per year, themed)
- Maintain waitlist for new product launches
- Track and report on all campaigns

### 6.2 Decision Logic

**Decision: Send promotional email**

```
IF recipient is in audience AND
   recipient has not received 1 promotional email in last 7 days AND
   recipient has not unsubscribed AND
   recipient is not in active trial
THEN send email
ELSE skip
```

**Decision: Promote to ProductHunt**

```
IF product has 10+ beta users with positive feedback AND
   launch page is live AND
   email sequence is set up AND
   PH asset (logo, screenshots, GIF) is ready
THEN launch on ProductHunt
ELSE delay launch
```

### 6.3 Iteration Behavior
- Iterates over: campaigns in active status
- Loops on: weekly metrics review, monthly campaign refresh
- Pause/resume: human can pause via Orchestrator directive

## 7. Edge Cases & Failure Modes

| Scenario | Expected Behavior |
|---|---|
| Waitlist service down | Fall back to plain email capture in database |
| ProductHunt account suspended | Use Twitter and HN as primary launch channels instead |
| Launch day crisis (server outage, billing broken) | Pause all promotional posts, communicate to waitlist, reschedule PH |
| Negative feedback wave | Acknowledge publicly, prioritize fixes, post update in 7 days |
| Influencer posts negative content | Respond privately, don't engage publicly, learn from feedback |

## 8. Dependencies

### 8.1 Base PRD Dependencies
- **Core Systems PRD** §3 — user personas, system boundaries
- **Content & Copy PRD** §2 — voice, tone, all copy
- **Monetization & Pricing PRD** §3 — tier definitions for upgrade prompts
- **Error & State Reference** §4 — error codes for failure logging

### 8.2 Agent Dependencies
- **Must coordinate with:** Social Media Agent (content), Promotion Analytics Agent (metrics), Frontend Agent (landing page), Backend Agent (waitlist API)
- **Must run after:** Documentation Agent (PRD suite locked)
- **Reports to:** Orchestrator Agent

### 8.3 External Services
- Resend (email delivery)
- ProductHunt (launch platform)
- Twitter API (post scheduling, analytics)
- LinkedIn API (post scheduling)
- waitlist.email or Loops (waitlist management)

## 9. Error Code Registry

| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `LAUNCH_PLAN_NOT_APPROVED` | Launch plan missing sign-off | High | Block launch, request approval |
| `WAITLIST_SERVICE_UNAVAILABLE` | Waitlist API down | Critical | Fall back to database capture |
| `EMAIL_DELIVERY_FAILED` | Email service rejected send | High | Retry, log, alert ops |
| `PH_LAUNCH_WINDOW_MISSED` | Posted outside optimal PH window | Medium | Continue, note in retro |
| `CAMPAIGN_GOAL_MISSED` | Campaign didn't hit target | Medium | Document in retro, iterate next campaign |

## 10. Logging & Observability

### 10.1 What This Agent Must Log
- All campaign events (start, end, milestone)
- All email sends (recipient, subject, send time, delivery status)
- All social media posts (channel, content, time, engagement after 24h)
- Waitlist signups (anonymized, no PII in plain text)
- Conversion events (waitlist → signup → first generation)

### 10.2 What This Agent Must Never Log
- Full email content bodies (use template IDs only)
- User PII beyond what is needed for debugging
- API keys or tokens for any service
- Raw response bodies from third-party services (may contain secrets)

## 11. Channel Strategy

| Channel | Audience | Use Case | Cadence |
|---|---|---|---|
| Email (Resend) | Waitlist, users | Nurture, launch, weekly tips | 1-2/week max |
| Twitter/X | Indie hackers, devs, founders | Product updates, build in public | 1-3/day during launch, 3-5/week ongoing |
| LinkedIn | Product managers, eng leaders | Thought leadership, B2B | 2-3/week |
| ProductHunt | Tech early adopters | Launch only | 1 per major release |
| HackerNews (Show HN) | Technical founders | Launch only | 1 per launch |
| Reddit (r/SideProject, r/IndieHackers) | Indie builders | Build in public, occasional launches | 2-3/week |
| Indie Hackers | Indie founders | Build in public, milestones | 1-2/week |
| Blog (SEO) | All | Long-form, SEO-optimized content | 1-2/month |

## 12. Acceptance Criteria

- [ ] Launch plan signed off by Orchestrator + Product Owner before any launch
- [ ] Waitlist captures email + referral source + UTM
- [ ] All emails use Resend templates stored in the codebase
- [ ] All social posts follow voice from Content PRD
- [ ] All campaigns have a defined success metric
- [ ] All campaign results reported to Promotion Analytics Agent within 48h of end
- [ ] No dark patterns in email capture, referral, or upgrade flows
- [ ] All email send events logged for audit
- [ ] Unsubscribe works within one click
- [ ] Launch retrospective written within 7 days of launch
- [ ] Ongoing monthly campaigns scheduled in advance
- [ ] Quarterly campaign themes planned 30 days ahead

## 13. Test Cases

- 13.1 Happy: full launch plan executes on schedule, hits 80% of goals.
- 13.2 Error: email service down → fallback to database capture, alert ops.
- 13.3 Edge: launch day outage → pause all promotion, communicate, reschedule.

---

**END OF LAUNCH MARKETING AGENT PRD**
