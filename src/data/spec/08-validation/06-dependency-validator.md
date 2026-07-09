# AppArchitect Dependency Validator
**Version:** 1.0
**Status:** Canonical
**Layer:** Validation Framework (Domain Validator)
**Parent engine:** `governance/13-validation-engine-spec.md`
**Rule catalog:** `governance/04-validation-rules.md` (Category 5: Architecture Validation — Dependency aspects)
**Standard:** `operational-standards/04-validation-standard.md` (Stage 7 — Dependency Integrity Validation)
**Pipeline position:** Runs in parallel with Completeness Validation (Stage 12), before Export Validation (Stage 12) in master pipeline
**Consumes:** All generated documents, the Master Project Schema, the Architecture Object, the API Contract, the Database Schema, the Infrastructure Specification
**Produces:** `output/validation-reports/06-dependency-validation-{project_id}-{timestamp}.json`

Purpose
The Dependency Validator detects dependency cycles, dangling dependencies, version conflicts, missing transitive dependencies, and dependency-ordering violations.
The Cross-Document Validator catches reference-level issues. The Consistency Validator catches semantic issues. The Dependency Validator catches structural dependency issues — the kind that would break a build or cause runtime crashes.
Examples of dependency failures:
- Service A imports from Service B, Service B imports from Service A (circular dependency)
- API endpoint expects database table that doesn't exist
- Frontend component imports backend library (layering violation)
- Infrastructure spec references a service that's not in the architecture
- Database migration depends on a future migration
- Agent invocation graph has a cycle that would deadlock the orchestrator
The validator operates at three levels:
1. Internal dependencies (within the architecture)
2. External dependencies (third-party packages and services)
3. Pipeline dependencies (agent invocation order)

Scope
Applies to:
- Service-to-service dependencies
- Service-to-database dependencies
- Service-to-integration dependencies
- Component-to-component dependencies (UI)
- Database entity-to-entity dependencies
- API endpoint-to-database dependencies
- Migration-to-migration dependencies
- Agent-to-agent dependencies
- External library dependencies and version constraints
- Build-time vs runtime dependency separation

Out of scope:
- Semantic correctness (handled by 04-consistency-validator.md)
- Reference resolution (handled by 03-cross-document-validator.md)
- Schema correctness (handled by 02-schema-validator.md)

Validation Principles
The Dependency Validator operates on six principles:
1. No circular dependencies in service graph, import graph, or agent invocation graph.
2. Every dependency target must exist.
3. Every dependency must be declared at the correct layer (frontend does not import backend logic).
4. Every external dependency must have a declared version constraint.
5. Dependency order must be deterministic (topological order must exist).
6. Critical-path dependencies must be flagged for the build engineer.

Dependency Categories

