governance/operational-standards/03-document-quality-standard.md
AppArchitect Document Quality Standard
Version: 1.0
Status: Canonical
Layer: Operational Standards
Position: 03 of 15
Depends On: 01-operating-principles.md, 02-agent-execution-standard.md


Purpose
Defines the quality dimensions, measurement rubric, scoring system, and minimum thresholds for every document produced within the AppArchitect system. This standard is the implementation of Operating Principle #1 (Truth Over Completion) and #7 (Artifact Traceability).
Quality is not subjective. Every document in AppArchitect is scored against a fixed rubric. Documents below the minimum score are blocked from release.


Scope
Applies to:
• All PRD documents (16 base PRDs + orchestrator + agents)
• All governance documents
• All operational standards
• All generated schemas and validation results
• All export manifests and build handoffs
• All user-facing documentation
Out of scope:
• Source code (governed by code quality standards, not this doc)
• Brand assets (governed by brand spec)
• Slack/email human conversations (not artifacts)


Quality Dimensions
Every document is scored across 6 dimensions. Each dimension is scored 0–100.

1. Completeness (weight: 25%)
Definition: All required sections are present, all required fields are filled, all required examples are provided, and the document covers the entire assigned scope.
Measurement:
• Required sections present: 40 points
• Required fields filled: 30 points
• Required examples provided: 15 points
• No placeholder text (TODO, TBD, [FILL]): 15 points
Failure: Any required section missing is an automatic FAIL regardless of other dimension scores.

2. Consistency (weight: 20%)
Definition: The document is internally consistent (no contradictions within itself) and externally consistent (no contradictions with the Master Project Schema, related governance docs, or peer documents).
Measurement:
• Internal consistency (no self-contradictions): 40 points
• External consistency with Master Schema: 30 points
• External consistency with peer documents: 20 points
• Terminology consistent with system glossary: 10 points
Failure: Contradiction with Master Schema is an automatic FAIL.

3. Accuracy (weight: 20%)
Definition: All factual claims are true, all technical claims are verifiable, and all examples actually work.
Measurement:
• Factual claims supported by evidence: 40 points
• Technical claims verifiable against schemas/architecture: 30 points
• Examples tested and working: 20 points
• No invented APIs/libraries/features: 10 points
Failure: Any invented API or fabricated metric is an automatic FAIL (Principle #1).

4. Traceability (weight: 15%)
Definition: Every claim, section, and example is traceable back to its source — the agent that generated it, the schema section it consumed, and the validation check that approved it.
Measurement:
• Source agent/version on every section: 30 points
• Schema section references valid: 30 points
• Validation check IDs present: 20 points
• Assumption IDs where applicable: 20 points
Failure: Missing trace on any section is an automatic FAIL (Principle #7).

5. Actionability (weight: 10%)
Definition: A downstream agent or human can execute on this document without needing additional clarification.
Measurement:
• Clear next steps defined: 40 points
• Handoff contracts explicit: 30 points
• Tools and inputs named: 20 points
• Success criteria defined: 10 points

6. Maintainability (weight: 10%)
Definition: The document can be updated without rewriting, has clear ownership, and is versioned properly.
Measurement:
• Ownership declared: 25 points
• Version declared: 25 points
• Review cadence declared: 25 points
• Section IDs/names stable (not duplicated): 25 points

Scoring
Each dimension produces a 0–100 score.
weighted_score = (completeness * 0.25) + (consistency * 0.20) + (accuracy * 0.20) + (traceability * 0.15) + (actionability * 0.10) + (maintainability * 0.10)

Minimum Scores
| Document Type | Min Weighted Score | Auto-FAIL Triggers |
|---|---|---|
| Core PRD (Core Systems, Technical Architecture) | 95 | Any invented API, any contradiction with schema |
| Specialist PRD | 90 | Any invented API, missing trace |
| Governance Document | 95 | Contradiction with another governance doc |
| Operational Standard | 95 | Contradiction with operating principles |
| Schema Definition | 100 | Any field ambiguity |
| Validation Result | 100 | Any unchecked required field |
| Export Manifest | 100 | Any missing artifact ID |
| User-Facing Doc | 85 | Factual inaccuracy |

Scoring Procedure
1. The Validation Engine (see 13-validation-engine-spec.md) scores each document.
2. Human reviewers may override individual dimension scores with evidence.
3. Final score is the average of engine score and human review score.
4. Documents below threshold are returned to the producing agent for revision (max 3 cycles).
5. After 3 failed revision cycles, the document is escalated to human lead review.

Quality Dimensions — Detailed Rubric
Completeness Sub-Rubric
• Required section missing: 0 points for the entire dimension
• All required sections present, 1-2 fields blank: 60 points
• All required sections present, all fields filled, no examples: 80 points
• All required sections present, all fields filled, ≥1 example per section: 100 points
Consistency Sub-Rubric
• Self-contradiction detected: 0 points for the entire dimension
• Internally consistent, externally inconsistent with 1 peer doc: 50 points
• Internally consistent, externally consistent with all peer docs: 100 points
Accuracy Sub-Rubric
• Invented API/library/metric detected: 0 points for the entire dimension
• All factual claims supported: 100 points
Traceability Sub-Rubric
• No trace on any section: 0 points for the entire dimension
• Partial trace (some sections): 50 points
• Full trace on every section: 100 points
Actionability Sub-Rubric
• No next steps: 0 points
• Next steps defined, handoff contracts missing: 50 points
• All actionability elements present: 100 points
Maintainability Sub-Rubric
• No ownership/version: 0 points
• Ownership + version, no review cadence: 60 points
• All maintainability elements present: 100 points

Exceptions and Waivers
A document may be released below threshold only if:
1. The shortfall is in Maintainability only (ownership/version issues), AND
2. A waiver is signed by the document owner and a human reviewer, AND
3. The waiver has an expiration date not exceeding 30 days.
No waivers for Completeness, Consistency, Accuracy, or Traceability.


Cross-References
• 01-operating-principles.md — Principles 1 and 7
• 02-agent-execution-standard.md — self-validation step
• 04-validation-standard.md — full validation pipeline
• 12-release-standard.md — quality gate at release
• 13-validation-engine-spec.md — implementation of scoring
• governance/03-generation-rules.md — generation rules that produce these documents


Ownership
Component: Document Quality Standard
Owner: Documentation Lead
Reviewer: Quality Lead + System Architect
Review Cadence: Every MAJOR version bump, or on any quality regression incident


---

End of File
