-- Create facilities table for storing organization facilities/locations
CREATE TABLE public.facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_company_id UUID NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  location TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  facility_type TEXT, -- e.g., 'Manufacturing', 'Office', 'Warehouse', 'Distribution Center'
  operational_status TEXT DEFAULT 'active', -- 'active', 'inactive', 'under_construction'
  area_sqm NUMERIC,
  employee_count INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view facilities for their company"
  ON public.facilities
  FOR SELECT
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id 
      FROM public.user_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage facilities for their company"
  ON public.facilities
  FOR ALL
  USING (
    portfolio_company_id IN (
      SELECT portfolio_company_id 
      FROM public.user_profiles 
      WHERE user_id = auth.uid() 
        AND role IN ('portfolio_company_admin'::portfolio_role, 'super_admin'::portfolio_role)
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create indexes
CREATE INDEX idx_facilities_company ON public.facilities(portfolio_company_id);
CREATE INDEX idx_facilities_active ON public.facilities(portfolio_company_id, is_active) WHERE is_active = true;

-- Insert sample facilities
INSERT INTO public.facilities (portfolio_company_id, name, code, location, city, state, country, facility_type, area_sqm, employee_count, created_by, notes)
SELECT 
  pc.id,
  'Pune Plant 1',
  'PNE-01',
  'Hinjewadi Phase 2',
  'Pune',
  'Maharashtra',
  'India',
  'Manufacturing',
  15000,
  250,
  up.user_id,
  'Main manufacturing facility'
FROM portfolio_companies pc
CROSS JOIN LATERAL (
  SELECT user_id 
  FROM user_profiles 
  WHERE portfolio_company_id = pc.id 
  LIMIT 1
) up
ON CONFLICT DO NOTHING;

INSERT INTO public.facilities (portfolio_company_id, name, code, location, city, state, country, facility_type, area_sqm, employee_count, created_by, notes)
SELECT 
  pc.id,
  'Head Office',
  'HO-01',
  'BKC',
  'Mumbai',
  'Maharashtra',
  'India',
  'Office',
  5000,
  150,
  up.user_id,
  'Corporate headquarters'
FROM portfolio_companies pc
CROSS JOIN LATERAL (
  SELECT user_id 
  FROM user_profiles 
  WHERE portfolio_company_id = pc.id 
  LIMIT 1
) up
ON CONFLICT DO NOTHING;

INSERT INTO public.facilities (portfolio_company_id, name, code, location, city, state, country, facility_type, area_sqm, employee_count, created_by, notes)
SELECT 
  pc.id,
  'Distribution Center - North',
  'DC-N01',
  'Gurgaon',
  'Gurgaon',
  'Haryana',
  'India',
  'Distribution Center',
  8000,
  80,
  up.user_id,
  'Northern region distribution hub'
FROM portfolio_companies pc
CROSS JOIN LATERAL (
  SELECT user_id 
  FROM user_profiles 
  WHERE portfolio_company_id = pc.id 
  LIMIT 1
) up
ON CONFLICT DO NOTHING;

-- Comment
COMMENT ON TABLE public.facilities IS 'Stores organization facilities and locations for GHG accounting and other operational tracking';