# [Product Name] – Design System & Component Reference

**Version:** 2.0  
**Status:** Authoritative · Single Source of Truth for All Visual Decisions  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** Peer to Content & Copy PRD — this document wins on visual and component specifications

---

## ⚠️ Precedence Compliance Block

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | Color alone must never convey safety-critical meaning | Crisis banners and safety alerts must use icon + color + text together |
| Safety, Privacy & Control PRD | Reduced motion must be respected | All animations must check `prefers-reduced-motion` |
| Experience & Access PRD | Screen contracts define component usage contexts | Component behavior must be consistent with page contract specs |
| Content & Copy PRD | All button labels and UI strings from Content PRD | No component may hardcode a string — all text via Content PRD keys |

---

## 1. Purpose of This Document

This document defines every visual and interactive decision for [Product Name]. Color, typography, spacing, component variants, interaction states, and animation are all specified here. No agent may make visual decisions not covered in this document.

---

## 2. Design Principles

| Principle | Meaning in Practice |
|---|---|
| [e.g., Calm over stimulating] | [e.g., No bright saturated colors; no rapid animations] |
| [e.g., Clarity over cleverness] | [e.g., Standard patterns over novel interactions] |
| [e.g., Accessible by default] | [e.g., WCAG AA minimum, keyboard navigable, screen reader compatible] |
| [e.g., Consistent over creative] | [e.g., Components behave the same way in every context] |

---

## 3. Color System

### 3.1 Brand Colors

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `color-brand-primary` | `#[hex]` | `rgb([r],[g],[b])` | Primary CTAs, key UI elements, focus states |
| `color-brand-secondary` | `#[hex]` | `rgb([r],[g],[b])` | Supporting brand accents |
| `color-brand-tertiary` | `#[hex]` | `rgb([r],[g],[b])` | Subtle accents, hover states |

### 3.2 Semantic Colors

| Token | Hex | Usage | Contrast Ratio on White |
|---|---|---|---|
| `color-success` | `#[hex]` | Success states, confirmations | [X]:1 |
| `color-warning` | `#[hex]` | Warning states, cautions | [X]:1 |
| `color-error` | `#[hex]` | Error states, destructive actions | [X]:1 |
| `color-info` | `#[hex]` | Informational states | [X]:1 |
| `color-safety` | `#[hex]` | Safety/crisis banners — highest visibility | [X]:1 |

### 3.3 Neutral Colors

| Token | Hex | Usage |
|---|---|---|
| `color-neutral-900` | `#[hex]` | Primary text |
| `color-neutral-700` | `#[hex]` | Secondary text |
| `color-neutral-500` | `#[hex]` | Placeholder, disabled text |
| `color-neutral-300` | `#[hex]` | Borders, dividers |
| `color-neutral-100` | `#[hex]` | Subtle backgrounds |
| `color-neutral-50` | `#[hex]` | Page background |
| `color-white` | `#FFFFFF` | Cards, surfaces |

### 3.4 Color Rules

- Never use a color not defined in this system
- Minimum contrast: 4.5:1 for normal text (WCAG AA)
- Minimum contrast: 3:1 for large text and UI components
- Never use color alone to convey meaning — always pair with icon or label
- Safety/crisis elements must always use `color-safety` + an icon + text — never color alone

---

## 4. Typography

### 4.1 Font Families

| Token | Font | Fallback Stack | Usage |
|---|---|---|---|
| `font-primary` | `[Font Name]` | `system-ui, -apple-system, sans-serif` | All body text, UI |
| `font-heading` | `[Font Name]` | `system-ui, sans-serif` | Headings (if different) |
| `font-mono` | `[Font Name]` | `'Courier New', monospace` | Code, technical content |

### 4.2 Type Scale

