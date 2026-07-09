# AppArchitect – Content & Design Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Owns the Content & Copy PRD, the Design System, and the user-facing voice/tone
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Content & Design Agent |
| **Role** | Maintain copy, voice, tone, visual system, and design tokens |
| **Type** | Content / Design |
| **Operates On** | Content & Copy PRD, Design System & Component Reference, design tokens, Figma exports |
| **Triggered By** | Orchestrator (initial setup) + Frontend Agent (copy requests) + Orchestrator (design token requests) |
| **Blocking?** | No (non-blocking but required for all UI work) |

## 2. Mission Statement

The Content & Design Agent is the single owner of user-facing strings and visual decisions. It defines the voice and tone, writes all UI copy, defines and maintains the design system (colors, typography, spacing, components, animations), and serves as the single source of truth for both. No agent may hardcode a string or invent a color — both must come from this agent's outputs. It enforces the "every copy string resolves to a Content PRD key" and "every color resolves to a design token" invariants.

## 3. Scope

### 3.1 In Scope
- Voice and tone guidelines
- All UI strings (per screen, per state, per error)
- Email copy (subject, preview, body, CTA)
- Legal copy (consent, disclaimers, ToS links)
- Brand color tokens
- Semantic color tokens
- Typography scale
- Spacing scale
- Border and radius tokens
- Shadow tokens
- Animation tokens
- Component library (Button, Input, Modal, Toast, etc.)
- Iconography guidelines
- Accessibility requirements
- Responsive layout rules
- Reduced-motion compliance

### 3.2 Out of Scope
- Frontend implementation (Frontend Agent)
- API contract copy (Backend Agent)
- Marketing copy outside the app (separate marketing agent)
- Translation / localization (out of MVP)
- Icon implementation (Frontend Agent uses the library; this agent defines which to use)
- Brand strategy at company level (out of scope)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `coreSystemsPRD` | Documentation Agent | Markdown | Yes |
| `experiencePRD` | Documentation Agent | Markdown | Yes |
| `errorStateRef` | Documentation Agent | Markdown | Yes |
| `safetyPRD` | Documentation Agent | Markdown | Yes |
| `featureRequest` | Various agents | JSON | No |

### 4.2 Input Schemas
```typescript
type CopyRequest = {
  screen: string;                  // e.g. "interview", "dashboard"
  element: string;                 // e.g. "headline", "body", "submit_button", "empty_state"
  context?: string;                // e.g. "after_answer"
  constraints?: {
    maxLength?: number;
    toneOverride?: 'warm' | 'professional' | 'minimal';
    avoidPhrases?: string[];
  };
}

type TokenRequest = {
  type: 'color' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'animation';
  semantic: string;                // e.g. "primary", "error", "safety", "focus"
  usage: string;
}
```

### 4.3 Input Validation Rules
- All copy keys must be unique
- All tokens must be semantically named (not "blue-500")
- All colors must have a minimum 4.5:1 contrast ratio with their foreground

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| Updated Content & Copy PRD | Documentation Agent | Markdown | On change |
| Updated Design System & Component Reference | Documentation Agent | Markdown | On change |
| Copy registry (machine-readable) | `/content/copy.json` | JSON | Yes |
| Design tokens (machine-readable) | `/design/tokens.json` | JSON | Yes |
| Component code reference | Frontend Agent | Storybook / MDX | Yes |
| Sign-off report | Orchestrator | JSON | Yes |

