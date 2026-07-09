/**
 * PRD Validation Pipeline - V2 Compliant
 * 
 * Comprehensive validation for generated PRD documents.
 * Ensures RLM compliance, structural integrity, and content quality.
 */

import type { PRDDocumentV2 } from '@/data/prd-templates-v2-registry';
import { V2_QUALITY_REQUIREMENTS, DOCUMENT_TIER_MAP_V2 } from '@/data/prd-templates-v2-registry';

// ============================================================================
// §1 - VALIDATION RESULT TYPES
// ============================================================================

export interface ValidationIssue {
	severity: 'error' | 'warning' | 'info';
	code: string;
	message: string;
	line?: number;
	suggestion?: string;
}

export interface DocumentValidationResult {
	documentId: string;
	isValid: boolean;
	score: number; // 0-100
	issues: ValidationIssue[];
	metrics: {
		placeholderCount: number;
		wordCount: number;
		sectionCount: number;
		tableCount: number;
		codeBlockCount: number;
	};
}

export interface SuiteValidationResult {
	isValid: boolean;
	overallScore: number;
	documents: DocumentValidationResult[];
	crossDocumentIssues: ValidationIssue[];
	summary: {
		totalDocuments: number;
		validDocuments: number;
		totalIssues: number;
		errorCount: number;
		warningCount: number;
		placeholderCount: number;
	};
}

// ============================================================================
// §2 - VALIDATION RULES
// ============================================================================

interface ValidationRule {
	id: string;
	name: string;
	severity: 'error' | 'warning' | 'info';
	check: (content: string, documentId: string) => ValidationIssue | null;
}

const V2_HEADER_RULES: ValidationRule[] = [
	{
		id: 'V2-HDR-001',
		name: 'Version 2.0 Header',
		severity: 'error',
		check: (content) => {
			if (!content.includes('Version: 2.0')) {
				return {
					severity: 'error',
					code: 'V2-HDR-001',
					message: 'Missing Version: 2.0 header',
					suggestion: 'Add "Version: 2.0" in the document header block',
				};
			}
			return null;
		},
	},
	{
		id: 'V2-HDR-002',
		name: 'Governed By Reference',
		severity: 'error',
		check: (content) => {
			if (!content.includes('Governed by:')) {
				return {
					severity: 'error',
					code: 'V2-HDR-002',
					message: 'Missing "Governed by:" reference',
					suggestion: 'Add "Governed by: [Product Name] – Master PRD Index"',
				};
			}
			return null;
		},
	},
	{
		id: 'V2-HDR-003',
		name: 'Precedence Declaration',
		severity: 'error',
		check: (content) => {
			if (!content.includes('Precedence:')) {
				return {
					severity: 'error',
					code: 'V2-HDR-003',
					message: 'Missing Precedence declaration',
					suggestion: 'Add "Precedence: Tier X" with appropriate tier number',
				};
			}
			return null;
		},
	},
	{
		id: 'V2-HDR-004',
		name: 'Information Density',
		severity: 'warning',
		check: (content) => {
			if (!content.includes('Information Density:')) {
				return {
					severity: 'warning',
					code: 'V2-HDR-004',
					message: 'Missing Information Density classification',
					suggestion: 'Add "Information Density: O(1)/O(N)/O(N²)" as appropriate',
				};
			}
			return null;
		},
	},
];

const V2_STRUCTURE_RULES: ValidationRule[] = [
	{
		id: 'V2-STR-001',
		name: 'Precedence Compliance Block',
		severity: 'error',
		check: (content) => {
			if (!content.includes('PRECEDENCE COMPLIANCE BLOCK')) {
				return {
					severity: 'error',
					code: 'V2-STR-001',
					message: 'Missing PRECEDENCE COMPLIANCE BLOCK section',
					suggestion: 'Add boxed Precedence Compliance Block with subordinate/governs structure',
				};
			}
			return null;
		},
	},
	{
		id: 'V2-STR-002',
		name: 'Version History',
		severity: 'warning',
		check: (content) => {
			if (!content.includes('Version History')) {
				return {
					severity: 'warning',
					code: 'V2-STR-002',
					message: 'Missing Version History section',
					suggestion: 'Add Version History table at end of document',
				};
			}
			return null;
		},
	},
	{
		id: 'V2-STR-003',
		name: 'Cross-Document Validation',
		severity: 'warning',
		check: (content, documentId) => {
			const tier = DOCUMENT_TIER_MAP_V2[documentId];
			if (tier === 'base' && !content.includes('Cross-Document Validation')) {
				return {
					severity: 'warning',
					code: 'V2-STR-003',
					message: 'Base PRDs should include Cross-Document Validation section',
					suggestion: 'Add Cross-Document Validation rules for inter-PRD consistency',
				};
			}
			return null;
		},
	},
];

