# [Product Name] – Roles & Permissions Matrix

**Version:** 2.0  
**Status:** Authoritative · Single Source of Truth for Access Control  
**Governed by:** [Product Name] – Master PRD Index  
**Precedence:** Overrides Technical Architecture PRD on all permission decisions

---

```
═══════════════════════════════════════════════════════════
ROLE
═══════════════════════════════════════════════════════════
You are the implementing agent for access control in
[Product Name]. Before proceeding with any task that
touches permissions, roles, or access logic, you are
acting as a compliance verifier for this document.

Your permission decisions are binding. If a permission
is not explicitly granted in this document, it is denied.
Deny is always the default. You do not infer permissions
from context. You implement exactly what is specified.

═══════════════════════════════════════════════════════════
LIMITS
═══════════════════════════════════════════════════════════
You must not:
  - Implement any role not defined in Section 2
  - Implement any permission not specified in Section 3
  - Enforce permissions only on the frontend — backend
    enforcement is mandatory for all write operations
    and sensitive reads
  - Infer or extrapolate permissions beyond what is
    explicitly stated
  - Allow any action not listed as ✅ for a given role

If a permission is not listed for a role:
  → It is denied. Do not implement it as allowed.
  → Do not ask — the absence of a grant is a denial.

If two documents conflict on a permission decision:
  → This document overrides Technical Architecture PRD
  → Safety, Privacy & Control PRD overrides this document
  → Apply Master PRD Index §6 for all other conflicts

If a guardrail in Section 6 conflicts with a permission
in Section 3:
  → The guardrail wins. Always.
  → Guardrails are restrictions on top of permissions,
    not contradictions.

If a user right in Safety PRD §6.3 conflicts with any
permission in this document:
  → The Safety PRD wins. Irrevocable user rights cannot
    be blocked by any role definition here.

═══════════════════════════════════════════════════════════
MISSION
═══════════════════════════════════════════════════════════
Your singular objective: Implement access control such
that every role can do exactly what this document grants,
nothing more, and every denied action is blocked at the
backend — verified, not assumed.

You succeed when:
  - Every permission row in Section 3 is enforced in
    the backend for every role
  - Every guardrail in Section 6 is enforced in the
    backend independently of the permission matrix
  - Frontend controls correctly show/hide per role
  - All invitation lifecycle states in Section 5 are
    implemented and transition correctly
  - All permission tests in Section 11 pass
  - Universal user rights from Safety PRD §6.3 are
    never blocked by any role logic

You fail if:
  - Any permission is enforced only on the frontend
  - Any denied action is reachable via direct API call
  - Any guardrail is bypassable
  - Any invitation token is reusable after claiming
  - Any role is implemented that is not in Section 2
  - Any universal user right is blocked by role logic

Begin with: Read the Precedence Compliance Block below,
verify all checks pass, then proceed to implementation.
═══════════════════════════════════════════════════════════
```

---

## ⚠️ Precedence Compliance Block

| Higher-Tier Document | Governing Rule | Status | Notes |
|---|---|---|---|
| Safety, Privacy & Control PRD | Users may always delete their own account — no role may block this | PASS / FAIL / N/A | [Finding if FAIL] |
| Safety, Privacy & Control PRD | Data export is an irrevocable right for all authenticated users | PASS / FAIL / N/A | [Finding if FAIL] |
| Core Systems PRD | Role field values must match the `role` enum in the canonical profile schema | PASS / FAIL / N/A | [Finding if FAIL] |
| Error & State Reference | All permission error codes must be registered | PASS / FAIL / N/A | [Finding if FAIL] |

**If any check is FAIL:** Stop. Report the conflict. Do not proceed until resolved.

---

## 1. Purpose of This Document

This document defines every user role, every permission, and every access rule in [Product Name]. It is the single source of truth for which roles exist, what each can do, and how permissions are enforced.

