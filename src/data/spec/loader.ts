// src/data/spec/loader.ts
//
// Reads canonical spec artifacts from the AppArchitect-Foundation workspace
// at build time via Vite's `?raw` imports. The spec is bridged into
// src/data/spec/ by scripts/sync-spec.sh — Foundation remains the source of
// truth; this file is the read-side wiring.
//
// Schemas are JSON, so they are imported directly. Markdown files use Vite's
// `?raw` query suffix which returns the file contents as a string at build
// time. This file is consumed by Vite — do not import it from Node/tsx.

import projectSchema from "./02-schemas/01-project-schema.json";
import architectureObject from "./02-schemas/02-architecture-object.json";
import feature from "./02-schemas/03-feature.json";
import workflow from "./02-schemas/04-workflow.json";
import screen from "./02-schemas/05-screen.json";
import persona from "./02-schemas/06-persona.json";
import integration from "./02-schemas/07-integration.json";
import aiFeature from "./02-schemas/08-ai-feature.json";
import validationResult from "./02-schemas/09-validation-result.json";
import exportManifest from "./02-schemas/10-export-manifest.json";

import orchestratorAgent from "./03-agents/00-orchestrator-agent-spec.md?raw";
import documentationAgent from "./03-agents/01-documentation-agent-spec.md?raw";
import frontendAgent from "./03-agents/02-frontend-agent-spec.md?raw";
import backendAgent from "./03-agents/03-backend-agent-spec.md?raw";
import databaseAgent from "./03-agents/04-database-agent-spec.md?raw";
import authSecurityAgent from "./03-agents/05-auth-security-agent-spec.md?raw";
import aiIntegrationAgent from "./03-agents/06-ai-integration-agent-spec.md?raw";
import devopsAgent from "./03-agents/07-devops-agent-spec.md?raw";
import qaAgent from "./03-agents/08-qa-agent-spec.md?raw";
import experienceAgent from "./03-agents/09-experience-agent-spec.md?raw";
import dataIntegrationAgent from "./03-agents/10-data-integration-agent-spec.md?raw";
import contentDesignAgent from "./03-agents/11-content-design-agent-spec.md?raw";
import orchestrationAgent from "./03-agents/12-orchestration-agent-spec.md?raw";
import launchMarketingAgent from "./03-agents/13-launch-marketing-agent-spec.md?raw";
import socialMediaAgent from "./03-agents/14-social-media-agent-spec.md?raw";
import promotionAnalyticsAgent from "./03-agents/15-promotion-analytics-agent-spec.md?raw";
import landingPageBuilderAgent from "./03-agents/16-landing-page-builder-agent-spec.md?raw";

import v2AgentTemplate from "./04-templates/PRD Suite v2 – Agent PRD Template.md.md?raw";
import v2Analytics from "./04-templates/PRD Suite v2 – Analytics PRD.md.md?raw";
import v2BuildHandoff from "./04-templates/PRD Suite v2 – Build Handoff.md.md?raw";
import v2Changelog from "./04-templates/PRD Suite v2 – Changelog & Decision Log.md.md?raw";
import v2CodebaseAudit from "./04-templates/PRD Suite v2 – Codebase Audit Prompt.md.md?raw";
import v2ContentCopy from "./04-templates/PRD Suite v2 – Content & Copy PRD.md.md?raw";
import v2CoreSystems from "./04-templates/PRD Suite v2 – Core Systems PRD.md.md?raw";
import v2DataIntegration from "./04-templates/PRD Suite v2 – Data & Integration PRD.md.md?raw";
import v2DesignSystem from "./04-templates/PRD Suite v2 – Design System & Component Reference.md.md?raw";
import v2EnvSecrets from "./04-templates/PRD Suite v2 – Environment & Secrets Reference.md.md?raw";
import v2ErrorState from "./04-templates/PRD Suite v2 – Error & State Reference.md.md?raw";
import v2Experience from "./04-templates/PRD Suite v2 – Experience & Access PRD.md.md?raw";
import v2LaunchStrategy from "./04-templates/PRD Suite v2 – Launch Strategy PRD.md.md?raw";
import v2MasterIndex from "./04-templates/PRD Suite v2 – Master PRD Index.md.md?raw";
import v2Migrations from "./04-templates/PRD Suite v2 – Migrations & Seed Data Reference.md.md?raw";
import v2Monetization from "./04-templates/PRD Suite v2 – Monetization PRD.md.md?raw";
import v2ProjectBrief from "./04-templates/PRD Suite v2 – Project Brief.md.md?raw";
import v2RequirementsSummary from "./04-templates/PRD Suite v2 – Requirements Summary.md.md?raw";
import v2RlmPrinciples from "./04-templates/PRD Suite v2 – RLM Principles Addendum.md.md?raw";
import v2RlmWrapper from "./04-templates/PRD Suite v2 – RLM Wrapper Template.md.md?raw";
import v2RolesPerms from "./04-templates/PRD Suite v2 – Roles & Permissions Matrix.md.md?raw";
import v2SafetyPrivacy from "./04-templates/PRD Suite v2 – Safety, Privacy & Control PRD.md.md?raw";
import v2Security from "./04-templates/PRD Suite v2 – Security PRD.md.md?raw";
import v2TechArch from "./04-templates/PRD Suite v2 – Technical Architecture PRD.md.md?raw";
import v2TestPlan from "./04-templates/PRD Suite v2 – Test Plan PRD.md.md?raw";
import v2UserInstructions from "./04-templates/PRD Suite v2 – User Instructions.md.md?raw";
import v2UserPersonas from "./04-templates/PRD Suite v2 – User Personas.md.md?raw";
import v2UxPrd from "./04-templates/PRD Suite v2 – UX PRD.md.md?raw";

