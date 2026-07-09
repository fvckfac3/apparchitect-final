# AppArchitect – Auth & Security Agent PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Governed by:** AppArchitect – Master PRD Index
**Agent Role:** Implements authentication, session management, and security boundaries
**Precedence:** Never overrides Base PRDs. All Base PRD rules apply.

---

## 1. Agent Identity

| Field | Value |
|---|---|
| **Agent Name** | Auth & Security Agent |
| **Role** | Implement email/password auth, session lifecycle, password reset, security headers |
| **Type** | Security |
| **Operates On** | Auth routes, session management, password hashing, JWT signing, security headers |
| **Triggered By** | Orchestrator phase unlock (after Database Agent COMPLETE) |
| **Blocking?** | Yes — blocks user-facing release |

## 2. Mission Statement

The Auth & Security Agent implements all authentication, session management, and security infrastructure for AppArchitect. It produces a hardened auth surface: bcrypt-hashed passwords, HTTP-only JWT cookies, CSRF protection, password reset with TTL-bound tokens, rate-limited auth endpoints, security headers, and a role enforcement helper used by every other backend route. It enforces the Roles & Permissions Matrix and applies all prohibited-content logging rules from the Safety PRD.

## 3. Scope

### 3.1 In Scope
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/password-reset/request`
- `POST /api/v1/auth/password-reset/confirm`
- `GET /api/v1/auth/session`
- Password hashing (bcrypt, 12+ rounds)
- JWT signing and verification
- HTTP-only cookie management
- CSRF token generation and validation
- Rate limiting on auth endpoints
- Security headers (HSTS, X-Frame-Options, CSP, X-Content-Type-Options, Referrer-Policy)
- Role enforcement helper (used by Backend Agent)
- Session expiry and invalidation on password change / deletion

### 3.2 Out of Scope
- OAuth (not in MVP)
- 2FA / MFA (not in MVP)
- Database schema (Database Agent)
- API business logic (Backend Agent)
- Frontend login UI (Frontend Agent)
- Email sending (Data Integration Agent)

## 4. Inputs

### 4.1 Input Summary
| Input | Source | Format | Required |
|---|---|---|---|
| `rolesMatrix` | Roles & Permissions Matrix | JSON | Yes |
| `errorCodes` | Error & State Reference | JSON | Yes |
| `envVars` | Environment & Secrets Reference | JSON | Yes |
| `database` | Database Agent | PostgreSQL connection | Yes |

### 4.2 Input Schemas
```typescript
type SignupRequest = {
  email: string;                   // must be valid email
  password: string;                // min 8 chars, must contain number
}

type LoginRequest = {
  email: string;
  password: string;
}

type PasswordResetRequestBody = {
  email: string;
}

