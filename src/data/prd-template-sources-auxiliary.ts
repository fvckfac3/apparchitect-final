/**
 * PRD Suite Template Sources v2 - Auxiliary Templates
 * 
 * Specialized templates for monetization, launch, design system, etc.
 */

import type { PRDTemplate } from './prd-template-sources';

/**
 * Design System & Component Reference Template (v2)
 */
export const DESIGN_SYSTEM_TEMPLATE = `# [Product Name] – Design System & Component Reference

**Version:** 2.0  
**Status:** Authoritative · Single Source of Truth for All Visual Decisions  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** Peer to Content & Copy PRD — this document wins on visual and component specifications

---

## ⚠️ Precedence Compliance Block

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | Color alone must never convey safety-critical meaning | Crisis banners and safety alerts must use icon + color + text together |
| Safety, Privacy & Control PRD | Reduced motion must be respected | All animations must check \`prefers-reduced-motion\` |
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
| \`color-brand-primary\` | \`#[hex]\` | \`rgb([r],[g],[b])\` | Primary CTAs, key UI elements, focus states |
| \`color-brand-secondary\` | \`#[hex]\` | \`rgb([r],[g],[b])\` | Supporting brand accents |
| \`color-brand-tertiary\` | \`#[hex]\` | \`rgb([r],[g],[b])\` | Subtle accents, hover states |

### 3.2 Semantic Colors

| Token | Hex | Usage | Contrast Ratio on White |
|---|---|---|---|
| \`color-success\` | \`#[hex]\` | Success states, confirmations | [X]:1 |
| \`color-warning\` | \`#[hex]\` | Warning states, cautions | [X]:1 |
| \`color-error\` | \`#[hex]\` | Error states, destructive actions | [X]:1 |
| \`color-info\` | \`#[hex]\` | Informational states | [X]:1 |

### 3.3 Neutral Colors

| Token | Hex | Usage |
|---|---|---|
| \`color-neutral-900\` | \`#[hex]\` | Primary text |
| \`color-neutral-700\` | \`#[hex]\` | Secondary text |
| \`color-neutral-500\` | \`#[hex]\` | Placeholder, disabled text |
| \`color-neutral-300\` | \`#[hex]\` | Borders, dividers |
| \`color-neutral-100\` | \`#[hex]\` | Subtle backgrounds |
| \`color-neutral-50\` | \`#[hex]\` | Page background |
| \`color-white\` | \`#FFFFFF\` | Cards, surfaces |

### 3.4 Color Rules

- Never use a color not defined in this system
- Minimum contrast: 4.5:1 for normal text (WCAG AA)
- Minimum contrast: 3:1 for large text and UI components
- Never use color alone to convey meaning — always pair with icon or label

---

## 4. Typography

### 4.1 Font Families

| Token | Font | Fallback Stack | Usage |
|---|---|---|---|
| \`font-primary\` | \`[Font Name]\` | \`system-ui, -apple-system, sans-serif\` | All body text, UI |
| \`font-heading\` | \`[Font Name]\` | \`system-ui, sans-serif\` | Headings (if different) |
| \`font-mono\` | \`[Font Name]\` | \`'Courier New', monospace\` | Code, technical content |

### 4.2 Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| \`text-xs\` | 12px | 16px | 400 | Labels, captions |
| \`text-sm\` | 14px | 20px | 400 | Body small, error messages |
| \`text-base\` | 16px | 24px | 400 | Body default |
| \`text-lg\` | 18px | 28px | 400 | Body large |
| \`text-xl\` | 20px | 28px | 600 | Subheadings |
| \`text-2xl\` | 24px | 32px | 700 | Heading small |
| \`text-3xl\` | 30px | 36px | 700 | Heading medium |
| \`text-4xl\` | 36px | 40px | 800 | Heading large |

---

## 5. Spacing System

*All spacing is multiples of 4px.*

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| \`space-1\` | 4px | \`p-1\` / \`m-1\` | Minimum internal padding |
| \`space-2\` | 8px | \`p-2\` / \`m-2\` | Tight spacing |
| \`space-3\` | 12px | \`p-3\` / \`m-3\` | Small spacing |
| \`space-4\` | 16px | \`p-4\` / \`m-4\` | Default component padding |
| \`space-6\` | 24px | \`p-6\` / \`m-6\` | Section spacing |
| \`space-8\` | 32px | \`p-8\` / \`m-8\` | Large section spacing |

---

## 6. Component Library

### 6.1 Buttons

| Variant | Use Case | Background | Text | Border |
|---|---|---|---|---|
| Primary | Main CTA | \`color-brand-primary\` | \`color-white\` | None |
| Secondary | Secondary action | \`transparent\` | \`color-brand-primary\` | \`color-brand-primary\` |
| Ghost | Tertiary action | \`transparent\` | \`color-neutral-700\` | None |
| Destructive | Delete/remove | \`color-error\` | \`color-white\` | None |

### 6.2 Inputs

| State | Border | Background | Label |
|---|---|---|---|
| Default | \`color-neutral-300\` | \`color-white\` | \`color-neutral-700\` |
| Focus | \`color-brand-primary\` | \`color-white\` | \`color-brand-primary\` |
| Error | \`color-error\` | \`color-white\` | \`color-error\` |
| Disabled | \`color-neutral-200\` | \`color-neutral-50\` | \`color-neutral-500\` |

### 6.3 Cards

| Variant | Background | Border | Shadow |
|---|---|---|---|
| Default | \`color-white\` | \`color-neutral-200\` | \`shadow-sm\` |
| Elevated | \`color-white\` | None | \`shadow-md\` |
| Interactive | \`color-white\` | \`color-neutral-200\` | \`shadow-sm\` → \`shadow-md\` on hover |

---

## 7. Interaction States

### 7.1 State Definitions

| State | Visual Change | Timing |
|---|---|---|
| Hover | Lighten/darken 10%, show shadow | Immediate |
| Focus | Focus ring (2px, brand primary) | Immediate |
| Active | Darken 15% | Immediate |
| Disabled | 50% opacity, cursor: not-allowed | N/A |
| Loading | Spinner overlay, 70% opacity | 200ms fade |

---

## 8. Animation & Motion

### 8.1 Timing

| Token | Duration | Easing | Use Case |
|---|---|---|---|
| \`duration-instant\` | 100ms | \`ease-out\` | Hover states, focus rings |
| \`duration-fast\` | 200ms | \`ease-out\` | Buttons, inputs |
| \`duration-normal\` | 300ms | \`ease-in-out\` | Modals, panels |
| \`duration-slow\` | 500ms | \`ease-in-out\` | Page transitions |

### 8.2 Motion Rules

- All motion must respect \`prefers-reduced-motion\`
- No motion longer than 500ms
- No auto-playing animations
- Loading indicators may loop

---

## 9. Acceptance Criteria

- [ ] All colors from this system only
- [ ] All typography from type scale
- [ ] All spacing from spacing system
- [ ] All components match specifications
- [ ] All interactions have correct states
- [ ] Reduced motion supported
`;

