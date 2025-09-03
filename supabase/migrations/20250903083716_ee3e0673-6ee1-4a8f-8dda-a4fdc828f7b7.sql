-- Add company access control fields
ALTER TABLE public.portfolio_companies 
ADD COLUMN is_approved BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN rejection_reason TEXT,
ADD COLUMN access_notes TEXT;

-- Add system settings table for access control configuration
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for system_settings
CREATE POLICY "Super admins can manage system settings" 
ON public.system_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE user_id = auth.uid() 
  AND role = 'super_admin'
));

CREATE POLICY "All users can view system settings" 
ON public.system_settings 
FOR SELECT 
USING (true);

-- Insert default access control settings
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES 
('company_access_control', '{"enabled": true, "demo_mode_enabled": false, "demo_company_ids": []}', 'Controls company-level access restrictions'),
('demo_accounts', '{"enabled": true, "bypass_company_approval": true}', 'Demo account configuration');

-- Create trigger for system_settings updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Add index for better performance
CREATE INDEX idx_portfolio_companies_approval_status ON public.portfolio_companies(approval_status);
CREATE INDEX idx_portfolio_companies_is_approved ON public.portfolio_companies(is_approved);

-- Update existing companies to be approved (for existing data)
UPDATE public.portfolio_companies SET is_approved = TRUE, approval_status = 'approved', approved_at = now();