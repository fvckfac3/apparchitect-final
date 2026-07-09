governance/03-generation-rules.md
Generation Rules Engine Specification
Version: 1.0
Purpose
The Generation Rules Engine controls dynamic document generation throughout AppArchitect.
Rules determine:
• Which sections are generated
• Which documents are required
• Which agents are invoked
• Which workflows are activated
• Which architecture patterns are applied
The Generation Rules Engine enables adaptive documentation generation rather than static template filling.
Core Principle
Generation is driven by schema state.
Documents are not generated because they exist.
Documents are generated because project characteristics require them.
Rule Structure
All generation rules follow:
rule: id: priority: condition: actions: 
Rule Execution Order
priority_levels: critical: high: medium: low: 
Critical Rules
Critical rules execute first.
Failure blocks generation.
GEN-001
Authentication Required
rule: id: GEN-001 condition: authentication.required = true actions: generate: - authentication_section - permissions_matrix - security_section 
GEN-002
AI Features Enabled
rule: id: GEN-002 condition: ai_features.enabled = true actions: generate: - ai_architecture_section - prompt_strategy_section - memory_architecture_section - model_selection_section 
GEN-003
Multi-Tenant SaaS
rule: id: GEN-003 condition: project_type = SaaS actions: generate: - tenant_architecture - account_management - subscription_management 
Business Rules
GEN-010
Subscription Revenue Model
rule: id: GEN-010 condition: monetization.revenue_model = subscription actions: generate: - billing_architecture - pricing_tiers - stripe_integration - subscription_workflows 
GEN-011
Marketplace Revenue Model
rule: id: GEN-011 condition: monetization.revenue_model = marketplace actions: generate: - transaction_flows - escrow_logic - payout_system 
GEN-012
Advertising Revenue Model
rule: id: GEN-012 condition: monetization.revenue_model = advertising actions: generate: - ad_delivery_system - analytics_tracking - audience_segmentation 
AI Rules
GEN-020
Conversational AI
rule: id: GEN-020 condition: ai_features.use_case = conversational actions: generate: - prompt_architecture - memory_strategy - session_management 
GEN-021
Recommendation Engine
rule: id: GEN-021 condition: ai_features.use_case = recommendations actions: generate: - recommendation_engine - ranking_system - personalization_layer 
GEN-022
AI Coaching
rule: id: GEN-022 condition: ai_features.use_case = coaching actions: generate: - coaching_framework - memory_layer - progress_tracking 
Integration Rules
GEN-030
Stripe Integration
rule: id: GEN-030 condition: integrations contains Stripe actions: generate: - payment_workflows - billing_architecture - subscription_management 
GEN-031
Twilio Integration
rule: id: GEN-031 condition: integrations contains Twilio actions: generate: - messaging_workflows - notification_architecture 
GEN-032
OpenAI Integration
rule: id: GEN-032 condition: integrations contains OpenAI actions: generate: - ai_service_layer - prompt_management - token_monitoring 
Infrastructure Rules
GEN-040
High Availability
rule: id: GEN-040 condition: non_functional_requirements.availability >= 99.9 actions: generate: - failover_strategy - redundancy_plan - backup_architecture 
GEN-041
Global Scale
rule: id: GEN-041 condition: geographic_scope = global actions: generate: - cdn_architecture - multi_region_strategy 
Security Rules
GEN-050
Sensitive User Data
rule: id: GEN-050 condition: security.data_classification = sensitive actions: generate: - encryption_requirements - audit_logging - retention_policy 
GEN-051
Healthcare Data
rule: id: GEN-051 condition: industry = healthcare actions: generate: - compliance_section - audit_requirements - data_governance 
Workflow Rules
GEN-060
Workflow Complexity
rule: id: GEN-060 condition: workflow_count > 20 actions: generate: - workflow_index - workflow_categories 
Screen Rules
GEN-070
Large Application
rule: id: GEN-070 condition: screen_count > 50 actions: generate: - navigation_architecture - screen_hierarchy_map 
Rule Chaining
Rules may trigger additional rules.
Example:
subscription_model ↓ billing_architecture ↓ stripe_required ↓ payment_workflows 
Rule Conflict Resolution
Priority order:
1. Critical 2. Security 3. Architecture 4. Business 5. UX 
Rule Validation
Every rule must satisfy:
rule_requirements: has_id: true has_condition: true has_action: true 
Generation Output
Rules produce:
generation_plan: documents: sections: agents: workflows: 
Example Output
project: AI Recovery Coaching App generation_plan: documents: - UX PRD - AI Architecture PRD - Monetization PRD sections: - Memory Layer - Coaching Engine - Stripe Billing agents: - Architect Agent - Documentation Agent 
Ownership
ComponentOwnerRule CreationGovernanceRule ExecutionArchitect AgentRule ValidationValidation AgentRule ExportExport Agent 
End of File