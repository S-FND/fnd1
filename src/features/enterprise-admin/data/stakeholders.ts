
import { StakeholderCategory, StakeholderSubcategory } from '../components/stakeholders/types';

export const defaultStakeholderSubcategories: StakeholderSubcategory[] = [
  // Internal stakeholders
  {
    id: 'employees',
    name: 'Employees',
    description: 'Workers, managers, and executives directly involved in company operations',
    category: 'internal'
  },
  {
    id: 'shareholders',
    name: 'Owners/Shareholders',
    description: 'Individuals or entities that own a portion of the company',
    category: 'internal'
  },
  {
    id: 'board',
    name: 'Board of Directors',
    description: 'Elected representatives who oversee the company management',
    category: 'internal'
  },
  {
    id: 'managers',
    name: 'Managers',
    description: 'Individuals responsible for specific departments or business units',
    category: 'internal'
  },
  {
    id: 'investors',
    name: 'Investors',
    description: 'Those who have invested capital in the business',
    category: 'internal'
  },
  
  // External stakeholders
  {
    id: 'customers',
    name: 'Customers/Clients',
    description: 'Those who purchase products or services from the business',
    category: 'external'
  },
  {
    id: 'suppliers',
    name: 'Suppliers/Vendors',
    description: 'Entities that provide materials, products, or services',
    category: 'external'
  },
  {
    id: 'government',
    name: 'Government/Regulators',
    description: 'Authorities that enforce laws and regulations',
    category: 'external'
  },
  {
    id: 'community',
    name: 'Community/Society',
    description: 'Local or global community impacted by business operations',
    category: 'external'
  },
  {
    id: 'financial',
    name: 'Financial Institutions',
    description: 'Banks, lenders, and investors who provide funding',
    category: 'external'
  },
  {
    id: 'competitors',
    name: 'Competitors',
    description: 'Other companies offering similar products or services',
    category: 'external'
  },
  {
    id: 'media',
    name: 'Media/Press',
    description: 'Outlets that report on company activities',
    category: 'external'
  },
  {
    id: 'ngos',
    name: 'NGOs and Advocacy Groups',
    description: 'Organizations focused on social, environmental, or economic issues',
    category: 'external'
  }
];

// Sample stakeholder data for demonstration
export const sampleStakeholders = [
  {
    id: '1',
    name: 'Jane Smith',
    organization: 'Internal',
    email: 'jane.smith@company.com',
    subcategoryId: 'managers',
    engagementLevel: 'high',
    influence: 'high',
    interest: 'high',
    lastContact: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Acme Supplies Inc.',
    organization: 'Acme Corp',
    email: 'contact@acmesupplies.com',
    phone: '+1-555-123-4567',
    subcategoryId: 'suppliers',
    engagementLevel: 'medium',
    influence: 'medium',
    interest: 'high',
    lastContact: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'Environmental Protection Agency',
    organization: 'Government',
    email: 'contact@epa.gov',
    subcategoryId: 'government',
    engagementLevel: 'high',
    influence: 'high',
    interest: 'medium',
    lastContact: new Date('2023-03-10')
  }
];
