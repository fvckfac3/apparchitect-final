# AppArchitect Production-Readiness Validator
**Version:** 1.0
**Status:** Canonical
**Layer:** Validation Framework (Domain Validator — Final Gate)
**Parent engine:** `governance/13-validation-engine-spec.md`
**Rule catalog:** `governance/04-validation-rules.md` (Category 6: Security Validation, Category 7: AI Validation, Category 8: Export Validation)
**Standard:** `operational-standards/04-validation-standard.md` (Stage 8 — Production-Readiness Validation)
**Pipeline position:** Runs as Stage 13 — the FINAL gate before export. Runs after all other validators have passed.
**Consumes:** All validation findings (01-06), all generated documents, deployment configuration, security configuration, performance baselines, observability configuration
**Produces:** `output/validation-reports/07-production-readiness-{project_id}-{timestamp}.json` + `output/release-decision-{project_id}-{timestamp}.yaml`

Purpose
The Production-Readiness Validator is the final gate. It answers the binary question: Can this ship to production today?
This validator is different from all others:
- It does not validate that documents are well-formed (other validators did that)
- It validates that the SYSTEM is production-ready
- It considers runtime characteristics, not document characteristics
- It applies the principle: "Nothing ships until everything is ready"

Production-readiness is holistic. It considers:
- All prior validation findings (must be PASS)
- Security posture (hardening, secrets management, threat model coverage)
- Performance posture (latency, throughput, capacity)
- Reliability posture (error handling, recovery, degradation)
- Observability posture (logging, metrics, tracing)
- Operability posture (deployment, rollback, scaling)
- Compliance posture (GDPR, SOC2, HIPAA, CCPA as applicable)
- Cost posture (within budget, predictable scaling)
- User-experience posture (error states, edge cases, accessibility)
- Business posture (analytics, monetization flows, KPIs)

The validator produces:
- Production-Readiness Score (0-100)
- Release Decision (GO | CONDITIONAL_GO | NO_GO)
- Required Remediations (if NO_GO)
- Conditional Approvals (if CONDITIONAL_GO)
- Final Go-Live Authorization

Scope
Applies to:
- All validation findings from validators 01-06 (must aggregate to PASS)
- Runtime configuration (deployment, infrastructure, scaling)
- Security configuration (auth, encryption, secrets, threat model)
- Observability configuration (logging, metrics, tracing, alerting)
- Compliance posture (regulatory requirements)
- Operational runbooks (incident response, rollback procedures)
- Cost projections (within approved budget)

Out of scope:
- Document structure (handled by 01-05)
- Reference resolution (handled by 03)
- Internal consistency (handled by 04)
- Dependency integrity (handled by 06)

Validation Principles
The Production-Readiness Validator operates on seven principles:
1. Defense in depth — multiple security controls, no single point of failure
2. Observable systems — every production system must be measurable
3. Recoverable systems — every failure mode must have a recovery path
4. Documented operations — every operational procedure must be documented
5. Compliance as code — compliance controls must be enforceable, not aspirational
6. Cost predictability — cost must scale predictably with usage
7. User-first — every user-facing failure must have a graceful degradation

Production-Readiness Categories

Category 1: Pre-Validation Aggregate
All prior validators must have passed.
If any prior validator emitted CRITICAL findings, Production-Readiness validation is automatically NO_GO.
Required aggregate state:
- 01-prd-validator: PASS or PASS_WITH_WARNINGS
- 02-schema-validator: PASS
- 03-cross-document-validator: PASS
- 04-consistency-validator: PASS
- 05-completeness-validator: PASS (score >= 95)
- 06-dependency-validator: PASS

If any check fails: NO_GO (cannot proceed to runtime readiness check)

Category 2: Security Posture
Hard requirements for production:
- TLS 1.3+ enforced for all external traffic
- All secrets stored in a secret manager (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault, etc.)
- No hardcoded secrets in source code (scanned via secret-scanning tools)
- Authentication strategy implemented and tested
- Authorization model implemented with role-based access control
- All sensitive data encrypted at rest (AES-256 or stronger)
- All sensitive data encrypted in transit (TLS 1.3+)
- PII handling compliant with applicable regulations
- Input validation on all user inputs (XSS, SQL injection, command injection, path traversal)
- Output encoding for all user-rendered content
- CSRF protection on all state-changing endpoints
- Rate limiting on all public endpoints
- Web Application Firewall (WAF) configured
- DDoS protection configured
- Security headers set (CSP, HSTS, X-Frame-Options, etc.)
- Dependency vulnerabilities scanned and resolved (no critical/high CVEs unresolved)
- Threat model documented for high-risk features
- Penetration testing scheduled or completed

