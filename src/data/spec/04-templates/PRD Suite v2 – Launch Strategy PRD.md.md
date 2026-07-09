# [Product Name] – Launch Strategy PRD

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** [Product Name] – Master PRD Index
**Precedence:** 4th (governs go-to-market execution; does not override product behavior)

---

## ⚠️ Precedence Compliance Block

Launch strategy operates in the market, not in the codebase. This document defines *when, where, and how* the product reaches users. It does not change what the product does — that is governed by Core Systems, Experience, and Technical PRDs.

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Project Brief | Pricing model and target audience | Launch channel and messaging must serve the documented audience |
| Safety, Privacy & Control PRD | Public claims must be accurate | All marketing copy must be reviewed for safety/privacy claims |
| Monetization PRD | Pricing and packaging | Launch promotions must not violate pricing structure |
| Content & Copy PRD | Canonical copy | Marketing copy must derive from Content PRD registry |

---

## 1. Purpose of This Document

This document defines the product's go-to-market strategy: launch phases, target segments, channel strategy, positioning, messaging, and success criteria. It is the contract between product, marketing, and growth.

This document does not define *what* the product does. It defines *how* the product reaches the people who need it.

---

## 2. RLM Compliance

| Field | Value |
|---|---|
| Information Density | O(P×C) — P phases × C channels per phase |
| Density Explanation | Multiple phases, each with multiple channels; channels interact; timing dependencies across phases |
| Decomposition Required | Yes — process one phase at a time |
| Decomposition Strategy | Step 0: enumerate phases. Step 1: for each phase, define goals and channels. Step 2: verify channel × phase dependencies. Step 3: build launch calendar. |

---

## 3. Launch Principles

| # | Principle | What It Means |
|---|---|---|
| 1 | Build in public, ship quietly | Share progress publicly; reserve launch announcement for the moment the product is genuinely ready |
| 2 | Quality over virality | A small number of delighted users beats a large number of disappointed ones |
| 3 | Each phase has explicit exit criteria | No phase ends until its success metrics are met; no phase begins until prior phase exits cleanly |
| 4 | Channels match audience | Where the audience already is, not where we want them to be |
| 5 | The product is the marketing | The fastest growth comes from a product that markets itself through word of mouth |

---

## 4. Launch Phases

| # | Phase | Goal | Duration | Exit Criteria |
|---|---|---|---|---|
| 1 | Closed Alpha | Validate core product with hand-picked users | [X weeks] | [N] of [N] users complete primary flow without help |
| 2 | Open Beta | Stress-test with broader audience | [X weeks] | NPS ≥ [score]; crash-free rate ≥ [X]% |
| 3 | Public Launch | Announce and drive acquisition | [X weeks] | [Acquisition goal] achieved; CAC within target |
| 4 | Post-Launch | Optimize, retain, expand | Ongoing | Retention rate within target range |

---

## 5. Phase 1: Closed Alpha

### 5.1 Goals
- Validate the core product hypothesis: users with [problem] find [solution] valuable enough to keep using
- Identify the 3-5 most critical usability issues
- Build a small group of advocates who will support the public launch

### 5.2 Audience
[N] hand-picked users who match the primary persona. Reached via [channels — e.g., personal network, niche communities, prior users].

**Exclusion criteria:** No press. No investors. No public visibility.

### 5.3 Activities
- [Activity 1 — e.g., "1:1 onboarding sessions with each user"]
- [Activity 2 — e.g., "Weekly feedback survey"]
- [Activity 3 — e.g., "Office hours for user questions"]

### 5.4 Success Metrics
| Metric | Target | Measurement |
|---|---|---|
| Activation rate | [X]% of users complete primary flow | Event analytics |
| Retention at 7 days | [X]% | Event analytics |
| NPS | ≥ [score] | Survey |
| Critical bugs found | < [N] | Bug tracker |

### 5.5 Exit Criteria
- [ ] All success metrics met
- [ ] Top 3 usability issues fixed
- [ ] [N] users willing to provide a public testimonial

