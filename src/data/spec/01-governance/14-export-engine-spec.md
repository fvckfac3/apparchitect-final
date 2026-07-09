# Export Engine Specification

**Version:** 1.0
**Status:** Canonical
**Layer:** Governance
**Position:** 14 of 15
**Depends On:** `01-master-project-schema.md`, `12-agent-contract-spec.md`, `13-validation-engine-spec.md`
**Implements:** Operating Principles #2 (Single Source of Truth), #7 (Artifact Traceability), #10 (Human Authority)
**Owner:** AppArchitect Core Team
**Last Updated:** 2026-07-06

---

## Purpose

The Export Engine is the final stage of the AppArchitect pipeline. Its singular responsibility is to **transform a fully validated project into a build-ready, consumable handoff package** and to deliver it to downstream development systems. The Export Engine does not generate new content, does not edit existing artifacts, and does not bypass validation. It packages, validates the package, and emits a deliverable.

Generation is not complete until outputs are consumable. A validated set of artifacts sitting in the workspace is not a deliverable; a handoff package with a manifest, a checksum, and a known provenance is. This specification defines how the Export Engine bridges the gap.

The Export Engine is the **only** component authorized to produce an export. Agents, orchestrators, and human operators cannot produce an export by direct action; they must invoke the Export Engine. This constraint is what guarantees that every export carries the full audit trail, the validation guarantees, and the manifest that downstream systems depend on.

---

## Scope

**Applies to:**

- The assembly of the final handoff package
- The generation of the export manifest
- The validation of the export package
- The delivery of the package to the configured destination
- The post-delivery audit trail entry

**Out of scope:**

