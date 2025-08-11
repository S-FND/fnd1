export type FeatureId = 
  | 'lms'
  | 'ehs-trainings' 
  | 'audit'
  | 'esg-dd'
  | 'ghg-accounting'
  | 'materiality'
  | 'sdg'
  | 'esg-management'
  | 'reports'
  | 'compliance'
  | 'unit-management'
  | 'team-management'
  | 'company-profile'
  | 'settings'
  | 'dashboard'
  | 'stakeholder-management'
  | 'action-log';

export interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  isDefault: boolean;
  dependencies: FeatureId[];
  dependents: FeatureId[];
  category: 'core' | 'operations' | 'reporting' | 'management';
}

export interface CompanyFeatures {
  companyId: string;
  activeFeatures: FeatureId[];
  activationDates: Record<FeatureId, string>;
  lastUpdated: string;
}

export interface FeatureValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  requiredAdditions: FeatureId[];
  requiredRemovals: FeatureId[];
}
