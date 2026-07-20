/**
 * PRD Suite Generator Hook - V2
 * 
 * Based on Core Systems PRD §4 - Document Generation Engine
 * Generates all v2 PRDs with RLM compliance, validation, and deep filling.
 */

import { useState, useCallback } from 'react';
import { 
	getAllPRDDocumentsV2, 
	generateAllPRDsV2,
	checkRLMCompliance,
	PRD_GENERATION_ORDER_V2,
	type PRDDocumentV2 
} from '@/data/prd-templates-v2-registry';
import { AGENT_CATALOG, determineRequiredAgents } from '@/data/agent-catalog';
import { validateSuite, validateDocument, type SuiteValidationResult } from '@/lib/prd-validation';
import { fillTemplate, checkAnswerCompleteness } from '@/lib/template-filler';
import { enhanceDocumentBatch } from '@/lib/ai-prd-enhancer';
import type { InterviewAnswers } from '@/types/interview';
import type { AgentTeam, Agent, AgentConnection, AgentType } from '@/types/agents';
import type { GeneratedDocuments, Document } from '@/types/documents';

// ============================================================================
// §1 - TYPES
// ============================================================================

export type GenerationPhase = 
	| 'idle'
	| 'analyzing'
	| 'selecting_templates'
	| 'generating_base'
	| 'enhancing_with_ai'
	| 'generating_agents'
	| 'generating_auxiliary'
	| 'filling_templates'
	| 'validating'
	| 'complete'
	| 'failed';

export interface GenerationProgress {
	phase: GenerationPhase;
	currentDocument: string | null;
	completedDocuments: string[];
	totalDocuments: number;
	percentage: number;
	statusMessage?: string;
}

export interface PRDSuiteOutputV2 {
	baseDocuments: Map<string, string>;
	agentDocuments: Map<string, string>;
	auxiliaryDocuments: {
		collaborationMap: string;
		userGuide: string;
		masterIndex: string;
	};
	meta: {
		projectName: string;
		generatedAt: string;
		version: '2.0';
		totalDocuments: number;
		generationTimeMs: number;
	};
	validation: SuiteValidationResult;
	answerCompleteness: ReturnType<typeof checkAnswerCompleteness>;
}

// ============================================================================
// §2 - LEGACY FORMAT CONVERSION
// ============================================================================

function convertToLegacyFormat(suite: PRDSuiteOutputV2, team: AgentTeam): GeneratedDocuments {
	// Extract master context from base documents
	const masterContent = suite.baseDocuments.get('core-systems-template') || '';
	
	const masterContext: Document = {
		id: 'master-context',
		title: 'Core Systems PRD',
		type: 'master',
		content: masterContent,
	};
	
	// Convert agent documents to legacy array format
	const agentPRDs: Document[] = [];
	for (const [filename, content] of suite.agentDocuments.entries()) {
		const agent = team.agents.find(a => filename.includes(a.type));
		agentPRDs.push({
			id: filename,
			title: agent?.name || filename,
			type: 'agent',
			content,
		});
	}
	
	const collaborationMap: Document = {
		id: 'collaboration-map',
		title: 'Collaboration Map',
		type: 'collaboration',
		content: suite.auxiliaryDocuments.collaborationMap,
	};
	
	const setupGuide: Document = {
		id: 'setup-guide',
		title: 'User Guide',
		type: 'setup',
		content: suite.auxiliaryDocuments.userGuide,
	};
	
	return {
		masterContext,
		agentPRDs,
		collaborationMap,
		setupGuide,
	};
}

// ============================================================================
// §3 - AGENT TEAM SYNTHESIS
// ============================================================================

