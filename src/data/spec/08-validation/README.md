# Validation Framework

**Layer:** Validation Framework (Tier 2 — Domain Validators)
**Position:** Sibling of `prompt-contracts/`, `governance/`, `operational-standards/`, `schemas/`, `agents/`
**Authority:** Subordinate to `governance/13-validation-engine-spec.md` (the engine), implements rules defined in `governance/04-validation-rules.md`

Purpose
This is AppArchitect's immune system. The Validation Framework contains the specialized validators that execute the rule catalog and produce the findings the Master Orchestrator uses to gate pipeline progression.
Validation operates across:
- PRD structural and content quality
- Schema integrity
- Cross-document reference resolution
- Semantic consistency
- Completeness across required artifacts
- Dependency graph integrity
- Production readiness (the final gate)

Each validator produces:
- A pass/fail decision
- A list of findings (severity-graded)
- A readiness score contribution
- Required remediations (if any)

Authority Order
1. `governance/13-validation-engine-spec.md` — engine architecture
2. `governance/04-validation-rules.md` — rule catalog
3. `operational-standards/04-validation-standard.md` — validation procedures
4. `07-validation/` — validator implementations (THIS LAYER)

The validators defined here execute rules defined in the higher layers. They may not invent rules.

Pipeline Order
```
01 PRD Validation (post-Stage 9 PRD)
   ↓
02 Schema Validation (post-Stage 3 Schema)
   ↓
03 Cross-Document Validation (post-Stage 9 docs)
   ↓
04 Consistency Validation (parallel with 05, 06)
   ↓
05 Completeness Validation (parallel with 04, 06)
   ↓
06 Dependency Validation (parallel with 04, 05)
   ↓
07 Production-Readiness Validation (Stage 13 — FINAL GATE)
   ↓
Release Decision: GO | CONDITIONAL_GO | NO_GO
```

File Index

| File | Purpose | Rules | Severity Range |
|------|---------|-------|----------------|
| `01-prd-validator.md` | PRD structure & content validation | 15 | WARNING → CRITICAL |
| `02-schema-validator.md` | JSON Schema integrity validation | Schema-driven | WARNING → CRITICAL |
| `03-cross-document-validator.md` | Cross-document reference validation | 15 | ERROR → CRITICAL |
| `04-consistency-validator.md` | Semantic consistency validation | 18 | WARNING → CRITICAL |
| `05-completeness-validator.md` | Completeness validation | 20 | ERROR → CRITICAL |
| `06-dependency-validator.md` | Dependency graph integrity validation | 16 | WARNING → CRITICAL |
| `07-production-readiness-validator.md` | Final production-readiness gate | 30 | WARNING → CRITICAL |

Total: 99 explicit validation rules + JSON Schema-driven schema validation.

Severity Levels (per `governance/04-validation-rules.md`)
- **Level 0: Informational** — No action required
- **Level 1: Warning** — Should be reviewed, generation may continue
- **Level 2: Error** — Generation cannot proceed, correction required
- **Level 3: Critical** — Project state invalid, immediate remediation required

Release Decision Algorithm (from `07-production-readiness-validator.md`)
```
GO              if overall_score >= 90 AND zero ERROR findings
CONDITIONAL_GO  if overall_score >= 80 AND critical_findings_count == 0
NO_GO           otherwise
```

Cross-References
- **Engine architecture:** `governance/13-validation-engine-spec.md`
- **Rule catalog:** `governance/04-validation-rules.md`
- **Validation procedures:** `operational-standards/04-validation-standard.md`
- **Pipeline definition:** `governance/06-master-generation-pipeline.md`
- **Master orchestrator:** `prompt-contracts/01-master-orchestrator-prompt.md`
- **Validation engine prompt:** `prompt-contracts/02-validation-engine-prompt.md`

Current Status
- ✅ All 7 domain validators defined
- ✅ All validators inherit from `governance/13-validation-engine-spec.md`
- ✅ All validators reference `governance/04-validation-rules.md` rule catalog
- ✅ All validators produce findings in the canonical schema format
- ✅ Pipeline order and gate logic defined
- 📋 Implementation code (TypeScript/Python) is the next layer

Last Updated: 2026-06-19
Authority: Canonical
