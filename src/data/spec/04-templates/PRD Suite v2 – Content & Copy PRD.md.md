# [Product Name] – Content & Copy PRD

**Version:** 2.0  
**Status:** Authoritative · Single Source of Truth for All User-Facing Text  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** 6th (lowest among base PRDs)

---

## ⚠️ Precedence Compliance Block

Before implementing anything in this document, verify:

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | AI must never claim authority or human identity | Any AI-generated copy must be reviewed against Domain 2 language rules |
| Safety, Privacy & Control PRD | Required legal disclosures must appear at specified locations | Consent copy and disclaimer copy must exactly match legal requirements |
| Experience & Access PRD | Screen contracts define where each copy key is used | Every key in this document must map to at least one screen contract |
| Error & State Reference | Error codes are canonical | Every error message here must reference its corresponding error code |
| Roles & Permissions Matrix | Permission-related UI states need copy | All permission denial messages must be in this document |

---

## 1. Purpose of This Document

This document defines every user-facing string in [Product Name]. Agents must use strings from this document exactly — no paraphrasing, no invention, no substitution.

**How copy keys work:**  
Every string has a key in dot-notation format: `[screen].[element].[variant]`  
Example: `auth.login.submit_button`, `errors.network.body`

Screen contracts in the Experience & Access PRD reference these keys. Agents must resolve the key to the string in this document when implementing UI.

---

## 2. Voice & Tone

