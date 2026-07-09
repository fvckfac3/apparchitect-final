/**
 * Additional PRD Templates (Documents 09-16)
 * 
 * Completes the 16 base PRD suite
 */

import type { InterviewAnswers } from '@/types/interview';
import type { AgentTeam } from '@/types/agents';
import type { PRDDocument } from './prd-templates';

function formatDate(): string {
	return new Date().toISOString().split('T')[0];
}

export const ADDITIONAL_TEMPLATES: PRDDocument[] = [
	// 09 - Design System & Component Reference
	{
		id: '09-design-system',
		filename: '09-design-system-and-component-reference.md',
		title: 'Design System & Component Reference',
		precedence: 7,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Design System & Component Reference

**Version:** 1.0
**Status:** Authoritative
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}

---

## 1. Purpose

This document defines every visual and interactive decision for ${answers.productName}.

---

## 2. Design Principles

| Principle | Meaning |
|-----------|---------|
| Clarity over cleverness | Standard patterns over novel interactions |
| Accessible by default | WCAG ${answers.accessibility || 'AA'} minimum |
| Consistent over creative | Components behave the same everywhere |

---

## 3. Color System

### 3.1 Brand Colors

${answers.brandColors ? `*Based on provided brand colors:*

${answers.brandColors}` : `| Token | Hex | Usage |
|-------|-----|-------|
| \`color-brand-primary\` | \`#0F62FE\` | Primary CTAs, focus states |
| \`color-brand-secondary\` | \`#393939\` | Supporting accents |
| \`color-brand-tertiary\` | \`#8D8D8D\` | Subtle accents |`}

### 3.2 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| \`color-success\` | \`#24A148\` | Success states |
| \`color-warning\` | \`#F1C21B\` | Warning states |
| \`color-error\` | \`#DA1E28\` | Error states |
| \`color-info\` | \`#0F62FE\` | Informational |

---

## 4. Typography

### 4.1 Font Families

| Token | Font | Usage |
|-------|------|-------|
| \`font-primary\` | Inter | All body text, UI |
| \`font-mono\` | JetBrains Mono | Code, error codes |

### 4.2 Type Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| \`text-xs\` | 12px | 400 | Labels, captions |
| \`text-sm\` | 14px | 400 | Body small |
| \`text-base\` | 16px | 400 | Body default |
| \`text-lg\` | 18px | 400 | Body large |
| \`text-xl\` | 20px | 600 | Subheadings |
| \`text-2xl\` | 24px | 700 | Page titles |
| \`text-4xl\` | 36px | 800 | Hero |

---

## 5. Spacing System

*All spacing is multiples of 4px.*

| Token | Value | Usage |
|-------|-------|-------|
| \`space-1\` | 4px | Minimum internal padding |
| \`space-2\` | 8px | Tight spacing |
| \`space-4\` | 16px | Default component padding |
| \`space-6\` | 24px | Card inner padding |
| \`space-8\` | 32px | Large section spacing |

---

## 6. Component Library

### 6.1 Button

**Variants:** primary, secondary, destructive, ghost, link

**Sizes:** xs (28px), sm (32px), md (40px), lg (48px)

**States:** default, hover, focus, active, loading, disabled

### 6.2 Input

**States:** default, focus, error, disabled, read-only

### 6.3 Modal

**Sizes:** xs (320px), sm (400px), md (560px), lg (720px)

---

## 7. Accessibility

**Target:** ${answers.accessibility || 'WCAG AA'}

- Minimum contrast: 4.5:1 for text
- All interactive elements keyboard accessible
- Reduced motion respected

---

**END OF DESIGN SYSTEM & COMPONENT REFERENCE**
`,
	},

	// 10 - Migrations & Seed Data Reference
	{
		id: '10-migrations',
		filename: '10-migrations-and-seed-data-reference.md',
		title: 'Migrations & Seed Data Reference',
		precedence: 7,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Migrations & Seed Data Reference

**Version:** 1.0
**Status:** Authoritative
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}

---

