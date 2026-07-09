# AppArchitect – Documentation Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Produces the AppArchitect PRD suite, all 16 base PRDs, and the team configuration
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Documentation Agent |
| **Role** | Generate and maintain the PRD suite that the entire AppArchitect build consumes |
| **Type** | Code / Content hybrid |
| **Operates On** | Base PRD files in `/docs`, generated suite in `apparchitect-prd-suite/`, Master PRD Index |
| **Triggered By** | Orchestrator Agent phase unlock |
| **Blocking?** | Yes — no specialist agent may start until Documentation Agent reports COMPLETE |

## 2. Mission Statement

The Documentation Agent transforms the user's product idea (collected by the Interview Engine) into a complete, zero-placeholder PRD suite of 16 base documents and a team configuration manifest. Its output is the single source of truth that every other agent reads from. Every placeholder removed, every cross-document reference verified, every template filled with real content, before the suite is declared complete. It does not write application code; it writes the specifications that the build team implements.

## 3. Scope

### 3.1 In Scope
- Run the four-round adaptive interview (Concept Foundation → Feature Scope → Technical & Business Context → Depth Probing)
- Detect vague answers and request clarification
- Mark `[USER-UNSPECIFIED — RECOMMENDED DEFAULT APPLIED]` for unanswered fields and apply documented defaults
- Produce all 16 base PRD documents in the production order (Error & State → Roles → Core Systems → Safety → Technical → Experience → Data → Content → Design → Migrations → Env → Test Plan → Changelog → Master Index, plus 15 User Setup Guide and 16 Agent PRD Template)
- Produce the team configuration manifest listing every detected agent and its responsibilities
- Run the cross-document validation protocol and placeholder audit on every produced file
- Detect `AGENT_OVERLAP_DETECTED` and route to Orchestrator before specialists start

### 3.2 Out of Scope
- Implementing the AppArchitect application code (Frontend, Backend, Database, etc.)
- Choosing the application's tech stack (it must be derived from the interview)
- Modifying the Changelog after release (it is append-only)
- Defining the visual design (delegated to Content & Design Agent in step 8)
- Running the actual app (delegated to DevOps Agent)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `interviewSessionId` | User via UI | UUID | Yes |
| `userContext` | Frontend | JSON | Yes |
| `referenceDocuments` | User uploads | File paths | No |
| `previousAnswers` | Session storage | JSON | No |

### 4.2 Input Schemas
```typescript
type InterviewSession = {
  id: string;
  userId: string;
  productName: string;
  currentRound: 1 | 2 | 3 | 4;
  currentDomain: number;        // 1–13
  answers: Answer[];
  domainCoverage: Record<number, { completed: boolean; percentage: number }>;
}

type Answer = {
  questionId: string;
  domain: number;
  value: string;
  isAmbiguous: boolean;
  clarificationNeeded: string | null;
  userSpecifiedDefault: boolean;
  appliedDefault: string | null;
}
```

### 4.3 Input Validation Rules
- `interviewSessionId` must reference a valid session
- `currentDomain` must be in 1..13
- Every `Answer` must include `isAmbiguous: boolean`
- If `isAmbiguous: true`, `clarificationNeeded` must be non-empty
- If `userSpecifiedDefault: false` and `appliedDefault` is null, mark as `DEFERRED`

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| All 16 base PRD files | `base-prds/...` | Markdown | Yes |
| Team configuration manifest | Orchestrator | JSON | Yes |
| Cross-document audit report | Orchestrator | JSON | Yes |
| Placeholder count per file | Orchestrator | JSON | Yes |
| Suite README | `auxiliary/README.md` | Markdown | Yes |

### 5.2 Output Schemas
**TeamConfigurationManifest**
```typescript
type TeamConfig = {
  orchestrator: { id: '00', name: 'Orchestrator Agent', scope: string };
  agents: Array<{
    id: string;                     // '01', '02', etc.
    name: string;                   // 'Documentation Agent'
    role: string;                   // one-sentence role
    inScope: string[];
    outOfScope: string[];
    dependsOnAgents: string[];      // agent IDs that must finish first
    detectedCapability: string;     // matches a key in capability matrix
  }>;
  capabilitiesDetected: string[];   // e.g., ['frontend', 'auth', 'ai', 'payments', ...]
  capabilitiesAbsent: string[];      // things user said no to
}
```

