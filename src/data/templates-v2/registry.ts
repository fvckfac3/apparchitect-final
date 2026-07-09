/**
 * templates-v2/registry.ts
 *
 * Wires canonical v2 PRD templates from AppArchitect-Foundation into the
 * PRDDocumentV2 shape the app (and use-prd-generator-v2.ts) expects.
 *
 * Source of truth: src/data/spec/loader.ts → v2Templates[] (which itself
 * reads AppArchitect-Foundation/04 - templates/v2 via scripts/sync-spec.sh).
 * Hand-written TS template strings used to live in
 * src/data/templates-v2/{base,reference,auxiliary}/*.ts — those files
 * were duplicates of the Foundation markdown and have been removed.
 *
 * The metadata (id, category, precedence, RLM compliance, sections)
 * is hand-curated here and remains the only application-owned truth
 * about HOW the suite is organized. The CONTENT of each document
 * (the markdown body) is the Foundation markdown, verbatim.
 */

import type { InterviewAnswers } from '@/types/interview';
import type { AgentTeam } from '@/types/agents';

import { v2Templates, type V2TemplateKey } from '@/data/spec/loader';

export interface PRDDocumentV2 {
  id: string;
  filename: string;
  title: string;
  precedence: number | null;
  category: 'base' | 'agent' | 'operational' | 'reference' | 'auxiliary';
  version: '2.0';
  rlmCompliant: boolean;
  informationDensity: string;
  specKey: V2TemplateKey;
  generate: (answers: InterviewAnswers, team?: AgentTeam) => string;
}

function formatDate(): string {
  return new Date().toISOString().split('T')[0];
}

function applyTemplate(
  template: string,
  answers: InterviewAnswers,
): string {
  const name = answers.productName || 'Product';
  return template
    .replaceAll('[Product Name]', name)
    .replaceAll('[Date]', formatDate());
}

// ---------------------------------------------------------------------------
// Spec-backed content lookup. The loader holds 28 v2 templates; the curated
// 19 below reference a subset, but the full set is also reachable via
// getSpecV2Template() for UI/export flows that need the extras
// (Analytics, Build Handoff, UX PRD, etc.).
// ---------------------------------------------------------------------------

const SPEC: Record<V2TemplateKey, string> = v2Templates.reduce(
  (acc, t) => {
    acc[t.key] = t.content;
    return acc;
  },
  {} as Record<V2TemplateKey, string>,
);

export function getSpecV2Template(key: V2TemplateKey): string {
  return SPEC[key];
}

export function listSpecV2Templates(): { key: V2TemplateKey; name: string }[] {
  return v2Templates.map(({ key, name }) => ({ key, name }));
}

// ---------------------------------------------------------------------------
// Curated metadata for the 19 documents in the suite inventory. The
// content (markdown body) for each id is pulled from the loader by
// specKey. To add a new doc: append an entry here AND make sure its
// specKey is present in Foundation/04 - templates/v2/.
// ---------------------------------------------------------------------------

interface CuratedEntry {
  id: string;
  filename: string;
  title: string;
  category: PRDDocumentV2['category'];
  precedence: number | null;
  informationDensity: string;
  specKey: V2TemplateKey;
}

