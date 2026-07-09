# [Product Name] – User Instructions
## How to Set Up, Run, Oversee, and Validate Your Agent Development Team

**Version:** 2.0  
**Status:** Authoritative · Read Before Doing Anything  
**Governed by:** [Product Name] – Master PRD Index  
**Audience:** Product owner, project lead, or anyone directing the agent team

---

## Before You Begin: Read This Entire Document First

This document tells you exactly what to do, in what order, at every stage of the build. It is not optional background reading. Every section maps to a real action you must take.

**Time investment:** Reading this fully takes approximately 20 minutes. Skipping it will cost you hours.

---

## How This Document Is Organized

| Section | What It Covers |
|---|---|
| Part 1 | One-time setup before any agent does anything |
| Part 2 | How to brief and activate each agent |
| Part 3 | How to oversee agents while they work |
| Part 4 | How to verify and validate each agent's output |
| Part 5 | How to handle problems, errors, and conflicts |
| Part 6 | Final validation before launch |
| Part 7 | Quick-reference checklists |

---

# PART 1: ONE-TIME SETUP

*Do this once before any agent is activated. Do not skip or reorder these steps.*

---

## Step 1.1 — Complete Every PRD Document

Every PRD in the suite must be fully completed before any agent is activated. Partially filled templates cause agents to make assumptions, and those assumptions will be wrong.

**Verify each document contains no unfilled placeholders:**

- [ ] Master PRD Index
- [ ] Core Systems PRD
- [ ] Experience & Access PRD
- [ ] Safety, Privacy & Control PRD
- [ ] Technical Architecture PRD
- [ ] Data & Integration PRD
- [ ] Content & Copy PRD
- [ ] Changelog & Decision Log
- [ ] Test Plan PRD
- [ ] Error & State Reference
- [ ] Environment & Secrets Reference
- [ ] Design System & Component Reference
- [ ] Migrations & Seed Data Reference
- [ ] Roles & Permissions Matrix
- [ ] Each Agent PRD

**Automated placeholder check — run this from your `/docs` directory:**

```bash
#!/bin/bash
echo "Scanning for unfilled placeholders..."

FOUND=$(grep -rn "\[" --include="*.md" . \
  | grep -v "^\s*//" \
  | grep -v "\`\`\`" \
  | grep -v "^Binary")

if [ -n "$FOUND" ]; then
  echo "ERROR: The following unfilled placeholders were found:"
  echo "$FOUND"
  echo ""
  echo "Fill all placeholders before activating any agent."
  exit 1
fi

echo "Scanning for TODO / TBD markers..."
MARKERS=$(grep -rn "TODO\|TBD\|FIXME\|PLACEHOLDER" --include="*.md" .)

if [ -n "$MARKERS" ]; then
  echo "ERROR: The following incomplete markers were found:"
  echo "$MARKERS"
  exit 1
fi

echo "All PRD documents are complete. No placeholders detected."
exit 0
```

**Do not proceed until this script exits with code 0.**

---

## Step 1.2 — Establish Your Document Directory

```
/docs
  ├── 00_master_prd_index.md
  ├── 01_core_systems_prd.md
  ├── 02_experience_access_prd.md
  ├── 03_safety_privacy_control_prd.md
  ├── 04_technical_architecture_prd.md
  ├── 05_data_integration_prd.md
  ├── 06_content_copy_prd.md
  ├── 07_changelog_decision_log.md
  ├── 08_test_plan_prd.md
  ├── 09_error_state_reference.md
  ├── 10_environment_secrets_reference.md
  ├── 11_design_system_component_reference.md
  ├── 12_migrations_seed_data_reference.md
  ├── 13_roles_permissions_matrix.md
  ├── agents/
  │   ├── agent_[name].md
  │   └── agent_[name].md
  └── user_instructions.md
```

---

## Step 1.3 — Define Your Agent Team

1. List every major task required to build the product
2. Group tasks by type (scaffold, database, API, frontend, auth, AI, tests, audit)
3. Assign each group to a named agent role
4. Create an Agent PRD for each agent
5. Map agent dependencies — which agents must finish before others can start

