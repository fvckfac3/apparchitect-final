# Launch Plan Template

**Layer:** Templates / Workflows / Launch
**Owner:** Orchestrator Agent + Marketing
**Source Workflow:** `06 - workflows/launch.md`
**Version:** 1.0

## Purpose

Define the complete pre-launch, launch-day, and post-launch tactical plan including positioning, channels, timeline, messaging, and coordination across teams. The Launch Plan transforms the Launch Checklist into a coordinated, time-bound campaign.

## When to Use

- 60-90 days before planned launch
- Updated weekly during pre-launch
- Finalized 7 days before launch
- Executed on launch day and the 30 days following

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| plan_id | text (e.g. LAUNCH-PLAN-001) | yes |
| product_name | text | yes |
| launch_owner | text | yes |
| launch_date | date | yes |
| plan_version | text | yes |
| last_updated | date | yes |

### Positioning & Messaging

#### Core Positioning

| Field | Type | Required |
|-------|------|----------|
| one_line_positioning | text | yes |
| target_audience | text | yes |
| core_problem_solved | text | yes |
| key_differentiator | text | yes |
| primary_value_proposition | textarea | yes |

#### Messaging Hierarchy

1. **Headline (5-10 words)**
2. **Subheadline (15-25 words)**
3. **Body message (50-100 words)**
4. **Proof points (3-5 bullets)**
5. **Call to action**

#### Messaging by Persona

| Persona | Pain Point | Value Prop | Objection | Counter |
|---------|------------|------------|-----------|---------|
| Persona 1 | | | | |
| Persona 2 | | | | |
| Persona 3 | | | | |

### Launch Strategy

| Field | Type | Required |
|-------|------|----------|
| launch_type | enum (big-bang, rolling, invite-only, free-beta → paid, silent) | yes |
| launch_goals | list (3-5 specific goals) | yes |
| success_metrics | list | yes |
| failure_criteria | list (what would make this launch a failure) | yes |
| rollback_triggers | list | yes |

### Channel Strategy

#### Owned Channels

| Channel | Audience Size | Launch Asset | Owner | Date |
|---------|---------------|--------------|-------|------|
| Email list | | | | |
| Blog | | | | |
| Product site | | | | |
| App store listing | | | | |
| In-app message | | | | |

#### Earned Channels

| Channel | Target | Approach | Owner | Date |
|---------|--------|----------|-------|------|
| Press/媒体 | | | | |
| Product Hunt | | | | |
| Hacker News | | | | |
| Reddit | | | | |
| Twitter/X | | | | |
| LinkedIn | | | | |
| Podcasts | | | | |
| Newsletters | | | | |

#### Paid Channels

| Channel | Budget | Target | KPI | Owner | Date |
|---------|--------|--------|-----|-------|------|
| Google Ads | | | | | |
| Meta Ads | | | | | |
| LinkedIn Ads | | | | | |
| Twitter/X Ads | | | | | |
| Influencer | | | | | |
| Sponsorships | | | | | |

### Timeline

#### T-90 Days

- [ ] Define positioning and messaging
- [ ] Set launch goals and metrics
- [ ] Identify target outlets and contacts
- [ ] Begin building email list
- [ ] Create launch assets (screenshots, demo video)
- [ ] Brief internal teams

#### T-60 Days

- [ ] Lock launch date
- [ ] Draft all launch content (emails, blog posts, social)
- [ ] Reach out to press/podcast contacts
- [ ] Submit Product Hunt page
- [ ] Set up analytics tracking
- [ ] Test all launch flows

#### T-30 Days

- [ ] Schedule all launch emails
- [ ] Schedule all social posts
- [ ] Brief support team
- [ ] Finalize pricing and billing
- [ ] Run pre-launch checklist (full)
- [ ] Recruit launch advocates

#### T-7 Days

- [ ] Final review of all assets
- [ ] Test all systems end-to-end
- [ ] Confirm on-call rotation
- [ ] Brief all stakeholders
- [ ] Pre-schedule social posts
- [ ] Prepare customer support materials

#### T-1 Day

- [ ] Final go/no-go meeting
- [ ] Verify all systems operational
- [ ] Confirm all team members on standby
- [ ] Pre-load customer support templates
- [ ] Prepare for monitoring

