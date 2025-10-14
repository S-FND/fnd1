-- =====================================================
-- Phase 1: Core Maker-Checker Infrastructure
-- =====================================================

-- Create workflow status enum
CREATE TYPE workflow_status AS ENUM (
  'draft',
  'pending_review',
  'in_review',
  'approved',
  'published',
  'rejected',
  'revision_requested'
);

-- Create priority enum
CREATE TYPE approval_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Create module enum for priority modules
CREATE TYPE maker_checker_module AS ENUM (
  'esg_metrics',
  'esg_cap',
  'ghg_accounting',
  'brsr_report',
  'esg_dd'
);

-- =====================================================
-- Enhanced Approval Requests Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module maker_checker_module NOT NULL,
  record_id UUID NOT NULL,
  record_type TEXT NOT NULL,
  
  -- Workflow
  status workflow_status NOT NULL DEFAULT 'draft',
  priority approval_priority NOT NULL DEFAULT 'medium',
  
  -- Actors
  maker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_checker_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timing & SLA
  submitted_at TIMESTAMP WITH TIME ZONE,
  due_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Data snapshots
  current_data JSONB NOT NULL,
  previous_data JSONB,
  
  -- Metadata
  change_summary TEXT,
  materiality_flag BOOLEAN DEFAULT FALSE,
  requires_dual_approval BOOLEAN DEFAULT FALSE,
  evidence_urls TEXT[],
  
  -- Company context
  portfolio_company_id UUID REFERENCES public.portfolio_companies(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- Approval History Table (Immutable Audit Trail)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_request_id UUID NOT NULL REFERENCES public.approval_requests(id) ON DELETE CASCADE,
  
  -- Action details
  action TEXT NOT NULL, -- 'submit', 'review', 'approve', 'reject', 'request_change', 'escalate'
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_role TEXT NOT NULL,
  
  -- Content
  comment TEXT,
  previous_status workflow_status,
  new_status workflow_status NOT NULL,
  
  -- Snapshot at time of action
  data_snapshot JSONB,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp (immutable)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- Version Control for ESG Metrics
-- =====================================================
CREATE TABLE IF NOT EXISTS public.esg_metrics_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  
  -- Metric data
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  unit TEXT,
  reporting_period TEXT,
  data_source TEXT,
  calculation_method TEXT,
  evidence_urls TEXT[],
  
  -- Version metadata
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Change tracking
  change_summary TEXT,
  change_reason TEXT,
  
  portfolio_company_id UUID REFERENCES public.portfolio_companies(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(metric_id, version_number)
);

-- =====================================================
-- Version Control for GHG Accounting
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ghg_accounting_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  
  -- GHG data
  scope TEXT NOT NULL, -- 'scope1', 'scope2', 'scope3'
  activity_type TEXT NOT NULL,
  activity_data NUMERIC NOT NULL,
  activity_unit TEXT NOT NULL,
  emission_factor NUMERIC NOT NULL,
  emission_factor_source TEXT NOT NULL,
  emission_factor_version TEXT,
  calculated_emissions NUMERIC NOT NULL,
  calculation_formula TEXT,
  reporting_period TEXT NOT NULL,
  evidence_urls TEXT[],
  
  -- Version metadata
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Change tracking
  change_summary TEXT,
  verification_notes TEXT,
  
  portfolio_company_id UUID REFERENCES public.portfolio_companies(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(record_id, version_number)
);

-- =====================================================
-- Version Control for ESG CAP (Corrective Action Plans)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.esg_cap_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cap_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  
  -- CAP data
  issue_description TEXT NOT NULL,
  corrective_action TEXT NOT NULL,
  responsible_person TEXT,
  target_date DATE,
  status TEXT NOT NULL,
  evidence_urls TEXT[],
  completion_notes TEXT,
  
  -- Version metadata
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Change tracking
  change_summary TEXT,
  
  portfolio_company_id UUID REFERENCES public.portfolio_companies(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(cap_id, version_number)
);

-- =====================================================
-- Version Control for ESG DD (Due Diligence)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.esg_dd_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dd_record_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  
  -- DD data
  questionnaire_data JSONB NOT NULL,
  responses JSONB NOT NULL,
  risk_score NUMERIC,
  evidence_urls TEXT[],
  assessment_notes TEXT,
  
  -- Version metadata
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Change tracking
  change_summary TEXT,
  
  portfolio_company_id UUID REFERENCES public.portfolio_companies(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(dd_record_id, version_number)
);

-- =====================================================
-- Version Control for BRSR Report Sections
-- =====================================================
CREATE TABLE IF NOT EXISTS public.brsr_report_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_section_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  
  -- Report section data
  section_name TEXT NOT NULL,
  section_type TEXT NOT NULL, -- 'general_disclosures', 'management', 'principle_wise', etc.
  content JSONB NOT NULL,
  metrics_references UUID[],
  evidence_urls TEXT[],
  
  -- Version metadata
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Change tracking
  change_summary TEXT,
  review_notes TEXT,
  
  portfolio_company_id UUID REFERENCES public.portfolio_companies(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(report_section_id, version_number)
);

-- =====================================================
-- SLA Configuration Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.approval_sla_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module maker_checker_module NOT NULL UNIQUE,
  sla_hours INTEGER NOT NULL,
  escalation_enabled BOOLEAN DEFAULT TRUE,
  escalation_hours INTEGER,
  requires_dual_approval BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default SLA configurations based on requirements
INSERT INTO public.approval_sla_config (module, sla_hours, escalation_hours, requires_dual_approval) VALUES
  ('esg_metrics', 72, 72, FALSE),
  ('ghg_accounting', 120, 120, TRUE),
  ('esg_cap', 72, 72, FALSE),
  ('brsr_report', 120, 120, TRUE),
  ('esg_dd', 96, 96, FALSE);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_approval_requests_status ON public.approval_requests(status);
CREATE INDEX idx_approval_requests_module ON public.approval_requests(module);
CREATE INDEX idx_approval_requests_checker ON public.approval_requests(assigned_checker_id);
CREATE INDEX idx_approval_requests_maker ON public.approval_requests(maker_id);
CREATE INDEX idx_approval_requests_due ON public.approval_requests(due_at);
CREATE INDEX idx_approval_requests_company ON public.approval_requests(portfolio_company_id);

CREATE INDEX idx_approval_history_request ON public.approval_history(approval_request_id);
CREATE INDEX idx_approval_history_actor ON public.approval_history(actor_id);
CREATE INDEX idx_approval_history_created ON public.approval_history(created_at);

CREATE INDEX idx_esg_metrics_versions_metric ON public.esg_metrics_versions(metric_id);
CREATE INDEX idx_esg_metrics_versions_current ON public.esg_metrics_versions(is_current) WHERE is_current = TRUE;

CREATE INDEX idx_ghg_versions_record ON public.ghg_accounting_versions(record_id);
CREATE INDEX idx_ghg_versions_current ON public.ghg_accounting_versions(is_current) WHERE is_current = TRUE;

CREATE INDEX idx_cap_versions_cap ON public.esg_cap_versions(cap_id);
CREATE INDEX idx_cap_versions_current ON public.esg_cap_versions(is_current) WHERE is_current = TRUE;

CREATE INDEX idx_dd_versions_record ON public.esg_dd_versions(dd_record_id);
CREATE INDEX idx_dd_versions_current ON public.esg_dd_versions(is_current) WHERE is_current = TRUE;

CREATE INDEX idx_brsr_versions_section ON public.brsr_report_versions(report_section_id);
CREATE INDEX idx_brsr_versions_current ON public.brsr_report_versions(is_current) WHERE is_current = TRUE;

-- =====================================================
-- Row Level Security Policies
-- =====================================================

-- Enable RLS
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_metrics_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghg_accounting_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_cap_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esg_dd_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brsr_report_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_sla_config ENABLE ROW LEVEL SECURITY;

-- Approval Requests Policies
CREATE POLICY "Users can view requests for their company"
  ON public.approval_requests FOR SELECT
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Makers can create approval requests"
  ON public.approval_requests FOR INSERT
  WITH CHECK (
    maker_id = auth.uid() AND
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Makers and checkers can update requests"
  ON public.approval_requests FOR UPDATE
  USING (
    maker_id = auth.uid() OR 
    assigned_checker_id = auth.uid() OR
    approver_id = auth.uid()
  );

-- Approval History Policies (read-only for users)
CREATE POLICY "Users can view approval history for their company"
  ON public.approval_history FOR SELECT
  USING (
    approval_request_id IN (
      SELECT id FROM public.approval_requests 
      WHERE portfolio_company_id IN (
        SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "System can insert approval history"
  ON public.approval_history FOR INSERT
  WITH CHECK (actor_id = auth.uid());

-- Version Control Policies (similar pattern for all version tables)
CREATE POLICY "Users can view versions for their company"
  ON public.esg_metrics_versions FOR SELECT
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create versions"
  ON public.esg_metrics_versions FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Repeat for other version tables
CREATE POLICY "Users can view GHG versions for their company"
  ON public.ghg_accounting_versions FOR SELECT
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create GHG versions"
  ON public.ghg_accounting_versions FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view CAP versions for their company"
  ON public.esg_cap_versions FOR SELECT
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create CAP versions"
  ON public.esg_cap_versions FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view DD versions for their company"
  ON public.esg_dd_versions FOR SELECT
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create DD versions"
  ON public.esg_dd_versions FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view BRSR versions for their company"
  ON public.brsr_report_versions FOR SELECT
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create BRSR versions"
  ON public.brsr_report_versions FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- SLA Config Policies
CREATE POLICY "All users can view SLA config"
  ON public.approval_sla_config FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage SLA config"
  ON public.approval_sla_config FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'portfolio_company_admin'
    )
  );

-- =====================================================
-- Triggers for Updated At
-- =====================================================
CREATE TRIGGER update_approval_requests_updated_at
  BEFORE UPDATE ON public.approval_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_approval_sla_config_updated_at
  BEFORE UPDATE ON public.approval_sla_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to create new version
CREATE OR REPLACE FUNCTION public.create_approval_request(
  p_module maker_checker_module,
  p_record_id UUID,
  p_record_type TEXT,
  p_current_data JSONB,
  p_previous_data JSONB DEFAULT NULL,
  p_change_summary TEXT DEFAULT NULL,
  p_priority approval_priority DEFAULT 'medium',
  p_materiality_flag BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id UUID;
  v_company_id UUID;
  v_sla_hours INTEGER;
BEGIN
  -- Get user's company
  SELECT portfolio_company_id INTO v_company_id
  FROM public.user_profiles
  WHERE user_id = auth.uid();
  
  -- Get SLA hours for module
  SELECT sla_hours INTO v_sla_hours
  FROM public.approval_sla_config
  WHERE module = p_module;
  
  -- Create approval request
  INSERT INTO public.approval_requests (
    module,
    record_id,
    record_type,
    status,
    priority,
    maker_id,
    current_data,
    previous_data,
    change_summary,
    materiality_flag,
    portfolio_company_id,
    submitted_at,
    due_at
  ) VALUES (
    p_module,
    p_record_id,
    p_record_type,
    'pending_review',
    p_priority,
    auth.uid(),
    p_current_data,
    p_previous_data,
    p_change_summary,
    p_materiality_flag,
    v_company_id,
    now(),
    now() + (v_sla_hours || ' hours')::INTERVAL
  ) RETURNING id INTO v_request_id;
  
  -- Log action
  INSERT INTO public.approval_history (
    approval_request_id,
    action,
    actor_id,
    actor_role,
    new_status,
    data_snapshot
  ) VALUES (
    v_request_id,
    'submit',
    auth.uid(),
    'maker',
    'pending_review',
    p_current_data
  );
  
  RETURN v_request_id;
END;
$$;

-- Function to approve/reject request
CREATE OR REPLACE FUNCTION public.process_approval_request(
  p_request_id UUID,
  p_action TEXT, -- 'approve', 'reject', 'request_change'
  p_comment TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_status workflow_status;
  v_current_status workflow_status;
BEGIN
  -- Get current status
  SELECT status INTO v_current_status
  FROM public.approval_requests
  WHERE id = p_request_id;
  
  -- Determine new status
  v_new_status := CASE
    WHEN p_action = 'approve' THEN 'approved'::workflow_status
    WHEN p_action = 'reject' THEN 'rejected'::workflow_status
    WHEN p_action = 'request_change' THEN 'revision_requested'::workflow_status
    ELSE v_current_status
  END;
  
  -- Update request
  UPDATE public.approval_requests
  SET 
    status = v_new_status,
    reviewed_at = now(),
    approved_at = CASE WHEN p_action = 'approve' THEN now() ELSE NULL END,
    assigned_checker_id = CASE WHEN p_action = 'approve' THEN auth.uid() ELSE assigned_checker_id END
  WHERE id = p_request_id;
  
  -- Log action
  INSERT INTO public.approval_history (
    approval_request_id,
    action,
    actor_id,
    actor_role,
    comment,
    previous_status,
    new_status
  ) VALUES (
    p_request_id,
    p_action,
    auth.uid(),
    'checker',
    p_comment,
    v_current_status,
    v_new_status
  );
  
  RETURN TRUE;
END;
$$;