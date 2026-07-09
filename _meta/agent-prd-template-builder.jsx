import { useState, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg0: "#080808", bg1: "#0F0F0F", bg2: "#161616",
  border: "rgba(255,255,255,0.07)",
  textPrimary: "#E8E4DC",
  textSecondary: "rgba(232,228,220,0.5)",
  textMuted: "rgba(232,228,220,0.25)",
  mono: "'IBM Plex Mono', monospace",
  serif: "'Libre Baskerville', serif",
};

const TIERS = [
  { id: "core",       label: "Core Pipeline",       count: 8  },
  { id: "specialist", label: "Specialist",           count: 6  },
  { id: "growth",     label: "Growth & Marketing",   count: 2  },
  { id: "infra",      label: "Infrastructure",       count: 2  },
  { id: "meta",       label: "Meta / Orchestration", count: 1  },
];

// ─── SHARED SECTION BUILDERS ──────────────────────────────────────────────────
const mkProjectSchema = () => ({
  id: "project_schema",
  heading: "00 · Project Schema",
  badge: "SHARED",
  fields: [
    { key: "project_name",          label: "Project Name",            type: "text",     ph: "e.g. BOND, AppArchitect, ROOTSTOCK" },
    { key: "project_tagline",       label: "Tagline / One-liner",     type: "text",     ph: "e.g. The science-backed relationship wellness app for couples" },
    { key: "project_vision",        label: "Vision Statement",        type: "area",     ph: "What does the world look like if this product succeeds at scale?" },
    { key: "target_platform",       label: "Target Platform(s)",      type: "text",     ph: "e.g. iOS · Android · Web · Desktop · API-only" },
    { key: "primary_audience",      label: "Primary Audience",        type: "area",     ph: "Who are the core users? Demographics, psychographics, context of use." },
    { key: "secondary_audience",    label: "Secondary Audience",      type: "area",     ph: "Adjacent or future audience segments." },
    { key: "core_problem",          label: "Core Problem Solved",     type: "area",     ph: "The specific pain, friction, or gap this product addresses." },
    { key: "key_differentiators",   label: "Key Differentiators",     type: "list",     ph: "What makes this product distinct?\ne.g. Science-backed methodology\nPrivacy-first architecture\nAgent-generated personalization" },
    { key: "tech_stack",            label: "Tech Stack",              type: "text",     ph: "e.g. React Native · Expo · Supabase · TypeScript · Edge Functions" },
    { key: "monetization_model",    label: "Monetization Model",      type: "text",     ph: "e.g. Freemium SaaS / One-time purchase / B2B licensing" },
    { key: "launch_phase",          label: "Current Phase",           type: "select",   ph: "", opts: ["Ideation","Pre-PRD","Architecture","Build","Beta","Launch","Growth","Scale"] },
    { key: "success_metrics",       label: "North Star Metrics",      type: "list",     ph: "e.g. DAU/MAU ratio\nRetention D7/D30\nMRR\nNPS score" },
    { key: "hard_constraints",      label: "Hard Constraints",        type: "list",     ph: "e.g. GDPR compliance required\nOffline-first required\nMax $X/month infra budget" },
    { key: "org_name",              label: "Organization / Team",     type: "text",     ph: "e.g. SENET / AppArchitect Core / Solo" },
    { key: "orchestration_platform",label: "Orchestration Platform",  type: "text",     ph: "e.g. Zo Computer / LangGraph / Custom" },
  ]
});

const mkIdentity = (name) => ({
  id: "agent_identity",
  heading: "01 · Agent Identity",
  fields: [
    { key: "agent_name",          label: "Agent Name",            type: "text",  ph: `e.g. ${name}-Prime` },
    { key: "version",             label: "Version",               type: "text",  ph: "e.g. v1.0.0" },
    { key: "model_target",        label: "Target Model",          type: "text",  ph: "e.g. claude-sonnet-4-6" },
    { key: "owner",               label: "Owner / Maintainer",    type: "text",  ph: "e.g. AppArchitect Core Team" },
    { key: "activation_trigger",  label: "Activation Trigger",    type: "area",  ph: "Under what conditions is this agent invoked?" },
    { key: "role_limits",         label: "Role Limits (RLM)",     type: "area",  ph: "What is this agent explicitly NOT allowed to do?" },
    { key: "mission_statement",   label: "Mission Statement",     type: "area",  ph: "One sentence: this agent's singular purpose and measure of success." },
  ]
});

const mkHandoffs = () => ({
  id: "handoffs",
  heading: "06 · Handoffs & Contracts",
  badge: "SHARED",
  fields: [
    { key: "receives_from",         label: "Receives From",             type: "list",  ph: "Upstream agents that pass context or artifacts to this one" },
    { key: "input_schema",          label: "Input Schema / Payload",    type: "area",  ph: "Structured input this agent expects (JSON schema, markdown spec, etc.)" },
    { key: "passes_to",             label: "Passes To",                 type: "list",  ph: "Downstream agents that consume this agent's output" },
    { key: "output_schema",         label: "Output Schema / Payload",   type: "area",  ph: "Structured output this agent emits" },
    { key: "blocking_dependencies", label: "Blocking Dependencies",     type: "list",  ph: "What must be complete before this agent can run?" },
    { key: "parallel_safe",         label: "Parallel-Safe?",            type: "text",  ph: "Can this run in parallel with others? Which? Why not?" },
  ]
});

const mkEval = () => ({
  id: "eval_criteria",
  heading: "07 · Evaluation & Testing",
  badge: "SHARED",
  fields: [
    { key: "primary_metric",         label: "Primary Success Metric",    type: "area",  ph: "How is this agent's output quality measured?" },
    { key: "completeness_metric",    label: "Completeness Metric",       type: "area",  ph: "What constitutes a complete, non-partial response?" },
    { key: "latency_target",         label: "Latency Target",            type: "text",  ph: "e.g. < 45s for standard input" },
    { key: "failure_modes",          label: "Known Failure Modes",       type: "list",  ph: "Most common ways this agent fails or degrades" },
    { key: "test_cases",             label: "Canonical Test Cases",      type: "list",  ph: "3–5 representative inputs for the eval harness" },
    { key: "human_review_threshold", label: "Human Review Threshold",    type: "area",  ph: "When must a human validate before proceeding?" },
  ]
});