Validation:
- Check deployment configuration for TLS, secrets, encryption
- Scan source code for secrets
- Check auth/authz implementation
- Verify input validation coverage
- Check rate limiting and WAF
- Scan dependencies for CVEs
- Verify threat model coverage

Category 3: Performance Posture
Hard requirements for production:
- P50 latency defined and within target
- P95 latency defined and within target
- P99 latency defined and within target
- Throughput target defined and validated via load testing
- Capacity headroom verified (capacity > peak load * 1.5)
- Database query performance validated (slow query log analyzed)
- CDN configured for static assets
- Caching strategy implemented where appropriate
- Image optimization configured
- Bundle size budgets enforced
- Core Web Vitals within thresholds (LCP, FID, CLS) for web apps

Validation:
- Load test results present and within targets
- Capacity test results present and within targets
- Database performance verified
- Caching and CDN verified
- Frontend performance budget verified

Category 4: Reliability Posture
Hard requirements for production:
- All endpoints have error handling (no unhandled exception paths)
- All database operations have error handling
- All external API calls have error handling
- Retry logic with exponential backoff for transient failures
- Circuit breaker for external dependencies
- Graceful degradation paths defined (what happens when X is down?)
- Health check endpoint implemented
- Readiness probe implemented
- Liveness probe implemented
- Database migrations are reversible (down migrations exist)
- Backup strategy implemented and tested (recovery tested within RPO/RTO targets)
- Disaster recovery plan documented
- Multi-AZ or multi-region deployment for critical services

Validation:
- Error handling coverage audit
- Retry/circuit-breaker pattern verification
- Health/readiness/liveness probe verification
- Migration reversibility verification
- Backup recovery test verification
- DR plan documentation verification

Category 5: Observability Posture
Hard requirements for production:
- Structured logging (JSON format) across all services
- Log aggregation configured (centralized log store)
- Metrics emitted (Prometheus or equivalent)
- Distributed tracing configured (OpenTelemetry or equivalent)
- Alerting configured for critical metrics
- On-call rotation defined
- Incident response runbook documented
- SLO/SLI defined for critical services
- Error budget tracked
- Dashboard for system health available

Validation:
- Structured logging verification
- Log aggregation verification
- Metrics and tracing verification
- Alerting configuration verification
- SLO/SLI documentation verification
- Dashboard availability verification

Category 6: Operability Posture
Hard requirements for production:
- Deployment is automated (CI/CD)
- Deployment is reversible (rollback can be executed in < 5 minutes)
- Feature flags implemented for risky changes
- Database migration is decoupled from application deployment
- Configuration is externalized (environment variables, config service)
- Documentation is current (last updated within 30 days)
- Runbook exists for common operational tasks
- Runbook exists for incident response
- Capacity planning documented
- Cost monitoring configured

Validation:
- CI/CD verification
- Rollback procedure verification
- Feature flag verification
- Configuration externalization verification
- Documentation freshness check
- Runbook completeness check

Category 7: Compliance Posture
Compliance requirements based on project jurisdiction and data:
GDPR (if EU users):
- Data processing agreement documented
- Right to erasure implemented
- Data portability implemented
- Consent flows implemented
- Data breach notification procedure documented
- Data Protection Impact Assessment completed

SOC2 (if B2B SaaS):
- Access controls documented
- Audit logging enabled
- Vendor management documented
- Incident response documented
- Business continuity documented
- Annual SOC2 audit scheduled

HIPAA (if healthcare data):
- Business Associate Agreement documented
- Encryption of PHI at rest and in transit
- Access controls to PHI
- Audit logging of PHI access
- Breach notification procedure
- Risk assessment completed

CCPA (if California users):
- Privacy policy disclosing data collection
- Right to know implemented
- Right to delete implemented
- Right to opt-out implemented
- Non-discrimination policy

Validation:
- Applicable compliance frameworks identified
- All controls for each applicable framework verified
- Documentation completeness verified
- Audit trail verified

Category 8: Cost Posture
Hard requirements for production:
- Cost projection documented
- Cost projection within approved budget
- Cost scaling pattern understood (linear vs non-linear)
- Cost alerts configured
- Cost optimization opportunities identified (reserved capacity, spot instances, etc.)
- Idle resource cleanup automated

Validation:
- Cost projection document present
- Budget approval documented
- Cost alerts configured
- Resource cleanup automation verified

Category 9: User Experience Posture
Hard requirements for production:
- All user-facing error states have user-friendly messaging
- All empty states have meaningful content
- Loading states implemented for all async operations
- Accessibility (WCAG 2.1 AA at minimum)
- Mobile responsive verified across target devices
- Cross-browser compatibility verified
- Onboarding flow optimized (activation rate measured)
- Help documentation available
- Support channel established

