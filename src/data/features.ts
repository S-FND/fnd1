
import { Feature, FeatureId } from '@/types/features';

export const features: Feature[] = [
  {
    id: 'dashboard',
    secondaryId:'Dashboard',
    name: 'Dashboard',
    description: 'Main dashboard with company overview',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'core',
    accessGranted:false
  },
  {
    id: 'company-profile',
    name: 'Company Profile',
    description: 'Manage company information and locations',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'management',
    accessGranted:false,
    secondaryId:'Company Profile'
  },
  {
    id: 'unit-management',
    name: 'Unit Management',
    description: 'Manage company units across locations',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'management',
    accessGranted:false,
    secondaryId:'Units'
  },
  {
    id: 'team-management',
    name: 'Team Management',
    description: 'Manage team members and roles',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'management',
    accessGranted:false,
    secondaryId:'Team Management'
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Application settings and feature management',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'management',
    accessGranted:false,
    secondaryId:'Settings'
  },
  {
    id: 'stakeholder-management',
    name: 'Stakeholder Management',
    description: 'Manage stakeholders and engagement plans',
    isDefault: false,
    dependencies: [],
    dependents: [],
    category: 'operations',
    accessGranted:false,
    secondaryId:'Stakeholders'
  },
  {
    id: 'lms',
    name: 'Learning Management System',
    description: 'Training modules and learning programs',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'operations',
    accessGranted:false,
    secondaryId:'LMS'
  },
  {
    id: 'ehs-trainings',
    name: 'EHS Trainings',
    description: 'Environment, Health & Safety training programs',
    isDefault: true,
    dependencies: [],
    dependents: ['compliance'],
    category: 'operations',
    accessGranted:false,
    secondaryId:'EHS Trainings'
  },
  {
    id: 'compliance',
    name: 'Compliance Management',
    description: 'Regulatory compliance tracking and management',
    isDefault: false,
    dependencies: ['ehs-trainings'],
    dependents: [],
    category: 'operations',
    accessGranted:false,
    secondaryId:'Compliance'
  },
  {
    id: 'audit',
    name: 'Audit Management',
    description: 'Supplier and internal audit management',
    isDefault: false,
    dependencies: [],
    dependents: [],
    category: 'operations',
    accessGranted:false,
    secondaryId:'Audit'
  },
  {
    id: 'esg-dd',
    name: 'ESG Due Diligence',
    description: 'ESG due diligence assessments and management',
    isDefault: true,
    dependencies: [],
    dependents: [],
    category: 'operations',
    accessGranted:false,
    secondaryId:'ESG DD'
  },
  {
    id: 'ghg-accounting',
    name: 'GHG Accounting',
    description: 'Greenhouse gas emissions tracking and reporting',
    isDefault: false,
    dependencies: [],
    dependents: [],
    category: 'operations',
    accessGranted:false,
    secondaryId:'GHG Accounting'
  },
  {
    id: 'materiality',
    name: 'Materiality Assessment',
    description: 'ESG materiality analysis and stakeholder engagement',
    isDefault: false,
    dependencies: [],
    dependents: ['esg-management'],
    category: 'operations',
    accessGranted:false,
    secondaryId:'Materiality'
  },
  {
    id: 'esg-management',
    name: 'ESG Management',
    description: 'Comprehensive ESG strategy and performance management',
    isDefault: false,
    dependencies: ['materiality'],
    dependents: [],
    category: 'operations',
    accessGranted:false,
    secondaryId:'ESG Management'
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Comprehensive reporting and analytics suite',
    isDefault: false,
    dependencies: ['lms', 'ehs-trainings', 'audit', 'ghg-accounting', 'materiality', 'esg-management'],
    dependents: [],
    category: 'reporting',
    accessGranted:false,
    secondaryId:'Reports'
  }
];

export const getFeatureById = (id: FeatureId): Feature | undefined => {
  return features.find(feature => feature.id === id);
};

export const getDefaultFeatures = (): FeatureId[] => {
  return features.filter(feature => feature.isDefault).map(feature => feature.id);
};

export const getFeaturesByCategory = (category: Feature['category'],pageAccessData): Feature[] => {
  let filteredFeature= features.filter(feature => feature.category === category);
  return filteredFeature.map((f)=>{
    let pageAccessFilter=pageAccessData.filter((access)=> f.secondaryId == access.feature)[0]
    return {...f,accessGranted:pageAccessFilter?pageAccessFilter.enabled:false}
  })
};
