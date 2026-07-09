content = """# Product Workflow

**Layer:** Workflows
**Tier:** 4 of 6 — Product
**Owner:** Product Agent
**Source Authority:** `01 - governance/06-master-generation-pipeline.md` (Stages 8–9, Product subset), `01 - governance/09-document-generation-order.md` (Level 6)

## Purpose

Generate the business-facing artifacts that translate a built system into something a market can understand and adopt: PRDs, feature specs, user stories, marketing copy, monetization design, launch planning. The Product workflow makes engineering output consumable.

## When to Use

Use this workflow when:
- Architecture and Implementation are stable (or a feature subset is shippable)
- A new product initiative needs structured launch documentation
- Marketing/launch collateral needs to be generated for a shipped feature
- An existing product needs re-positioning or re-launch documentation

Do NOT use this workflow when:
- The underlying system is not yet shippable (run Implementation first)
- The request is purely internal documentation (use a lighter template, not full Product workflow)
- The request is a one-off piece of copy (use Templates directly)

## Inputs

- Validated `architecture_object`
- Validated `project_schema`
- Implementation status (what's actually built vs. planned)
- Brand assets, voice/tone guidelines (from `06 - assets/` or external source)
- Optional: competitive positioning, launch channels, partner commitments

## Process

Step 1: PRD Generation
- Synthesize Master PRD from Project Schema + Architecture
- Sections: Overview, Problem, Solution, Target Users, Features, User Experience, Technical Approach, Success Metrics, Launch Plan, Risks, Open Questions
- Per-feature PRDs as drill-downs
- Cross-reference every claim to source artifact (schema field, architecture component, implementation ticket)

Step 2: Feature Specification
- For each feature: user story, acceptance criteria, edge cases, error states, telemetry
- Map to schema feature_id
- Identify dependencies (other features, data, integrations)
- Estimate complexity and effort

Step 3: User Story Catalog
- Decompose features into user stories (1–3 days of work each)
- Standard format: As a [user], I want [capability], so that [outcome]
- Include acceptance criteria and test scenarios
- Group into epics and themes for sprint planning

Step 4: Monetization Design
- Pricing tiers, feature gates, trial mechanics
- Billing UX: upgrade prompts, paywall placement, plan comparison
- Revenue recovery: failed payment retry, dunning, grace period
- Tax handling, refund policy, terms of service

Step 5: Launch Planning
- Launch type: private beta, public beta, soft launch, general availability
- Phased rollout strategy: feature flags, region limits, percentage rollout
- Pre-launch checklist: legal review, security review, performance test, support docs
- Launch day runbook: monitoring, comms, incident response

Step 6: Marketing Copy Generation
- Hero copy, value props, feature highlights
- SEO: meta titles, descriptions, OG tags, structured data
- Conversion: landing page structure, CTAs, social proof placement
- Channel-specific variations: web, app store, social, email

Step 7: Acceptance Criteria Validation
- Every user story has testable acceptance criteria
- Every feature has clear definition of done
- Every PRD claim is verifiable in the implementation

Step 8: Cross-Reference Validation
- Run Document Validator (08 - validation/03-cross-document-validator.md)
- Run Consistency Validator (08 - validation/04-consistency-validator.md)
- Address all Error findings

## Outputs

- `master_prd` — single canonical product requirements document
- `feature_specs/` — one per feature
- `user_story_catalog` — all stories, organized by epic
- `monetization_design` — pricing, billing, recovery
- `launch_plan` — phased rollout, checklists, runbook
- `marketing_copy` — hero, SEO, conversion, channel variants
- `acceptance_criteria` — testable definitions
- `prd_validation_report` — findings + remediation

## Validation Gates

Gate 1: PRD Completeness
- Rule: All required sections present with non-placeholder content
- Severity: Error (blocking)

Gate 2: Traceability
- Rule: Every PRD claim traceable to schema, architecture, or implementation ticket
- Severity: Error (blocking)

Gate 3: Acceptance Testability
- Rule: Every user story has at least one testable acceptance criterion
- Severity: Error (blocking)

Gate 4: Cross-Reference Consistency
- Rule: No contradictions between PRD, schema, and architecture
- Severity: Critical (blocking)

Gate 5: Launch Readiness
- Rule: All launch checklist items completed or explicitly waived
- Severity: Critical (blocking, requires human sign-off)

Gate 6: Marketing Compliance
- Rule: No unsubstantiated claims ("best", "fastest", "#1") without evidence
- Severity: Warning (not blocking, must be acknowledged)

## Failure Modes

- Marketing-first PRDs: Writing copy before understanding the system. Remediation: Schema + Architecture must come first.
- Vague acceptance criteria: "User can easily find matches." Remediation: Quantify or specify user-observable behavior.
- Copy-paste boilerplate: Reusing generic product copy without specifics. Remediation: Every claim must trace to a real schema field or implementation ticket.
- Premature launch planning: Planning launch before knowing what's built. Remediation: Implementation status is the first input.
- Feature-PRD drift: PRDs describe features that diverge from implementation. Remediation: Traceability Gate 2 catches drift.

## Worked Example

Product artifacts generated for the dating app:
- Master PRD: 28 sections, all traced to schema/architecture
- Feature specs: 12 features, each with 4–8 acceptance criteria
- User stories: 64 stories across 7 epics
- Monetization: 3 tiers (Free, Premium $9.99/mo, Premium+ $19.99/mo), 7-day free trial, Stripe integration
- Launch plan: Closed beta (200 users) → 5% rollout → full launch in 6 weeks
- Marketing copy: Hero, 5 feature highlights, 3 social proof slots, app store variants

Validation: 4 Warning findings (unspecified marketing claims) → revised, then all gates passed

## Cross-References

- Governance: `01 - governance/06-master-generation-pipeline.md`, `01 - governance/09-document-generation-order.md`
- Templates: `04 - templates/PRD Suite v2 – Master PRD Index.md.md`, `04 - templates/workflows/product/feature-spec.md`, `04 - templates/workflows/launch/launch-plan.md`, `04 - templates/PRD Suite v2 – Monetization PRD.md.md`
- Validation: `08 - validation/01-prd-validator.md`, `08 - validation/03-cross-document-validator.md`, `08 - validation/04-consistency-validator.md`
- Prompt Contracts: `07 - prompt-contracts/06-prd-agent-prompt.md`

End of Product Workflow
