
export type FundingStage = 
  | 'pre_seed'
  | 'seed'
  | 'pre_series_a'
  | 'series_a'
  | 'series_b'
  | 'series_c_plus'
  | 'ipo';

export interface ESGDDCompanyDetails {
  name: string;
  registrationNumber: string;
  incorporationDate: string;
  address: string;
  industry: string;
  country: string;
  state: string;
  founders: string[];
  keyPersonnel: {
    name: string;
    position: string;
    email?: string;
    phone?: string;
  }[];
}

export interface ESGDDWorkflow {
  id: string;
  companyName: string;
  fundingStage: FundingStage;
  startDate: string;
  dueDate: string;
  status: 'draft' | 'in_progress' | 'completed';
  assignedTo: string[];
  companyDetails?: ESGDDCompanyDetails;
  environmentalFindings?: ESGFindings;
  socialFindings?: ESGFindings;
  governanceFindings?: ESGFindings;
  capItems: ESGCapItem[];
}

export interface ESGFindings {
  positiveFindings: ESGFinding[];
  negativeFindings: ESGFinding[];
  recommendations: string[];
}

export interface ESGFinding {
  id: string;
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category: 'environmental' | 'social' | 'governance' | 'data_privacy';
}

export interface ESGCapItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'environmental' | 'social' | 'governance' | 'data_privacy';
}

export interface EarlyStageDDRequest {
  registrationCertificate: boolean;
  officeAddress: string;
  directors: string[];
  permits: string[];
  hrPolicies: boolean;
  privacyPolicy: boolean;
  legalDisclosures: string;
}

export interface LateStageDDRequest extends EarlyStageDDRequest {
  orgStructure: boolean;
  productPortfolio: string[];
  workforce: {
    total: number;
    gender: { male: number; female: number; other: number };
    contractors: number;
    interns: number;
  };
  facilities: string[];
  certifications: string[];
  itSecurity: {
    hasDPO: boolean;
    hasITSecurityTeam: boolean;
    policies: string[];
  };
}

export interface RegulatoryRequirement {
  id: string;
  country: string;
  state?: string;
  title: string;
  description: string;
  applicableIndustries?: string[];
  category: 'environmental' | 'social' | 'governance' | 'data_privacy';
  source: string;
  lastUpdated: string;
}
