# AppArchitect – Database Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Designs and maintains AppArchitect's database schema, migrations, and seed data
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Database Agent |
| **Role** | Model the AppArchitect database and maintain schema migrations |
| **Type** | Data |
| **Operates On** | PostgreSQL schema, migration files, seed scripts, indexes |
| **Triggered By** | Orchestrator phase unlock (after Documentation Agent COMPLETE) |
| **Blocking?** | Yes — blocks Backend Agent (cannot start until schema exists) |

## 2. Mission Statement

The Database Agent designs and maintains the AppArchitect PostgreSQL schema. It produces the migration files, the rollback scripts, and the seed data for development, staging, and production. It enforces that every user-data table has the required columns, that role enums match the Roles & Permissions Matrix exactly, that cascade deletes propagate to all child records, and that the canonical Core Systems data objects in the Core Systems PRD are reflected in migration column definitions exactly.

## 3. Scope

### 3.1 In Scope
- Schema design for: users, projects, interview_sessions, answers, configurations, agents, documents, audit_logs, sessions, webhooks_processed
- Migration files (up + down) for every schema change
- Seed data for dev, staging, and production (minimal for production)
- Index design for query performance
- Constraint design (unique, foreign key, check)
- Cascade delete behavior
- Backfill procedures for non-destructive changes
- Idempotency for all migrations unless explicitly noted

### 3.2 Out of Scope
- Application code (Backend Agent, Frontend Agent)
- API routes
- Auth provider configuration (Auth & Security Agent)
- Choosing the database engine (PostgreSQL is specified in Technical Architecture PRD)
- Query optimization for ad-hoc queries
- Backup procedures (DevOps Agent)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `coreSystemsPRD` | Documentation Agent | Markdown | Yes |
| `rolesMatrix` | Roles & Permissions Matrix | JSON | Yes |
| `dataIntegrationPRD` | Documentation Agent | Markdown | Yes |
| `migrationsReference` | Migrations & Seed Data Reference | Markdown template | Yes |

### 4.2 Input Schemas
```typescript
type CoreDataObject = {
  name: string;                    // e.g., 'User', 'Project', 'InterviewSession'
  fields: Array<{
    name: string;
    type: 'uuid' | 'string' | 'text' | 'boolean' | 'timestamp' | 'jsonb' | 'integer' | 'enum';
    nullable: boolean;
    defaultValue?: string;
    constraints?: string[];        // e.g., ['unique', 'min:8', 'max:255']
    references?: { table: string; column: string; onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' };
  }>;
  indexes: string[];                // column names
  uniqueIndexes: string[][];        // composite unique constraints
}
```

### 4.3 Input Validation Rules
- Every Core Data Object must have an `id` field of type `uuid`
- Every user-data table must have `created_at` and `updated_at` (Timestamps)
- Role enum values must match Roles & Permissions Matrix exactly
- Foreign keys must specify `onDelete` behavior
- No migration may add a column that stores prohibited content per Safety PRD

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| Migration files | `/db/migrations/*.sql` | SQL | Yes |
| Rollback files | `/db/migrations/rollback/*.sql` | SQL | Yes |
| Seed scripts | `/db/seeds/*.ts` | TypeScript | Yes |
| Schema diagram | `/db/schema.dbml` | DBML | Yes |
| Sign-off report | Orchestrator | JSON | Yes |