**AuditReport**
```typescript
type AuditReport = {
  allChecksPassed: boolean;
  placeholderCount: number;
  genericExampleCount: number;     // e.g., "example.com", "[DATE]"
  crossDocumentChecks: Array<{
    checkId: string;                // e.g., 'VAL_SCHEMA_DRIFT'
    pass: boolean;
    note?: string;
  }>;
  issues: Array<{ file: string; line: number; description: string; severity: 'critical' | 'high' | 'medium' | 'low' }>;
}
```

### 5.3 Output Quality Rules
- Every base PRD file must have zero placeholders (`[X]`, `TODO`, `TBD`, `FIXME`)
- No "example.com" or similar generic values in any output
- All JSON schemas must use real field names matching the user's domain
- All SQL must match the canonical Core Systems data objects exactly
- Every error code used must exist in the Error & State Reference
- Every cross-doc check must pass before declaring COMPLETE

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Load Session & Verify Completeness**
- Load `interviewSessionId` and confirm `domainCoverage` shows ≥ 90% for all 13 domains
- If any domain is < 90%, refuse to start and emit `INTERVIEW_INCOMPLETE` with the gap

**Step 2: Pre-Write Validation**
- Run consistency checks (schema, completeness, conflict, safety) per the fill-in agent prompt
- Surface any detected conflicts to the user
- If any blocking issue remains, abort and request user input

**Step 3: Produce Documents in Order**
1. Error & State Reference (foundation)
2. Roles & Permissions Matrix
3. Core Systems PRD
4. Safety, Privacy & Control PRD
5. Technical Architecture PRD
6. Experience & Access PRD
7. Data & Integration PRD
8. Content & Copy PRD
9. Design System & Component Reference
10. Migrations & Seed Data Reference
11. Environment & Secrets Reference
12. Test Plan PRD
13. Changelog & Decision Log (initial)
14. Master PRD Index (last)
15. User Setup & Execution Guide
16. Agent PRD Template (one per agent, see Step 5)

**Step 4: Run Cross-Document Validation**
- Schema consistency: Core Systems objects match Migrations columns
- Role enum values: Roles matrix matches Core Systems profile role field
- Error codes: every code used exists in Error & State Reference
- Copy keys: every screen contract references an existing Content PRD key
- Env vars: every service in Data & Integration has an entry in Env & Secrets
- Safety precedence: no lower-tier doc violates Safety PRD

**Step 5: Detect & Surface Overlaps**
- For each pair of detected agents, check for in-scope overlap
- If any overlap exists, emit `AGENT_OVERLAP_DETECTED` to Orchestrator with both scopes
- Wait for Orchestrator reassignment before producing Agent PRDs

**Step 6: Produce Agent PRDs**
- One Agent PRD per detected agent using template #16
- Each Agent PRD must reference all relevant Base PRD sections explicitly
- Each Agent PRD must have binary acceptance criteria

**Step 7: Placeholder Audit**
- Run the placeholder detection script from Master PRD Index §8
- If any placeholders found, fix in-place; do not deliver
- Re-run until zero placeholders

**Step 8: Produce Team Configuration Manifest**
- Send to Orchestrator with all detected agents and their scopes
- Declare capability matrix (frontend, backend, auth, etc.) based on interview

**Step 9: Audit Report & Completion**
- Run final audit, emit `AgentCompletionReport` with `status: COMPLETE`
- Set `handoffReady: true` only if all 10 cross-doc checks pass and placeholder count is 0

### 6.2 Decision Logic

**Decision: Declare COMPLETE**

```
IF placeholderCount == 0
  AND genericExampleCount == 0
  AND allChecksPassed
  AND teamManifestProduced
THEN status = "COMPLETE", handoffReady = true
ELSE status = "PARTIAL", handoffReady = false, list issues
```

**Decision: Re-ask vs. Default-Apply**

```
IF user answer is empty AND no default in recommendedDefaults map
THEN mark as DEFERRED and continue
ELSE IF user answer is ambiguous (vague language, no specifics)
THEN ask one targeted follow-up
ELSE accept and proceed
```

### 6.3 Iteration Behavior
- Iterates over: 16 base documents in production order
- Iteration limit: one full suite generation per session (may retry individual docs)
- On per-doc failure: log, continue with other docs, retry failed doc at end

