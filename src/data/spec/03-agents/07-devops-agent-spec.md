# AppArchitect – DevOps Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Owns infrastructure, deployment, CI/CD, and runtime environment management
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | DevOps Agent |
| **Role** | Configure hosting, CI/CD pipeline, env management, and observability |
| **Type** | Infrastructure |
| **Operates On** | Vercel config, GitHub Actions, environment variables, monitoring |
| **Triggered By** | Orchestrator phase unlock (after Backend Agent COMPLETE) |
| **Blocking?** | Yes — blocks production deployment |

## 2. Mission Statement

The DevOps Agent stands up and maintains the production infrastructure for AppArchitect. It configures hosting (Vercel for app, Supabase for database, S3-compatible for asset storage), wires up the CI/CD pipeline (lint, type-check, unit tests, integration tests, E2E tests, placeholder detection, security audit, deploy), manages environment variables per the Environment & Secrets Reference, and configures observability (logs, error tracking, uptime monitoring). It ensures HTTPS is enforced, secrets are never in source, and the placeholder detection script is a required CI step.

## 3. Scope

### 3.1 In Scope
- Hosting configuration (Vercel)
- Database hosting (Supabase)
- Asset storage (S3-compatible, if used)
- CI/CD pipeline (GitHub Actions)
- Environment variable management
- Secrets rotation tooling
- Logging aggregation
- Error tracking (Sentry or equivalent)
- Uptime monitoring
- CDN configuration
- Custom domain setup
- Performance monitoring
- Cost monitoring

### 3.2 Out of Scope
- Application code (other agents)
- Database schema (Database Agent)
- Auth (Auth & Security Agent)
- AI integration (AI Integration Agent)
- Backup procedures (delegated to hosting provider)
- Disaster recovery (delegated to hosting provider)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `techArchPRD` | Documentation Agent | Markdown | Yes |
| `envSecretsRef` | Documentation Agent | Markdown | Yes |
| `testPlan` | Documentation Agent | Markdown | Yes |
| `masterPRDIndex` | Documentation Agent | Markdown | Yes |

### 4.2 Input Schemas
```typescript
type DeploymentConfig = {
  environment: 'development' | 'preview' | 'staging' | 'production';
  appHosting: 'vercel';
  databaseHosting: 'supabase';
  assetStorage: 's3' | 'r2' | null;
  domains: { primary: string; aliases: string[] };
  secrets: Record<string, string>;        // env var name → source
  ciChecks: string[];                     // names of required CI steps
}
```

### 4.3 Input Validation Rules
- All env vars referenced in code must exist in Environment & Secrets Reference
- All domains must have valid DNS
- Production deploy requires all CI checks passing

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| Vercel project config | `/vercel.json` | JSON | Yes |
| GitHub Actions workflows | `/.github/workflows/*.yml` | YAML | Yes |
| Env var templates | `/.env.example` | Dotenv | Yes |
| Monitoring dashboards | External service | URL | Yes |
| Runbooks | `/docs/runbooks/*.md` | Markdown | Yes |
| Sign-off report | Orchestrator | JSON | Yes |