/**
 * Content & Copy PRD Template (v2)
 */
export const CONTENT_COPY_TEMPLATE = `# [Product Name] – Content & Copy PRD

**Version:** 2.0  
**Status:** Authoritative · Build-Ready  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** 6th (lowest — overridden by all other PRDs)

---

## ⚠️ Precedence Compliance Block

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | Crisis response copy must be pre-approved | All crisis-related strings reviewed for safety compliance |
| Safety, Privacy & Control PRD | No urgency manipulation in copy | All CTAs reviewed for pressure-free language |
| Core Systems PRD | Copy keys must map to system states | Every state mentioned in Core Systems has corresponding copy |
| Error & State Reference | Error messages must exist for all codes | Every error code has a message entry here |

---

## 1. Purpose of This Document

This document defines every user-facing string in [Product Name]. All UI text, error messages, success messages, placeholders, tooltips, and legal copy are defined here. No agent may write UI copy not in this document.

---

## 2. Voice & Tone Guidelines

### 2.1 Brand Voice

| Attribute | Description | Example |
|---|---|---|
| [e.g., Warm] | [What this means] | [Example phrase] |
| [e.g., Clear] | [What this means] | [Example phrase] |
| [e.g., Supportive] | [What this means] | [Example phrase] |

### 2.2 Tone by Context

| Context | Tone | Example |
|---|---|---|
| Success states | Celebratory, brief | "Done!" / "Saved successfully" |
| Error states | Calm, helpful | "Something went wrong. Try again." |
| Empty states | Encouraging | "Nothing here yet. Let's get started." |
| Loading states | Reassuring | "Loading your data..." |

### 2.3 Writing Rules

- Use sentence case for all UI text
- No exclamation points except in success states
- No jargon or technical terms
- Maximum 80 characters for button labels
- Maximum 160 characters for error messages

---

## 3. Copy Registry

### 3.1 Navigation

| Key | String | Context |
|---|---|---|
| \`nav.home\` | Home | Main navigation |
| \`nav.dashboard\` | Dashboard | Main navigation |
| \`nav.settings\` | Settings | Main navigation |
| \`nav.logout\` | Log out | User menu |

### 3.2 Authentication

| Key | String | Context |
|---|---|---|
| \`auth.login.title\` | Welcome back | Login page heading |
| \`auth.login.subtitle\` | Sign in to continue | Login page subheading |
| \`auth.login.email_label\` | Email address | Form label |
| \`auth.login.password_label\` | Password | Form label |
| \`auth.login.submit\` | Sign in | Submit button |
| \`auth.login.forgot_password\` | Forgot password? | Link text |
| \`auth.signup.title\` | Create your account | Signup page heading |
| \`auth.signup.submit\` | Create account | Submit button |

### 3.3 Error Messages

| Key | String | Error Code |
|---|---|---|
| \`error.auth.invalid_credentials\` | The email or password you entered is incorrect. | \`AUTH_INVALID_CREDENTIALS\` |
| \`error.auth.email_exists\` | An account with this email already exists. | \`AUTH_EMAIL_EXISTS\` |
| \`error.auth.session_expired\` | Your session has expired. Please sign in again. | \`AUTH_SESSION_EXPIRED\` |
| \`error.input.missing\` | This field is required. | \`INPUT_MISSING\` |
| \`error.input.invalid_format\` | Please enter a valid value. | \`INPUT_INVALID_FORMAT\` |
| \`error.network\` | Unable to connect. Check your internet and try again. | \`EXT_NETWORK_ERROR\` |
| \`error.generic\` | Something went wrong. Please try again. | (fallback) |

### 3.4 Success Messages

| Key | String | Context |
|---|---|---|
| \`success.saved\` | Changes saved | After successful save |
| \`success.created\` | Created successfully | After creating item |
| \`success.deleted\` | Deleted | After deleting item |
| \`success.sent\` | Sent | After sending message/email |

### 3.5 Empty States

| Key | String | Context |
|---|---|---|
| \`empty.default.title\` | Nothing here yet | Generic empty state |
| \`empty.default.description\` | Get started by creating your first item. | Generic empty state |
| \`empty.search.title\` | No results found | Search with no matches |
| \`empty.search.description\` | Try adjusting your search terms. | Search with no matches |

### 3.6 Loading States

| Key | String | Context |
|---|---|---|
| \`loading.default\` | Loading... | Generic loading |
| \`loading.saving\` | Saving... | During save operation |
| \`loading.sending\` | Sending... | During send operation |

### 3.7 Confirmations

| Key | String | Context |
|---|---|---|
| \`confirm.delete.title\` | Delete this item? | Delete confirmation modal |
| \`confirm.delete.description\` | This action cannot be undone. | Delete confirmation modal |
| \`confirm.delete.confirm\` | Delete | Confirm button |
| \`confirm.delete.cancel\` | Cancel | Cancel button |

---

## 4. Legal Copy

### 4.1 Footer Links

| Key | String | URL |
|---|---|---|
| \`legal.terms\` | Terms of Service | /terms |
| \`legal.privacy\` | Privacy Policy | /privacy |
| \`legal.cookies\` | Cookie Policy | /cookies |

### 4.2 Consent Copy

| Key | String | Context |
|---|---|---|
| \`consent.terms\` | By continuing, you agree to our Terms of Service and Privacy Policy. | Signup form |
| \`consent.cookies\` | We use cookies to improve your experience. | Cookie banner |

---

## 5. Acceptance Criteria

- [ ] All UI strings defined in this document
- [ ] All error codes have corresponding messages
- [ ] No hardcoded strings in codebase
- [ ] Voice and tone guidelines followed
- [ ] Legal copy complete
`;