| Token | Size | Line Height | Weight | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `text-xs` | 12px | 16px | 400 | 0 | Labels, captions, helper text |
| `text-sm` | 14px | 20px | 400 | 0 | Body small, error messages |
| `text-base` | 16px | 24px | 400 | 0 | Body default |
| `text-lg` | 18px | 28px | 400 | 0 | Body large |
| `text-xl` | 20px | 28px | 600 | -0.01em | Subheadings |
| `text-2xl` | 24px | 32px | 700 | -0.02em | Heading small |
| `text-3xl` | 30px | 36px | 700 | -0.02em | Heading medium |
| `text-4xl` | 36px | 40px | 800 | -0.03em | Heading large, display |

### 4.3 Typography Rules

- Never use a font size outside the type scale
- Body text minimum: `text-base`, `color-neutral-900`
- Placeholder text: `text-sm`, `color-neutral-500`
- Error text: `text-sm`, `color-error`
- Never use italic for functional UI text (labels, errors, buttons)
- Never use font-weight below 400 in UI

---

## 5. Spacing System

*All spacing is multiples of 4px.*

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `space-1` | 4px | `p-1` / `m-1` | Minimum internal padding |
| `space-2` | 8px | `p-2` / `m-2` | Tight spacing |
| `space-3` | 12px | `p-3` / `m-3` | Small spacing |
| `space-4` | 16px | `p-4` / `m-4` | Default component padding |
| `space-6` | 24px | `p-6` / `m-6` | Section spacing |
| `space-8` | 32px | `p-8` / `m-8` | Large section spacing |
| `space-10` | 40px | `p-10` / `m-10` | Page-level padding |
| `space-12` | 48px | `p-12` / `m-12` | Large layout spacing |
| `space-16` | 64px | `p-16` / `m-16` | Section separators |

---

## 6. Border & Radius System

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Inputs, small elements |
| `radius-md` | 8px | Buttons, cards |
| `radius-lg` | 12px | Modals, panels |
| `radius-xl` | 16px | Large cards |
| `radius-full` | 9999px | Pills, avatars, badges |
| `border-default` | `1px solid color-neutral-300` | Default borders |
| `border-focus` | `2px solid color-brand-primary` | Focus states |
| `border-error` | `1px solid color-error` | Error states |
| `border-safety` | `2px solid color-safety` | Safety/crisis banners |

---

## 7. Shadow System

| Token | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `shadow-none` | `none` | Flat elements |

---

## 8. Animation & Transition System

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `transition-fast` | 100ms | `ease-out` | Hover states, instant feedback |
| `transition-base` | 200ms | `ease-out` | Button states, toggles |
| `transition-slow` | 300ms | `ease-in-out` | Panel slides, modals |
| `transition-none` | 0ms | — | Reduced motion fallback |

**Reduced Motion Rule:**  
All transitions must check `prefers-reduced-motion`. When active, set all transitions to `transition-none`. No exceptions.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

---

## 9. Component Library

### 9.1 Button

**Variants:**

| Variant | Background | Text | Border | Hover | Disabled |
|---|---|---|---|---|---|
| `primary` | `color-brand-primary` | `color-white` | None | Darken 10% | 50% opacity, cursor-not-allowed |
| `secondary` | `color-white` | `color-brand-primary` | `border-default` | `color-neutral-50` bg | 50% opacity |
| `destructive` | `color-error` | `color-white` | None | Darken 10% | 50% opacity |
| `ghost` | Transparent | `color-neutral-700` | None | `color-neutral-100` bg | 50% opacity |
| `link` | Transparent | `color-brand-primary` | None | Underline | 50% opacity |

**Sizes:**

| Size | Height | H-Padding | Font |
|---|---|---|---|
| `sm` | 32px | `space-3` | `text-sm`, `font-medium` |
| `md` | 40px | `space-4` | `text-base`, `font-medium` |
| `lg` | 48px | `space-6` | `text-lg`, `font-semibold` |

**States:** default · hover · focus (visible ring, `border-focus`) · active · loading (spinner, width preserved) · disabled

**Copy Rule:** All button labels must reference a Content & Copy PRD key. No hardcoded strings.

