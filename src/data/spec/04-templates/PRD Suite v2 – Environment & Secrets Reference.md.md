# [Product Name] – Environment & Secrets Reference

**Version:** 2.0  
**Status:** Authoritative · Single Source of Truth for All Environment Configuration  
**Governed by:** [Product Name] – Master PRD Index  
**Security Notice:** This document must never contain actual secret values. Variable names and metadata only.

---

## ⚠️ Precedence Compliance Block

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | No secrets hardcoded — all via environment variables | Every service credential must have an entry here before any agent uses it |
| Safety, Privacy & Control PRD | Prohibited log content must never be logged | Logger configuration env vars must enforce content exclusion |
| Technical Architecture PRD | Stack defines which services are used | Every service in Technical PRD must have its credentials documented here |
| Data & Integration PRD | Every integration has credentials | Every external service in Data PRD must have a corresponding entry here |

---

## 1. Purpose of This Document

This document defines every environment variable required by [Product Name]. It specifies the variable name, purpose, which service uses it, which environments it applies to, rotation policy, and what happens if it is missing.

**Rules:**
- Every env var used anywhere in the codebase must be listed here
- Actual secret values must never appear in this document or in source code
- `.env.example` in the repository root must stay in sync with Section 7 at all times
- Any agent that writes code using an env var must first verify it is listed here
- If an env var is needed but not listed, stop and add it here before proceeding

---

## 2. Environment Overview

| Environment | Purpose | URL | Secrets Source | Production Credentials? |
|---|---|---|---|---|
| `development` | Local development | `localhost:[port]` | `.env.local` (gitignored) | **Never** |
| `preview` | PR preview deployments | `[*.domain.app]` | [Vercel / Doppler / etc.] | No — dev keys only |
| `staging` | Pre-production testing | `staging.[domain]` | [Secrets manager] | No — staging keys only |
| `production` | Live product | `[domain]` | [Secrets manager] | Yes |

---

## 3. Variable Registry

### 3.1 Application Configuration

| Variable | Description | Example (non-sensitive) | Required | Environments | Used By |
|---|---|---|---|---|---|
| `NODE_ENV` | Runtime environment identifier | `development` | Yes | All | App, all services |
| `NEXT_PUBLIC_APP_URL` | Public base URL | `https://[domain]` | Yes | All | Frontend, emails |
| `PORT` | Server port | `3000` | No (default: 3000) | dev only | API server |
| `[VAR_NAME]` | [Description] | [Safe example] | [Yes/No] | [Envs] | [Who] |

### 3.2 Database

| Variable | Description | Example | Required | Environments | Rotation Policy |
|---|---|---|---|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string | `postgres://user:pass@host:5432/db` | Yes | All | On breach / credential rotation |
| `DATABASE_POOL_SIZE` | Max connection pool size | `10` | No (default: 10) | All | N/A |
| `[VAR_NAME]` | [Description] | [Example] | [Yes/No] | [Envs] | [Policy] |

### 3.3 Authentication

| Variable | Description | Example | Required | Environments | Rotation Policy |
|---|---|---|---|---|---|
| `JWT_SECRET` | Secret for signing JWT tokens | *(64-char random string)* | Yes | All | Default: 90 days / On breach |
| `JWT_EXPIRY` | Token expiry duration | `30d` | No (default: 30d) | All | N/A |
| `COOKIE_SECRET` | Secret for signing cookies | *(64-char random string)* | Yes | All | Default: 90 days / On breach |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `[id].apps.googleusercontent.com` | If OAuth enabled | All | On breach |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | *(secret value)* | If OAuth enabled | All | Default: 90 days / On breach |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI | `[domain]/api/v1/auth/callback/google` | If OAuth enabled | All | On URL change |

### 3.4 AI Provider

| Variable | Description | Example | Required | Environments | Rotation Policy |
|---|---|---|---|---|---|
| `[OPENAI/ANTHROPIC]_API_KEY` | AI provider API key | `sk-[string]` | If AI used | All | Default: 90 days / On breach |
| `AI_MODEL` | Model identifier | `gpt-4o` | Yes if AI | All | On model change |
| `AI_MAX_TOKENS` | Max tokens per response | `1000` | No (default in code) | All | N/A |
| `AI_TEMPERATURE` | Model temperature | `0.7` | No (default in code) | All | N/A |
| `AI_TIMEOUT_MS` | Request timeout in ms | `30000` | No (default: 30000) | All | N/A |

### 3.5 Email Service

| Variable | Description | Example | Required | Environments | Rotation Policy |
|---|---|---|---|---|---|
| `[SENDGRID/RESEND]_API_KEY` | Email provider API key | `SG.[string]` | Yes | staging, production | Default: 90 days / On breach |
| `EMAIL_FROM_ADDRESS` | Sender email | `hello@[domain]` | Yes | All | On address change |
| `EMAIL_FROM_NAME` | Sender display name | `[Product Name]` | Yes | All | N/A |

### 3.6 [Additional Service]

| Variable | Description | Example | Required | Environments | Rotation Policy |
|---|---|---|---|---|---|
| `[VAR_NAME]` | [Description] | [Safe example] | [Yes/No] | [Envs] | Default: 90 days / On breach |

---

## 4. Variable Rules

### 4.1 Naming Conventions

