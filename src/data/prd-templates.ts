/**
 * PRD Document Templates
 * 
 * Based on the AppArchitect PRD Suite structure
 * Generates 16 base PRDs + agent PRDs + collaboration map
 */

import type { InterviewAnswers } from '@/types/interview';
import type { AgentTeam } from '@/types/agents';

export interface PRDDocument {
	id: string;
	filename: string;
	title: string;
	precedence: number;
	category: 'base' | 'agent' | 'operational';
	generate: (answers: InterviewAnswers, team?: AgentTeam) => string;
}

// Helper to format date
function formatDate(): string {
	return new Date().toISOString().split('T')[0];
}

// Helper to generate table of contents
function generateTOC(sections: string[]): string {
	return sections.map((s, i) => `${i + 1}. ${s}`).join('\n');
}

export const PRD_DOCUMENTS: PRDDocument[] = [
	// 01 - Error & State Reference
	{
		id: '01-error-state',
		filename: '01-error-and-state-reference.md',
		title: 'Error & State Reference',
		precedence: 7,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Error & State Reference

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}

---

## 1. Purpose

This document defines every error code and state value in ${answers.productName}. All agents must use these exact codes and states. No agent may invent new codes without updating this document first.

---

## 2. Error Code Registry

### 2.1 Error Code Format

\`\`\`
[CATEGORY]_[SPECIFIC_ERROR]
\`\`\`

Categories:
- \`AUTH_\` — Authentication errors
- \`INPUT_\` — Validation errors
- \`BIZ_\` — Business logic errors
- \`DB_\` — Database errors
- \`EXT_\` — External service errors
- \`SYS_\` — System errors
- \`SEC_\` — Security errors

### 2.2 Authentication Errors

| Code | HTTP | User Message | When Used |
|------|------|--------------|----------|
| \`AUTH_INVALID_CREDENTIALS\` | 401 | Incorrect email or password | Login failed |
| \`AUTH_EMAIL_EXISTS\` | 409 | An account with this email already exists | Signup duplicate |
| \`AUTH_SESSION_EXPIRED\` | 401 | Your session expired. Please log in again | Token expired |
| \`AUTH_UNAUTHORIZED\` | 401 | Please log in to continue | No valid session |
| \`AUTH_OAUTH_FAILED\` | 400 | Something went wrong with the login provider | OAuth error |

### 2.3 Validation Errors

| Code | HTTP | User Message | When Used |
|------|------|--------------|----------|
| \`INPUT_FIELD_REQUIRED\` | 400 | This field is required | Missing required field |
| \`INPUT_INVALID_EMAIL\` | 400 | Please enter a valid email address | Invalid email format |
| \`INPUT_TOO_SHORT\` | 400 | Must be at least {min} characters | Below minimum length |
| \`INPUT_TOO_LONG\` | 400 | Must be fewer than {max} characters | Above maximum length |
| \`INPUT_INVALID_FORMAT\` | 400 | Invalid format | Pattern mismatch |

### 2.4 Business Logic Errors

| Code | HTTP | User Message | When Used |
|------|------|--------------|----------|
| \`BIZ_LIMIT_EXCEEDED\` | 403 | You've reached the limit for this action | Quota exceeded |
| \`BIZ_INVALID_STATE\` | 400 | This action cannot be performed right now | Invalid state transition |
| \`BIZ_NOT_FOUND\` | 404 | We couldn't find what you were looking for | Resource not found |
| \`BIZ_ALREADY_EXISTS\` | 409 | This already exists | Duplicate resource |

### 2.5 Database Errors

| Code | HTTP | User Message | When Used |
|------|------|--------------|----------|
| \`DB_RECORD_NOT_FOUND\` | 404 | We couldn't find what you were looking for | Query returned empty |
| \`DB_CONSTRAINT_VIOLATION\` | 400 | This action conflicts with existing data | FK/unique violation |
| \`DB_CONNECTION_FAILED\` | 503 | We're having trouble connecting | Database unreachable |

### 2.6 External Service Errors

| Code | HTTP | User Message | When Used |
|------|------|--------------|----------|
| \`EXT_AI_TIMEOUT\` | 504 | The AI is taking too long. Please try again | LLM timeout |
| \`EXT_AI_INVALID_RESPONSE\` | 500 | Something went wrong | LLM returned invalid JSON |
| \`EXT_PAYMENT_FAILED\` | 402 | Payment failed | Stripe error |
| \`EXT_SERVICE_UNAVAILABLE\` | 503 | A required service is temporarily unavailable | Third-party down |

### 2.7 System Errors

| Code | HTTP | User Message | When Used |
|------|------|--------------|----------|
| \`SYS_UNKNOWN_ERROR\` | 500 | Something went wrong on our end | Unhandled exception |
| \`SYS_MAINTENANCE\` | 503 | We're temporarily unavailable | Planned maintenance |
| \`SYS_NETWORK_ERROR\` | 503 | We couldn't connect | Network failure |

### 2.8 Security Errors

| Code | HTTP | User Message | When Used |
|------|------|--------------|----------|
| \`SEC_RATE_LIMIT_EXCEEDED\` | 429 | You're going too fast. Please slow down | Rate limit hit |
| \`SEC_PERMISSION_DENIED\` | 403 | You don't have permission to do that | Insufficient role |
| \`SEC_INVALID_TOKEN\` | 401 | Invalid or expired token | Bad JWT |

---

## 3. State Registries

### 3.1 User Authentication State

| State | Value | Description |
|-------|-------|-------------|
| Unauthenticated | \`UNAUTHENTICATED\` | No valid session |
| Authenticated | \`AUTHENTICATED\` | Valid session confirmed |

### 3.2 Core System States

*Based on the core systems defined for ${answers.productName}:*

${answers.coreSystems.split('\n').map(system => `#### ${system.trim()}

| State | Value | Description |
|-------|-------|-------------|
| Idle | \`IDLE\` | Not active |
| Loading | \`LOADING\` | Fetching data |
| Active | \`ACTIVE\` | In use |
| Error | \`ERROR\` | Something went wrong |
| Complete | \`COMPLETE\` | Successfully finished |`).join('\n\n')}