**Rules:**
- Always show visible focus ring — never remove it
- Loading state: replace label with spinner, maintain button width
- Never show multiple `primary` buttons in the same view
- Minimum touch target: 44×44px (pad if needed for accessibility)

---

### 9.2 Input

**States:** default · focus · error · disabled · read-only

| State | Border | Background | Label Color | Helper Text Color |
|---|---|---|---|---|
| Default | `border-default` | `color-white` | `color-neutral-700` | `color-neutral-500` |
| Focus | `border-focus` | `color-white` | `color-brand-primary` | `color-neutral-500` |
| Error | `border-error` | `color-white` | `color-error` | `color-error` |
| Disabled | `border-default` | `color-neutral-100` | `color-neutral-500` | `color-neutral-500` |
| Read-only | `border-default` | `color-neutral-50` | `color-neutral-700` | `color-neutral-500` |

**Structure:**
```
[Label]          — text-sm, font-medium, color-neutral-700
[Input field]    — text-base, radius-sm, height 40px, space-3 horizontal padding
[Helper/Error]   — text-sm, color-neutral-500 (helper) / color-error (error)
```

**Rules:**
- Every input must have a visible label — placeholder-only labeling is not permitted
- Error message appears below input, in `color-error`, `text-sm`
- Never use red background for error state — border and text color only
- Label must always be associated with input via `htmlFor`/`id` pair

---

### 9.3 Modal

**Sizes:**

| Size | Max Width | Usage |
|---|---|---|
| `sm` | 400px | Confirmation dialogs |
| `md` | 560px | Forms, standard content |
| `lg` | 720px | Complex content |
| `full` | 100vw/100vh | Mobile full-screen |

**Structure:**
```
Overlay (color-bg-overlay, blocks scroll, z-index: 50)
  └─ Modal container (color-white, radius-lg, shadow-lg)
       ├─ Header (title + close button)
       ├─ Body (scrollable if overflow)
       └─ Footer (actions, right-aligned)
```

**Behavior Rules:**
- Focus trapped inside modal when open
- Close on: X button, Escape key, overlay click (unless `persistent`)
- `persistent` modals: close only via explicit button (confirmation dialogs)
- Mobile: full-screen below `sm` breakpoint
- Never close a `persistent` modal on Escape or overlay click

---

### 9.4 Toast / Notification

| Variant | Icon | Color Token | Auto-Dismiss |
|---|---|---|---|
| `success` | ✓ check | `color-success` | 3 seconds |
| `error` | ✗ x | `color-error` | Manual dismiss only |
| `warning` | ⚠ triangle | `color-warning` | 5 seconds |
| `info` | ℹ circle | `color-info` | 3 seconds |
| `safety` | ⚠ shield | `color-safety` | Manual dismiss only |

**Behavior:**
- Position: top-right (desktop), top-center (mobile)
- Stack: max 3 toasts visible; oldest dismissed first when limit exceeded
- Animation: slide in from right — `transition-slow` (or `transition-none` if reduced motion)

---

### 9.5 Safety / Crisis Banner

*Special component — governed by Safety PRD Domain 1. Never modify behavior without Safety PRD review.*

| Property | Value |
|---|---|
| Background | `color-safety` at 10% opacity |
| Border | `border-safety` |
| Icon | Shield/warning icon — always present |
| Dismiss | Manual only — X button |
| Re-triggering | Banner re-appears on next crisis detection even if previously dismissed |
| Position | Top of screen, above all other content, z-index: 100 |

**Copy:** All text in this component must reference Content & Copy PRD keys. No hardcoded crisis copy.

---

### 9.6 [Additional Component]

**Variants:** [List]

| Variant | Description | When Used |
|---|---|---|
| [Variant] | [Description] | [Context] |

**States:** [List states and visual treatment]

**Rules:**
- [Rule 1]
- [Rule 2]
- Copy: all text via Content PRD keys — no hardcoded strings

---

## 10. Layout System

### 10.1 Page Layout Variants

