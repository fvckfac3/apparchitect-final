# [Product Name] – Experience & Access PRD

**Version:** 2.0  
**Status:** Authoritative · Build-Ready  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** 3rd (overrides Technical, Data, Content PRDs)

---

## ⚠️ Precedence Compliance Block

Before implementing anything in this document, verify:

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | No access without authentication — no anonymous access permitted | All protected routes must check auth state before rendering |
| Safety, Privacy & Control PRD | User controls always accessible — pause, exit, modify preferences | Navigation must never trap a user in an unescapable state |
| Core Systems PRD | Onboarding data object schema | Fields collected during onboarding must match canonical profile schema exactly |
| Core Systems PRD | Auth state values | Auth state enum values must match Core Systems definitions exactly |
| Error & State Reference | Auth and onboarding state transitions | All state transitions here must match registered transitions |
| Content & Copy PRD | All UI strings | Every label, button, and message on every screen must reference Content PRD keys |
| Roles & Permissions Matrix | Route access by role | Screen access rules must match the permissions matrix |

---

## 1. Purpose of This Document

This document defines how users enter, move through, and experience [Product Name]. It governs authentication, onboarding, navigation, screen structure, and responsive behavior.

This document does not define core product logic or AI behavior. Those are governed by the Core Systems PRD.

---

## 2. Systems Covered

1. Authentication System
2. Onboarding System
3. Global Navigation Model
4. Screen Hierarchy & Page Contracts
5. Responsive Layout Behavior
6. State Persistence & Recovery

---

## 3. Target User Context (Binding)

All experience decisions must assume:
- [User context assumption 1 — e.g., "Users may be on slow mobile connections"]
- [User context assumption 2 — e.g., "Users may have cognitive fatigue"]
- [User context assumption 3 — e.g., "Users may return after long gaps"]

Design must favor **[primary quality]** over **[what to deprioritize]**.

---

## 4. Authentication System

### 4.1 Purpose
[What authentication accomplishes and why it matters for this product. 2–3 sentences.]

### 4.2 Supported Methods

| Method | v1 Supported | Notes |
|---|---|---|
| Email + Password | [Yes / No] | — |
| Google OAuth | [Yes / No] | — |
| Magic Link | [Yes / No] | — |
| [Other] | [Yes / No] | — |

No other authentication methods are permitted in v1.

### 4.3 Auth States

| State | Value | Description | Allowed Transitions |
|---|---|---|---|
| Unauthenticated | `UNAUTHENTICATED` | No valid session | → `AUTHENTICATED` |
| Authenticated | `AUTHENTICATED` | Valid session confirmed | → `UNAUTHENTICATED` |

Auth state must be fully resolved before rendering any protected screen. A loading state must be shown while resolution is in progress — never flash protected content.

### 4.4 User Flows

**Flow A: New User Signup**
1. User lands on Landing Page
2. Clicks "[CTA label from Content PRD]"
3. Selects signup method
4. Enters credentials
5. Backend creates account
6. Auth state → `AUTHENTICATED`
7. Redirect to `/onboarding`

**Flow B: Returning User Login**
1. User navigates to `/login`
2. Submits credentials
3. Session validated
4. Redirect based on onboarding status:
   - Onboarding `NOT_STARTED` or `IN_PROGRESS` → `/onboarding`
   - Onboarding `COMPLETED` → `/dashboard`

**Flow C: Password Reset** *(if email/password auth enabled)*
1. User clicks "[forgot password label from Content PRD]" on login screen
2. Enters email address
3. Reset email sent (via email service — see Data & Integration PRD)
4. User clicks link in email
5. User sets new password
6. Redirect to `/login` with confirmation message

**Flow D: OAuth** *(if OAuth enabled)*
1. User clicks "[OAuth provider] button"
2. Redirect to OAuth provider
3. User authenticates with provider
4. Provider redirects back with auth code
5. Backend exchanges code for session
6. Auth state → `AUTHENTICATED`
7. Redirect per onboarding status

### 4.5 Auth Error Handling

| Error | Copy PRD Key | Behavior |
|---|---|---|
| Invalid credentials | `auth.error.invalid_credentials` | Inline error on form, no redirect |
| Email already exists | `auth.error.email_exists` | Inline error, suggest login |
| OAuth failure | `auth.error.oauth_failed` | Retry option displayed |
| Network error | `auth.error.network` | Blocking error state |
| Session expired | `auth.error.session_expired` | Redirect to login with message |

### 4.6 Session Rules

| Setting | Value |
|---|---|
| Storage method | HTTP-only cookie |
| Session duration | [30] days of inactivity |
| Invalidated on | Explicit logout, password change, account deletion |
| Concurrent sessions | [Allowed / Not allowed — specify] |

---

## 5. Onboarding System