---

## 4. State Transition Rules

- All state transitions must be explicit — no implicit state changes
- Invalid transitions must be rejected with \`BIZ_INVALID_STATE\`
- Every transition must be logged for audit purposes
- Terminal states cannot transition (except via reset operations)

---

**END OF ERROR & STATE REFERENCE**
`,
	},

	// 02 - Roles & Permissions Matrix
	{
		id: '02-roles-permissions',
		filename: '02-roles-and-permissions-matrix.md',
		title: 'Roles & Permissions Matrix',
		precedence: 4,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Roles & Permissions Matrix

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}

---

## 1. Purpose

This document defines every user role and permission in ${answers.productName}. The Technical Architecture PRD must enforce these permissions at the API level. No feature may grant access beyond what is specified here.

---

## 2. Tenancy Model

**Model:** ${answers.tenancyModel}

${answers.tenancyModel.includes('Multi-tenant') ? `
### Multi-Tenant Rules
- Every user-data table must have a \`tenant_id\` column
- Row-Level Security (RLS) must be enabled on all user-data tables
- Cross-tenant queries are forbidden at both application and database levels
` : answers.tenancyModel.includes('Multi-user') ? `
### Multi-User Rules
- Shared workspace model where users collaborate on the same data
- Access control based on workspace membership
- Users can belong to multiple workspaces
` : `
### Single-User Rules
- All data belongs to the individual user
- No sharing or collaboration features required
- Simplified permission model
`}

---

## 3. Role Definitions

${answers.userRoles.split('\n').map(role => `### ${role.trim()}

**Description:** *[Based on ${answers.productName} requirements]*

**Capabilities:**
${answers.rolePermissions.split('\n').filter(p => p.toLowerCase().includes(role.toLowerCase().split(':')[0])).map(p => `- ${p}`).join('\n') || '- Standard access as defined below'}
`).join('\n')}

