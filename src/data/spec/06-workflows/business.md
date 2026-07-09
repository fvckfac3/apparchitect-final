content = """# Business Workflow

**Layer:** Workflows
**Tier:** 5 of 6 — Business
**Owner:** Business Agent
**Source Authority:** `01 - governance/06-master-generation-pipeline.md` (Stages 9–10, Business subset), `01 - governance/07-project-intake-schema-map.md` (Categories 12–16)

## Purpose

Define the commercial operating model: monetization mechanics, financial projections, team structure, partnership strategy, legal posture, and operational sustainability. The Business workflow ensures the product can survive commercially.

## When to Use

Use this workflow when:
- Product workflow artifacts exist (or business inputs are sufficient to start)
- A new product needs a go/no-go business case
- An existing product needs re-pricing or re-monetization
- Fundraising requires structured financial projections
- Strategic partnership evaluation is needed

Do NOT use this workflow when:
- The product is not yet defined (run Product first)
- A pricing change is purely tactical (use Templates directly)
- The business is in pure R&D / pre-revenue with no commercial model

## Inputs

- Product artifacts (Master PRD, monetization design, launch plan)
- Validated `project_schema` (especially monetization, integrations, market sections)
- Market research (or run Discovery supplements)
- Existing financial data (for existing products)
- Optional: investor briefs, board strategy docs, partnership MOUs

## Process

Step 1: Monetization Mechanics
- Pricing model: subscription, one-time, usage-based, freemium, marketplace cut, hybrid
- Tier structure: free → pro → enterprise, with feature gates and usage limits
- Trial mechanics: free trial length, card-required vs. not, conversion triggers
- Discount strategy: launch pricing, annual prepay, student/nonprofit, referral credits
- Document every assumption and source

Step 2: Financial Modeling
- Revenue projection: 3 scenarios (conservative, base, optimistic) over 3 years
- Cost structure: COGS (hosting, third-party, payment processing), CAC, support, R&D
- Unit economics: LTV, CAC, LTV:CAC ratio, payback period, gross margin
- Cash flow: monthly for Year 1, quarterly for Years 2–3
- Sensitivity analysis: what if conversion drops 20%? what if CAC doubles?

Step 3: Team & Org Structure
- Founding team: roles, equity, vesting
- First 10 hires: sequence, roles, comp ranges, equity bands
- Org chart at 25, 50, 100 people
- Advisor structure, board composition

Step 4: Go-to-Market Strategy
- ICP refinement: beyond personas, who's the buyer vs. user vs. champion
- Channel strategy: organic, paid, partnerships, sales-led, PLG
- Positioning: against alternatives, for the buyer, in their language
- Distribution: direct, marketplaces, resellers, integrations

Step 5: Partnership & Integration Strategy
- Tech partnerships: integration depth, co-marketing, revenue share
- Distribution partnerships: channels, resellers, agencies
- Strategic partnerships: data, content, IP, exclusivity
- Identify 3–5 priority partners per category with rationale

Step 6: Legal & Compliance
- Entity structure: LLC, C-corp, S-corp, jurisdiction
- IP: ownership of code, content, data, brand
- Privacy: applicable frameworks (GDPR, CCPA, HIPAA), consent UX, data retention
- Terms: ToS, Privacy Policy, Cookie Policy, Acceptable Use, SLA
- Industry-specific: financial (PCI), health (HIPAA), kids (COPPA), etc.
- Insurance: E&O, cyber, general liability

Step 7: Operational Sustainability
- Support model: self-serve, in-app, email, chat, phone
- SLA tiers by plan: free / pro / enterprise response times
- On-call rotation, incident response, status page
- Customer success: onboarding, retention programs, win-back
- Compliance auditing cadence

Step 8: Validation Pass
- Financial assumptions sourced and stress-tested
- Team plan matches funding stage
- Legal posture covers target market
- Go-to-market budget reconciled with CAC and projected revenue

## Outputs

- `monetization_model` — pricing, tiers, trials, discounts
- `financial_model` — 3-year P&L, cash flow, unit economics, scenarios
- `team_plan` — founding team, hire sequence, comp bands
- `go_to_market_plan` — ICP, channels, positioning, distribution
- `partnership_strategy` — partner categories, priority targets
- `legal_compliance_posture` — entity, IP, privacy, terms, insurance
- `operational_runbook` — support tiers, on-call, customer success

## Validation Gates

Gate 1: Monetization Traceability
- Rule: Every pricing decision traceable to market data or persona willingness-to-pay
- Severity: Warning (not blocking, must be acknowledged)

Gate 2: Unit Economics Viability
- Rule: LTV:CAC ≥ 3:1 in base case; payback period ≤ 12 months
- Severity: Error (blocking if seeking investment)

Gate 3: Legal Coverage
- Rule: All target market jurisdictions covered; all applicable compliance frameworks addressed
- Severity: Critical (blocking)

Gate 4: Team Feasibility
- Rule: Hire plan matches funding stage and runway
- Severity: Warning (not blocking)

Gate 5: GTM Budget Reconciliation
- Rule: Projected CAC × projected new customers/month ≤ GTM budget
- Severity: Error (blocking)

## Failure Modes

- Optimistic financial projections: Best-case scenarios presented as base case. Remediation: Always lead with conservative case.
- Pricing copied from competitors: Without validation against own value/cost. Remediation: Van Westendorp or willingness-to-pay research required.
- Underestimated legal complexity: Especially international, especially kids/family/health. Remediation: Legal review Gate 3.
- GTM-before-product: Spending on acquisition before retention is proven. Remediation: Validate retention before scaling acquisition.
- Founder-only plan: No plan for what happens when founder is unavailable. Remediation: Document operational runbook with non-founder owners.

## Worked Example

Business artifacts for the dating app:
- Monetization: 3 tiers, $9.99/$19.99/$49.99, 7-day trial no card required, annual prepay 20% discount
- Financials: Conservative (1.2k paying users @ 12mo, $144k ARR), Base (4.8k @ 12mo, $576k ARR), Optimistic (12k @ 12mo, $1.44M ARR)
- Unit economics: LTV $187, CAC $42, LTV:CAC 4.4:1, payback 4.2 months
- Team: 2 founders (CEO + CTO), first 3 hires: senior full-stack, designer, growth lead
- GTM: SEO-led (hiking keyword strategy), Reddit community, partnerships with hiking influencers
- Legal: Delaware C-corp, GDPR + CCPA compliant, terms + privacy drafted
- Operational: Intercom for support, on-call rotation between 2 founders (until 25 paying customers), no SLA on free tier

Validation: All gates passed; 2 warnings (CAC estimate based on 2 analogous products, not own data)

## Cross-References

- Governance: `01 - governance/06-master-generation-pipeline.md`, `01 - governance/07-project-intake-schema-map.md` (Categories 12–16)
- Templates: `04 - templates/PRD Suite v2 – Monetization PRD.md.md`, `04 - templates/workflows/business/financial-model.md`, `04 - templates/PRD Suite v2 – Roles & Permissions Matrix.md.md`, `04 - templates/workflows/business/launch-checklist.md`, `04 - templates/PRD Suite v2 – Safety, Privacy & Control PRD.md.md`
- Validation: `08 - validation/04-consistency-validator.md` (financial consistency with product monetization)
- Prompt Contracts: `07 - prompt-contracts/06-prd-agent-prompt.md` (monetization subset)

End of Business Workflow
