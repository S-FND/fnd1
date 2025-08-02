export type FundingStage = 
  | 'pre_seed'
  | 'seed'
  | 'pre_series_a'
  | 'series_a'
  | 'series_b'
  | 'series_c'
  | 'series_c_plus'
  | 'series_d_plus'
  | 'pre_ipo'
  | 'ipo'
  | 'public_listed'
  | 'bootstrapped'
  | 'government_funded';

export type ESGCategory = 'environmental' | 'social' | 'governance';

export type ESGDDReportType = 'manual' | 'automated' | 'uploaded';

export type ESGCapStatus = 'in_review' | 'accepted' | 'pending' | 'in_progress' | 'completed' | 'delayed';

export type ESGCapPriority = 'high' | 'medium' | 'low';

export type ESGCapDealCondition = 'CP' | 'CS' | 'none';

export interface ESGDDReport {
  id: string;
  title: string;
  type: ESGDDReportType;
  companyName: string;
  date: string;
  status: 'draft' | 'completed';
  fundingStage?: FundingStage;
  createdBy: string;
  fileUrl?: string;
  summary?: string;
}

export interface ESGCapItem {
  id: string;
  reportId: string;
  issue: string;
  description: string;
  category: ESGCategory;
  recommendation: string;
  priority: ESGCapPriority;
  status: ESGCapStatus;
  deadline: string;
  assignedTo?: string;
  dealCondition: ESGCapDealCondition;
  createdAt: string;
  actualCompletionDate?: string;
  acceptedAt?: string;
}

export interface RegulatoryRequirement {
  id: string;
  title: string;
  description: string;
  category: ESGCategory;
  source: string;
  country: string;
  state?: string;
  applicableStages: FundingStage[];
}