// Governance
import gov01 from "./01-governance/01-master-project-schema.md?raw";
import gov02 from "./01-governance/02-document-dependency-matrix.md?raw";
import gov03 from "./01-governance/03-generation-rules.md?raw";
import gov04 from "./01-governance/04-validation-rules.md?raw";
import gov05 from "./01-governance/05-agent-orchestration-map.md?raw";
import gov06 from "./01-governance/06-master-generation-pipeline.md?raw";
import gov07 from "./01-governance/07-project-intake-schema-map.md?raw";
import gov08 from "./01-governance/08-document-cross-reference-map.md?raw";
import gov09 from "./01-governance/09-document-generation-order.md?raw";
import gov10 from "./01-governance/10-system-glossary.md?raw";
import gov11 from "./01-governance/11-master-prompt-framework.md?raw";
import gov12 from "./01-governance/12-agent-contract-spec.md?raw";
import gov13 from "./01-governance/13-validation-engine-spec.md?raw";
import gov14 from "./01-governance/14-export-engine-spec.md?raw";
import gov15 from "./01-governance/15-project-lifecycle-model.md?raw";

// Operational Standards
import op01 from "./05-operational-standards/01-operating-principles.md?raw";
import op02 from "./05-operational-standards/02-agent-execution-standard.md?raw";
import op03 from "./05-operational-standards/03-document-quality-standard.md?raw";
import op04 from "./05-operational-standards/04-validation-standard.md?raw";
import op05 from "./05-operational-standards/05-conflict-resolution-standard.md?raw";
import op06 from "./05-operational-standards/06-versioning-standard.md?raw";
import op07 from "./05-operational-standards/07-artifact-management-standard.md?raw";
import op08 from "./05-operational-standards/08-security-standard.md?raw";
import op09 from "./05-operational-standards/09-observability-standard.md?raw";
import op10 from "./05-operational-standards/10-failure-recovery-standard.md?raw";
import op11 from "./05-operational-standards/11-human-review-standard.md?raw";
import op12 from "./05-operational-standards/12-release-standard.md?raw";
import op13 from "./05-operational-standards/13-change-management-standard.md?raw";
import op14 from "./05-operational-standards/14-continuous-learning-standard.md?raw";
import op15 from "./05-operational-standards/15-master-operational-runbook.md?raw";

// Workflows (Root)
import wfArch from "./06-workflows/architecture.md?raw";
import wfBiz from "./06-workflows/business.md?raw";
import wfDisc from "./06-workflows/discovery.md?raw";
import wfImpl from "./06-workflows/implementation.md?raw";
import wfLaunch from "./06-workflows/launch.md?raw";
import wfProd from "./06-workflows/product.md?raw";

