# AppArchitect – Experience Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Owns auth, onboarding, navigation, and the user journey through the app
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Experience Agent |
| **Role** | Define and maintain the user journey, auth flow, onboarding, navigation, screen contracts |
| **Type** | User Experience / Frontend Coordination |
| **Operates On** | Experience & Access PRD, auth code, onboarding flow, navigation component |
| **Triggered By** | Orchestrator (initial) + Orchestrator (any new feature) + Frontend Agent (screen requests) |
| **Blocking?** | No (but coordinates with Frontend) |

## 2. Mission Statement

The Experience Agent owns the user's path through the product. It defines every screen, every screen contract (what must load, primary action, empty state, error state), the auth flow, the onboarding flow, the navigation structure, and the state persistence behavior. It is the contract between backend capabilities and frontend presentation. It also owns the onboarding flow logic — what data is collected, in what order, with what validation.

## 3. Scope

### 3.1 In Scope
- Screen inventory and contracts
- Auth flow (signup, login, password reset, OAuth if any)
- Onboarding flow (steps, data collected, validation, resume)
- Global navigation (sidebar, top bar, bottom bar, mobile)
- Route protection (auth-required, onboarding-required)
- Session rules (storage, duration, invalidation)
- Responsive behavior definitions
- State persistence and recovery
- Refund of user controls (always accessible pause, exit, settings)

### 3.2 Out of Scope
- Visual design (Content & Design Agent)
- Backend auth implementation (Auth & Security Agent)
- Copy content (Content & Design Agent)
- API contract design (Backend Agent)
- Database schema (Database Agent)
- User data storage (Database Agent)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `coreSystemsPRD` | Documentation Agent | Markdown | Yes |
| `safetyPRD` | Documentation Agent | Markdown | Yes |
| `errorStateRef` | Documentation Agent | Markdown | Yes |
| `rolesPermissions` | Documentation Agent | Markdown | Yes |
| `featureRequest` | Various | JSON | No |

### 4.2 Input Schemas
```typescript
type ScreenContract = {
  route: string;                 // e.g. "/interview", "/dashboard"
  purpose: string;
  mustLoadBeforeRender: string[];  // e.g. ["authState", "userProfile"]
  primaryAction: string;
  copyRefs: string[];             // keys from Content PRD
  emptyState?: string;
  errorState?: string;
  authRequired: boolean;
  onboardingRequired: boolean;
  roleRequired?: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER' | 'ANY';
}

type OnboardingStep = {
  stepId: string;
  order: number;
  headline: string;
  body: string;
  cta: string;
  dataFields: Array<{
    name: string;
    type: 'text' | 'email' | 'select' | 'multiselect' | 'boolean' | 'date';
    required: boolean;
    validation?: string;
  }>;
  nextStep: string | null;       // null = final step
  skippable: boolean;
}
```

### 4.3 Input Validation Rules
- Screen contracts must reference existing Content PRD copy keys
- Onboarding steps must be completed in order (no skipping)
- Auth and onboarding requirements must match Roles & Permissions Matrix

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| Updated Experience & Access PRD | Documentation Agent | Markdown | On change |
| Auth flow spec | Auth & Security Agent | Markdown + diagrams | Yes |
| Onboarding flow spec | Frontend Agent | Markdown + JSON | Yes |
| Navigation component spec | Frontend Agent | Markdown | Yes |
| Per-screen contract | Frontend Agent | JSON | Yes |
| Sign-off report | Orchestrator | JSON | Yes |