### 5.2 Output Schemas
**ContentDesignSignOff**
```typescript
type ContentDesignSignOff = {
  allScreensHaveCopy: boolean;
  allErrorCodesHaveCopy: boolean;
  allComponentsUseTokens: boolean;
  voiceAndToneConsistent: boolean;
  allColorsMeetContrastRequirements: boolean;
  allComponentsHaveAllStates: boolean;
  reducedMotionRespected: boolean;
  issues: Array<{ severity: string; description: string }>;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Establish Voice and Tone**
- Author Content & Copy PRD §2 (Voice & Tone)
- Author tone principles table
- Author avoided-words list with replacements
- Document in machine-readable form

**Step 2: Build Copy Registry**
- One copy key per UI string across the entire app
- Naming convention: `[screen].[element].[variant]`
- Example: `auth.login.submit_button`, `errors.network.body`
- All keys referenced in screen contracts (Experience PRD) must exist here

**Step 3: Author Screen Copy**
- Walk every screen in Experience PRD
- Write headline, body, primary CTA, secondary CTA, helper text, empty state, error state
- Match the voice (calm, supportive, non-clinical, non-promissory)

**Step 4: Author Error Messages**
- For every error code in Error & State Reference, write the user-facing message
- Place in Content & Copy PRD §7
- Match tone: apologetic, clear, action-oriented

**Step 5: Author Email Copy**
- Welcome, password reset, account deletion confirmation, etc.
- Subject, preview text, body, CTA
- Match voice and tone

**Step 6: Author Legal Copy**
- Terms consent, privacy consent, data notice
- Required disclosures per Safety PRD §10
- Cookie notice

**Step 7: Build Design Tokens**
- Brand colors (3-5)
- Semantic colors (success, warning, error, info, safety)
- Neutral scale (50-900)
- Typography scale (xs to 4xl)
- Spacing scale (1 to 16)
- Border / radius scale
- Shadow scale
- Animation tokens
- All exported as `/design/tokens.json`

**Step 8: Build Component Library**
- Button (variants: primary, secondary, destructive, ghost, link; sizes: sm, md, lg; states: default, hover, focus, active, loading, disabled)
- Input (states: default, focus, error, disabled, read-only)
- Modal (sizes: sm, md, lg, full; behaviors: focus trap, escape close, overlay close, persistent)
- Toast (variants: success, error, warning, info, safety; auto-dismiss vs manual)
- Safety / Crisis Banner (special: per Safety PRD Domain 1)
- Card, Tabs, Accordion, Select, Checkbox, Radio, etc.
- All states defined explicitly
- All accessibility requirements met

**Step 9: Document Responsive Behavior**
- Per breakpoint: mobile (<768), tablet (768-1024), desktop (>1024)
- Layout changes, navigation changes, font size changes

**Step 10: Enforce "No Hardcoding" Rule**
- Frontend Agent may not use a color, font, or copy string not from the registry
- Lint rule: `npm run lint:copy` and `npm run lint:tokens`
- CI fails on any hardcoded string or color

**Step 11: Sign-off**
- Emit `ContentDesignSignOff`
- Set `handoffReady: true` only if all checks pass

### 6.2 Decision Logic
**Decision: Voice for a new feature**
```
IF feature is crisis-adjacent
THEN voice: extremely calm, non-directive, no urgency
ELSE IF feature is settings/admin
THEN voice: clear, direct, no warmth required
ELSE voice: warm, supportive, professional
```

**Decision: Color for a new semantic**
```
IF semantic is crisis/safety
THEN use color-safety (highest visibility)
ELSE IF semantic is success/error
THEN use existing semantic color
ELSE create new semantic color with 4.5:1 contrast minimum
```

### 6.3 Iteration Behavior
- Iterates over: screens, error codes, components
- Loops on lint failures until clean

### 6.4 Concurrency Rules
- May run concurrently with: most agents (read-mostly on content)
- Must coordinate with: Frontend Agent (any copy change requires Frontend refresh)
- Must not run concurrently with: another Content & Design Agent

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| New screen added | Add all copy keys, add to copy registry |
| New error code added | Add message to Content PRD §7 |
| New component needed | Add to design system with all states |
| Copy key collision | Rename one, update registry |
| Color contrast failure | Adjust token, verify all usage |
| Voice drift detected | Flag to Orchestrator, re-anchor |
| Localization required (future) | Each key already structured for i18n (no concatenated strings) |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Content & Copy PRD | All (this agent's own output) |
| Design System & Component Reference | All (this agent's own output) |
| Experience & Access PRD | Screen contracts (drives copy requirements) |
| Error & State Reference | Error codes (drives error messages) |
| Safety, Privacy & Control PRD | §5 (voice rules), §10 (legal copy) |
| Master PRD Index | Precedence rules |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must coordinate with | Frontend Agent | Any copy/token change requires Frontend refresh |
| Must run after | Documentation Agent | Cannot write copy for screens that don't exist yet |
| May run concurrently | Backend Agent | Independent |
| Triggered by | Orchestrator | Phase unlocks |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| Contrast checker (tool) | Verify WCAG AA | Low (can verify manually) |
| Storybook | Document components | Medium |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `COPY_KEY_MISSING` | Screen references a copy key that doesn't exist | High | Add the key |
| `TOKEN_MISSING` | Code references a token that doesn't exist | High | Add the token |
| `COPY_HARDCODED` | Hardcoded string in code (lint failure) | Medium | Replace with copy key |
| `TOKEN_HARDCODED` | Hardcoded color/font in code (lint failure) | Medium | Replace with token |
| `CONTRAST_FAILED` | Color contrast below WCAG AA | High | Adjust color |
| `INCOMPLETE_STATES` | Component missing a state | Medium | Add the state |

## 10. Logging & Observability
- Log every copy change (event `COPY_UPDATED`) with key, old value (if any), new value
- Log every token change (event `TOKEN_UPDATED`) with token name, old value, new value
- Log every lint failure (event `LINT_FAILED`) with rule, file, line
- Never log: full copy with PII (avoid in general — copy is not PII normally)

## 11. Acceptance Criteria
- [ ] Every UI string in the app resolves to a key in the copy registry
- [ ] No key in the registry is unused (or marked deprecated)
- [ ] Every color used in the app resolves to a token
- [ ] Every font size resolves to a typography token
- [ ] Every spacing value resolves to a spacing token
- [ ] All components implement all specified states
- [ ] All color contrast meets WCAG AA
- [ ] Reduced-motion is respected in all animations
- [ ] Safety/crisis component uses `color-safety` + icon + text (never color alone)
- [ ] No component contains hardcoded user-facing strings
- [ ] Lint rules in CI block hardcoded strings and tokens
- [ ] ContentDesignSignOff all PASS

## 12. Test Cases
- 12.1 Happy: every screen has copy, every error has message, every color has token → sign-off PASS.
- 12.2 Error: copy key missing in code → lint fails, build blocks.
- 12.3 Edge: new screen added → registry auto-extended, all strings documented.

---

**END OF CONTENT & DESIGN AGENT PRD**