// Template Workflows
import twfArch01 from "./04-templates/workflows/architecture/architecture-object.md?raw";
import twfArch02 from "./04-templates/workflows/architecture/integration-spec.md?raw";
import twfArch03 from "./04-templates/workflows/architecture/tech-decision-record.md?raw";
import twfBiz01 from "./04-templates/workflows/business/financial-model.md?raw";
import twfBiz02 from "./04-templates/workflows/business/launch-checklist.md?raw";
import twfBiz03 from "./04-templates/workflows/business/pricing-model.md?raw";
import twfDisc01 from "./04-templates/workflows/discovery/clarification-log.md?raw";
import twfDisc02 from "./04-templates/workflows/discovery/discovery-report.md?raw";
import twfDisc03 from "./04-templates/workflows/discovery/intake-brief.md?raw";
import twfImpl01 from "./04-templates/workflows/implementation/component-spec.md?raw";
import twfImpl02 from "./04-templates/workflows/implementation/implementation-plan.md?raw";
import twfImpl03 from "./04-templates/workflows/implementation/test-plan-spec.md?raw";
import twfLaunch01 from "./04-templates/workflows/launch/launch-plan.md?raw";
import twfLaunch02 from "./04-templates/workflows/launch/marketing-plan.md?raw";
import twfLaunch03 from "./04-templates/workflows/launch/post-launch-review.md?raw";
import twfProd01 from "./04-templates/workflows/product/feature-spec.md?raw";
import twfProd02 from "./04-templates/workflows/product/user-story.md?raw";
import twfProd03 from "./04-templates/workflows/product/ux-flow-spec.md?raw";

// Prompt Contracts
import pc01 from "./07-prompt-contracts/01-master-orchestrator-prompt.md?raw";
import pc02 from "./07-prompt-contracts/02-validation-engine-prompt.md?raw";
import pc03 from "./07-prompt-contracts/03-architecture-agent-prompt.md?raw";
import pc04 from "./07-prompt-contracts/04-workflow-agent-prompt.md?raw";
import pc05 from "./07-prompt-contracts/05-ux-agent-prompt.md?raw";
import pc06 from "./07-prompt-contracts/06-prd-agent-prompt.md?raw";
import pc07 from "./07-prompt-contracts/07-technical-spec-agent-prompt.md?raw";
import pc08 from "./07-prompt-contracts/08-export-agent-prompt.md?raw";
import pc09 from "./07-prompt-contracts/09-discovery-agent-prompt.md?raw";
import pc10 from "./07-prompt-contracts/10-schema-agent-prompt.md?raw";
import pc11 from "./07-prompt-contracts/11-human-review-interface-prompt.md?raw";

// Validation
import val01 from "./08-validation/01-prd-validator.md?raw";
import val02 from "./08-validation/02-schema-validator.md?raw";
import val03 from "./08-validation/03-cross-document-validator.md?raw";
import val04 from "./08-validation/04-consistency-validator.md?raw";
import val05 from "./08-validation/05-completeness-validator.md?raw";
import val06 from "./08-validation/06-dependency-validator.md?raw";
import val07 from "./08-validation/07-production-readiness-validator.md?raw";

// ---------------------------------------------------------------------------
// Aggregated re-exports
// ---------------------------------------------------------------------------

export const schemas = [
  { name: "01-project-schema", data: projectSchema },
  { name: "02-architecture-object", data: architectureObject },
  { name: "03-feature", data: feature },
  { name: "04-workflow", data: workflow },
  { name: "05-screen", data: screen },
  { name: "06-persona", data: persona },
  { name: "07-integration", data: integration },
  { name: "08-ai-feature", data: aiFeature },
  { name: "09-validation-result", data: validationResult },
  { name: "10-export-manifest", data: exportManifest },
] as const;

export const agents = [
  { id: "00-orchestrator", name: "Orchestrator", content: orchestratorAgent },
  { id: "01-documentation", name: "Documentation", content: documentationAgent },
  { id: "02-frontend", name: "Frontend", content: frontendAgent },
  { id: "03-backend", name: "Backend", content: backendAgent },
  { id: "04-database", name: "Database", content: databaseAgent },
  { id: "05-auth-security", name: "Auth & Security", content: authSecurityAgent },
  { id: "06-ai-integration", name: "AI Integration", content: aiIntegrationAgent },
  { id: "07-devops", name: "DevOps", content: devopsAgent },
  { id: "08-qa", name: "QA", content: qaAgent },
  { id: "09-experience", name: "Experience", content: experienceAgent },
  { id: "10-data-integration", name: "Data Integration", content: dataIntegrationAgent },
  { id: "11-content-design", name: "Content & Design", content: contentDesignAgent },
  { id: "12-orchestration", name: "Orchestration", content: orchestrationAgent },
  { id: "13-launch-marketing", name: "Launch & Marketing", content: launchMarketingAgent },
  { id: "14-social-media", name: "Social Media", content: socialMediaAgent },
  { id: "15-promotion-analytics", name: "Promotion & Analytics", content: promotionAnalyticsAgent },
  { id: "16-landing-page-builder", name: "Landing Page Builder", content: landingPageBuilderAgent },
] as const;