---

## 6. Phase 2: Open Beta

### 6.1 Goals
- Broaden user base to validate product-market fit at scale
- Stress-test infrastructure under realistic load
- Begin building public reputation

### 6.2 Audience
Open to all users who match the primary persona. Reached via [channels — e.g., waitlist, community, content marketing].

### 6.3 Activities
- [Activity 1 — e.g., "Open waitlist to public"]
- [Activity 2 — e.g., "Publish weekly product updates"]
- [Activity 3 — e.g., "Engage with community questions daily"]

### 6.4 Success Metrics
| Metric | Target | Measurement |
|---|---|---|
| Signups | [N] | Auth system |
| Activation rate | [X]% | Event analytics |
| Day-7 retention | [X]% | Event analytics |
| Crash-free sessions | ≥ [X]% | Monitoring |
| Support response time | < [X] hours | Support system |

### 6.5 Exit Criteria
- [ ] All success metrics met
- [ ] Public launch assets prepared (landing page, demo video, press kit)
- [ ] Customer support infrastructure ready for higher volume
- [ ] Pricing confirmed (per Monetization PRD)

---

## 7. Phase 3: Public Launch

### 7.1 Goals
- Drive [N] signups in [duration]
- Generate press coverage in [target outlets]
- Achieve [target CAC] for paid channels

### 7.2 Audience
Full target market. Reached via all configured channels.

### 7.3 Launch Channels

| Channel | Owner | Asset Required | Success Metric |
|---|---|---|---|
| Product Hunt launch | [Name] | [Tagline, screenshots, demo video] | Top 5 of the day |
| Hacker News (Show HN) | [Name] | [Post draft, demo link] | [Score target] |
| Twitter/X announcement | [Name] | [Thread, visuals] | [Engagement target] |
| [Outlet 1] press | [Name] | [Pitch, assets] | [Coverage] |
| [Niche community 1] | [Name] | [Post, demo] | [Engagement] |
| Email to waitlist | [Name] | [Launch email per Content PRD] | [Open rate, click rate] |

### 7.4 Launch Day Timeline

| Time (UTC) | Activity | Owner |
|---|---|---|
| [T-24h] | Final review of all assets | [Name] |
| [T-0] | Waitlist email sent | [Name] |
| [T+0] | Product Hunt live | [Name] |
| [T+0] | Show HN post | [Name] |
| [T+0] | Twitter thread | [Name] |
| [T+2h] | Founder responds to top HN comments | [Name] |
| [T+6h] | Mid-day metrics check | [Name] |
| [T+12h] | End-of-day review | [Name] |

### 7.5 Success Metrics
| Metric | Target |
|---|---|
| Day-1 signups | [N] |
| Day-7 signups | [N] |
| Coverage in target outlets | [N] of [M] |
| Activation rate (Day 1) | [X]% |
| Day-7 retention (cohort) | [X]% |

### 7.6 Rollback Plan
If any of these triggers fire, the launch is rolled back to extended beta:
- [Trigger 1 — e.g., "Crash rate > X%"]
- [Trigger 2 — e.g., "Public bug disclosed in top-tier outlet"]
- [Trigger 3 — e.g., "Critical security incident"]

Rollback owner: [Name]. Decision authority: [Name].

---

## 8. Phase 4: Post-Launch

### 8.1 Goals
- Stabilize retention and engagement
- Build a sustainable growth engine
- Identify expansion opportunities

### 8.2 Ongoing Activities
- Weekly metrics review
- Bi-weekly user research sessions
- Monthly feature releases
- Quarterly strategy review

### 8.3 Success Metrics
| Metric | Target | Frequency |
|---|---|---|
| Monthly active users | [N] | Monthly |
| Day-30 retention | [X]% | Monthly |
| Net revenue retention | [X]% | Monthly |
| NPS | ≥ [score] | Monthly |
| LTV:CAC ratio | ≥ [X]:1 | Quarterly |