---

## 4. Permission Matrix

| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Own Profile | — | ✓ All | ✓ Owner | — | Users can view and edit their own profile |
| Own Data | ✓ Owner | ✓ Owner | ✓ Owner | ✓ Owner | Users own their data |
| Shared Data | Varies | Varies | Varies | Varies | Based on collaboration settings |

---

## 5. Permission Errors

| Scenario | Error Code | User Message |
|----------|------------|-------------|
| Insufficient role | \`SEC_PERMISSION_DENIED\` | You don't have permission to do that |
| Wrong tenant | \`SEC_PERMISSION_DENIED\` | You don't have permission to do that |
| Resource not owned | \`SEC_PERMISSION_DENIED\` | You don't have permission to do that |

---

## 6. Guardrails

The following actions are restricted regardless of role:

| Guardrail | Applies To | Cannot Do |
|-----------|------------|----------|
| Data deletion | All roles | Cannot delete another user's account |
| Permission escalation | All roles | Cannot grant permissions they don't have |
| Audit log modification | All roles | Cannot edit or delete audit logs |

---

**END OF ROLES & PERMISSIONS MATRIX**
`,
	},

	// 03 - Core Systems PRD
	{
		id: '03-core-systems',
		filename: '03-core-systems-prd.md',
		title: 'Core Systems PRD',
		precedence: 2,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Core Systems PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}
**Precedence:** 2nd (overrides Experience, Technical, Data, Content PRDs)

---

## 1. Purpose

This document defines every core system in ${answers.productName}. It specifies what the product does, not how it is built (Technical Architecture PRD) or how users experience it (Experience & Access PRD).

---

## 2. Product Identity

| Field | Value |
|-------|-------|
| **Product Name** | ${answers.productName} |
| **One-Line Description** | ${answers.productDescription} |
| **Product Type** | ${answers.productType} |
| **Primary User** | ${answers.primaryUser} |
| **Problem Solved** | ${answers.problemSolved} |
| **Unique Value** | ${answers.uniqueValue} |

---

## 3. Core Principles

${answers.corePrinciples.split('\n').map((p, i) => `${i + 1}. **${p.trim()}**`).join('\n')}

### Trade-offs Accepted

${answers.tradeoffs}

---

## 4. Systems Covered

| # | System Name | Purpose |
|---|-------------|--------|
${answers.coreSystems.split('\n').map((s, i) => `| ${i + 1} | ${s.trim()} | *Core functionality* |`).join('\n')}

---

## 5. System Specifications

${answers.coreSystems.split('\n').map((system, i) => `### 5.${i + 1} ${system.trim()}

#### Purpose
*${system.trim()} handles core functionality for ${answers.productName}.*

#### User Flows
${answers.userFlows.split('\n').filter(f => f.toLowerCase().includes(system.toLowerCase().split(' ')[0].toLowerCase())).map(f => `- ${f}`).join('\n') || '*Defined in user flow documentation*'}

#### States
${answers.systemStates.split('\n').filter(s => s.toLowerCase().includes(system.toLowerCase().split(' ')[0].toLowerCase())).map(s => `- ${s}`).join('\n') || `| State | Description |
|-------|-------------|
| IDLE | System not active |
| LOADING | Fetching data |
| ACTIVE | System in use |
| ERROR | Error occurred |
| COMPLETE | Operation finished |`}

#### Business Logic Rules
- Must validate all inputs before processing
- Must handle errors gracefully with appropriate error codes
- Must log all significant operations for audit

---`).join('\n\n')}

## 6. Cross-System Rules

### 6.1 Data Ownership
- No system may mutate another system's canonical objects directly
- All inter-system data must be passed as typed objects
- No system may bypass the API layer

### 6.2 Failure Propagation
- Upstream failures must block downstream operations
- All failures must be logged with appropriate error codes
- Recovery procedures must be documented

---

## 7. Acceptance Criteria

