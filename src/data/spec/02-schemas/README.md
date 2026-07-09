# JSON Schema Library

**Layer:** Schemas (`02 - schemas/`)
**Status:** Canonical
**Authority:** Subordinate to `01 - governance/`, parallel to `03 - agents/`, `05 - operational-standards/`.
**Spec version:** 2.0
**JSON Schema spec:** https://json-schema.org/draft/2020-12/schema

## Purpose

This directory contains the 10 canonical JSON Schema contracts that define the shape, type, and validation rules for every structured artifact AppArchitect produces, exchanges, or persists. These schemas are the **type system** of the platform — every PRD, feature, screen, persona, integration, and validation result is validated against the corresponding contract before it advances.

When an agent, validator, or export routine encounters data, that data is **schema-checked first**, content-checked second. A document that fails schema validation cannot enter the pipeline.

## Contract Pattern

Every schema in this directory follows the same three-part top-level structure:

```json
{
  "metadata":   { ...artifact identity, version, owner, timestamps... },
  "references": { ...links to source documents, upstream schemas, governance anchors... },
  "content":    { ...domain-specific payload: the actual project/agent/feature data... }
}
```

This is not stylistic preference — it is enforced. Every validator in `08 - validation/` checks for the `metadata + references + content` shape before running domain rules. Schemas that omit any of the three are rejected at registration.

## File Index

| \# | File | Domain | Top-Level Properties | Defs | Source Owner |
| --- | --- | --- | --- | --- | --- |
| 1 | `01-project-schema.json` | Project (root) | 3 | 25 | Strategist + Orchestrator |
| 2 | `02-architecture-object.json` | System architecture | 3 | 17 | Architect |
| 3 | `03-feature.json` | Product feature | 3 | 15 | Product Agent |
| 4 | `04-workflow.json` | Operational workflow | 3 | 17 | Workflow Agent |
| 5 | `05-screen.json` | UI screen | 3 | 17 | UX Designer |
| 6 | `06-persona.json` | User persona | 3 | 15 | Strategist |
| 7 | `07-integration.json` | Third-party integration | 3 | 13 | Integrations Agent |
| 8 | `08-ai-feature.json` | AI feature | 3 | 12 | AI Feature Agent |
| 9 | `09-validation-result.json` | Validator output | 3 | 8 | Validation Engine |
| 10 | `10-export-manifest.json` | Export package manifest | 3 | 10 | Export Engine |

**Totals:** 10 schemas, 30 top-level properties (3 per schema), 161 $defs entries.

## Validation Order

A schema is loaded and applied in this order:

1. **JSON syntax check** — `python3 -c "import json; json.load(open(file))"` or equivalent.
2. `$schema` compliance — the schema itself must validate against draft 2020-12 metaschema.
3. `$id` resolution — internal `$ref` pointers must resolve within the same file (no cross-file refs in v1).
4. **Artifact validation** — the document being validated is checked against the schema.
5. **Domain validation** — domain-specific rules in `08 - validation/` run after schema check passes.

If any step fails, the artifact is rejected. Schemas are intentionally strict; loose validation produces loose artifacts.

## Cross-References

- **Constitutional source:** `01 - governance/01-master-project-schema.md`
- **Intake mapping:** `01 - governance/07-project-intake-schema-map.md`
- **Validation engine:** `01 - governance/13-validation-engine-spec.md`
- **Schema validator:** `08 - validation/02-schema-validator.md`
- **Export manifest:** `file 10-export-manifest.json` (references all other schemas in its `included_artifacts` array)

## Governance Rules

1. **No schema mutation in flight.** Schemas are versioned. A document validating against v1 must still validate against v1 forever, or a new v2 must be published.
2. **Required fields are required.** A field listed under `required` cannot be omitted. Use `null` only when the schema explicitly permits it.
3. `$ref` **locality.** All `$ref` pointers must point within the same file. Cross-file references are not allowed in v1.
4. **Def naming.** All `$defs` entries use `camelCase` keys. The convention is `nounDescriptor` (e.g., `artifactMetadata`, `referenceModel`, `userPersona`).
5. **Description required.** Every property must have a `description` field explaining what it is and why it exists.

## Versioning

Schemas follow SemVer:

- **MAJOR** — breaking change (removing/renaming a required field, changing a type).
- **MINOR** — additive (new optional field, new `$def`).
- **PATCH** — documentation fix, no behavioral change.

A MAJOR bump requires a migration path documented in `06 - workflows/architecture/integration-spec.md` or equivalent.

---

*Last Updated: 2026-07-05*
*Authority: Canonical*