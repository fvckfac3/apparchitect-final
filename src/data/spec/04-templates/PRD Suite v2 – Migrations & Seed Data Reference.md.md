# [Product Name] – Migrations & Seed Data Reference

**Version:** 2.0  
**Status:** Authoritative · Single Source of Truth for Schema Changes  
**Governed by:** [Product Name] – Master PRD Index  
**Agent Owner:** Database Agent

---

```
═══════════════════════════════════════════════════════════
ROLE
═══════════════════════════════════════════════════════════
You are the Database Agent for [Product Name].
Your domain is the complete data layer — schema definition,
migration sequencing, seed data, and data integrity.

Your schema decisions are binding. Every other agent
that touches data depends on the correctness of your
output. A wrong column type, a missing constraint, or
an absent tenant_id column propagates into every system
that reads or writes that table. You do not approximate.
You implement exactly what the PRDs specify.

═══════════════════════════════════════════════════════════
LIMITS
═══════════════════════════════════════════════════════════
You must not:
  - Define a column that does not appear in the Core
    Systems PRD canonical schemas
  - Omit a column that appears in the canonical schemas
  - Write a migration without a corresponding down script
    unless rollback risk is explicitly documented
  - Apply a migration without recording it in Section 4
  - Include actual secret values in any seed script
  - Seed production data beyond what Section 6.5 specifies
  - Create a migration that breaks backward compatibility
    without following the protocol in Section 7.2

If a column type in Core Systems PRD conflicts with
what seems technically optimal:
  → The Core Systems PRD wins
  → Implement what is specified
  → Flag the concern as a warning in your output

If multi-tenant architecture is selected and any
user-data table lacks tenant_id:
  → This is a CRITICAL error
  → Do not apply the migration
  → Report immediately and await correction

If a migration cannot be made idempotent:
  → Document why explicitly in the migration entry
  → Add a WARNING to the migration header
  → Do not silently apply a non-idempotent migration

If a rollback would cause data loss:
  → Document the data loss explicitly
  → Require explicit product owner confirmation before
    adding the migration to the PENDING registry

═══════════════════════════════════════════════════════════
MISSION
═══════════════════════════════════════════════════════════
Your singular objective: Produce and maintain a database
schema that exactly implements every canonical data object
in the Core Systems PRD, with complete migration history,
tested rollback procedures, and seed data that creates
a fully functional environment at every tier.

You succeed when:
  - Every canonical schema field from Core Systems PRD
    exists in the database with matching name, type,
    and constraints
  - Every migration has an up script, a down script
    (or documented rollback risk), and passes all
    tests in Section 9
  - Development seed creates a fully usable local
    environment with test data for every role
  - Production seed uses ON CONFLICT DO NOTHING —
    never overwrites existing data
  - All migrations are idempotent unless documented
  - tenant_id present on all user-data tables if
    multi-tenant architecture is selected

You fail if:
  - Any canonical schema field is missing or mistyped
  - Any user-data table lacks tenant_id (multi-tenant)
  - Any migration is applied without a registry entry
  - Any production seed contains hardcoded credentials
  - Any migration lacks rollback documentation
  - Schema drift exists between this document and the
    Technical Architecture PRD table definitions

Begin with: Read the Precedence Compliance Block.
Verify all checks pass. Then proceed to Section 3.
═══════════════════════════════════════════════════════════
```

---

## ⚠️ Precedence Compliance Block

| Higher-Tier Document | Governing Rule | Status | Notes |
|---|---|---|---|
| Safety, Privacy & Control PRD | Cascade deletes must propagate — account deletion purges all user data | PASS / FAIL / N/A | [Finding if FAIL] |
| Safety, Privacy & Control PRD | No PII in logs — seed scripts must not log sensitive data | PASS / FAIL / N/A | [Finding if FAIL] |
| Core Systems PRD | Canonical schemas are authoritative — all column definitions must match | PASS / FAIL / N/A | [Finding if FAIL] |
| Technical Architecture PRD | PostgreSQL specified — all SQL must be PostgreSQL-compatible | PASS / FAIL / N/A | [Finding if FAIL] |
| Roles & Permissions Matrix | Role enum values must match matrix definitions exactly | PASS / FAIL / N/A | [Finding if FAIL] |

