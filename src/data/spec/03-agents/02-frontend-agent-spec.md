# AppArchitect – Frontend Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Implements the AppArchitect user interface (interview panel, document preview, agent map)
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Frontend Agent |
| **Role** | Build all client-side UI for AppArchitect |
| **Type** | Code |
| **Operates On** | React components, Next.js app router, Tailwind classes, Lucide icons |
| **Triggered By** | Orchestrator phase unlock (after Documentation Agent COMPLETE) |
| **Blocking?** | Yes — blocks user-facing release |

## 2. Mission Statement

The Frontend Agent builds the AppArchitect UI: the three-panel interview workspace, the live document preview with streaming output, the agent team node graph, and the user settings screens. It enforces the Design System & Component Reference exactly, sources every user-facing string from the Content & Copy PRD, and routes every action through the Auth & Security Agent's session. It does not write server code, define APIs, or generate PRDs.

## 3. Scope

### 3.1 In Scope
- Implement the three-panel layout (Interview | Document Preview | Agent Map)
- Build all UI components per Design System (Button, Input, Modal, Toast, Safety Banner)
- Wire the interview chat interface (user input, system messages, file upload)
- Wire the live document preview with streaming output and copy-to-clipboard
- Wire the agent team node graph (click agent → see its PRD)
- Wire navigation, responsive breakpoints, and theme variables
- Honor Content PRD keys for every string
- Honor `prefers-reduced-motion` for every animation
- Implement keyboard navigation, focus states, screen reader labels

### 3.2 Out of Scope
- Writing API routes (Backend Agent)
- Database schema (Database Agent)
- Authentication and session logic (Auth & Security Agent)
- Visual design decisions (Content & Design Agent provides tokens)
- AI prompt construction (AI Integration Agent)
- Test cases (QA Agent)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `basePRDs` | Documentation Agent | Markdown files | Yes |
| `userSession` | Auth & Security Agent | JWT | Yes |
| `designSystem` | Content & Design Agent | CSS / TS tokens | Yes |
| `contentKeys` | Content PRD | JSON | Yes |
| `routes` | Backend Agent | OpenAPI | Yes |

### 4.2 Input Schemas
```typescript
type UserSession = {
  userId: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  expiresAt: string;        // ISO-8601
}

type Route = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  requiresAuth: boolean;
  requiredRole?: string[];
  requestSchema: JSONSchema;
  responseSchema: JSONSchema;
}
```

### 4.3 Input Validation Rules
- `userSession` must have non-expired `expiresAt`
- Every `Route.requiresAuth` must be honored in the UI (redirect to /login if not authenticated)
- All copy must come from Content PRD keys — no hardcoded strings

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| React components | `/app/**/*.{tsx,ts}` | TSX | Yes |
| Tailwind theme variables | `/app/globals.css` | CSS | Yes |
| API client functions | `/app/lib/api/*.ts` | TS | Yes |
| Playwright E2E tests | `/tests/e2e/*.spec.ts` | TS | Yes |
| Frontend sign-off report | Orchestrator | JSON | Yes |

### 5.2 Output Schemas
**FrontendSignOff**
```typescript
type FrontendSignOff = {
  componentsBuilt: number;
  routesImplemented: number;
  copyKeysUsed: number;            // all must exist in Content PRD
  errorCodesHandled: string[];     // subset of Error & State Reference
  wcagAA: 'PASS' | 'FAIL';
  reducedMotion: 'PASS' | 'FAIL';
  focusManagement: 'PASS' | 'FAIL';
  issues: Array<{ severity: string; description: string }>;
}
```

### 5.3 Output Quality Rules
- Every component text must come from a Content PRD key
- Every color, font, spacing value must come from Design System tokens
- No raw hex colors, no inline font-size in pixels, no magic numbers
- All focus states visible, all animations honor `prefers-reduced-motion`
- All interactive elements must be keyboard navigable
- Minimum touch target 44×44px

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Scaffold App Router**
- Create `/app/layout.tsx`, `/app/globals.css`, `/app/page.tsx`
- Set up Tailwind with Design System tokens as CSS variables
- Add font loading per Design System

