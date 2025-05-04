
import { ESGDDWorkflow, ESGCapItem, FundingStage, RegulatoryRequirement } from '../types/esgDD';

export const mockESGDDWorkflows: ESGDDWorkflow[] = [
  {
    id: '1',
    companyName: 'GreenTech Solutions',
    fundingStage: 'series_a',
    startDate: '2024-04-15',
    dueDate: '2024-05-10',
    status: 'in_progress',
    assignedTo: ['user1', 'user2'],
    companyDetails: {
      name: 'GreenTech Solutions',
      registrationNumber: 'GTS12345',
      incorporationDate: '2020-06-21',
      address: '123 Green Street, EcoCity, EC 12345',
      industry: 'CleanTech',
      country: 'United States',
      state: 'California',
      founders: ['Jane Green', 'Michael Eco'],
      keyPersonnel: [
        { name: 'Jane Green', position: 'CEO', email: 'jane@greentech.com' },
        { name: 'Michael Eco', position: 'CTO', email: 'michael@greentech.com' },
      ]
    },
    capItems: [
      {
        id: 'cap1',
        title: 'Implement Emissions Monitoring',
        description: 'Install emissions monitoring system for manufacturing facility',
        dueDate: '2024-06-30',
        status: 'in_progress',
        assignedTo: 'user1',
        priority: 'high',
        category: 'environmental'
      },
      {
        id: 'cap2',
        title: 'Update Privacy Policy',
        description: 'Ensure compliance with latest data privacy regulations',
        dueDate: '2024-05-15',
        status: 'pending',
        assignedTo: 'user2',
        priority: 'medium',
        category: 'data_privacy'
      }
    ]
  },
  {
    id: '2',
    companyName: 'FinTech Innovations',
    fundingStage: 'pre_seed',
    startDate: '2024-04-20',
    dueDate: '2024-05-05',
    status: 'draft',
    assignedTo: ['user3'],
    capItems: []
  },
  {
    id: '3',
    companyName: 'HealthAI',
    fundingStage: 'series_b',
    startDate: '2024-03-10',
    dueDate: '2024-04-15',
    status: 'completed',
    assignedTo: ['user4', 'user5'],
    capItems: [
      {
        id: 'cap3',
        title: 'Implement Board Diversity Policy',
        description: 'Develop and implement a board diversity and inclusion policy',
        dueDate: '2024-06-01',
        status: 'completed',
        assignedTo: 'user4',
        priority: 'medium',
        category: 'governance'
      },
      {
        id: 'cap4',
        title: 'Employee Health Benefits',
        description: 'Update employee health benefits package to meet industry standards',
        dueDate: '2024-05-20',
        status: 'completed',
        assignedTo: 'user5',
        priority: 'high',
        category: 'social'
      }
    ]
  }
];

export const mockCapItems: ESGCapItem[] = [
  ...mockESGDDWorkflows[0].capItems,
  ...mockESGDDWorkflows[2].capItems,
  {
    id: 'cap5',
    title: 'Sustainable Supply Chain Policy',
    description: 'Develop and implement sustainable supply chain management policy',
    dueDate: '2024-07-15',
    status: 'pending',
    assignedTo: 'user2',
    priority: 'high',
    category: 'environmental'
  },
  {
    id: 'cap6',
    title: 'Gender Pay Gap Analysis',
    description: 'Conduct gender pay gap analysis and develop action plan',
    dueDate: '2024-06-15',
    status: 'in_progress',
    assignedTo: 'user3',
    priority: 'medium',
    category: 'social'
  }
];

export const fundingStagesDisplay: Record<FundingStage, string> = {
  'pre_seed': 'Pre-Seed',
  'seed': 'Seed',
  'pre_series_a': 'Pre-Series A',
  'series_a': 'Series A',
  'series_b': 'Series B',
  'series_c_plus': 'Series C+',
  'ipo': 'IPO'
};

export const mockRegulatoryRequirements: RegulatoryRequirement[] = [
  {
    id: '1',
    country: 'India',
    title: 'Air (Prevention and Control of Pollution) Act',
    description: 'Regulates air pollution from industrial plants and manufacturing processes',
    category: 'environmental',
    source: 'Ministry of Environment, Forest and Climate Change',
    lastUpdated: '2023-08-15'
  },
  {
    id: '2',
    country: 'India',
    title: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act',
    description: 'Requires organizations to establish Internal Complaints Committee and prevention policies',
    category: 'social',
    source: 'Ministry of Women and Child Development',
    lastUpdated: '2022-11-20'
  },
  {
    id: '3',
    country: 'India',
    state: 'Maharashtra',
    title: 'Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act',
    description: 'Regulates conditions of work including working hours, leave, and health & safety',
    category: 'social',
    source: 'Maharashtra Labour Department',
    lastUpdated: '2023-02-10'
  },
  {
    id: '4',
    country: 'India',
    title: 'Companies Act, 2013 - Section 135 CSR',
    description: 'Mandates CSR spending of 2% of average net profits for companies meeting specified thresholds',
    category: 'governance',
    source: 'Ministry of Corporate Affairs',
    lastUpdated: '2023-09-05'
  },
  {
    id: '5',
    country: 'India',
    title: 'Digital Personal Data Protection Act, 2023',
    description: 'Governs the processing of digital personal data in India',
    category: 'data_privacy',
    source: 'Ministry of Electronics and Information Technology',
    lastUpdated: '2023-12-01'
  }
];