**Agent dependency map (fill this in):**

```
[Agent A — Scaffold] → [Agent B — Database] → [Agent C — API]
                                             → [Agent D — Auth]
[Agent C] + [Agent D] → [Agent E — Frontend]
[Agent E] → [Agent F — Tests]
[Agent F] → [Agent G — Audit]
```

---

## Step 1.4 — Prepare Your Environment

- [ ] Repository created and initialized
- [ ] `/docs` directory created and all PRDs committed
- [ ] `.env.example` created (all variable names, no values)
- [ ] All secret values set in your secrets manager
- [ ] Database provisioned and connection string available
- [ ] All third-party accounts created and API keys stored as env vars
- [ ] Deployment target configured
- [ ] CI/CD pipeline with placeholder detection step configured
- [ ] **Only development/staging credentials active — no production credentials during build**

---

## Step 1.5 — The Master Agent Instruction

Every agent session must begin with this exact block. Save it. Use it every time.

```
Before doing anything else, read all of the following documents 
in this exact order:

1. /docs/00_master_prd_index.md          ← Start here always
2. /docs/01_core_systems_prd.md
3. /docs/02_experience_access_prd.md
4. /docs/03_safety_privacy_control_prd.md  ← HIGHEST PRECEDENCE
5. /docs/04_technical_architecture_prd.md
6. /docs/05_data_integration_prd.md
7. /docs/06_content_copy_prd.md
8. /docs/09_error_state_reference.md
9. /docs/13_roles_permissions_matrix.md
10. /docs/agents/agent_[your_name].md    ← Your specific PRD

After reading, complete the Precedence Compliance Block 
in each document you will touch, then confirm with:

1. Your agent name and role
2. Your exact scope (in and out)
3. The three highest-priority constraints governing your work
4. Results of cross-document validation checks from Master PRD Index §7
5. Any conflicts or ambiguities you detected

Do not begin any task until confirmation is complete.
```

---

# PART 2: BRIEFING AND ACTIVATING EACH AGENT

---

## Step 2.1 — Pre-Activation Checklist

- [ ] All PRD documents finalized — placeholder script passes
- [ ] This agent's Agent PRD is complete
- [ ] All dependency agents have finished and their output is verified
- [ ] Environment variables for this agent's work are set
- [ ] You know exactly what correct output looks like

---

## Step 2.2 — Deliver the Brief

**Message 1: Context load**
```
[Paste the Master Agent Instruction from Step 1.5 
with your agent name filled in]
```

Wait for the confirmation response. Verify:
- [ ] Agent correctly stated its role and scope
- [ ] Agent's three constraints are accurate and in correct precedence order
- [ ] Cross-document validation checks were completed and passed
- [ ] Any flagged conflicts are real issues that need your resolution

If the confirmation is wrong or incomplete: restart the session.

**Message 2: Task assignment** *(only after correct confirmation)*

```
Your task: [specific task from the Agent PRD]

Constraints:
- Work only within your defined scope
- Use only technologies from the Technical Architecture PRD
- Use only copy from the Content & Copy PRD
- Use only error codes from the Error & State Reference
- All data structures must match Core Systems PRD canonical schemas
- All permission checks must match the Roles & Permissions Matrix
- Do not invent anything not specified in the PRDs
- If you encounter something not covered, stop and flag it

Begin with Step 1 of your execution sequence.
Confirm completion of each step before proceeding to the next.
```

---

## Step 2.3 — Step Confirmation Protocol

After each major step, require this report:

```
Before proceeding, confirm:
1. What you just completed
2. What the output is and where it lives
3. Any deviations from the PRD, however minor
4. Cross-document compliance check for this step's output
5. What you are about to do next
```

---

# PART 3: OVERSEEING AGENTS WHILE THEY WORK

---

## Step 3.1 — Red Flags — Stop the Agent Immediately