Validation:
- Error message audit
- Empty state audit
- Loading state audit
- Accessibility audit (axe-core or equivalent)
- Device and browser compatibility verification
- Onboarding completion rate verification

Category 10: Business Posture
Hard requirements for production:
- Analytics tracking implemented for all key events
- Monetization flows tested end-to-end (if applicable)
- KPI dashboards configured
- A/B testing framework configured (if applicable)
- Customer feedback collection configured
- Support ticket system configured
- Marketing site reflects current product state

Validation:
- Analytics event coverage audit
- Monetization flow end-to-end test results
- Dashboard configuration verified

Validation Rules (30 Rules)

PRV-001: Pre-Validation Aggregate Failure
Severity: CRITICAL (immediate NO_GO)

PRV-002: TLS Not Enforced
Severity: CRITICAL

PRV-003: Hardcoded Secret in Source
Severity: CRITICAL

PRV-004: Secret Manager Not Configured
Severity: CRITICAL

PRV-005: Authentication Missing on Protected Endpoint
Severity: CRITICAL

PRV-006: Authorization Missing on Protected Resource
Severity: CRITICAL

PRV-007: Unencrypted Sensitive Data at Rest
Severity: CRITICAL

PRV-008: Unencrypted Data in Transit
Severity: CRITICAL

PRV-009: Missing Input Validation
Severity: CRITICAL

PRV-010: Missing CSRF Protection
Severity: CRITICAL

PRV-011: Missing Rate Limiting on Public Endpoint
Severity: ERROR

PRV-012: Critical Dependency CVE Unresolved
Severity: CRITICAL

PRV-013: High Dependency CVE Unresolved
Severity: ERROR

PRV-014: Missing Load Test Results
Severity: CRITICAL

PRV-015: P95 Latency Exceeds Target
Severity: ERROR

PRV-016: P99 Latency Exceeds Target
Severity: ERROR

PRV-017: Capacity Below Peak Load
Severity: CRITICAL

PRV-018: Missing Error Handling
Severity: ERROR

PRV-019: Missing Retry/Backoff for Transient Failures
Severity: WARNING

PRV-020: Missing Circuit Breaker
Severity: WARNING (ERROR for critical dependencies)

PRV-021: Missing Health Check Endpoint
Severity: ERROR

PRV-022: Migration Not Reversible
Severity: ERROR

PRV-023: Backup Recovery Not Tested
Severity: ERROR

PRV-024: No Structured Logging
Severity: WARNING

PRV-025: No Distributed Tracing
Severity: WARNING

PRV-026: No Alerting Configured
Severity: ERROR

PRV-027: Rollback Procedure Untested
Severity: ERROR

PRV-028: Runbook Missing
Severity: ERROR

PRV-029: GDPR Control Missing (if EU users)
Severity: CRITICAL

PRV-030: HIPAA Control Missing (if PHI handled)
Severity: CRITICAL

Validation Result Schema
```
{
  "validator": "production-readiness-validator",
  "version": "1.0",
  "run_id": "uuid",
  "timestamp": "ISO-8601",
  "project_id": "string",
  "release_decision": "GO|CONDITIONAL_GO|NO_GO",
  "summary": {
    "prior_validators_all_pass": true,
    "security_score": 95,
    "performance_score": 88,
    "reliability_score": 92,
    "observability_score": 85,
    "operability_score": 90,
    "compliance_score": 100,
    "cost_score": 95,
    "ux_score": 88,
    "business_score": 92,
    "overall_score": 92
  },
  "category_findings": {
    "security": [...],
    "performance": [...],
    "reliability": [...],
    "observability": [...],
    "operability": [...],
    "compliance": [...],
    "cost": [...],
    "ux": [...],
    "business": [...]
  },
  "critical_findings": [...],
  "error_findings": [...],
  "warning_findings": [...],
  "conditional_approvals": [
    {
      "id": "PRV-COND-001",
      "category": "performance",
      "finding": "P95 latency 180ms exceeds target of 150ms under load",
      "approval": "Approved for staged rollout (10% -> 50% -> 100%)",
      "conditions": [
        "Monitor P95 latency in production",
        "Rollback if P95 exceeds 200ms for 5+ minutes",
        "Complete performance optimization within 30 days"
      ],
      "approver": "CTO",
      "expiry": "2026-07-19T00:00:00Z"
    }
  ],
  "required_remediations": [
    {
      "id": "PRV-REM-001",
      "category": "security",
      "rule": "PRV-003",
      "severity": "CRITICAL",
      "description": "API key hardcoded in src/services/stripe.ts",
      "remediation": "Move to AWS Secrets Manager",
      "estimated_effort": "30 minutes",
      "blocking": true
    }
  ],
  "go_live_authorization": {
    "decision": "CONDITIONAL_GO",
    "decided_at": "ISO-8601",
    "decided_by": "Master Orchestrator + CTO review",
    "conditions_acknowledged": true,
    "remediations_tracked": true,
    "monitoring_required": true,
    "next_milestone": "Complete required remediations within 14 days"
  }
}
```

