/**
 * PRD Suite Generator Hook
 * 
 * Based on Core Systems PRD §4 - Document Generation Engine
 * Generates all 16 base PRDs + agent PRDs + collaboration map
 */

import { useState, useCallback } from 'react';
import { PRD_DOCUMENTS, ADDITIONAL_PRD_DOCUMENTS, getAllPRDDocuments, type PRDDocument } from '@/data/prd-templates';
import { AGENT_CATALOG, determineRequiredAgents } from '@/data/agent-catalog';
import type { InterviewAnswers } from '@/types/interview';
import type { AgentTeam, Agent, AgentConnection, AgentType } from '@/types/agents';
import type { GeneratedDocuments, Document } from '@/types/documents';
import { enhanceDocumentBatch } from '@/lib/ai-prd-enhancer';

export type GenerationPhase = 
	| 'idle'
	| 'selecting_templates'
	| 'generating_base'
	| 'enhancing_with_ai'
	| 'generating_agents'
	| 'generating_collab'
	| 'validating'
	| 'complete'
	| 'failed';

export interface GenerationProgress {
	phase: GenerationPhase;
	currentDocument: string | null;
	completedDocuments: string[];
	totalDocuments: number;
	percentage: number;
}

export interface PRDSuiteOutput {
	baseDocuments: Record<string, string>;
	agentDocuments: Record<string, string>;
	collaborationMap: string;
	masterIndex: string;
	userGuide: string;
	audit: {
		placeholderCount: number;
		allChecksPassed: boolean;
		generatedAt: string;
	};
}

// Convert PRD suite to legacy GeneratedDocuments format
function convertToLegacyFormat(suite: PRDSuiteOutput, team: AgentTeam): GeneratedDocuments {
	// Extract master context (Core Systems PRD)
	const masterContext = suite.baseDocuments['03-core-systems-prd.md'] || '';
	
	// Convert agent documents to legacy format
	const agentPRDs: Record<string, string> = {};
	for (const [filename, content] of Object.entries(suite.agentDocuments)) {
		const agentName = filename.replace('.md', '').replace(/^\d+-/, '');
		agentPRDs[agentName] = content;
	}
	
	return {
		masterContext,
		agentPRDs,
		collaborationMap: suite.collaborationMap,
		setupGuide: suite.userGuide,
	};
}

