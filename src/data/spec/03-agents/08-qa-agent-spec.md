# AppArchitect – QA Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Validates deliverables against the PRD suite, runs tests, audits PRD compliance
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | QA Agent |
| **Role** | Test all deliverables, audit PRD compliance, enforce acceptance criteria |
| **Type** | Quality Assurance |
| **Operates On** | Test suites, PRD documents, code reviews, acceptance criteria checks |
| **Triggered By** | Orchestrator phase unlock + post-deploy continuous validation |
| **Blocking?** | Yes — blocks merge to main, blocks production deploy |

## 2. Mission Statement

The QA Agent is the final gate before any code reaches production. It runs the full test suite (unit, integration, E2E, security, performance), audits every deliverable against the PRD suite's acceptance criteria, and verifies all cross-document integrity checks. It produces a sign-off report per agent and a global sign-off for the whole system. It has the authority to block releases on any failing test or unmet acceptance criterion.

## 3. Scope

### 3.1 In Scope
- Unit test execution and coverage analysis
- Integration test execution
- E2E test execution
- Security test execution
- Performance test execution
- PRD compliance audit (every document vs. every acceptance criterion)
- Cross-document integrity checks
- Manual test coordination (where automation is not possible)
- Regression test suite management
- Bug triage and reporting
- Sign-off reports

### 3.2 Out of Scope
- Fixing bugs (assigned back to owning agent)
- Writing production code (other agents)
- Defining acceptance criteria (PRD authors)
- Production deployment (DevOps Agent)
- Customer support

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `allPRDs` | Documentation Agent | Markdown | Yes |
| `testPlan` | Test Plan PRD | Markdown | Yes |
| `allAgentPRDs` | Documentation Agent | Markdown | Yes |
| `codebase` | Working tree | TypeScript | Yes |
| `agentOutputs` | Each agent | JSON | Yes |

### 4.2 Input Schemas
```typescript
type QAReviewRequest = {
  subject: string;                // agent name or feature
  deliverables: string[];         // file paths
  relevantPRDs: string[];         // file paths
  testScope: ('unit' | 'integration' | 'e2e' | 'security' | 'performance' | 'manual')[];
  acceptanceCriteriaRefs: string[];  // test IDs from Test Plan PRD
}

type QAReviewResult = {
  status: 'PASS' | 'FAIL' | 'PARTIAL';
  passed: string[];
  failed: string[];
  warnings: string[];
  criticalBugs: number;
  nonCriticalBugs: number;
  testCoverage: { area: string; coverage: number }[];
  pdCompliance: { prd: string; status: 'PASS' | 'FAIL'; missing: string[] }[];
  recommendedAction: 'APPROVE' | 'CONDITIONAL_APPROVE' | 'BLOCK';
  conditions?: string[];
}
```

### 4.3 Input Validation Rules
- All required PRDs must be present
- All referenced test IDs must exist in Test Plan PRD
- Codebase must be in a buildable state

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| Per-agent sign-off | Orchestrator | JSON | Yes |
| Global sign-off | Orchestrator | JSON | Yes |
| Bug reports | Owning agent | JSON | When bugs found |
| Test coverage report | `/qa-reports/coverage-*.md` | Markdown | Yes |
| PRD compliance report | `/qa-reports/compliance-*.md` | Markdown | Yes |
| Release readiness report | Orchestrator | JSON | Per release |

### 5.2 Output Schemas
**GlobalSignOff**
```typescript
type GlobalSignOff = {
  allAgentsPassing: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testCoverage: { area: string; coverage: number }[];
  pdCompliance: { prd: string; status: 'PASS' | 'FAIL' }[];
  safetyChecks: { check: string; status: 'PASS' | 'FAIL' }[];
  permissionChecks: { check: string; status: 'PASS' | 'FAIL' }[];
  securityChecks: { check: string; status: 'PASS' | 'FAIL' }[];
  performanceTargetsMet: boolean;
  criticalBugsOpen: number;
  recommendedAction: 'APPROVE' | 'CONDITIONAL_APPROVE' | 'BLOCK';
  summary: string;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Receive Phase Complete Signal**
- From Orchestrator
- Includes agent name, deliverables, relevant PRDs

**Step 2: Run Test Suites**
- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`
- Security tests: `npm run test:security`
- Performance tests: `npm run test:performance`

**Step 3: Analyze Coverage**
- Minimum thresholds per Test Plan PRD §4
- Identify untested code paths
- Flag coverage gaps

**Step 4: Audit PRD Compliance**
- For every PRD in scope, check every acceptance criterion
- Cross-document integrity checks (per Master PRD Index §7)
- Flag any unmet criterion

**Step 5: Safety & Permission Audit**
- For every Safety PRD requirement, verify corresponding test passes
- For every Roles & Permissions Matrix row, verify corresponding test passes
- Flag any unverified safety or permission

**Step 6: Security Audit**
- Run `npm audit`, fail on critical
- Grep for hardcoded secrets, fail on any match
- Verify HTTPS enforcement
- Verify webhook signature checks
- Verify SQL injection protection (parameterized queries)
- Verify XSS protection (output encoding)
- Verify CSRF protection

**Step 7: Performance Audit**
- Page load time targets (mobile, desktop)
- API response p95
- AI response time
- Database query time

**Step 8: Manual Test Coordination**
- For tests that cannot be automated (UX, copy accuracy), document steps
- Coordinate with reviewer
- Track pass/fail

**Step 9: Bug Reporting**
- Critical: immediately file, immediately block release
- High: file, block release
- Medium: file, log for next sprint
- Low: file, log for backlog

