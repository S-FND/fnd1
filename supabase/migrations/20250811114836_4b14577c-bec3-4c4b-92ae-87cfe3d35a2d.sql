-- Create multi-tenant schema with portfolio companies
CREATE TABLE public.portfolio_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create enhanced user roles enum
CREATE TYPE public.portfolio_role AS ENUM (
  'portfolio_company_admin',
  'portfolio_team_editor', 
  'portfolio_team_viewer',
  'supplier',
  'stakeholder',
  'super_admin'
);

-- Create user profiles with tenant isolation
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_company_id UUID REFERENCES public.portfolio_companies(id) ON DELETE CASCADE,
  role portfolio_role NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  invite_code TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email, portfolio_company_id)
);

-- Create autosave drafts table
CREATE TABLE public.autosave_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_company_id UUID REFERENCES public.portfolio_companies(id) ON DELETE CASCADE NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  form_data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- Create audit logs for compliance
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_company_id UUID REFERENCES public.portfolio_companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  request_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create access control matrix
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role portfolio_role NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  granted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, resource, action)
);

-- Enable RLS on all tables
ALTER TABLE public.portfolio_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autosave_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
CREATE POLICY "Users can view their own company" ON public.portfolio_companies
FOR SELECT USING (
  id IN (
    SELECT portfolio_company_id 
    FROM public.user_profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view profiles in their company" ON public.user_profiles
FOR SELECT USING (
  portfolio_company_id IN (
    SELECT portfolio_company_id 
    FROM public.user_profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage company profiles" ON public.user_profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = auth.uid() 
    AND up.portfolio_company_id = portfolio_company_id
    AND up.role = 'portfolio_company_admin'
  )
);

CREATE POLICY "Users can access their company's drafts" ON public.autosave_drafts
FOR ALL USING (
  portfolio_company_id IN (
    SELECT portfolio_company_id 
    FROM public.user_profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their company's audit logs" ON public.audit_logs
FOR SELECT USING (
  portfolio_company_id IN (
    SELECT portfolio_company_id 
    FROM public.user_profiles 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Everyone can view role permissions" ON public.role_permissions
FOR SELECT USING (true);

-- Create functions for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS portfolio_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_profiles WHERE user_id = user_uuid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_company(user_uuid UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Create trigger for audit logging
CREATE OR REPLACE FUNCTION public.log_audit_trail()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    portfolio_company_id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data
  ) VALUES (
    COALESCE(NEW.portfolio_company_id, OLD.portfolio_company_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Insert default role permissions
INSERT INTO public.role_permissions (role, resource, action, granted) VALUES
('portfolio_company_admin', '*', '*', true),
('portfolio_team_editor', 'data', 'read', true),
('portfolio_team_editor', 'data', 'write', true),
('portfolio_team_viewer', 'data', 'read', true),
('supplier', 'requests', 'read', true),
('supplier', 'uploads', 'write', true),
('stakeholder', 'reports', 'read', true),
('super_admin', '*', '*', true);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_portfolio_companies_updated_at
  BEFORE UPDATE ON public.portfolio_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_autosave_drafts_updated_at
  BEFORE UPDATE ON public.autosave_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();