## 1. Purpose

This document defines all database migrations and seed data for ${answers.productName}.

---

## 2. Data Entities

${answers.dataEntities.split('\n').map((entity, i) => `### 2.${i + 1} ${entity.trim()}

\`\`\`sql
CREATE TABLE ${entity.trim().toLowerCase().replace(/\s+/g, '_')}s (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\``).join('\n\n')}

---

## 3. Relationships

${answers.entityRelationships}

---

## 4. Row-Level Security

*RLS must be enabled on all user-data tables.*

\`\`\`sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own data"
  ON table_name
  FOR ALL
  USING (user_id = auth.uid());
\`\`\`

---

## 5. Seed Data

*Seed data should be provided for development and testing environments.*

---

**END OF MIGRATIONS & SEED DATA REFERENCE**
`,
	},

	// 11 - Environment & Secrets Reference
	{
		id: '11-environment',
		filename: '11-environment-and-secrets-reference.md',
		title: 'Environment & Secrets Reference',
		precedence: 7,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Environment & Secrets Reference

**Version:** 1.0
**Status:** Authoritative
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}

---

## 1. Purpose

This document defines all environment variables and secrets for ${answers.productName}.

---

## 2. Environment Variables

### 2.1 Required Variables

| Variable | Purpose | Example |
|----------|---------|--------|
| \`DATABASE_URL\` | PostgreSQL connection | \`postgres://...\` |
| \`NEXT_PUBLIC_SUPABASE_URL\` | Supabase project URL | \`https://xxx.supabase.co\` |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anon key | \`eyJ...\` |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Supabase service key | \`eyJ...\` |

### 2.2 Optional Variables

${answers.externalServices.split('\n').map(service => {
	const varName = service.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
	return `| \`${varName}_API_KEY\` | ${service.trim()} integration | \`sk-...\` |`;
}).join('\n')}

---

## 3. Secrets Management

### 3.1 Rules

- NEVER hardcode secrets in source code
- NEVER commit .env files to version control
- Rotate secrets on suspected compromise
- Use environment-specific secrets (dev/staging/prod)

### 3.2 Secret Rotation

| Secret Type | Rotation Frequency | On Compromise |
|-------------|-------------------|---------------|
| Database credentials | Quarterly | Immediate |
| API keys | Annually | Immediate |
| JWT secrets | Annually | Immediate |

---

## 4. .env.example

\`\`\`env
# Database
DATABASE_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# External Services
${answers.externalServices.split('\n').map(service => {
	const varName = service.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
	return `${varName}_API_KEY=`;
}).join('\n')}
\`\`\`

---

**END OF ENVIRONMENT & SECRETS REFERENCE**
`,
	},

	// 12 - Test Plan PRD
	{
		id: '12-test-plan',
		filename: '12-test-plan-prd.md',
		title: 'Test Plan PRD',
		precedence: 7,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Test Plan PRD

**Version:** 1.0
**Status:** Authoritative
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}

---

## 1. Purpose

This document defines what must be tested and how for ${answers.productName}.

---

## 2. Testing Strategy

### 2.1 Testing Approach

${(answers.testingApproach || []).map(approach => `- **${approach}**`).join('\n')}

### 2.2 Testing Priorities

${answers.testingPriorities}

---

## 3. Test Categories

### 3.1 Unit Tests

- All business logic functions
- All utility functions
- All data transformations

### 3.2 Integration Tests

- API endpoints
- Database operations
- External service integrations

### 3.3 End-to-End Tests

- Critical user journeys
- Authentication flows
- Core feature workflows

### 3.4 Security Tests

- Authentication bypass attempts
- Authorization enforcement
- Input validation
- SQL injection prevention

---

## 4. Coverage Requirements

| Category | Minimum Coverage |
|----------|----------------|
| Unit | 80% |
| Integration | 60% |
| E2E | Critical paths 100% |

---

## 5. Test Environment

- Isolated test database
- Mocked external services
- Deterministic test data

---