**Rules:**
- No role or permission exists unless defined here
- No agent may implement access control not specified in this matrix
- If a permission is not granted, it is denied — deny is the default
- Backend enforcement is mandatory for ALL write operations and sensitive reads
- Frontend enforcement is for UX only — never a security boundary

---

## 2. Role Definitions

### 2.1 Role Hierarchy

```
[OWNER]      ← Highest privilege
    ↓
[ADMIN]
    ↓
[MEMBER]
    ↓
[VIEWER]
    ↓
[GUEST]      ← Unauthenticated — lowest privilege
```

### 2.2 Role Descriptions

| Role | Code | Description | Assignment Method |
|---|---|---|---|
| Owner | `OWNER` | Full system access; manages all users; cannot be deleted by anyone else | First user on signup; transfer requires explicit ownership transfer flow |
| Admin | `ADMIN` | Manages content and users within guardrails; cannot modify system-level settings | Invitation by OWNER only |
| Member | `MEMBER` | Standard user with full access to their own resources | Self-signup or invitation |
| Viewer | `VIEWER` | Read-only access to explicitly shared resources | Invitation only |
| Guest | `GUEST` | Unauthenticated; limited public access | None |

### 2.3 Role Capacity

| Role | Max Count | Overflow Behavior |
|---|---|---|
| OWNER | 1 | Ownership transfer requires explicit flow; cannot have two simultaneous OWNERs |
| ADMIN | Unlimited | No limit |
| MEMBER | Unlimited | No limit |
| VIEWER | Unlimited | No limit |

### 2.4 Default Role by Signup Method

| Signup Method | Default Role | Can Be Promoted | Promoted By |
|---|---|---|---|
| First user ever | `OWNER` | N/A | N/A |
| Subsequent public signup | `MEMBER` | Yes | OWNER or ADMIN |
| Invited — no role specified | `VIEWER` | Yes | OWNER or ADMIN |
| Invited — role specified | [Specified role] | Yes | OWNER or ADMIN |
| OAuth signup | `MEMBER` | Yes | OWNER or ADMIN |

---

## 3. Permission Matrix

### 3.1 Legend

| Symbol | Meaning |
|---|---|
| ✅ | Allowed |
| ❌ | Denied |
| 🔶 | Conditional — see footnote |
| 👁️ | Read-only — cannot create, update, or delete |

### 3.2 User Management

| Action | OWNER | ADMIN | MEMBER | VIEWER | GUEST | Enforcement |
|---|---|---|---|---|---|---|
| View own profile | ✅ | ✅ | ✅ | ✅ | ❌ | Backend |
| View any profile | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |
| Update own profile | ✅ | ✅ | ✅ | ✅ | ❌ | Backend |
| Update any profile | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |
| Delete own account | ✅ | ✅ | ✅ | ✅ | ❌ | Backend |
| Delete any account | ✅ | 🔶¹ | ❌ | ❌ | ❌ | Backend |
| List all users | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |
| Invite new user | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |
| Change user role | ✅ | ❌ | ❌ | ❌ | ❌ | Backend |

### 3.3 Content & Data

| Action | OWNER | ADMIN | MEMBER | VIEWER | GUEST | Enforcement |
|---|---|---|---|---|---|---|
| View own [resource] | ✅ | ✅ | ✅ | 👁️² | ❌ | Backend |
| View any [resource] | ✅ | ✅ | 🔶³ | ❌ | ❌ | Backend |
| Create [resource] | ✅ | ✅ | ✅ | ❌ | ❌ | Backend |
| Update own [resource] | ✅ | ✅ | ✅ | ❌ | ❌ | Backend |
| Update any [resource] | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |
| Delete own [resource] | ✅ | ✅ | ✅ | ❌ | ❌ | Backend |
| Delete any [resource] | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |

### 3.4 Settings & Configuration