Release Decision Algorithm
```
release_decision = (
  if pre_validation_failed: NO_GO
  elif critical_findings_count > 0: NO_GO
  elif error_findings_count > 5: NO_GO
  elif overall_score >= 90 and error_findings_count == 0: GO
  elif overall_score >= 80: CONDITIONAL_GO (with conditions and remediation tracking)
  else: NO_GO
)
```

GO: Full production release approved
CONDITIONAL_GO: Release approved with conditions (staged rollout, monitoring, time-bounded remediation)
NO_GO: Release not approved. Required remediations must be completed and re-validation must pass.

Failure Examples

Example 1: Hardcoded Secret
Input:
```
src/services/stripe.ts:
  const apiKey = "sk_live_abc123def456";
Result: CRITICAL PRV-003
Remediation: Move to AWS Secrets Manager, rotate the exposed key
```

Example 2: Missing Load Test Results
Input:
```
Load test artifacts: missing
Performance budget: defined (P95 < 150ms)
Result: CRITICAL PRV-014
Remediation: Run k6 or Locust load test, document results
```

Example 3: Missing GDPR Controls
Input:
```
Schema: target_market includes "EU users"
GDPR controls: missing
Result: CRITICAL PRV-029
Remediation: Implement right-to-erasure, data portability, consent flows
```

Example 4: Capacity Below Peak
Input:
```
Capacity test: system handles 800 concurrent users
Peak load (projected): 1,200 concurrent users
Result: CRITICAL PRV-017
Remediation: Scale up or optimize to handle at least 1,800 concurrent (1.5x peak)
```

Example 5: Missing Health Check
Input:
```
GET /health: 404
Result: ERROR PRV-021
Remediation: Implement /health endpoint returning system status
```

Example 6: Conditional GO Scenario
Input:
```
P95 latency: 180ms (target: 150ms)
Other categories: PASS
Result: CONDITIONAL_GO
Conditions: Staged rollout, monitor, optimize within 30 days
```

Pipeline Integration
The validator is invoked as the FINAL gate before export. It cannot run until all prior validators pass.
Invocation sequence:
1. Validators 01-06 must all PASS (PRV-001 aggregate check)
2. Production-Readiness Validator (07) runs
3. Score and decision computed
4. GO: Export proceeds
5. CONDITIONAL_GO: Export proceeds with tracked conditions and monitoring
6. NO_GO: Pipeline halts, required remediations routed

Conditional Approval Tracking
CONDITIONAL_GO releases must be tracked:
- Conditions logged in release manifest
- Monitoring dashboards linked
- Remediation tickets created
- Expiry date set (typically 30-90 days)
- Re-validation required before expiry
- If conditions not met by expiry: rollback or re-deploy gate

Go-Live Authorization Record
Every release produces an authorization record:
- Decision (GO/CONDITIONAL_GO/NO_GO)
- Decision timestamp
- Decision authority (Master Orchestrator + human reviewer for CRITICAL findings)
- Conditions (if CONDITIONAL_GO)
- Required remediations (if NO_GO)
- Re-validation schedule (if CONDITIONAL_GO)

Performance Characteristics
For typical AppArchitect projects:
- Validation runtime: 60-180 seconds (heavy because it inspects runtime configuration, not just documents)
- Memory footprint: 500MB - 2GB
- Idempotent
- Cannot be parallelized with other validators (depends on all of them)

Ownership
This validator is owned by:
- Validation Engine (executes rules)
- Production-Readiness Validator Module (rule logic)
- Security Agent (security checks)
- Performance Agent (load test verification)
- DevOps Agent (deployment verification)
- Compliance Officer (compliance checks — human or agent)
- Master Orchestrator (release decision)
- CTO / Engineering Lead (human approval for CRITICAL findings)

End of File
**Authority:** Production-Readiness Validator is the FINAL gate. No export without GO or CONDITIONAL_GO.
**Status:** This completes the 7-validator immune system.

The 7 validators together form AppArchitect's immune system:
- 01-prd-validator.md catches malformed PRDs
- 02-schema-validator.md catches malformed schemas
- 03-cross-document-validator.md catches broken references
- 04-consistency-validator.md catches broken meaning
- 05-completeness-validator.md catches incomplete artifacts
- 06-dependency-validator.md catches broken dependencies
- 07-production-readiness-validator.md catches unsafe deployments

A project must pass all 7 to ship.