**Step 2: Build Shared Components**
- Button (5 variants × 3 sizes)
- Input (5 states)
- Modal (4 sizes, focus trap, escape-to-close, persistent mode)
- Toast (4 variants, manual dismiss for safety)
- Safety Banner (color-safety + icon + text, manual dismiss only, z-index 100)
- Tabs, Accordion, Stepper (for interview), NodeGraph (for agent map)

**Step 3: Build Interview Workspace**
- Three-panel layout: left (interview chat), center (doc preview), right (agent map)
- Mobile breakpoint: collapse to tabs
- Step indicator in left panel
- File upload area

**Step 4: Build Document Preview**
- Streaming output (reads SSE from Backend Agent)
- Markdown renderer with syntax highlighting for code blocks
- Copy-to-clipboard per section
- Tab navigation between documents
- Real-time placeholder count badge per doc

**Step 5: Build Agent Map**
- Node graph showing every detected agent
- Click agent → open side panel with that agent's PRD
- Animated collaboration lines between agents with interaction labels
- "Add agent" / "Remove agent" controls (with re-validation request)

**Step 6: Build Settings Screens**
- Profile, Preferences, Data Export, Account Deletion
- All copy from Content PRD
- Account deletion confirmation dialog uses exact copy from Content PRD

**Step 7: Wire API Client**
- Typed wrappers for every backend route
- Token-based session attached to every request
- Error handling per Error & State Reference

**Step 8: Responsive Behavior**
- Mobile: < 768px (single column, bottom tab bar)
- Tablet: 768–1024px (two columns)
- Desktop: > 1024px (three columns)
- Test at every breakpoint

**Step 9: Accessibility**
- All components keyboard-navigable
- Focus ring always visible (`border-focus` per Design System)
- ARIA labels on all icons
- `prefers-reduced-motion` honored
- Color contrast WCAG AA verified

**Step 10: Sign-off**
- Emit `FrontendSignOff` to Orchestrator
- Set `handoffReady: true` only if all `PASS`

### 6.2 Decision Logic
**Decision: Show skeleton vs. error**
```
IF route.requiresAuth AND userSession is missing
THEN show auth loading skeleton, then redirect to /login
ELSE IF route load failed
THEN show error state with copy key from Content PRD
ELSE render content
```

**Decision: Trigger safety banner**
```
IF backend response includes 'safety_event' flag
THEN show Safety Banner, freeze other UI interactions, require manual dismiss
ELSE continue
```

### 6.3 Iteration Behavior
- Iterates over: components, then routes, then accessibility audit
- On per-component failure: log, continue building others
- Final pass: fix all `medium+` issues before sign-off

### 6.4 Concurrency Rules
- May run concurrently with: Content & Design Agent (read-only design tokens)
- Must not run concurrently with: another Frontend Agent on the same route
- Locking strategy: file-level pessimistic lock during write

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| Backend route returns 401 | Refresh session; on failure, redirect to /login |
| Backend route returns 403 | Show permission denied message from Content PRD |
| Streaming output interrupted | Show "Resume" button; on click, resume from last event ID |
| User has slow network | Show skeleton, then partial content as it streams |
| Safety banner triggered | Freeze other UI, require explicit dismiss |
| Document with 10,000+ lines | Use virtualized rendering; do not block the main thread |
| User resizes window mid-stream | Preserve scroll position and current document |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Technical Architecture PRD | §4 (Frontend), §5 (State Management) |
| Experience & Access PRD | All |
| Content & Copy PRD | All |
| Design System & Component Reference | All |
| Error & State Reference | §7 (Error Messages — copy keys) |
| Safety, Privacy & Control PRD | §5 (AI role boundaries — affects UI claims) |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must run after | Documentation Agent | Needs Base PRDs |
| Must run after | Content & Design Agent | Needs design tokens |
| May run concurrently | Backend Agent (on different routes) | Independent |
| Must run before | QA Agent | Needs UI to test |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| Auth service | Session validation | Critical |
| Backend API | All data fetches | Critical |
| Streaming service | Document generation updates | High (degrades to polling) |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `COMPONENT_BUILD_FAILED` | TypeScript or build error in component | Critical | Fix, rebuild |
| `COPY_KEY_MISSING` | UI references a key not in Content PRD | Critical | Add key to Content PRD, re-build |
| `WCAG_AA_FAILED` | Color contrast or focus management failure | High | Adjust to meet WCAG AA |
| `API_CLIENT_INVALID` | API client does not match Backend contract | High | Regenerate client from OpenAPI |
| `ROUTE_MISSING` | Required route not implemented | Critical | Implement before sign-off |