| Action | OWNER | ADMIN | MEMBER | VIEWER | GUEST | Enforcement |
|---|---|---|---|---|---|---|
| View system settings | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |
| Update system settings | ✅ | 🔶⁴ | ❌ | ❌ | ❌ | Backend |
| View audit logs | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |
| Export own data | ✅ | ✅ | ✅ | ✅ | ❌ | Backend |
| Export all data | ✅ | 🔶⁵ | ❌ | ❌ | ❌ | Backend |

### 3.5 Billing & Payments *(remove if not applicable)*

| Action | OWNER | ADMIN | MEMBER | VIEWER | GUEST | Enforcement |
|---|---|---|---|---|---|---|
| View own subscription | ✅ | ✅ | ✅ | ❌ | ❌ | Backend |
| Update own subscription | ✅ | ✅ | ✅ | ❌ | ❌ | Backend |
| View all subscriptions | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |
| Manage billing settings | ✅ | ✅ | ❌ | ❌ | ❌ | Backend |

**Permission Footnotes:**

> ¹ ADMIN can delete accounts only if: account has no owned resources AND is not the last ADMIN  
> ² VIEWER has read-only access only to resources explicitly shared with them  
> ³ MEMBER can view resources marked "public" or shared directly with them  
> ⁴ ADMIN can update settings only within defined guardrails (see Section 6.1)  
> ⁵ ADMIN can export all data only with OWNER approval — this action is logged

---

## 4. Resource-Level Permissions

*For resources that have per-item access control beyond role-based rules.*

### 4.1 Resource: [Resource Name]

| Permission | Resource Owner | ADMIN | Assigned MEMBER | Non-assigned MEMBER | VIEWER |
|---|---|---|---|---|---|
| View | ✅ | ✅ | ✅ | ❌ | 👁️ |
| Edit | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| Share | ✅ | ✅ | 🔶 | ❌ | ❌ |
| Transfer ownership | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 5. Invitation Lifecycle

### 5.1 Invitation Token States

| State | Value | Description | Allowed Transitions | Terminal? |
|---|---|---|---|---|
| Issued | `ISSUED` | Created and sent | → `PENDING`, → `REVOKED` | No |
| Pending | `PENDING` | Opened, not yet accepted | → `CLAIMED`, → `EXPIRED`, → `REVOKED` | No |
| Claimed | `CLAIMED` | Accepted; account created | None | **Yes** |
| Expired | `EXPIRED` | TTL exceeded without claim | → `ISSUED` (re-send only) | No |
| Revoked | `REVOKED` | Manually cancelled | None | **Yes** |

### 5.2 State Transitions

```
ISSUED
  → PENDING        trigger: recipient opens invitation link
  → REVOKED        trigger: OWNER or ADMIN cancels

PENDING
  → CLAIMED        trigger: recipient completes signup
  → EXPIRED        trigger: TTL exceeded (default: 48 hours)
  → REVOKED        trigger: OWNER or ADMIN cancels

EXPIRED
  → ISSUED         trigger: new invitation issued — new token
                   generated; old token permanently invalid

CLAIMED / REVOKED  → terminal — no transitions out
```

### 5.3 Invitation Security Rules

| Rule | Specification |
|---|---|
| Token lifetime | [48 hours] from time of issue — configurable by OWNER |
| Token entropy | Cryptographically random — minimum 32 bytes |
| Token storage | Hashed before storage — plaintext never persisted |
| Token reuse | Single-use only — claiming invalidates immediately |
| Email matching | Invitation email must match the email used at signup |
| Re-invite | Expired tokens cannot be reactivated — new invitation required |

### 5.4 Invitation Error Codes

| Code | HTTP Status | Copy Key | Condition |
|---|---|---|---|
| `INVITE_TOKEN_INVALID` | 400 | `errors.invite.invalid` | Token does not match any invitation |
| `INVITE_TOKEN_EXPIRED` | 400 | `errors.invite.expired` | Token TTL exceeded |
| `INVITE_TOKEN_CLAIMED` | 400 | `errors.invite.claimed` | Token already used |
| `INVITE_TOKEN_REVOKED` | 400 | `errors.invite.revoked` | Token manually cancelled |
| `INVITE_EMAIL_MISMATCH` | 400 | `errors.invite.email_mismatch` | Signup email ≠ invitation email |