- [ ] All systems implement canonical data schemas exactly
- [ ] All state machines enforce allowed transitions
- [ ] All transactional boundaries succeed or roll back atomically
- [ ] Cross-system rules enforced
- [ ] All error conditions return correct codes

---

**END OF CORE SYSTEMS PRD**
`,
	},

	// 04 - Safety, Privacy & Control PRD
	{
		id: '04-safety-privacy',
		filename: '04-safety-privacy-control-prd.md',
		title: 'Safety, Privacy & Control PRD',
		precedence: 1,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Safety, Privacy & Control PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}
**Precedence:** 1st (HIGHEST — overrides all other PRDs)

---

## ⚠️ THIS DOCUMENT HAS HIGHEST PRECEDENCE

Any conflict between this document and any other PRD must be resolved in favor of this document. No exception.

---

## 1. Purpose

This document defines ${answers.productName}'s safety, privacy, and user control requirements. These requirements override all functional, technical, and experience specifications.

---

## 2. Data Collection & Privacy

### 2.1 Data Collected

${answers.dataCollected.split('\n').map(d => `- ${d.trim()}`).join('\n')}

### 2.2 Data Minimization Rules

- Collect only what is necessary for the stated function
- Delete data when no longer needed
- Never collect data "just in case"
- Every data field must have a documented purpose

### 2.3 Compliance Requirements

${Array.isArray(answers.complianceRequirements) ? answers.complianceRequirements.map(c => `- **${c}**: Full compliance required`).join('\n') : (answers.complianceRequirements || '- Standard web application privacy practices')}

---

## 3. User Control Rights

| Right | Implementation | Timeline |
|-------|----------------|----------|
| Access own data | Export all data | Within 48 hours |
| Correct own data | Edit all editable fields | Immediate |
| Delete account | Full data deletion | Within 30 days |
| Opt out of AI | Alternative non-AI path where applicable | Immediate |

---

## 4. AI/LLM Safety (if applicable)

**AI Usage:** ${answers.usesAI}

${answers.usesAI.toLowerCase().includes('yes') ? `
### 4.1 AI Boundaries

- AI must never claim to be human
- AI must never provide medical, legal, or financial advice
- AI must never access data beyond its defined scope
- AI outputs must be validated before use

### 4.2 AI Output Validation

- All LLM responses must be validated against a schema
- Invalid responses must be retried or rejected
- Raw LLM output must never reach the client directly
- Prompt content must never be logged

### 4.3 Content Moderation

${answers.contentModeration || 'Standard content moderation practices apply.'}
` : '*AI/LLM not used in this product.*'}

---

## 5. Security Requirements

### 5.1 Authentication

- HTTPS required on all endpoints
- Passwords must be hashed (bcrypt or argon2)
- Session tokens must be HTTP-only cookies
- Rate limiting on all auth endpoints

### 5.2 Authorization

- All write endpoints must verify role before processing
- Row-Level Security (RLS) on all user-data tables
- Cross-tenant access is forbidden

### 5.3 Secrets Management

- All secrets in environment variables
- Never hardcode API keys, passwords, or tokens
- Rotate secrets on suspected compromise

---

## 6. Logging & Monitoring

### 6.1 What to Log

- Authentication events
- Authorization failures
- API errors
- State transitions

### 6.2 What NEVER to Log

- Passwords (even hashed)
- Full credit card numbers
- Session tokens
- AI prompt content
- Raw user messages (if sensitive)

---

## 7. Acceptance Criteria

- [ ] All data collection documented and minimized
- [ ] User control rights implemented
- [ ] AI boundaries enforced (if applicable)
- [ ] Security requirements met
- [ ] Logging rules followed

---

**END OF SAFETY, PRIVACY & CONTROL PRD**
`,
	},
];

import { ADDITIONAL_TEMPLATES } from './additional-prd-templates';