## 10. Logging & Observability
- Log every component build start/finish (event `COMPONENT_BUILT`)
- Log every route implementation (event `ROUTE_WIRED`)
- Log accessibility audit results (event `A11Y_AUDIT`)
- Never log: user PII, raw PRD content, secrets

## 11. Acceptance Criteria
- [ ] All 3 main panels (interview, doc preview, agent map) render correctly
- [ ] All UI strings come from Content PRD keys
- [ ] All colors, fonts, spacings from Design System tokens
- [ ] WCAG AA verified for every page
- [ ] `prefers-reduced-motion` honored
- [ ] All routes have typed API client wrappers
- [ ] All error states show correct copy from Content PRD
- [ ] Account deletion confirmation uses exact copy from Content PRD
- [ ] No secrets in client bundle
- [ ] FrontendSignOff report shows all `PASS`

## 12. Test Cases
- 12.1 Happy: new user completes interview, sees document stream, signs off.
- 12.2 Error: backend returns 401 → session refresh, then redirect to /login.
- 12.3 Edge: 10,000-line document streams without blocking main thread.

---

**END OF FRONTEND AGENT PRD**
### Monetization-Related Tasks

**MON-UI-001: Pricing page**
- Priority: P0
- Description: Build `/pricing` page with 3 tier cards, monthly/yearly toggle, feature comparison table
- Acceptance criteria: All copy from Content PRD `pricing.*` keys; "Upgrade" CTAs route to Stripe Checkout
- Depends on: Frontend Agent FE-001
- Complexity: M

**MON-UI-002: Second-project paywall modal**
- Priority: P0
- Description: When Free user attempts 2nd project, show `paywall.second_project` modal
- Acceptance criteria: M-BILL-002 passes; modal matches Content PRD copy exactly; one-click upgrade
- Depends on: MON-UI-001
- Complexity: S

**MON-UI-003: Feature-gated inline prompt**
- Priority: P0
- Description: Inline upgrade prompt when Free user attempts Pro-only feature
- Acceptance criteria: M-BILL-004 passes; non-blocking, dismissible, with upgrade CTA
- Depends on: MON-UI-001
- Complexity: S

**MON-UI-004: Trial-ending banner**
- Priority: P0
- Description: Persistent banner on all authenticated pages when trial has 3 days remaining
- Acceptance criteria: M-BILL-005 passes; dismissible per-page but re-appears on new session
- Depends on: Frontend Agent FE-001
- Complexity: S

**MON-UI-005: Trial-expired blocking modal**
- Priority: P0
- Description: Blocking modal that prevents generation when trial ends without payment method
- Acceptance criteria: M-BILL-006 passes; two CTAs: add payment or downgrade
- Depends on: MON-UI-004
- Complexity: S

**MON-UI-006: Payment-failed banner**
- Priority: P0
- Description: Persistent banner when invoice payment fails
- Acceptance criteria: M-BILL-012 passes; banner dismissible; project access preserved
- Depends on: Frontend Agent FE-001
- Complexity: S

**MON-UI-007: Cancellation flow (in-app)**
- Priority: P0
- Description: Multi-step cancellation flow with confirm dialog, optional reason, and "keep" save offer
- Acceptance criteria: M-BILL-013, M-BILL-014 pass; no dark patterns
- Depends on: MON-UI-001
- Complexity: M

**MON-UI-008: Settings → Billing page**
- Priority: P1
- Description: Build `/settings/billing` showing current tier, payment method, invoices, manage button
- Acceptance criteria: "Manage" button redirects to Stripe Customer Portal
- Depends on: MON-UI-001
- Complexity: M

**MON-UI-009: Upgrade success page**
- Priority: P1
- Description: `/billing/success` page after Stripe Checkout redirect
- Acceptance criteria: Shows `success.billing.upgraded` toast; redirects to dashboard after 3s
- Depends on: MON-UI-001
- Complexity: S

**Cross-references:** Monetization & Pricing PRD §7; Content & Copy PRD §13