**Step 10: Sign-off**
- Per-agent sign-off
- Global sign-off
- Recommended action: APPROVE / CONDITIONAL / BLOCK

### 6.2 Decision Logic
**Decision: Block or proceed**
```
IF any critical bug is open
THEN BLOCK
ELSE IF any high bug is open
THEN BLOCK
ELSE IF any safety test fails
THEN BLOCK
ELSE IF any permission test fails
THEN BLOCK
ELSE IF test coverage is below threshold
THEN BLOCK
ELSE IF any acceptance criterion unmet
THEN BLOCK
ELSE APPROVE
```

**Decision: Severity**
```
IF bug is data loss, security, or production-down
THEN severity: critical
ELSE IF bug is core feature broken
THEN severity: high
ELSE IF bug is non-core feature broken
THEN severity: medium
ELSE severity: low
```

### 6.3 Iteration Behavior
- Iterates over: agents, test suites, PRD acceptance criteria
- Loops on any test failure until resolved

### 6.4 Concurrency Rules
- May run concurrently with: most agents
- Must not run concurrently with: another QA Agent (avoid conflicting test runs)

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| Test environment unavailable | Wait, retry, then block |
| Flaky test | Mark as flaky, fix in next pass, do not block on single flake |
| Test data drift | Re-seed, re-run |
| CI runner timeout | Mark incomplete, escalate |
| PRD ambiguous | Flag to Orchestrator, do not invent interpretation |
| Bug appears during regression | Re-open owning agent's work |
| Coverage below threshold | Block, identify gaps, request expansion |
| Cross-document conflict discovered | Flag to Orchestrator, do not resolve |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Test Plan PRD | All (source of truth for what to test) |
| Master PRD Index | §7 (cross-document validation protocol) |
| All other PRDs | Acceptance criteria |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must run after | All other agents | Validates their output |
| May run concurrently | Documentation Agent | Independent |
| Triggers | Orchestrator | When phase complete |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| Test runners (Vitest, Playwright) | Execute tests | Critical |
| Coverage tool | Coverage analysis | High |
| npm audit | Security scan | High |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `QA_TEST_FAILED` | Test execution failed | High | Investigate, fix, re-run |
| `QA_COVERAGE_BELOW_THRESHOLD` | Coverage under required | High | Expand tests |
| `QA_ACCEPTANCE_CRITERION_UNMET` | PRD criterion not met | High | Fix implementation or update PRD |
| `QA_SAFETY_CHECK_FAILED` | Safety test failed | Critical | Block release, fix |
| `QA_PERMISSION_CHECK_FAILED` | Permission test failed | Critical | Block release, fix |
| `QA_SECRET_IN_SOURCE` | Secret value in code | Critical | Rotate, fix, audit |
| `QA_BUG_FOUND` | Bug reported (severity in payload) | Variable | Owning agent fixes |

## 10. Logging & Observability
- Log every test run with suite name, tests passed/failed, duration
- Log every bug report with severity, owning agent, description
- Log every sign-off decision with rationale
- Never log: user PII, secret values, raw test failures that include secrets

## 11. Acceptance Criteria
- [ ] All test suites executable and reportable
- [ ] Coverage thresholds enforced per Test Plan PRD
- [ ] All PRD acceptance criteria verified
- [ ] All cross-document integrity checks run
- [ ] All safety tests pass (mandatory)
- [ ] All permission tests pass (mandatory)
- [ ] Security audit catches: hardcoded secrets, SQL injection, XSS, CSRF, HTTPS, webhook verification
- [ ] Performance targets verified
- [ ] Bug reports include reproduction steps
- [ ] Sign-off report is binary (APPROVE/CONDITIONAL/BLOCK)

## 12. Test Cases
- 12.1 Happy: all tests pass, all criteria met, coverage above threshold → APPROVE.
- 12.2 Error: critical bug found → BLOCK with bug report.
- 12.3 Edge: flaky test → mark as flaky, do not block, fix root cause in next pass.

---

**END OF QA AGENT PRD**
### Monetization-Related Tests (Cross-Reference to Test Plan PRD §15)

**MON-QA-001: Run M-BILL-001 through M-BILL-020**
- Priority: P0
- Description: All 20 monetization tests in Test Plan PRD §15 must pass before paywall goes live
- Acceptance criteria: 20/20 pass; no regressions in core flows
- Depends on: Backend Agent MON-001, Frontend Agent MON-UI-001
- Complexity: L

**MON-QA-002: Stripe CLI integration tests**
- Priority: P0
- Description: Use Stripe CLI to fire test webhook events; verify handlers process correctly
- Acceptance criteria: `stripe trigger checkout.session.completed` → tier updates; `stripe trigger invoice.payment_failed` → banner shows
- Depends on: QA Agent TASK-001
- Complexity: M

**MON-QA-003: Tier-gate regression test**
- Priority: P0
- Description: For every gated endpoint, verify that:
  - Free user → 402 `BIZ_TIER_LIMIT_REACHED`
  - Pro user → 200 success
  - Team user → 200 success
- Acceptance criteria: All gated endpoints have 3-user-role coverage
- Depends on: QA Agent TASK-001
- Complexity: L

**MON-QA-004: Cancellation flow UX audit**
- Priority: P0
- Description: Manual + automated audit of cancellation flow for dark patterns
- Acceptance criteria: One-click cancel works; no hidden costs; no urgency manipulation
- Depends on: Frontend Agent MON-UI-007
- Complexity: M

**Cross-references:** Monetization & Pricing PRD §10 (Acceptance Criteria); Test Plan PRD §15