| Warning Sign | What to Do |
|---|---|
| Agent invents a feature not in any PRD | Stop, correct, re-anchor to PRD |
| Agent uses a technology not in Technical Architecture PRD | Stop, correct, confirm correct stack |
| Agent writes copy not in Content & Copy PRD | Stop, provide exact copy from PRD |
| Agent uses an error code not in Error & State Reference | Stop, provide correct code |
| Agent references "best practices" to override a PRD | Stop — PRDs are binding, not suggestions |
| Agent modifies files outside its defined scope | Stop, undo, redefine scope |
| Agent skips a required execution step | Stop, return to missed step |
| Agent violates Safety PRD in any way | Stop immediately, review all output |
| Agent hardcodes a secret value | Stop immediately, rotate the value |
| Agent omits `tenant_id` from a user-data table (multi-tenant) | Stop — critical security gap |
| Agent logs prohibited content | Stop immediately, audit all logs |
| Agent omits Precedence Compliance Block from a modified document | Stop, require it before continuing |

## Step 3.2 — Yellow Flags — Address at Next Checkpoint

| Warning Sign | What to Do |
|---|---|
| Output is technically correct but misses PRD spirit | Clarify intent at next checkpoint |
| Agent produces more than asked for | Review additions, remove what isn't specified |
| Output is incomplete but not incorrect | Note gaps, address before moving on |
| Agent expresses uncertainty about a requirement | Check the PRD yourself, provide the answer |
| Copy Registry Map keys not linked to Content PRD | Require links before proceeding |

---

## Step 3.3 — Course Correction Format

```
Stop. Before proceeding, note the following correction:

[Describe the issue clearly]

The correct behavior per [PRD Name], Section [X] is:
[Quote or describe the relevant requirement exactly]

Acknowledge this correction and adjust before continuing.
```

If the error has already propagated: restart cleanly. Sunk cost is not a reason to keep bad output.

---

## Step 3.4 — Agent Handoff Note Format

```
## Agent Handoff Note — [Date]

Completed by: [Agent Name]
Status: [Complete / Partial — describe what's missing]

What was built:
- [Item 1]
- [Item 2]

Cross-document compliance verified:
- [Check 1]: Pass / Fail
- [Check 2]: Pass / Fail

Known deviations from PRD:
- [Issue, if any — reference PRD section]

Files modified:
- [File path]

What the next agent needs to know:
- [Context 1]
- [Context 2]
```

---

# PART 4: VERIFYING AND VALIDATING AGENT OUTPUT

---

## Step 4.1 — PRD Compliance Check

**Safety, Privacy & Control PRD — check first, always**
- [ ] No safety constraints violated
- [ ] No prohibited data logged or exposed
- [ ] No AI behavior exceeding defined role boundaries
- [ ] All user control mechanisms intact
- [ ] Global Safety Boundary Checklist items met

**Core Systems PRD**
- [ ] All data objects match canonical schemas exactly
- [ ] State machines enforce allowed transitions, block illegal ones
- [ ] Transactional boundaries atomic
- [ ] LLM Schema Integrity Contract implemented (if AI used)
- [ ] Copy Registry Map keys link to Content PRD

**Experience & Access PRD**
- [ ] All screens present and match specifications
- [ ] Auth flows work exactly as specified
- [ ] Navigation correct
- [ ] Responsive behavior correct at all breakpoints

**Technical Architecture PRD**
- [ ] Only specified technologies used
- [ ] All endpoints present and correctly structured
- [ ] DB schema matches Core Systems canonical objects
- [ ] Security requirements implemented
- [ ] No secrets hardcoded
- [ ] `tenant_id` on all user-data tables (if multi-tenant)

**Error & State Reference**
- [ ] All error codes used match registered codes
- [ ] No invented error codes
- [ ] Error handling matrix implemented

**Roles & Permissions Matrix**
- [ ] All role checks enforced on backend
- [ ] Invitation lifecycle states implemented
- [ ] Guardrails enforced

**Content & Copy PRD**
- [ ] All UI strings match exactly
- [ ] All error messages present
- [ ] Legal copy at correct locations

---