| Layout | Used For | Structure |
|---|---|---|
| `AuthLayout` | Login, Signup, Password Reset | Centered card, no navigation, no persistent chrome |
| `AppShell` | All authenticated screens | Sidebar/nav + main content area |
| `FullScreen` | Full-screen flows, mobile-specific | No chrome, edge-to-edge |
| `OnboardingLayout` | Onboarding steps | Centered, progress indicator, minimal chrome |

### 10.2 Grid System

- Base grid: 12 columns
- Column gutter: `space-4` (mobile) · `space-6` (tablet) · `space-8` (desktop)
- Page max-width: `[1280px]`, centered
- Page horizontal padding: `space-4` (mobile) · `space-8` (tablet) · `space-10` (desktop)

---

## 11. Iconography

| Setting | Value |
|---|---|
| Library | `[Lucide / Heroicons / Phosphor]` |
| Default size | 20px |
| Small size | 16px |
| Large size | 24px |
| Color | Inherit from parent by default |

**Rules:**
- Icons must always have an `aria-label` or be accompanied by visible text
- Never use an icon as the sole indicator of meaning — pair with text or accessible label
- Safety-related icons must never be repurposed for non-safety contexts

---

## 12. Accessibility Requirements

| Requirement | Standard | Implementation |
|---|---|---|
| Color contrast — normal text | WCAG AA (4.5:1) | Enforced by color system |
| Color contrast — large text | WCAG AA (3:1) | Enforced by color system |
| Keyboard navigation | Full tab order | All interactive elements reachable via Tab |
| Focus indicators | Always visible | `border-focus` on all interactive elements — never removed |
| Screen reader support | ARIA labels | All icons, images, non-text content labeled |
| Reduced motion | `prefers-reduced-motion` | All transitions set to `transition-none` when active |
| Touch targets | Min 44×44px | All interactive elements meet minimum |
| Color-only meaning | Never | All states use color + icon/text combination |

---

## 13. Copy Integration Rule

Every component that renders text must source that text from the Content & Copy PRD. No component may contain hardcoded user-facing strings. Implementation pattern:

```typescript
// ✅ Correct
<Button>{t('global.actions.save')}</Button>

// ❌ Wrong
<Button>Save</Button>
```

---

## 14. Acceptance Criteria

- [ ] All colors used in UI match tokens in this document — zero undocumented colors
- [ ] All font sizes match the type scale — zero undocumented sizes
- [ ] All spacing matches the spacing system
- [ ] All components implement all specified states and variants
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast meets WCAG AA on all text
- [ ] Reduced motion respected across all animations
- [ ] Safety/crisis component uses `color-safety` + icon + text — never color alone
- [ ] All component text sources from Content & Copy PRD keys — no hardcoded strings
- [ ] All touch targets meet 44×44px minimum

## Cross-Document Validation

This section enumerates the cross-document checks that involve the Design System & Component Reference. Agents must run all applicable checks before treating the suite as build-ready.

### Inbound Dependencies (this PRD consumes)

| Check ID | Source Document | Rule | Severity |
|---|---|---|---|
| CD-DES-IN-001 | Master PRD Index | productName, version, and tier anchors must match §3 of the index | Critical |
| CD-DES-IN-002 | Master PRD Index | This document's precedence declaration must be consistent with §6 of the index | Critical |

### Outbound Dependencies (this PRD produces)

| Check ID | Target Document | Rule | Severity |
|---|---|---|---|
| CD-DES-OUT-001 | All downstream documents | Every schema, error code, role, and copy key defined here must be referenced exactly as written | Critical |
| CD-DES-OUT-002 | Master PRD Index | Any change to anchors in this document must be propagated to §3 of the index | Critical |

### Tier-Specific Cross-Checks

| Check ID | Rule | Severity |
|---|---|---|
| CD-DES-TIER-001 | No field, code, or role defined in this document is duplicated by another base PRD at a different tier | Critical |
| CD-DES-TIER-002 | Conflicts between this document and any subordinate Agent PRD are resolved in favor of this document | High |

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

**END OF DESIGN SYSTEM & COMPONENT REFERENCE**