// Export remaining templates (05-08)
export const ADDITIONAL_PRD_DOCUMENTS: PRDDocument[] = [
	// 05 - Technical Architecture
	{
		id: '05-technical-architecture',
		filename: '05-technical-architecture-prd.md',
		title: 'Technical Architecture PRD',
		precedence: 6,
		category: 'base',
		generate: (answers) => generateTechnicalArchitecturePRD(answers),
	},
	// 06 - Experience & Access
	{
		id: '06-experience-access',
		filename: '06-experience-and-access-prd.md',
		title: 'Experience & Access PRD',
		precedence: 3,
		category: 'base',
		generate: (answers) => generateExperienceAccessPRD(answers),
	},
	// 07 - Data & Integration
	{
		id: '07-data-integration',
		filename: '07-data-and-integration-prd.md',
		title: 'Data & Integration PRD',
		precedence: 5,
		category: 'base',
		generate: (answers) => generateDataIntegrationPRD(answers),
	},
	// 08 - Content & Copy
	{
		id: '08-content-copy',
		filename: '08-content-and-copy-prd.md',
		title: 'Content & Copy PRD',
		precedence: 8,
		category: 'base',
		generate: (answers) => generateContentCopyPRD(answers),
	},
	// Add documents 09-16 from additional templates
	...ADDITIONAL_TEMPLATES,
];

// Helper functions for generating specific PRDs
function generateTechnicalArchitecturePRD(answers: InterviewAnswers): string {
	return `# ${answers.productName} – Technical Architecture PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}
**Precedence:** 4th (overrides Data & Integration and Content PRDs only)

---

## 1. Purpose

This document defines how ${answers.productName} is built. It governs the technology stack, system architecture, state management, API contracts, database design, security, and developer tooling.

---

## 2. Technology Stack

### 2.1 Preferences

${answers.techPreferences || '*No specific preferences stated. Recommended defaults applied.*'}

### 2.2 Target Platforms

${Array.isArray(answers.platforms) ? answers.platforms.map(p => `- ${p}`).join('\n') : (answers.platforms || '- Web')}

### 2.3 Recommended Stack

| Layer | Technology | Purpose |
|-------|-----------|--------|
| Frontend | React + TypeScript | User interface |
| Styling | Tailwind CSS | Styling system |
| Backend | API Routes | Business logic |
| Database | PostgreSQL (Supabase) | Data persistence |
| Auth | Supabase Auth | Authentication |
| Hosting | Vercel | Deployment |

---

## 3. Architecture Principles

1. **Server-authoritative** — Client never stores source of truth
2. **Stateless client** — All persistent state on server
3. **Security by default** — Deny is the default
4. **Fail loudly** — Errors surface clearly

---

## 4. Database Design

### 4.1 Main Entities

${answers.dataEntities.split('\n').map(e => `- **${e.trim()}**`).join('\n')}

### 4.2 Relationships

${answers.entityRelationships}

### 4.3 Special Requirements

${answers.specialDataRequirements || '*None specified.*'}

---

## 5. Performance Requirements

${answers.performanceRequirements || `- Page load: < 3 seconds
- API response: < 500ms (p95)
- Uptime: 99.5%`}

---

## 6. Security Implementation

- HTTPS on all endpoints
- JWT in HTTP-only cookies
- Rate limiting on auth endpoints
- RLS on all user-data tables
- Input validation with Zod

---

**END OF TECHNICAL ARCHITECTURE PRD**
`;
}

function generateExperienceAccessPRD(answers: InterviewAnswers): string {
	return `# ${answers.productName} – Experience & Access PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}
**Precedence:** 3rd (overrides Technical, Data, Content PRDs)

---

## 1. Purpose

This document defines how users enter, move through, and experience ${answers.productName}. It governs authentication, onboarding, navigation, screen structure, and responsive behavior.

---

## 2. Target User Context

**Primary User:** ${answers.primaryUser}

**Context:** ${answers.userContext}

**Technical Literacy:** ${answers.technicalLiteracy}

${answers.secondaryUser ? `**Secondary User:** ${answers.secondaryUser}` : ''}

---

## 3. Visual Style

**Style:** ${answers.visualStyle}

**Brand Colors:** ${answers.brandColors || '*Default system colors*'}

**Accessibility:** ${answers.accessibility}

---

## 4. Key Screens

${answers.keyScreens.split('\n').map((screen, i) => `### 4.${i + 1} ${screen.trim()}

| Element | Value |
|---------|-------|
| Purpose | *${screen.trim()} functionality* |
| Auth Required | Yes |
| Primary Action | *Contextual* |`).join('\n\n')}

---

## 5. Navigation Model

- Navigation is persistent on tablet and desktop
- Navigation is a bottom tab bar on mobile
- Back navigation returns to last stable state

---

## 6. Authentication Flows

### 6.1 Signup Flow
1. User lands on landing page
2. Clicks "Get started"
3. Enters email and password
4. Account created
5. Redirect to dashboard

### 6.2 Login Flow
1. User navigates to login
2. Submits credentials
3. Session validated
4. Redirect to dashboard

---

**END OF EXPERIENCE & ACCESS PRD**
`;
}

