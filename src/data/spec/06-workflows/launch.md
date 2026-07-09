content = """# Launch Workflow

**Layer:** Workflows
**Tier:** 6 of 6 — Launch
**Owner:** Launch Agent
**Source Authority:** `01 - governance/15-project-lifecycle-model.md`, `01 - governance/06-master-generation-pipeline.md` (Stages 12–14), `05 - operational-standards/12-release-standard.md`

## Purpose

Execute the production launch and manage the post-launch lifecycle: phased rollout, real-time monitoring, incident response, feedback loops, iteration cycles. The Launch workflow is where shipping stops being hypothetical.

## When to Use

Use this workflow when:
- All prior workflows (Discovery → Architecture → Implementation → Product → Business) have completed or reached appropriate gate
- A pre-launch validation has passed (all 8 validators clean or explicitly waived)
- A new version or feature is ready for production rollout
- A rollback or incident response is needed

Do NOT use this workflow when:
- The system is not yet shippable (run Implementation first)
- The request is a rollback of an already-shipped change (use Incident workflow if exists)
- The launch is purely internal (use a lighter release process)

## Inputs

- Validated product (passed Pre-Launch Validation per Implementation workflow Step 10)
- Master PRD, feature specs, launch plan, GTM plan (from Product and Business workflows)
- Deployment credentials, monitoring dashboards, on-call schedule
- Optional: press kit, partner coordination, beta user list

## Process

Step 1: Pre-Launch Validation (Final Check)
- Re-run all 8 validators against the latest production build
- Verify rollback procedure tested in last 7 days
- Verify monitoring dashboards operational and alerts configured
- Verify on-call schedule populated with primary + backup
- Verify customer support trained and runbook reviewed
- Verify status page operational
- Verify communication channels ready (email, social, support, incident)

Step 2: Launch Decision
- Go/No-Go meeting with: Product, Engineering, GTM, Support
- Required attendees sign off in writing
- Decision criteria: All Gates 1–7 passed, no critical findings older than 24 hours, on-call coverage confirmed
- Document decision with timestamp + attendees + open items
- If No-Go: assign owners + ETAs for blockers, re-schedule

Step 3: Phased Rollout (Soft Launch)
- 1% rollout: internal users + 50 hand-picked external users
- Monitor for 48 hours: errors, latency, business KPIs, support tickets
- Rollback triggers: error rate > 1%, p95 latency > 2x baseline, critical user journey broken, support volume > 3x normal
- If triggers fire: rollback immediately, debrief, fix, restart rollout

Step 4: Expanded Rollout (Public Beta)
- 10% → 25% → 50% rollout, gated by feature flag
- Monitor between each step: 24-hour minimum at each stage
- Cohort analysis: are new users activating? converting? retaining?
- If metrics healthy: continue; if degraded: hold or roll back

Step 5: General Availability (GA)
- 100% rollout
- Announce: product blog post, email to waitlist, social, partner coordination
- Press: outreach to pre-coordinated journalists, submit to Product Hunt (if appropriate), industry newsletters
- Partner coordination: co-marketing live, integration announcements

Step 6: Real-Time Monitoring
- Watch: error rate, p50/p95/p99 latency, business KPIs, support volume, social sentiment
- Cadence: hourly for first 24 hours, every 4 hours for first week, daily for first month
- On-call: primary responds within SLA, backup aware
- Customer success: outreach to top 20% of users by value

Step 7: Incident Response
- Severity levels: SEV1 (full outage), SEV2 (degraded for subset), SEV3 (minor, no user impact)
- Response: SEV1 immediate all-hands, SEV2 within 1 hour, SEV3 within 4 hours
- Communication: status page update within 15 minutes of SEV1/SEV2
- Post-incident: write-up within 48 hours, action items assigned, follow-up review at 1 week

Step 8: Feedback Loop
- Daily review of: support tickets, social mentions, app store reviews, NPS
- Weekly review of: activation funnel, retention cohorts, revenue, support themes
- Bi-weekly: customer interviews (3–5 users per cycle)
- Monthly: business review with leadership

Step 9: Iteration Planning
- Roadmap refresh: re-prioritize based on learnings
- Bug triage: P0 (fix immediately), P1 (this sprint), P2 (next sprint), P3 (backlog)
- Feature iteration: A/B test high-impact changes, ship validated wins
- Tech debt: dedicated allocation each sprint (10–20%)

Step 10: Lifecycle Transition
- Project graduates from Launch to Growth (per `01 - governance/15-project-lifecycle-model.md`)
- Handoff to growth agent: full context, dashboards, runbooks
- Knowledge transfer: launch retrospectives, postmortems, success criteria
- Archive: launch artifacts, screenshots, press coverage, metrics snapshots

## Outputs

- `launch_decision_record` — Go/No-Go with sign-offs
- `rollout_log` — phased rollout stages with timestamps + metrics
- `incident_log` — SEV1/2/3 records with postmortems
- `feedback_archive` — customer research, support themes, review summaries
- `iteration_roadmap` — refreshed priorities, bug triage, feature A/B results
- `lifecycle_handoff` — transition to Growth phase

## Validation Gates

Gate 1: Pre-Launch Validation
- Rule: All 8 validators clean or findings explicitly waived with sign-off
- Severity: Critical (blocking)

Gate 2: Rollback Verified
- Rule: Rollback executed successfully in staging within last 7 days
- Severity: Critical (blocking)

Gate 3: Observability Live
- Rule: Dashboards operational, alerts configured, on-call populated
- Severity: Critical (blocking)

Gate 4: Decision Authority
- Rule: Go/No-Go signed by Product, Engineering, GTM, Support leads
- Severity: Critical (blocking)

Gate 5: Phased Rollout Compliance
- Rule: No stage advanced without minimum observation period + healthy metrics
- Severity: Error (blocking)

Gate 6: Incident Response Operational
- Rule: Status page + comms channels tested before launch
- Severity: Critical (blocking)

## Failure Modes

- Big-bang launch: 100% rollout with no phased validation. Remediation: Phased rollout is mandatory; Gate 5 enforces.
- Undefined rollback: "We can roll back if needed" without testing. Remediation: Gate 2 requires tested rollback.
- Vanity metrics focus: Tracking signups, not activation/retention. Remediation: Leading indicators (activation, D1 retention) over lagging (signups, revenue).
- Incident silence: Outage with no communication. Remediation: Status page update within 15 minutes is mandatory.
- Launch and abandon: Ship and move on without iteration. Remediation: Feedback loop + iteration planning are required post-launch.
- Founder dependency: All decisions require founder. Remediation: Decision authority Gate 4 requires multiple sign-offs.

## Worked Example

Launch of the dating app:
- Pre-launch validation: All 8 validators passed, 2 warnings (acceptable, documented)
- Soft launch: 1% rollout (50 users), monitored 72 hours, metrics healthy
- Expanded rollout: 10% (500) → 25% (1,250) → 50% (2,500), each stage held 48+ hours
- GA: 100% rollout, coordinated with AllTrails partnership announcement
- Day 1: 12,000 signups, 4% conversion to paid, 1 SEV2 incident (AllTrails API rate limit) resolved in 90 minutes
- Week 1: 38,000 signups, 6.8% paid conversion, 4 SEV3 incidents, D1 retention 42%
- Month 1: 95,000 signups, $72k MRR, D7 retention 28%, NPS 47

## Cross-References

- Governance: `01 - governance/15-project-lifecycle-model.md`, `01 - governance/06-master-generation-pipeline.md`
- Operational Standards: `05 - operational-standards/12-release-standard.md`, `05 - operational-standards/10-failure-recovery-standard.md`, `05 - operational-standards/11-human-review-standard.md`
- Templates: `04 - templates/workflows/launch/launch-plan.md`, `04 - templates/workflows/launch/launch-plan.md`, `04 - templates/workflows/launch/post-launch-review.md`
- Validation: All 8 validators run in Step 1; incident validators triggered as needed
- Prompt Contracts: `07 - prompt-contracts/11-human-review-interface-prompt.md` (launch decision sign-off)

End of Launch Workflow
