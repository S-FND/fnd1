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
  id: string | number;  // Can be string or number based on your API
  item: string;
  measures: string;
  reportId?: string;    // Make optional if not always present
  issue?: string;       // Make optional if not always present
  description?: string; // Make optional if not always present
  category: ESGCategory;
  recommendation?: string;
  priority: ESGCapPriority;
  status: ESGCapStatus;
  deadline?: string;    // This might be your targetDate
  targetDate?: string;  // Alternative to deadline
  assignedTo?: string;
  dealCondition: ESGCapDealCondition;
  createdAt: string;
  actualCompletionDate?: string;  // This might be your actualDate
  acceptedAt?: string;
  resource?: string;    // From your payload
  deliverable?: string; // From your payload
  CS?: string;         // From your payload
  actualDate?: string;
  remarks?: string;
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
