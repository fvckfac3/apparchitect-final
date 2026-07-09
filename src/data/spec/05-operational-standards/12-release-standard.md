governance/operational-standards/12-release-standard.md
AppArchitect Release Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 12 of 15
Depends On: 01-operating-principles.md, 04-validation-standard.md, 06-versioning-standard.md, 08-security-standard.md, 11-human-review-standard.md


Purpose
Defines the release lifecycle, release types, release planning, release validation, approval gates, deployment procedures, monitoring, and retrospective requirements for AppArchitect releases. This standard is the implementation of Operating Principles #1, #5, #6, #7, #9, and #10 in the release domain.
A release is not a deployment. A release is a coordinated bundle of artifacts moving from development to production with all gates passed and all stakeholders informed.


Scope
Applies to:
• All production releases of AppArchitect runtime
• All schema releases
• All governance and operational standard releases
• All PRD releases
• All agent releases
Out of scope:
• Development builds (no governance required)
• End-user application releases (governed by generated app's release spec)


Release Types
Five release types, each with defined risk profile and approval requirements.

Type 1 — Patch Release
Definition: Backward-compatible bug fix, no behavior change.
Examples: Typo fix in doc, broken cross-reference, dependency patch, security CVE
Risk: Low
Approval: Release Manager
SLA: Deploy within 1 business day of approval
Rollback Window: 7 days
Required Artifacts: Patch notes, validation results

Type 2 — Minor Release
Definition: Backward-compatible new feature or enhancement.
Examples: New optional schema field, new agent, new validation rule that doesn't change outcomes
Risk: Medium
Approval: Release Manager + Technical Lead
SLA: Deploy within 5 business days of approval
Rollback Window: 14 days
Required Artifacts: Release notes, validation results, migration guide (if any)

Type 3 — Major Release
Definition: Breaking change or significant new capability.
Examples: Schema MAJOR bump, agent scope change, operating principle addition
Risk: High
Approval: Release Manager + Engineering Director + Product Lead
SLA: Deploy within 15 business days of approval
Rollback Window: 30 days
Required Artifacts: Release notes, validation results, migration guide, deprecation plan, communication plan

Type 4 — Hotfix Release
Definition: Emergency fix for production issue.
Examples: Security CVE, critical bug, performance regression
Risk: Variable (typically high urgency, well-understood scope)
Approval: Incident Commander (security/availability) OR Release Manager + On-call Engineer
SLA: Deploy within 4 hours of approval
Rollback Window: 7 days (or until stable)
Required Artifacts: Hotfix notes, post-incident review scheduled

Type 5 — Scheduled Release
Definition: Pre-planned release on a fixed cadence.
Examples: Monthly platform release, quarterly agent suite update
Risk: Variable per content
Approval: Per release content type
SLA: Per release schedule
Rollback Window: Per release type within


Release Lifecycle
Seven-phase lifecycle. Each phase has defined entry/exit criteria.

Phase 1 — Plan
Definition: Define what is in the release, when, how, and the rollback plan.
Entry: Release candidate features/fixes are identified.
Activities:
• Define release scope (what's in, what's deferred)
• Set release date and window
• Define rollback plan
• Identify risks and mitigations
• Define communication plan
• Get release scope approval
Exit Criteria: Approved release plan with scope, date, rollback, communication.
Output: Release plan document (aa-release-{version}-plan)

Phase 2 — Prepare
Definition: Build the release bundle and pre-validate.
Entry: Release plan approved.
Activities:
• Freeze release scope (no new additions)
• Build release artifacts
• Run full validation suite
• Stage in pre-production
• Run smoke tests
• Update documentation
• Brief on-call team
Exit Criteria: All artifacts validated, staging tests pass, documentation complete.
Output: Release candidate bundle (aa-release-{version}-rc)

Phase 3 — Validate
Definition: Final pre-release validation.
Entry: Release candidate built.
Activities:
• Run Stage 7 release validation (see 04-validation-standard.md)
• Security scan
• Performance test (if applicable)
• Compatibility test with all dependent artifacts
• Human review per release type
Exit Criteria: All validations PASS, all required reviews complete, no BLOCKED state.
Output: Validated release (aa-release-{version}-validated)

Phase 4 — Approve
Definition: Final go/no-go decision.
Entry: Release validated.
Activities:
• Release readiness review
• All approvers sign off
• Communication sent to stakeholders
• War room set up (for high-risk releases)
Exit Criteria: All required approvals received, communication sent.
Output: Approved release (aa-release-{version}-approved)

Phase 5 — Release
Definition: Deploy to production.
Entry: Release approved.
Activities:
• Deploy using canary strategy (1% → 10% → 50% → 100%)
• Monitor key metrics at each stage
• Hold at each canary stage for defined dwell time
• Promote or rollback at each stage
• Confirm full rollout
Exit Criteria: All canary stages complete, full rollout successful, no rollback needed.
Output: Released artifact (aa-release-{version}-released)

Phase 6 — Monitor
Definition: Watch the release in production.
Entry: Release deployed.
Activities:
• Monitor SLOs (see 09-observability-standard.md)
• Monitor error rates
• Monitor user feedback
• Monitor security events
• Daily check-ins for first 3 days
Exit Criteria: Stable operation for rollback_window duration.
Output: Release monitoring reports

Phase 7 — Retrospective
Definition: Learn from the release.
Entry: Monitoring period complete.
Activities:
• Conduct blameless retrospective
• Capture what went well
• Capture what to improve
• Define action items
• Update runbooks and standards
Exit Criteria: Retrospective document published, action items assigned.
Output: Release retrospective (aa-release-{version}-retro)

Release Gates
Every release must pass these gates:

Gate 1 — Quality Gate
All release artifacts meet quality thresholds (see 03-document-quality-standard.md).

Gate 2 — Validation Gate
All 7 validation stages pass for all release artifacts.

Gate 3 — Review Gate
All required human reviews complete per release type (see 11-human-review-standard.md).

Gate 4 — Security Gate
No unaddressed security findings.
No unmitigated vulnerabilities at or above defined severity.

Gate 5 — Compliance Gate
All operating principles satisfied (see 01-operating-principles.md).
All governance and operational standards satisfied.

Gate 6 — Rollback Gate
Rollback procedure tested in staging within last 30 days.
Rollback can be executed within rollback_window.
Previous version is available in registry.

Rollback Triggers
A release is rolled back if any of the following occur:
• Error rate > 5% within 30 minutes
• P95 latency > 2x baseline within 30 minutes
• SLO breach within 60 minutes
• Security incident detected
• Manual decision by Release Manager or Incident Commander

Rollback Procedure:
1. Rollback decision documented (who, when, why)

2. Execute rollback to previous version

3. Verify rollback successful

4. Communicate rollback to stakeholders
5. Schedule post-mortem (see 10-failure-recovery-standard.md)

Release Notes
Every release produces release notes:
notes:
  release_id: string
  release_type: enum (patch, minor, major, hotfix, scheduled)
  version: string (SemVer)
  released_at: ISO 8601 timestamp
  released_by: string
  summary: string (one paragraph)
  features: array of {feature, description, impact}
  improvements: array of {improvement, description, impact}
  bug_fixes: array of {fix, description, impact}
  breaking_changes: array of {change, migration_steps, deprecation_timeline}
  deprecations: array of {item, replacement, removal_date}
  security_fixes: array of {cve, severity, description}
  known_issues: array of {issue, workaround, fix_eta}
  upgrade_instructions: string | null
  rollback_instructions: string
  acknowledgments: array of contributors
  artifacts: array of {artifact_id, version, change_type}

Communication Plan
Every release has a defined communication plan.
Channels:
• Internal: #releases Slack channel, internal email, team standups
• External: Status page, customer email, blog post (for major)
Timing:
• Major: 7 days notice, 1 day reminder, post-release summary
• Minor: 3 days notice, post-release summary
• Patch: Post-release summary
• Hotfix: Immediate notification + post-incident report

Release Calendar
Scheduled releases follow a defined cadence.
Default Cadence:
• Major: As needed (typically 1-2 per year)
• Minor: Monthly
• Patch: As needed
• Hotfix: As needed
• Scheduled: Monthly platform, quarterly agent suite

Release windows:
• Default: Tuesday-Thursday, 10am-2pm local time
• Blackout: Fridays, weekends, holidays, end of quarter
- Major releases avoid: end of year, customer events


Cross-References
• 01-operating-principles.md — Principles 1, 5, 6, 7, 9, 10
• 04-validation-standard.md — Stage 7 release validation
• 06-versioning-standard.md — version semantics for releases
• 08-security-standard.md — security gate
• 10-failure-recovery-standard.md — rollback as recovery
• 11-human-review-standard.md — approval gates
• 13-change-management-standard.md — change tracking through release
• governance/15-project-lifecycle-model.md — release phase integration


Ownership
Component: Release Standard
Owner: Release Manager
Reviewer: Engineering Director + Operations Lead
Review Cadence: Every MAJOR version bump, after every release incident, or quarterly (whichever first)


---

End of File
