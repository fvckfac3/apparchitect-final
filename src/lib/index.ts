/**
 * Library Module Index
 * 
 * Central export point for all library utilities.
 * Import from '@/lib' for convenient access.
 */

// Validation Pipeline
export {
	validateDocument,
	validateSuite,
	generateComplianceReport,
	isV2Compliant,
	getPlaceholderCount,
	findAllPlaceholders,
	V2_QUALITY_REQUIREMENTS,
	type ValidationIssue,
	type DocumentValidationResult,
	type SuiteValidationResult,
} from './prd-validation';

// Template Filling
export {
	fillTemplate,
	fillTemplates,
	applyInferences,
	checkAnswerCompleteness,
	ANSWER_MAPPINGS,
	INFERENCE_RULES,
	type AnswerMapping,
	type InferenceRule,
	type FillResult,
	type BatchFillResult,
	type CompletenessResult,
} from './template-filler';

// Export Utilities
export {
	exportSuite,
	exportToMarkdown,
	exportToJSON,
	exportToHTML,
	convertFromLegacyFormat,
	downloadFile,
	downloadAllFiles,
	openPrintWindow,
	type ExportFormat,
	type ExportOptions,
	type ExportResult,
	type ExportedFile,
	type V2PRDSuite,
} from './export-utils';

// AI Interview
export {
	AI_QUESTION_BANK,
	FOLLOW_UP_QUESTIONS,
	generateAISuggestion,
	assessAnswerQuality,
	getOverallAnswerQuality,
	getQuestionsForCategory,
	getNextCategory,
	shouldTriggerFollowUp,
	calculateProgress,
	type AIQuestion,
	type AIQuestionCategory,
	type InterviewContext,
	type InterviewProgress,
	type ValidationResult,
	type FollowUpQuestion,
} from './interview-ai';
