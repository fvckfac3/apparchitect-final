# Governance Layer

**Version:** 1.0
**Status:** Canonical
**Layer:** Governance (`01 - governance/`)
**Last Updated:** 2026-07-06

---

## Purpose

The Governance Layer is the constitutional layer of AppArchitect. It defines the rules of behavior that all other layers, all agents, all prompts, all validations, and all generated artifacts must obey. When a conflict exists between any two layers, Governance wins.

Governance does not execute. Governance defines what execution is permitted to do.

---

## File Index

| # | File | Purpose | Status |
|---|------|---------|--------|
| 01 | `01-master-project-schema.md` | The single source of truth for all project data; the system-wide contract | Canonical |
| 02 | `02-document-dependency-matrix.md` | Maps every document to its upstream and downstream dependencies | Canonical |
| 03 | `03-generation-rules.md` | Rules for how documents are generated from the schema | Canonical |
| 04 | `04-validation-rules.md` | The rule catalog that the Validation Engine executes | Canonical |
| 05 | `05-agent-orchestration-map.md` | How agents collaborate, sequence, and hand off | Canonical |
| 06 | `06-master-generation-pipeline.md` | The 14-stage canonical pipeline that every project traverses | Canonical |
| 07 | `07-project-intake-schema-map.md` | Maps founder inputs to schema sections | Canonical |
| 08 | `08-document-cross-reference-map.md` | Index of every cross-reference in the system | Canonical |
| 09 | `09-document-generation-order.md` | The order in which documents are generated | Canonical |
| 10 | `10-system-glossary.md` | Canonical vocabulary; the authority for all term definitions | Canonical |
| 11 | `11-master-prompt-framework.md` | Standards, structure, and lifecycle for every prompt | Canonical |
| 12 | `12-agent-contract-spec.md` | The mandatory interface every agent must satisfy | Canonical |
| 13 | `13-validation-engine-spec.md` | Architecture, rule registry, and lifecycle of the Validation Engine | Canonical |
| 14 | `14-export-engine-spec.md` | Architecture, package structure, and lifecycle of the Export Engine | Canonical |
| 15 | `15-project-lifecycle-model.md` | The complete lifecycle every project progresses through | Canonical |

---

## Authority Hierarchy

When two artifacts disagree, the higher layer wins.

```
Governance                          ← Constitution (highest authority)
   ↓
Operational Standards               ← Procedural rules implementing governance
   ↓
Prompt Contracts                    ← Execution prompts
   ↓
Schemas                             ← Data contracts
   ↓
Agents                              ← Execution units
   ↓
Workflows                           ← Runnable sequences combining agents + templates
   ↓
Templates                           ← Artifact scaffolds
   ↓
Generated Artifacts                 ← Output (lowest authority)
```

A lower-layer artifact may never override a higher-layer artifact. If a conflict is detected, the higher-layer artifact is authoritative and the lower-layer artifact is regenerated.

---

## What Lives in Governance

Governance contains three categories of document.

### Constitutional Documents (01–10)

The structural foundation: the master schema, dependency relationships, generation rules, validation rules, orchestration, the pipeline itself, intake mapping, cross-references, generation order, and the system glossary. These documents do not change frequently; when they change, the change is a MAJOR event.

### Procedural Documents (11–14)

The procedural foundation: how prompts are structured, how agents are contracted, how validation runs, how export packages are assembled. These documents change with the system's evolution but are versioned carefully; MAJOR bumps require migration plans.

### Lifecycle Documents (15)

The lifecycle model: the states a project passes through, the gates between states, the recovery paths from failure states. This is the bridge between the constitutional layer and the operational layer.

---

## What Does NOT Live in Governance

- **Specific agent implementations.** Those live in `03 - agents/`.
- **Specific prompts.** Those live in `07 - prompt-contracts/`.
- **Specific schemas.** Those live in `02 - schemas/`.
- **Specific standards for how to do work.** Those live in `05 - operational-standards/`.
- **Specific workflow procedures.** Those live in `06 - workflows/`.
- **Specific artifact templates.** Those live in `04 - templates/`.

Governance is the why and the what. The other layers are the how.

---

## Operating Principles

The 10 Operating Principles (`05 - operational-standards/01-operating-principles.md`) are referenced from this layer and bind every other layer. They are not duplicated here; they are the foundation beneath the constitution.

---

## Reading Order

For a new contributor to the system, the recommended reading order is:

1. `01-master-project-schema.md` — what the system is about
2. `10-system-glossary.md` — what the words mean
3. `06-master-generation-pipeline.md` — what the system does end-to-end
4. `05-agent-orchestration-map.md` — who does what
5. `15-project-lifecycle-model.md` — when things happen
6. `11-master-prompt-framework.md` — how prompts are structured
7. `12-agent-contract-spec.md` — what an agent must look like
8. `04-validation-rules.md` — what "done" means
9. `13-validation-engine-spec.md` — how validation is executed
10. `14-export-engine-spec.md` — how the output is delivered

Other governance documents can be read on demand as their content is referenced.

---

## Cross-References

- **Operational Standards:** `05 - operational-standards/` — the procedural layer that implements this constitution
- **Schemas:** `02 - schemas/` — the data contracts referenced by this constitution
- **Agents:** `03 - agents/` — the execution units governed by this constitution
- **Validation:** `08 - validation/` — the immune system that enforces this constitution
- **Prompts:** `07 - prompt-contracts/` — the execution prompts bound by this constitution

---

*Last Updated: 2026-07-06*
*Authority: Canonical*
