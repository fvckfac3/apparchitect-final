/**
 * Structured Export Utilities - V2 Compliant
 * 
 * Comprehensive export functionality for PRD suites.
 * Supports multiple formats with full v2 template support.
 */

import type { GeneratedDocuments, Document } from '@/types/documents';
import type { AgentTeam } from '@/types/agents';
import type { SuiteValidationResult } from './prd-validation';

// ============================================================================
// §1 - EXPORT TYPES
// ============================================================================

export type ExportFormat = 'markdown' | 'json' | 'html' | 'pdf';

export interface ExportOptions {
	format: ExportFormat;
	includeValidation?: boolean;
	includeMetadata?: boolean;
	includeTableOfContents?: boolean;
	splitFiles?: boolean;
	projectName?: string;
}

export interface ExportResult {
	success: boolean;
	format: ExportFormat;
	files: ExportedFile[];
	totalSize: number;
}

export interface ExportedFile {
	filename: string;
	content: string;
	mimeType: string;
	size: number;
}

// ============================================================================
// §2 - V2 SUITE STRUCTURE
// ============================================================================

export interface V2PRDSuite {
	meta: {
		projectName: string;
		generatedAt: string;
		version: '2.0';
		totalDocuments: number;
	};
	baseDocuments: Record<string, string>;
	agentDocuments: Record<string, string>;
	auxiliaryDocuments: {
		collaborationMap: string;
		userGuide: string;
		masterIndex: string;
	};
	validation?: SuiteValidationResult;
}

// ============================================================================
// §3 - TABLE OF CONTENTS GENERATION
// ============================================================================

function generateTableOfContents(suite: V2PRDSuite): string {
	const lines: string[] = [
		'# Table of Contents',
		'',
		'## Base PRDs',
		'',
	];
	
	let index = 1;
	for (const filename of Object.keys(suite.baseDocuments).sort()) {
		const title = filename.replace('.md', '').replace(/^\d+-/, '').replace(/-/g, ' ');
		lines.push(`${index}. [${title}](#${filename.replace('.md', '')})`);
		index++;
	}
	
	lines.push('', '## Agent PRDs', '');
	for (const filename of Object.keys(suite.agentDocuments).sort()) {
		const title = filename.replace('.md', '').replace(/^\d+-/, '').replace(/-/g, ' ');
		lines.push(`${index}. [${title}](#${filename.replace('.md', '')})`);
		index++;
	}
	
	lines.push('', '## Auxiliary Documents', '');
	lines.push(`${index}. [Collaboration Map](#collaboration-map)`);
	lines.push(`${index + 1}. [User Guide](#user-guide)`);
	lines.push(`${index + 2}. [Master Index](#master-index)`);
	
	return lines.join('\n');
}

// ============================================================================
// §4 - MARKDOWN EXPORT
// ============================================================================

export function exportToMarkdown(suite: V2PRDSuite, options: ExportOptions): ExportedFile[] {
	const files: ExportedFile[] = [];
	const divider = '\n\n---\n\n';
	
	if (options.splitFiles) {
		// Export each document as separate file
		for (const [filename, content] of Object.entries(suite.baseDocuments)) {
			files.push({
				filename,
				content,
				mimeType: 'text/markdown',
				size: new Blob([content]).size,
			});
		}
		
		for (const [filename, content] of Object.entries(suite.agentDocuments)) {
			files.push({
				filename,
				content,
				mimeType: 'text/markdown',
				size: new Blob([content]).size,
			});
		}
		
		// Auxiliary documents
		files.push({
			filename: 'collaboration-map.md',
			content: suite.auxiliaryDocuments.collaborationMap,
			mimeType: 'text/markdown',
			size: new Blob([suite.auxiliaryDocuments.collaborationMap]).size,
		});
		
		files.push({
			filename: 'user-guide.md',
			content: suite.auxiliaryDocuments.userGuide,
			mimeType: 'text/markdown',
			size: new Blob([suite.auxiliaryDocuments.userGuide]).size,
		});
	} else {
		// Single combined file
		const sections: string[] = [];
		
		// Header
		sections.push(`# ${suite.meta.projectName} - PRD Suite`);
		sections.push('');
		sections.push(`**Version:** ${suite.meta.version}`);
		sections.push(`**Generated:** ${suite.meta.generatedAt}`);
		sections.push(`**Total Documents:** ${suite.meta.totalDocuments}`);
		sections.push('');
		
		// Table of contents
		if (options.includeTableOfContents) {
			sections.push(generateTableOfContents(suite));
			sections.push(divider);
		}
		
		// Base documents
		for (const [, content] of Object.entries(suite.baseDocuments).sort()) {
			sections.push(content);
		}
		
		// Agent documents
		for (const [, content] of Object.entries(suite.agentDocuments).sort()) {
			sections.push(content);
		}
		
		// Auxiliary
		sections.push(suite.auxiliaryDocuments.collaborationMap);
		sections.push(suite.auxiliaryDocuments.userGuide);
		
		// Validation report
		if (options.includeValidation && suite.validation) {
			sections.push(divider);
			sections.push('# Validation Report');
			sections.push('');
			sections.push(`**Overall Score:** ${suite.validation.overallScore}/100`);
			sections.push(`**Valid:** ${suite.validation.isValid ? 'Yes' : 'No'}`);
			sections.push(`**Total Issues:** ${suite.validation.summary.totalIssues}`);
		}
		
		const combined = sections.join(divider);
		const filename = `${suite.meta.projectName.replace(/\s+/g, '-')}-PRD-Suite.md`;
		
		files.push({
			filename,
			content: combined,
			mimeType: 'text/markdown',
			size: new Blob([combined]).size,
		});
	}
	
	return files;
}