**If any check is FAIL:** Stop. Report the conflict. Do not proceed until resolved.

---

## 1. Purpose of This Document

This document defines every database migration, schema change, and seed data set for [Product Name]. It is the single source of truth for all migrations, rollback procedures, seed data, and data integrity constraints.

**Rules:**
- Every schema change must have a corresponding migration recorded here before it is applied
- No migration may be applied without updating this document
- Seed data for production must be explicitly approved and documented here
- Rollback plans must exist for every migration before it is applied
- All migrations must be idempotent unless explicitly documented otherwise
- Actual credential values must never appear in this document or seed scripts

---

## 2. Migration Overview

### 2.1 Migration Tooling

| Setting | Value |
|---|---|
| Tool | [Prisma Migrate / Flyway / Alembic / Knex / raw SQL] |
| Migration File Location | [e.g., `prisma/migrations/`] |
| Auto-apply on Deploy | [Yes / No — if No, specify manual command] |
| Rollback Supported | [Yes / No / Partial] |
| Tenancy Architecture | [Single-tenant / Multi-tenant via `tenant_id` / Multi-tenant via DB-per-tenant] |

### 2.2 Multi-Tenancy Configuration *(skip if single-tenant)*

| Setting | Value |
|---|---|
| Separation Strategy | [Logical — `tenant_id` on all user-data tables / Physical — DB per tenant] |
| Tenant ID Column | `tenant_id UUID NOT NULL` — required on all user-data tables |
| Tenant Isolation Enforced By | [Row-level security / Application-level filter / Both] |
| Cross-Tenant Query Permitted | Never — all queries must include tenant context |

**Critical Rule:** Any migration that adds a user-data table without `tenant_id` is invalid and must not be applied.

### 2.3 Migration Naming Convention

```
[YYYYMMDDHHMMSS]_[description_of_change].sql
```

Example: `20260301120000_create_users_table.sql`

### 2.4 Migration Status Legend

| Status | Meaning |
|---|---|
| `APPLIED` | Has been run on this environment |
| `PENDING` | Created but not yet applied |
| `ROLLED_BACK` | Was applied, then reverted |
| `BLOCKED` | Cannot proceed due to dependency or conflict |
| `SUPERSEDED` | Replaced by a later migration |

---

## 3. Transactional Boundaries & Failure Atomicity

### 3.1 Atomic Migration Rules

- Every migration executes within a single transaction
- If any statement fails, the entire migration rolls back
- No migration may commit partial state
- Long-running migrations that cannot be atomic must be split into safe, reversible steps with explicit documentation

### 3.2 Cross-System Failure States

| Workflow | Failure Point | System State After Failure | Recovery Action |
|---|---|---|---|
| User creation (users + profiles) | Profile insert fails after user created | Orphaned user row, no profile | Cascade delete OR application retry with idempotency key |
| [Workflow] | [Failure point] | [Resulting state] | [Recovery] |

### 3.3 Dual-Write Constraints

| Dual-Write Operation | Tables Involved | Transaction Strategy | Compensating Action on Failure |
|---|---|---|---|
| User signup | `users`, `profiles` | Single DB transaction | Rollback both on any failure |
| [Operation] | [Tables] | [Strategy] | [Compensation] |

### 3.4 Race Condition Handling

| Scenario | Risk | Mitigation |
|---|---|---|
| [e.g., Concurrent inserts on unique field] | [e.g., Duplicate key error] | [e.g., Unique constraint + application-level retry] |
| [Scenario] | [Risk] | [Mitigation] |

### 3.5 State Machine Transition Table

Migrations that affect state fields must document valid before/after states:

| Entity | Field | Before Migration | After Migration | Illegal Transition Protected By |
|---|---|---|---|---|
| [Entity] | [status field] | [Old states] | [New states] | [Constraint or application check] |

---

## 4. Migration Registry

### Migration [001] — [DATE] — Create Users Table

**File:** `[YYYYMMDDHHMMSS]_create_users_table.sql`  
**Status on Production:** `APPLIED`  
**Applied By:** [Agent Name / Name]  
**Applied At:** [Timestamp]  
**Schema Source:** Core Systems PRD — User Object canonical schema

**Description:** Creates the base users table with authentication fields.

**Up Migration:**
```sql
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50) DEFAULT 'MEMBER' NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
```

**Down Migration (Rollback):**
```sql
DROP TABLE IF EXISTS users;
```

**Validation After Apply:**
- [ ] Table exists with correct columns matching Core Systems PRD User Object
- [ ] Unique constraint on `email` enforced
- [ ] Default role is `MEMBER` — matches Roles & Permissions Matrix
- [ ] Index on `email` exists

**Rollback Risk:** Low — base table, no dependents yet  
**Data Loss on Rollback:** Yes — all user data  
**Dependencies:** None (base migration)

---

### Migration [002] — [DATE] — Add Profiles Table

**File:** `[YYYYMMDDHHMMSS]_add_profiles_table.sql`  
**Status on Production:** `APPLIED`  
**Applied By:** [Agent Name]  
**Applied At:** [Timestamp]  
**Schema Source:** Core Systems PRD — Profile Object canonical schema

**Description:** Adds user profile data linked to users.

**Up Migration:**
```sql
CREATE TABLE profiles (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    avatar_url   TEXT,
    preferences  JSONB DEFAULT '{}' NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_display_name ON profiles(display_name);
```

**Down Migration (Rollback):**
```sql
DROP TABLE IF EXISTS profiles;
```

**Validation After Apply:**
- [ ] Foreign key constraint to `users.id` exists
- [ ] `ON DELETE CASCADE` propagates correctly — deleting user removes profile
- [ ] `preferences` defaults to `{}`
- [ ] Unique index on `user_id` enforced

**Rollback Risk:** Low  
**Data Loss on Rollback:** Yes — all profile data  
**Dependencies:** Migration 001 (users table)

---

### Migration [003] — [DATE] — Add Sessions Table

**File:** `[YYYYMMDDHHMMSS]_add_sessions_table.sql`  
**Status on Production:** `APPLIED`  
**Applied By:** [Agent Name]  
**Applied At:** [Timestamp]

**Description:** Adds session storage for auth tokens.

