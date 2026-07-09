# Workflow Templates

**Layer:** Templates (`04 - templates/`) / Workflows subdirectory
**Owner:** Orchestrator Agent + Workflow Owners
**Version:** 1.0

## Purpose

This directory holds the canonical **executable templates** that each workflow uses to produce its core artifacts. Every workflow in `06 - workflows/` has 3 templates here — one per major artifact class.

Templates here are **process-agnostic** (work for any product/app). The workflow-level tailoring lives in the workflow files themselves.

## Relationship to Other Layers

- **Workflows (**`06 - workflows/`**)** — Define WHEN and WHY templates are used
- **Templates (**`04 - templates/workflows/`**)** — Define WHAT is produced
- **Agents (**`03 - agents/`**)** — Define WHO produces it
- **Governance (**`01 - governance/`**)** — Define the rules that govern production
- **Validation (**`08 - validation/`**)** — Define HOW artifacts are verified

## Workflow → Template Mapping

### Discovery Workflow

| Template | Produces | Lines |
| --- | --- | --- |
|  | Structured intake from founder input | 108 |
|  | Discovery synthesis document | 168 |
|  | Question/answer trail during discovery | 135 |

### Architecture Workflow

| Template | Produces | Lines |
| --- | --- | --- |
|  | System architecture specification | 197 |
|  | Architecture Decision Record (ADR) | 157 |
|  | Third-party integration specification | 161 |

### Implementation Workflow

| Template | Produces | Lines |
| --- | --- | --- |
|  | Build sequence + task breakdown | 163 |
|  | Component-level build specification | 179 |
|  | Test strategy + coverage matrix | 188 |

### Product Workflow

| Template | Produces | Lines |
| --- | --- | --- |
|  | Feature specification document | 179 |
|  | User story + acceptance criteria | 168 |
|  | UX flow + screen-level spec | 199 |

### Business Workflow

| Template | Produces | Lines |
| --- | --- | --- |
|  | Pricing strategy + tier structure | 172 |
|  | Pre-launch readiness checklist | 265 |
|  | 3-5 year financial projections | 262 |

### Launch Workflow

| Template | Produces | Lines |
| --- | --- | --- |
|  | Go-to-market launch plan | 289 |
|  | Ongoing marketing strategy | 291 |
|  | Post-launch evaluation | 247 |

**Total: 18 templates, 3,517 lines**

## Template Conventions

All templates follow the same conventions as the foundation layer:

- **Flat-label section headers** (e.g. `Purpose`, `When to Use`, `Structure`)
- **Tables with field type indicators** (text, textarea, list, enum, date, boolean)
- **Required field markers** (every section declares which fields are mandatory)
- **Validation rules** at the bottom of each template
- **Cross-references** to the workflow that owns them and related templates

## Usage Pattern

```markdown
1. Workflow owner (e.g. Discovery Agent) is activated
2. Agent reads the relevant workflow file (06 - workflows/<workflow>.md)
3. Workflow file references templates here
4. Agent instantiates template with project-specific data
5. Validator (08 - validation/) checks the output
6. Filled template becomes an artifact in the project package
```

## Adding New Templates

When a workflow needs a new template:

1. Determine which workflow owns the artifact
2. Create file in `04 - templates/workflows/<workflow>/<template-name>.md`
3. Match the conventions above
4. Add cross-reference in the workflow file
5. Add validation rules to `08 - validation/`
6. Update this README mapping table

## Cross-References

- **Workflows:** `06 - workflows/`
- **Agent PRDs:** `03 - agents/`
- **Validation:** `08 - validation/`
- **Template library (v2):** `04 - templates/`
- **Workflow-specific templates:** `04 - templates/workflows/`

---

*Templates are scaffolding, not buildings. Each one is filled with project-specific truth at runtime.*