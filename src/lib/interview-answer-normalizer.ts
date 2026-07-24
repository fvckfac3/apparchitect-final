import type { InterviewAnswers } from '@/types/interview';

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function list(value: unknown): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return text(value);
}

export function normalizeInterviewAnswers(answers: InterviewAnswers, projectName = 'Product'): InterviewAnswers {
  const source = answers as Record<string, unknown>;
  const appDescription = text(source.appDescription) || text(source.productDescription);
  const targetUsers = text(source.targetUsers) || text(source.primaryUser);
  const integrations = text(source.integrations) || text(source.externalServices);
  const compliance = text(source.complianceNeeds) || list(source.complianceRequirements);
  const dataContent = text(source.dataAndContent) || text(source.dataCollected);
  const coreFeatures = text(source.coreFeatures) || text(source.coreSystems);
  const technical = text(source.technicalPreferences) || text(source.techPreferences);
  const design = text(source.brandAndDesign) || text(source.visualStyle);
  const productName = text(source.productName) || projectName;
  const hasAi = /\b(ai|artificial intelligence|llm|gpt|claude|machine learning)\b/i.test(`${appDescription} ${coreFeatures} ${integrations}`);

  return {
    ...answers,
    productName,
    productDescription: appDescription,
    problemSolved: text(source.problemSolved) || appDescription,
    productType: text(source.productType) || 'SaaS platform',
    primaryUser: targetUsers,
    targetUsers,
    userContext: text(source.userContext) || text(source.platforms),
    technicalLiteracy: text(source.technicalLiteracy) || 'Professional users; mixed technical literacy',
    uniqueValue: text(source.uniqueValue),
    coreSystems: coreFeatures,
    coreFeatures,
    userFlows: text(source.userFlows) || coreFeatures,
    systemStates: text(source.systemStates) || 'DRAFT, IN_REVIEW, APPROVED, REJECTED, ARCHIVED',
    dataCollected: dataContent,
    dataAndContent: dataContent,
    complianceRequirements: compliance,
    complianceNeeds: compliance,
    usesAI: text(source.usesAI) || (hasAi ? 'Yes' : 'No'),
    userRoles: text(source.userRoles) || text(source.authAndUsers),
    rolePermissions: text(source.rolePermissions) || text(source.authAndUsers),
    tenancyModel: text(source.tenancyModel) || 'Multi-tenant logical isolation by firm workspace',
    techPreferences: technical,
    technicalPreferences: technical,
    performanceRequirements: text(source.performanceRequirements) || text(source.scaleExpectations),
    externalServices: integrations,
    existingIntegrations: integrations,
    visualStyle: design,
    brandAndDesign: design,
    brandColors: text(source.brandColors) || design,
    keyScreens: text(source.keyScreens) || 'Marketing site, authentication, workspace dashboard, document workspace, review and approval, settings',
    accessibility: text(source.accessibility) || 'WCAG 2.2 AA',
    dataEntities: text(source.dataEntities) || dataContent,
    entityRelationships: text(source.entityRelationships) || 'Firm workspace owns users, matters, documents, templates, integrations, and audit events.',
    specialDataRequirements: text(source.specialDataRequirements) || compliance,
    criticalFailures: text(source.criticalFailures) || 'Unauthorized access, incorrect generated content, data loss, integration failure, and audit-log gaps',
    errorCommunication: text(source.errorCommunication) || 'Explain the failure in plain language, preserve work, provide a safe retry, and record an audit event.',
    testingPriorities: text(source.testingPriorities) || 'Authorization, tenant isolation, document correctness, integrations, accessibility, and performance',
    testingApproach: text(source.testingApproach) || 'Unit, integration, end-to-end, security, accessibility, and adversarial AI-output tests',
    businessModel: text(source.businessModel),
    paymentsAndCommerce: text(source.paymentsAndCommerce),
    realtimeFeatures: text(source.realtimeFeatures),
    scaleExpectations: text(source.scaleExpectations),
    futureFeatures: text(source.futureFeatures),
    timeline: text(source.timeline),
    additionalContext: text(source.additionalContext),
  };
}
