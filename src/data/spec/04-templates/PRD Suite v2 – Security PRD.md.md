# [Product Name] – Security PRD

**Version:** 2.0
**Status:** Authoritative · Build-Ready · Mandatory
**Governed by:** [Product Name] – Master PRD Index
**Precedence:** 1st alongside Safety — security and safety requirements are non-negotiable

---

## ⚠️ Precedence Compliance Block

This document defines the security requirements of the product. It is on equal footing with the Safety, Privacy & Control PRD and has the highest implementation priority. No other document may deprioritize a security requirement.

| Higher-Tier Document | Rule That Governs This File | Verification Required |
|---|---|---|
| Safety, Privacy & Control PRD | Privacy controls are required | Security controls must not undermine privacy guarantees |
| Compliance Requirements | Specific regulatory standards apply | All security controls must satisfy applicable compliance regimes |
| Requirements Summary | Functional and non-functional reqs | Every security requirement is registered as a `S-*` requirement |

---

## 1. Purpose of This Document

This document defines the security posture of the product. It specifies what the product must do to protect user data, prevent unauthorized access, defend against common attack patterns, and meet its compliance obligations.

This document is a *specification of what* the product must do. The *implementation* of these controls is specified in the Technical Architecture PRD.

---

## 2. RLM Compliance

| Field | Value |
|---|---|
| Information Density | O(A×T) — A assets × T threat types. Quadratic when controls are cross-cutting. |
| Density Explanation | Each asset is exposed to each threat type; controls cut across multiple assets |
| Decomposition Required | Yes — process one asset class at a time, then one threat category at a time, then verify cross-cutting controls |
| Decomposition Strategy | Step 0: enumerate asset classes. Step 1: enumerate threat categories (use STRIDE). Step 2: for each asset class × threat, document required controls. Step 3: enumerate cross-cutting controls (auth, logging, etc.) |

---

## 3. Security Principles

These principles govern every security decision in this document.

| # | Principle | What It Means |
|---|---|---|
| 1 | Defense in depth | No single control is the only defense; multiple overlapping controls are required |
| 2 | Least privilege | Every component has only the permissions it needs, no more |
| 3 | Zero trust | All access is authenticated and authorized, including internal service-to-service |
| 4 | Fail secure | When something fails, it fails closed — no data leak, no escalation |
| 5 | Audit everything | All security-relevant events are logged and retained |
| 6 | Privacy by design | Privacy is a first-class requirement, not a retrofit |
| 7 | Secure by default | Insecure configurations are impossible to ship by accident |
| 8 | Patchable | All dependencies are kept current; vulnerabilities are remediated within SLA |

---

## 4. Threat Model (STRIDE)

For each asset class, document the threats it faces using STRIDE.

| Threat | Description | Asset Class Affected |
|---|---|---|
| **S**poofing | Attacker pretends to be a legitimate user or system | Auth tokens, sessions, API calls |
| **T**ampering | Attacker modifies data in transit or at rest | DB records, API responses, file uploads |
| **R**epudiation | User denies an action they took | Audit logs, state changes, payments |
| **I**nformation disclosure | Attacker accesses data they shouldn't | User data, logs, error messages |
| **D**enial of service | Attacker makes the product unavailable | All public endpoints, infrastructure |
| **E**levation of privilege | Attacker gains higher privileges than they should | Auth, role checks, API access |

---

## 5. Asset Inventory

| Asset Class | Description | Sensitivity | Storage Location |
|---|---|---|---|
| User PII | Names, emails, phone numbers | HIGH | [Database] |
| Authentication credentials | Passwords, OAuth tokens, sessions | CRITICAL | [Auth service] |
| Payment data | Card numbers, bank accounts | CRITICAL | [Stripe / PCI-compliant vault] |
| User-generated content | Posts, messages, uploads | MEDIUM | [Database / object storage] |
| Business data | Internal configs, internal users | MEDIUM | [Database] |
| Logs | Application, access, error logs | MIXED | [Log storage] |
| Backups | DB and object storage backups | HIGH | [Encrypted backup storage] |
| Secrets | API keys, encryption keys, signing keys | CRITICAL | [Secret manager] |

---

## 6. Authentication Controls

### 6.1 Password Policy

