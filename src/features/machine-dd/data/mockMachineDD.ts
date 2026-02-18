
import { ESGDDReport, ESGCapItem } from '@/features/enterprise-admin/types/esgDD';

// --- IRL Generation Data ---

export interface IRLItem {
  id: string;
  category: 'environmental' | 'social' | 'governance';
  source: string; // SASB, GRI, Regulation, VC Policy
  requirement: string;
  description: string;
  documentExpected: string;
  status: 'pending' | 'matched' | 'partial' | 'missing';
  matchedDocument?: string;
  matchScore?: number;
  validity?: string;
}

export interface MachineDDInput {
  companyName: string;
  revenueSize: string;
  industry: string;
  vcPartner: string;
}

export interface MachineDDResult {
  input: MachineDDInput;
  irlItems: IRLItem[];
  report: ESGDDReport;
  capItems: ESGCapItem[];
  generatedAt: string;
}

// Sample IRL items generated for a demo run
const sampleIRLItems: IRLItem[] = [
  // SASB Material Topics
  { id: 'irl-1', category: 'environmental', source: 'SASB', requirement: 'GHG Emissions Disclosure', description: 'Scope 1 & 2 GHG emissions data as per SASB standards', documentExpected: 'GHG Inventory Report / Carbon Footprint Assessment', status: 'matched', matchedDocument: 'Carbon_Footprint_Report_2024.pdf', matchScore: 87, validity: '2024-12-31' },
  { id: 'irl-2', category: 'environmental', source: 'SASB', requirement: 'Energy Management', description: 'Total energy consumed, % renewable energy', documentExpected: 'Energy Audit Report', status: 'partial', matchedDocument: 'Energy_Consumption_Data.xlsx', matchScore: 62, validity: '2024-06-30' },
  { id: 'irl-3', category: 'environmental', source: 'GRI 306', requirement: 'Waste Management', description: 'Waste generated, diverted, and disposed by type', documentExpected: 'Waste Management Plan & Records', status: 'missing' },
  { id: 'irl-4', category: 'social', source: 'SASB', requirement: 'Employee Health & Safety', description: 'TRIR, fatality rate, near-miss reporting', documentExpected: 'EHS Policy & Incident Reports', status: 'matched', matchedDocument: 'EHS_Policy_v3.pdf', matchScore: 91, validity: '2025-03-31' },
  { id: 'irl-5', category: 'social', source: 'GRI 401', requirement: 'Employment Practices', description: 'New hires, turnover rates, benefits provided', documentExpected: 'HR Policy & Employee Data', status: 'matched', matchedDocument: 'HR_Policy_2024.pdf', matchScore: 78, validity: '2025-01-01' },
  // Revenue-based Indian Regulations
  { id: 'irl-6', category: 'governance', source: 'Regulation', requirement: 'Shops & Establishment Act Compliance', description: 'Registration under applicable state Shops & Establishment Act', documentExpected: 'S&E Registration Certificate', status: 'matched', matchedDocument: 'SE_Registration_MH.pdf', matchScore: 95, validity: '2026-03-31' },
  { id: 'irl-7', category: 'environmental', source: 'Regulation', requirement: 'EPR (Extended Producer Responsibility)', description: 'EPR registration and compliance for plastic/e-waste', documentExpected: 'EPR Certificate & Returns', status: 'missing' },
  { id: 'irl-8', category: 'social', source: 'Regulation', requirement: 'POSH Act Compliance', description: 'Prevention of Sexual Harassment policy, ICC constitution, annual report', documentExpected: 'POSH Policy, ICC Order, Annual POSH Report', status: 'partial', matchedDocument: 'POSH_Policy_Draft.docx', matchScore: 45, validity: undefined },
  { id: 'irl-9', category: 'governance', source: 'Regulation', requirement: 'DPDP Act Compliance', description: 'Data protection policies as per Digital Personal Data Protection Act, 2023', documentExpected: 'Privacy Policy & Data Processing Agreement', status: 'matched', matchedDocument: 'Privacy_Policy_v2.pdf', matchScore: 72, validity: '2025-06-30' },
  { id: 'irl-10', category: 'governance', source: 'Regulation', requirement: 'Companies Act - Board Composition', description: 'Independent directors, woman director, board diversity', documentExpected: 'Board Resolution & Director Appointment Letters', status: 'partial', matchedDocument: 'Board_Composition.pdf', matchScore: 55 },
  // VC ESG Policy
  { id: 'irl-11', category: 'governance', source: 'VC Policy', requirement: 'ESG Policy Adoption', description: 'Formal ESG/Sustainability policy adopted by the board', documentExpected: 'ESG Policy Document', status: 'missing' },
  { id: 'irl-12', category: 'social', source: 'VC Policy', requirement: 'DEI Metrics Reporting', description: 'Diversity, Equity & Inclusion metrics as per VC ESG framework', documentExpected: 'DEI Dashboard / Report', status: 'missing' },
  { id: 'irl-13', category: 'environmental', source: 'VC Policy', requirement: 'Climate Risk Assessment', description: 'Assessment of physical and transition climate risks', documentExpected: 'Climate Risk Assessment Report', status: 'missing' },
  { id: 'irl-14', category: 'governance', source: 'GRI 205', requirement: 'Anti-Corruption & Bribery', description: 'Anti-corruption policy, training, confirmed incidents', documentExpected: 'Anti-Corruption Policy & Training Records', status: 'partial', matchedDocument: 'Code_of_Conduct.pdf', matchScore: 40 },
];