function synthesizeTeam(answers: InterviewAnswers): AgentTeam {
	// Collect all features from answers
	const features: string[] = [
		answers.productType || '',
		answers.coreSystems || '',
		answers.externalServices || '',
		answers.usesAI || '',
		answers.businessModel || '',
		...(answers.platforms || []),
	];
	
	// Determine required agents
	const requiredAgents = determineRequiredAgents(features);
	
	// Create agent instances
	const agents: Agent[] = requiredAgents.map((def) => ({
		id: `agent-${def.id}`,
		type: def.type,
		name: def.name,
		designation: def.designation,
		role: def.role,
		responsibilities: def.responsibilities,
		color: def.color,
	}));
	
	// Create connections based on dependencies
	const connections: AgentConnection[] = [];
	let interactionId = 1;
	
	for (const agentDef of requiredAgents) {
		for (const depType of agentDef.dependsOn) {
			const fromAgent = agents.find(a => a.type === depType);
			const toAgent = agents.find(a => a.type === agentDef.type);
			
			if (fromAgent && toAgent) {
				connections.push({
					from: fromAgent.id,
					to: toAgent.id,
					label: `INT-${String(interactionId).padStart(3, '0')}`,
					interactionId: `INT-${String(interactionId).padStart(3, '0')}`,
				});
				interactionId++;
			}
		}
	}
	
	return { agents, connections };
}

// ============================================================================
// §4 - AGENT PRD GENERATION (V2)
// ============================================================================

function generateAgentPRDV2(agent: Agent, answers: InterviewAnswers): string {
	const agentDef = AGENT_CATALOG.find(a => a.type === agent.type);
	const responsibilities = agentDef?.responsibilities || agent.responsibilities || [];
	
	return `# ${answers.productName || 'Product'} – ${agent.name} Agent PRD

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** ${answers.productName || 'Product'} – Master PRD Index
**Precedence:** Tier 5 (Agent-specific)
**Information Density:** O(1) per section

---

> **┌─────────────────────────────────────────────────────────────┐**
> **│ PRECEDENCE COMPLIANCE BLOCK                                     │**
> **├─────────────────────────────────────────────────────────────┤**
> **│ Subordinate to:                                                │**
> **│   • Safety, Privacy & Control PRD (Tier 1)                     │**
> **│   • Core Systems PRD (Tier 2)                                  │**
> **│   • Technical Architecture PRD (Tier 3)                        │**
> **│ Governs: Agent implementation decisions                       │**
> **│ Conflict resolution: Escalate to higher-tier PRD              │**
> **│ Exception: Safety overrides → STOP and consult human          │**
> **└─────────────────────────────────────────────────────────────┘**

---

## §1 – RLM Activation Protocol

\`\`\`text
ROLE:
You are the ${agent.name} for ${answers.productName || 'this product'}.
Designation: ${agent.designation}
Core Function: ${agent.role}

LIMITS:
- NEVER modify files outside your designated scope
- NEVER bypass safety constraints from Tier 1 PRD
- NEVER make assumptions about undefined requirements
- ALWAYS escalate ambiguity to human operator

MISSION:
${responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Success: All acceptance criteria met, tests pass, no violations
Failure: Safety violation, scope breach, unresolved ambiguity

Begin with: Review ${agent.designation} scope and dependencies
\`\`\`

---

## §2 – Agent Identity

| Field | Value |
|-------|-------|
| Agent Name | ${agent.name} |
| Designation | ${agent.designation} |
| Role | ${agent.role} |
| Precedence | Tier 5 |
| Dependencies | Core Systems, Technical Architecture |

---

## §3 – Responsibilities

| # | Responsibility | Priority |
|---|----------------|----------|
${responsibilities.map((r, i) => `| ${i + 1} | ${r} | P${Math.min(i + 1, 3)} |`).join('\n')}

---

## §4 – Input Requirements

| Input | Source | Required |
|-------|--------|----------|
| PRD Suite | Master Index | Yes |
| Technical Specs | Technical Architecture PRD | Yes |
| Design System | Design System PRD | If UI work |
| Test Plan | Test Plan PRD | Yes |

---

## §5 – Output Artifacts

| Artifact | Format | Destination |
|----------|--------|-------------|
| Source Code | TypeScript | \`src/\` |
| Tests | Jest/Vitest | \`tests/\` |
| Documentation | Markdown | \`docs/\` |
| Changelog Entry | Markdown | \`CHANGELOG.md\` |

---

## §6 – Error Handling

| Error Type | Action |
|------------|--------|
| Ambiguous requirement | STOP → Ask human |
| Missing dependency | STOP → Request from responsible agent |
| Test failure | Fix → Re-run → If persists, escalate |
| Safety violation | STOP IMMEDIATELY → Report to human |

---

## §7 – Completion Checklist

- [ ] All assigned tasks complete
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Documentation updated
- [ ] Changelog entry added
- [ ] Code review requested
- [ ] Handoff to next agent prepared

---

## §8 – Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | ${new Date().toISOString().split('T')[0]} | Generator | V2 RLM-compliant generation |

---

**END OF ${agent.name.toUpperCase()} AGENT PRD**
`;
}