### 5.1 Purpose
[What onboarding achieves before the user accesses core features. Why completion is mandatory.]

### 5.2 Onboarding States

| State | Value | Description | Allowed Transitions |
|---|---|---|---|
| Not started | `NOT_STARTED` | Authenticated but onboarding not begun | → `IN_PROGRESS` |
| In progress | `IN_PROGRESS` | Started but not complete | → `COMPLETED` |
| Completed | `COMPLETED` | All steps done; full access granted | None — terminal |

Users may not access [protected areas] until onboarding status is `COMPLETED`. This must be enforced at both route level and API level.

### 5.3 Onboarding Steps (Canonical)

Steps must be completed in order. No step may be skipped.

**Step 1: [Step Name]**
| Element | Content PRD Key |
|---|---|
| Headline | `onboarding.step1.headline` |
| Body | `onboarding.step1.body` |
| CTA | `onboarding.step1.cta` |

- Data collected: [field name: type, description]
- Completion condition: [What triggers step completion]
- Validation: [Any required fields or consent]

**Step 2: [Step Name]**
| Element | Content PRD Key |
|---|---|
| Headline | `onboarding.step2.headline` |
| Body | `onboarding.step2.body` |
| CTA | `onboarding.step2.cta` |

- Data collected: [field name: type]
- Completion condition: [Condition]
- Validation: [Validation rules]

**Step N: Completion**
| Element | Content PRD Key |
|---|---|
| Headline | `onboarding.complete.headline` |
| Body | `onboarding.complete.body` |
| CTA | `onboarding.complete.cta` |

- Sets onboarding status → `COMPLETED`
- Redirects to `/dashboard`

### 5.4 Onboarding Resume Behavior
On refresh, browser close, or return visit: resume at the last incomplete step. Step state is persisted server-side — loss of local state must not restart onboarding.

### 5.5 Onboarding Data Produced

```json
{
  "userId": "uuid",
  "onboardingStatus": "COMPLETED",
  "completedAt": "ISO-8601",
  "[field from step 1]": "[value]",
  "[field from step 2]": "[value]"
}
```

Must match canonical profile schema in Core Systems PRD exactly.

---

## 6. Global Navigation Model

### 6.1 Navigation Structure

| Item | Route | Icon | Visible To | Active When |
|---|---|---|---|---|
| [Label] | `/[route]` | [icon] | All authenticated | Route matches |
| [Label] | `/[route]` | [icon] | All authenticated | Route matches |
| [Label] | `/[route]` | [icon] | All authenticated | Route matches |
| Settings | `/settings` | [icon] | All authenticated | Route matches |

Copy for all navigation labels: see Content & Copy PRD → Section [X].

### 6.2 Navigation Rules

- Navigation is persistent on tablet and desktop
- Navigation is [bottom bar / hamburger menu] on mobile
- Navigation is **disabled** during: [conditions — e.g., active exercise, mid-flow]
- Exception: [e.g., Pause button remains accessible during active flow]
- Back navigation returns to last stable state — never to a broken mid-flow state

---

## 7. Screen Hierarchy & Page Contracts

### 7.1 Screen Inventory

| Screen | Route | Auth Required | Onboarding Required | Role Required |
|---|---|---|---|---|
| Landing | `/` | No | No | None |
| Signup | `/signup` | No | No | None |
| Login | `/login` | No | No | None |
| Onboarding | `/onboarding` | Yes | No | Any |
| Dashboard | `/dashboard` | Yes | Yes | Any |
| [Screen] | `/[route]` | Yes | Yes | [Role] |
| Settings | `/settings` | Yes | Yes | Any |

### 7.2 Per-Screen Contracts

**Landing (`/`)**
| Element | Value |
|---|---|
| Purpose | Introduce product and drive signup |
| Must Load Before Render | Nothing — public page |
| Primary Action | "[CTA label]" → `/signup` |
| Copy Reference | Content PRD → Section [X] |
| Empty State | N/A — static page |
| Error State | N/A |

---

**Login (`/login`)**
| Element | Value |
|---|---|
| Purpose | Authenticate returning users |
| Must Load Before Render | Auth state confirmed as `UNAUTHENTICATED` (redirect if already authenticated) |
| Primary Action | Submit credentials |
| Copy Reference | Content PRD → Section [X] |
| Error States | See Section 4.5 |

---

**Onboarding (`/onboarding`)**
| Element | Value |
|---|---|
| Purpose | Collect required profile data; prepare user for core product |
| Must Load Before Render | Auth state `AUTHENTICATED`, onboarding status loaded |
| Primary Action | Complete current step |
| Copy Reference | Content PRD → Section [X] |
| Resume Behavior | Load last incomplete step |
| Error State | Step save failure → inline error, do not advance |

---