const CURATED: CuratedEntry[] = [
  // === Master & base PRDs ===
  { id: 'master-index-template', filename: '14-master-index.md', title: 'Master PRD Index', category: 'base', precedence: 1, informationDensity: 'O(D) where D = suite documents', specKey: 'masterIndex' },
  { id: 'safety-prd-template', filename: '04-safety-privacy.md', title: 'Safety, Privacy & Control PRD', category: 'base', precedence: 0, informationDensity: 'O(R) where R = risk categories', specKey: 'safetyPrivacy' },
  { id: 'core-systems-template', filename: '03-core-systems.md', title: 'Core Systems PRD', category: 'base', precedence: 3, informationDensity: 'O(N·F) where N = entities, F = features', specKey: 'coreSystems' },
  { id: 'technical-template', filename: '05-technical-architecture.md', title: 'Technical Architecture PRD', category: 'base', precedence: 4, informationDensity: 'O(C) where C = components', specKey: 'techArch' },
  { id: 'experience-template', filename: '06-experience-access.md', title: 'Experience & Access PRD', category: 'base', precedence: 5, informationDensity: 'O(F) where F = flows', specKey: 'experience' },
  { id: 'data-integration-template', filename: '07-data-integration.md', title: 'Data & Integration PRD', category: 'base', precedence: 7, informationDensity: 'O(T) where T = tables + integrations', specKey: 'dataIntegration' },
  { id: 'content-copy-template', filename: '08-content-copy.md', title: 'Content & Copy PRD', category: 'base', precedence: 8, informationDensity: 'O(S) where S = strings', specKey: 'contentCopy' },
  { id: 'error-state-template', filename: '01-error-state.md', title: 'Error & State Reference', category: 'base', precedence: 6, informationDensity: 'O(E) where E = error codes + states', specKey: 'errorState' },
  { id: 'design-system-template', filename: '09-design-system.md', title: 'Design System PRD', category: 'base', precedence: 9, informationDensity: 'O(C) where C = components', specKey: 'designSystem' },

  // === Reference documents ===
  { id: 'roles-permissions-template', filename: '02-roles-permissions.md', title: 'Roles & Permissions Matrix', category: 'reference', precedence: 10, informationDensity: 'O(R×P) where R = roles, P = permissions', specKey: 'rolesPerms' },
  { id: 'migrations-template', filename: '10-migrations.md', title: 'Migrations & Seed Data Reference', category: 'reference', precedence: 12, informationDensity: 'O(M) where M = migrations', specKey: 'migrations' },
  { id: 'environment-template', filename: '11-environment.md', title: 'Environment Configuration', category: 'reference', precedence: 13, informationDensity: 'O(V) where V = variables', specKey: 'envSecrets' },
  { id: 'test-plan-template', filename: '12-test-plan.md', title: 'Test Plan PRD', category: 'reference', precedence: 11, informationDensity: 'O(T) where T = test cases', specKey: 'testPlan' },
  { id: 'changelog-template', filename: '13-changelog.md', title: 'Changelog & Decision Log', category: 'reference', precedence: 14, informationDensity: 'O(R) where R = releases', specKey: 'changelog' },

  // === Operational ===
  { id: 'user-instructions-template', filename: '15-user-instructions.md', title: 'User Instructions', category: 'operational', precedence: 15, informationDensity: 'O(1) per section', specKey: 'userInstructions' },
  { id: 'agent-prd-template', filename: '16-agent-template.md', title: 'Agent PRD Template', category: 'agent', precedence: null, informationDensity: 'O(1) per section', specKey: 'agent' },

  // === Auxiliary ===
  { id: 'monetization-template', filename: 'monetization-model.md', title: 'Monetization Model', category: 'auxiliary', precedence: null, informationDensity: 'O(P) where P = plans', specKey: 'monetization' },
  { id: 'launch-checklist-template', filename: 'launch-strategy.md', title: 'Launch Checklist', category: 'auxiliary', precedence: null, informationDensity: 'O(S) where S = steps', specKey: 'launchStrategy' },
  // Note: 'brand-guidelines-template' was removed in this rewrite. The
  // Foundation v2 suite has no Brand Guidelines template; the prior
  // hand-written TS file was a duplicate that was not in the canonical
  // spec. Add this entry back here once Foundation includes the template.
];

// Compile-time check: every curated specKey must exist in the spec.
const _validatedKeys: V2TemplateKey[] = CURATED.map((e) => {
  if (!(e.specKey in SPEC)) {
    throw new Error(
      `[V2 Registry] specKey "${e.specKey}" for document "${e.id}" is not present in the spec loader. ` +
      `Re-run scripts/sync-spec.sh or remove the curated entry.`,
    );
  }
  return e.specKey;
});
void _validatedKeys;

function wrap(entry: CuratedEntry): PRDDocumentV2 {
  const body = SPEC[entry.specKey];
  return {
    id: entry.id,
    filename: entry.filename,
    title: entry.title,
    precedence: entry.precedence,
    category: entry.category,
    version: '2.0',
    rlmCompliant: true,
    informationDensity: entry.informationDensity,
    specKey: entry.specKey,
    generate: (answers) => applyTemplate(body, answers),
  };
}

export const ALL_PRD_DOCUMENTS_V2: PRDDocumentV2[] = CURATED.map(wrap);

export const TEMPLATE_STATS_V2 = {
  totalTemplates: ALL_PRD_DOCUMENTS_V2.length,
  baseTemplates: ALL_PRD_DOCUMENTS_V2.filter((d) => d.category === 'base').length,
  referenceTemplates: ALL_PRD_DOCUMENTS_V2.filter((d) => d.category === 'reference').length,
  operationalTemplates: ALL_PRD_DOCUMENTS_V2.filter((d) => d.category === 'operational').length,
  auxiliaryTemplates: ALL_PRD_DOCUMENTS_V2.filter((d) => d.category === 'auxiliary').length,
  agentTemplates: ALL_PRD_DOCUMENTS_V2.filter((d) => d.category === 'agent').length,
  allRlmCompliant: ALL_PRD_DOCUMENTS_V2.every((d) => d.rlmCompliant),
  allVersion2: ALL_PRD_DOCUMENTS_V2.every((d) => d.version === '2.0'),
};

if (import.meta.env.DEV) {
  console.log(
    '[V2 Registry / spec] Loaded',
    TEMPLATE_STATS_V2.totalTemplates,
    'templates from spec, all RLM compliant:',
    TEMPLATE_STATS_V2.allRlmCompliant,
  );
}

