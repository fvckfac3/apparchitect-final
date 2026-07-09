# Prompt Contracts

**Layer:** Prompt Contracts (Tier 1 — Orchestration)
**Position:** Sibling of `governance/`, `schemas/`, `agents/`, `operational-standards/`, at the AppArchitect-Foundation root.
**Authority:** This layer IS the execution engine. The Master Orchestrator Prompt (file 01) is the brainstem. All other prompts in this directory are derived organs.

---

## Authority Hierarchy

```markdown
governance/                       (constitution — highest authority)
    ↑
operational-standards/            (procedural rules — executable contracts)
    ↑
prompt-contracts/                 (execution prompts — this layer)
    ↑
agents/, base-prds/, prd-suite/   (templates consumed by agents)
```

Governance &gt; Operational Standards &gt; Prompt Contracts &gt; Agent PRDs &gt; Generated Artifacts.

When a conflict exists, the higher layer wins.

---

## Architectural Model

The execution engine is structured as a **parent prompt + derived prompts** system.

### Parent Prompt

**`file 01-master-orchestrator-prompt.md`** — The brainstem. Does not generate. Coordinates, dispatches, validates, and escalates. 838 lines, 15 sections.

It contains:

- Section 0: Identity
- Section 1: Constitutional Layer (10 principles, embedded)
- Section 2: Runtime Contracts (paths to governance, schemas, agents)
- Section 3: Inputs (input_envelope schema)
- Section 4: Coordinator Behavior (state machine, dispatches, validation)
- Section 5: Pipeline Execution (14 stages)
- Section 6: Escalation & Failure Handling
- Section 7: State Management & Idempotency
- Section 8: Authority & Conflict Resolution
- Section 9: Output Envelopes (5 envelope formats)
- Section 10: Forbidden Actions (15-item blacklist)
- Section 11: Self-Test Triggers
- Section 12: Session Lifecycle
- Section 13: Prompt Contract Suite Derivation
- Section 14: Cross-References

### Derived Prompts

Each derived prompt inherits the parent's Section 1 constitutional layer **verbatim** and specializes one role.