### 6.4 Concurrency Rules
- May run concurrently with: Orchestrator (read-only access to Master PRD)
- Must not run concurrently with: another Documentation Agent (lock on `base-prds/`)
- Locking strategy: pessimistic lock on `base-prds/` during write

## 7. Edge Cases & Failure Modes

| Scenario | Expected Behavior |
|---|---|
| User's interview has an empty domain | Halt, emit `INTERVIEW_INCOMPLETE`, request user to complete |
| Two agents claim same capability | Emit `AGENT_OVERLAP_DETECTED` to Orchestrator |
| Production memory budget exceeded | Split document generation across multiple passes, aggregate at end |
| AI provider timeout mid-document | Retry once; on second timeout, return PARTIAL with flagged doc |
| Schema drift between Core Systems and Technical Architecture | Surface as `VAL_SCHEMA_DRIFT` and refuse to declare COMPLETE |
| User revises an answer mid-generation | Pause, re-generate affected downstream documents, resume |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Master PRD Index | §5, §6, §7, §8 (registry, precedence, validation, placeholder check) |
| Error & State Reference | All (every error code used must be registered) |
| Safety, Privacy & Control PRD | §7 (prohibited log content), §8 (data privacy) |
| Core Systems PRD | §6 (LLM Schema Integrity Contract for AI response validation) |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must run before | All specialists | Provides Base PRD set |
| Must run after | Orchestrator (init) | Confirms team config approval |
| Must run after | User interview complete | Cannot start without complete interview |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| AI Provider (Anthropic Claude) | Long-context PRD generation | Critical — fallback to partial output |
| Database | Persist interview state and audit log | Critical |
| File storage | Commit suite to repo | High — failure means re-generate |

## 9. Error Code Registry

| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `INTERVIEW_INCOMPLETE` | Interview has empty domain(s) | High | Request user completion |
| `PREREQ_MISSING` | Required interview answer absent | Critical | Abort |
| `PLACEHOLDER_DETECTED` | Document contains unfilled placeholder | Critical | Fix in place, re-audit |
| `AGENT_OVERLAP_DETECTED` | Two agents have overlapping in-scope | High | Emit to Orchestrator |
| `VAL_SCHEMA_DRIFT` | Schema mismatch between docs | Critical | Surface, do not declare COMPLETE |
| `AI_TIMEOUT` | AI provider timeout | Medium | Retry once, then PARTIAL |
| `AI_INVALID_RESPONSE` | AI response failed schema validation | Medium | Retry with structured prompt |
| `FILE_WRITE_FAILED` | Cannot write to /docs | Critical | Abort, surface error |

## 10. Logging & Observability

### 10.1 What This Agent Must Log
- Each document production start/finish (event `DOC_PRODUCED`)
- Cross-doc check results (event `VALIDATION_CHECK`)
- Agent overlap detection (event `AGENT_OVERLAP_DETECTED`)
- Audit summary (event `AUDIT_COMPLETE`)

### 10.2 What This Agent Must Never Log
- Raw user interview answers (PII)
- Raw AI prompt content
- Full PRD body content (only metadata: filename, line count, placeholder count)
- Secrets, passwords, API keys

## 11. Acceptance Criteria

- [ ] All 16 base PRDs produced with `placeholders: 0`
- [ ] Cross-doc validation reports `allChecksPassed: true`
- [ ] Team configuration manifest matches all detected capabilities
- [ ] No AGENT_OVERLAP_DETECTED unresolved
- [ ] Master PRD Index references every produced file
- [ ] Suite README navigates every file
- [ ] No `example.com`, `[DATE]`, `[NAME]` placeholders anywhere
- [ ] Every PRD file passes the placeholder detection shell script

## 12. Test Cases

### 12.1 Happy Path
- 13-domain interview complete → 16 PRDs produced → audit passes → COMPLETE.

### 12.2 Error Cases
- Empty answer in domain 7: `INTERVIEW_INCOMPLETE` returned.
- Two agents both claim "payment processing": `AGENT_OVERLAP_DETECTED` returned.
- Placeholder `[X]` left in Core Systems: `PLACEHOLDER_DETECTED`, fixes, re-audits.

### 12.3 Edge Cases
- User revises an answer mid-generation: pause, regenerate affected docs, resume.
- AI provider timeout during Test Plan: retry once, return PARTIAL with Test Plan flagged.

---

**END OF DOCUMENTATION AGENT PRD**