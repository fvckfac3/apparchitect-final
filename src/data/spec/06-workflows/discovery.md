# Discovery Workflow

**Layer:** Workflows
**Tier:** 1 of 6 — Discovery
**Owner:** Discovery Agent
**Source Authority:** `01 - governance/07-project-intake-schema-map.md`

## Purpose

Transform raw founder intent — usually expressed as one or two sentences — into structured, schema-mappable project intelligence. The Discovery workflow is the only stage where the founder's voice is allowed into the system unfiltered; every later stage works from Discovery's structured output.

## When to Use

Use this workflow when:

- A founder has a new app idea (no existing PRD exists)
- A new product initiative is being scoped inside an existing organization
- An existing project is being re-scoped and requires fresh discovery
- An inbound request from a sales or partner channel needs project-level interpretation

Do NOT use this workflow when:

- A PRD already exists (proceed to Architecture or Implementation workflows instead)
- The request is purely technical (use the Engineering workflow)
- The request is a feature addition to a known system (use the Feature workflow)

## Inputs

- Founder idea (free-form text, one paragraph or longer)
- Initial goals (what success looks like)
- Known constraints (budget, platform, timeline, team)
- Optional: existing research, competitor references, prior briefs

## Process

Step 1: Capture

- Record the founder statement verbatim
- Tag the intake channel (direct, referral, internal, partner)
- Set `intake_id` and timestamp

Step 2: Intent Extraction

- Classify every founder statement into one of 16 intake categories (per `01 - governance/07-project-intake-schema-map.md`)
- Split compound statements into atomic intents
- Identify multi-intent statements (one statement maps to multiple schema sections)

Step 3: Schema Mapping

- Map each atomic intent to one or more Project Schema sections
- Assign a confidence score: 0.0–1.0 (high ≥ 0.90, medium 0.60–0.89, low &lt; 0.60)
- For intents below 0.60 confidence, flag for clarification rather than guessing

Step 4: Assumption Capture

- Any field populated from inference (not direct founder statement) becomes an `assumption` with `source`, `confidence`, and `description`
- Assumptions never become requirements without explicit validation

Step 5: Gap Detection

- Required schema domains: Vision, Problem, Users, Features, Workflows, Architecture, Signals, Data Requirements, Security, Monetization
- Any missing domain is logged as a `gap` with `severity` and `category`

Step 6: Completeness Score

- Required-domain coverage ratio
- Weighted by criticality: Vision, Problem, Users, Features = critical; Workflows, Architecture, Signals = high; Data, Security, Monetization = standard

## Outputs

- `discovery_summary` — natural-language recap of what was understood
- `intake_result` — structured per `01 - governance/07-project-intake-schema-map.md`
- `assumption_registry` — every inferred field with confidence and source
- `gap_registry` — every missing domain with severity
- `confidence_scores` — per-field confidence map
- `readiness_status` — ready-for-schema-construction | needs-clarification | blocked

## Validation Gates

Gate 1: Intake Completeness

- Rule: All 16 intake categories evaluated
- Severity: Warning (not blocking — gaps are documented, not fatal)

Gate 2: Critical Confidence

- Rule: Every Vision, Problem, User, and Feature field must have confidence ≥ 0.60
- Severity: Error (blocking)
- Remediation: Trigger clarification loop with the founder

Gate 3: Assumption Visibility

- Rule: Every low-confidence field must appear in the assumption registry
- Severity: Error (blocking)

Gate 4: Gap Acknowledgment

- Rule: Every gap must have a documented remediation plan
- Severity: Error (blocking)

## Failure Modes

- Over-asking: Discovery agent asks 10+ clarification questions at once. Remediation: cap at 3 questions per round.
- Silent assumption: Agent guesses on low-confidence fields instead of flagging. Remediation: enforce Gate 3.
- Category drift: Statements mapped to wrong intake category. Remediation: re-extract using full 16-category taxonomy.
- Confidence inflation: Agent scores inferences as high confidence. Remediation: cap inferred-field confidence at 0.85.

## Worked Example

Founder statement: "I want a dating app for people who love hiking. Users should match based on trails they've completed. Free with premium for unlimited matches."

Extraction:

- Vision (high confidence, 0.95): "Niche dating app for outdoor enthusiasts"
- Problem (high, 0.90): "Mainstream dating apps don't serve outdoor-activity compatibility"
- Users (medium, 0.75): "Hikers, trail-runners, climbers — needs demographic refinement"
- Features (high, 0.95): profile, matching, premium tier, trail-data integration
- Monetization (high, 0.95): freemium model with paid unlimited matches
- Integrations (medium, 0.70): AllTrails, Strava, or similar trail API
- Gaps: Authentication method, platform target, AI features

Result: `readiness_status: needs-clarification` (3 clarification questions queued)

## Cross-References

- Governance: `01 - governance/07-project-intake-schema-map.md`, `01 - governance/06-master-generation-pipeline.md` (Stage 2)
- Schemas: `02 - schemas/01-project-schema.json` (fields populated by this workflow)
- Templates: `04 - templates/` — `file discovery-questionnaire.md`, `file intake-form-template.md`
- Operational Standards: `05 - operational-standards/01-operating-principles.md`
- Prompt Contracts: `07 - prompt-contracts/09-discovery-agent-prompt.md`

End of Discovery Workflow
