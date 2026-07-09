# [Product Name] – UX PRD

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** [Product Name] – Master PRD Index
**Precedence:** 3rd (overrides Technical, Data, Content PRDs)

---

## ⚠️ Precedence Compliance Block

This document defines the user experience. It governs how users perceive, navigate, and complete tasks in the product. It does not define the business logic (Core Systems PRD), the technical implementation (Technical Architecture PRD), or the actual words on screen (Content & Copy PRD).

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | Users must always be able to pause, exit, or delete | Every flow must have an escape route designed in |
| Project Brief | Core principles govern every design decision | Each design decision must be traceable to a brief principle |
| User Personas | Experience serves personas | Every flow must serve at least one documented persona |
| Core Systems PRD | State machine definitions | UX flows must respect all state transitions |
| Experience & Access PRD | Authentication and onboarding flows | Auth/onboarding flows defined here must align with that document |
| Content & Copy PRD | All UI copy | Every visible string must reference a Content PRD key |
| Roles & Permissions Matrix | Role-based access | UX must hide/disable UI per role permissions |
| Requirements Summary | Functional and non-functional requirements | Every UX flow must trace to a requirement ID |

---

## 1. Purpose of This Document

This document defines the user experience — what users see, how they interact, and how the product responds. It sits between the Experience & Access PRD (which defines *access*) and the Content & Copy PRD (which defines *words*). It defines **interaction**.

This is the document designers and frontend engineers work from. It is detailed enough to build from without making implementation decisions for the engineer.

---

## 2. RLM Compliance

| Field | Value |
|---|---|
| Information Density | O(F×S) — F flows × S screens per flow. Quadratic when flows share screens. |
| Density Explanation | Each flow traverses multiple screens; screens are shared across flows; the interaction graph is non-trivial |
| Decomposition Required | Yes — process one flow at a time; build screen inventory first; verify cross-flow screen reuse at end |
| Decomposition Strategy | Step 0: enumerate all screens. Step 1: enumerate all flows. Step 2: for each flow, walk through screens. Step 3: cross-check screen reuse. Step 4: verify state machine compliance |

---

## 3. Information Architecture

### 3.1 Site Map

Visual or textual representation of the entire product's screen hierarchy.

```
[Root]
├── [Public]
│   ├── Landing
│   ├── Pricing
│   └── [Other public]
├── [Authenticated]
│   ├── Dashboard
│   ├── [Section 1]
│   │   ├── [Sub-section 1]
│   │   └── [Sub-section 2]
│   ├── [Section 2]
│   └── Settings
└── [System]
    ├── 404
    ├── 500
    └── Maintenance
```

### 3.2 Navigation Model

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Primary nav | [Bottom tab / hamburger] | [Sidebar collapsed] | [Sidebar expanded] |
| Secondary nav | [Pattern] | [Pattern] | [Pattern] |
| Tertiary nav | [Pattern] | [Pattern] | [Pattern] |

**Navigation state machine:**
| State | Value | Description | Transitions |
|---|---|---|---|
| Hidden | `NAV_HIDDEN` | Nav not visible | → `VISIBLE` on user action |
| Visible | `NAV_VISIBLE` | Nav shown | → `HIDDEN` on dismiss |

---

## 4. Screen Inventory

Every screen the user can land on, with metadata. The complete inventory comes from Experience & Access PRD; this section adds UX metadata.

| Screen ID | Route | Purpose | Persona(s) | Auth | Onboarding | Key States |
|---|---|---|---|---|---|---|
| `[screen_id]` | `/[route]` | [One-line purpose] | [Persona IDs] | Req | Req | [State values] |

---

## 5. Design System Reference

This document references (does not redefine) the design system. The canonical design tokens, components, and patterns are defined in the Design System & Component Reference document.

**Used design tokens:**
- Color: `[token.name]`
- Typography: `[token.name]`
- Spacing: `[token.name]`
- Motion: `[token.name]`

**Used components:**
- `[Component Name]` (from Design System §X)
- `[Component Name]`

**Custom components (if any):**
- `[Custom Component]` — used by [Screen], requires [Design System §X update]

---

## 6. User Flows (Deterministic)

Every flow is a sequence of screens with user actions and system responses. Flows are written in unambiguous terms — no "etc.", no "user figures out next step." Every state has a next state.

### 6.1 Flow: [Flow Name]

**Flow ID:** `flow_[flow_id]`
**Persona(s):** [Persona IDs]
**Trigger:** [What initiates this flow]
**Outcome:** [What the user has at the end]
**Requirements traced:** [F-AUTH-001, F-CORE-005, ...]

