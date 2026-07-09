# Integration Spec Template

**Layer:** Templates / Workflows / Architecture
**Owner:** Architecture Agent (`agents/core-pipeline/architecture.md`)
**Source Workflow:** `06 - workflows/architecture.md`
**Version:** 1.0

## Purpose

Define a single integration with an external service in enough detail that the Implementation workflow can build against it without ambiguity. One Integration Spec per external service (Stripe, Twilio, PostHog, etc.). The Integration Spec captures auth, data flows, webhook handling, error modes, and test strategy — everything needed to ship a reliable integration.

## When to Use

- Every external service in the Architecture Object's Integration Map
- Any new integration added post-launch
- Any integration change (versioning, auth rotation, new endpoints)

## Structure

### Header

| Field | Type | Required |
|-------|------|----------|
| integration_id | text (e.g. INT-001) | yes |
| provider | text (e.g. Stripe, Twilio, PostHog) | yes |
| purpose | textarea | yes |
| status | enum (proposed, building, live, deprecated) | yes |
| owner | text (team or agent) | yes |
| go_live_date | date | conditional |
| deprecation_date | date | conditional |
| replacement_integration | integration_id | conditional |

### Provider Reference

| Field | Type | Required |
|-------|------|----------|
| provider_name | text | yes |
| provider_docs_url | url | yes |
| api_version | text | yes |
| sdk_used | text (e.g. stripe-node@14) | conditional |
| account_id_env_var | text (e.g. STRIPE_ACCOUNT_ID) | conditional |

### Authentication

| Field | Type | Required |
|-------|------|----------|
| auth_method | enum (api_key, oauth2, jwt, hmac_webhook, mtls) | yes |
| credentials_storage | text (e.g. process.env.STRIPE_SECRET_KEY) | yes |
| credential_rotation_policy | textarea | yes |
| scopes | list | conditional |
| token_refresh_strategy | textarea | conditional |

### Data Flows (Outbound — Us Calling Provider)

For each outbound call:

| Field | Type |
|-------|------|
| call_id | text |
| operation | text (e.g. create_customer, charge_payment) |
| trigger | textarea (what initiates this call) |
| request_payload | json_schema_ref |
| response_handling | textarea |
| idempotency_strategy | textarea (idempotency key, request fingerprint) |
| retry_policy | textarea (max attempts, backoff) |
| timeout | text (e.g. 30s) |

### Data Flows (Inbound — Provider Calling Us)

For each webhook:

| Field | Type |
|-------|------|
| webhook_id | text |
| trigger_event | text (e.g. customer.subscription.deleted) |
| endpoint_url | text (e.g. /api/webhooks/stripe) |
| signature_verification | textarea (HMAC algorithm, header name, secret env var) |
| payload_schema | json_schema_ref |
| processing_logic | textarea |
| idempotency_strategy | textarea (event_id dedup window) |
| failure_response | text (e.g. return 500 to trigger retry) |
| retry_behavior | text (provider's retry cadence) |

### Error Handling

| Field | Type | Required |
|-------|------|----------|
| known_error_codes | list (code, meaning, action) | yes |
| rate_limit_handling | textarea | yes |
| provider_outage_strategy | textarea (circuit breaker, queue, fail-open) | yes |
| data_inconsistency_resolution | textarea (reconciliation strategy) | yes |
| alerting_on_failure | text (PagerDuty, email, none) | yes |

### Compliance & Data Handling

| Field | Type | Required |
|-------|------|----------|
| pii_exchanged | boolean | yes |
| pii_fields | list | conditional |
| data_residency | text (us, eu, global) | yes |
| gdpr_relevant | boolean | yes |
| data_retention_in_provider | text | yes |
| deletion_strategy | textarea (how to ensure data is purged from provider) | yes |

### Cost & Limits

| Field | Type | Required |
|-------|------|----------|
| pricing_model | textarea (per-call, per-seat, percentage) | yes |
| estimated_monthly_cost | text | yes |
| rate_limits | textarea (provider's published limits) | yes |
| quota_strategy | textarea (backoff, queue, user-facing limits) | yes |

### Testing Strategy

| Field | Type | Required |
|-------|------|----------|
| test_mode_used | boolean | yes |
| test_credentials_separate | boolean | yes |
| integration_test_coverage | list (scenarios) | yes |
| webhook_signature_test | textarea (how to verify signature in CI) | yes |
| staging_environment_used | boolean | yes |
| load_test_required | boolean | no |

### Rollout Plan

| Field | Type | Required |
|-------|------|----------|
| rollout_strategy | enum (feature_flag, percentage_rollout, instant) | yes |
| kill_switch | text (e.g. env var, feature flag name) | yes |
| rollback_procedure | textarea | yes |
| monitoring_during_rollout | textarea | yes |
| success_criteria | textarea | yes |

### Traceability

| Field | Type |
|-------|------|
| affects_features | list (feature_ids) |
| affects_workflows | list (workflow_ids) |
| related_adrs | list (adr_ids) |
| related_prds | list (prd filenames) |

## Validation Rules

- All outbound calls must have `idempotency_strategy`
- All webhooks must have `signature_verification` and `idempotency_strategy`
- Cost estimate must be populated before `status = building`
- Test credentials must be separate from production
- `kill_switch` must be testable without code change

## Cross-References

- **Workflow:** `06 - workflows/architecture.md`
- **Architecture Object:** `04 - templates/workflows/architecture/architecture-object.md` Section 7
- **PRD source:** `reference/apparchitect-prd-suite/base-prds/12-integrations-and-data-prd.md`
- **Validation:** `08 - validation/06-dependency-validator.md`

---

*One spec per integration. Don't bundle multiple providers into a single file.*