export function usePRDGenerator() {
	const [isGenerating, setIsGenerating] = useState(false);
	const [progress, setProgress] = useState<GenerationProgress>({
		phase: 'idle',
		currentDocument: null,
		completedDocuments: [],
		totalDocuments: 0,
		percentage: 0,
	});
	const [suite, setSuite] = useState<PRDSuiteOutput | null>(null);
	const [documents, setDocuments] = useState<GeneratedDocuments>({
		masterContext: '',
		agentPRDs: {},
		collaborationMap: '',
		setupGuide: '',
	});
	const [error, setError] = useState<string | null>(null);
	const [aiStatus, setAiStatus] = useState<string | null>(null);

	// Synthesize agent team from interview answers
	const synthesizeTeam = useCallback((answers: InterviewAnswers): AgentTeam => {
		// Collect all features from answers
		const features: string[] = [
			answers.productType || '',
			answers.coreSystems || '',
			answers.externalServices || '',
			answers.usesAI || '',
			answers.businessModel || '',
		];
		
		// Determine required agents
		const requiredAgents = determineRequiredAgents(features);
		
		// Create agent instances
		const agents: Agent[] = requiredAgents.map((def, index) => ({
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
	}, []);

	// Generate single PRD document
	const generateDocument = useCallback((doc: PRDDocument, answers: InterviewAnswers, team?: AgentTeam): string => {
		try {
			return doc.generate(answers, team);
		} catch (err) {
			console.error(`Error generating ${doc.filename}:`, err);
			return `# Error generating ${doc.title}\n\nAn error occurred while generating this document.`;
		}
	}, []);

	// Generate agent PRD
	const generateAgentPRD = useCallback((agent: Agent, answers: InterviewAnswers): string => {
		const agentDef = AGENT_CATALOG.find(a => a.type === agent.type);
		
		return `# ${answers.productName} – ${agent.name} PRD

**Version:** 1.0
**Status:** Authoritative · Build-Ready
**Agent:** ${agent.designation}
**Role:** ${agent.role}

---

## 1. Agent Identity

| Field | Value |
|-------|-------|
| **Agent Name** | ${agent.name} |
| **Designation** | ${agent.designation} |
| **Role** | ${agent.role} |
| **Type** | ${agent.type} |

---

## 2. Mission Statement

The ${agent.name} is responsible for ${agent.role.toLowerCase()} within ${answers.productName}.

---

## 3. Scope

### 3.1 In Scope

${(agentDef?.responsibilities || agent.responsibilities || []).map(r => `- ${r}`).join('\n')}

### 3.2 Out of Scope

${(agentDef?.outOfScope || []).map(o => `- ${o}`).join('\n') || '- Responsibilities assigned to other agents'}

---

## 4. Inputs

| Input | Source | Format |
|-------|--------|--------|
| PRD Suite | Documentation Agent | Markdown |
| Task assignments | Orchestrator Agent | JSON |
| Dependencies | Upstream agents | Artifacts |

---

## 5. Outputs

| Output | Destination | Format |
|--------|-------------|--------|
| Completion report | Orchestrator Agent | JSON |
| Artifacts | Downstream agents | Varies |
| Documentation | Documentation Agent | Markdown |

---

## 6. Dependencies

### 6.1 Depends On

${(agentDef?.dependsOn || []).map(d => `- ${d.charAt(0).toUpperCase() + d.slice(1)} Agent`).join('\n') || '- Orchestrator Agent (always)'}

### 6.2 Blocks

*Agents that depend on this agent's output*

---

## 7. Error Handling

| Scenario | Error Code | Behavior |
|----------|------------|----------|
| Input validation failure | \`INPUT_INVALID_FORMAT\` | Return to sender with details |
| Dependency not ready | \`PREREQ_MISSING\` | Wait for dependency |
| Task failure | \`SYS_UNKNOWN_ERROR\` | Report to Orchestrator |

---

## 8. Acceptance Criteria

- [ ] All assigned tasks completed
- [ ] All outputs validated
- [ ] No blocking issues remain
- [ ] Documentation updated
- [ ] Handoff to downstream agents confirmed

---

**END OF ${agent.name.toUpperCase()} PRD**
`;
	}, []);

	// Generate collaboration map
	const generateCollaborationMap = useCallback((team: AgentTeam, answers: InterviewAnswers): string => {
		return `# ${answers.productName} – Collaboration Map

**Version:** 1.0
**Status:** Authoritative
**Generated:** ${new Date().toISOString().split('T')[0]}

This document defines every inter-agent interaction in the ${answers.productName} build.

---

## How to Read This Document

Each \`INT-NNN\` block follows this structure:

\`\`\`
INTERACTION: INT-NNN
Agents Involved: [Agent A] → [Agent B]
Trigger: [Exact condition]
Payload: [Data format]
Confirmation: [Expected response]
Failure: [Error handling]
\`\`\`

---

## Interactions

${team.connections.map((conn, i) => {
	const fromAgent = team.agents.find(a => a.id === conn.from);
	const toAgent = team.agents.find(a => a.id === conn.to);
	
	return `### ${conn.interactionId} — ${fromAgent?.name || 'Unknown'} → ${toAgent?.name || 'Unknown'}

**Trigger:** ${fromAgent?.name} completes assigned phase

**Initiating Agent:** ${fromAgent?.name} (${fromAgent?.designation})

**Payload:**
\`\`\`json
{
  "interactionId": "${conn.interactionId}",
  "status": "COMPLETE | PARTIAL | FAILED",
  "outputs": [],
  "handoffReady": true
}
\`\`\`

**Receiving Agent Action:** ${toAgent?.name} receives handoff and begins assigned work.

**Confirmation:**
\`\`\`json
{
  "interactionId": "${conn.interactionId}",
  "ack": true,
  "status": "RECEIVED"
}
\`\`\`

**Failure Handling:** If \`status: FAILED\`, ${toAgent?.name} waits for retry from ${fromAgent?.name}.

---`;
}).join('\n\n')}

## Summary

| From | To | Interaction |
|------|----|-----------|
${team.connections.map(conn => {
	const fromAgent = team.agents.find(a => a.id === conn.from);
	const toAgent = team.agents.find(a => a.id === conn.to);
	return `| ${fromAgent?.designation || '?'} | ${toAgent?.designation || '?'} | ${conn.interactionId} |`;
}).join('\n')}

---

**END OF COLLABORATION MAP**
`;
	}, []);

	// Generate user setup guide
	const generateUserGuide = useCallback((team: AgentTeam, answers: InterviewAnswers): string => {
		return `# ${answers.productName} – User Setup & Execution Guide

**Version:** 1.0
**Status:** Authoritative
**Generated:** ${new Date().toISOString().split('T')[0]}

This guide tells you exactly how to use this PRD suite to build ${answers.productName}.

---

## 1. Before You Begin

### 1.1 What You Have

This PRD suite contains:
- **16 Base PRDs** — Complete product specifications
- **${team.agents.length} Agent PRDs** — One per team member
- **Collaboration Map** — Inter-agent interactions
- **This Guide** — Execution instructions

### 1.2 Prerequisites

- [ ] All base PRDs reviewed
- [ ] Agent team understood
- [ ] Development environment ready
- [ ] Necessary accounts created (see Technical Architecture PRD)

---

## 2. Execution Sequence

### Phase 0: Setup (Day 1)

1. Create necessary service accounts
2. Set up version control
3. Configure environment variables
4. Verify all PRDs are placeholder-free

### Phase 1: Foundation (Days 2-7)

1. **Activate Orchestrator Agent** — Coordinates all work
2. **Activate Database Agent** — Schema and migrations
3. **Activate Auth & Security Agent** — Authentication flows

### Phase 2: Core Build (Days 8-21)

${team.agents.filter(a => !['orchestrator', 'database', 'auth', 'qa'].includes(a.type)).map((agent, i) => 
	`${i + 4}. **Activate ${agent.name}** — ${agent.role}`
).join('\n')}

### Phase 3: Quality (Days 22-28)

1. **Activate QA Agent** — Run all tests
2. Fix any blocking issues
3. Verify PRD compliance

### Phase 4: Launch (Day 29+)

1. Deploy to production
2. Monitor for issues
3. Iterate based on feedback

---

## 3. How to Brief Each Agent

When activating an agent, provide:

1. **The Master PRD Index** — Navigation and precedence
2. **Their Agent PRD** — Specific responsibilities
3. **Relevant Base PRDs** — Domain knowledge
4. **Dependencies** — Outputs from prior agents

---

## 4. Agent Team Summary

| # | Agent | Designation | Role |
|---|-------|-------------|------|
${team.agents.map((agent, i) => 
	`| ${i + 1} | ${agent.name} | ${agent.designation} | ${agent.role} |`
).join('\n')}

---

## 5. Verification Protocol

After each agent completes:

1. Review their output artifacts
2. Verify PRD compliance
3. Run any applicable tests
4. Confirm handoff readiness
5. Log completion in changelog

---

## 6. When Problems Arise

- **PRD conflict** → Use precedence order (Safety > Core > Experience > Technical > Content)
- **Missing requirement** → Update the relevant PRD first, then re-brief agent
- **Agent stuck** → Check dependencies, provide missing context
- **Test failure** → Route to owning agent for fix

---

## 7. Launch Readiness Checklist

- [ ] All agents have completed
- [ ] All tests pass
- [ ] All PRD requirements met
- [ ] Security review complete
- [ ] Performance targets met
- [ ] Documentation complete
- [ ] Deployment verified

---

**END OF USER SETUP & EXECUTION GUIDE**
`;
	}, []);

	// Main generation function
	const generateSuite = useCallback(async (answers: InterviewAnswers): Promise<{ suite: PRDSuiteOutput; team: AgentTeam }> => {
		setIsGenerating(true);
		setError(null);
		
		try {
			// Phase 1: Synthesize team
			setProgress({
				phase: 'selecting_templates',
				currentDocument: 'Determining agent team...',
				completedDocuments: [],
				totalDocuments: 0,
				percentage: 5,
			});
			
			const team = synthesizeTeam(answers);
			await new Promise(r => setTimeout(r, 300));
			
			// Phase 2: Generate base PRDs
			const allDocs = getAllPRDDocuments();
			const totalDocs = allDocs.length + team.agents.length + 2; // +2 for collab map and guide
			
			setProgress({
				phase: 'generating_base',
				currentDocument: null,
				completedDocuments: [],
				totalDocuments: totalDocs,
				percentage: 10,
			});
			
			const baseDocuments: Record<string, string> = {};
			const completedDocs: string[] = [];
			
			for (let i = 0; i < allDocs.length; i++) {
				const doc = allDocs[i];
				
				setProgress(prev => ({
					...prev,
					currentDocument: doc.title,
					percentage: 10 + ((i / totalDocs) * 50),
				}));
				
				baseDocuments[doc.filename] = generateDocument(doc, answers, team);
				completedDocs.push(doc.filename);
				
				setProgress(prev => ({
					...prev,
					completedDocuments: [...completedDocs],
				}));
				
				await new Promise(r => setTimeout(r, 150));
			}
			
			// Phase 2.5: AI-enhance base PRDs (fills [USER-UNSPECIFIED] with real prose)
			setProgress(prev => ({
				...prev,
				phase: 'enhancing_with_ai',
				statusMessage: 'Enhancing PRDs with AI...',
				percentage: 60,
			}));

			const enhancementQueue = allDocs
				.filter(doc => baseDocuments[doc.filename])
				.map(doc => ({
					id: doc.filename,
					title: doc.title,
					content: baseDocuments[doc.filename],
					category: 'base' as const,
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
								percentage: 60 + ((done / total) * 5),
								statusMessage: `Enhancing ${done}/${total}`,
							}));
						},
					}
				);
				for (const [id, result] of enhancementResults.entries()) {
					if (result.enhanced) {
						baseDocuments[id] = result.content;
					}
				}
			} catch (aiErr) {
				console.warn('AI enhancement skipped (non-fatal):', aiErr);
			}

			// Phase 3: Generate agent PRDs
			setProgress(prev => ({
				...prev,
				phase: 'generating_agents',
			}));
			
			const agentDocuments: Record<string, string> = {};
			
			for (let i = 0; i < team.agents.length; i++) {
				const agent = team.agents[i];
				const filename = `${String(i).padStart(2, '0')}-${agent.type}-agent.md`;
				
				setProgress(prev => ({
					...prev,
					currentDocument: agent.name,
					percentage: 60 + ((i / team.agents.length) * 20),
				}));
				
				agentDocuments[filename] = generateAgentPRD(agent, answers);
				completedDocs.push(filename);
				
				setProgress(prev => ({
					...prev,
					completedDocuments: [...completedDocs],
				}));
				
				await new Promise(r => setTimeout(r, 100));
			}
			
			// Phase 4: Generate collaboration map
			setProgress(prev => ({
				...prev,
				phase: 'generating_collab',
				currentDocument: 'Collaboration Map',
				percentage: 85,
			}));
			
			const collaborationMap = generateCollaborationMap(team, answers);
			await new Promise(r => setTimeout(r, 200));
			
			// Phase 5: Generate user guide
			setProgress(prev => ({
				...prev,
				currentDocument: 'User Guide',
				percentage: 90,
			}));
			
			const userGuide = generateUserGuide(team, answers);
			await new Promise(r => setTimeout(r, 200));
			
			// Phase 6: Validate
			setProgress(prev => ({
				...prev,
				phase: 'validating',
				currentDocument: 'Running validation...',
				percentage: 95,
			}));
			
			// Check for placeholders
			let placeholderCount = 0;
			const allContent = [
				...Object.values(baseDocuments),
				...Object.values(agentDocuments),
				collaborationMap,
				userGuide,
			].join('');
			
			const placeholderMatches = allContent.match(/\[USER-UNSPECIFIED\]/g);
			placeholderCount = placeholderMatches?.length || 0;
			
			await new Promise(r => setTimeout(r, 300));
			
			// Build final suite
			const finalSuite: PRDSuiteOutput = {
				baseDocuments,
				agentDocuments,
				collaborationMap,
				masterIndex: baseDocuments['14-master-prd-index.md'] || '',
				userGuide,
				audit: {
					placeholderCount,
					allChecksPassed: placeholderCount === 0,
					generatedAt: new Date().toISOString(),
				},
			};
			
			setSuite(finalSuite);
			setDocuments(convertToLegacyFormat(finalSuite, team));
			
			setProgress({
				phase: 'complete',
				currentDocument: null,
				completedDocuments: completedDocs,
				totalDocuments: totalDocs,
				percentage: 100,
			});
			
			return { suite: finalSuite, team };
			
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Generation failed';
			setError(errorMessage);
			setProgress(prev => ({
				...prev,
				phase: 'failed',
			}));
			throw err;
		} finally {
			setIsGenerating(false);
		}
	}, [synthesizeTeam, generateDocument, generateAgentPRD, generateCollaborationMap, generateUserGuide]);

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