**Up Migration:**
```sql
CREATE TABLE sessions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

**Down Migration (Rollback):**
```sql
DROP TABLE IF EXISTS sessions;
```

**Validation After Apply:**
- [ ] Token hash is unique — prevents session collision
- [ ] Expired sessions queryable via index
- [ ] Cascade delete from users works

**Rollback Risk:** Low — sessions are ephemeral  
**Data Loss on Rollback:** Yes — all active sessions invalidated  
**Dependencies:** Migration 001 (users table)

---

### Migration [00N] — [DATE] — [Description]

*Repeat the structure above for every additional migration.*

---

## 5. Pending Migrations

| Migration ID | Description | Created | Expected Apply Date | Blocked By | Rollback Risk | Data Loss? |
|---|---|---|---|---|---|---|
| [005] | [Description] | [Date] | [Date] | None | Low / Med / High | Yes / No |
| [006] | [Description] | [Date] | [Date] | Migration [005] | [Level] | [Yes/No] |

### Migration [005] — [DATE] — [Description] `PENDING`

**File:** `[filename].sql`  
**Status:** PENDING  
**Schema Source:** [Core Systems PRD section]

**Up Migration:**
```sql
-- SQL here
```

**Down Migration (Rollback):**
```sql
-- SQL here
-- OR: N/A — destructive. Cannot rollback safely.
-- Data restoration requires backup from [timestamp].
-- Product owner confirmation required before applying.
```

**Validation Plan:**
- [ ] [Validation step 1]
- [ ] [Validation step 2]

**Rollback Risk Assessment:** [Low / Medium / High] — [Reason]  
**Data Loss on Rollback:** [Yes — describe / No]  
**Product Owner Approval Required:** [Yes / No]

---

## 6. Seed Data

### 6.1 Seed Data Philosophy

| Environment | Seed Strategy |
|---|---|
| Development | Full seed — all test users, example content, realistic data volume |
| Staging | Anonymized copy of production + edge case test data |
| Production | Minimal essential seed only — `ON CONFLICT DO NOTHING` always |

### 6.2 Seed File Locations

| Environment | Seed File | Run Command |
|---|---|---|
| Development | `[prisma/seed.dev.ts]` | `npm run seed:dev` |
| Staging | `[prisma/seed.staging.ts]` | `npm run seed:staging` |
| Production | `[prisma/seed.prod.ts]` | `npm run seed:prod` |

### 6.3 Development Seed Users

| Email | Role | Display Name | Notes |
|---|---|---|---|
| `owner@example.com` | OWNER | Owner User | Full access |
| `admin@example.com` | ADMIN | Admin User | Manages users |
| `member@example.com` | MEMBER | Standard Member | Normal user |
| `viewer@example.com` | VIEWER | Viewer User | Read-only |

**Development passwords (dev only):** `password123` (all accounts)  
**Rule:** These credentials must never be used in staging or production environments.

### 6.4 Development Seed Resources

| Resource | Count | Notes |
|---|---|---|
| [Resource name] | [N] | [Description of seed data — e.g., "3 per user, varied states"] |
| [Resource name] | [N] | [Description] |

**Edge Case Seed Data:**

| Edge Case | Data | Purpose |
|---|---|---|
| Empty state | User with zero resources | Test empty screens |
| Maximum length | [N]-character text fields | Test overflow handling |
| Special characters | `'";<script>` in name fields | Test XSS protection |
| Unicode content | `名前 / Ñoño / العربية` in text fields | Test encoding |
| [Edge case] | [Data] | [Purpose] |

**Development Seed Script (reference):**
```sql
INSERT INTO users (id, email, password_hash, role) VALUES
    ('11111111-1111-1111-1111-111111111111',
     'owner@example.com', '[hashed]', 'OWNER'),
    ('22222222-2222-2222-2222-222222222222',
     'admin@example.com', '[hashed]', 'ADMIN'),
    ('33333333-3333-3333-3333-333333333333',
     'member@example.com', '[hashed]', 'MEMBER'),
    ('44444444-4444-4444-4444-444444444444',
     'viewer@example.com', '[hashed]', 'VIEWER');
```

### 6.5 Staging Seed Data

**Source:** Anonymized production data from [DATE] + edge case test data

**Anonymization Rules:**
- Emails replaced with `user_N@staging.example.com`
- Names replaced with `User N`
- All payment information nullified
- All PII fields replaced or hashed
- [Additional rule]

### 6.6 Production Seed Data

**Rule:** Every production seed statement must use `ON CONFLICT DO NOTHING`. No existing data is ever overwritten on re-seed.

| Table | Records | Reason | Immutable? |
|---|---|---|---|
| `users` | 1 (first OWNER) | System requires at least one OWNER | Yes — cannot delete last OWNER |
| `settings` | 1 (default config) | Default system configuration | No — can be updated |
| [table] | [N] | [Reason] | [Yes/No] |

**Production Seed Script (reference — no actual values):**
```sql
-- First OWNER — credentials sourced from environment variables
INSERT INTO users (email, password_hash, role)
VALUES (
    '[FIRST_ADMIN_EMAIL from env]',
    '[HASHED_PASSWORD from env]',
    'OWNER'
)
ON CONFLICT (email) DO NOTHING;
```