---

## 6. Permission Boundaries & Guardrails

### 6.1 ADMIN Guardrails

Even ADMIN users have limits that cannot be overridden by any logic:

| Action | Guardrail | Enforcement |
|---|---|---|
| Delete user account | Cannot delete self; cannot delete last ADMIN; cannot delete OWNER | Backend — `ROLE_CANNOT_BE_CHANGED` |
| Change system settings | Cannot modify auth settings (JWT config, session duration, security policies) | Backend — `PERMISSION_DENIED` |
| View audit logs | Cannot delete, modify, or export logs without OWNER approval | Backend — `OWNER_REQUIRED` |
| Role assignment | Cannot assign OWNER role; cannot promote to ADMIN (OWNER only) | Backend — `ROLE_REQUIRED` |
| [Guardrail] | [Limit] | [Enforcement] |

### 6.2 OWNER-Only Powers

Only OWNER may perform these actions. No other role may be granted these, even by OWNER:

- Transfer ownership to another user (requires email confirmation from both parties)
- Delete the last ADMIN account
- Configure system-wide security policies
- Permanently purge all data for any user
- [Additional power]

### 6.3 Universal User Rights (All Authenticated Roles)

Regardless of role, every authenticated user retains these rights. No role definition, business logic, or system state may block them. These are governed by Safety, Privacy & Control PRD §6.2.

| Right | Always Accessible From | Blocking Condition |
|---|---|---|
| Export own data | Settings | None — cannot be blocked |
| Delete own account | Settings | None — cannot be blocked |
| View own profile | Any authenticated state | None |
| Modify own profile | Settings | None |

---

## 7. Frontend vs. Backend Enforcement

| Action Type | Frontend Enforces | Backend Enforces | Security Boundary? |
|---|---|---|---|
| UI element visibility | ✅ Hide/show controls | N/A | No — UX only |
| Route/URL access | ✅ Redirect to login/403 | ✅ Reject request | Both required |
| API endpoint access | N/A | ✅ Mandatory | Backend only |
| Data read (queries) | ✅ Filter display | ✅ Filter at DB level | Both required |
| Data write | ✅ Disable controls | ✅ Reject unauthorized | Backend is authoritative |
| Role claims in JWT | N/A | ✅ Verify every request | Backend only |

**Rule:** If a permission check exists only on the frontend, it is not a permission — it is a UI hint. All security is backend-enforced. A MEMBER who calls the API directly must receive the same result as one using the UI.

---

## 8. Permission-Related Error Codes

Every code below must exist in the Error & State Reference.

| Code | HTTP Status | Copy Key | Condition |
|---|---|---|---|
| `PERMISSION_DENIED` | 403 | `errors.permission.role_required` | Authenticated but lacks required permission |
| `ROLE_REQUIRED` | 403 | `errors.permission.role_required` | Lacks required role for this action |
| `RESOURCE_ACCESS_DENIED` | 403 | `errors.permission.resource_denied` | Cannot access this specific resource |
| `OWNER_REQUIRED` | 403 | `errors.permission.owner_required` | Action requires resource ownership |
| `ROLE_CANNOT_BE_CHANGED` | 400 | `errors.permission.role_locked` | Role change violates a guardrail |
| `INVITE_TOKEN_INVALID` | 400 | `errors.invite.invalid` | See Section 5.4 |
| `INVITE_TOKEN_EXPIRED` | 400 | `errors.invite.expired` | See Section 5.4 |
| `INVITE_TOKEN_CLAIMED` | 400 | `errors.invite.claimed` | See Section 5.4 |
| `INVITE_TOKEN_REVOKED` | 400 | `errors.invite.revoked` | See Section 5.4 |
| `INVITE_EMAIL_MISMATCH` | 400 | `errors.invite.email_mismatch` | See Section 5.4 |