| Requirement | Value |
|---|---|
| Minimum length | [12] characters |
| Maximum length | [128] characters |
| Required character classes | None (length > complexity per NIST) |
| Breach check | [HaveIBeenPwned or equivalent] |
| Rotation | Only on suspected compromise |
| Storage | Bcrypt with cost factor 12+ (or Argon2id) |
| Verification timing | Constant-time comparison |

### 6.2 Multi-Factor Authentication

| Method | Supported | Required For |
|---|---|---|
| TOTP (authenticator app) | Yes | High-privilege roles |
| SMS | [Yes / No] | [Not recommended — vulnerable to SIM swap] |
| WebAuthn / Passkey | Yes | High-privilege roles |
| Email magic link | Yes | Backup method |

### 6.3 Session Management

| Setting | Value |
|---|---|
| Session storage | HTTP-only, Secure, SameSite=Lax cookies |
| Session timeout | 30 days idle / 24 hours active |
| Session invalidation triggers | Logout, password change, MFA change, account deletion |
| Concurrent sessions | [Allowed / Not allowed] |
| Session ID rotation | On every privilege change |
| CSRF protection | Double-submit cookie or SameSite=Strict |

### 6.4 OAuth / SSO

| Provider | Supported | Notes |
|---|---|---|
| [Provider 1] | Yes | [Notes] |
| [Provider 2] | Yes | [Notes] |

**OAuth hardening requirements:**
- State parameter required (CSRF protection)
- PKCE required for all clients
- Redirect URIs validated against allowlist
- `nonce` parameter required for OIDC
- Token validation: signature, issuer, audience, expiry

---

## 7. Authorization Controls

### 7.1 Role-Based Access Control (RBAC)

Detailed in Roles & Permissions Matrix. This section adds security requirements:

- All API endpoints must check authorization — no "internal only" assumptions
- Default deny — no access unless explicitly granted
- Privilege escalation is logged and alerted
- Role changes require re-authentication for sensitive operations

### 7.2 Attribute-Based / Resource-Level Checks

Beyond roles, certain resources have additional access rules:

| Resource | Access Rule | Check Location |
|---|---|---|
| User's own data | `user_id == authenticated_user.id` | API layer |
| Tenant's data | `tenant_id == authenticated_user.tenant_id` | API layer + DB row-level security |
| Resource owner | `resource.user_id == authenticated_user.id` | API layer |
| [Resource] | [Rule] | [Check location] |

### 7.3 API Authorization

| Endpoint Category | Auth Required | Auth Method | Authorization Check |
|---|---|---|---|
| Public (landing, docs) | No | — | — |
| Auth (signup, login) | No | — | Rate limited |
| User (own data) | Yes | Session | User owns resource |
| User (read other) | Yes | Session | Role + permission check |
| Admin | Yes | Session + MFA | Admin role + audit log |
| Webhooks (incoming) | Yes | Signature | Signature verification |
| Webhooks (outgoing) | N/A | — | Signed payloads |
| Internal service-to-service | Yes | mTLS or signed JWT | Service identity |

---

## 8. Data Protection

### 8.1 Encryption

| Data State | Algorithm | Key Management |
|---|---|---|
| In transit (external) | TLS 1.3 | [Certificate authority] |
| In transit (internal) | TLS 1.3 or mTLS | Internal CA |
| At rest (database) | AES-256-GCM | Cloud KMS |
| At rest (object storage) | AES-256-GCM (server-side) | Cloud KMS |
| At rest (backups) | AES-256-GCM | Separate key from primary |
| At rest (user-uploaded files) | AES-256-GCM | Per-tenant keys preferred |

### 8.2 Secret Management

| Secret Type | Storage | Rotation |
|---|---|---|
| Database credentials | Secret manager (e.g., AWS Secrets Manager) | 90 days |
| API keys (third-party) | Secret manager | Per provider SLA |
| Encryption keys | KMS | Annual or per incident |
| JWT signing keys | Secret manager | Annual |
| OAuth client secrets | Secret manager | Annual |

**Rules:**
- Secrets never in code, env files in source, or logs
- Secrets never in client-side bundles
- Secrets are loaded at boot from secret manager, not env vars in source

### 8.3 PII Handling