function generateDataIntegrationPRD(answers: InterviewAnswers): string {
	return `# ${answers.productName} – Data & Integration PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}
**Precedence:** 5th (overrides Technical and Content only)

---

## 1. Purpose

This document defines all external service integrations and data contracts for ${answers.productName}.

---

## 2. External Services

${answers.externalServices.split('\n').map((service, i) => `### 2.${i + 1} ${service.trim()}

| Field | Value |
|-------|-------|
| Purpose | *${service.trim()} integration* |
| Required | Yes |
| Env Var | \`${service.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY\` |`).join('\n\n')}

---

## 3. Existing Integrations

${answers.existingIntegrations || '*No existing system integrations required.*'}

---

## 4. API Exposure

**Expose API:** ${answers.exposeAPI}

${answers.exposeAPI.toLowerCase().includes('yes') ? `
### 4.1 API Requirements

- RESTful design
- JSON responses
- Rate limiting
- API key authentication
- Versioned endpoints (\`/api/v1/\`)
` : '*No public API required.*'}

---

## 5. Data Contracts

*All data contracts must match the canonical schemas in the Core Systems PRD.*

---

**END OF DATA & INTEGRATION PRD**
`;
}

function generateContentCopyPRD(answers: InterviewAnswers): string {
	return `# ${answers.productName} – Content & Copy PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}
**Precedence:** 6th (lowest)

---

## 1. Purpose

This document defines every user-facing string in ${answers.productName}. Agents must use strings from this document exactly.

---

## 2. Voice & Tone

### 2.1 Brand Voice

Direct, helpful, slightly warm. Sounds like a senior product partner who respects the user's time.

### 2.2 Tone Principles

| Principle | Meaning |
|-----------|---------|
| Warm but not sycophantic | Friendly, no flattery |
| Direct but not blunt | Says what matters |
| Simple over clever | Plain words |
| Confident, not arrogant | States what it knows |

---

## 3. Navigation Labels

| Key | String |
|-----|--------|
| \`nav.dashboard\` | "Dashboard" |
| \`nav.settings\` | "Settings" |
| \`nav.logout\` | "Log out" |

---

## 4. Common Actions

| Key | String |
|-----|--------|
| \`global.actions.save\` | "Save" |
| \`global.actions.cancel\` | "Cancel" |
| \`global.actions.confirm\` | "Confirm" |
| \`global.actions.delete\` | "Delete" |
| \`global.actions.back\` | "Back" |

---

## 5. Error Messages

| Key | String |
|-----|--------|
| \`errors.generic\` | "Something went wrong. Please try again." |
| \`errors.network\` | "We couldn't connect. Check your connection." |
| \`errors.unauthorized\` | "Please log in to continue." |
| \`errors.forbidden\` | "You don't have permission to do that." |

---

## 6. Product-Specific Copy

*Copy for ${answers.productName} specific features should follow the voice and tone guidelines above.*

---

**END OF CONTENT & COPY PRD**
`;
}

// Get all PRD documents
export function getAllPRDDocuments(): PRDDocument[] {
	return [...PRD_DOCUMENTS, ...ADDITIONAL_PRD_DOCUMENTS];
}