// ============================================================================
// §5 - COLLABORATION MAP GENERATION (V2)
// ============================================================================

function generateCollaborationMapV2(team: AgentTeam, answers: InterviewAnswers): string {
	return `# ${answers.productName || 'Product'} – Collaboration Map

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** ${answers.productName || 'Product'} – Master PRD Index
**Precedence:** Auxiliary Document
**Information Density:** O(N) where N = agent count

---

> **┌─────────────────────────────────────────────────────────────┐**
> **│ PRECEDENCE COMPLIANCE BLOCK                                     │**
> **├─────────────────────────────────────────────────────────────┤**
> **│ Subordinate to: Master PRD Index, Core Systems PRD             │**
> **│ Governs: Agent interaction patterns                            │**
> **│ Conflict: Route to responsible agent's PRD                     │**
> **└─────────────────────────────────────────────────────────────┘**

---

## §1 – Agent Roster

| # | Agent | Designation | Role |
|---|-------|-------------|------|
${team.agents.map((agent, i) => 
	`| ${i + 1} | ${agent.name} | ${agent.designation} | ${agent.role} |`
).join('\n')}

---

## §2 – Interaction Matrix

| From | To | Interaction | Description |
|------|----|-------------|-------------|
${team.connections.map(conn => {
	const from = team.agents.find(a => a.id === conn.from);
	const to = team.agents.find(a => a.id === conn.to);
	return `| ${from?.designation || 'Unknown'} | ${to?.designation || 'Unknown'} | ${conn.interactionId} | Dependency handoff |`;
}).join('\n')}

---

## §3 – Execution Order

\`\`\`mermaid
graph TD
${team.agents.map((a, i) => `    A${i}["${a.designation}"]`).join('\n')}
${team.connections.map(conn => {
	const fromIdx = team.agents.findIndex(a => a.id === conn.from);
	const toIdx = team.agents.findIndex(a => a.id === conn.to);
	return `    A${fromIdx} --> A${toIdx}`;
}).join('\n')}
\`\`\`

---

## §4 – Communication Protocol

| Scenario | Action |
|----------|--------|
| Request handoff | Source agent completes, notifies target |
| Block detected | Blocking agent escalates with context |
| Ambiguity found | STOP → Request clarification from human |
| Conflict | Consult higher-precedence PRD |

---

## §5 – Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | ${new Date().toISOString().split('T')[0]} | Generator | V2 RLM-compliant structure |

---

**END OF COLLABORATION MAP**
`;
}

// ============================================================================
// §6 - USER GUIDE GENERATION (V2)
// ============================================================================