### 5.2 Output Schemas
**ExperienceSignOff**
```typescript
type ExperienceSignOff = {
  allScreensHaveContracts: boolean;
  authFlowComplete: boolean;
  onboardingFlowComplete: boolean;
  navigationSpecComplete: boolean;
  routeProtectionEnforced: boolean;
  sessionRulesImplemented: boolean;
  refreshRecoveryTested: boolean;
  userControlsAlwaysAccessible: boolean;
  issues: Array<{ severity: string; description: string }>;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Define User Context Assumptions**
- Slow mobile connections
- Cognitive fatigue
- Long gaps between sessions
- Multi-device usage
- All assumptions in Experience PRD §3

**Step 2: Define Auth Flow**
- Methods supported (email/password, Google OAuth, magic link)
- State transitions (UNAUTHENTICATED ↔ AUTHENTICATED)
- Signup flow (new user)
- Login flow (returning user)
- Password reset flow
- OAuth flow (if applicable)
- Session rules (storage, duration, invalidation triggers)
- All error states and their copy keys

**Step 3: Define Onboarding Flow**
- Onboarding state (NOT_STARTED → IN_PROGRESS → COMPLETED)
- Steps in order
- Data collected per step
- Validation rules per step
- Resume behavior (on refresh or return)
- Completion trigger (all required steps done)
- Skip behavior (none for required steps, optional for nice-to-haves)

**Step 4: Define Global Navigation**
- Items (Dashboard, Settings, Sign Out, etc.)
- Routes
- Icons (refers to Content & Design agent)
- Visibility by role
- Mobile vs tablet vs desktop behavior
- Disabled-during-active-flow rule (with exception for Pause)
- Back navigation rule (return to last stable state, never mid-flow)

**Step 5: Define Screen Inventory**
- One entry per screen
- Each with: route, purpose, must-load-before-render, primary action, copy refs, auth required, onboarding required, role required, empty state, error state

**Step 6: Per-Screen Contracts**
- For each screen, write the full contract
- Reference Content PRD copy keys
- Reference Error & State Reference error codes
- Reference Roles & Permissions Matrix role rules

**Step 7: Define Responsive Behavior**
- Mobile (<768), tablet (768-1024), desktop (>1024)
- Layout changes per breakpoint
- Navigation changes
- Component behavior overrides

**Step 8: Define State Persistence & Recovery**
- Auth session: HTTP-only cookie, restore on refresh
- Onboarding: server-side, resume at last step
- Active flow: server-side, resume on refresh
- Navigation: session memory, return to last stable screen

**Step 9: Coordinate with Frontend Agent**
- Hand off screen contracts
- Coordinate on-screen implementation
- Validate the implementation matches the contract

**Step 10: Coordinate with Auth & Security Agent**
- Hand off auth flow spec
- Validate auth implementation matches the flow
- Coordinate on session management

**Step 11: Sign-off**
- Emit `ExperienceSignOff`
- Set `handoffReady: true` only if all checks pass

### 6.2 Decision Logic
**Decision: Where to send a user after action X**
```
IF user is unauthenticated
THEN redirect to /login with reason
ELSE IF user is authenticated but onboarding NOT_STARTED or IN_PROGRESS
THEN redirect to /onboarding at last step
ELSE IF user is authenticated and onboarding COMPLETED
THEN redirect to /dashboard (or requested route)
```

**Decision: Can user skip onboarding step?**
```
IF step is required for app function (e.g., accept terms)
THEN no skip
ELSE IF step is for personalization (e.g., preferred name)
THEN skip allowed
ELSE skip allowed with "I'll do this later" option
```

### 6.3 Iteration Behavior
- Iterates over: screens, onboarding steps, error states
- Loops on validation failures until all checks pass

### 6.4 Concurrency Rules
- May run concurrently with: most agents
- Must coordinate with: Frontend Agent, Auth & Security Agent
- Must not run concurrently with: another Experience Agent

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| New feature requires new screen | Add to inventory, write contract, coordinate with Frontend |
| Auth method fails | Show fallback to email/password, log error |
| Onboarding step fails to save | Inline error, do not advance, allow retry |
| Refresh mid-flow | Resume at last persisted state |
| Long gap (90+ days) | Restore session if not expired, otherwise re-login |
| User clears cookies | Re-login required, onboarding resumes at last step |
| Network failure mid-onboarding | Persist current step, allow resume |
| User abandons onboarding | On return, resume at last incomplete step |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Experience & Access PRD | All (this agent's own output) |
| Core Systems PRD | User profile schema, onboarding data object |
| Safety, Privacy & Control PRD | User controls, data retention |
| Error & State Reference | Auth and onboarding states |
| Roles & Permissions Matrix | Route protection by role |
| Content & Copy PRD | All UI strings |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must coordinate with | Frontend Agent | Screen implementation |
| Must coordinate with | Auth & Security Agent | Auth implementation |
| Must coordinate with | Content & Design Agent | Copy and visual |
| May run concurrently | Backend Agent | Independent |
| Reports to | Orchestration Agent | Status |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| Auth provider (Google, etc.) | OAuth | High (fallback to email/password) |
| Session store (DB) | Auth tokens | Critical |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `EXP_SCREEN_CONTRACT_MISSING` | Screen has no contract | High | Write contract |
| `EXP_AUTH_FLOW_INCOMPLETE` | Auth flow missing a step | High | Complete the flow |
| `EXP_ONBOARDING_LOOP` | Onboarding step has no next step before completion | Critical | Fix the loop |
| `EXP_REFRESH_BROKEN` | Refresh does not restore state | High | Fix persistence |
| `EXP_USER_CONTROL_HIDDEN` | Pause/exit/settings hidden in some state | High | Restore accessibility |

## 10. Logging & Observability
- Log every screen view (event `SCREEN_VIEWED`) with route, session ID, timestamp
- Log every onboarding step completion (event `ONBOARDING_STEP_COMPLETED`) with step, user
- Log every auth event (login, logout, failed login)
- Never log: user PII (use anonymized session ID), password values, raw form input

## 11. Acceptance Criteria
- [ ] Every screen in the app has a complete contract
- [ ] Auth flow works exactly as specified
- [ ] Onboarding resumes at last incomplete step on refresh or return
- [ ] Navigation is consistent across desktop, tablet, mobile
- [ ] Route protection enforces auth and onboarding requirements
- [ ] Refresh mid-flow restores the last persisted state
- [ ] User controls (Pause, Exit, Settings) are always accessible
- [ ] No screen flashes protected content before auth check completes
- [ ] No onboarding data is collected outside the documented steps
- [ ] ExperienceSignOff all PASS

## 12. Test Cases
- 12.1 Happy: user signs up, completes onboarding, reaches dashboard → all flows work.
- 12.2 Error: refresh mid-onboarding → resume at last step (not restart).
- 12.3 Edge: long gap return → session valid → land on dashboard; session invalid → land on login with reason.

---

**END OF EXPERIENCE AGENT PRD**