// ─── ALL CANONICAL AGENTS ────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "strategist", tier: "core", label: "Strategist", icon: "◈", color: "#C8A96E",
    tagline: "Vision → Architecture",
    desc: "Transforms raw app ideas into product strategy, scope definition, prioritized feature sets, and agent-team blueprints. First agent in every pipeline.",
    sections: [
      mkProjectSchema(), mkIdentity("Strategist"),
      { id: "purpose", heading: "02 · Strategic Mandate", fields: [
        { key: "primary_mandate",       label: "Primary Mandate",           type: "area",  ph: "What canonical artifact does this agent exist to produce?" },
        { key: "strategic_frameworks",  label: "Frameworks Applied",        type: "list",  ph: "e.g. Jobs-to-be-Done\nRICE prioritization\nKano model\nBlue Ocean" },
        { key: "scope_definition",      label: "Scope Definition Method",   type: "area",  ph: "How does this agent draw the product boundary? What's in v1 vs. later?" },
        { key: "prioritization_logic",  label: "Prioritization Logic",      type: "area",  ph: "How does it decide what matters most?" },
      ]},
      { id: "io", heading: "03 · Inputs & Outputs", fields: [
        { key: "required_inputs",   label: "Required Inputs",   type: "list", ph: "e.g. Raw app idea\nTarget audience\nPlatform preference" },
        { key: "optional_inputs",   label: "Optional Inputs",   type: "list", ph: "e.g. Competitor references\nExisting codebase\nInvestor brief" },
        { key: "primary_output",    label: "Primary Output",    type: "area", ph: "e.g. Product Strategy Doc + Agent Team Blueprint JSON" },
        { key: "secondary_outputs", label: "Secondary Outputs", type: "list", ph: "e.g. Risk register\nDeferred features list\nScope warnings" },
      ]},
      { id: "reasoning", heading: "04 · Reasoning & Decision Logic", fields: [
        { key: "thinking_framework",    label: "Thinking Framework",        type: "area",  ph: "What mental model guides this agent's reasoning?" },
        { key: "decomposition_method",  label: "Decomposition Method",      type: "area",  ph: "How does it break an idea into actionable parts?" },
        { key: "disambiguation_rules",  label: "Disambiguation Rules",      type: "list",  ph: "e.g. Ask max 3 clarifying questions before proceeding" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",          label: "Scope Limits",              type: "list",  ph: "What is explicitly OUT OF SCOPE for this agent?" },
        { key: "anti_patterns",         label: "Anti-Patterns to Avoid",    type: "list",  ph: "e.g. Over-scoping v1\nBuilding before validating\nIgnoring platform constraints" },
        { key: "escalation_conditions", label: "Escalation Conditions",     type: "list",  ph: "When must this agent halt and request human input?" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "architect", tier: "core", label: "Architect", icon: "⬡", color: "#7EB8E8",
    tagline: "Structure → Systems",
    desc: "Designs technical architecture, data models, API contracts, service topology, and infrastructure selection. Converts strategy into buildable system design.",
    sections: [
      mkProjectSchema(), mkIdentity("Architect"),
      { id: "tech_scope", heading: "02 · Technical Scope", fields: [
        { key: "architecture_domains",  label: "Architecture Domains",      type: "list",  ph: "e.g. Frontend app shell\nBackend API\nDatabase schema\nAuth\nFile storage\nEdge functions\nThird-party integrations" },
        { key: "stack_constraints",     label: "Stack Constraints",         type: "area",  ph: "What is fixed vs. flexible in the tech stack?" },
        { key: "non_functional_reqs",   label: "Non-Functional Requirements",type: "list", ph: "e.g. <200ms P95\nOffline support\nHIPAA compliance\nMulti-tenancy" },
        { key: "scalability_targets",   label: "Scalability Targets",       type: "area",  ph: "Traffic / data scale at launch vs. 12 months" },
      ]},
      { id: "artifacts", heading: "03 · Design Artifacts Produced", fields: [
        { key: "system_diagram",    label: "System Diagram Spec",       type: "area",  ph: "Component topology format and required elements" },
        { key: "data_model",        label: "Data Model Output Format",  type: "area",  ph: "e.g. Supabase SQL migrations + ERD + RLS policy stubs" },
        { key: "api_contract",      label: "API Contract Format",       type: "area",  ph: "e.g. OpenAPI 3.0 YAML with route stubs, auth requirements, response shapes" },
        { key: "infra_spec",        label: "Infrastructure Spec",       type: "area",  ph: "e.g. Vercel + Supabase + Edge Functions + CDN topology" },
        { key: "auth_design",       label: "Auth & Permissions Design", type: "area",  ph: "Auth strategy, role definitions, RLS approach, session management" },
        { key: "integration_map",   label: "Integration Map",           type: "list",  ph: "All third-party services and how they connect" },
      ]},
      { id: "decision_logic", heading: "04 · Architectural Decision Logic", fields: [
        { key: "pattern_library",   label: "Preferred Patterns",        type: "list",  ph: "e.g. Repository pattern\nEvent-driven updates\nOptimistic UI\nEdge-first API" },
        { key: "tradeoff_framework",label: "Tradeoff Framework",        type: "area",  ph: "How does this agent reason about build vs. buy, monolith vs. microservice?" },
        { key: "red_flags",         label: "Architectural Red Flags",   type: "list",  ph: "e.g. N+1 query patterns\nClient-side secret exposure\nUnindexed FKs" },
        { key: "adr_format",        label: "ADR Format",                type: "area",  ph: "How are architecture decisions documented with context, options, and rationale?" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",              type: "list",  ph: "What is this agent NOT responsible for?" },
        { key: "review_triggers",   label: "Human Review Triggers",     type: "list",  ph: "When must a human architect validate before proceeding?" },
        { key: "version_pins",      label: "Version / Dependency Pins", type: "area",  ph: "Locked versions, deprecated APIs to avoid" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "brand_director", tier: "core", label: "Brand Director", icon: "◉", color: "#E87E9A",
    tagline: "Identity → Expression",
    desc: "Generates complete brand identity systems: naming, visual language, voice and tone, design tokens, and brand governance rules.",
    sections: [
      mkProjectSchema(), mkIdentity("BrandDirector"),
      { id: "brand_outputs", heading: "02 · Brand Deliverable Scope", fields: [
        { key: "naming_deliverables",   label: "Naming Deliverables",       type: "list",  ph: "e.g. Product name\nTagline options\nDomain candidates\nAgent name system\nFeature naming conventions" },
        { key: "visual_deliverables",   label: "Visual Identity Deliverables",type: "list", ph: "e.g. Color palette (hex + semantic tokens)\nTypography stack\nIcon concept\nLogo direction brief\nMotion principles" },
        { key: "voice_deliverables",    label: "Voice & Tone Deliverables", type: "list",  ph: "e.g. Brand personality\nWriting principles\nDo/Don't examples\nSample UI copy\nError message tone" },
        { key: "design_tokens",         label: "Design Token Output Format",type: "area",  ph: "e.g. JSON tokens: colors (semantic + primitive), spacing, radius, shadow, motion" },
        { key: "brand_guidelines",      label: "Brand Guidelines Format",   type: "area",  ph: "How is the full brand guide structured and delivered?" },
      ]},
      { id: "creative_reasoning", heading: "03 · Creative Reasoning Framework", fields: [
        { key: "brand_archetypes",      label: "Brand Archetype System",    type: "area",  ph: "e.g. Jung 12 archetypes applied to product positioning. Which anchors this brand?" },
        { key: "emotional_brief",       label: "Emotional Brief Method",    type: "area",  ph: "How does this agent extract emotional direction from a product concept?" },
        { key: "aesthetic_mapping",     label: "Aesthetic Mapping Process", type: "area",  ph: "How do market position, audience, and function map to visual direction?" },
        { key: "naming_methods",        label: "Naming Methods Library",    type: "list",  ph: "e.g. Portmanteau\nMythological reference\nAbstract invented word\nDescriptive compound\nAcronym" },
        { key: "differentiation",       label: "Competitive Differentiation",type: "area", ph: "How does this agent ensure the brand doesn't visually blend into its category?" },
      ]},
      { id: "coherence", heading: "04 · Brand Coherence Rules", fields: [
        { key: "cross_artifact",    label: "Cross-Artifact Consistency",    type: "area",  ph: "How does this agent ensure name, visual, and voice form a unified system?" },
        { key: "anti_patterns",     label: "Brand Anti-Patterns to Refuse", type: "list",  ph: "e.g. Generic tech-blue palettes\nStartup naming clichés (-ify, -ly)\nDissonant tone/visual combos" },
        { key: "evolution_rules",   label: "Brand Evolution Rules",         type: "area",  ph: "How should the brand system evolve as the product scales? What must stay constant?" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "trademark_check",   label: "Trademark / IP Check Protocol", type: "area",  ph: "What process before finalizing names or visual marks?" },
        { key: "accessibility",     label: "Accessibility Standards",       type: "list",  ph: "e.g. WCAG AA contrast minimum\nNo color-only information encoding" },
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT produce? (e.g. final logo files, brand photography)" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "ux_designer", tier: "core", label: "UX Designer", icon: "▣", color: "#8BE8A4",
    tagline: "Flow → Interface",
    desc: "Produces user journey maps, screen inventories, wireframe specs, component system blueprints, and interaction pattern libraries.",
    sections: [
      mkProjectSchema(), mkIdentity("UXDesigner"),
      { id: "ux_deliverables", heading: "02 · UX Deliverable Scope", fields: [
        { key: "platform_focus",      label: "Platform Focus",                type: "text",  ph: "e.g. Mobile-first iOS+Android / Responsive Web / Native Desktop" },
        { key: "user_journey_format", label: "User Journey Map Format",       type: "area",  ph: "Stages, touchpoints, emotions, friction points, opportunities" },
        { key: "screen_inventory",    label: "Screen Inventory Format",       type: "area",  ph: "Fields per screen: Name, Route, Entry Points, Primary Actions, Exit Points, Components, Empty State, Error State" },
        { key: "wireframe_spec",      label: "Wireframe Spec Format",         type: "area",  ph: "Fidelity level, annotation style, layout notation" },
        { key: "component_system",    label: "Component System Blueprint",    type: "area",  ph: "How reusable components are catalogued: props, states, variants, usage rules" },
        { key: "interaction_patterns",label: "Interaction Pattern Library",   type: "list",  ph: "e.g. Navigation: tab bar / drawer / stack\nForm: inline validation / multi-step\nFeedback: toasts / modals\nEmpty states\nLoading states" },
      ]},
      { id: "ux_reasoning", heading: "03 · UX Reasoning Framework", fields: [
        { key: "user_research",       label: "User Research / Persona Method",type: "area",  ph: "How does this agent construct personas, mental models, and JTBD maps?" },
        { key: "flow_principles",     label: "Flow Design Principles",        type: "list",  ph: "e.g. Reduce cognitive load\nProgressive disclosure\nError prevention over recovery\nMobile thumb-zone priority" },
        { key: "ia_method",           label: "Information Architecture Method",type: "area", ph: "How is content hierarchy and navigation structure determined?" },
        { key: "accessibility",       label: "Accessibility Standard",        type: "area",  ph: "e.g. WCAG 2.1 AA as floor. Specific considerations for target audience." },
        { key: "design_system",       label: "Design System Alignment",       type: "area",  ph: "How does UX output align to brand design tokens and component library?" },
      ]},
      { id: "constraints", heading: "04 · Constraints & Guard Rails", fields: [
        { key: "platform_guidelines", label: "Platform Guidelines",           type: "list",  ph: "e.g. iOS HIG compliance\nMaterial Design 3\nCustom design system rules" },
        { key: "anti_patterns",       label: "UX Anti-Patterns to Flag",      type: "list",  ph: "e.g. Dark patterns\nDestructive actions without confirmation\nUnlabeled icon-only nav\nForced account creation before value" },
        { key: "scope_limits",        label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT produce? (e.g. high-fidelity mockups, final assets)" },
      ]},
      { id: "research", heading: "05 · Research Integration", fields: [
        { key: "heuristics",          label: "Usability Heuristics Applied",  type: "list",  ph: "Which Nielsen heuristics or custom rules does this agent evaluate against?" },
        { key: "feedback_protocol",   label: "Feedback Incorporation Protocol",type: "area", ph: "How does this agent incorporate user research, testing results, or stakeholder feedback?" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "engineer_frontend", tier: "core", label: "Engineer · Frontend", icon: "⬢", color: "#A08EE8",
    tagline: "Component → Screen",
    desc: "Generates production-ready frontend code: components, screens, navigation, state management, and UI logic. Platform-aware for React, React Native, or web.",
    sections: [
      mkProjectSchema(), mkIdentity("Engineer-FE"),
      { id: "code_scope", heading: "02 · Frontend Code Scope", fields: [
        { key: "framework",         label: "Framework / Runtime",           type: "text",  ph: "e.g. React Native + Expo / Next.js / React + Vite" },
        { key: "language",          label: "Language & Version",            type: "text",  ph: "e.g. TypeScript 5.x strict mode" },
        { key: "file_types",        label: "File Types Produced",           type: "list",  ph: "e.g. .tsx screens\n.tsx reusable components\n.ts hooks\n.ts utilities\n.ts type definitions\nnavigation config\ntheme/token files" },
        { key: "state_management",  label: "State Management Approach",     type: "area",  ph: "e.g. Zustand for global / React Query for server state / Context for auth" },
        { key: "styling_approach",  label: "Styling Approach",              type: "area",  ph: "e.g. NativeWind / Tailwind CSS / styled-components + design tokens" },
      ]},
      { id: "impl_rules", heading: "03 · Implementation Rules", fields: [
        { key: "component_arch",    label: "Component Architecture Rules",  type: "list",  ph: "e.g. Atomic design hierarchy\nSingle responsibility\nProps typed with TS interfaces\nMemo only when measured" },
        { key: "code_style",        label: "Code Style & Conventions",      type: "area",  ph: "Naming conventions, file structure, import ordering, comment density" },
        { key: "performance",       label: "Performance Targets",           type: "list",  ph: "e.g. No unrelated re-renders\nVirtualize lists >20 items\nLazy load images\nBundle size budget" },
        { key: "error_handling",    label: "Error Handling Standard",       type: "area",  ph: "Error boundaries, loading states, empty states — how each must be handled" },
        { key: "test_requirements", label: "Test Output Requirements",      type: "area",  ph: "Unit tests? Component tests? Co-location rules? Coverage minimum?" },
      ]},
      { id: "deps", heading: "04 · Dependency & Security Policy", fields: [
        { key: "dep_policy",        label: "Dependency Addition Policy",    type: "area",  ph: "When can new packages be added? What approval is required?" },
        { key: "security_rules",    label: "Frontend Security Rules",       type: "list",  ph: "e.g. Never expose API keys in client bundle\nSanitize user input before render\nCSP headers\nNo eval()" },
        { key: "approved_packages", label: "Pre-Approved Package List",     type: "list",  ph: "Packages already approved for this project" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT generate? (e.g. backend logic, DB migrations)" },
        { key: "anti_patterns",     label: "Code Anti-Patterns to Refuse",  type: "list",  ph: "e.g. useEffect for derived state\nProp drilling >2 levels\nany type usage\nInline styles in production" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "engineer_backend", tier: "core", label: "Engineer · Backend", icon: "⬡", color: "#6EC8E0",
    tagline: "Contract → API",
    desc: "Implements API routes, server logic, database access, background jobs, webhooks, and service integrations from architectural specs.",
    sections: [
      mkProjectSchema(), mkIdentity("Engineer-BE"),
      { id: "code_scope", heading: "02 · Backend Code Scope", fields: [
        { key: "runtime",           label: "Runtime / Framework",           type: "text",  ph: "e.g. Supabase Edge Functions / Node.js + Hono / Next.js API routes / Cloudflare Workers" },
        { key: "language",          label: "Language & Version",            type: "text",  ph: "e.g. TypeScript 5.x / Python 3.11" },
        { key: "file_types",        label: "File Types Produced",           type: "list",  ph: "e.g. API route handlers\nDB query functions\nBackground job handlers\nWebhook receivers\nMiddleware\nSQL migrations" },
        { key: "api_style",         label: "API Style",                     type: "text",  ph: "e.g. REST / GraphQL / tRPC / RPC-over-HTTP" },
        { key: "db_access",         label: "Database Access Pattern",       type: "area",  ph: "e.g. Supabase JS client with RLS / Prisma ORM / Raw SQL / Drizzle" },
      ]},
      { id: "impl_rules", heading: "03 · Implementation Rules", fields: [
        { key: "auth_impl",         label: "Auth Implementation Rules",     type: "area",  ph: "How are authenticated routes protected? Token validation, session handling, RLS enforcement." },
        { key: "error_handling",    label: "Error Handling Standard",       type: "area",  ph: "Error types, HTTP status conventions, logging format, client-facing error shape" },
        { key: "validation",        label: "Input Validation Rules",        type: "area",  ph: "Schema validation library, required validation points, rejection behavior" },
        { key: "security_rules",    label: "Backend Security Rules",        type: "list",  ph: "e.g. All inputs validated before DB write\nParameterized queries only\nSecrets via env vars\nRate limiting on public endpoints\nRLS at DB layer" },
        { key: "performance",       label: "Performance Targets",           type: "list",  ph: "e.g. P95 < 200ms\nNo N+1 queries\nPagination on list endpoints\nBackground jobs for ops >500ms" },
      ]},
      { id: "integrations", heading: "04 · Integration Rules", fields: [
        { key: "integration_patterns",label: "Integration Patterns",        type: "list",  ph: "e.g. Webhook-first for payment events\nPolling fallback for legacy APIs\nIdempotency keys for payment calls" },
        { key: "secret_management", label: "Secret Management",             type: "area",  ph: "How are API keys, secrets, and credentials managed and accessed?" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT handle? (e.g. frontend, infra provisioning, DB schema design)" },
        { key: "anti_patterns",     label: "Code Anti-Patterns to Refuse",  type: "list",  ph: "e.g. Business logic in route handlers\nUnvalidated input to DB\nHardcoded credentials\nSync long-running ops in request handlers" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "db_engineer", tier: "core", label: "DB Engineer", icon: "▦", color: "#E8C56E",
    tagline: "Model → Storage",
    desc: "Designs and implements database schemas, migration files, indexing strategies, RLS policies, seed data, and query optimization plans.",
    sections: [
      mkProjectSchema(), mkIdentity("DBEngineer"),
      { id: "db_scope", heading: "02 · Database Scope", fields: [
        { key: "db_platform",       label: "Database Platform",             type: "text",  ph: "e.g. Supabase (PostgreSQL 15) / PlanetScale / MongoDB / SQLite" },
        { key: "schema_domains",    label: "Schema Domains",                type: "list",  ph: "e.g. User & auth\nContent tables\nRelationship/junction tables\nAudit/log tables\nConfig tables\nBilling tables" },
        { key: "migration_format",  label: "Migration File Format",         type: "area",  ph: "SQL migration format, naming convention, rollback strategy" },
        { key: "rls_approach",      label: "RLS Approach",                  type: "area",  ph: "Policy design principles, role definitions, naming conventions" },
      ]},
      { id: "schema_rules", heading: "03 · Schema Design Rules", fields: [
        { key: "naming_conventions",label: "Naming Conventions",            type: "list",  ph: "e.g. snake_case\nPlural table names\nUUID PKs\ncreated_at + updated_at on all tables\nSoft deletes via deleted_at" },
        { key: "indexing_strategy", label: "Indexing Strategy",             type: "area",  ph: "What indexes are always required? What query patterns need custom indexes?" },
        { key: "relationship_patterns",label:"Relationship Patterns",       type: "list",  ph: "e.g. FK constraints required\nCascade delete rules\nJunction table conventions for M:N" },
        { key: "data_types",        label: "Data Type Standards",           type: "list",  ph: "e.g. UUIDs for all PKs/FKs\nTimestamptz for timestamps\nJSONB for flexible metadata\nEnum types for status fields" },
      ]},
      { id: "performance", heading: "04 · Performance & Optimization", fields: [
        { key: "query_optimization",label: "Query Optimization Rules",      type: "list",  ph: "e.g. EXPLAIN ANALYZE for queries on tables >10k rows\nNo SELECT * in production\nIndex all FKs" },
        { key: "backup_requirements",label:"Backup & Recovery Requirements",type: "area",  ph: "Backup frequency, retention policy, RTO target" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT handle?" },
        { key: "anti_patterns",     label: "Schema Anti-Patterns to Flag",  type: "list",  ph: "e.g. EAV anti-pattern\nUnnormalized data without justification\nMissing FK constraints\nStoring passwords in plaintext" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "qa_agent", tier: "core", label: "QA Agent", icon: "◎", color: "#E8906E",
    tagline: "Output → Validation",
    desc: "Reviews agent outputs, code, and specs for correctness, completeness, cross-agent consistency, and requirement traceability.",
    sections: [
      mkProjectSchema(), mkIdentity("QA-Sentinel"),
      { id: "review_scope", heading: "02 · Review Scope", fields: [
        { key: "artifacts_reviewed",label: "Artifacts Reviewed",            type: "list",  ph: "e.g. Agent PRD completeness\nArchitecture spec\nGenerated frontend code\nGenerated backend code\nDB schema\nBrand coherence\nUX spec coverage" },
        { key: "review_dimensions", label: "Review Dimensions",             type: "list",  ph: "e.g. Completeness\nInternal consistency\nCross-agent alignment\nRequirement traceability\nEdge case coverage\nSecurity posture" },
        { key: "severity_scale",    label: "Severity Scale",                type: "area",  ph: "CRITICAL: Blocks all downstream. MAJOR: Blocks specific handoff. MINOR: Reduces quality. ADVISORY: Suggestion." },
      ]},
      { id: "methods", heading: "03 · Review Methods", fields: [
        { key: "checklist_approach",label: "Checklist Approach",            type: "area",  ph: "Separate review checklists per artifact type. How are they structured?" },
        { key: "cross_ref_logic",   label: "Cross-Agent Consistency Logic", type: "area",  ph: "How does this agent detect inconsistencies across multiple agent outputs?" },
        { key: "regression_checks", label: "Regression Check Protocol",     type: "list",  ph: "What does the agent re-verify after changes are made?" },
        { key: "automated_checks",  label: "Automatable Checks",            type: "list",  ph: "Which checks can run programmatically vs. require model reasoning?" },
      ]},
      { id: "output_format", heading: "04 · Review Output Format", fields: [
        { key: "report_structure",  label: "QA Report Structure",           type: "area",  ph: "e.g. Executive summary → Pass/Fail verdict → Issues by severity → Required remediations → Advisory notes" },
        { key: "pass_fail_criteria",label: "Pass / Fail Criteria",          type: "area",  ph: "What constitutes PASS? What automatically triggers FAIL and blocks downstream?" },
        { key: "remediation_format",label: "Remediation Feedback Format",   type: "area",  ph: "How does this agent communicate required fixes to the responsible agent?" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT evaluate?" },
        { key: "anti_patterns",     label: "Review Anti-Patterns to Avoid", type: "list",  ph: "e.g. Style preferences disguised as correctness issues\nBlocker inflation\nReviewing beyond scope" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },

  // ── SPECIALIST ─────────────────────────────────────────────────────────────
  {
    id: "doc_writer", tier: "specialist", label: "Doc Writer", icon: "≡", color: "#B8D4A8",
    tagline: "System → Documentation",
    desc: "Produces developer docs, API references, user guides, onboarding flows, changelogs, and READMEs from agent-generated system artifacts.",
    sections: [
      mkProjectSchema(), mkIdentity("DocWriter"),
      { id: "doc_deliverables", heading: "02 · Documentation Scope", fields: [
        { key: "doc_types",         label: "Document Types Produced",       type: "list",  ph: "e.g. README.md\nDeveloper quickstart\nAPI endpoint reference\nData model reference\nUser onboarding guide\nFeature changelog\nAgent team overview\nDeployment runbook" },
        { key: "audience_matrix",   label: "Audience Matrix",               type: "area",  ph: "How does this agent adapt writing for: Developers / End users / Stakeholders / New team members?" },
        { key: "format_standards",  label: "Format Standards",              type: "area",  ph: "Markdown conventions, heading hierarchy, code block language tags, diagram rules, frontmatter format" },
      ]},
      { id: "writing_rules", heading: "03 · Writing Rules", fields: [
        { key: "voice_guidelines",  label: "Voice & Tone Guidelines",       type: "area",  ph: "Formality level, active vs. passive preference, sentence length targets, brand voice alignment" },
        { key: "completeness_rules",label: "Completeness Rules per Doc Type",type: "list", ph: "e.g. Every function: description + params + return + example\nEvery endpoint: method + path + auth + request + response + error codes" },
        { key: "example_requirements",label:"Code Example Requirements",    type: "area",  ph: "When are examples required? What format (runnable snippets, curl, etc.)?" },
        { key: "anti_patterns",     label: "Documentation Anti-Patterns",   type: "list",  ph: "e.g. Jargon without definition\nCircular explanations\nStale code samples\nMissing error docs\nWall-of-text with no headers" },
      ]},
      { id: "source_handling", heading: "04 · Source Artifact Handling", fields: [
        { key: "source_artifacts",  label: "Source Artifacts Transformed",  type: "list",  ph: "Which agent outputs become documentation source material?" },
        { key: "sync_rules",        label: "Sync / Staleness Protocol",     type: "area",  ph: "How does this agent handle documentation that may drift from implementation?" },
        { key: "versioning",        label: "Documentation Versioning",      type: "area",  ph: "How are doc versions managed alongside product versions?" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT produce?" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "data_analyst", tier: "specialist", label: "Data Analyst", icon: "◫", color: "#D4A8E0",
    tagline: "Events → Insight",
    desc: "Designs analytics schemas, event taxonomies, funnel definitions, and reporting dashboards. Connects product behavior to business metrics.",
    sections: [
      mkProjectSchema(), mkIdentity("DataAnalyst"),
      { id: "analytics_scope", heading: "02 · Analytics Scope", fields: [
        { key: "analytics_platform",label: "Analytics Platform(s)",         type: "list",  ph: "e.g. PostHog / Mixpanel / Amplitude / Segment / GA4" },
        { key: "event_taxonomy",    label: "Event Taxonomy Design",         type: "area",  ph: "Naming conventions, required properties, event hierarchy (screen views → actions → outcomes)" },
        { key: "core_funnels",      label: "Core Funnels to Track",         type: "list",  ph: "e.g. Acquisition\nActivation\nFeature adoption\nRetention\nMonetization" },
        { key: "north_star_metrics",label: "North Star Metrics",            type: "list",  ph: "The 3–5 metrics that define product success and how they're calculated" },
        { key: "dashboard_specs",   label: "Dashboard Specifications",      type: "list",  ph: "What dashboards must be built? Who is the audience for each?" },
      ]},
      { id: "data_design", heading: "03 · Data Design", fields: [
        { key: "data_warehouse",    label: "Data Warehouse / BI Layer",     type: "text",  ph: "e.g. Supabase tables + PostHog / BigQuery + Looker / Metabase" },
        { key: "retention_policy",  label: "Data Retention Policy",         type: "area",  ph: "How long is raw event data retained? What's aggregated vs. kept raw?" },
        { key: "privacy_rules",     label: "Analytics Privacy Rules",       type: "list",  ph: "e.g. No PII in event properties\nConsent-gated tracking\nIP anonymization\nGDPR deletion propagation" },
      ]},
      { id: "constraints", heading: "04 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT do?" },
        { key: "anti_patterns",     label: "Analytics Anti-Patterns",       type: "list",  ph: "e.g. Tracking without consent\nOverfitted schemas (track everything)\nMetrics that can be gamed\nVanity metrics" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "payments_agent", tier: "specialist", label: "Payments Agent", icon: "⬙", color: "#A8E0C8",
    tagline: "Model → Revenue",
    desc: "Designs and implements monetization flows: pricing models, Stripe integration, subscription lifecycle, billing UX, and revenue recovery.",
    sections: [
      mkProjectSchema(), mkIdentity("PaymentsAgent"),
      { id: "monetization_scope", heading: "02 · Monetization Scope", fields: [
        { key: "payment_platform",  label: "Payment Platform",              type: "text",  ph: "e.g. Stripe / RevenueCat / Paddle / Lemon Squeezy" },
        { key: "pricing_model",     label: "Pricing Model Design",          type: "area",  ph: "Free tier limits, paid tier features, pricing page structure, trial strategy" },
        { key: "subscription_tiers",label: "Subscription Tier Definitions", type: "list",  ph: "Name, price, features, limits, target segment for each tier" },
        { key: "billing_flows",     label: "Billing Flows Required",        type: "list",  ph: "e.g. New subscription\nUpgrade / downgrade\nTrial-to-paid\nCancellation\nPayment failure / dunning\nRefund\nPlan reactivation" },
      ]},
      { id: "implementation", heading: "03 · Implementation Scope", fields: [
        { key: "webhook_events",    label: "Webhook Events Handled",        type: "list",  ph: "e.g. checkout.session.completed\ncustomer.subscription.updated\ninvoice.payment_failed\ncustomer.subscription.deleted" },
        { key: "db_schema",         label: "Billing DB Schema",             type: "area",  ph: "Tables required: subscriptions, customers, invoices, payment_methods, etc." },
        { key: "entitlement_system",label: "Entitlement System Design",     type: "area",  ph: "How are paid features gated? How is subscription status checked at runtime?" },
        { key: "revenue_recovery",  label: "Revenue Recovery / Dunning",    type: "area",  ph: "Failed payment retry strategy, dunning email sequence, grace period definition" },
      ]},
      { id: "compliance", heading: "04 · Compliance & Security", fields: [
        { key: "pci_compliance",    label: "PCI Compliance Approach",       type: "area",  ph: "How is PCI scope minimized? (e.g. Stripe Elements, no raw card data)" },
        { key: "tax_handling",      label: "Tax Handling",                  type: "area",  ph: "Tax calculation approach, jurisdiction handling, invoice requirements" },
        { key: "refund_policy",     label: "Refund Policy Implementation",  type: "area",  ph: "How is the refund policy encoded in the system?" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT handle?" },
        { key: "anti_patterns",     label: "Payments Anti-Patterns",        type: "list",  ph: "e.g. Storing raw card data\nNo idempotency keys\nMissing webhook signature verification" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "auth_agent", tier: "specialist", label: "Auth Agent", icon: "◈", color: "#E8D06E",
    tagline: "Identity → Access",
    desc: "Designs and implements authentication systems, authorization rules, session management, OAuth providers, and identity verification flows.",
    sections: [
      mkProjectSchema(), mkIdentity("AuthAgent"),
      { id: "auth_scope", heading: "02 · Auth Scope", fields: [
        { key: "auth_platform",     label: "Auth Platform",                 type: "text",  ph: "e.g. Supabase Auth / Auth.js / Clerk / Firebase Auth / Custom JWT" },
        { key: "auth_methods",      label: "Auth Methods Required",         type: "list",  ph: "e.g. Email + password\nMagic link\nGoogle OAuth\nApple Sign In\nPhone OTP\nPasskeys\nSSO / SAML" },
        { key: "role_system",       label: "Role & Permission System",      type: "area",  ph: "Role definitions, permission hierarchy, how roles map to DB RLS policies" },
        { key: "session_design",    label: "Session Management Design",     type: "area",  ph: "Token type, expiry, refresh strategy, revocation mechanism" },
      ]},
      { id: "security_design", heading: "03 · Security Design", fields: [
        { key: "threat_model",      label: "Threat Model",                  type: "list",  ph: "e.g. Account takeover\nCredential stuffing\nSession hijacking\nPrivilege escalation" },
        { key: "security_controls", label: "Security Controls Required",    type: "list",  ph: "e.g. Rate limiting on auth endpoints\nBreached password detection\nMFA for admin roles\nAccount lockout policy\nAuth event audit log" },
        { key: "mfa_design",        label: "MFA Design",                    type: "area",  ph: "Required for which roles? Methods supported? Backup codes?" },
      ]},
      { id: "constraints", heading: "04 · Constraints & Guard Rails", fields: [
        { key: "compliance",        label: "Compliance Requirements",       type: "list",  ph: "e.g. GDPR right to erasure\nCCPA\nHIPAA PHI access controls\nSOC 2 audit trail" },
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT handle?" },
        { key: "anti_patterns",     label: "Auth Anti-Patterns to Refuse",  type: "list",  ph: "e.g. Rolling your own crypto\nPasswords without bcrypt/argon2\nJWT in localStorage\nNo CSRF protection\nNo token revocation" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "notification_agent", tier: "specialist", label: "Notification Agent", icon: "◌", color: "#E8A86E",
    tagline: "Events → Engagement",
    desc: "Designs notification systems: push, email, SMS, and in-app alerts. Handles scheduling, delivery logic, preference management, and opt-out compliance.",
    sections: [
      mkProjectSchema(), mkIdentity("NotificationAgent"),
      { id: "notification_scope", heading: "02 · Notification Scope", fields: [
        { key: "channels",          label: "Channels Required",             type: "list",  ph: "e.g. Push (iOS+Android via Expo)\nEmail (transactional + marketing)\nSMS\nIn-app notification center\nSlack integration" },
        { key: "notification_types",label: "Notification Types Catalogue",  type: "list",  ph: "e.g. Transactional (account events)\nEngagement (feature prompts)\nMarketing (campaigns)\nSystem (maintenance)\nReal-time (activity feed)" },
        { key: "delivery_platform", label: "Delivery Platform(s)",          type: "list",  ph: "e.g. Expo Push / Resend / SendGrid / Twilio / OneSignal" },
        { key: "scheduling_logic",  label: "Scheduling Logic",              type: "area",  ph: "Time-zone awareness, quiet hours, frequency caps, batching rules" },
      ]},
      { id: "preference_system", heading: "03 · Preference & Compliance System", fields: [
        { key: "preference_ui",     label: "Notification Preference UI",    type: "area",  ph: "What controls do users have? Granularity (per-type, per-channel, schedule)?" },
        { key: "opt_out_compliance",label: "Opt-Out Compliance",            type: "list",  ph: "e.g. CAN-SPAM one-click unsubscribe\nGDPR consent tracking\nSMS STOP keyword\nGlobal unsubscribe" },
        { key: "delivery_tracking", label: "Delivery Tracking Requirements",type: "area",  ph: "Open rates, click rates, delivery confirmation, bounce handling" },
      ]},
      { id: "constraints", heading: "04 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT handle?" },
        { key: "anti_patterns",     label: "Notification Anti-Patterns",    type: "list",  ph: "e.g. No frequency cap\nMarketing emails without unsubscribe\nPush without permission request UX\nNo quiet hours" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "ai_feature_agent", tier: "specialist", label: "AI Feature Agent", icon: "◍", color: "#C8A8E8",
    tagline: "Capability → Intelligence",
    desc: "Designs and implements AI-powered features: LLM integrations, prompt systems, RAG pipelines, embeddings, and AI UX patterns.",
    sections: [
      mkProjectSchema(), mkIdentity("AIFeatureAgent"),
      { id: "ai_scope", heading: "02 · AI Feature Scope", fields: [
        { key: "ai_features",       label: "AI Features to Implement",      type: "list",  ph: "e.g. Natural language chat\nContent generation\nSemantic search\nPersonalization engine\nClassification / tagging\nSummarization\nRecommendation system" },
        { key: "model_selection",   label: "Model Selection",               type: "list",  ph: "Model per feature, reasoning for selection, fallback model" },
        { key: "rag_design",        label: "RAG Pipeline Design",           type: "area",  ph: "Document ingestion, chunking strategy, embedding model, vector store, retrieval logic" },
        { key: "prompt_system",     label: "Prompt System Architecture",    type: "area",  ph: "System prompt structure, template variables, few-shot approach, prompt versioning" },
      ]},
      { id: "ai_ux", heading: "03 · AI UX Patterns", fields: [
        { key: "streaming",         label: "Streaming / Progressive Rendering",type: "area",ph: "How is streaming output handled? Loading states, partial render behavior." },
        { key: "error_ux",          label: "AI Error UX",                   type: "area",  ph: "How are model errors, timeouts, and refusals presented to users?" },
        { key: "feedback_loop",     label: "User Feedback Loop",            type: "area",  ph: "How do users signal good/bad AI output? How is feedback used?" },
        { key: "transparency",      label: "AI Transparency Design",        type: "area",  ph: "How is AI involvement disclosed? Confidence indicators? Source attribution?" },
      ]},
      { id: "safety_eval", heading: "04 · Safety & Evaluation", fields: [
        { key: "content_safety",    label: "Content Safety Rules",          type: "list",  ph: "e.g. Output filtering requirements\nContent moderation layer\nTopics that must be refused" },
        { key: "eval_approach",     label: "AI Output Evaluation Approach", type: "area",  ph: "How is AI feature quality measured? Evals, human review, automated scoring?" },
        { key: "cost_management",   label: "Token Cost Management",         type: "list",  ph: "e.g. Per-user token budgets\nCaching for repeated prompts\nContext window management" },
      ]},
      { id: "constraints", heading: "05 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What AI capabilities are OUT OF SCOPE?" },
        { key: "anti_patterns",     label: "AI Anti-Patterns to Flag",      type: "list",  ph: "e.g. Unvalidated AI output in critical flows\nNo fallback for model unavailability\nPrompt injection surface" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },

  // ── GROWTH ─────────────────────────────────────────────────────────────────
  {
    id: "growth_agent", tier: "growth", label: "Growth Agent", icon: "⬈", color: "#A8E8D0",
    tagline: "Users → Loops",
    desc: "Designs acquisition channels, activation sequences, retention mechanisms, referral systems, and growth experiment frameworks.",
    sections: [
      mkProjectSchema(), mkIdentity("GrowthAgent"),
      { id: "growth_scope", heading: "02 · Growth Scope", fields: [
        { key: "growth_model",          label: "Growth Model",              type: "text",  ph: "e.g. Viral / Paid / SEO / Product-led / Community-led" },
        { key: "acquisition_channels",  label: "Acquisition Channels",     type: "list",  ph: "e.g. Organic social\nPaid social\nContent / SEO\nApp Store Optimization\nReferral\nPartnerships\nPR" },
        { key: "activation_design",     label: "Activation Design",        type: "area",  ph: "What is the AHA moment? How does onboarding lead users to it?" },
        { key: "retention_mechanics",   label: "Retention Mechanics",      type: "list",  ph: "e.g. Habit loops\nProgress / streaks\nSocial accountability\nPersonalized content\nEmail re-engagement" },
        { key: "referral_system",       label: "Referral System Design",   type: "area",  ph: "Referral mechanics, incentive structure, tracking, attribution" },
        { key: "experiment_framework",  label: "Growth Experiment Framework",type: "area", ph: "How are growth experiments designed, run, and evaluated?" },
      ]},
      { id: "content_strategy", heading: "03 · Content & Launch Strategy", fields: [
        { key: "content_pillars",   label: "Content Pillars",              type: "list",  ph: "Core content themes aligned to audience and product value" },
        { key: "launch_strategy",   label: "Launch Strategy",              type: "area",  ph: "Pre-launch, launch day, and post-launch growth strategy" },
        { key: "aso_strategy",      label: "App Store Optimization",       type: "area",  ph: "Title, subtitle, keywords, screenshots, preview video strategy (if mobile)" },
      ]},
      { id: "constraints", heading: "04 · Constraints & Guard Rails", fields: [
        { key: "budget",            label: "Growth Budget",                type: "text",  ph: "e.g. $0 bootstrapped / $X/month paid budget" },
        { key: "scope_limits",      label: "Scope Limits",                 type: "list",  ph: "What does this agent NOT handle?" },
        { key: "anti_patterns",     label: "Growth Anti-Patterns",         type: "list",  ph: "e.g. Growth hacks that damage retention\nSpammy referral mechanics\nMisleading app store listings\nAcquisition before activation" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "content_agent", tier: "growth", label: "Content Agent", icon: "≋", color: "#E8D4A8",
    tagline: "Strategy → Copy",
    desc: "Generates marketing copy, social content, email campaigns, blog posts, ad creative briefs, and product messaging across all channels.",
    sections: [
      mkProjectSchema(), mkIdentity("ContentAgent"),
      { id: "content_scope", heading: "02 · Content Scope", fields: [
        { key: "content_types",     label: "Content Types Produced",        type: "list",  ph: "e.g. Social media posts (TikTok, Instagram, X)\nEmail campaigns\nBlog/SEO articles\nAd creative briefs\nApp Store copy\nPress releases\nProduct Hunt launch\nOnboarding email sequences" },
        { key: "approval_required", label: "Approval Required Before Posting",type: "area",ph: "Which content types require human approval? What is the review process?" },
        { key: "posting_cadence",   label: "Posting Cadence Targets",       type: "list",  ph: "Frequency targets per channel" },
      ]},
      { id: "brand_voice", heading: "03 · Brand Voice & Messaging", fields: [
        { key: "voice_guidelines",  label: "Voice Guidelines",              type: "area",  ph: "Tone, register, vocabulary rules, what to avoid" },
        { key: "messaging_matrix",  label: "Messaging Matrix",              type: "area",  ph: "Core value props mapped to audience segments and channels" },
        { key: "content_pillars",   label: "Content Pillars",               type: "list",  ph: "Core themes all content must connect to" },
      ]},
      { id: "constraints", heading: "04 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT produce?" },
        { key: "compliance_rules",  label: "Compliance Rules",              type: "list",  ph: "e.g. No unsubstantiated health claims\nFTC disclosure requirements\nPlatform ad policy compliance" },
        { key: "anti_patterns",     label: "Content Anti-Patterns",         type: "list",  ph: "e.g. Clickbait headlines\nEngagement bait\nOff-brand tone\nUnsourced statistics" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },

  // ── INFRA ──────────────────────────────────────────────────────────────────
  {
    id: "devops_agent", tier: "infra", label: "DevOps Agent", icon: "⟳", color: "#A8C8E8",
    tagline: "Code → Deployed",
    desc: "Designs CI/CD pipelines, environment configurations, deployment strategies, infrastructure-as-code, and release management processes.",
    sections: [
      mkProjectSchema(), mkIdentity("DevOpsAgent"),
      { id: "infra_scope", heading: "02 · Infrastructure Scope", fields: [
        { key: "hosting_platform",  label: "Hosting Platform(s)",           type: "list",  ph: "e.g. Vercel / Cloudflare Workers / Railway / AWS / Supabase" },
        { key: "env_strategy",      label: "Environment Strategy",          type: "area",  ph: "Local / Development / Staging / Production — how each is configured and what it mirrors" },
        { key: "cicd_platform",     label: "CI/CD Platform",                type: "text",  ph: "e.g. GitHub Actions / Vercel Deploy / CircleCI" },
        { key: "iac_approach",      label: "Infrastructure-as-Code",        type: "area",  ph: "Terraform, Pulumi, Cloudflare Workers config, or platform-native config management" },
      ]},
      { id: "pipeline", heading: "03 · Pipeline Design", fields: [
        { key: "pipeline_stages",   label: "Pipeline Stages",               type: "list",  ph: "e.g. Lint → Type check → Unit tests → Build → Integration tests → Deploy staging → Smoke tests → Deploy prod" },
        { key: "deploy_strategy",   label: "Deployment Strategy",           type: "area",  ph: "Blue/green, canary, rolling deploy, feature flags — strategy and rationale" },
        { key: "rollback_procedure",label: "Rollback Procedure",            type: "area",  ph: "How is a bad deploy detected and rolled back? RTO target?" },
        { key: "secret_management", label: "Secret / Env Var Management",   type: "area",  ph: "How are secrets managed across environments? Rotation policy?" },
      ]},
      { id: "constraints", heading: "04 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What does this agent NOT handle?" },
        { key: "anti_patterns",     label: "DevOps Anti-Patterns",          type: "list",  ph: "e.g. Secrets committed to repo\nNo staging environment\nManual deployment steps\nNo rollback mechanism" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
  {
    id: "security_agent", tier: "infra", label: "Security Agent", icon: "⬙", color: "#E8A8A8",
    tagline: "System → Hardened",
    desc: "Audits architecture, code, and infrastructure for vulnerabilities. Produces security recommendations, threat models, and compliance checklists.",
    sections: [
      mkProjectSchema(), mkIdentity("SecurityAgent"),
      { id: "security_scope", heading: "02 · Audit Scope", fields: [
        { key: "audit_surfaces",    label: "Audit Surfaces",                type: "list",  ph: "e.g. API endpoint security\nAuth flow\nDB access controls\nFrontend XSS/CSRF\nThird-party deps\nInfra misconfiguration\nSecret exposure" },
        { key: "threat_model_method",label:"Threat Modeling Method",        type: "area",  ph: "e.g. STRIDE methodology, OWASP Top 10 as baseline" },
        { key: "compliance_frameworks",label:"Compliance Frameworks",       type: "list",  ph: "e.g. GDPR / CCPA / HIPAA / SOC 2 / PCI-DSS / ISO 27001" },
        { key: "severity_scale",    label: "Vulnerability Severity Scale",  type: "area",  ph: "CRITICAL / HIGH / MEDIUM / LOW / INFORMATIONAL — definition of each" },
      ]},
      { id: "report_format", heading: "03 · Security Report Format", fields: [
        { key: "report_structure",  label: "Report Structure",              type: "area",  ph: "e.g. Executive summary → Risk score → Findings by severity → Remediation guidance → Compliance gap analysis" },
        { key: "remediation_format",label: "Remediation Guidance Format",   type: "area",  ph: "How specific must remediation steps be? Code-level or architectural?" },
        { key: "sign_off_criteria", label: "Security Sign-Off Criteria",    type: "area",  ph: "What must be resolved before a security sign-off is granted?" },
      ]},
      { id: "constraints", heading: "04 · Constraints & Guard Rails", fields: [
        { key: "scope_limits",      label: "Scope Limits",                  type: "list",  ph: "What is OUT OF SCOPE? (e.g. pen testing, social engineering simulation)" },
        { key: "escalation",        label: "Escalation Protocol",           type: "area",  ph: "How are critical vulnerabilities escalated? SLA for resolution?" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },

  // ── META ───────────────────────────────────────────────────────────────────
  {
    id: "orchestrator", tier: "meta", label: "Orchestrator", icon: "⬟", color: "#E8906E",
    tagline: "Agents → Coordination",
    desc: "Manages multi-agent workflows: task sequencing, parallel execution, state management, context passing, and inter-agent communication. The system's conductor.",
    sections: [
      mkProjectSchema(), mkIdentity("Orchestrator-Prime"),
      { id: "orchestration_scope", heading: "02 · Orchestration Scope", fields: [
        { key: "agents_managed",    label: "Agents Under Coordination",     type: "list",  ph: "List all agent IDs this orchestrator coordinates" },
        { key: "workflow_types",    label: "Workflow Types Supported",      type: "list",  ph: "e.g. Full-stack app generation\nBrand-only sprint\nArchitecture review\nDoc generation\nSecurity audit\nGrowth sprint" },
        { key: "orchestration_platform",label:"Orchestration Platform",     type: "text",  ph: "e.g. Zo Computer / LangGraph / Custom state machine / Prefect" },
        { key: "state_management",  label: "Global State Management",       type: "area",  ph: "How is workflow state tracked across agents and steps? Schema? Storage?" },
      ]},
      { id: "decision_logic", heading: "03 · Orchestration Decision Logic", fields: [
        { key: "routing_rules",     label: "Task Routing Rules",            type: "area",  ph: "How does the orchestrator decide which agent handles which task?" },
        { key: "dag_definition",    label: "DAG / Dependency Graph",        type: "area",  ph: "How is the agent dependency graph defined? Static or dynamic?" },
        { key: "parallel_logic",    label: "Parallel vs. Sequential Logic", type: "area",  ph: "Which tasks can run in parallel? What must be strictly sequential?" },
        { key: "retry_logic",       label: "Retry & Failure Logic",         type: "area",  ph: "What happens when an agent returns error, low-quality output, or times out?" },
        { key: "human_in_the_loop", label: "Human-in-the-Loop Triggers",    type: "list",  ph: "Conditions that cause the orchestrator to pause and request human input" },
      ]},
      { id: "context_passing", heading: "04 · Context Passing Protocol", fields: [
        { key: "global_context_schema",label:"Global Context Schema",       type: "area",  ph: "The shared context object maintained across all agents. Define its structure." },
        { key: "context_injection", label: "Context Injection Rules",       type: "area",  ph: "How does the orchestrator inject context into each agent call? Scoped vs. global?" },
        { key: "context_update",    label: "Context Update Protocol",       type: "area",  ph: "How is global context updated as each agent completes? Merge strategy? Conflict resolution?" },
        { key: "context_versioning",label: "Context Versioning",            type: "area",  ph: "How are snapshots of context maintained for audit, replay, or rollback?" },
      ]},
      { id: "output_assembly", heading: "05 · Output Assembly", fields: [
        { key: "final_artifact",    label: "Final Assembled Artifact",      type: "area",  ph: "What does the orchestrator produce at the conclusion of a full workflow run?" },
        { key: "assembly_rules",    label: "Output Assembly Rules",         type: "list",  ph: "How are individual agent outputs composed into the final deliverable?" },
        { key: "delivery_format",   label: "Delivery Format",               type: "area",  ph: "How is the final output packaged and delivered to the user or downstream system?" },
      ]},
      mkHandoffs(), mkEval(),
    ]
  },
];

// ─── EXPORT ───────────────────────────────────────────────────────────────────
function exportMarkdown(agent, values) {
  const tier = TIERS.find(t => t.id === agent.tier)?.label || agent.tier;
  let md = `# ${agent.label} Agent PRD\n\n`;
  md += `> **Tier:** ${tier}  \n> **Tagline:** ${agent.tagline}  \n> **Generated:** ${new Date().toISOString().slice(0,10)}\n\n${agent.desc}\n\n---\n\n`;
  agent.sections.forEach(sec => {
    md += `## ${sec.heading}\n\n`;
    sec.fields.forEach(f => {
      const v = (values[f.key] || "").trim();
      if (!v) return;
      md += `### ${f.label}\n\n`;
      if (f.type === "list") {
        v.split("\n").filter(l => l.trim()).forEach(l => { md += `- ${l.trim()}\n`; });
      } else { md += `${v}\n`; }
      md += "\n";
    });
  });
  return md;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function App() {
  const [activeId, setActiveId]         = useState("strategist");
  const [allValues, setAllValues]       = useState({});
  const [openSections, setOpenSections] = useState({});  // key: `${agentId}::${sectionId}`
  const [closedTiers, setClosedTiers]   = useState({});
  const [copied, setCopied]             = useState(false);
  const scrollRef                       = useRef(null);

  const agent  = AGENTS.find(a => a.id === activeId);
  const values = allValues[activeId] || {};

  const setVal = useCallback((key, val) => {
    setAllValues(prev => ({
      ...prev,
      [activeId]: { ...(prev[activeId] || {}), [key]: val }
    }));
  }, [activeId]);

  function toggleSection(sectionId) {
    const k = `${activeId}::${sectionId}`;
    setOpenSections(prev => ({ ...prev, [k]: !prev[k] }));
  }
  function isSectionOpen(sectionId) {
    const k = `${activeId}::${sectionId}`;
    return k in openSections ? openSections[k] : true; // default open
  }

  function getCompletion(agentId) {
    const a = AGENTS.find(x => x.id === agentId);
    const v = allValues[agentId] || {};
    const total = a.sections.reduce((s, sec) => s + sec.fields.length, 0);
    const filled = a.sections.reduce((s, sec) =>
      s + sec.fields.filter(f => (v[f.key] || "").trim()).length, 0);
    return { total, filled, pct: total ? Math.round((filled / total) * 100) : 0 };
  }

  function handleCopy() {
    const md = exportMarkdown(agent, values);
    navigator.clipboard?.writeText(md).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const { total: aTotal, filled: aFilled, pct: aPct } = getCompletion(activeId);
  const draftedCount = AGENTS.filter(a => {
    const v = allValues[a.id] || {};
    return Object.values(v).some(x => (x || "").trim());
  }).length;

  // ── Input components (no useState inside, use callbacks) ──────────────────
  function InputField({ field, value, onChange, color }) {
    const common = {
      value: value || "",
      onChange: e => onChange(field.key, e.target.value),
      placeholder: field.ph,
      style: {
        width: "100%",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "5px",
        color: T.textPrimary,
        fontSize: "12px",
        fontFamily: T.mono,
        padding: "8px 12px",
        outline: "none",
        boxSizing: "border-box",
        lineHeight: "1.65",
      }
    };
    if (field.type === "select") {
      return (
        <select
          value={value || ""}
          onChange={e => onChange(field.key, e.target.value)}
          style={{ ...common.style, appearance: "none", cursor: "pointer", color: value ? T.textPrimary : "rgba(232,228,220,0.2)" }}
        >
          <option value="">Select phase…</option>
          {field.opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (field.type === "list" || field.type === "area") {
      return <textarea rows={field.type === "list" ? 4 : 3} {...common} style={{ ...common.style, resize: "vertical" }} />;
    }
    return <input type="text" {...common} />;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg0, fontFamily: T.mono, display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        textarea::placeholder, input::placeholder { color: rgba(232,228,220,0.18); }
        select option { background: #1a1a1a; color: #E8E4DC; }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{ background: T.bg1, borderBottom: `1px solid ${T.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20 }}>
        <div>
          <div style={{ fontSize: "9px", letterSpacing: "0.22em", color: T.textMuted, textTransform: "uppercase", marginBottom: "3px" }}>AppArchitect · SENET</div>
          <div style={{ fontSize: "16px", fontFamily: T.serif, color: T.textPrimary, fontStyle: "italic" }}>Canonical Agent PRD Templates</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "10px", color: T.textMuted }}>
            <span style={{ color: T.textSecondary }}>{draftedCount}</span> / {AGENTS.length} agents drafted
          </div>
          <button onClick={handleCopy} style={{ background: copied ? "rgba(138,232,164,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${copied ? "rgba(138,232,164,0.3)" : T.border}`, borderRadius: "5px", padding: "6px 14px", color: copied ? "#8BE8A4" : T.textSecondary, fontSize: "10px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {copied ? "✓ Copied" : "↑ Export MD"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 57px)" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width: "200px", flexShrink: 0, borderRight: `1px solid ${T.border}`, background: T.bg1, overflowY: "auto", paddingBottom: "24px" }}>
          {TIERS.map(tier => {
            const tierAgents = AGENTS.filter(a => a.tier === tier.id);
            const isOpen = !closedTiers[tier.id];
            return (
              <div key={tier.id}>
                <button onClick={() => setClosedTiers(p => ({ ...p, [tier.id]: !p[tier.id] }))} style={{ width: "100%", background: "transparent", border: "none", padding: "12px 14px 7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", textAlign: "left" }}>
                  <span style={{ fontSize: "7px", color: T.textMuted, width: "8px" }}>{isOpen ? "▼" : "▶"}</span>
                  <span style={{ fontSize: "8px", letterSpacing: "0.16em", color: T.textMuted, textTransform: "uppercase", fontWeight: "600", flex: 1 }}>{tier.label}</span>
                  <span style={{ fontSize: "8px", color: T.textMuted }}>{tierAgents.length}</span>
                </button>
                {isOpen && tierAgents.map(a => {
                  const { pct } = getCompletion(a.id);
                  const isActive = activeId === a.id;
                  return (
                    <button key={a.id} onClick={() => { setActiveId(a.id); if (scrollRef.current) scrollRef.current.scrollTop = 0; }} style={{ width: "100%", background: isActive ? `${a.color}0D` : "transparent", border: "none", borderLeft: `2px solid ${isActive ? a.color : "transparent"}`, padding: "8px 14px 8px 12px", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: "3px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: isActive ? a.color : "rgba(232,228,220,0.2)", fontSize: "11px", flexShrink: 0 }}>{a.icon}</span>
                        <span style={{ fontSize: "11px", color: isActive ? a.color : T.textSecondary, fontWeight: isActive ? "600" : "400", lineHeight: "1.3" }}>{a.label}</span>
                      </div>
                      {pct > 0 && (
                        <div style={{ paddingLeft: "17px" }}>
                          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", borderRadius: "1px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: a.color, opacity: 0.55 }} />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ── MAIN ── */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", background: T.bg0 }}>

          {/* Agent header */}
          <div style={{ background: T.bg1, borderBottom: `1px solid ${T.border}`, padding: "22px 32px 18px", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "9px", background: `${agent.color}12`, border: `1px solid ${agent.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", color: agent.color, flexShrink: 0 }}>
                {agent.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "8px", letterSpacing: "0.16em", color: agent.color, textTransform: "uppercase", background: `${agent.color}10`, border: `1px solid ${agent.color}20`, borderRadius: "3px", padding: "2px 6px" }}>
                    {TIERS.find(t => t.id === agent.tier)?.label}
                  </span>
                  <span style={{ fontSize: "9px", color: T.textMuted }}>{agent.sections.length} sections · {agent.sections.reduce((s, sec) => s + sec.fields.length, 0)} fields</span>
                </div>
                <div style={{ fontSize: "19px", fontFamily: T.serif, color: T.textPrimary, marginBottom: "5px" }}>{agent.label}</div>
                <div style={{ fontSize: "12px", color: T.textSecondary, lineHeight: "1.6", maxWidth: "520px" }}>{agent.desc}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "20px", fontFamily: T.serif, color: aPct > 0 ? agent.color : T.textMuted }}>{aPct}%</div>
                <div style={{ fontSize: "9px", color: T.textMuted, marginBottom: "5px" }}>{aFilled}/{aTotal}</div>
                <div style={{ width: "70px", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px", overflow: "hidden", marginLeft: "auto" }}>
                  <div style={{ height: "100%", width: `${aPct}%`, background: `linear-gradient(90deg, ${agent.color}60, ${agent.color})`, transition: "width 0.3s" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div style={{ padding: "20px 32px 60px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {agent.sections.map(section => {
              const isOpen = isSectionOpen(section.id);
              const secFilled = section.fields.filter(f => (values[f.key] || "").trim()).length;
              const isShared = !!section.badge;
              return (
                <div key={section.id} style={{ border: `1px solid ${isOpen ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}`, borderRadius: "7px", overflow: "hidden", background: isOpen ? T.bg2 : "transparent" }}>
                  <button onClick={() => toggleSection(section.id)} style={{ width: "100%", background: "transparent", border: "none", padding: "13px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", textAlign: "left" }}>
                    <span style={{ fontSize: "9px", color: isOpen ? agent.color : T.textMuted, width: "8px", flexShrink: 0 }}>{isOpen ? "▼" : "▶"}</span>
                    <span style={{ fontSize: "10px", letterSpacing: "0.13em", color: isOpen ? agent.color : T.textMuted, textTransform: "uppercase", fontWeight: "600", flex: 1 }}>
                      {section.heading}
                    </span>
                    {isShared && (
                      <span style={{ fontSize: "8px", color: "rgba(200,169,110,0.45)", background: "rgba(200,169,110,0.07)", border: "1px solid rgba(200,169,110,0.15)", borderRadius: "3px", padding: "1px 5px", letterSpacing: "0.08em" }}>
                        SHARED
                      </span>
                    )}
                    <span style={{ fontSize: "9px", color: T.textMuted, marginLeft: "6px" }}>{secFilled}/{section.fields.length}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 16px 18px", display: "flex", flexDirection: "column", gap: "13px" }}>
                      {section.fields.map(field => (
                        <div key={field.key}>
                          <div style={{ fontSize: "10px", color: T.textSecondary, marginBottom: "5px", display: "flex", alignItems: "center", gap: "7px" }}>
                            {field.label}
                            {field.type === "list" && <span style={{ fontSize: "9px", color: T.textMuted }}>· one per line</span>}
                          </div>
                          <InputField field={field} value={values[field.key]} onChange={setVal} color={agent.color} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Footer */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleCopy}
                style={{ background: `${agent.color}10`, border: `1px solid ${agent.color}25`, borderRadius: "5px", padding: "8px 18px", color: agent.color, fontSize: "10px", cursor: "pointer", letterSpacing: "0.12em", textTransform: "uppercase" }}
                onMouseOver={e => e.currentTarget.style.background = `${agent.color}1E`}
                onMouseOut={e => e.currentTarget.style.background = `${agent.color}10`}
              >
                {copied ? "✓ Copied" : `Export ${agent.label} PRD →`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
