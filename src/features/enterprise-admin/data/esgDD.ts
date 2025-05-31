import { ESGCapItem, ESGDDReport, FundingStage, RegulatoryRequirement } from "../types/esgDD";

export const fundingStagesDisplay: Record<FundingStage, string> = {
  pre_seed: 'Pre-Seed',
  seed: 'Seed',
  pre_series_a: 'Pre-Series A',
  series_a: 'Series A',
  series_b: 'Series B',
  series_c_plus: 'Series C+',
  series_d_plus: 'Series D+',
  pre_ipo: 'Pre-IPO',
  ipo: 'IPO',
  public_listed: 'Public Listed',
  bootstrapped: 'Bootstrapped',
  government_funded: 'Government Funded'
};

export const mockESGDDReports: ESGDDReport[] = [
  {
    id: '1',
    title: 'Initial ESG Assessment - GreenTech Inc.',
    type: 'manual',
    companyName: 'GreenTech Inc.',
    date: '2025-04-01',
    status: 'completed',
    fundingStage: 'series_a',
    createdBy: 'John Doe',
    summary: 'Comprehensive ESG assessment for Series A funding'
  },
  {
    id: '2',
    title: 'Automated ESG DD - EcoSolutions Ltd.',
    type: 'automated',
    companyName: 'EcoSolutions Ltd.',
    date: '2025-04-22',
    status: 'completed',
    fundingStage: 'seed',
    createdBy: 'System',
    summary: 'Automated ESG assessment for early-stage funding'
  },
  {
    id: '3',
    title: 'Pre-IPO ESG Due Diligence',
    type: 'manual',
    companyName: 'SustainTech Global',
    date: '2025-03-15',
    status: 'completed',
    fundingStage: 'ipo',
    createdBy: 'Sarah Johnson',
    summary: 'Comprehensive ESG assessment prior to IPO'
  },
  {
    id: '4',
    title: 'External ESG Assessment Report',
    type: 'uploaded',
    companyName: 'CleanEnergy Co.',
    date: '2025-02-10',
    status: 'completed',
    createdBy: 'Michael Brown',
    fileUrl: '/mock-files/esg-report.pdf'
  },
  {
    id: '5',
    title: 'Draft ESG Assessment - FoodTech Startup',
    type: 'manual',
    companyName: 'FoodTech Innovations',
    date: '2025-05-01',
    status: 'draft',
    fundingStage: 'pre_series_a',
    createdBy: 'Emily Davis',
    summary: 'In-progress ESG assessment for potential investment'
  }
];

export const mockESGCapItems: ESGCapItem[] = [
  {
    id: '1',
    reportId: '1',
    issue: 'Inadequate waste management system',
    description: 'Current waste disposal does not comply with Solid Waste Management Rules 2016',
    category: 'environmental',
    recommendation: 'Implement segregated waste collection and proper disposal through authorized vendors',
    priority: 'high',
    status: 'in_progress',
    deadline: '2025-06-15',
    assignedTo: 'Operations Manager',
    dealCondition: 'CP',
    createdAt: '2025-04-01'
  },
  {
    id: '2',
    reportId: '1',
    issue: 'No formal POSH policy',
    description: 'Company lacks Prevention of Sexual Harassment policy required by law',
    category: 'social',
    recommendation: 'Develop and implement POSH policy and constitution of ICC',
    priority: 'high',
    status: 'pending',
    deadline: '2025-05-30',
    assignedTo: 'HR Manager',
    dealCondition: 'CP',
    createdAt: '2025-04-01'
  },
  {
    id: '3',
    reportId: '2',
    issue: 'Weak data security protocols',
    description: 'Current protocols do not meet DPDP Act requirements for data protection',
    category: 'governance',
    recommendation: 'Implement enhanced data security measures and privacy policy',
    priority: 'medium',
    status: 'pending',
    deadline: '2025-07-10',
    assignedTo: 'IT Manager',
    dealCondition: 'CS',
    createdAt: '2025-04-22'
  },
  {
    id: '4',
    reportId: '3',
    issue: 'Board lacks diversity',
    description: 'Current board composition lacks gender and skill diversity',
    category: 'governance',
    recommendation: 'Appoint independent directors with diverse backgrounds',
    priority: 'medium',
    status: 'completed',
    deadline: '2025-05-15',
    assignedTo: 'CEO',
    dealCondition: 'none',
    createdAt: '2025-03-15'
  },
  {
    id: '5',
    reportId: '3',
    issue: 'Carbon footprint not measured',
    description: 'No systems in place to measure and reduce carbon emissions',
    category: 'environmental',
    recommendation: 'Implement carbon accounting system',
    priority: 'low',
    status: 'in_progress',
    deadline: '2025-08-30',
    assignedTo: 'Sustainability Manager',
    dealCondition: 'CS',
    createdAt: '2025-03-15'
  }
];

export const mockRegulatoryRequirements: RegulatoryRequirement[] = [
  {
    id: '1',
    title: 'Solid Waste Management Rules, 2016',
    description: 'Rules governing waste segregation, collection, and disposal for businesses',
    category: 'environmental',
    source: 'Ministry of Environment, Forest and Climate Change',
    country: 'India',
    applicableStages: ['seed', 'pre_series_a', 'series_a', 'series_b', 'series_c_plus', 'ipo']
  },
  {
    id: '2',
    title: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
    description: 'Requirements for workplace policies and ICC for prevention of sexual harassment',
    category: 'social',
    source: 'Ministry of Women and Child Development',
    country: 'India',
    applicableStages: ['pre_seed', 'seed', 'pre_series_a', 'series_a', 'series_b', 'series_c_plus', 'ipo']
  },
  {
    id: '3',
    title: 'Digital Personal Data Protection Act, 2023',
    description: 'Requirements for handling and protecting personal data of customers and employees',
    category: 'governance',
    source: 'Ministry of Electronics and Information Technology',
    country: 'India',
    applicableStages: ['pre_seed', 'seed', 'pre_series_a', 'series_a', 'series_b', 'series_c_plus', 'ipo']
  },
  {
    id: '4',
    title: 'Companies Act, 2013 - Board Composition',
    description: 'Requirements for board composition, independence, and diversity',
    category: 'governance',
    source: 'Ministry of Corporate Affairs',
    country: 'India',
    applicableStages: ['series_a', 'series_b', 'series_c_plus', 'ipo']
  },
  {
    id: '5',
    title: 'Environmental Impact Assessment Notification, 2006',
    description: 'Requirements for environmental impact assessments for certain industries',
    category: 'environmental',
    source: 'Ministry of Environment, Forest and Climate Change',
    country: 'India',
    applicableStages: ['series_b', 'series_c_plus', 'ipo']
  }
];

// Helper function to get ESG CAP items for a specific report
export const getESGCapItemsForReport = (reportId: string): ESGCapItem[] => {
  return mockESGCapItems.filter(item => item.reportId === reportId);
};