### 2.1 Brand Voice
[2–3 sentences describing the product's personality. How does it sound? What feeling does it create?]

### 2.2 Tone Principles

| Principle | What It Means | Compliant Example | Non-Compliant Example |
|---|---|---|---|
| [e.g., Warm but not sycophantic] | [Description] | "[Example]" | "[Counter-example]" |
| [e.g., Direct but not blunt] | [Description] | "[Example]" | "[Counter-example]" |
| [e.g., Simple over clever] | [Description] | "[Example]" | "[Counter-example]" |
| [Principle] | [Meaning] | "[Example]" | "[Counter-example]" |

### 2.3 Words & Phrases to Avoid

| Avoid | Use Instead | Reason |
|---|---|---|
| [Word/phrase] | [Alternative] | [Why] |
| [Word/phrase] | [Alternative] | [Why] |

---

## 3. Global UI Strings

### 3.1 Navigation Labels

| Key | String | Notes |
|---|---|---|
| `nav.[item]` | "[Label]" | — |
| `nav.[item]` | "[Label]" | — |
| `nav.[item]` | "[Label]" | — |
| `nav.settings` | "[Settings]" | — |

### 3.2 Common Actions

| Key | String | Context |
|---|---|---|
| `global.actions.save` | "[Save]" | Form submission |
| `global.actions.cancel` | "[Cancel]" | Dismissal |
| `global.actions.confirm` | "[Confirm]" | Confirmation dialogs |
| `global.actions.delete` | "[Delete]" | Destructive actions |
| `global.actions.back` | "[Back]" | Navigation |
| `global.actions.continue` | "[Continue]" | Multi-step flows |
| `global.actions.submit` | "[Submit]" | Form submission |
| `[key]` | "[string]" | [Context] |

### 3.3 Global State Strings

| Key | String | When Shown |
|---|---|---|
| `global.state.loading` | "[Loading…]" | Any loading state |
| `global.state.empty` | "[Nothing here yet.]" | Empty data states |
| `global.state.error_generic` | "[Something went wrong. Please try again.]" | Unspecified errors |
| `global.state.success_generic` | "[Done!]" | Generic success |
| `[key]` | "[string]" | [When] |

---

## 4. Authentication Copy

### 4.1 Login Screen

| Key | String |
|---|---|
| `auth.login.page_title` | "[Log in to [Product Name]]" |
| `auth.login.email_label` | "[Email address]" |
| `auth.login.email_placeholder` | "[you@example.com]" |
| `auth.login.password_label` | "[Password]" |
| `auth.login.submit_button` | "[Log in]" |
| `auth.login.forgot_password` | "[Forgot your password?]" |
| `auth.login.signup_prompt` | "[Don't have an account? [Sign up]]" |
| `auth.login.oauth_button` | "[Continue with [Provider]]" |

### 4.2 Signup Screen

| Key | String |
|---|---|
| `auth.signup.page_title` | "[Create your account]" |
| `auth.signup.email_label` | "[Email address]" |
| `auth.signup.password_label` | "[Password]" |
| `auth.signup.password_hint` | "[Minimum [N] characters]" |
| `auth.signup.submit_button` | "[Create account]" |
| `auth.signup.login_prompt` | "[Already have an account? [Log in]]" |
| `auth.signup.oauth_button` | "[Continue with [Provider]]" |
| `auth.signup.consent` | "[By creating an account, you agree to our [Terms of Service] and [Privacy Policy].]" |

### 4.3 Password Reset Screen

| Key | String |
|---|---|
| `auth.reset.page_title` | "[Reset your password]" |
| `auth.reset.body` | "[Enter your email and we'll send you a reset link.]" |
| `auth.reset.email_label` | "[Email address]" |
| `auth.reset.submit_button` | "[Send reset link]" |
| `auth.reset.success` | "[Check your email for a reset link.]" |
| `auth.reset.back_to_login` | "[Back to log in]" |

### 4.4 Auth Error Messages

| Key | Error Code | String |
|---|---|---|
| `auth.error.invalid_credentials` | `AUTH_INVALID_CREDENTIALS` | "[Incorrect email or password. Please try again.]" |
| `auth.error.email_exists` | `AUTH_EMAIL_EXISTS` | "[An account with this email already exists. [Log in] instead?]" |
| `auth.error.oauth_failed` | `AUTH_OAUTH_FAILED` | "[Something went wrong with [Provider]. Please try again.]" |
| `auth.error.network` | `SYS_NETWORK_ERROR` | "[We couldn't connect. Check your connection and try again.]" |
| `auth.error.session_expired` | `AUTH_SESSION_EXPIRED` | "[Your session expired. Please log in again.]" |

---

## 5. Onboarding Copy

### 5.1 Step 1: [Step Name]

| Key | String |
|---|---|
| `onboarding.step1.headline` | "[Headline text]" |
| `onboarding.step1.body` | "[Body copy — explain what this step is and why it matters]" |
| `onboarding.step1.cta` | "[Button label]" |
| `onboarding.step1.skip` | "[Skip for now]" *(if skippable)* |

### 5.2 Step 2: [Step Name]

| Key | String |
|---|---|
| `onboarding.step2.headline` | "[Headline]" |
| `onboarding.step2.body` | "[Body copy]" |
| `onboarding.step2.cta` | "[Button label]" |

> *(Repeat for each step)*

### 5.N: Completion

| Key | String |
|---|---|
| `onboarding.complete.headline` | "[You're all set.]" |
| `onboarding.complete.body` | "[Welcome to [Product Name]. Here's what to do first.]" |
| `onboarding.complete.cta` | "[Get started]" |

---

## 6. Screen Copy

### 6.1 Dashboard

| Key | String | Element |
|---|---|---|
| `dashboard.page_title` | "[Dashboard title]" | Page heading |
| `dashboard.empty_state.headline` | "[Nothing here yet.]" | Empty state heading |
| `dashboard.empty_state.body` | "[Empty state explanation and CTA prompt]" | Empty state body |
| `dashboard.empty_state.cta` | "[Primary action to get started]" | Empty state button |
| `dashboard.error_state` | "[We couldn't load your data. Please refresh.]" | Error state |

### 6.2 Settings

| Key | String | Element |
|---|---|---|
| `settings.page_title` | "[Settings]" | Page heading |
| `settings.section.account` | "[Account]" | Section label |
| `settings.section.preferences` | "[Preferences]" | Section label |
| `settings.section.data` | "[Your data]" | Section label |
| `settings.export.button` | "[Export my data]" | Button |
| `settings.export.description` | "[Download a copy of all your data as a JSON file.]" | Description |
| `settings.delete.button` | "[Delete account]" | Button |
| `settings.delete.description` | "[Permanently delete your account and all associated data.]" | Description |

### 6.3 [Feature Screen]

| Key | String | Element |
|---|---|---|
| `[feature].page_title` | "[Title]" | Page heading |
| `[feature].empty_state` | "[Empty state copy]" | Empty state |
| `[feature].error_state` | "[Error state copy]" | Error state |
| `[key]` | "[string]" | [Element] |

> *(Add a section for every screen in the Screen Inventory)*

---

## 7. Error Messages (Complete Registry)

### 7.1 Validation Errors

| Key | Error Code | String | Field |
|---|---|---|---|
| `validation.required` | `INPUT_FIELD_REQUIRED` | "[This field is required.]" | Any required field |
| `validation.email.format` | `INPUT_INVALID_EMAIL` | "[Please enter a valid email address.]" | Email |
| `validation.password.too_short` | `INPUT_TOO_SHORT` | "[Password must be at least [N] characters.]" | Password |
| `validation.password.too_long` | `INPUT_TOO_LONG` | "[Password must be fewer than [N] characters.]" | Password |
| `validation.[field].[rule]` | `[ERROR_CODE]` | "[Message]" | [Field] |

### 7.2 System Errors

| Key | Error Code | String |
|---|---|---|
| `errors.unauthorized` | `AUTH_UNAUTHORIZED` | "[Please log in to continue.]" |
| `errors.forbidden` | `PERMISSION_DENIED` | "[You don't have permission to do that.]" |
| `errors.not_found` | `DB_RECORD_NOT_FOUND` | "[We couldn't find what you were looking for.]" |
| `errors.server` | `SYS_UNKNOWN_ERROR` | "[Something went wrong on our end. Please try again.]" |
| `errors.service_unavailable` | `SYS_MAINTENANCE` | "[We're temporarily unavailable. Please try again shortly.]" |
| `errors.[code]` | `[ERROR_CODE]` | "[Message]" |

### 7.3 Permission Errors

| Key | Error Code | String |
|---|---|---|
| `errors.permission.role_required` | `ROLE_REQUIRED` | "[You need [role] access to do that.]" |
| `errors.permission.owner_required` | `OWNER_REQUIRED` | "[Only the account owner can do that.]" |
| `errors.permission.resource_denied` | `RESOURCE_ACCESS_DENIED` | "[You don't have access to this.]" |
| `errors.invite.expired` | `INVITE_TOKEN_EXPIRED` | "[This invitation has expired. Ask for a new one.]" |
| `errors.invite.claimed` | `INVITE_TOKEN_CLAIMED` | "[This invitation has already been used.]" |
| `errors.invite.revoked` | `INVITE_TOKEN_REVOKED` | "[This invitation is no longer valid.]" |

### 7.4 Process Errors

| Key | Error Code | String | Context |
|---|---|---|---|
| `errors.upload.too_large` | `INPUT_TOO_LONG` | "[This file is too large. Maximum size is [N]MB.]" | File upload |
| `errors.upload.invalid_type` | `INPUT_INVALID_TYPE` | "[This file type isn't supported.]" | File upload |
| `errors.[context].[error]` | `[CODE]` | "[Message]" | [Context] |

---

## 8. Confirmation & Success Messages

| Key | String | Triggered By |
|---|---|---|
| `success.account.created` | "[Welcome to [Product Name]! Your account is ready.]" | Signup |
| `success.profile.saved` | "[Your changes have been saved.]" | Profile update |
| `success.export.requested` | "[Your data export is on its way. Check your email within [N] hours.]" | Data export |
| `success.account.delete_initiated` | "[Your account is scheduled for deletion. You'll receive a confirmation email.]" | Account deletion |
| `success.[action]` | "[Message]" | [Trigger] |

---

## 9. Destructive Action Confirmations

All destructive actions require a confirmation dialog with exact copy specified here.

### 9.1 Account Deletion Confirmation

| Key | String |
|---|---|
| `confirm.delete_account.title` | "[Delete your account?]" |
| `confirm.delete_account.body` | "[This will permanently delete your account and all associated data. This cannot be undone.]" |
| `confirm.delete_account.confirm_button` | "[Yes, delete my account]" |
| `confirm.delete_account.cancel_button` | "[Cancel]" |

### 9.2 [Other Destructive Action]

| Key | String |
|---|---|
| `confirm.[action].title` | "[Title]" |
| `confirm.[action].body` | "[Explanation of consequences]" |
| `confirm.[action].confirm_button` | "[Confirm label]" |
| `confirm.[action].cancel_button` | "[Cancel]" |

---

## 10. Email Copy

### 10.1 Welcome Email

| Field | Value |
|---|---|
| Key prefix | `email.welcome` |
| Subject | `email.welcome.subject`: "[Welcome to [Product Name]]" |
| Preview text | `email.welcome.preview`: "[You're all set. Here's how to get started.]" |
| Heading | `email.welcome.heading`: "[Welcome to [Product Name], [first name].]" |
| Body | `email.welcome.body`: "[Full email body copy]" |
| CTA button | `email.welcome.cta`: "[Get started]" |
| CTA URL | `[app URL]/dashboard` |

### 10.2 Password Reset Email

| Field | Value |
|---|---|
| Subject | `email.password_reset.subject`: "[Reset your [Product Name] password]" |
| Preview text | `email.password_reset.preview`: "[Use this link to reset your password. It expires in [N] hours.]" |
| Body | `email.password_reset.body`: "[Full email body copy]" |
| CTA button | `email.password_reset.cta`: "[Reset password]" |
| Expiry note | `email.password_reset.expiry`: "[This link expires in [N] hours. If you didn't request this, ignore this email.]" |

### 10.3 Account Deletion Confirmation Email

| Field | Value |
|---|---|
| Subject | `email.delete_confirm.subject`: "[Your [Product Name] account has been scheduled for deletion]" |
| Body | `email.delete_confirm.body`: "[Your account and all associated data will be permanently deleted within [N] days.]" |

### 10.4 [Additional Email]

| Field | Value |
|---|---|
| Subject | `email.[type].subject`: "[Subject]" |
| Body | `email.[type].body`: "[Body copy]" |

---

## 11. Legal & Compliance Copy

### 11.1 Required Disclosures

| Key | String | Location | Required By |
|---|---|---|---|
| `legal.terms_consent` | "[By creating an account, you agree to our [Terms of Service] and [Privacy Policy].]" | Signup screen | All users |
| `legal.not_medical` | "[{Product Name} is not a medical or clinical service.]" | [Location] | [Regulation/reason] |
| `legal.data_notice` | "[We collect and process your data as described in our Privacy Policy.]" | [Location] | GDPR |
| `legal.[key]` | "[Copy]" | [Location] | [Reason] |

### 11.2 Terms & Policy Link Text

| Key | String |
|---|---|
| `legal.links.terms` | "[Terms of Service]" |
| `legal.links.privacy` | "[Privacy Policy]" |
| `legal.links.cookies` | "[Cookie Policy]" |

---

## 12. Acceptance Criteria

- [ ] Every UI string in the product resolves to a key in this document
- [ ] No key in this document is unused — every key maps to at least one screen contract
- [ ] All error message keys reference their corresponding error code from Error & State Reference
- [ ] All destructive actions have confirmation copy specified
- [ ] All legal disclosures match their required exact text
- [ ] Voice and tone is consistent across all copy
- [ ] No copy was invented by an implementing agent — all strings originate here
- [ ] All email subjects, preview text, and body copy are specified

## Cross-Document Validation

This section enumerates the cross-document checks that involve the Content & Copy PRD. Agents must run all applicable checks before treating the suite as build-ready.

### Inbound Dependencies (this PRD consumes)

| Check ID | Source Document | Rule | Severity |
|---|---|---|---|
| CD-CON-IN-001 | Master PRD Index | productName, version, and tier anchors must match §3 of the index | Critical |
| CD-CON-IN-002 | Master PRD Index | This document's precedence declaration must be consistent with §6 of the index | Critical |

### Outbound Dependencies (this PRD produces)

| Check ID | Target Document | Rule | Severity |
|---|---|---|---|
| CD-CON-OUT-001 | All downstream documents | Every schema, error code, role, and copy key defined here must be referenced exactly as written | Critical |
| CD-CON-OUT-002 | Master PRD Index | Any change to anchors in this document must be propagated to §3 of the index | Critical |

### Tier-Specific Cross-Checks

| Check ID | Rule | Severity |
|---|---|---|
| CD-CON-TIER-001 | No field, code, or role defined in this document is duplicated by another base PRD at a different tier | Critical |
| CD-CON-TIER-002 | Conflicts between this document and any subordinate Agent PRD are resolved in favor of this document | High |

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

**END OF CONTENT & COPY PRD**