| PII Type | Stored? | Displayed? | Logged? | Exported? |
|---|---|---|---|---|
| Email | Yes | Partial (masked in admin views) | Hashed (sha256 + salt) | Yes (on user request) |
| Phone | [Yes / No] | [Masked] | [Not logged] | [On user request] |
| Name | Yes | Full (own user) | [Not logged] | Yes |
| Address | [Yes / No] | [Masked] | [Not logged] | [On user request] |
| IP address | Yes (transient) | [Admin only] | Yes (auto-purged after 30 days) | [On legal request] |
| User agent | Yes (transient) | [Admin only] | Yes (auto-purged after 30 days) | [On legal request] |

**Masking rules:**
- Email: `j***@example.com` in admin views
- Phone: `***-***-1234` in admin views
- Card: `****-****-****-1234` (never stored, only last 4)

---

## 9. Input Validation

| Input Class | Validation | Sanitization | Where |
|---|---|---|---|
| All API inputs | Type, length, format, range | Strip control chars | API gateway |
| User text (free-form) | Length max, no HTML by default | HTML-escape on display | Server + client |
| User HTML (if allowed) | Allowlist sanitizer (DOMPurify) | Sanitize on save and re-render | Server + client |
| File uploads | Type allowlist, size limit, magic-byte check | Re-encode images server-side | Upload handler |
| URLs | Scheme allowlist (https only) | Validate against allowlist if clicking | Server + client |
| SQL | Parameterized queries only | N/A | All DB access |
| JSON | Schema validation | Reject unknown fields | All API endpoints |
| Email | RFC 5322 + DNS check optional | Lowercase before storage | Auth flow |

---

## 10. Output Encoding

| Output Context | Encoding | Notes |
|---|---|---|
| HTML body | Contextual HTML encoding | Per attribute, JS, URL, CSS context |
| JavaScript | JSON.stringify or safe encoder | Never innerHTML with untrusted data |
| URL parameters | URL encoding | Per parameter |
| HTTP headers | Header value validation | Reject CRLF |
| SQL | Parameterized queries | Never string concatenation |
| Shell | Use execve, not shell | Never shell commands with user input |
| File paths | Allowlist + canonicalization | Reject path traversal |

---

## 11. Rate Limiting & Abuse Prevention

| Endpoint Category | Rate Limit | Action on Exceed |
|---|---|---|
| Login | [10 / IP / minute, 100 / account / hour] | 429 + exponential backoff |
| Signup | [5 / IP / hour] | 429 + captcha |
| Password reset | [5 / email / hour] | 429 + captcha |
| API general | [60 / user / minute] | 429 |
| API heavy endpoints | [10 / user / minute] | 429 |
| File upload | [50 / user / hour] | 429 |
| Webhook delivery (incoming) | [Varies by source] | 429 + signature log |

**Detection:**
- Brute force detection: alert on [N] failed logins in [T] from same IP
- Credential stuffing: alert on [N] unique usernames attempted from same IP
- API abuse: alert on [N] 4xx/5xx from same source in [T]

---

## 12. Logging & Monitoring

### 12.1 What Must Be Logged

| Event Category | Logged Fields | Retention |
|---|---|---|
| Authentication events | user_id (or attempted), IP, user agent, result, MFA used | 1 year |
| Authorization failures | user_id, resource, action, result | 1 year |
| Privilege changes | actor, target, old_role, new_role, timestamp | 7 years |
| Data access (sensitive) | user_id, resource, action, reason | 1 year |
| Data modifications (sensitive) | actor, resource, before/after, timestamp | 7 years |
| Admin actions | actor, action, target, result | 7 years |
| Security alerts | alert_id, source, payload, response | 3 years |
| Configuration changes | actor, setting, old_value, new_value | 7 years |

### 12.2 What Must NEVER Be Logged

- Passwords (plain or hashed)
- API keys / tokens / secrets
- Full payment card numbers
- Full SSN, tax ID, government ID
- Authentication session tokens (logged at the session ID level only)
- Plain text message contents (use content hash + metadata)

### 12.3 Alerting

| Alert | Trigger | Severity | Response |
|---|---|---|---|
| Failed login spike | > [N] from same IP in [T] | Medium | Rate limit + investigate |
| Privilege escalation attempt | Any unauthorized role change attempt | High | Page security on-call |
| Data exfiltration attempt | Unusual data access pattern | Critical | Lock account, page on-call |
| Authentication bypass attempt | Anomalous auth success | Critical | Page on-call |
| Secret leak detection | Secret in code, log, or public asset | Critical | Rotate + investigate |
| Vulnerability disclosure | CVE in dependency | Per CVE | Patch per SLA |

