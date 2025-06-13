
import { Feature, FeatureId } from '@/types/features';

export const features: Feature[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main dashboard with company overview',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'core'
  },
  {
    id: 'company-profile',
    name: 'Company Profile',
    description: 'Manage company information and locations',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'management'
  },
  {
    id: 'unit-management',
    name: 'Unit Management',
    description: 'Manage company units across locations',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'management'
  },
  {
    id: 'team-management',
    name: 'Team Management',
    description: 'Manage team members and roles',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'management'
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Application settings and feature management',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'management'
  },
  {
    id: 'lms',
    name: 'Learning Management System',
    description: 'Training modules and learning programs',
    isDefault: false,
    dependencies: [],
    dependents: [],
    category: 'operations'
  },
  {
    id: 'ehs-trainings',
    name: 'EHS Trainings',
    description: 'Environment, Health & Safety training programs',
    isDefault: false,
    dependencies: [],
    dependents: ['compliance'],
    category: 'operations'
  },
  {
    id: 'compliance',
    name: 'Compliance Management',
    description: 'Regulatory compliance tracking and management',
    isDefault: false,
    dependencies: ['ehs-trainings'],
    dependents: [],
    category: 'operations'
  },
  {
    id: 'audit',
    name: 'Audit Management',
    description: 'Supplier and internal audit management',
    isDefault: false,
    dependencies: [],
    dependents: [],
    category: 'operations'
  },
  {
    id: 'esg-dd',
    name: 'ESG Due Diligence',
    description: 'ESG due diligence assessments and management',
    isDefault: false,
    dependencies: [],
    dependents: [],
    category: 'operations'
  },
  {
    id: 'ghg-accounting',
    name: 'GHG Accounting',
    description: 'Greenhouse gas emissions tracking and reporting',
    isDefault: false,
    dependencies: [],
    dependents: [],
    category: 'operations'
  },
  {
    id: 'materiality',
    name: 'Materiality Assessment',
    description: 'ESG materiality analysis and stakeholder engagement',
    isDefault: false,
    dependencies: [],
    dependents: ['esg-management'],
    category: 'operations'
  },
  {
    id: 'esg-management',
    name: 'ESG Management',
    description: 'Comprehensive ESG strategy and performance management',
    isDefault: false,
    dependencies: ['materiality'],
    dependents: [],
    category: 'operations'
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Comprehensive reporting and analytics suite',
    isDefault: false,
    dependencies: ['lms', 'ehs-trainings', 'audit', 'ghg-accounting', 'materiality', 'esg-management'],
    dependents: [],
    category: 'reporting'
  }
];

export const getFeatureById = (id: FeatureId): Feature | undefined => {
  return features.find(feature => feature.id === id);
};

export const getDefaultFeatures = (): FeatureId[] => {
  return features.filter(feature => feature.isDefault).map(feature => feature.id);
};

export const getFeaturesByCategory = (category: Feature['category']): Feature[] => {
  return features.filter(feature => feature.category === category);
};