// ============================================================================
// §5 - JSON EXPORT
// ============================================================================

export function exportToJSON(suite: V2PRDSuite, options: ExportOptions): ExportedFile[] {
	const exportData = {
		meta: suite.meta,
		documents: {
			base: suite.baseDocuments,
			agent: suite.agentDocuments,
			auxiliary: suite.auxiliaryDocuments,
		},
		...(options.includeValidation && suite.validation ? { validation: suite.validation } : {}),
	};
	
	const content = JSON.stringify(exportData, null, 2);
	const filename = `${suite.meta.projectName.replace(/\s+/g, '-')}-PRD-Suite.json`;
	
	return [{
		filename,
		content,
		mimeType: 'application/json',
		size: new Blob([content]).size,
	}];
}

// ============================================================================
// §6 - HTML EXPORT
// ============================================================================

function markdownToHtml(markdown: string): string {
	return markdown
		.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
		.replace(/^### (.+)$/gm, '<h3>$1</h3>')
		.replace(/^## (.+)$/gm, '<h2>$1</h2>')
		.replace(/^# (.+)$/gm, '<h1>$1</h1>')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
		.replace(/^- (.+)$/gm, '<li>$1</li>')
		.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
		.replace(/\n\n/g, '</p><p>')
		.replace(/---/g, '<hr/>');
}

export function exportToHTML(suite: V2PRDSuite, options: ExportOptions): ExportedFile[] {
	const allContent = [
		...Object.values(suite.baseDocuments),
		...Object.values(suite.agentDocuments),
		suite.auxiliaryDocuments.collaborationMap,
		suite.auxiliaryDocuments.userGuide,
	].join('\n\n---\n\n');
	
	const htmlContent = markdownToHtml(allContent);
	
	const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${suite.meta.projectName} - PRD Suite</title>
	<style>
		:root {
			--bg: #0D1117;
			--surface: #161B22;
			--border: #30363D;
			--text: #C9D1D9;
			--text-muted: #8B949E;
			--accent: #00E5CC;
		}
		* { box-sizing: border-box; }
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			background: var(--bg);
			color: var(--text);
			line-height: 1.6;
			max-width: 900px;
			margin: 0 auto;
			padding: 2rem;
		}
		h1, h2, h3, h4 { color: var(--accent); margin-top: 2rem; }
		h1 { border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; }
		code {
			background: var(--surface);
			padding: 0.2rem 0.4rem;
			border-radius: 4px;
			font-family: 'Fira Code', monospace;
		}
		pre {
			background: var(--surface);
			padding: 1rem;
			border-radius: 8px;
			overflow-x: auto;
			border: 1px solid var(--border);
		}
		pre code { background: none; padding: 0; }
		table {
			width: 100%;
			border-collapse: collapse;
			margin: 1rem 0;
		}
		th, td {
			border: 1px solid var(--border);
			padding: 0.5rem 1rem;
			text-align: left;
		}
		th { background: var(--surface); }
		hr {
			border: none;
			border-top: 1px solid var(--border);
			margin: 3rem 0;
		}
		blockquote {
			border-left: 4px solid var(--accent);
			margin: 1rem 0;
			padding-left: 1rem;
			color: var(--text-muted);
		}
		.meta {
			background: var(--surface);
			padding: 1rem;
			border-radius: 8px;
			margin-bottom: 2rem;
			border: 1px solid var(--border);
		}
		@media print {
			body { background: white; color: black; }
			h1, h2, h3, h4 { color: #333; }
			code, pre { background: #f5f5f5; }
		}
	</style>
</head>
<body>
	<div class="meta">
		<strong>Project:</strong> ${suite.meta.projectName}<br/>
		<strong>Version:</strong> ${suite.meta.version}<br/>
		<strong>Generated:</strong> ${suite.meta.generatedAt}<br/>
		<strong>Documents:</strong> ${suite.meta.totalDocuments}
	</div>
	<article>
		<p>${htmlContent}</p>
	</article>
</body>
</html>`;
	
	const filename = `${suite.meta.projectName.replace(/\s+/g, '-')}-PRD-Suite.html`;
	
	return [{
		filename,
		content: html,
		mimeType: 'text/html',
		size: new Blob([html]).size,
	}];
}

// ============================================================================
// §7 - UNIFIED EXPORT FUNCTION
// ============================================================================

export function exportSuite(suite: V2PRDSuite, options: ExportOptions): ExportResult {
	let files: ExportedFile[] = [];
	
	switch (options.format) {
		case 'markdown':
			files = exportToMarkdown(suite, options);
			break;
		case 'json':
			files = exportToJSON(suite, options);
			break;
		case 'html':
		case 'pdf': // PDF uses HTML export with print
			files = exportToHTML(suite, options);
			break;
	}
	
	return {
		success: true,
		format: options.format,
		files,
		totalSize: files.reduce((sum, f) => sum + f.size, 0),
	};
}

// ============================================================================
// §8 - LEGACY FORMAT CONVERSION
// ============================================================================

export function convertFromLegacyFormat(
	documents: GeneratedDocuments,
	projectName: string,
	team?: AgentTeam
): V2PRDSuite {
	const baseDocuments: Record<string, string> = {};
	const agentDocuments: Record<string, string> = {};
	
	// Convert master context to base document
	if (documents.masterContext) {
		const content = typeof documents.masterContext === 'string' 
			? documents.masterContext 
			: documents.masterContext.content;
		baseDocuments['03-core-systems-prd.md'] = content;
	}
	
	// Convert agent PRDs
	const agentPRDs = documents.agentPRDs;
	if (Array.isArray(agentPRDs)) {
		// Legacy array format
		agentPRDs.forEach((doc: Document, i: number) => {
			agentDocuments[`${String(i).padStart(2, '0')}-${doc.title.toLowerCase().replace(/\s+/g, '-')}.md`] = doc.content;
		});
	} else if (typeof agentPRDs === 'object') {
		// New record format
		for (const [key, content] of Object.entries(agentPRDs)) {
			agentDocuments[`${key}.md`] = content;
		}
	}
	
	return {
		meta: {
			projectName,
			generatedAt: new Date().toISOString(),
			version: '2.0',
			totalDocuments: Object.keys(baseDocuments).length + 
				Object.keys(agentDocuments).length + 3,
		},
		baseDocuments,
		agentDocuments,
		auxiliaryDocuments: {
			collaborationMap: typeof documents.collaborationMap === 'string'
				? documents.collaborationMap
				: documents.collaborationMap?.content || '',
			userGuide: typeof documents.setupGuide === 'string'
				? documents.setupGuide
				: documents.setupGuide?.content || '',
			masterIndex: baseDocuments['14-master-index.md'] || '',
		},
	};
}

// ============================================================================
// §9 - FILE DOWNLOAD HELPERS
// ============================================================================

export function downloadFile(file: ExportedFile): void {
	const blob = new Blob([file.content], { type: file.mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = file.filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function downloadAllFiles(files: ExportedFile[]): void {
	if (files.length === 1) {
		downloadFile(files[0]);
		return;
	}
	
	// For multiple files, download with delay
	files.forEach((file, index) => {
		setTimeout(() => downloadFile(file), index * 500);
	});
}

export function openPrintWindow(html: string): void {
	const printWindow = window.open('', '_blank');
	if (printWindow) {
		printWindow.document.write(html);
		printWindow.document.close();
		setTimeout(() => {
			printWindow.print();
		}, 500);
	}
}