function generateUserGuideV2(team: AgentTeam, answers: InterviewAnswers): string {
	return `# ${answers.productName || 'Product'} – User Setup & Execution Guide

**Version:** 2.0
**Status:** Authoritative · Build-Ready
**Governed by:** ${answers.productName || 'Product'} – Master PRD Index
**Precedence:** Operational Document
**Information Density:** O(1) per section

---

> **┌─────────────────────────────────────────────────────────────┐**
> **│ PRECEDENCE COMPLIANCE BLOCK                                     │**
> **├─────────────────────────────────────────────────────────────┤**
> **│ Subordinate to: All PRDs in the suite                          │**
> **│ Governs: Human operator workflow                               │**
> **│ Purpose: Quick-start guide for build execution                 │**
> **└─────────────────────────────────────────────────────────────┘**

---

## §1 – Quick Start

### Step 1: Review PRD Suite
Read all PRDs in precedence order:
1. Safety, Privacy & Control PRD
2. Core Systems PRD
3. Technical Architecture PRD
4. Remaining PRDs as needed

### Step 2: Prepare Environment
\`\`\`bash
# Clone repository
git clone [repository-url]
cd ${answers.productName?.toLowerCase().replace(/\s+/g, '-') || 'project'}

# Install dependencies
npm install

# Set up environment
cp .env.example .env
\`\`\`

### Step 3: Brief Agents
For each agent, provide:
- Their specific Agent PRD
- Relevant sections from Core Systems PRD
- Any dependent artifacts from previous agents

---

## §2 – Agent Briefing Order

| # | Agent | Designation | Role |
|---|-------|-------------|------|
${team.agents.map((agent, i) => 
	`| ${i + 1} | ${agent.name} | ${agent.designation} | ${agent.role} |`
).join('\n')}

---

## §3 – Verification Protocol

After each agent completes:

1. ☐ Review output artifacts
2. ☐ Verify PRD compliance
3. ☐ Run applicable tests
4. ☐ Confirm handoff readiness
5. ☐ Log completion in changelog

---

## §4 – When Problems Arise

| Problem | Action |
|---------|--------|
| PRD conflict | Use precedence order (Safety > Core > Experience > Technical) |
| Missing requirement | Update relevant PRD first, then re-brief agent |
| Agent stuck | Check dependencies, provide missing context |
| Test failure | Route to owning agent for fix |

---

## §5 – Launch Readiness Checklist

- [ ] All agents have completed
- [ ] All tests pass
- [ ] All PRD requirements met
- [ ] Security review complete
- [ ] Performance targets met
- [ ] Documentation complete
- [ ] Deployment verified

---

## §6 – Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | ${new Date().toISOString().split('T')[0]} | Generator | V2 RLM-compliant guide |

---

**END OF USER SETUP & EXECUTION GUIDE**
`;
}

// ============================================================================
// §7 - MAIN HOOK
// ============================================================================