---

## 9. Permission Agent Ownership

| Permission Domain | Primary Agent | Validation Agent |
|---|---|---|
| Authentication (who can log in) | [Auth Agent] | [Backend Agent] |
| Role assignment | [Auth Agent] | [Orchestrator Agent] |
| Resource-level access | [Backend Agent] | [Database Agent] |
| API endpoint permissions | [Backend Agent] | [QA Agent] |
| UI visibility rules | [Frontend Agent] | [QA Agent] |
| Invitation lifecycle | [Auth Agent] | [Backend Agent] |
| Audit logging of permission changes | [Audit Agent] | [Auth Agent] |

---

## 10. Copy Registry Map Keys

*Maps each permission-related UI state to the Content & Copy PRD key. Frontend agents must use these keys — no hardcoded strings.*

| UI State | Content PRD Key |
|---|---|
| Permission denied message | `errors.permission.role_required` |
| Invitation expired screen | `errors.invite.expired` |
| Invitation already claimed | `errors.invite.claimed` |
| Invitation revoked | `errors.invite.revoked` |
| Role upgrade prompt | `[feature].role_upgrade_prompt` |
| Owner-only action blocked | `errors.permission.owner_required` |
| [UI State] | `[key]` |

---

## 11. Permission Testing Requirements

Every test below must exist in the Test Plan PRD with a corresponding passing status.

| Test ID | Test Case | Expected Behavior | Enforcement Layer |
|---|---|---|---|
| PERM-001 | Unauthenticated user accesses protected route | 401; redirect to login | Backend + Frontend |
| PERM-002 | MEMBER attempts to delete another user's resource | 403 `PERMISSION_DENIED`; resource unchanged | Backend |
| PERM-003 | VIEWER attempts to create a resource | 403 `PERMISSION_DENIED`; UI button hidden | Both |
| PERM-004 | ADMIN attempts to delete last ADMIN account | 400 `ROLE_CANNOT_BE_CHANGED` | Backend |
| PERM-005 | User accesses resource after being removed | 403 or 404 — resource not visible | Backend |
| PERM-006 | Expired invitation token submitted | 400 `INVITE_TOKEN_EXPIRED` | Backend |
| PERM-007 | Claimed invitation token submitted again | 400 `INVITE_TOKEN_CLAIMED` | Backend |
| PERM-008 | MEMBER calls write endpoint directly (no UI) | 403 `PERMISSION_DENIED` | Backend |
| PERM-009 | OWNER deletes own account | Succeeds — universal right | Backend |
| PERM-010 | Cross-tenant resource access (if MT) | 404 — tenant isolation enforced | Backend |
| PERM-011 | [Product-specific test] | [Expected behavior] | [Layer] |

---

## 12. Acceptance Criteria

- [ ] All roles defined in Section 2 are implemented
- [ ] All permissions in Section 3 enforced in backend for every role
- [ ] Frontend hides/shows controls correctly per role
- [ ] ADMIN guardrails in Section 6.1 enforced — cannot be bypassed via direct API call
- [ ] OWNER-only powers in Section 6.2 enforced
- [ ] Universal user rights in Section 6.3 cannot be blocked by any role logic
- [ ] Invitation lifecycle states and transitions implemented per Section 5
- [ ] Invitation tokens are single-use, hashed, and TTL-enforced
- [ ] All permission error codes from Section 8 used consistently
- [ ] All error codes exist in Error & State Reference
- [ ] Default role assignment per Section 2.4 works for all signup methods
- [ ] All permission tests in Section 11 pass
- [ ] Cross-tenant isolation enforced if multi-tenant architecture selected

---

**END OF ROLES & PERMISSIONS MATRIX**