// src/data/prd-templates-v2-registry.ts
// BARREL — re-exports the spec-driven registry.
//
// The old version of this file imported from 5 flat generator files
// (prd-templates-v2, -extended, -additional, -operational, -auxiliary)
// that held generator functions inlined as template-literal strings.
//
// It now re-exports from `templates-v2/registry.ts`, which wraps the
// 19 spec templates in templates-v2/{base,reference,auxiliary} as
// PRDDocumentV2-shaped objects. That directory is synced from
// AppArchitect-Foundation/04 - templates/v2 via scripts/sync-spec.sh.
//
// Hooks (use-prd-generator-v2.ts) keep importing from this file with
// zero changes — the export surface is identical.

import type { InterviewAnswers } from '@/types/interview';
import type { AgentTeam } from '@/types/agents';

export type { PRDDocumentV2 } from './templates-v2/registry';
export {
  ALL_PRD_DOCUMENTS_V2,
  getAllPRDDocumentsV2,
  getPRDDocumentV2ById,
  getPRDDocumentsV2ByCategory,
  V2_QUALITY_REQUIREMENTS,
  checkRLMCompliance,
  PRD_GENERATION_ORDER_V2,
  TEMPLATE_STATS_V2,
} from './templates-v2/registry';

import { ALL_PRD_DOCUMENTS_V2, type PRDDocumentV2 } from './templates-v2/registry';

export function getBasePRDsV2(): PRDDocumentV2[] {
  return ALL_PRD_DOCUMENTS_V2.filter(doc => doc.category === 'base');
}
export function getReferencePRDsV2(): PRDDocumentV2[] {
  return ALL_PRD_DOCUMENTS_V2.filter(doc => doc.category === 'reference');
}
export function getOperationalPRDsV2(): PRDDocumentV2[] {
  return ALL_PRD_DOCUMENTS_V2.filter(doc => doc.category === 'operational');
}
export function getAuxiliaryPRDsV2(): PRDDocumentV2[] {
  return ALL_PRD_DOCUMENTS_V2.filter(doc => doc.category === 'auxiliary');
}
export function getAgentPRDTemplateV2(): PRDDocumentV2 | undefined {
  return ALL_PRD_DOCUMENTS_V2.find(doc => doc.category === 'agent');
}
export function generateAllPRDsV2(answers: InterviewAnswers, team?: AgentTeam): Map<string, string> {
  const generated = new Map<string, string>();
  for (const doc of ALL_PRD_DOCUMENTS_V2) {
    try {
      generated.set(doc.id, doc.generate(answers, team));
    } catch (error) {
      console.error(`Failed to generate ${doc.id}:`, error);
    }
  }
  return generated;
}

export const DOCUMENT_TIER_MAP_V2: Record<string, 'base' | 'reference' | 'operational' | 'auxiliary' | 'agent'> = {
  // Tier 1 — base
  'master-index-template': 'base',
  'safety-prd-template': 'base',
  'core-systems-template': 'base',
  'technical-template': 'base',
  'experience-template': 'base',
  'data-integration-template': 'base',
  'content-copy-template': 'base',
  'error-state-template': 'base',
  'design-system-template': 'base',
  // Tier 2 — reference
  'roles-permissions-template': 'reference',
  'test-plan-template': 'reference',
  'migrations-template': 'reference',
  'environment-template': 'reference',
  'changelog-template': 'reference',
  'user-instructions-template': 'reference',
  // Tier 3 — agent
  'agent-prd-template': 'agent',
  // Tier 4 — auxiliary
  'monetization-template': 'auxiliary',
  'launch-checklist-template': 'auxiliary',
  // 'brand-guidelines-template' was removed: the Foundation v2 suite
  // does not include a Brand Guidelines template. The legacy TS file
  // was a duplicate, not a spec entry.
};
