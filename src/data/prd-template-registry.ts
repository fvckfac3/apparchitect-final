/**
 * PRD Template Registry
 * 
 * Central registry combining all PRD templates from the v2 template suite.
 * This is the single source of truth for template access.
 */

import { PRD_TEMPLATES, type PRDTemplate, TEMPLATE_VARIABLES } from './prd-template-sources';
import { EXTENDED_PRD_TEMPLATES } from './prd-template-sources-extended';
import { AUXILIARY_PRD_TEMPLATES } from './prd-template-sources-auxiliary';

// Combine all templates
export const ALL_PRD_TEMPLATES: PRDTemplate[] = [
  ...PRD_TEMPLATES,
  ...EXTENDED_PRD_TEMPLATES,
  ...AUXILIARY_PRD_TEMPLATES,
];

// Re-export types and constants
export type { PRDTemplate };
export { TEMPLATE_VARIABLES };

/**
 * Get a template by its ID
 */
export function getTemplateById(id: string): PRDTemplate | undefined {
  return ALL_PRD_TEMPLATES.find(t => t.id === id);
}

/**
 * Get all templates in a category
 */
export function getTemplatesByCategory(category: PRDTemplate['category']): PRDTemplate[] {
  return ALL_PRD_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get base PRD templates in precedence order
 */
export function getBasePRDsInPrecedenceOrder(): PRDTemplate[] {
  return ALL_PRD_TEMPLATES
    .filter(t => t.category === 'base')
    .sort((a, b) => {
      // Index has precedence 0 but should come first
      if (a.precedence === 0) return -1;
      if (b.precedence === 0) return 1;
      // Safety (precedence 1) should be highest priority
      return (a.precedence ?? 999) - (b.precedence ?? 999);
    });
}

/**
 * Get reference documents
 */
export function getReferencePRDs(): PRDTemplate[] {
  return ALL_PRD_TEMPLATES.filter(t => t.category === 'reference');
}

/**
 * Template variable replacement
 */
export interface TemplateReplacements {
  productName: string;
  date?: string;
  version?: string;
  owner?: string;
  description?: string;
  oneLine?: string;
  [key: string]: string | undefined;
}

/**
 * Fill a template with provided values
 */
export function fillTemplate(template: string, replacements: TemplateReplacements): string {
  let filled = template;
  
  // Standard replacements
  filled = filled.replace(/\[Product Name\]/g, replacements.productName);
  filled = filled.replace(/\[DATE\]/g, replacements.date || new Date().toISOString().split('T')[0]);
  filled = filled.replace(/\[Version\]/g, replacements.version || '1.0');
  filled = filled.replace(/\[NAME\]/g, replacements.owner || 'Product Owner');
  filled = filled.replace(/\[Description\]/g, replacements.description || '');
  filled = filled.replace(/\[One-Line Description\]/g, replacements.oneLine || '');
  filled = filled.replace(/\[What it does, for whom, and why it matters\]/g, replacements.oneLine || '');
  
  // Handle additional custom replacements
  for (const [key, value] of Object.entries(replacements)) {
    if (value && key !== 'productName' && key !== 'date' && key !== 'version' && key !== 'owner') {
      const pattern = new RegExp(`\\[${key}\\]`, 'g');
      filled = filled.replace(pattern, value);
    }
  }
  
  return filled;
}

/**
 * Check if a filled template has any remaining placeholders
 */
export function findUnfilledPlaceholders(content: string): string[] {
  const placeholderPattern = /\[[A-Z][a-zA-Z0-9\s/\-&]+\]/g;
  const matches = content.match(placeholderPattern) || [];
  
  // Filter out code-like patterns that aren't actually placeholders
  return [...new Set(matches)].filter(match => {
    // Skip common false positives
    if (match.startsWith('[e.g.,')) return false;
    if (match.startsWith('[Step')) return false;
    if (match.startsWith('[Repeat')) return false;
    if (match.includes('if')) return false;
    return true;
  });
}

/**
 * Validate that a filled template is complete
 */
export interface TemplateValidationResult {
  isValid: boolean;
  unfilledPlaceholders: string[];
  placeholderCount: number;
}

export function validateFilledTemplate(content: string): TemplateValidationResult {
  const unfilled = findUnfilledPlaceholders(content);
  return {
    isValid: unfilled.length === 0,
    unfilledPlaceholders: unfilled,
    placeholderCount: unfilled.length,
  };
}

/**
 * PRD Suite generation order based on precedence
 * Order: Safety > Core > Experience > Technical > Data > Content
 */
export const PRD_GENERATION_ORDER = [
  'master-index',        // 00 - Index (no precedence power)
  'safety-privacy',      // 03 - HIGHEST precedence
  'core-systems',        // 01 - 2nd precedence
  'experience-access',   // 02 - 3rd precedence
  'technical-architecture', // 04 - 4th precedence
  'error-state-reference',  // 09 - Reference (states & errors)
  'collaboration-map',   // Auxiliary - Agent interactions
] as const;

/**
 * Document type mapping for the suite
 */
export const DOCUMENT_TYPE_MAP: Record<string, 'master' | 'agent' | 'collaboration' | 'setup' | 'reference'> = {
  'master-index': 'master',
  'safety-privacy': 'master',
  'core-systems': 'master',
  'experience-access': 'master',
  'technical-architecture': 'master',
  'error-state-reference': 'reference',
  'collaboration-map': 'collaboration',
  'agent-prd': 'agent',
};