---

## 9. Positioning

### 9.1 Positioning Statement
For [target persona] who [needs/wants X], [Product Name] is the [category] that [key benefit] because [reason to believe]. Unlike [alternative], our product [key differentiator].

### 9.2 Key Differentiators
1. [Differentiator 1 — what only this product does]
2. [Differentiator 2 — what this product does better than alternatives]
3. [Differentiator 3 — what this product does that alternatives don't]

### 9.3 Anti-Positioning
What we are not:
- [Not X — e.g., "Not an enterprise platform — small and medium teams only"]
- [Not Y — e.g., "Not a free product — paid from day one"]
- [Not Z — e.g., "Not for casual users — requires commitment to use well"]

---

## 10. Messaging

### 10.1 Primary Message
[One sentence — the single most important thing for the audience to know]

### 10.2 Supporting Messages
1. [Supporting message 1]
2. [Supporting message 2]
3. [Supporting message 3]

### 10.3 Messaging by Persona

| Persona | Primary Message | Supporting Message |
|---|---|---|
| [Persona 1] | [Message tailored to their pain] | [Proof point relevant to them] |
| [Persona 2] | [Message tailored to their pain] | [Proof point relevant to them] |

---

## 11. Channel Strategy

### 11.1 Owned Channels
- [Channel 1 — e.g., "Company blog"]
- [Channel 2 — e.g., "Email list"]
- [Channel 3 — e.g., "Product changelog"]

### 11.2 Earned Channels
- [Channel 1 — e.g., "Press coverage"]
- [Channel 2 — e.g., "Community word-of-mouth"]
- [Channel 3 — e.g., "User testimonials"]

### 11.3 Paid Channels
- [Channel 1 — e.g., "Google Ads"]
- [Channel 2 — e.g., "Sponsored content"]
- [Channel 3 — e.g., "Influencer partnerships"]

### 11.4 Channel × Phase Matrix

| Channel | Alpha | Beta | Launch | Post-Launch |
|---|---|---|---|---|
| Blog | — | [Cadence] | [Cadence] | [Cadence] |
| Email | [Weekly update] | [Bi-weekly] | [Launch email] | [Newsletter] |
| Social | [Behind-the-scenes] | [Product updates] | [Launch announcement] | [Ongoing] |
| Paid | — | — | [Active] | [Ongoing] |
| Press | — | [Pitch prep] | [Active] | [As needed] |

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low activation rate | Medium | High | Improve onboarding; user research |
| Negative press | Low | High | Pre-launch comms; fast response protocol |
| Competitor launches similar | Medium | Medium | Differentiation emphasis; faster iteration |
| Capacity issues at launch | Medium | High | Load testing; staged rollout; on-call team |
| Privacy concern surfaces | Low | High | Safety PRD compliance; clear public privacy policy |

---

## 13. Launch Readiness Checklist

- [ ] All product requirements at M-tier or higher are complete
- [ ] Onboarding flow tested with ≥ 5 users from primary persona
- [ ] Support system operational
- [ ] Monitoring and alerting configured
- [ ] Rollback plan tested
- [ ] Press kit prepared
- [ ] Launch calendar confirmed with all owners
- [ ] Legal review of public claims complete
- [ ] Pricing page live and tested
- [ ] Customer success materials ready
- [ ] Internal team briefed on launch plan

---

## 14. Acceptance Criteria

- [ ] Each phase has explicit, measurable exit criteria
- [ ] Each channel has a defined owner and success metric
- [ ] Launch day timeline is hour-by-hour with named owners
- [ ] Rollback plan specifies triggers, owner, and authority
- [ ] Positioning and messaging reference brief and personas
- [ ] Channel × phase matrix is complete
- [ ] Launch readiness checklist is at 100% before public launch
- [ ] No marketing claim conflicts with the Safety, Privacy & Control PRD

---

**END OF LAUNCH STRATEGY PRD**