export const v2Templates = [
  { key: "agent", name: "Agent PRD Template", content: v2AgentTemplate },
  { key: "analytics", name: "Analytics PRD", content: v2Analytics },
  { key: "buildHandoff", name: "Build Handoff", content: v2BuildHandoff },
  { key: "changelog", name: "Changelog & Decision Log", content: v2Changelog },
  { key: "codebaseAudit", name: "Codebase Audit Prompt", content: v2CodebaseAudit },
  { key: "contentCopy", name: "Content & Copy PRD", content: v2ContentCopy },
  { key: "coreSystems", name: "Core Systems PRD", content: v2CoreSystems },
  { key: "dataIntegration", name: "Data & Integration PRD", content: v2DataIntegration },
  { key: "designSystem", name: "Design System & Component Reference", content: v2DesignSystem },
  { key: "envSecrets", name: "Environment & Secrets Reference", content: v2EnvSecrets },
  { key: "errorState", name: "Error & State Reference", content: v2ErrorState },
  { key: "experience", name: "Experience & Access PRD", content: v2Experience },
  { key: "launchStrategy", name: "Launch Strategy PRD", content: v2LaunchStrategy },
  { key: "masterIndex", name: "Master PRD Index", content: v2MasterIndex },
  { key: "migrations", name: "Migrations & Seed Data Reference", content: v2Migrations },
  { key: "monetization", name: "Monetization PRD", content: v2Monetization },
  { key: "projectBrief", name: "Project Brief", content: v2ProjectBrief },
  { key: "requirementsSummary", name: "Requirements Summary", content: v2RequirementsSummary },
  { key: "rlmPrinciples", name: "RLM Principles Addendum", content: v2RlmPrinciples },
  { key: "rlmWrapper", name: "RLM Wrapper Template", content: v2RlmWrapper },
  { key: "rolesPerms", name: "Roles & Permissions Matrix", content: v2RolesPerms },
  { key: "safetyPrivacy", name: "Safety, Privacy & Control PRD", content: v2SafetyPrivacy },
  { key: "security", name: "Security PRD", content: v2Security },
  { key: "techArch", name: "Technical Architecture PRD", content: v2TechArch },
  { key: "testPlan", name: "Test Plan PRD", content: v2TestPlan },
  { key: "userInstructions", name: "User Instructions", content: v2UserInstructions },
  { key: "userPersonas", name: "User Personas", content: v2UserPersonas },
  { key: "uxPrd", name: "UX PRD", content: v2UxPrd },
] as const;

export const governance = [
  { id: "gov01", name: "Master Project Schema", content: gov01 },
  { id: "gov02", name: "Document Dependency Matrix", content: gov02 },
  { id: "gov03", name: "Generation Rules", content: gov03 },
  { id: "gov04", name: "Validation Rules", content: gov04 },
  { id: "gov05", name: "Agent Orchestration Map", content: gov05 },
  { id: "gov06", name: "Master Generation Pipeline", content: gov06 },
  { id: "gov07", name: "Project Intake Schema Map", content: gov07 },
  { id: "gov08", name: "Document Cross-Reference Map", content: gov08 },
  { id: "gov09", name: "Document Generation Order", content: gov09 },
  { id: "gov10", name: "System Glossary", content: gov10 },
  { id: "gov11", name: "Master Prompt Framework", content: gov11 },
  { id: "gov12", name: "Agent Contract Spec", content: gov12 },
  { id: "gov13", name: "Validation Engine Spec", content: gov13 },
  { id: "gov14", name: "Export Engine Spec", content: gov14 },
  { id: "gov15", name: "Project Lifecycle Model", content: gov15 },
] as const;

export const operationalStandards = [
  { id: "op01", name: "Operating Principles", content: op01 },
  { id: "op02", name: "Agent Execution Standard", content: op02 },
  { id: "op03", name: "Document Quality Standard", content: op03 },
  { id: "op04", name: "Validation Standard", content: op04 },
  { id: "op05", name: "Conflict Resolution Standard", content: op05 },
  { id: "op06", name: "Versioning Standard", content: op06 },
  { id: "op07", name: "Artifact Management Standard", content: op07 },
  { id: "op08", name: "Security Standard", content: op08 },
  { id: "op09", name: "Observability Standard", content: op09 },
  { id: "op10", name: "Failure Recovery Standard", content: op10 },
  { id: "op11", name: "Human Review Standard", content: op11 },
  { id: "op12", name: "Release Standard", content: op12 },
  { id: "op13", name: "Change Management Standard", content: op13 },
  { id: "op14", name: "Continuous Learning Standard", content: op14 },
  { id: "op15", name: "Master Operational Runbook", content: op15 },
] as const;

