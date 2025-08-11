-- Fix security warnings by setting search_path for all functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS portfolio_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.user_profiles WHERE user_id = user_uuid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_company(user_uuid UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT portfolio_company_id FROM public.user_profiles WHERE user_id = user_uuid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.log_audit_trail()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;