- All names in `SCREAMING_SNAKE_CASE`
- Third-party service variables prefixed with service name: `STRIPE_`, `OPENAI_`, `SENDGRID_`
- Public (client-safe) variables prefixed with `NEXT_PUBLIC_` (Next.js) or framework equivalent
- Boolean feature flags: `[FEATURE]_ENABLED` — value is string `"true"` or `"false"`
- Never use `NEXT_PUBLIC_` prefix for any secret value

### 4.2 Public vs. Private Classification

| Type | Prefix | Safe to Expose to Client | Examples |
|---|---|---|---|
| Public | `NEXT_PUBLIC_` | Yes — intentional | `NEXT_PUBLIC_APP_URL` |
| Private | *(none)* | **Never** | `DATABASE_URL`, `JWT_SECRET`, all API keys |

**Rule:** Never access a private variable in client-side code. Next.js will not expose unprefixed vars to the client, but code must never attempt to access them there.

### 4.3 Required vs. Optional at Startup

All variables marked `Required: Yes` must be present at startup. The application must:
1. Check for all required variables before the server starts
2. Log a clear error naming every missing variable
3. Exit with code 1 if any required variable is absent
4. Never silently continue with a missing required variable

---

## 5. Environment-Specific Behavior

### 5.1 Development

- Use `.env.local` file (gitignored — never committed)
- Database: local PostgreSQL or Docker container
- Email: disabled or routed to local test inbox (e.g., Mailhog, Mailtrap)
- AI: real API calls with a dev key (set spending limits on the provider)
- Payments: sandbox/test mode credentials only

### 5.2 Preview

- Variables set in deployment platform (e.g., Vercel preview environment)
- Database: dedicated preview database or branch database
- Email: disabled or routed to internal test inboxes
- AI: dev key with limits
- Payments: sandbox mode

### 5.3 Staging

- Variables set in secrets manager
- Database: dedicated staging database (separate from production)
- Email: enabled, routed to internal test addresses only — never real users
- AI: staging key with rate limits
- Payments: sandbox mode

### 5.4 Production

- All variables set in secrets manager — never in `.env` files
- All services: production credentials
- Email: fully enabled to real users
- AI: production key
- Payments: live mode

---

## 6. Secret Rotation Policy

| Variable | Default Rotation | Triggered By | Rotation Process |
|---|---|---|---|
| `JWT_SECRET` | 90 days | Schedule or breach | Update in secrets manager → redeploy → existing sessions invalidated (users must re-login) |
| `COOKIE_SECRET` | 90 days | Schedule or breach | Update in secrets manager → redeploy → existing sessions invalidated |
| `DATABASE_URL` | On credential rotation | Password rotation or breach | Update connection string in secrets manager → redeploy → verify connectivity |
| `[SERVICE]_API_KEY` | 90 days | Schedule or breach | Generate new key in provider dashboard → update in secrets manager → redeploy → revoke old key |
| `GOOGLE_CLIENT_SECRET` | 90 days | Schedule or breach | Rotate in Google Cloud Console → update secrets manager → redeploy |

**Rule for all rotations:**
1. Generate new value
2. Update in secrets manager
3. Deploy with new value active
4. Verify service function
5. Revoke/invalidate old value
6. Log rotation in Changelog & Decision Log

---

## 7. `.env.example` Template

*This is the exact content that must appear in `.env.example` in the repository root. Sync this with every new variable added. No values — variable names and comments only.*

```bash
# ─────────────────────────────────────────────────────────
# [Product Name] — Environment Variables
# ─────────────────────────────────────────────────────────
# 1. Copy this file: cp .env.example .env.local
# 2. Fill in all values
# 3. NEVER commit .env.local or any file containing real values
# 4. All required variables must be set or the app will not start
# ─────────────────────────────────────────────────────────

# Application
NODE_ENV=
NEXT_PUBLIC_APP_URL=
PORT=

# Database
DATABASE_URL=
DATABASE_POOL_SIZE=

# Authentication
JWT_SECRET=
JWT_EXPIRY=
COOKIE_SECRET=

# OAuth (required if OAuth enabled)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# AI Provider (required if AI features enabled)
OPENAI_API_KEY=
AI_MODEL=
AI_MAX_TOKENS=
AI_TEMPERATURE=
AI_TIMEOUT_MS=

# Email Service
SENDGRID_API_KEY=
EMAIL_FROM_ADDRESS=
EMAIL_FROM_NAME=

# [Additional Service]
[VAR_NAME]=
```

---

## 8. Startup Validation

Implement this check in `[file path — e.g., lib/env.ts]`. Call it before the server starts.

```typescript
const REQUIRED_VARS: string[] = [
  'DATABASE_URL',
  'JWT_SECRET',
  'COOKIE_SECRET',
  // Add all required variables here — keep in sync with Section 3
];

export function validateEnv(): void {
  const missing = REQUIRED_VARS.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nSet these variables and restart the server.');
    process.exit(1);
  }

  console.log('✅ Environment variables validated.');
}
```

---

## 9. Acceptance Criteria

- [ ] Every environment variable used in the codebase is listed in Section 3
- [ ] `.env.example` matches Section 7 exactly — no drift
- [ ] No actual secret values in source code or this document
- [ ] Startup validation implemented and exits on missing required variables
- [ ] Public vs. private classification enforced in code
- [ ] All rotation policies defined with concrete defaults (no open-ended brackets)
- [ ] All environments have variables configured in the appropriate secrets source

---

**END OF ENVIRONMENT & SECRETS REFERENCE**