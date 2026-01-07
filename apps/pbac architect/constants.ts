import { Vocabulary } from './types';

export const DEFAULT_VOCABULARY: Vocabulary = {
  roles: [
    'role:everyone', 'role:admin', 'role:roleBasic', 'user:current'
  ],
  types: [
    'CeAsset', 'CeTask', 'CeRiskAssessment', 'CeControlMeasure', 'CeIssue', 'CeProject', 
    'CeObjective', 'User', 'Group', 'Organisation', 'Scorecard', 'Incident', 
    'RiskEvent', 'Treatment', 'TreatmentActivity', 'ApprovalSetup', 'Comment', 
    'CeAttachment', 'CeDistribution', 'CeRegulation', 'CeService', 
    'ReportFormEnrollment', 'ReportForms', 'Scenario'
  ],
  properties: [
    'resource.type', 'resource.id', 'resource.name', 'resource.model',
    'resource.parent', 'resource.linkedTo', 'resource.objectType', 'resource.status', 
    'resource.owner', 'resource.orgUnit', 'resource.confidentiality',
    'new.type', 'new.objectType', 'new.parent', 'new.model'
  ]
};