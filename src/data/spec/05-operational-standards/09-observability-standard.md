governance/operational-standards/09-observability-standard.md
AppArchitect Observability Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 09 of 15
Depends On: 01-operating-principles.md, 02-agent-execution-standard.md, 08-security-standard.md


Purpose
Defines the observability pillars, telemetry signals, SLOs, alerting rules, and dashboard requirements for the AppArchitect system. This standard is the implementation of Operating Principle #9 (Fail Loudly) and #7 (Artifact Traceability).
You cannot fix what you cannot see. Every component in AppArchitect emits telemetry by default. Silent components are bugs.


Scope
Applies to:
• All AppArchitect runtime components
• All agent invocations
• All API calls (internal and external)
• All validation runs
• All artifact operations
• All human reviewer interactions
• All infrastructure components
Out of scope:
• End-user application telemetry (governed by generated app's analytics spec)
• Business intelligence on customer behavior (analytics layer)

Observability Pillars
Four pillars, all required, none optional.

Pillar 1 — Logs
Definition: Discrete, timestamped events with structured context.
Format: JSON, one event per line (NDJSON / JSONL).
Required fields:
• timestamp (ISO 8601 with microsecond precision)
• level (debug, info, warn, error, critical)
• message (human-readable)
• service (component name)
• trace_id (correlation ID)
• span_id (current span within trace)
• actor (who/what triggered this)
• context (key-value pairs)
Retention: 90 days hot, 1 year warm, 7 years cold
Sampling: Error logs always sampled at 100%. Info logs sampled at configurable rate (default 10%).

Pillar 2 — Metrics
Definition: Numerical measurements aggregated over time.
Types: Counter, Gauge, Histogram, Summary
Naming: {service}.{subsystem}.{metric_name}.{unit}
Example: apparchitect.agent.execution.duration_ms
Required metric categories:
• Traffic (requests/sec, events/sec)
• Latency (P50, P95, P99 for all operations)
• Errors (count, rate, by type)
• Saturation (CPU, memory, disk, network, queue depth)
• Business (agent throughput, validation pass rate, release frequency)
Retention: 13 months at 1-minute resolution, 7 years at 1-hour resolution
Storage: Time-series database (Prometheus-compatible format)

Pillar 3 — Traces
Definition: Distributed request flow across services and components.
Standard: OpenTelemetry-compatible
Required fields:
• trace_id (root correlation ID)
• span_id (current operation)
• parent_span_id (caller)
• operation_name
• start_time, end_time
• attributes (key-value context)
• events (timestamped annotations)
• status (ok, error)
• links (causal relationships to other traces)
Sampling: 100% for errors, 10% for normal traffic, configurable per service
Retention: 30 days full trace, 1 year span-level metadata

Pillar 4 — Events
Definition: Business-meaningful state changes worth alerting on.
Categories:
• Lifecycle events (artifact created, released, deprecated)
• Validation events (validation failed, blocked, passed with warnings)
• Security events (see 08-security-standard.md)
• Release events (release started, completed, rolled back)
• Incident events (detected, escalated, resolved)
Required fields:
• event_id
• event_type
• timestamp
• source
• payload (structured)
• severity
• correlation_ids (linked trace_id, span_id, audit_log_id)
Retention: 7 years (aligned with audit retention)

SLOs (Service Level Objectives)
AppArchitect commits to the following SLOs. These are measured monthly and reported to the Governance Council.

Availability
Target: 99.9% monthly availability for production runtime
Measurement: (total_time - downtime) / total_time
Downtime Definition: Any 5-minute window where <95% of expected requests succeed
Error budget: 43.83 minutes per month

Latency
Targets (P95):
• Agent invocation: < 5 seconds for standard operations
• Validation run: < 30 seconds for standard PRDs
• API request: < 500ms for all user-facing endpoints
• Trace query: < 2 seconds
Error budget: < 1% of requests may exceed SLO

Quality
Targets:
• Validation pass rate (first attempt): > 85%
• Quality score (weighted): > 92 average across all released PRDs
• Defect escape rate: < 2% of issues discovered post-release
• Mean time to detect (MTTD): < 15 minutes for critical issues
• Mean time to resolve (MTTR): < 4 hours for critical, < 24 hours for high

Throughput
Targets:
• Agent executions per hour: 100+ per agent
• Concurrent agent invocations: 50+
• Validation runs per hour: 1000+
• Artifact releases per day: 50+

Error Budgets
Error budgets are enforced. When an SLO is at risk, non-critical work is paused.
Budget exhaustion triggers:
• 50% consumed: Status page notification, on-call alert
• 75% consumed: Release freeze on non-critical changes
• 100% consumed: All non-emergency changes frozen, executive review
Budget reset: Monthly, on the 1st of each month UTC

Alerting Rules
Every alert has a defined:
• Trigger condition (specific, falsifiable)
• Severity (critical, high, medium, low, info)
• Routing (who gets paged, who gets notified)
• Runbook link
• Resolution SLA

Alert Categories:
Critical (page immediately, 24/7):
• Production downtime
• Security incident detected
• Data loss or corruption
• SLO error budget exhausted

High (page business hours):
• Latency SLO breach
• Error rate spike (>5% of normal)
• Validation pipeline failure
• Release blocked

Medium (notify, business hours):
• Quality score drop
• Defect escape detected
• Dependency vulnerability discovered

Low (digest, weekly):
• Best practice violations
• Optimization opportunities

Alert Hygiene Rules:
• Every alert has a runbook link
• Every alert has a clear owner
• Alerts that fire > 5 times per week are reviewed for tuning
• Stale alerts are pruned quarterly

Dashboards
Required dashboards (Grafana-compatible):

Operational Health
• Real-time SLO status
• Error rate trends
• Latency P50/P95/P99
• Throughput
• Active alerts
Audience: On-call engineers, SRE

Agent Performance
• Per-agent execution counts, success/failure rates
• Per-agent latency distribution
• Agent delegation graph
• Self-validation pass rate
Audience: Agent platform team

Validation Pipeline
• Per-stage validation throughput
• Per-stage failure types
• Quality score distribution
• Cross-artifact conflict counts
Audience: Validation engine team, quality team

Release Pipeline
• Release frequency, lead time
• Deployment success rate
• Time to recovery
• Change failure rate
Audience: Release managers, engineering leadership

Business Metrics
• Project completions per week
• PRDs generated per project
• Validation cycles per PRD
• Human review turnaround time
Audience: Product leadership, executive sponsors


Cross-References
• 01-operating-principles.md — Principles 7, 9
• 02-agent-execution-standard.md — trace envelope telemetry
• 08-security-standard.md — security event correlation
• 10-failure-recovery-standard.md — incident detection feeds recovery
• 14-continuous-learning-standard.md — observability feeds learning
• governance/15-project-lifecycle-model.md — observability per lifecycle phase


Ownership
Component: Observability Standard
Owner: SRE Lead
Reviewer: System Architect + Operations Lead
Review Cadence: Every MAJOR version bump, or on any SLO breach, or quarterly (whichever first)


---

End of File