const V2_RLM_RULES: ValidationRule[] = [
	{
		id: 'V2-RLM-001',
		name: 'ROLE Section',
		severity: 'info',
		check: (content, documentId) => {
			const tier = DOCUMENT_TIER_MAP_V2[documentId];
			if (tier === 'agent' && !content.includes('ROLE:')) {
				return {
					severity: 'info',
					code: 'V2-RLM-001',
					message: 'Agent PRDs should include ROLE section',
					suggestion: 'Add RLM wrapper with ROLE, LIMITS, MISSION sections',
				};
			}
			return null;
		},
	},
	{
		id: 'V2-RLM-002',
		name: 'LIMITS Section',
		severity: 'info',
		check: (content, documentId) => {
			const tier = DOCUMENT_TIER_MAP_V2[documentId];
			if (tier === 'agent' && !content.includes('LIMITS:')) {
				return {
					severity: 'info',
					code: 'V2-RLM-002',
					message: 'Agent PRDs should include LIMITS section',
					suggestion: 'Add explicit prohibitions in LIMITS section',
				};
			}
			return null;
		},
	},
	{
		id: 'V2-RLM-003',
		name: 'MISSION Section',
		severity: 'info',
		check: (content, documentId) => {
			const tier = DOCUMENT_TIER_MAP_V2[documentId];
			if (tier === 'agent' && !content.includes('MISSION:')) {
				return {
					severity: 'info',
					code: 'V2-RLM-003',
					message: 'Agent PRDs should include MISSION section',
					suggestion: 'Add measurable success/failure conditions in MISSION section',
				};
			}
			return null;
		},
	},
];

const V2_CONTENT_RULES: ValidationRule[] = [
	{
		id: 'V2-CNT-001',
		name: 'Unresolved Placeholders',
		severity: 'warning',
		check: (content) => {
			const placeholders = content.match(/\[USER-UNSPECIFIED\]/g) || [];
			if (placeholders.length > 0) {
				return {
					severity: 'warning',
					code: 'V2-CNT-001',
					message: `${placeholders.length} unresolved [USER-UNSPECIFIED] placeholder(s)`,
					suggestion: 'Provide values for all [USER-UNSPECIFIED] placeholders',
				};
			}
			return null;
		},
	},
	{
		id: 'V2-CNT-002',
		name: 'Generic Placeholders',
		severity: 'info',
		check: (content) => {
			const genericPattern = /\[[A-Z][a-zA-Z\s]+\]/g;
			const matches = content.match(genericPattern) || [];
			// Filter out known acceptable patterns
			const filtered = matches.filter(m => 
				!m.includes('USER-UNSPECIFIED') && 
				!m.includes('Product Name') &&
				!m.includes('Agent Name') &&
				m.length > 3
			);
			if (filtered.length > 10) {
				return {
					severity: 'info',
					code: 'V2-CNT-002',
					message: `${filtered.length} potential unfilled placeholders found`,
					suggestion: 'Review bracketed content for unresolved template variables',
				};
			}
			return null;
		},
	},
];

// All validation rules
const ALL_VALIDATION_RULES: ValidationRule[] = [
	...V2_HEADER_RULES,
	...V2_STRUCTURE_RULES,
	...V2_RLM_RULES,
	...V2_CONTENT_RULES,
];

// ============================================================================
// §3 - METRICS EXTRACTION
// ============================================================================