**Pre-conditions:**
- [State 1 — e.g., "User is authenticated"]
- [State 2 — e.g., "User has completed onboarding"]

**Flow steps:**

| # | Screen | User Action | System Response | State After | Failure Path |
|---|---|---|---|---|---|
| 1 | `[screen]` | [Action — tap "Continue"] | [System validates input, navigates to next screen] | [State values] | [What happens on error] |
| 2 | `[screen]` | [Action] | [Response] | [State] | [Failure path] |
| 3 | `[screen]` | [Action] | [Response] | [State — final] | [Failure path] |

**Post-conditions:**
- [State 1 — e.g., "User data persisted to DB"]
- [State 2 — e.g., "Analytics event fired"]

**Escape routes (must exist for every flow):**
- [Escape 1 — e.g., "User can tap 'Cancel' at any step"]
- [Escape 2 — e.g., "User can navigate to home via persistent back button"]

**Edge cases:**
- [Edge case 1 — e.g., "What happens if network drops mid-step"]
- [Edge case 2 — e.g., "What happens if user backgrounds the app"]

**Empty state:** [What the user sees if there's no data]
**Error state:** [What the user sees if the flow fails terminally]
**Loading state:** [What the user sees while the system is processing]

---

### 6.2 Flow: [Flow Name]
*(Repeat structure for each flow)*

---

## 7. State-Driven UI Patterns

For each stateful interaction, document the UI patterns. These are reusable across flows.

### 7.1 Loading States

| Pattern | When Used | Visual Treatment | Accessibility |
|---|---|---|---|
| Inline spinner | [Action < 1s] | [Spinner + label] | aria-live="polite" |
| Skeleton | [Loading list/card] | [Skeleton placeholders] | aria-busy="true" |
| Full-page loader | [Initial load] | [Centered spinner] | Focus management required |
| Optimistic UI | [Predictable action] | [Show result, roll back on error] | Rollback must be announced |

### 7.2 Empty States

Every list/collection screen has three empty states:

| Empty State | When | Treatment |
|---|---|---|
| First-time empty | [User has no items] | [Illustration + CTA to create first item] |
| Filtered empty | [User filtered to no results] | [Message + clear filter button] |
| Error empty | [Couldn't load] | [Error message + retry button] |

**Empty state copy:** Reference Content & Copy PRD `screen.[id].empty_state.*` keys.

### 7.3 Error States

| Error Type | Visual | Behavior | Copy Reference |
|---|---|---|---|
| Inline validation | [Red text under field] | [Don't block submit, show on blur/submit] | `error.inline.*` |
| Form-level error | [Banner at top] | [Block submit, focus first error] | `error.form.*` |
| Network error | [Toast or inline] | [Retry button, offline indicator] | `error.network.*` |
| Server error | [Full-page error] | [Retry + support link] | `error.server.*` |
| Permission denied | [Inline message] | [Explain what permission, link to settings] | `error.permission.*` |

### 7.4 Confirmation Patterns

| Action Risk | Pattern | Example |
|---|---|---|
| Low (reversible) | [None / inline] | [Edit name] |
| Medium (irreversible but localized) | [Inline confirm] | [Delete item] |
| High (irreversible and global) | [Modal with explicit "type to confirm"] | [Delete account] |

---

## 8. Responsive Behavior

### 8.1 Breakpoints

| Label | Range | Tailwind Prefix |
|---|---|---|
| Mobile | < 768px | `sm:` |
| Tablet | 768px – 1024px | `md:` |
| Desktop | > 1024px | `lg:` |
| Wide | > 1440px | `xl:` |

### 8.2 Component Behavior

| Component | Mobile | Tablet | Desktop | Wide |
|---|---|---|---|---|
| Navigation | [Behavior] | [Behavior] | [Behavior] | [Behavior] |
| Modal | [Full screen] | [Centered, 480px] | [Centered, 560px] | [Centered, 640px] |
| Table | [Card stack] | [Horizontal scroll] | [Full table] | [Full table] |
| Form | [Single column, full width] | [Single column, max 480px] | [Single column, max 560px] | [Two column] |
| [Component] | [Behavior] | [Behavior] | [Behavior] | [Behavior] |

### 8.3 Touch Targets

| Element | Min Size | Spacing |
|---|---|---|
| Primary CTA | 48×48 px | 8px between |
| Secondary CTA | 44×44 px | 8px between |
| Inline link | 44 px tall | — |
| Tap target padding | 8px | — |

---

## 9. Interaction Patterns

### 9.1 Gestures (Mobile)

| Gesture | Where Used | System Response | Reversible |
|---|---|---|---|
| Swipe left | [List item] | [Reveal action menu] | [Swipe back] |
| Swipe right | [Edge] | [Navigate back] | [Re-swipe] |
| Pull to refresh | [Top of list] | [Refresh data] | [Release cancels] |
| Long press | [Item] | [Show context menu] | [Dismiss] |

### 9.2 Keyboard Shortcuts (Desktop)

| Shortcut | Action | Context |
|---|---|---|
| Cmd/Ctrl + K | [Open command palette] | Global |
| Esc | [Close modal / cancel] | Modal |
| Tab | [Focus next] | All |
| Shift + Tab | [Focus previous] | All |
| Enter | [Submit / activate] | Form/button |
| [Shortcut] | [Action] | [Context] |

### 9.3 Animation & Motion

| Pattern | Duration | Easing | Purpose |
|---|---|---|---|
| Page transition | 200ms | ease-out | Spatial orientation |
| Modal open | 150ms | ease-out | Affordance |
| Modal close | 100ms | ease-in | Affordance |
| State change (toggle) | 120ms | ease-out | Feedback |
| Loading shimmer | 1200ms loop | linear | Indication |

**Reduced motion:** All animations must be disabled when `prefers-reduced-motion: reduce` is set. The disabled state must still provide clear visual feedback.

---

## 10. Accessibility Requirements

| Requirement | Standard | Verification |
|---|---|---|
| Color contrast (text) | WCAG AA — 4.5:1 | Automated + manual audit |
| Color contrast (UI) | WCAG AA — 3:1 | Automated + manual audit |
| Focus indicators | Visible on all interactive elements | Manual keyboard test |
| Screen reader | All flows usable with VoiceOver + NVDA | Manual test with each |
| Keyboard navigation | All flows usable with keyboard only | Manual keyboard test |
| Form labels | All inputs have associated labels | Automated + manual |
| Error association | Errors announced and tied to fields | Screen reader test |
| Touch target size | 44×44 minimum | Manual + automated |
| Text scaling | UI usable at 200% zoom | Manual test |

---

## 11. Flow × Screen × Requirement Matrix

Every flow, every screen it touches, and the requirements it satisfies. This is the inverse of the Requirements Summary traceability matrix.

| Flow | Screens | Requirements |
|---|---|---|
| [Flow 1] | [screen.1, screen.2, ...] | [F-AUTH-001, F-CORE-003, ...] |
| [Flow 2] | [screen.X, ...] | [F-CORE-005, ...] |

**Coverage gaps:**
- [Any screen not in any flow — orphan screen]
- [Any requirement with no flow — orphan requirement]

---

## 12. Design Decisions Log

Major design decisions and their rationale. Captures the *why* so future redesigns don't re-litigate.

| Date | Decision | Rationale | Alternatives Considered |
|---|---|---|---|
| [Date] | [Decision] | [Why] | [What else was considered] |
| [Date] | [Decision] | [Why] | [What else was considered] |

---

## 13. Verification Sub-Call Requirements

Before this document is marked complete:

1. **Flow completeness:** Every persona has at least one flow that serves their goals
2. **State machine compliance:** Every flow respects all state transitions in Core Systems PRD
3. **Requirement coverage:** Every flow traces to at least one requirement ID
4. **Permission compliance:** Every flow respects the Roles & Permissions Matrix
5. **Accessibility:** Every screen meets WCAG AA at minimum
6. **Responsive coverage:** Every screen is specified for all four breakpoints
7. **Escape route coverage:** Every flow has at least one escape route

---

## 14. Acceptance Criteria

- [ ] Information architecture is complete and unambiguous
- [ ] Every screen in the inventory has all required metadata
- [ ] Every flow is fully specified (trigger, steps, post-conditions, escape routes, edge cases)
- [ ] Every flow has all three state specifications: empty, error, loading
- [ ] Every flow traces to at least one persona and at least one requirement
- [ ] Every screen respects the roles & permissions matrix
- [ ] Every screen meets accessibility requirements
- [ ] Every component behavior is specified for all breakpoints
- [ ] Every flow has at least one escape route
- [ ] Design decisions are logged with rationale
- [ ] No orphan screens, no orphan requirements

---

**END OF UX PRD**