## 6. Acceptance Criteria

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] No critical security issues
- [ ] Performance targets met

---

**END OF TEST PLAN PRD**
`,
	},

	// 13 - Changelog & Decision Log
	{
		id: '13-changelog',
		filename: '13-changelog-and-decision-log.md',
		title: 'Changelog & Decision Log',
		precedence: 10,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Changelog & Decision Log

**Version:** 1.0
**Status:** Living Document
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}

---

## 1. Purpose

This document records every significant decision and PRD change for ${answers.productName}.

---

## 2. Decision Log

### DEC-001: Initial PRD Suite Generation

- **Date:** ${formatDate()}
- **Decision:** Generate initial PRD suite from interview answers
- **Rationale:** Establish baseline requirements for ${answers.productName}
- **Impact:** All 16 base PRDs created
- **Status:** Approved

---

## 3. Changelog

### ${formatDate()} — v1.0 Initial Release

- Generated all 16 base PRD documents
- Created agent team based on feature requirements
- Generated collaboration map
- Produced user setup guide

---

## 4. Deferred Items

*Items identified during generation that need future consideration:*

- Review and refine agent team composition
- Add specific test cases
- Define API contracts in detail

---

## 5. Adding New Entries

When making changes:

1. Add a new decision entry with:
   - Date
   - Decision statement
   - Rationale
   - Impact assessment
   - Status

2. Add a changelog entry with:
   - Version number
   - Date
   - List of changes

---

**END OF CHANGELOG & DECISION LOG**
`,
	},

	// 14 - Master PRD Index
	{
		id: '14-master-index',
		filename: '14-master-prd-index.md',
		title: 'Master PRD Index',
		precedence: 0,
		category: 'base',
		generate: (answers, team) => `# ${answers.productName} – Master PRD Index

**Version:** 1.0
**Status:** Authoritative · Locked
**Last Updated:** ${formatDate()}
**Product:** ${answers.productName}

---

## 1. What This Document Is

This is the single authoritative entry point for all PRDs for **${answers.productName}**. Every agent must read this index first.

---

## 2. Product Identity

| Field | Value |
|-------|-------|
| **Product Name** | ${answers.productName} |
| **Description** | ${answers.productDescription} |
| **Product Type** | ${answers.productType} |
| **Primary User** | ${answers.primaryUser} |

---

## 3. PRD Document Registry

### Base PRD Suite (16 Documents)

| # | Document | Governs | Precedence |
|---|----------|---------|------------|
| 01 | Error & State Reference | All states and error codes | 7 |
| 02 | Roles & Permissions Matrix | All roles and permissions | 4 |
| 03 | Core Systems PRD | Systems, state machines, schemas | 2 |
| 04 | Safety, Privacy & Control PRD | Safety, privacy, legal | **1 (Highest)** |
| 05 | Technical Architecture PRD | Stack, APIs, database | 6 |
| 06 | Experience & Access PRD | Auth, onboarding, navigation | 3 |
| 07 | Data & Integration PRD | External APIs, services | 5 |
| 08 | Content & Copy PRD | UI strings, tone | 8 (Lowest) |
| 09 | Design System & Component Reference | Visual specs | 7 |
| 10 | Migrations & Seed Data Reference | Schema changes | 7 |
| 11 | Environment & Secrets Reference | Env vars, secrets | 7 |
| 12 | Test Plan PRD | Testing requirements | 7 |
| 13 | Changelog & Decision Log | All changes | Living |
| 14 | Master PRD Index | This document | Index |
| 15 | User Setup & Execution Guide | Human instructions | Reference |
| 16 | Agent PRD Template | Per-agent specs | Template |

### Agent PRD Suite (${team?.agents?.length || 'N'} Documents)

${team?.agents?.map((agent, i) => `| ${String(i).padStart(2, '0')} | ${agent.name} | ${agent.role} |`).join('\n') || '*Generated based on feature requirements*'}

---

## 4. Precedence Rules

When two documents conflict, resolve using this order:

1. **Safety, Privacy & Control PRD** — overrides everything
2. **Core Systems PRD** — overrides Experience, Technical, Data, Content
3. **Experience & Access PRD** — overrides Technical, Data, Content
4. **Roles & Permissions Matrix** — overrides Technical on permissions
5. **Data & Integration PRD** — overrides Technical, Content
6. **Technical Architecture PRD** — overrides Content only
7. **Content & Copy PRD** — lowest precedence
8. **Master PRD Index** — no override power

---

## 5. Cross-Document Validation

Before any agent begins work, verify:

- [ ] Data schemas match across Core Systems and Technical PRDs
- [ ] Permission fields match between Roles Matrix and Core Systems
- [ ] Error codes are consistent across all documents
- [ ] Copy strings match between Content PRD and Experience PRD
- [ ] Security rules from Safety PRD are enforced in Technical PRD

---

## 6. Instructions to All Agents

- Read ALL base PRDs before beginning any task
- Run cross-document validation before starting
- Do not invent features not specified in a PRD
- Do not merge responsibilities across documents
- Do not reinterpret intent — implement what is written

---

**END OF MASTER PRD INDEX**
`,
	},

	// 15 - User Setup & Execution Guide (already generated in main templates)
	// 16 - Agent PRD Template
	{
		id: '16-agent-template',
		filename: '16-agent-prd-template.md',
		title: 'Agent PRD Template',
		precedence: 10,
		category: 'base',
		generate: (answers) => `# ${answers.productName} – Agent PRD Template

**Version:** 1.0
**Status:** Template
**Last Updated:** ${formatDate()}

---

## Template Structure

Every Agent PRD must contain:

\`\`\`markdown
1. Agent Identity         — Name, role, type, trigger
2. Mission Statement      — Purpose in 2–4 sentences
3. Scope                  — Exactly in scope / exactly out of scope
4. Inputs                 — Schema, source, validation rules
5. Outputs                — Schema, destination, quality rules
6. Behavior Rules         — Ordered steps, decision logic, iteration rules
7. Edge Cases             — Every known failure mode and response
8. Dependencies           — Base PRDs, other agents, external services
9. Error Code Registry    — All codes this agent produces
10. Logging Rules         — What to log, what never to log
11. Acceptance Criteria   — Binary pass/fail conditions
12. Test Cases            — Happy path, error cases, edge cases
\`\`\`

---

## Example Agent PRD

\`\`\`markdown
# [Product Name] – [Agent Name] PRD

**Version:** 1.0
**Agent:** [Designation]
**Role:** [Brief role description]

## 1. Agent Identity

| Field | Value |
|-------|-------|
| **Agent Name** | [Agent Name] |
| **Designation** | [AA-XXX] |
| **Role** | [Role description] |
| **Type** | [Agent type] |

## 2. Mission Statement

[2-4 sentences describing the agent's purpose]

## 3. Scope

### 3.1 In Scope
- [Responsibility 1]
- [Responsibility 2]

### 3.2 Out of Scope
- [Not responsible for 1]
- [Not responsible for 2]

## 4. Inputs

| Input | Source | Format |
|-------|--------|--------|
| [Input 1] | [Source] | [Format] |

## 5. Outputs

| Output | Destination | Format |
|--------|-------------|--------|
| [Output 1] | [Destination] | [Format] |

## 6. Behavior Rules

[Ordered steps and decision logic]

## 7. Edge Cases

| Scenario | Expected Behavior |
|----------|------------------|
| [Edge case 1] | [Behavior] |

## 8. Dependencies

- [Base PRD 1]
- [Agent 1]

## 9. Error Code Registry

| Code | When Used |
|------|-----------|
| [CODE_1] | [Description] |

## 10. Logging Rules

**Log:** [What to log]
**Never log:** [What never to log]

## 11. Acceptance Criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]

## 12. Test Cases

- [ ] [Test case 1]
- [ ] [Test case 2]
\`\`\`

---

**END OF AGENT PRD TEMPLATE**
`,
	},
];