### 5.2 Output Schemas
**DatabaseSignOff**
```typescript
type DatabaseSignOff = {
  tablesCreated: number;
  migrationsUp: number;
  migrationsDown: number;
  indexesCreated: number;
  constraintsEnforced: number;
  allUserDataTablesHaveTenantId: boolean;
  allRoleEnumsMatchMatrix: boolean;
  allCascadeDeletesVerified: boolean;
  productionSeedMinimalOnly: boolean;
  issues: Array<{ severity: string; description: string }>;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Read Core Systems PRD**
- Extract every canonical data object
- For each, draft column definitions, indexes, constraints
- Map to physical tables

**Step 2: Define Tables (in Dependency Order)**
1. `users` (base — no FK dependencies)
2. `sessions` (FK → users)
3. `projects` (FK → users)
4. `interview_sessions` (FK → projects)
5. `answers` (FK → interview_sessions)
6. `configurations` (FK → projects)
7. `agents` (FK → configurations)
8. `documents` (FK → configurations)
9. `audit_logs` (FK → users)
10. `webhooks_processed` (no FK)

**Step 3: Generate Migration Files**
- One migration file per table or per change
- Each file has up + down scripts
- Each file is idempotent unless explicitly noted
- Naming: `[YYYYMMDDHHMMSS]_[description].sql`

**Step 4: Add Indexes**
- FK columns: always indexed
- Lookup columns (email, slug, session_token_hash): indexed
- Composite indexes for known query patterns

**Step 5: Add Constraints**
- Unique on email, slug, session token
- Check constraints on enums
- NOT NULL on required fields

**Step 6: Cascade Delete Behavior**
- All child records of a user must cascade on user delete
- All child records of a project must cascade on project delete
- All child records of a configuration must cascade on configuration delete
- Verify with integration tests (delegated to QA Agent)

**Step 7: Seed Data**
- **Dev:** Full test data (4 roles, sample projects, sample configurations)
- **Staging:** Anonymized production snapshot + edge cases
- **Production:** Minimal essential (e.g., system config, optional first admin)
- All production seeds use `ON CONFLICT DO NOTHING`

**Step 8: Schema Diagram**
- DBML or Mermaid output
- Updated on every schema change
- Reviewed in PR for any agent that adds a table

**Step 9: Migration Testing**
- Up migration applies cleanly
- Down migration reverts cleanly
- Idempotency: run twice → no errors
- Apply to copy of production data (in staging): completes within SLA, no data loss

**Step 10: Sign-off**
- Emit `DatabaseSignOff`
- Set `handoffReady: true` only if all checks pass

### 6.2 Decision Logic
**Decision: Add new column vs. backfill**

```
IF adding NOT NULL column AND table has existing rows
THEN add nullable → backfill all NULLs → alter to NOT NULL (3 migrations)
ELSE add as part of single migration
```

**Decision: Cascade vs. restrict**

```
IF child record has no independent meaning without parent
THEN ON DELETE CASCADE
ELSE IF child record is meaningful but optional
THEN ON DELETE SET NULL
ELSE ON DELETE RESTRICT
```

### 6.3 Iteration Behavior
- Iterates over: tables in dependency order
- On per-table failure: log, continue, fix in final pass

### 6.4 Concurrency Rules
- May run concurrently with: Content & Design (read-only)
- Must not run concurrently with: another Database Agent
- Locking strategy: per-migration file lock

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| Migration fails midway | Roll back to last known good state |
| Cascade delete deletes more than expected | Verify cascade behavior in staging before production |
| Seed conflicts with existing data | Use `ON CONFLICT DO NOTHING` |
| Index creation on large table is slow | Use `CONCURRENTLY` if supported |
| Production seed accidentally overwrites | Never; always `ON CONFLICT DO NOTHING` |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Core Systems PRD | §3.7 (Data Contracts — canonical objects) |
| Roles & Permissions Matrix | §2.2 (Role enum values) |
| Safety, Privacy & Control PRD | §7 (Data minimization) |
| Technical Architecture PRD | §7 (Database Configuration) |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must run after | Documentation Agent | Core Systems PRD |
| Must run before | Backend Agent | Schema required |
| May run concurrently | Frontend Agent | Independent |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| PostgreSQL | Database engine | Critical |
| Migrations tool (Drizzle/Prisma) | Migration runner | High |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `MIGRATION_APPLY_FAILED` | Migration SQL error | Critical | Roll back, fix |
| `SCHEMA_DRIFT` | Migration column doesn't match Core Systems | Critical | Re-generate, do not apply |
| `ROLE_ENUM_MISMATCH` | DB enum value not in matrix | Critical | Fix enum, regenerate |
| `CASCADE_DELETE_TEST_FAILED` | Cascade didn't propagate as expected | High | Fix FK, retest |
| `PRODUCTION_SEED_TOO_LARGE` | Production seed has non-essential data | High | Reduce to minimal |

## 10. Logging & Observability
- Log every migration apply (event `MIGRATION_APPLIED`) with file name, timestamp, duration
- Log every seed run (event `SEED_RUN`) with environment and record counts
- Never log: user PII, password hashes, raw session tokens

## 11. Acceptance Criteria
- [ ] All canonical Core Systems objects have matching DB tables
- [ ] All migrations have up + down scripts
- [ ] All migrations are idempotent unless explicitly noted
- [ ] All user-data tables have `created_at` and `updated_at`
- [ ] All role enum values match Roles & Permissions Matrix
- [ ] Cascade delete propagates correctly (verified in tests)
- [ ] Production seed is minimal essential only
- [ ] Schema diagram updated
- [ ] DatabaseSignOff all PASS

## 12. Test Cases
- 12.1 Happy: all 10 tables created, all indexes, all constraints, all cascades verified.
- 12.2 Error: applying migration twice → idempotent, no error.
- 12.3 Edge: deleting a user with 1,000 projects → all child records removed.

---

**END OF DATABASE AGENT PRD**