---

## 13. Vulnerability Management

| Activity | Frequency | Tool / Process |
|---|---|---|
| Dependency scanning | Every PR + daily | [Snyk / Dependabot / equivalent] |
| SAST (static analysis) | Every PR | [Tool] |
| DAST (dynamic scanning) | Weekly + pre-release | [Tool] |
| Container scanning | Every build | [Tool] |
| Penetration testing | Annual + per major release | External firm |
| Bug bounty | Continuous | [HackerOne / Bugcrowd / equivalent] |
| CVE monitoring | Continuous | [NVD feed / GitHub Advisory] |

**Remediation SLA:**

| Severity | Patch SLA |
|---|---|
| Critical | 24 hours |
| High | 7 days |
| Medium | 30 days |
| Low | 90 days |

---

## 14. Incident Response

| Phase | Activities | Owner |
|---|---|---|
| Detection | Alert fires; on-call acknowledges | On-call |
| Triage | Severity assessment; scope determination | On-call + security lead |
| Containment | Isolate affected systems; revoke compromised credentials | Security lead |
| Eradication | Remove attacker access; patch vulnerability | Security lead + engineering |
| Recovery | Restore from clean backups; verify integrity | Engineering |
| Post-incident | Postmortem within 5 business days; user notification if required | Security lead + comms |

**Communication plan:**
- Internal: Slack #security-incidents
- Customer notification: Within [N] hours of confirmed breach affecting PII (per regulatory requirements)
- Regulatory notification: Per compliance requirements (e.g., GDPR 72-hour rule)

---

## 15. Compliance Mapping

| Standard | Applicable | Status | Owner |
|---|---|---|---|
| GDPR | [Yes / No] | [Compliant / In progress] | [Owner] |
| CCPA | [Yes / No] | [Compliant / In progress] | [Owner] |
| HIPAA | [Yes / No] | [Compliant / In progress] | [Owner] |
| SOC 2 Type II | [Yes / No] | [In progress / Certified] | [Owner] |
| PCI DSS | [Yes / No] | [Compliant / N/A via Stripe] | [Owner] |
| [Standard] | [Yes / No] | [Status] | [Owner] |

---

## 16. Security Test Plan (Detailed in Test Plan PRD)

| Test Type | Frequency | Owner | Tool |
|---|---|---|---|
| SAST | Every PR | Engineering | [Tool] |
| DAST | Weekly | Security | [Tool] |
| Dependency scan | Every PR | Engineering | [Tool] |
| Container scan | Every build | Engineering | [Tool] |
| Penetration test | Annual | External | [Firm] |
| Bug bounty | Continuous | External | [Platform] |
| Red team exercise | Annual | External | [Firm] |

---

## 17. Verification Sub-Call Requirements

Before this document is marked complete:

1. **Threat coverage:** Every STRIDE category is addressed for every asset class
2. **Control coverage:** Every control has at least one test in the Test Plan PRD
3. **Compliance coverage:** All applicable standards are mapped and have owners
4. **PII coverage:** Every PII type is classified and handled correctly
5. **Log coverage:** Every security-relevant event is logged; no prohibited content is logged
6. **Incident plan:** Incident response procedure has defined owners and SLAs
7. **SLA coverage:** All remediation SLAs are documented and tracked

---

## 18. Acceptance Criteria

- [ ] Threat model uses STRIDE and covers all asset classes
- [ ] Authentication controls are fully specified (passwords, MFA, sessions, OAuth)
- [ ] Authorization controls are specified for every API category
- [ ] Encryption is specified for every data state
- [ ] Secret management is specified with rotation policy
- [ ] PII handling is specified for every PII type
- [ ] Input validation rules are specified for every input class
- [ ] Output encoding is specified for every output context
- [ ] Rate limiting is specified for every endpoint category
- [ ] Logging is specified for security events; prohibited content is excluded
- [ ] Alerting rules are specified with response procedures
- [ ] Vulnerability management is specified with remediation SLAs
- [ ] Incident response procedure is fully specified
- [ ] Compliance mapping is complete with owners
- [ ] Every security requirement is registered as `S-*` in Requirements Summary
- [ ] Every control has a corresponding test in Test Plan PRD
- [ ] No security control depends on undocumented behavior

---

**END OF SECURITY PRD**