/**
 * Roles & Permissions Matrix Template (v2)
 */
export const ROLES_PERMISSIONS_TEMPLATE = `# [Product Name] – Roles & Permissions Matrix

**Version:** 2.0  
**Status:** Authoritative · Single Source of Truth for All Access Control  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** Overrides Technical Architecture PRD on permission decisions

---

## 1. Purpose of This Document

This document defines every role in [Product Name], what each role can do, and how role membership is assigned and changed. Technical Architecture PRD implements these rules; this document defines them.

---

## 2. Role Definitions

| Role | Description | How Assigned |
|---|---|---|
| \`OWNER\` | Full administrative access | Account creator |
| \`ADMIN\` | Administrative access | Invited by OWNER |
| \`MEMBER\` | Standard access | Invited by OWNER/ADMIN |
| \`VIEWER\` | Read-only access | Invited by OWNER/ADMIN |

---

## 3. Permission Matrix

| Permission | OWNER | ADMIN | MEMBER | VIEWER |
|---|---|---|---|---|
| View dashboard | ✅ | ✅ | ✅ | ✅ |
| Create content | ✅ | ✅ | ✅ | ❌ |
| Edit own content | ✅ | ✅ | ✅ | ❌ |
| Edit all content | ✅ | ✅ | ❌ | ❌ |
| Delete content | ✅ | ✅ | ❌ | ❌ |
| Invite members | ✅ | ✅ | ❌ | ❌ |
| Remove members | ✅ | ✅ | ❌ | ❌ |
| Manage billing | ✅ | ❌ | ❌ | ❌ |
| Delete account | ✅ | ❌ | ❌ | ❌ |

---

## 4. Invitation Lifecycle

### 4.1 Invitation States

| State | Value | Description |
|---|---|---|
| Issued | \`ISSUED\` | Created and sent |
| Pending | \`PENDING\` | Opened, not accepted |
| Claimed | \`CLAIMED\` | Accepted, account created |
| Expired | \`EXPIRED\` | TTL exceeded |
| Revoked | \`REVOKED\` | Manually cancelled |

### 4.2 Invitation Rules

- Invitations expire after 48 hours
- Only OWNER and ADMIN can send invitations
- Each email can only have one active invitation
- Revoked invitations cannot be reactivated

---

## 5. Role Transitions

| From | To | Who Can Do | Conditions |
|---|---|---|---|
| VIEWER | MEMBER | OWNER, ADMIN | None |
| MEMBER | ADMIN | OWNER | None |
| ADMIN | OWNER | OWNER | Must transfer ownership |
| Any | Removed | OWNER, ADMIN | Cannot remove self if OWNER |

---

## 6. Acceptance Criteria

- [ ] All roles implemented
- [ ] All permissions enforced
- [ ] Invitation flow working
- [ ] Role transitions working
- [ ] No unauthorized access possible
`;

// Export auxiliary templates
export const AUXILIARY_PRD_TEMPLATES: PRDTemplate[] = [
  {
    id: 'design-system',
    name: 'Design System & Component Reference',
    filename: '11-design-system-component-reference.md',
    category: 'reference',
    precedence: null,
    version: 'v2',
    template: DESIGN_SYSTEM_TEMPLATE,
  },
  {
    id: 'content-copy',
    name: 'Content & Copy PRD',
    filename: '06-content-copy-prd.md',
    category: 'base',
    precedence: 6,
    version: 'v2',
    template: CONTENT_COPY_TEMPLATE,
  },
  {
    id: 'roles-permissions',
    name: 'Roles & Permissions Matrix',
    filename: '13-roles-permissions-matrix.md',
    category: 'reference',
    precedence: null,
    version: 'v2',
    template: ROLES_PERMISSIONS_TEMPLATE,
  },
];