Category 1: Service Dependency Graph
Services in the architecture form a directed graph.
Edges:
- A -> B means A depends on B (A calls B, A imports from B, A reads B's data)

Validation:
- Build the full service dependency graph
- Detect cycles via Tarjan's strongly connected components or DFS
- Each cycle = CRITICAL
- Self-loop (A -> A) = CRITICAL
- Transitive dependencies resolved

Example cycle:
```
auth-service -> user-service -> auth-service
Result: CRITICAL - Circular service dependency
Remediation: Extract shared dependency into a new service, or use event-driven decoupling
```

Category 2: Database Dependency Graph
Database entities form a directed graph via foreign keys and joins.
Edges:
- A -> B means A has foreign key to B, or A frequently joins B

Validation:
- Build entity dependency graph
- Detect cycles (cyclic foreign keys are problematic but sometimes intentional; flagged WARNING)
- Detect orphan foreign keys (FK to non-existent table) = CRITICAL
- Detect cross-schema dependencies (FK from one schema to another) = WARNING

Example:
```
orders.user_id -> users.id (exists)
order_items.order_id -> orders.id (exists)
audit_log.entity_id -> non_existent_table.id
Result: CRITICAL - Orphan foreign key
Remediation: Define non_existent_table or remove audit_log.entity_id
```

Category 3: API-to-Database Dependency
Every API endpoint that reads/writes data must reference a real database entity.
Validation:
- Parse API contract
- For each endpoint, extract referenced entities (from request/response schemas)
- Verify each entity exists in database schema
- Orphan reference = CRITICAL

Example:
```
API: GET /api/users/:id/preferences
Response schema references: user_preferences
Database: user_preferences table missing
Result: CRITICAL - API references missing table
Remediation: Add user_preferences table or remove from API response
```

Category 4: Frontend-Backend Layering
Frontend code must not import backend code or vice versa.
Validation:
- Parse all import statements in frontend code
- Verify no imports from backend module
- Parse all import statements in backend code
- Verify no imports from frontend module
- Violation = CRITICAL

Category 5: External Dependency Version Constraints
Every external dependency in package.json, requirements.txt, go.mod, Cargo.toml, etc. must have a version constraint (not "*" or "latest").
Validation:
- Parse all dependency manifests
- Check each dependency has version constraint
- Unconstrained dependency = WARNING (security risk)
- Conflicting version constraints across files = ERROR

Example:
```
package.json: react: "*"
Result: WARNING - Unconstrained version
Remediation: Pin to a specific version or range (^18.2.0)
```

Category 6: Dependency Freshness
Dependencies should not be deprecated or have known critical CVEs.
Validation:
- Check each dependency against the project's approved dependency list
- Deprecated dependency = WARNING
- Dependency with critical CVE = ERROR
- Out-of-date major version = WARNING

Category 7: Migration Ordering
Database migrations must be applied in dependency order.
Validation:
- Parse all migration files
- Build migration dependency graph
- Detect cycles
- Detect missing predecessors (a migration references a table not yet created)
- Migration referencing future migration = CRITICAL

Example:
```
Migration 0005 references: table created in 0010
Result: CRITICAL - Migration references future table
Remediation: Reorder migrations or split into intermediate steps
```

Category 8: Agent Invocation Graph
Agent invocations must form a directed acyclic graph (DAG).
Validation:
- Parse agent invocation patterns from generated documents
- Build invocation graph
- Detect cycles (would deadlock orchestrator)
- Detect unreachable agents
- Cycle = CRITICAL

Category 9: Build Dependency Graph
The build system must declare all dependencies correctly.
Validation:
- Parse build configuration (Makefile, package.json scripts, CI config)
- Verify each build step declares its dependencies
- Detect circular build dependencies
- Detect missing build dependencies (a step uses output of a step it doesn't depend on)
- Violation = ERROR

Category 10: Runtime Dependency Resolution
All runtime dependencies must be resolvable at install time.
Validation:
- For each declared dependency, attempt resolution
- Unresolvable = CRITICAL (build will fail)
- Version conflict = ERROR

Validation Rules (16 Rules)

DPV-001: Service Dependency Cycle
Severity: CRITICAL
Tarjan's SCC detection on service graph. Any cycle of size >= 2 is CRITICAL.

DPV-002: Service Self-Dependency
Severity: CRITICAL
Service depending on itself.

DPV-003: Orphan Foreign Key
Severity: CRITICAL
Database foreign key to non-existent table.

DPV-004: Cyclic Foreign Key
Severity: WARNING
Database entity references another which references the first (sometimes intentional, e.g., employee.manager_id -> employees.id).

DPV-005: API References Missing Table
Severity: CRITICAL

DPV-006: API References Missing Column
Severity: ERROR

DPV-007: Frontend-Backend Layering Violation
Severity: CRITICAL

DPV-008: Unconstrained Dependency Version
Severity: WARNING

DPV-009: Conflicting Version Constraints
Severity: ERROR
Two files declare different versions of the same dependency.

DPV-010: Deprecated Dependency
Severity: WARNING

DPV-011: Dependency With Critical CVE
Severity: ERROR (CRITICAL if actively exploited)

DPV-012: Migration References Future Table
Severity: CRITICAL

DPV-013: Migration Cycle
Severity: CRITICAL

DPV-014: Agent Invocation Cycle
Severity: CRITICAL

DPV-015: Build Step Missing Dependency Declaration
Severity: ERROR

DPV-016: Unresolvable Runtime Dependency
Severity: CRITICAL

Validation Result Schema
```
{
  "validator": "dependency-validator",
  "version": "1.0",
  "run_id": "uuid",
  "timestamp": "ISO-8601",
  "project_id": "string",
  "status": "PASS|PASS_WITH_WARNINGS|FAIL|CRITICAL",
  "summary": {
    "service_count": 12,
    "service_dependencies": 24,
    "service_cycles_detected": 0,
    "database_entities": 38,
    "database_relationships": 56,
    "orphan_foreign_keys": 0,
    "api_endpoints": 64,
    "api_table_references": 48,
    "missing_table_references": 0,
    "external_dependencies": 87,
    "version_constrained": 84,
    "unconstrained": 3,
    "deprecated": 2,
    "critical_cves": 0,
    "migrations": 22,
    "migration_cycles": 0,
    "agent_invocations": 18,
    "agent_cycles": 0
  },
  "service_graph": {
    "nodes": ["auth-service", "user-service", "payment-service", ...],
    "edges": [
      {"from": "auth-service", "to": "user-service", "type": "sync_call"},
      {"from": "payment-service", "to": "user-service", "type": "sync_call"}
    ],
    "cycles": [],
    "topological_order": ["user-service", "auth-service", "payment-service", ...],
    "critical_path": ["user-service", "auth-service", "payment-service"]
  },
  "cycles_detected": [],
  "orphan_dependencies": [],
  "layering_violations": [],
  "version_conflicts": [],
  "deprecated_dependencies": [],
  "security_advisories": [],
  "migration_ordering_issues": [],
  "agent_invocation_issues": [],
  "readiness_score": {
    "service_graph_integrity": 100,
    "database_integrity": 100,
    "api_consistency": 100,
    "layering_compliance": 100,
    "external_dependency_health": 95,
    "migration_ordering": 100,
    "agent_graph_integrity": 100,
    "overall": 99
  },
  "build_feasibility": "ready",
  "next_actions": [
    "Pin 3 dependencies to specific versions",
    "Update 2 deprecated dependencies",
    "Re-validate after remediation"
  ]
}
```

Failure Examples

Example 1: Service Cycle
Input:
```
Service A imports: Service B (for user lookup)
Service B imports: Service A (for permissions check)
Result: CRITICAL DPV-001
Remediation: Decouple via event bus or extract shared dependency
```

Example 2: Orphan Foreign Key
Input:
```
Schema: orders.audit_log_id -> audit_log.id
Database: audit_log table missing
Result: CRITICAL DPV-003
Remediation: Create audit_log table or remove FK
```

Example 3: Layering Violation
Input:
```
React component imports: ../../backend/services/auth.js
Result: CRITICAL DPV-007
Remediation: Move auth logic to shared package or expose via API only
```

Example 4: Unconstrained Dependency
Input:
```
package.json: lodash: "*"
Result: WARNING DPV-008
Remediation: Pin to ^4.17.21
```

Example 5: Migration Future Reference
Input:
```
Migration 0005 creates table using: column from migration 0010
Result: CRITICAL DPV-012
Remediation: Reorder migrations so dependencies come first
```

Example 6: Agent Invocation Cycle
Input:
```
Agent A invokes: Agent B for input validation
Agent B invokes: Agent A for context loading
Result: CRITICAL DPV-014
Remediation: Break the cycle by restructuring the invocation pattern
```

Pipeline Integration
The validator is invoked after Consistency Validation (Stage 11), in parallel with Completeness Validation (Stage 12).
Invocation sequence:
1. Consistency Validator (04) completes with PASS
2. Dependency Validator (06) runs in parallel with Completeness Validator (05)
3. Both must PASS for advancement to Export Validation (Stage 13)
4. Service graph, database graph, and agent graph emitted as artifacts for the developer

Performance Characteristics
For typical AppArchitect projects:
- 12 services, 64 APIs, 38 entities, 87 dependencies
- Validation runtime: 5-15 seconds
- Memory footprint: 100-300 MB
- Idempotent
- Parallelizable across categories

Ownership
This validator is owned by:
- Validation Engine (executes rules)
- Dependency Validator Module (rule logic)
- Architecture Agent (provides graph inputs)
- Database Agent (provides schema inputs)
- Master Orchestrator (invocation and remediation routing)

End of File
**Authority:** Dependency Validator is the structural immune system. Catches what would break the build.
**Next file:** `07-validation/07-production-readiness-validator.md`