- The generation of any individual artifact (this is the agents' job)
- The validation of individual artifacts (this is the Validation Engine's job)
- The deployment of the package to production (this is the downstream build system's job)

---

## Export Philosophy

The Export Engine operates under five non-negotiable principles:

1. **Generation is not delivery.** A completed generation pipeline that has not exported is not a delivered project.
2. **The manifest is authoritative.** If an artifact is not in the manifest, it does not exist for downstream consumers, regardless of whether the file is on disk.
3. **Validation is a precondition.** No export proceeds without a passing `07-production-readiness-validator.md` verdict.
4. **Reversibility is classified.** Every export action is classified as reversible or irreversible; irreversible exports require explicit human authorization.
5. **Auditability is total.** Every export produces a complete audit trail: what was included, what was excluded, what validation passed, who approved, when, and from which orchestrator trace.

These principles outrank convenience. A "quick export" that skips manifest validation is a contract violation.

---

## Export Inputs

The Export Engine accepts exactly four inputs. Any other input is a contract violation.

```typescript
type ExportInputs = {
  project_schema: {
    path: string;                     // Path to the validated project schema
    schema_version: string;           // SemVer
    content_hash: string;             // SHA-256
    validation_result_id: string;     // ValidationResult from Stage 2 (Schema)
  };
  architecture_object: {
    path: string;                     // Path to the validated architecture object
    schema_version: string;
    content_hash: string;
    validation_result_id: string;     // ValidationResult from Stage 6 (Architecture)
  };
  documentation_suite: {
    root_path: string;                // Path to the documentation directory
    manifest_path: string;            // Path to the docs manifest
    artifact_count: number;
    content_hashes: Record<string, string>;  // path → SHA-256
    validation_result_id: string;     // ValidationResult from Stage 9 (Documentation)
  };
  validation_reports: {
    prd_validation: string;           // ValidationResult ID
    schema_validation: string;
    cross_doc_validation: string;
    consistency_validation: string;
    completeness_validation: string;
    dependency_validation: string;
    production_readiness_validation: string;  // Must be GO or CONDITIONAL_GO
  };
};
```

All four inputs must be present and all must have valid `validation_result_id` references that resolve to PASS or PASS_WITH_WARNINGS verdicts. The `production_readiness_validation` is the gate: GO is required for a clean export, CONDITIONAL_GO is allowed with explicit human sign-off, NO_GO blocks the export entirely.

---

## Export Outputs

The Export Engine produces exactly three outputs.

```typescript
type ExportOutputs = {
  export_package: {
    path: string;                     // Local filesystem path to the package
    size_bytes: number;
    artifact_count: number;
    content_hash: string;             // SHA-256 of the entire package
    format: 'ZIP' | 'TAR_GZ' | 'DIRECTORY';
  };
  handoff_bundle: {
    path: string;                     // Path to the human-readable handoff document
    primary_recipient: string;        // e.g., "Engineering Team", "AI Build Agent"
    consumption_instructions: string; // Plain-language how-to-consume
  };
  manifest: {
    path: string;                     // Path to manifest.yaml
    manifest_id: string;              // UUID v4
    schema_version: string;           // SemVer of the manifest schema
    content_hash: string;             // SHA-256 of the manifest file
  };
};
```

The export is considered successful only when all three outputs are produced and persisted. A partial export is a failure.

---

## Export Package Structure

The handoff package has a canonical structure. Downstream consumers depend on this structure; deviating from it requires a MAJOR version bump of the manifest schema.

```
<project_name>-<project_version>-handoff/
├── manifest.yaml                     # Required: package manifest
├── README.md                         # Required: handoff instructions
├── CHANGELOG.md                      # Required: project change log
├── schema/
│   ├── project-schema.json           # The Master Project Schema
│   └── architecture-object.json      # The Architecture Object
├── architecture/
│   ├── system-diagram.png|svg|d2     # Visual topology
│   ├── data-model.sql|prisma         # Generated schema
│   ├── api-contract.openapi.yaml     # OpenAPI 3.0 spec
│   ├── infra-spec.tf|pulumi|bicep    # Infrastructure-as-code
│   ├── security-model.md             # Security architecture
│   └── integration-map.md            # Third-party integrations
├── workflows/
│   └── *.md                          # Workflow documents
├── screens/
│   └── *.md|figma                    # Screen specifications
├── documentation/
│   ├── prd/                          # Product Requirements Documents
│   ├── tech-spec/                    # Technical specifications
│   ├── ux/                           # UX specifications
│   ├── content/                      # Content and copy
│   └── api/                          # API documentation
├── validation/
│   └── reports/                      # All ValidationResult JSON files
│       ├── 01-prd-validation-*.json
│       ├── 02-schema-validation-*.json
│       ├── 03-cross-document-*.json
│       ├── 04-consistency-*.json
│       ├── 05-completeness-*.json
│       ├── 06-dependency-*.json
│       └── 07-production-readiness-*.json
├── agents/
│   └── contracts/                    # Agent contracts used
├── decisions/
│   └── decision-log.yaml             # Architectural and product decisions
├── exports/
│   └── source/                       # Original generation inputs (for audit)
└── .apparchitect/
    ├── pipeline-trace.json           # End-to-end pipeline trace
    ├── agent-dispatch-log.jsonl      # Per-agent dispatch log
    └── export-audit.json             # This export's audit record
```

The `.apparchitect/` directory is reserved for AppArchitect-generated metadata. Downstream build systems should not modify it; it is the audit trail.

---

## Manifest Schema

The manifest is the contract between AppArchitect and the downstream consumer. The schema is defined in `02 - schemas/10-export-manifest.json`. The key fields are:

```yaml
manifest_version: "1.0"               # SemVer of the manifest schema
manifest_id: "uuid-v4"                 # Unique per export
project_id: "string"                   # Project identifier
project_name: "string"
project_version: "semver"              # The version being exported
generated_at: "iso-8601"               # When the export was generated
generated_by: "string"                 # Engine version + trace_id
exported_by: "string"                  # User or CI job that triggered
pipeline_trace_id: "uuid-v4"           # End-to-end trace correlation

validation:
  overall_status: "GO|CONDITIONAL_GO|NO_GO"  # From production_readiness
  readiness_score: "number"             # 0–100
  production_readiness_result_id: "uuid"
  all_validators_passed: "boolean"
  findings_summary:
    critical: "number"
    error: "number"
    warning: "number"
    info: "number"

included_artifacts:                    # Every file in the package
  - path: "string"                     # Relative to package root
    type: "schema|architecture|workflow|document|validation|metadata"
    content_hash: "sha256"
    size_bytes: "number"
    generated_by: "agent_id"
    generated_at: "iso-8601"
    schema_ref: "string"               # Which schema validates this

build_target:
  recommended_stack: "string"          # e.g., "nextjs+supabase"
  framework_version: "string"
  language: "string"
  deployment_target: "string"          # e.g., "vercel", "aws-amplify"

dependencies:
  external_services:
    - service: "string"
      auth_method: "string"
      credential_storage: "string"     # e.g., "supabase-vault"
      required_env_vars: "string[]"
  internal_services:
    - "string"

reversibility:
  classification: "REVERSIBLE|PARTIALLY_REVERSIBLE|IRREVERSIBLE"
  rollback_plan: "string"              # Path to rollback document or inline description
  data_migration_required: "boolean"

human_approvals:
  - approver: "string"
    role: "string"
    approved_at: "iso-8601"
    scope: "string"                    # What was approved

audit:
  app_version: "semver"                # AppArchitect version
  engine_versions: "Record<agent, semver>"
  rule_set_version: "semver"
  schema_versions: "Record<schema, semver>"
```

The manifest is itself a first-class artifact of the export. It is signed (content hash), versioned, and treated as authoritative for "what is in this package."

---

## Export Formats

The Export Engine produces packages in three formats, chosen by the `format` field in the assignment envelope.

| Format | Extension | Use Case | Validation |
|--------|-----------|----------|------------|
| ZIP | `.zip` | Most common; cross-platform | ZIP CRC + manifest content hash |
| TAR_GZ | `.tar.gz` | Unix-native; preserves Unix permissions | SHA-256 of tarball + manifest content hash |
| DIRECTORY | (directory) | Live development handoff; no archiving | Manifest content hash + directory walk checksum |

The default format is ZIP. The DIRECTORY format is used only when the consumer is a live development environment that can read files in place; it is not used for delivery to an external system.

The package is always accompanied by:

- A standalone `manifest.yaml` file (not inside the archive)
- A standalone `README.md` with consumption instructions
- A `CHANGELOG.md` describing what changed since the last export (if any)

---

## Export Validation

The Export Engine runs a final validation pass on the package itself before declaring success. This is distinct from the per-artifact validation that happened earlier in the pipeline; this pass checks the **package as a whole**.

### Package Validation Checklist

| Check | Severity | Description |
|-------|----------|-------------|
| All `included_artifacts` actually exist on disk | CRITICAL | No phantom references |
| Every artifact's `content_hash` matches the file content | CRITICAL | No tampering |
| Manifest schema is valid against `10-export-manifest.json` | CRITICAL | Manifest is parseable |
| All `validation.<X>_result_id` references resolve to existing ValidationResult files | CRITICAL | No dangling references |
| `production_readiness.overall_status` is GO or CONDITIONAL_GO | CRITICAL (NO_GO blocks) | Gate is passed |
| If CONDITIONAL_GO, `human_approvals` contains at least one entry | ERROR | Conditional requires human sign-off |
| All required top-level directories exist | ERROR | Package structure is canonical |
| `pipeline_trace_id` is present and well-formed | WARNING | Trace is traceable |
| Package size is within configured limits | WARNING | Reasonable size |
| `.apparchitect/` audit directory is included | WARNING | Auditability |

A CRITICAL failure on any check aborts the export and returns a `EXPORT_FAILED` envelope. The orchestrator is responsible for re-dispatching with corrected inputs.

### Validation Result

The export validation produces a `PackageValidationResult` that is included in the package under `validation/exports/` and referenced in the manifest. It follows the same `ValidationResult` schema as artifact-level validation.

---

## Handoff Bundle

The handoff bundle is the human-readable counterpart to the export package. It is the document a human developer (or an AI build agent) reads first to understand what they have received and how to use it.

### Required Sections

1. **Project Summary** — one-paragraph product description
2. **What's in This Package** — directory tree with annotations
3. **How to Get Started** — step-by-step consumption instructions
4. **Architectural Highlights** — top 5 architectural decisions and why
5. **Open Questions** — anything that needs human follow-up
6. **Known Limitations** — what the system does not yet handle
7. **Validation Summary** — readiness score, finding counts, gate decision
8. **Approval Trail** — who approved, when, and what was approved
9. **Support / Contact** — who to ask questions

The handoff bundle is generated from the same project state as the export package, with templated text drawn from `04 - templates/`. It is never generated separately; any drift between the handoff bundle and the package is a CRITICAL finding.

---

## Export Triggers

The Export Engine is invoked in three scenarios:

1. **Full export** — the full project has passed the production-readiness gate. The entire project state is exported.
2. **Incremental export** — a feature or fix has been added to a previously exported project. Only the changed artifacts and their transitive dependents are exported. The manifest's `incremental` field is set to true and references the prior export's `manifest_id`.
3. **Regeneration export** — the project schema was updated and a regeneration pipeline ran. The export reflects the regenerated artifacts, with the changelog clearly marking what was regenerated and why.

In all three cases, the export follows the same pipeline: validate inputs → assemble package → validate package → write manifest → emit handoff bundle.

---

## Delivery

The Export Engine delivers the package to the configured destination. Three destinations are supported:

| Destination | Use Case | Authentication |
|-------------|----------|----------------|
| `local_filesystem` | Default; package written to `/exports/` in the workspace | N/A |
| `object_store` | S3, GCS, Azure Blob; for cross-system handoff | IAM role or service account |
| `api_endpoint` | Direct POST to a downstream build system API | Bearer token, mTLS, or signed URL |

The destination is configured per-project in the project settings. A misconfigured destination blocks the export and returns a `DELIVERY_FAILED` envelope; the package is preserved on local storage and the orchestrator alerts the operator.

Delivery is considered successful only when the destination returns a 2xx response (or, for local filesystem, when the file is durably written and the manifest checksum matches). Anything else is a delivery failure.

---

## Audit Trail

Every export produces an `export-audit.json` file in `.apparchitect/`. The audit record contains:

```json
{
  "export_id": "uuid-v4",
  "manifest_id": "uuid-v4",
  "pipeline_trace_id": "uuid-v4",
  "exported_at": "iso-8601",
  "exported_by": "user_or_ci_identifier",
  "export_trigger": "full|incremental|regeneration",
  "package": {
    "path": "string",
    "content_hash": "sha256",
    "artifact_count": "number",
    "size_bytes": "number"
  },
  "validation": {
    "production_readiness_result_id": "uuid",
    "package_validation_result_id": "uuid",
    "overall_status": "GO|CONDITIONAL_GO|NO_GO",
    "readiness_score": "number"
  },
  "human_approvals": [
    {
      "approver": "string",
      "role": "string",
      "approved_at": "iso-8601",
      "scope": "string"
    }
  ],
  "reversibility_classification": "REVERSIBLE|PARTIALLY_REVERSIBLE|IRREVERSIBLE",
  "delivery": {
    "destination": "string",
    "delivery_status": "SUCCESS|FAILED",
    "delivery_timestamp": "iso-8601"
  }
}
```

This audit record is append-only. It is never edited or deleted. It is the source of truth for "what was exported, when, by whom, and with what approval."

---

## Failure Mode Catalog

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Missing input | Input validator | BLOCKED; orchestrator re-dispatches with all four inputs |
| Production-readiness NO_GO | Gate check | BLOCKED; orchestrator must run remediation and re-validate |
| Manifest schema invalid | Manifest validator | BLOCKED; regenerate manifest from inputs |
| Artifact content_hash mismatch | Package validator | CRITICAL; halt export; alert operator; investigate |
| Destination unreachable | Delivery handler | FAILED; preserve package locally; orchestrator alerts |
| Disk full | Filesystem check | FAILED; orchestrator retries after operator intervention |
| Concurrent export of same project | Idempotency check | BLOCKED; one export per project at a time |
| Package exceeds size limit | Size check | FAILED; split into incremental export |

---

## Performance and Throughput

| Metric | Target | Maximum |
|--------|--------|---------|
| Time to assemble a typical project package | <30 seconds | 5 minutes |
| Package size for a typical project | <100 MB | 1 GB |
| Time to write manifest | <2 seconds | 30 seconds |
| Time to validate package | <10 seconds | 1 minute |

Exports that exceed the maximum are flagged for refactoring. A project that consistently produces packages over the size limit is a signal to enable incremental exports.

---

## Cross-References

- **Master Project Schema:** `01 - governance/01-master-project-schema.md`
- **Agent Contract Spec:** `01 - governance/12-agent-contract-spec.md`
- **Validation Engine Spec:** `01 - governance/13-validation-engine-spec.md`
- **Lifecycle Model:** `01 - governance/15-project-lifecycle-model.md`
- **Manifest schema:** `02 - schemas/10-export-manifest.json`
- **Validation Standard:** `05 - operational-standards/04-validation-standard.md`
- **Release Standard:** `05 - operational-standards/12-release-standard.md`
- **Failure Recovery Standard:** `05 - operational-standards/10-failure-recovery-standard.md`
- **Export Agent Prompt:** `07 - prompt-contracts/08-export-agent-prompt.md`
- **Master Orchestrator Prompt:** `07 - prompt-contracts/01-master-orchestrator-prompt.md`
- **Production-Readiness Validator:** `08 - validation/07-production-readiness-validator.md`

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2026-07-06 | Initial canonical spec defining export pipeline, package structure, manifest schema, delivery model, and audit trail | AppArchitect Core Team |

---

*End of governance/14-export-engine-spec.md*

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2026-07-06 | Initial canonical spec defining export pipeline (8 stages), package structure, manifest schema, delivery model

---

## Change Log

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2026-07-06 | Initial canonical spec defining export pipeline (8 stages), package structure, manifest schema, delivery model, audit trail, and failure mode catalog | AppArchitect Core Team |

---

*End of governance/14-export-engine-spec.md*