export const workflows = [
  { id: "arch", name: "Architecture Workflow", content: wfArch },
  { id: "biz", name: "Business Workflow", content: wfBiz },
  { id: "disc", name: "Discovery Workflow", content: wfDisc },
  { id: "impl", name: "Implementation Workflow", content: wfImpl },
  { id: "launch", name: "Launch Workflow", content: wfLaunch },
  { id: "prod", name: "Product Workflow", content: wfProd },
] as const;

export const templateWorkflows = [
  { id: "twf-arch-obj", category: "architecture", name: "Architecture Object", content: twfArch01 },
  { id: "twf-arch-int", category: "architecture", name: "Integration Spec", content: twfArch02 },
  { id: "twf-arch-tdr", category: "architecture", name: "Tech Decision Record", content: twfArch03 },
  { id: "twf-biz-fin", category: "business", name: "Financial Model", content: twfBiz01 },
  { id: "twf-biz-chk", category: "business", name: "Launch Checklist", content: twfBiz02 },
  { id: "twf-biz-prc", category: "business", name: "Pricing Model", content: twfBiz03 },
  { id: "twf-disc-log", category: "discovery", name: "Clarification Log", content: twfDisc01 },
  { id: "twf-disc-rep", category: "discovery", name: "Discovery Report", content: twfDisc02 },
  { id: "twf-disc-brf", category: "discovery", name: "Intake Brief", content: twfDisc03 },
  { id: "twf-impl-cmp", category: "implementation", name: "Component Spec", content: twfImpl01 },
  { id: "twf-impl-pln", category: "implementation", name: "Implementation Plan", content: twfImpl02 },
  { id: "twf-impl-tst", category: "implementation", name: "Test Plan Spec", content: twfImpl03 },
  { id: "twf-launch-pln", category: "launch", name: "Launch Plan", content: twfLaunch01 },
  { id: "twf-launch-mkt", category: "launch", name: "Marketing Plan", content: twfLaunch02 },
  { id: "twf-launch-rev", category: "launch", name: "Post-Launch Review", content: twfLaunch03 },
  { id: "twf-prod-ftr", category: "product", name: "Feature Spec", content: twfProd01 },
  { id: "twf-prod-usr", category: "product", name: "User Story", content: twfProd02 },
  { id: "twf-prod-uxf", category: "product", name: "UX Flow Spec", content: twfProd03 },
] as const;

export const promptContracts = [
  { id: "pc01", name: "Master Orchestrator Prompt", content: pc01 },
  { id: "pc02", name: "Validation Engine Prompt", content: pc02 },
  { id: "pc03", name: "Architecture Agent Prompt", content: pc03 },
  { id: "pc04", name: "Workflow Agent Prompt", content: pc04 },
  { id: "pc05", name: "UX Agent Prompt", content: pc05 },
  { id: "pc06", name: "PRD Agent Prompt", content: pc06 },
  { id: "pc07", name: "Technical Spec Agent Prompt", content: pc07 },
  { id: "pc08", name: "Export Agent Prompt", content: pc08 },
  { id: "pc09", name: "Discovery Agent Prompt", content: pc09 },
  { id: "pc10", name: "Schema Agent Prompt", content: pc10 },
  { id: "pc11", name: "Human Review Interface Prompt", content: pc11 },
] as const;

export const validationSpecs = [
  { id: "val01", name: "PRD Validator", content: val01 },
  { id: "val02", name: "Schema Validator", content: val02 },
  { id: "val03", name: "Cross-Document Validator", content: val03 },
  { id: "val04", name: "Consistency Validator", content: val04 },
  { id: "val05", name: "Completeness Validator", content: val05 },
  { id: "val06", name: "Dependency Validator", content: val06 },
  { id: "val07", name: "Production Readiness Validator", content: val07 },
] as const;

export type SchemaKey = (typeof schemas)[number]["name"];
export type AgentKey = (typeof agents)[number]["id"];
export type V2TemplateKey = (typeof v2Templates)[number]["key"];
export type GovernanceKey = (typeof governance)[number]["id"];
export type OperationalStandardKey = (typeof operationalStandards)[number]["id"];
export type WorkflowKey = (typeof workflows)[number]["id"];
export type TemplateWorkflowKey = (typeof templateWorkflows)[number]["id"];
export type PromptContractKey = (typeof promptContracts)[number]["id"];
export type ValidationSpecKey = (typeof validationSpecs)[number]["id"];