**Production Seed Constraints:**
- Never overwrite existing data
- Only insert if record does not exist
- Log all seed operations with timestamp (no content, no credentials)
- Require explicit product owner sign-off before first production seed run

---

## 7. Data Integrity Across Migrations

### 7.1 Migration Dependency Graph

```
[001] users
    ├── [002] profiles       (depends on 001)
    └── [003] sessions       (depends on 001)
              └── [004] [table]  (depends on 003)
```

### 7.2 Breaking Change Protocol

| Change Type | Required Protocol |
|---|---|
| Column rename | Add new column → backfill data → update application → drop old column in separate migration |
| Column type change | Add new column with new type → migrate data → update application → drop old column |
| Table split | Create new table → migrate data → add foreign key → drop old table |
| Table merge | Create new table → migrate data → add constraints → drop old tables |
| Add NOT NULL to existing column | Backfill all NULLs first → add constraint in separate migration |
| Add `tenant_id` to existing table | Add nullable → backfill all rows with correct tenant → add NOT NULL in separate migration |

### 7.3 Backfill Requirements

| Migration | Backfill Required | Backfill Query |
|---|---|---|
| [004] | Yes | `UPDATE [table] SET new_col = old_col WHERE new_col IS NULL;` |
| [005] | No | — |

---

## 8. Rollback Procedures

### 8.1 Rollback Registry

| Migration | Can Rollback | Rollback Command | Data Loss | Product Owner Approval |
|---|---|---|---|---|
| 001 | Yes | `DROP TABLE users` | Yes — all user data | Required |
| 002 | Yes | `DROP TABLE profiles` | Yes — all profile data | Required |
| 003 | Yes | `DROP TABLE sessions` | Yes — all sessions | Not required |
| [X] | [Yes/No] | [Command] | [Yes/No — describe] | [Required/Not required] |

### 8.2 Emergency Rollback Procedure

1. Run down migration for the problematic migration only
2. Verify application functions without the migration
3. Identify root cause
4. Create corrected migration
5. Test corrected migration in staging
6. Re-apply during maintenance window
7. Log the incident and resolution in Changelog & Decision Log

**Emergency rollback command:**
```bash
[Tool-specific rollback command]
# e.g.: prisma migrate resolve --rolled-back [migration_name]
```

---

## 9. Migration Testing Requirements

| Test | Environment | Pass Condition |
|---|---|---|
| Up migration applies cleanly | Development | No errors; all constraints created |
| Down migration reverts cleanly | Development | Table/index removed; no orphaned objects |
| Idempotency — run twice | Development | Second run produces no errors or duplicates |
| Up migration on copy of production data | Staging | Completes within [N] seconds; no data loss |
| Rollback and re-apply | Staging | Second apply succeeds; data intact |
| Tenant isolation (if multi-tenant) | Staging | Cross-tenant queries return 0 rows |
| Cascade delete propagation | Development | Deleting user removes all child records |
| Backfill completeness (if applicable) | Development | Zero NULL values remain in backfilled columns |

---

## 10. Acceptance Criteria

- [ ] Every migration has an up and down script, or rollback risk is explicitly documented with product owner approval
- [ ] All migrations are idempotent unless explicitly noted with documented justification
- [ ] Every migration entry in this document matches an actual migration file in the repository
- [ ] All column definitions match Core Systems PRD canonical object schemas exactly
- [ ] Development seed creates a fully usable local environment with data for every role
- [ ] Production seed uses `ON CONFLICT DO NOTHING` on every insert statement
- [ ] Production seed contains only records specified in Section 6.6
- [ ] Migration dependency graph is acyclic
- [ ] Breaking changes follow the protocol in Section 7.2
- [ ] All user-data tables include `tenant_id` if multi-tenant architecture selected
- [ ] All transactional boundaries documented for dual-write operations
- [ ] All migrations tested per Section 9 before production apply
- [ ] No actual credential values present in any seed script or this document

---

**END OF MIGRATIONS & SEED DATA REFERENCE**