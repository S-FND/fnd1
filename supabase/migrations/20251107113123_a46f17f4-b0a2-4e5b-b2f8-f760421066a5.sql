-- Create table for GHG emission sources
CREATE TABLE IF NOT EXISTS public.ghg_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_company_id UUID NOT NULL,
  facility_id UUID REFERENCES public.facilities(id),
  
  -- Source identification
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL, -- Stationary, Mobile, Fugitive, etc.
  scope TEXT NOT NULL, -- Scope1, Scope2, Scope3, Scope4
  category TEXT NOT NULL,
  description TEXT,
  
  -- Activity details
  activity_unit TEXT NOT NULL,
  measurement_frequency TEXT NOT NULL, -- Daily, Weekly, Monthly, Quarterly, Annually
  
  -- Emission factors
  emission_factor NUMERIC,
  emission_factor_source TEXT,
  emission_factor_unit TEXT,
  
  -- Calculation
  calculation_methodology TEXT,
  
  -- Assignment
  assigned_data_collectors UUID[],
  assigned_verifiers UUID[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  reporting_period TEXT NOT NULL,
  
  -- Metadata
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- Create table for period-wise activity data
CREATE TABLE IF NOT EXISTS public.ghg_activity_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.ghg_sources(id) ON DELETE CASCADE,
  portfolio_company_id UUID NOT NULL,
  
  -- Period information
  reporting_period TEXT NOT NULL, -- e.g., "FY 2024-25"
  period_name TEXT NOT NULL, -- e.g., "Q1 (Apr-Jun)", "Apr", "Week 1"
  period_start_date DATE,
  period_end_date DATE,
  
  -- Activity data
  activity_value NUMERIC NOT NULL,
  activity_unit TEXT NOT NULL,
  
  -- Emissions calculation
  emission_factor NUMERIC NOT NULL,
  emission_factor_source TEXT,
  calculated_emissions NUMERIC NOT NULL, -- in kg CO2e
  calculated_emissions_tco2e NUMERIC GENERATED ALWAYS AS (calculated_emissions / 1000) STORED,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending', -- pending, submitted, verified, approved
  data_collection_date DATE,
  
  -- Assignment and verification
  collected_by UUID,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional info
  data_source TEXT,
  evidence_urls TEXT[],
  notes TEXT,
  
  -- Metadata
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Constraints
  CONSTRAINT unique_source_period UNIQUE(source_id, reporting_period, period_name),
  CONSTRAINT positive_activity_value CHECK (activity_value >= 0),
  CONSTRAINT positive_emissions CHECK (calculated_emissions >= 0)
);

-- Enable RLS
ALTER TABLE public.ghg_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghg_activity_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ghg_sources
CREATE POLICY "Users can view sources for their company"
  ON public.ghg_sources FOR SELECT
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sources for their company"
  ON public.ghg_sources FOR INSERT
  WITH CHECK (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles
      WHERE user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update sources for their company"
  ON public.ghg_sources FOR UPDATE
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sources for their company"
  ON public.ghg_sources FOR DELETE
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for ghg_activity_data
CREATE POLICY "Users can view activity data for their company"
  ON public.ghg_activity_data FOR SELECT
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create activity data for their company"
  ON public.ghg_activity_data FOR INSERT
  WITH CHECK (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles
      WHERE user_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update activity data for their company"
  ON public.ghg_activity_data FOR UPDATE
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete activity data for their company"
  ON public.ghg_activity_data FOR DELETE
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id FROM public.user_profiles
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_ghg_sources_company ON public.ghg_sources(portfolio_company_id);
CREATE INDEX idx_ghg_sources_facility ON public.ghg_sources(facility_id);
CREATE INDEX idx_ghg_sources_scope ON public.ghg_sources(scope);
CREATE INDEX idx_ghg_sources_active ON public.ghg_sources(is_active);

CREATE INDEX idx_ghg_activity_data_source ON public.ghg_activity_data(source_id);
CREATE INDEX idx_ghg_activity_data_company ON public.ghg_activity_data(portfolio_company_id);
CREATE INDEX idx_ghg_activity_data_period ON public.ghg_activity_data(reporting_period);
CREATE INDEX idx_ghg_activity_data_status ON public.ghg_activity_data(status);

-- Create trigger for updated_at
CREATE TRIGGER update_ghg_sources_updated_at
  BEFORE UPDATE ON public.ghg_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ghg_activity_data_updated_at
  BEFORE UPDATE ON public.ghg_activity_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();