type PasswordResetConfirmBody = {
  token: string;
  newPassword: string;
}
```

### 4.3 Input Validation Rules
- Email format validated via RFC 5322
- Password: min 8 chars, at least one number, at least one letter
- All inputs validated with Zod before any processing

## 5. Outputs

### 5.1 Output Summary
| Output | Destination | Format | Always Produced |
|---|---|---|---|
| Auth route handlers | `/api/v1/auth/*` | TypeScript | Yes |
| `requireAuth` middleware | `/lib/auth/middleware.ts` | TypeScript | Yes |
| `requireRole(role)` helper | `/lib/auth/middleware.ts` | TypeScript | Yes |
| Password hashing utilities | `/lib/auth/password.ts` | TypeScript | Yes |
| JWT signing utilities | `/lib/auth/jwt.ts` | TypeScript | Yes |
| Security headers middleware | `/lib/auth/headers.ts` | TypeScript | Yes |
| Sign-off report | Orchestrator | JSON | Yes |

### 5.2 Output Schemas
**AuthSignOff**
```typescript
type AuthSignOff = {
  routesImplemented: number;
  passwordHashingRounds: number;        // ≥ 12
  jwtAlgorithm: 'HS256' | 'HS512' | 'RS256';
  sessionCookieFlags: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax';
  };
  rateLimitOnAuth: boolean;
  securityHeadersConfigured: boolean;
  roleEnforcementHelperTested: boolean;
  issues: Array<{ severity: string; description: string }>;
}
```

## 6. Behavior Rules

### 6.1 Execution Steps (Ordered)

**Step 1: Setup Auth Utilities**
- `password.ts`: bcrypt with cost factor 12+
- `jwt.ts`: sign and verify with HS256+ algorithm
- `middleware.ts`: `requireAuth`, `requireRole(role)`, `requireOwner`

**Step 2: Implement Signup**
- Validate input with Zod
- Check email uniqueness → 409 `AUTH_EMAIL_EXISTS` if exists
- Hash password with bcrypt
- Insert user with default role per Roles & Permissions Matrix §2.4
- Create session, set HTTP-only cookie
- Return user object (no password_hash) + session

**Step 3: Implement Login**
- Validate input
- Look up user by email
- Verify password → 401 `AUTH_INVALID_CREDENTIALS` if wrong
- Create session, set cookie
- Return user + session

**Step 4: Implement Logout**
- Invalidate session server-side
- Clear cookie
- Return 200

**Step 5: Implement Password Reset Request**
- Validate email
- Generate cryptographically random token (32+ bytes)
- Hash token, store with TTL (1 hour)
- Send email via Data Integration Agent with reset link
- Always return 200 (no email enumeration)

**Step 6: Implement Password Reset Confirm**
- Validate token
- Look up by hashed token
- Check TTL → 400 `AUTH_PASSWORD_RESET_EXPIRED` if expired
- Set new password (bcrypt hash)
- Invalidate all existing sessions for that user
- Send confirmation email

**Step 7: Implement Session Verification**
- Read JWT from HTTP-only cookie
- Verify signature
- Check expiry
- Look up session in DB
- Return user object or 401

**Step 8: Role Enforcement Helper**
- `requireRole(role: UserRole)` middleware
- Used by every write endpoint in Backend Agent
- Throws 403 `PERMISSION_DENIED` or 403 `ROLE_REQUIRED`

**Step 9: Rate Limiting**
- 5 login attempts per email per 15 min
- 3 password reset requests per email per hour
- 10 signup attempts per IP per hour

**Step 10: Security Headers**
- HSTS: `max-age=31536000; includeSubDomains; preload`
- CSP: `default-src 'self'; script-src 'self'; ...`
- X-Frame-Options: `DENY`
- X-Content-Type-Options: `nosniff`
- Referrer-Policy: `strict-origin-when-cross-origin`

**Step 11: Sign-off**
- Emit `AuthSignOff`
- Set `handoffReady: true` only if all checks pass

### 6.2 Decision Logic
**Decision: Throttle or block**
```
IF failed login attempts > 5 in 15 min for same email
THEN block with 429 SEC_RATE_LIMIT_EXCEEDED
ELSE allow attempt, log failure
```

**Decision: Cookie flags**
```
IF environment is production
THEN secure: true, sameSite: 'Strict', httpOnly: true
ELSE secure: false (for localhost dev), sameSite: 'Lax', httpOnly: true
```

### 6.3 Iteration Behavior
- Iterates over: auth routes in dependency order (signup → login → password reset → session)
- Final pass: security review before sign-off

### 6.4 Concurrency Rules
- May run concurrently with: Content & Design, Frontend (read-only on auth API surface)
- Must not run concurrently with: another Auth & Security Agent

## 7. Edge Cases & Failure Modes
| Scenario | Expected Behavior |
|---|---|
| Email already exists at signup | 409 `AUTH_EMAIL_EXISTS` |
| Wrong password at login | 401 `AUTH_INVALID_CREDENTIALS` |
| Rate limit hit | 429 with retry-after |
| Expired JWT | 401 `AUTH_SESSION_EXPIRED` |
| Tampered JWT | 401 `AUTH_UNAUTHORIZED` |
| Password reset token expired | 400 `AUTH_PASSWORD_RESET_EXPIRED` |
| Password reset token used twice | 400 `AUTH_PASSWORD_RESET_USED` |
| Email enumeration attempt at password reset | Always return 200 (timing-safe) |
| User deletes account while in active session | Invalidate session, return 401 |

## 8. Dependencies

### 8.1 Base PRD Dependencies
| PRD | Relevant Sections |
|---|---|
| Roles & Permissions Matrix | All |
| Error & State Reference | Auth and permission error codes |
| Safety, Privacy & Control PRD | §8 (Logging), §6 (Account deletion) |
| Technical Architecture PRD | §10 (Security) |
| Environment & Secrets Reference | Auth-related env vars |

### 8.2 Agent Dependencies
| Type | Agent | Nature |
|---|---|---|
| Must run after | Database Agent | Users table |
| Must run after | Data Integration Agent | Email service for password reset |
| May run concurrently | Frontend Agent | Different concerns |
| Must run before | QA Agent | Needs auth to test |

### 8.3 External Services
| Service | Used For | Failure Impact |
|---|---|---|
| bcrypt | Password hashing | Critical |
| JWT library | Token signing | Critical |
| Email service | Password reset emails | High (degrades to manual reset) |

## 9. Error Code Registry
| Code | Meaning | Severity | Recovery |
|---|---|---|---|
| `AUTH_EMAIL_EXISTS` | Signup with existing email | Medium | Suggest login |
| `AUTH_INVALID_CREDENTIALS` | Wrong email/password | Medium | Retry |
| `AUTH_SESSION_EXPIRED` | JWT past expiry | Low | Re-login |
| `AUTH_UNAUTHORIZED` | Missing or invalid token | Low | Re-login |
| `AUTH_FORBIDDEN` | Authenticated but not allowed | Medium | Permission error |
| `AUTH_PASSWORD_RESET_EXPIRED` | Reset token past TTL | Low | Request new |
| `AUTH_PASSWORD_RESET_USED` | Reset token already used | Low | Request new |
| `SEC_RATE_LIMIT_EXCEEDED` | Rate limit hit | Low | Wait and retry |
| `PASSWORD_HASH_FAILED` | bcrypt failure | Critical | Critical alert |
| `JWT_VERIFICATION_FAILED` | Invalid signature | Critical | Reject token |

## 10. Logging & Observability
- Log every login (success and failure) with user ID, IP, timestamp — no password
- Log every signup with user ID
- Log every password reset request and confirm
- Log every role check failure
- Never log: passwords, password hashes, JWT contents, session token contents, PII

## 11. Acceptance Criteria
- [ ] All auth routes implemented
- [ ] Passwords hashed with bcrypt cost ≥ 12
- [ ] JWTs signed with HS256+
- [ ] Cookies HTTP-only, SameSite=Strict (production), Secure in production
- [ ] Rate limiting on all auth endpoints
- [ ] Security headers configured
- [ ] Role enforcement helper used by every Backend Agent write endpoint
- [ ] Password reset flow works end-to-end
- [ ] No secrets in source code
- [ ] No PII in logs
- [ ] AuthSignOff all PASS

## 12. Test Cases
- 12.1 Happy: signup → login → access protected route → logout.
- 12.2 Error: 6 failed logins in 15 min → 429.
- 12.3 Edge: password reset token reused → 400.

---

**END OF AUTH & SECURITY AGENT PRD**