function extractMetrics(content: string): DocumentValidationResult['metrics'] {
	const placeholders = (content.match(/\[USER-UNSPECIFIED\]/g) || []).length;
	const words = content.split(/\s+/).filter(w => w.length > 0).length;
	const sections = (content.match(/^#{1,3}\s/gm) || []).length;
	const tables = (content.match(/^\|.*\|$/gm) || []).length / 3; // Rough estimate
	const codeBlocks = (content.match(/```/g) || []).length / 2;
	
	return {
		placeholderCount: placeholders,
		wordCount: words,
		sectionCount: sections,
		tableCount: Math.floor(tables),
		codeBlockCount: Math.floor(codeBlocks),
	};
}

// ============================================================================
// §4 - DOCUMENT VALIDATION
// ============================================================================

export function validateDocument(content: string, documentId: string): DocumentValidationResult {
	const issues: ValidationIssue[] = [];
	
	// Run all validation rules
	for (const rule of ALL_VALIDATION_RULES) {
		const issue = rule.check(content, documentId);
		if (issue) {
			issues.push(issue);
		}
	}
	
	const metrics = extractMetrics(content);
	
	// Calculate score
	const errorCount = issues.filter(i => i.severity === 'error').length;
	const warningCount = issues.filter(i => i.severity === 'warning').length;
	const infoCount = issues.filter(i => i.severity === 'info').length;
	
	// Score: start at 100, deduct for issues
	let score = 100;
	score -= errorCount * 15;   // Errors are critical
	score -= warningCount * 5;  // Warnings are significant
	score -= infoCount * 1;     // Info is minor
	score -= metrics.placeholderCount * 2; // Placeholders reduce score
	score = Math.max(0, Math.min(100, score));
	
	return {
		documentId,
		isValid: errorCount === 0,
		score,
		issues,
		metrics,
	};
}

// ============================================================================
// §5 - SUITE VALIDATION
// ============================================================================

export function validateSuite(documents: Map<string, string>): SuiteValidationResult {
	const results: DocumentValidationResult[] = [];
	const crossDocumentIssues: ValidationIssue[] = [];
	
	// Validate each document
	for (const [id, content] of documents.entries()) {
		results.push(validateDocument(content, id));
	}
	
	// Cross-document validation
	const allContent = Array.from(documents.values()).join('\n');
	
	// Check for master index
	if (!documents.has('14-master-index')) {
		crossDocumentIssues.push({
			severity: 'warning',
			code: 'V2-XDC-001',
			message: 'Missing Master PRD Index document',
			suggestion: 'Generate the Master PRD Index to establish document hierarchy',
		});
	}
	
	// Check for error state reference
	if (!documents.has('01-error-state')) {
		crossDocumentIssues.push({
			severity: 'warning',
			code: 'V2-XDC-002',
			message: 'Missing Error & State Reference document',
			suggestion: 'Generate the Error & State Reference for error code consistency',
		});
	}
	
	// Calculate summary
	const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0) + crossDocumentIssues.length;
	const errorCount = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'error').length, 0) +
		crossDocumentIssues.filter(i => i.severity === 'error').length;
	const warningCount = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'warning').length, 0) +
		crossDocumentIssues.filter(i => i.severity === 'warning').length;
	const placeholderCount = results.reduce((sum, r) => sum + r.metrics.placeholderCount, 0);
	
	const validDocuments = results.filter(r => r.isValid).length;
	const overallScore = results.length > 0 
		? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
		: 0;
	
	return {
		isValid: errorCount === 0,
		overallScore,
		documents: results,
		crossDocumentIssues,
		summary: {
			totalDocuments: results.length,
			validDocuments,
			totalIssues,
			errorCount,
			warningCount,
			placeholderCount,
		},
	};
}

// ============================================================================
// §6 - COMPLIANCE REPORT GENERATION
// ============================================================================

export function generateComplianceReport(result: SuiteValidationResult): string {
	const lines: string[] = [
		'# PRD Suite Validation Report',
		'',
		`**Generated:** ${new Date().toISOString()}`,
		`**Overall Score:** ${result.overallScore}/100`,
		`**Status:** ${result.isValid ? '✅ VALID' : '❌ INVALID'}`,
		'',
		'## Summary',
		'',
		`| Metric | Value |`,
		`|--------|-------|`,
		`| Total Documents | ${result.summary.totalDocuments} |`,
		`| Valid Documents | ${result.summary.validDocuments} |`,
		`| Total Issues | ${result.summary.totalIssues} |`,
		`| Errors | ${result.summary.errorCount} |`,
		`| Warnings | ${result.summary.warningCount} |`,
		`| Unresolved Placeholders | ${result.summary.placeholderCount} |`,
		'',
	];
	
	// Cross-document issues
	if (result.crossDocumentIssues.length > 0) {
		lines.push('## Cross-Document Issues', '');
		for (const issue of result.crossDocumentIssues) {
			const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
			lines.push(`- ${icon} **${issue.code}**: ${issue.message}`);
			if (issue.suggestion) {
				lines.push(`  - 💡 ${issue.suggestion}`);
			}
		}
		lines.push('');
	}
	
	// Per-document breakdown
	lines.push('## Document Breakdown', '');
	lines.push('| Document | Score | Status | Issues |');
	lines.push('|----------|-------|--------|--------|');
	
	for (const doc of result.documents) {
		const status = doc.isValid ? '✅' : '❌';
		lines.push(`| ${doc.documentId} | ${doc.score} | ${status} | ${doc.issues.length} |`);
	}
	
	return lines.join('\n');
}

// ============================================================================
// §7 - QUICK VALIDATION HELPERS
// ============================================================================

export function isV2Compliant(content: string): boolean {
	return content.includes('Version: 2.0') &&
		content.includes('Governed by:') &&
		content.includes('PRECEDENCE COMPLIANCE BLOCK');
}

export function getPlaceholderCount(content: string): number {
	return (content.match(/\[USER-UNSPECIFIED\]/g) || []).length;
}

export function findAllPlaceholders(content: string): string[] {
	const pattern = /\[[A-Z][a-zA-Z0-9\s/\\-&]+\]/g;
	return Array.from(new Set(content.match(pattern) || []));
}

// Export quality requirements for external use
export { V2_QUALITY_REQUIREMENTS };
