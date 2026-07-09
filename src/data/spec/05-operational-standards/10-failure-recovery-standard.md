governance/operational-standards/10-failure-recovery-standard.md
AppArchitect Failure Recovery Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 10 of 15
Depends On: 01-operating-principles.md, 08-security-standard.md, 09-observability-standard.md, 12-release-standard.md


Purpose
Defines the failure detection, assessment, containment, recovery, validation, and documentation procedures for the AppArchitect system. This standard is the implementation of Operating Principle #9 (Fail Loudly).
Failures are not exceptional. They are expected. The system's quality is measured by how quickly, safely, and completely it recovers.


Scope
Applies to:
• All production runtime failures
• All agent execution failures
• All validation pipeline failures
• All release pipeline failures
• All data corruption or loss
• All security incidents (cross-referenced with 08-security-standard.md)
• All infrastructure failures
Out of scope:
• End-user application failures (governed by generated app's recovery spec)
• Cloud provider outages (governed by cloud contract)
• Third-party service failures (governed by integration contract)


Recovery Workflow
Six-phase workflow. Each phase has defined entry/exit criteria and a designated owner.

Phase 1 — Detect
Definition: Identify that a failure has occurred.
Sources:
• Automated monitoring (see 09-observability-standard.md)
• Customer reports
• Internal team reports
• Synthetic checks
• Security scans
Entry Criteria: Anomaly detected and confirmed as a failure (not noise).
Activities:
• Alert fires (see 09-observability-standard.md alerting rules)
• Initial triage by on-call engineer
• Severity classification (critical, high, medium, low)
• Incident commander assigned (if severity ≥ high)
Exit Criteria: Failure confirmed, severity set, incident commander assigned, incident channel opened.
Target Duration: < 15 minutes from first signal to confirmation.

Phase 2 — Assess
Definition: Understand the scope, impact, and root cause of the failure.
Entry Criteria: Failure detected, severity classified.
Activities:
• Impact analysis (what users/systems are affected)
• Scope analysis (how widespread)
• Root cause investigation (logs, traces, recent changes, dependencies)
• Mitigation options enumerated
• Decision: contain now or fix forward
Exit Criteria: Impact and scope documented, mitigation strategy chosen, communication drafted.
Target Duration: < 30 minutes for critical, < 2 hours for high, < 8 hours for medium.

Phase 3 — Contain
Definition: Stop the failure from causing further damage.
Entry Criteria: Mitigation strategy chosen in Phase 2.
Containment Options:
• Rollback to last known-good release
• Disable affected feature/agent
• Quarantine affected data
• Block affected traffic
• Apply emergency rate limit
• Activate circuit breaker
• Scale up replacement capacity
Activities:
• Execute chosen containment action
• Verify containment is effective
• Document containment action and time
Exit Criteria: Failure is contained, no further damage occurring, contained state is stable.
Target Duration: < 15 minutes for critical, < 1 hour for high.

Phase 4 — Recover
Definition: Restore the system to full operation.
Entry Criteria: Failure contained, root cause understood (or workaround in place).
Recovery Options:
• Deploy fix
• Restore from backup
• Re-enable disabled feature
• Failover to backup system
• Replay from event log
• Manual data repair
Activities:
• Execute chosen recovery action
• Validate recovery at each step
• Test affected user flows
• Confirm with stakeholders
Exit Criteria: System is fully operational, all affected users unblocked, no residual impact.
Target Duration: < 4 hours for critical, < 24 hours for high, < 7 days for medium.

Phase 5 — Validate
Definition: Confirm recovery is complete and durable.
Entry Criteria: System reported as recovered.
Activities:
• Run full validation suite
• Monitor SLOs for stability
• Run synthetic checks
• Confirm with affected users
• Run regression tests
Exit Criteria: System is stable, SLOs are met, regression tests pass, no reoccurrence.
Target Duration: < 24 hours of stable operation post-recovery.

Phase 6 — Document
Definition: Capture the incident for organizational learning.
Entry Criteria: Recovery validated, system stable.
Activities:
• Write incident report (see Section: Incident Reports)
• Conduct blameless post-mortem
• Identify contributing factors
• Define action items with owners and deadlines
• File follow-up improvements
• Update runbooks
Exit Criteria: Incident report published, action items assigned, runbooks updated.
Target Duration: < 7 days from incident close.

Recovery Targets (RTO/RPO)
RTO (Recovery Time Objective): Maximum acceptable downtime.
RPO (Recovery Point Objective): Maximum acceptable data loss.

| System Tier | RTO | RPO | Example Components |
|---|---|---|---|
| Tier 1 (Critical) | 1 hour | 5 minutes | Production API, master schema, release pipeline |
| Tier 2 (Important) | 4 hours | 1 hour | Agent runtime, validation engine, artifact registry |
| Tier 3 (Standard) | 24 hours | 24 hours | Telemetry, dashboards, analytics |
| Tier 4 (Archive) | 7 days | 7 days | Historical reports, archived artifacts |

Backup Strategy
All Tier 1 and Tier 2 systems have:
• Automated daily backups
• Hourly incremental backups
• Real-time replication to secondary region
• Backup verification daily
• Backup restoration tested monthly
• Backup retention: 30 days hot, 1 year cold, 7 years archive

Failover Strategy
Active-Passive
Primary: Production
Secondary: Warm standby in different region
Failover: Automatic on health check failure (5 consecutive failures)
RTO: < 1 hour, RPO: < 5 minutes
Used for: Tier 1 components

Active-Active
Primary: Multiple regions active
Secondary: All regions serve traffic
Failover: Automatic traffic shifting based on health
RTO: < 5 minutes, RPO: 0
Used for: Read-heavy Tier 1 services

Pilot Light
Primary: Full production
Secondary: Minimal standby (data replicated, compute off)
Failover: Manual activation
RTO: < 4 hours, RPO: < 1 hour
Used for: Tier 2 services

Backup & Restore
No Backup
Failover: Not possible
RTO: N/A, RPO: N/A
Used for: Stateless, regenerable services

Rollback Strategy
All releases must support rollback.
Rollback Triggers:
• Error rate > 5% within 30 minutes of release
• P95 latency > 2x baseline within 30 minutes
• SLO breach within 60 minutes
• Manual decision by release manager or incident commander

Rollback Procedure:
1. Decision to roll back documented (who, when, why)

2. Execute rollback to previous version

3. Verify rollback is complete

4. Verify system is healthy post-rollback

5. Communicate rollback to stakeholders
6. Schedule post-mortem

Rollback Artifacts:
• Previous version available in registry (see 07-artifact-management-standard.md)
• Rollback procedure tested in staging
• Rollback can be executed in < 15 minutes
• Data migration is reversible (or forward-only with clear migration path)

Restoration Procedure
When data is corrupted or lost:

1. Identify the scope and recency of data loss

2. Identify the appropriate backup

3. Test restoration in isolation
4. Communicate restoration plan (impact, duration)

5. Execute restoration

6. Validate restored data
7. Resume normal operation

Forward-Only Migrations
If data migration is forward-only:

1. Pre-migration backup is mandatory

2. Roll-forward is the only recovery path

3. Extensive staging validation is required

4. Migration window is scheduled during low traffic
5. Real-time monitoring during migration

Incident Reports
Every incident produces a report:
report:
  incident_id: string (UUID v4)
  title: string
  severity: enum (critical, high, medium, low)
  status: enum (open, contained, recovered, validating, closed)
  detected_at: ISO 8601 timestamp
  detected_by: string
  contained_at: ISO 8601 timestamp | null
  recovered_at: ISO 8601 timestamp | null
  closed_at: ISO 8601 timestamp | null
  duration_minutes: integer (calculated)
  affected_systems: array of strings
  affected_users: string (count, segment, or "internal only")
  root_cause: string
  contributing_factors: array of strings
  timeline: array of {timestamp, event, actor}
  resolution_summary: string
  lessons_learned: string
  action_items: array of {item, owner, due_date, status}
  post_mortem_link: url | null
  runbook_updates: array of strings
  related_incidents: array of incident_ids
  customer_communications: array of {channel, sent_at, content_link}

Incident reports are stored in the incident registry, retained for 7 years, and feed the continuous learning process (see 14-continuous-learning-standard.md).


Cross-References
• 01-operating-principles.md — Principle 9
• 08-security-standard.md — security incident response
• 09-observability-standard.md — detection feeds
• 11-human-review-standard.md — human authority during incidents
• 12-release-standard.md — rollback procedures
• 14-continuous-learning-standard.md — lessons learned loop
• governance/15-project-lifecycle-model.md — recovery per phase


Ownership
Component: Failure Recovery Standard
Owner: SRE Lead
Reviewer: Incident Commander Council + Operations Lead
Review Cadence: Every MAJOR version bump, after every critical incident, or annually (whichever first)


---

End of File