// Sample ESG CAP items generated by Machine
const sampleMachineCapItems: ESGCapItem[] = [
  { id: 'mcap-1', reportId: 'machine-dd-1', issue: 'No waste management plan in place', description: 'Company lacks formal waste management per SWM Rules 2016 and GRI 306 requirements', category: 'environmental', recommendation: 'Implement waste segregation, engage authorized waste handlers, and begin tracking waste metrics', priority: 'high', status: 'pending', deadline: '2025-09-30', assignedTo: 'Operations', dealCondition: 'CP', createdAt: '2025-05-15' },
  { id: 'mcap-2', reportId: 'machine-dd-1', issue: 'EPR registration not completed', description: 'Extended Producer Responsibility certificate missing for plastic packaging', category: 'environmental', recommendation: 'Register on CPCB EPR portal and file returns for FY 2024-25', priority: 'high', status: 'pending', deadline: '2025-08-15', assignedTo: 'Compliance', dealCondition: 'CP', createdAt: '2025-05-15' },
  { id: 'mcap-3', reportId: 'machine-dd-1', issue: 'POSH compliance incomplete', description: 'POSH policy is in draft, ICC not formally constituted, no annual report filed', category: 'social', recommendation: 'Finalize POSH policy, constitute ICC with external member, file annual report with District Officer', priority: 'high', status: 'pending', deadline: '2025-07-31', assignedTo: 'HR', dealCondition: 'CP', createdAt: '2025-05-15' },
  { id: 'mcap-4', reportId: 'machine-dd-1', issue: 'No formal ESG policy', description: 'Board has not adopted a formal ESG/Sustainability policy as required by VC ESG framework', category: 'governance', recommendation: 'Draft and adopt board-level ESG policy covering E, S, G commitments and targets', priority: 'medium', status: 'pending', deadline: '2025-10-31', assignedTo: 'CEO / Board', dealCondition: 'CS', createdAt: '2025-05-15' },
  { id: 'mcap-5', reportId: 'machine-dd-1', issue: 'DEI metrics not tracked', description: 'No diversity, equity & inclusion dashboard or reporting mechanism in place', category: 'social', recommendation: 'Implement DEI data collection across hiring, pay equity, and leadership representation', priority: 'medium', status: 'pending', deadline: '2025-11-30', assignedTo: 'HR', dealCondition: 'CS', createdAt: '2025-05-15' },
  { id: 'mcap-6', reportId: 'machine-dd-1', issue: 'Climate risk assessment missing', description: 'No physical or transition climate risk assessment conducted', category: 'environmental', recommendation: 'Engage consultant or use TCFD-aligned framework to assess climate risks', priority: 'low', status: 'pending', deadline: '2025-12-31', assignedTo: 'Sustainability', dealCondition: 'CS', createdAt: '2025-05-15' },
  { id: 'mcap-7', reportId: 'machine-dd-1', issue: 'Anti-corruption policy inadequate', description: 'Code of conduct exists but lacks specific anti-bribery provisions and training program', category: 'governance', recommendation: 'Enhance anti-corruption policy with bribery clauses, roll out mandatory training', priority: 'medium', status: 'pending', deadline: '2025-09-30', assignedTo: 'Legal / Compliance', dealCondition: 'none', createdAt: '2025-05-15' },
  { id: 'mcap-8', reportId: 'machine-dd-1', issue: 'Energy audit report expired', description: 'Energy consumption data is from H1 2024; no current energy audit on file', category: 'environmental', recommendation: 'Commission updated energy audit and set renewable energy procurement targets', priority: 'low', status: 'pending', deadline: '2025-10-31', assignedTo: 'Facilities', dealCondition: 'none', createdAt: '2025-05-15' },
];

// The Machine DD report entry that will appear in ESG DD Reports
const sampleMachineReport: ESGDDReport = {
  id: 'machine-dd-1',
  title: 'ESGDD Report (Machine) - NovaTech Solutions Pvt. Ltd.',
  type: 'automated',
  companyName: 'NovaTech Solutions Pvt. Ltd.',
  date: '2025-05-15',
  status: 'completed',
  fundingStage: 'series_a',
  createdBy: 'Machine',
  summary: 'Automated ESG Due Diligence generated by Machine DD. Assessed 14 IRL items across SASB, GRI, Indian regulations, and VC ESG policy. 5 documents matched, 3 partial matches, 5 gaps identified. 8 corrective action items generated.',
};

export const sampleMachineDDResult: MachineDDResult = {
  input: {
    companyName: 'NovaTech Solutions Pvt. Ltd.',
    revenueSize: '50-100',
    industry: 'Information Technology & Services',
    vcPartner: 'IvyCap Ventures',
  },
  irlItems: sampleIRLItems,
  report: sampleMachineReport,
  capItems: sampleMachineCapItems,
  generatedAt: '2025-05-15T10:30:00Z',
};

// Export for integration with existing ESG DD reports list
export const machineDDReports: ESGDDReport[] = [sampleMachineReport];
export const machineDDCapItems: ESGCapItem[] = sampleMachineCapItems;
