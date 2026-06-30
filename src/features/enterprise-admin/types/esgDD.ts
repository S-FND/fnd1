import { IDocumentValidation } from "../components/esg-cap/document-summary-review";
import { CompletionIndicator } from "../components/esg-cap/useComplianceScore";

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

type CAPStatus = 
  | "upcoming"
  | "due in <1 month"
  | "overdue"
  | "submitted"
  | "request to re-submit";

export type ESGCapPriority = 'high' | 'medium' | 'low';

export type ESGCapDealCondition = 'CP' | 'CS' | 'ESG_Roadmap' | 'none';

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

export type EvidenceType =
  | "data"
  | "report"
  | "training_record"
  | "audit"
  | "plan"
  | "system"
  | "certificate"
  | "kpi_metrics";



export interface AiResponse {
  id: string;
  _index: number;

  // requiredEvidence: {
  //   types: string[];
  //   normalizedTypes: string[];
  //   reasoning: string;
  //   confidence: number;
  // };

  requiredEvidence: {
    types: EvidenceType[];
    normalizedTypes: EvidenceType[];
    reasoning: string;
    confidence: number;
  };

  documentRequired: boolean;
  documentType: string | null;
  sourceType: "internal" | "external" | null;

  sections: string[];

  templates: Template[];

  reasoning: string;
  confidence: number;
}

export interface Template {
  type: "system" | "data" | "report" | string;
  name: string;
  format: "checklist" | "table" | "document" | string;

  structure: TemplateStructure;
}

export interface TemplateStructure {
  components?: string[];   // system
  columns?: string[];      // data
  sections?: string[];     // report

  // future-proof (very important for your AI system)
  [key: string]: any;
}

export interface AiInsights {
  id: string;
  _index: number;
  userIntent: string;

  evidence: {
    type: string;
    normalizedType: string;
    documentSource: "government" | "internal";
    isMandatory: boolean;
    reasoning: string;

    template?: {
      name: string;
      format: "document" | "table" | "checklist";
      outputFileType: "docx" | "pdf" | "excel" | "csv";
      priority: "high" | "medium" | "low";
      structure: Record<string, string>;
    } | null;

    referenceContent?: {
      title: string;
      keyClauses: string[];
      requiredFields: string[];
    } | null;
  }[];

  executionSummary: string;
  confidence: number;
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
  status: CAPStatus;
  investorStatus: string;
  deadline?: string;    // This might be your targetDate
  targetDate?: string;  // Alternative to deadline
  progressPercentage?: string;
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
  theme?: "Policy" | "SOP" | "Metrics" | "Logs";
  data_type?: string;
  documentType?: string;
  sections?: string[];
  sourceType?: string;
  aiResponseRaw?: AiResponse;
  manualInsights?: AiResponse;
  aiInsights?: AiInsights;
  completionIndicators:CompletionIndicator[];
  fileUploadedData: {
    filename: string;
    mimetype: string;
    size: number;
    s3Link: string;
    status: 'Accepted' | 'Rejected' | 'Pending';
    aiSummary: IDocumentValidation;
  }[]
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