export function getAllPRDDocumentsV2(): PRDDocumentV2[] {
  return ALL_PRD_DOCUMENTS_V2;
}

export function getPRDDocumentV2ById(id: string): PRDDocumentV2 | undefined {
  return ALL_PRD_DOCUMENTS_V2.find((doc) => doc.id === id);
}

export function getPRDDocumentsV2ByCategory(category: PRDDocumentV2['category']): PRDDocumentV2[] {
  return ALL_PRD_DOCUMENTS_V2.filter((doc) => doc.category === category);
}

export const V2_QUALITY_REQUIREMENTS = {
  header: [
    'Version: 2.0',
    'Status: Authoritative · Build-Ready',
    'Governed by: [Product Name] – Master PRD Index',
    'Precedence declaration with specific tier',
    'Information Density classification',
  ],
  precedenceBlock: [
    'Precedence Compliance Block section',
    'Subordinate to / Governs structure',
    'Conflict resolution protocol reference',
    'Safety exception clause',
  ],
  rlmWrapper: [
    'ROLE section with specific identity and authority',
    'LIMITS section with explicit prohibitions',
    'MISSION section with measurable success/failure conditions',
    'Begin with: specific first action',
  ],
  structure: [
    'Markdown tables instead of bullet lists for structured data',
    'State machines with explicit transition tables',
    'Terminal states explicitly marked',
    'Error codes reference Error & State Reference',
    'Copy keys reference Content & Copy PRD',
    'Section numbering with § format',
  ],
  content: [
    'tenant_id field in all data contracts (if multi-tenant)',
    'Transactional boundaries section for data operations',
    'Race condition handling section',
    'Information density classification (O(1)/O(N)/O(N²))',
    'Acceptance criteria with checkbox format',
    'Version history table',
    'Cross-document validation rules',
  ],
} as const;

export interface RLMComplianceResult {
  documentId: string;
  isCompliant: boolean;
  missingRequirements: string[];
  tier: PRDDocumentV2['category'];
}

/**
 * Tier-aware RLM compliance check.
 *
 * Base PRDs (tier 1: Safety, Core, Experience, Data, Technical, Content)
 * require the full structural set: precedence block, version history,
 * cross-document validation, etc.
 *
 * Reference/Operational/Auxiliary PRDs (changelog, user instructions,
 * agent template, monetization, launch, brand guidelines) are
 * exempt from structural requirements that don't apply to their
 * nature. They are still checked for v2 header + governance.
 */
export function checkRLMCompliance(
  content: string,
  documentId: string,
): RLMComplianceResult {
  const doc = ALL_PRD_DOCUMENTS_V2.find((d) => d.id === documentId);
  const tier: PRDDocumentV2['category'] = doc?.category || 'base';
  const missing: string[] = [];

  const stripped = content.replace(/\*\*([^*]+)\*\*/g, '$1');

  if (!/Version:\s*2\.0/.test(stripped)) missing.push('Version: 2.0 header');
  const isGovernor =
    documentId === 'master-index-template' || documentId === 'safety-prd-template';
  if (!isGovernor && !stripped.includes('Governed by:')) {
    missing.push('Governed by reference');
  }

  if (tier === 'base') {
    // Section heading variants observed in Foundation v2:
    //   "## ⚠️ Precedence Compliance Block" (most base PRDs, mixed case)
    //   "PRECEDENCE COMPLIANCE BLOCK" (legacy all-caps variant)
    //   "PRECEDENCE DECLARATION" (alt phrasing)
    // Match case-insensitively, after stripping bold markers (already in 'stripped').
    const hasPrecedence =
      /precedence compliance block/i.test(stripped) ||
      /precedence declaration/i.test(stripped) ||
      /precedence rules/i.test(stripped);
    const isMaster = documentId === 'master-index-template';
    if (!isMaster && !hasPrecedence) {
      missing.push('Precedence Compliance section');
    }
    if (!/Cross-Document|Cross-Document Validation/.test(stripped)) {
      missing.push('Cross-Document Validation section');
    }
    if (!stripped.includes('Version History')) {
      missing.push('Version History section');
    }
  }

  return {
    documentId,
    tier,
    isCompliant: missing.length === 0,
    missingRequirements: missing,
  };
}

export const PRD_GENERATION_ORDER_V2: string[] = [
  'safety-prd-template',
  'master-index-template',
  'core-systems-template',
  'technical-template',
  'error-state-template',
  'experience-template',
  'data-integration-template',
  'content-copy-template',
  'design-system-template',
  'roles-permissions-template',
  'test-plan-template',
  'migrations-template',
  'environment-template',
  'changelog-template',
  'user-instructions-template',
];