#### Launch Day (T-0)

| Time | Action | Owner |
|------|--------|-------|
| 00:00 | Enable production features | |
| 06:00 | Final system check | |
| 08:00 | Send launch email | |
| 09:00 | Publish blog post | |
| 09:00 | Post on Product Hunt | |
| 09:00 | Post on Twitter/X | |
| 10:00 | Post on LinkedIn | |
| 12:00 | Submit to Hacker News | |
| 14:00 | Send follow-up email to engaged users | |
| 18:00 | First-day metrics review | |
| 22:00 | Final metrics review | |

#### T+1 to T+7 Days

- [ ] Daily metrics review
- [ ] Respond to all press inquiries within 24h
- [ ] Engage actively on social media
- [ ] Triage and fix critical bugs
- [ ] Daily standup with launch team
- [ ] Collect and synthesize user feedback
- [ ] Send thank-you emails to advocates

#### T+7 to T+30 Days

- [ ] Weekly metrics review
- [ ] Analyze launch performance vs goals
- [ ] Iterate on messaging based on feedback
- [ ] Publish launch retrospective
- [ ] Plan next-phase marketing
- [ ] Convert launch advocates to long-term champions

### Launch Assets

#### Required Assets

- [ ] Hero image (1200×630 for OG, 1920×1080 for site)
- [ ] Demo video (60-90s)
- [ ] Product screenshots (5-10)
- [ ] Launch blog post (1500-2500 words)
- [ ] Launch email (3 versions for A/B test)
- [ ] Press release (if applicable)
- [ ] One-pager PDF
- [ ] Social media graphics (per platform)
- [ ] Product Hunt gallery (8 images)
- [ ] FAQ document

#### Asset Tracker

| Asset | Owner | Draft Date | Final Date | Status |
|-------|-------|------------|------------|--------|
| | | | | |

### Press & Influencer Outreach

#### Media Targets

| Outlet | Contact | Pitch Status | Coverage Goal | Follow-up Date |
|--------|---------|--------------|---------------|----------------|
| | | | | |

#### Influencer Targets

| Influencer | Audience | Engagement Strategy | Status | Date |
|------------|----------|---------------------|--------|------|
| | | | | |

### Email Campaign

#### Pre-Launch Sequence

| Email | Day | Audience | Subject | Goal |
|-------|-----|----------|---------|------|
| 1 | T-14 | Waitlist | | |
| 2 | T-7 | Waitlist | | |
| 3 | T-1 | Waitlist | | |

#### Launch Sequence

| Email | Day | Audience | Subject | Goal |
|-------|-----|----------|---------|------|
| 1 | T-0 | All | | |
| 2 | T+3 | Engaged non-converters | | |
| 3 | T+7 | All | | |

### Risk Management

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Server overload on launch | | | | |
| Critical bug discovered at launch | | | | |
| Negative press response | | | | |
| Low sign-up volume | | | | |
| Payment processing failures | | | | |

### Stakeholder Communication

| Stakeholder | What to Tell Them | When | How |
|-------------|-------------------|------|-----|
| Investors | | | |
| Team | | | |
| Existing customers | | | |
| Partners | | | |
| Advisors | | | |

### Success Metrics (30-Day Review)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Sign-ups | | | |
| Activations | | | |
| Paid conversions | | | |
| Revenue | | | |
| Press mentions | | | |
| Social engagement | | | |
| NPS | | | |

## Validation Rules

- Launch date must be realistic (T-90 minimum for full launch)
- All assets must have owners and deadlines
- Risk management must include at least 5 scenarios
- Success metrics must be measurable and time-bound
- Post-launch monitoring must extend at least 30 days

## Cross-References

- **Workflow:** `06 - workflows/launch.md`
- **Launch Checklist:** `04 - templates/workflows/business/launch-checklist.md`
- **Marketing Plan:** `04 - templates/workflows/launch/marketing-plan.md`
- **Post-Launch Review:** `04 - templates/workflows/launch/post-launch-review.md`

---

*A launch is a coordinated campaign, not an announcement. Every asset, every channel, every email needs an owner and a deadline.*