## Step 4.2 — Functional Verification

- [ ] Code runs without errors
- [ ] Linting passes with zero errors
- [ ] Type checking passes with zero errors
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] No TODO or placeholder comments remain
- [ ] `grep` for hardcoded secrets returns zero

---

## Step 4.3 — Edge Case Verification

| Scenario | What to Check |
|---|---|
| Network failure mid-action | UI shows correct error; data consistent |
| Session expiry | Redirect correct; data preserved |
| Invalid input in every form field | Correct error per Error & State Reference |
| Back/forward navigation | Correct state restored |
| Refresh mid-flow | Correct state restored |
| Empty database state | All empty states render correctly |
| Maximum data volume | UI handles long lists and strings |
| Concurrent actions | No race conditions |
| Cross-tenant access (multi-tenant) | Returns 404 — tenant isolated |
| Expired invitation token | Returns correct error code |

---

## Step 4.4 — Sign-Off Format

```
## Agent Output Sign-Off — [Agent Name] — [Date]

PRD Compliance:
- Safety PRD:              PASS / FAIL / PARTIAL
- Core Systems PRD:        PASS / FAIL / PARTIAL
- Experience PRD:          PASS / FAIL / PARTIAL
- Technical PRD:           PASS / FAIL / PARTIAL
- Data & Integration PRD:  PASS / FAIL / PARTIAL
- Content & Copy PRD:      PASS / FAIL / PARTIAL
- Error & State Reference: PASS / FAIL / PARTIAL
- Roles & Permissions:     PASS / FAIL / PARTIAL

Functional Verification:   PASS / FAIL / PARTIAL
Edge Case Verification:    PASS / FAIL / PARTIAL

Outstanding Issues:
- [Issue — severity: critical / high / medium / low]

Decision: APPROVED / CONDITIONAL / NOT APPROVED

Conditions (if conditional):
- [Condition]
```

---

# PART 5: HANDLING PROBLEMS

---

## Step 5.1 — Error Severity and Response

| Severity | Examples | Response |
|---|---|---|
| **Critical** | Safety violation, data exposure, security hole, hardcoded secret | Stop all work. Do not commit. Fix root cause. Restart agent. |
| **High** | Wrong data structure, wrong technology, wrong state behavior | Do not proceed. Targeted correction or restart. |
| **Medium** | Missing feature, incomplete implementation | Log gap. Fix now or assign to later agent. |
| **Low** | Minor copy deviation, cosmetic issue | Log. Fix in current or future pass. |

---

## Step 5.2 — PRD Conflict Resolution

1. Identify which two documents conflict on which specific point
2. Apply precedence rules from Master PRD Index Section 6
3. Higher-precedence document wins — always
4. Update lower-precedence document to align
5. Re-brief any agent that acted on the now-incorrect requirement
6. Log the conflict and resolution in the Changelog & Decision Log

**Never ask an agent to decide a PRD conflict. That is your decision.**

---

## Step 5.3 — Missing Requirement Protocol

1. Agent flags the gap and stops (correct behavior)
2. You decide the correct behavior
3. Add the requirement to the appropriate PRD
4. Log the decision in the Changelog & Decision Log
5. Re-brief the agent with the updated document

Missing requirements mean a PRD is incomplete. Fix the source.

---

# PART 6: FINAL VALIDATION BEFORE LAUNCH

---

## Step 6.1 — Full Codebase Audit

Run the codebase audit prompt against the complete codebase.

- [ ] Audit completed
- [ ] All Critical findings resolved
- [ ] All High findings resolved or formally deferred with documented rationale
- [ ] Medium and Low findings logged for backlog

---

## Step 6.2 — End-to-End Journey Tests

- [ ] New user: signup → onboarding → first core action
- [ ] Returning user: login → resume where they left off
- [ ] Core feature journey 1: [describe]
- [ ] Core feature journey 2: [describe]
- [ ] Settings: modify preferences → verify persistence
- [ ] Account deletion: initiate → confirm → verify purge
- [ ] Data export: request → receive → verify contents

