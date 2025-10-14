export type WorkflowStatus = 
  | 'draft'
  | 'pending_review'
  | 'in_review'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'revision_requested';

export type ApprovalPriority = 'low' | 'medium' | 'high' | 'critical';

export type MakerCheckerModule = 
  | 'esg_metrics'
  | 'esg_cap'
  | 'ghg_accounting'
  | 'brsr_report'
  | 'esg_dd';

export interface ApprovalRequest {
  id: string;
  module: MakerCheckerModule;
  record_id: string;
  record_type: string;
  
  // Workflow
  status: WorkflowStatus;
  priority: ApprovalPriority;
  
  // Actors
  maker_id: string;
  assigned_checker_id: string | null;
  approver_id: string | null;
  
  // Timing & SLA
  submitted_at: string | null;
  due_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  
  // Data snapshots
  current_data: Record<string, any>;
  previous_data: Record<string, any> | null;
  
  // Metadata
  change_summary: string | null;
  materiality_flag: boolean;
  requires_dual_approval: boolean;
  evidence_urls: string[] | null;
  
  // Company context
  portfolio_company_id: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ApprovalHistory {
  id: string;
  approval_request_id: string;
  
  // Action details
  action: 'submit' | 'review' | 'approve' | 'reject' | 'request_change' | 'escalate';
  actor_id: string;
  actor_role: string;
  
  // Content
  comment: string | null;
  previous_status: WorkflowStatus | null;
  new_status: WorkflowStatus;
  
  // Snapshot at time of action
  data_snapshot: Record<string, any> | null;
  
  // Metadata
  ip_address: string | null;
  user_agent: string | null;
  
  // Timestamp (immutable)
  created_at: string;
}

export interface VersionMetadata {
  id: string;
  version_number: number;
  created_by: string;
  approved_by: string | null;
  is_current: boolean;
  change_summary: string | null;
  portfolio_company_id: string;
  created_at: string;
  approved_at: string | null;
}

export interface ESGMetricVersion extends VersionMetadata {
  metric_id: string;
  metric_name: string;
  metric_value: number | null;
  unit: string | null;
  reporting_period: string | null;
  data_source: string | null;
  calculation_method: string | null;
  evidence_urls: string[] | null;
  change_reason: string | null;
}

export interface GHGAccountingVersion extends VersionMetadata {
  record_id: string;
  scope: string;
  activity_type: string;
  activity_data: number;
  activity_unit: string;
  emission_factor: number;
  emission_factor_source: string;
  emission_factor_version: string | null;
  calculated_emissions: number;
  calculation_formula: string | null;
  reporting_period: string;
  evidence_urls: string[] | null;
  verification_notes: string | null;
}

export interface ESGCAPVersion extends VersionMetadata {
  cap_id: string;
  issue_description: string;
  corrective_action: string;
  responsible_person: string | null;
  target_date: string | null;
  status: string;
  evidence_urls: string[] | null;
  completion_notes: string | null;
}

export interface ESGDDVersion extends VersionMetadata {
  dd_record_id: string;
  questionnaire_data: Record<string, any>;
  responses: Record<string, any>;
  risk_score: number | null;
  evidence_urls: string[] | null;
  assessment_notes: string | null;
}

export interface BRSRReportVersion extends VersionMetadata {
  report_section_id: string;
  section_name: string;
  section_type: string;
  content: Record<string, any>;
  metrics_references: string[] | null;
  evidence_urls: string[] | null;
  review_notes: string | null;
}

export interface ApprovalSLAConfig {
  id: string;
  module: MakerCheckerModule;
  sla_hours: number;
  escalation_enabled: boolean;
  escalation_hours: number | null;
  requires_dual_approval: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateApprovalRequestParams {
  module: MakerCheckerModule;
  record_id: string;
  record_type: string;
  current_data: Record<string, any>;
  previous_data?: Record<string, any> | null;
  change_summary?: string | null;
  priority?: ApprovalPriority;
  materiality_flag?: boolean;
}

export interface ProcessApprovalParams {
  request_id: string;
  action: 'approve' | 'reject' | 'request_change';
  comment?: string | null;
}

export interface ApprovalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  overdue: number;
}

export interface DiffField {
  field: string;
  old_value: any;
  new_value: any;
  changed: boolean;
}