export function usePRDGeneratorV2() {
	const [isGenerating, setIsGenerating] = useState(false);
	const [progress, setProgress] = useState<GenerationProgress>({
		phase: 'idle',
		currentDocument: null,
		completedDocuments: [],
		totalDocuments: 0,
		percentage: 0,
	});
	const [suite, setSuite] = useState<PRDSuiteOutputV2 | null>(null);
	const [documents, setDocuments] = useState<GeneratedDocuments>({
		masterContext: null,
		agentPRDs: [],
		collaborationMap: null,
		setupGuide: null,
	});
	const [error, setError] = useState<string | null>(null);
	const [aiStatus, setAiStatus] = useState<import('@/components/Generation/AIStatusBadge').AIStatusState>({ kind: 'idle' });

	// Main generation function
	const generateSuite = useCallback(async (answers: InterviewAnswers): Promise<{ suite: PRDSuiteOutputV2; team: AgentTeam; documents: GeneratedDocuments }> => {
		const startTime = Date.now();
		setIsGenerating(true);
		setError(null);
		
		try {
			// Phase 1: Analyze answers
			setProgress({
				phase: 'analyzing',
				currentDocument: 'Analyzing interview answers...',
				completedDocuments: [],
				totalDocuments: 0,
				percentage: 5,
				statusMessage: 'Checking answer completeness',
			});
			
			const answerCompleteness = checkAnswerCompleteness(answers);
			await new Promise(r => setTimeout(r, 200));
			
			// Phase 2: Synthesize team
			setProgress(prev => ({
				...prev,
				phase: 'selecting_templates',
				currentDocument: 'Determining agent team...',
				percentage: 10,
				statusMessage: `Answer quality: ${answerCompleteness.score}%`,
			}));
			
			const team = synthesizeTeam(answers);
			await new Promise(r => setTimeout(r, 200));
			
			// Phase 3: Generate base PRDs from V2 registry
			const v2Docs = getAllPRDDocumentsV2();
			const totalDocs = v2Docs.length + team.agents.length + 3; // +3 for collab, guide, index
			
			setProgress({
				phase: 'generating_base',
				currentDocument: null,
				completedDocuments: [],
				totalDocuments: totalDocs,
				percentage: 15,
				statusMessage: `Generating ${v2Docs.length} base PRDs`,
			});
			
			const baseDocuments = new Map<string, string>();
			const completedDocs: string[] = [];

			// Phase 3a: Template-fill all base PRDs (fast, deterministic)
			for (let i = 0; i < v2Docs.length; i++) {
				const doc = v2Docs[i];
				
				setProgress(prev => ({
					...prev,
					currentDocument: doc.title,
					percentage: 15 + ((i / v2Docs.length) * 30),
				}));
				
				try {
					const content = doc.generate(answers, team);
					baseDocuments.set(doc.id, content);
					completedDocs.push(doc.id);
				} catch (err) {
					console.error(`Error generating ${doc.id}:`, err);
					baseDocuments.set(doc.id, `# Error generating ${doc.title}\n\nGeneration failed.`);
				}
				
				setProgress(prev => ({
					...prev,
					completedDocuments: [...completedDocs],
				}));
				
				await new Promise(r => setTimeout(r, 50));
			}

			// Phase 3b: AI-enhance base PRDs in parallel (fills [USER-UNSPECIFIED])
			setProgress(prev => ({
				...prev,
				phase: 'enhancing_with_ai',
				statusMessage: 'Enhancing PRDs with AI...',
				percentage: 45,
			}));

			setAiStatus({ kind: 'active', provider: 'AI', model: 'selecting' });

			const enhancementQueue = v2Docs
				.filter(doc => baseDocuments.has(doc.id))
				.map(doc => ({
					id: doc.id,
					title: doc.title,
					content: baseDocuments.get(doc.id) || '',
					category: (doc.category as 'base' | 'reference' | 'operational' | 'auxiliary' | 'agent'),
				}));

			try {
				const enhancementResults = await enhanceDocumentBatch(
					enhancementQueue,
					answers,
					{
						concurrency: 3,
						onProgress: (done, total, title) => {
							setProgress(prev => ({
								...prev,
								currentDocument: title,
								percentage: 45 + ((done / total) * 10),
								statusMessage: `Enhancing ${done}/${total}`,
							}));
						},
						onProviderUsed: (provider, model, fellBack) => {
							setAiStatus(fellBack ? { kind: 'fallback', from: 'primary provider', to: provider, reason: 'automatic provider fallback' } : { kind: 'active', provider, model });
						},
					}
				);

				let aiEnhanced = 0;
				for (const [id, result] of enhancementResults.entries()) {
					if (result.enhanced) {
						baseDocuments.set(id, result.content);
						aiEnhanced++;
					}
				}
				const providers = Array.from(enhancementResults.values())
				.filter((result) => result.enhanced && result.provider && result.model)
				.map((result) => ({ provider: result.provider!, model: result.model! }));
			setAiStatus(providers.length > 0
				? { kind: 'active', provider: providers[providers.length - 1].provider, model: 'complete' }
				: { kind: 'unavailable', reason: 'No configured AI provider completed an enhancement' });
			} catch (aiError) {
				console.warn('AI enhancement failed, falling back to template-filled content:', aiError);
				setAiStatus({ kind: 'unavailable', reason: aiError instanceof Error ? aiError.message : 'AI enhancement unavailable' });
			}

			// Phase 4: Generate agent PRDs
			setProgress(prev => ({
				...prev,
				phase: 'generating_agents',
				statusMessage: `Generating ${team.agents.length} agent PRDs`,
			}));
			
			const agentDocuments = new Map<string, string>();
			
			for (let i = 0; i < team.agents.length; i++) {
				const agent = team.agents[i];
				const filename = `${String(i).padStart(2, '0')}-${agent.type}-agent`;
				
				setProgress(prev => ({
					...prev,
					currentDocument: agent.name,
					percentage: 55 + ((i / team.agents.length) * 20),
				}));
				
				agentDocuments.set(filename, generateAgentPRDV2(agent, answers));
				completedDocs.push(filename);
				
				setProgress(prev => ({
					...prev,
					completedDocuments: [...completedDocs],
				}));
				
				await new Promise(r => setTimeout(r, 80));
			}
			
			// Phase 5: Generate auxiliary documents
			setProgress(prev => ({
				...prev,
				phase: 'generating_auxiliary',
				currentDocument: 'Collaboration Map',
				percentage: 80,
				statusMessage: 'Generating auxiliary documents',
			}));
			
			const collaborationMap = generateCollaborationMapV2(team, answers);
			await new Promise(r => setTimeout(r, 150));
			
			setProgress(prev => ({
				...prev,
				currentDocument: 'User Guide',
				percentage: 85,
			}));
			
			const userGuide = generateUserGuideV2(team, answers);
			await new Promise(r => setTimeout(r, 150));
			
			// Phase 6: Validate
			setProgress(prev => ({
				...prev,
				phase: 'validating',
				currentDocument: 'Running validation...',
				percentage: 90,
				statusMessage: 'Checking RLM compliance',
			}));
			
			// Create combined document map for validation
			const allDocs = new Map<string, string>();
			for (const [id, content] of baseDocuments) {
				allDocs.set(id, content);
			}
			for (const [id, content] of agentDocuments) {
				allDocs.set(id, content);
			}
			allDocs.set('collaboration-map', collaborationMap);
			allDocs.set('user-guide', userGuide);
			
			const validation = validateSuite(allDocs);
			
			await new Promise(r => setTimeout(r, 200));
			
			// Build final suite
			const finalSuite: PRDSuiteOutputV2 = {
				baseDocuments,
				agentDocuments,
				auxiliaryDocuments: {
					collaborationMap,
					userGuide,
					masterIndex: baseDocuments.get('master-index-template') || '',
				},
				meta: {
					projectName: answers.productName || 'PRD Suite',
					generatedAt: new Date().toISOString(),
					version: '2.0',
					totalDocuments: allDocs.size,
					generationTimeMs: Date.now() - startTime,
				},
				validation,
				answerCompleteness,
			};
			
			setSuite(finalSuite);
			setDocuments(convertToLegacyFormat(finalSuite, team));
			
			setProgress({
				phase: 'complete',
				currentDocument: null,
				completedDocuments: completedDocs,
				totalDocuments: totalDocs,
				percentage: 100,
				statusMessage: `Generated ${allDocs.size} documents, validation score: ${validation.overallScore}/100`,
			});
			
			return { suite: finalSuite, team, documents: convertToLegacyFormat(finalSuite, team) };
			
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Generation failed';
			setError(errorMessage);
			setProgress(prev => ({
				...prev,
				phase: 'failed',
				statusMessage: errorMessage,
			}));
			throw err;
		} finally {
			setIsGenerating(false);
		}
	}, []);

	return {
		isGenerating,
		progress,
		suite,
		documents,
		error,
		aiStatus,
		generateSuite,
		synthesizeTeam,
	};
}

// Re-export types
export type { PRDSuiteOutputV2 as PRDSuiteOutput };