### 5.2 Output Schemas
**DevOpsSignOff**
```typescript
type DevOpsSignOff = {
  environmentsConfigured: string[];
  ciChecksConfigured: number;
  ciChecksRequired: number;
  placeholderDetectionCIStep: boolean;
  httpsEnforced: boolean;
  secretsInSecretsManager: boolean;
  noSecretsInSource: boolean;
  monitoringActive: boolean;
  errorTrackingActive: boolean;
  customDomainConfigured: boolean;
  issues: Array<{ severity: string; description: string }>;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Provision Infrastructure**
- Create Vercel project
- Create Supabase project (or use existing)
- Configure asset storage (S3 bucket, R2, or none)
- Set up DNS for primary domain + aliases

**Step 2: Configure CI/CD Pipeline**
- `ci.yml` on every push:
  - Lint (ESLint)
  - Type check (TypeScript)
  - Unit tests (Vitest)
  - Placeholder detection (master script)
  - Security audit (npm audit)
- `ci-pr.yml` on every PR:
  - All of the above
  - Integration tests
  - Preview deploy
- `ci-main.yml` on merge to main:
  - All of the above
  - Staging deploy
  - E2E tests
  - Smoke tests
- `release.yml` on manual trigger:
  - All of the above
  - Production deploy (with approval gate)

**Step 3: Configure Environment Variables**
- Per Environment & Secrets Reference
- Vercel env vars: dev / preview / production
- All secrets in Vercel env, never in `.env` for deployed envs
- `.env.example` kept in sync

**Step 4: Configure Observability**
- Logs: Vercel log drain to Loki or equivalent
- Error tracking: Sentry (or equivalent)
- Uptime: Better Stack or similar
- Performance: Vercel Analytics + custom RUM (if needed)
- Cost monitoring: Vercel spend alerts, Supabase spend alerts, AI provider spend alerts

**Step 5: Security Headers**
- HSTS preload list submission
- CSP configured at hosting layer
- X-Frame-Options, X-Content-Type-Options, Referrer-Policy

**Step 6: Runbooks**
- `runbook-deploy.md`: how to deploy
- `runbook-rollback.md`: how to roll back
- `runbook-incident.md`: how to respond to outages
- `runbook-secret-rotation.md`: how to rotate secrets

**Step 7: Cost Guardrails**
- Set spend limits at provider level
- Alerts at 50%, 80%, 100% of monthly budget

**Step 8: Disaster Recovery**
- Database backups: daily, retained 30 days
- Document storage backups: versioning enabled
- Recovery time objective (RTO): 1 hour
- Recovery point objective (RPO): 24 hours

**Step 9: Sign-off**
- Emit `DevOpsSignOff`
- Set `handoffReady: true` only if all checks pass

### 6.2 Decision Logic
**Decision: Deploy or block**
```
IF any CI check fails
THEN block deploy, surface failure to user
ELSE IF environment is production
THEN require manual approval before deploy
ELSE deploy
```

**Decision: Alert threshold**
```
IF metric is critical (uptime, error rate)
THEN alert immediately
ELSE IF metric is degraded (latency, queue depth)
THEN alert after 5 min sustained
ELSE log only
```

### 6.3 Iteration Behavior
- Iterates over: environments (dev → preview → staging → production)
- Final pass: production readiness audit

### 6.4 Concurrency Rules
- May run concurrently with: most agents (read-only on infrastructure)
- Must not run concurrently with: another DevOps Agent

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| CI check fails on main | Block deploy, notify via Slack/email |
| Production deploy fails mid-deploy | Automatic rollback to last green deploy |
| Database connection fails | Restart app, alert on-call |
| AI provider rate limit hit | App degrades to fallback (AI Integration Agent handles) |
| Secrets leaked in source | Critical alert, rotate immediately |
| Domain DNS issue | Failover to backup DNS, alert on-call |
| Cost spike (3x normal) | Alert, consider rate limiting |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Technical Architecture PRD | All (defines stack to deploy) |
| Environment & Secrets Reference | All (env vars to configure) |
| Test Plan PRD | CI test commands |
| Master PRD Index | §8 (placeholder detection script) |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must run after | Backend Agent | App must exist to deploy |
| Must run after | Frontend Agent | UI must exist |
| Must run after | Database Agent | Schema must exist |
| May run concurrently | Content & Design | Independent |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| Vercel | App hosting | Critical |
| Supabase | Database | Critical |
| S3 / R2 | Asset storage | Medium (if used) |
| Sentry | Error tracking | Medium |
| Better Stack / UptimeRobot | Uptime monitoring | Medium |
| Domain registrar | DNS | High |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `DEPLOY_FAILED` | Production deploy failed | Critical | Rollback |
| `CI_CHECK_FAILED` | CI check failed | High | Fix and retry |
| `SECRET_DETECTED_IN_SOURCE` | Secret value in source code | Critical | Rotate, remove, audit |
| `PLACEHOLDER_DETECTED_IN_PRD` | Unfilled placeholder | High | Block build, fix PRD |
| `HTTPS_NOT_ENFORCED` | TLS not configured | Critical | Configure hosting |
| `BACKUP_FAILED` | Daily backup failed | High | Investigate |

## 10. Logging & Observability
- Log every deploy (event `DEPLOY`) with version, duration, success/failure
- Log every CI run (event `CI_RUN`) with checks passed/failed, duration
- Log every secret rotation (event `SECRET_ROTATED`) with var name (no value)
- Never log: secret values, user PII, raw error stack traces in user-facing logs

## 11. Acceptance Criteria
- [ ] All environments configured (dev, preview, staging, production)
- [ ] CI pipeline includes lint, type-check, unit tests, integration tests, placeholder detection, security audit
- [ ] Placeholder detection is a required CI step
- [ ] All env vars set in Vercel, none in source code
- [ ] HTTPS enforced on all routes
- [ ] All required security headers configured
- [ ] Error tracking, uptime monitoring, cost monitoring active
- [ ] Daily database backups running
- [ ] Runbooks written and accessible
- [ ] DevOpsSignOff all PASS

## 12. Test Cases
- 12.1 Happy: push to main → CI passes → staging deploy → E2E tests pass → ready for production.
- 12.2 Error: placeholder detected → CI fails, build blocked.
- 12.3 Edge: production deploy fails at 50% → automatic rollback, previous version live.

---

**END OF DEVOPS AGENT PRD**
### Monetization-Related Tasks

**MON-OPS-001: Stripe env var setup**
- Priority: P0
- Description: Add Stripe env vars to Environment & Secrets Reference and `.env.example`
- Acceptance criteria: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY all present in §3.4
- Depends on: DevOps Agent OPS-001
- Complexity: S

**MON-OPS-002: Stripe webhook endpoint registration**
- Priority: P0
- Description: Register `https://[domain]/api/webhooks/stripe` in Stripe dashboard for all 7 event types
- Acceptance criteria: Webhook live in production; events flow correctly
- Depends on: Backend Agent MON-003
- Complexity: S

**MON-OPS-003: Subscription sync cron**
- Priority: P1
- Description: Daily cron job `POST /api/internal/billing-sync` that reconciles user tiers against Stripe
- Acceptance criteria: Missed webhooks caught within 24h; logged
- Depends on: MON-OPS-002
- Complexity: M

**MON-OPS-004: Failed-payment alerting**
- Priority: P1
- Description: Alert ops when `invoice.payment_failed` events exceed threshold
- Acceptance criteria: Alert fires after 3 consecutive failures per user
- Depends on: MON-OPS-002
- Complexity: S

**MON-OPS-005: PCI compliance check**
- Priority: P0
- Description: Verify no card data ever touches our servers; all via Stripe Checkout
- Acceptance criteria: Security review passes; no `card_number` fields anywhere
- Depends on: Backend Agent MON-001
- Complexity: S

**Cross-references:** Monetization & Pricing PRD §6; Technical Architecture PRD §14; Data & Integration PRD §5.2