**Dashboard (`/dashboard`)**
| Element | Value |
|---|---|
| Purpose | Primary app screen post-onboarding |
| Must Load Before Render | Auth state, user profile, [any other required data] |
| Primary Content | [What is displayed] |
| Primary Action | [Main CTA] |
| Empty State | Copy Reference: `dashboard.empty_state` |
| Error State | Copy Reference: `dashboard.error_state` |

---

**Settings (`/settings`)**
| Element | Value |
|---|---|
| Purpose | User preferences, account management, data controls |
| Must Load Before Render | Auth state, user profile |
| Required Controls | Account deletion, data export, preference modification |
| Copy Reference | Content PRD → Section [X] |

> *(Repeat for each screen in the inventory)*

---

## 8. Responsive Layout Behavior

### 8.1 Breakpoints

| Label | Range | Tailwind Prefix |
|---|---|---|
| Mobile | < 768px | `sm:` |
| Tablet | 768px – 1024px | `md:` |
| Desktop | > 1024px | `lg:` |

### 8.2 Layout Behavior

| Context | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navigation | Bottom tab bar | Sidebar (collapsed) | Sidebar (expanded) |
| Page layout | Single column | [Two column / Single] | [Two column / Three column] |
| Modals | Full screen | Centered modal | Centered modal |
| Forms | Full width | [Max width: 480px] | [Max width: 560px] |
| [Component] | [Behavior] | [Behavior] | [Behavior] |

### 8.3 Component Behavior Overrides

| Component | Mobile Behavior | Tablet Behavior | Desktop Behavior |
|---|---|---|---|
| Navigation | Bottom tab bar | Left sidebar, icon-only | Left sidebar, icon + label |
| [Component] | [Behavior] | [Behavior] | [Behavior] |

---

## 9. State Persistence & Recovery

| State | Persistence Method | Recovery on Refresh | Recovery on Return Visit |
|---|---|---|---|
| Auth session | HTTP-only cookie | Restore — no re-login needed | Restore if not expired |
| Onboarding progress | Server-side DB | Resume at last incomplete step | Resume at last incomplete step |
| Navigation state | Session memory | Restore last visited screen | Return to dashboard |
| Active flow state | Server-side DB | Resume active flow | Resume active flow |
| [State] | [Method] | [Behavior] | [Behavior] |

---

## 10. Acceptance Criteria

- [ ] No protected screen renders before auth state resolves
- [ ] No loading flash of protected content before auth check completes
- [ ] No [protected feature] accessible before onboarding `COMPLETED` — enforced at route AND API level
- [ ] All auth error states display correct copy from Content PRD
- [ ] Onboarding resumes at last incomplete step on refresh or return
- [ ] Navigation disabled correctly during active flows
- [ ] All screen contracts implemented — required data loads before render
- [ ] Responsive layout correct at all three breakpoints
- [ ] No session loss on refresh in any state
- [ ] All copy references resolve to existing Content PRD keys

## Cross-Document Validation

This section enumerates the cross-document checks that involve the Experience & Access PRD. Agents must run all applicable checks before treating the suite as build-ready.

### Inbound Dependencies (this PRD consumes)

| Check ID | Source Document | Rule | Severity |
|---|---|---|---|
| CD-EXP-IN-001 | Master PRD Index | productName, version, and tier anchors must match §3 of the index | Critical |
| CD-EXP-IN-002 | Master PRD Index | This document's precedence declaration must be consistent with §6 of the index | Critical |

### Outbound Dependencies (this PRD produces)

| Check ID | Target Document | Rule | Severity |
|---|---|---|---|
| CD-EXP-OUT-001 | All downstream documents | Every schema, error code, role, and copy key defined here must be referenced exactly as written | Critical |
| CD-EXP-OUT-002 | Master PRD Index | Any change to anchors in this document must be propagated to §3 of the index | Critical |

### Tier-Specific Cross-Checks

| Check ID | Rule | Severity |
|---|---|---|
| CD-EXP-TIER-001 | No field, code, or role defined in this document is duplicated by another base PRD at a different tier | Critical |
| CD-EXP-TIER-002 | Conflicts between this document and any subordinate Agent PRD are resolved in favor of this document | High |

### Resolution Protocol

1. Identify the conflict and the documents involved.
2. Apply the Master PRD Index §6 precedence order.
3. If this document is higher-precedence: the other document must be updated and its version incremented.
4. If this document is lower-precedence: update this document to match.
5. Record the resolution in the Master PRD Index §5 (Known Conflicts) and in the Version History below.

---

## Version History

| Version | Date | Author | Changes |
|---|---|---|---|
| 2.0 | [Date] | [Name] | Initial v2 release with RLM principles |
| 2.1 | [Date] | [Name] | Added Cross-Document Validation and Version History sections per RLM compliance |

---

**END OF EXPERIENCE & ACCESS PRD**