---

## Step 6.3 — Safety & Privacy Final Check

- [ ] Crisis detection tested with sample inputs (if applicable)
- [ ] AI boundary constraints verified in live environment
- [ ] Prohibited content absent from all log outputs
- [ ] Account deletion verified irreversible and complete within SLA
- [ ] Data export delivers correct contents within SLA
- [ ] All legal disclosures present and correctly placed
- [ ] Global Safety Boundary Checklist (Safety PRD §11) — all items pass

---

## Step 6.4 — Security Final Check

- [ ] HTTPS enforced across all environments
- [ ] `grep` for hardcoded secrets returns zero
- [ ] SQL injection protection verified
- [ ] XSS protection verified
- [ ] CSRF protection verified
- [ ] Auth cookies are HTTP-only and SameSite=Strict
- [ ] Rate limiting active on auth endpoints
- [ ] `npm audit` returns zero critical vulnerabilities
- [ ] Placeholder detection CI step passes

---

## Step 6.5 — Launch Readiness Sign-Off

```
## Launch Readiness Sign-Off — [Product Name] — [Date]

Codebase Audit:             COMPLETE
End-to-End Testing:         COMPLETE
Safety & Privacy Check:     COMPLETE
Security Check:             COMPLETE
Performance Baseline:       MET / NOT MET

Deferred items:
- [Item — target: [timeframe]]

Sign-off: [Your name]
Decision: READY TO LAUNCH / NOT READY — [reason]
```

---

# PART 7: QUICK-REFERENCE CHECKLISTS

---

## Checklist A — Before Starting Any Agent

- [ ] Placeholder script passes on all PRD documents
- [ ] Agent PRD for this agent is complete
- [ ] Dependency agents finished and output verified
- [ ] Environment variables set for this agent's work
- [ ] Master Agent Instruction prepared

---

## Checklist B — Agent Activation

- [ ] Master Agent Instruction delivered
- [ ] Confirmation received and verified
- [ ] Precedence Compliance Blocks acknowledged
- [ ] Cross-document validation checks passed
- [ ] Task assignment delivered
- [ ] Step confirmation protocol established

---

## Checklist C — During Agent Work

- [ ] No scope creep
- [ ] No unapproved technologies
- [ ] No invented copy or error codes
- [ ] No safety PRD violations
- [ ] No hardcoded secrets
- [ ] Step confirmations received at each checkpoint

---

## Checklist D — Agent Output Verification

- [ ] Safety PRD: PASS
- [ ] Core Systems PRD: PASS
- [ ] Experience PRD: PASS
- [ ] Technical Architecture PRD: PASS
- [ ] Data & Integration PRD: PASS
- [ ] Content & Copy PRD: PASS
- [ ] Error & State Reference: PASS
- [ ] Roles & Permissions Matrix: PASS
- [ ] Code runs without errors
- [ ] Tests pass
- [ ] Edge cases verified
- [ ] Sign-off completed

---

## Checklist E — Pre-Launch

- [ ] Full codebase audit complete
- [ ] All critical and high findings resolved
- [ ] All user journeys tested
- [ ] Safety and privacy check complete
- [ ] Security check complete
- [ ] Placeholder CI step passes
- [ ] Launch readiness sign-off completed

---

## Common Mistakes

| Mistake | Why It's a Problem | What to Do Instead |
|---|---|---|
| Activating an agent before all PRDs are complete | Agent fills gaps with assumptions | Run placeholder script first |
| Skipping the confirmation step | No way to know if agent has correct context | Always require and verify confirmation |
| Letting agents resolve PRD conflicts | Agents guess — guesses may violate precedence | You resolve conflicts, then update the PRD |
| Proceeding past a Critical finding | Compounds into bigger problems | Stop and fix Critical findings immediately |
| Using production credentials during build | Security risk | Dev/staging credentials only |
| Skipping the final audit | You will miss things | Always run it |
| Not logging decisions in the Changelog | Future agents and humans lose context | Log every significant decision |

---

**END OF USER INSTRUCTIONS**