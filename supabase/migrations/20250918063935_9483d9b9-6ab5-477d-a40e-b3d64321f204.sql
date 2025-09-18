-- Create user menu permissions table for granular access control
CREATE TABLE public.user_menu_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_company_id UUID NOT NULL,
  menu_item_id TEXT NOT NULL, -- identifier for menu/submenu/tab (e.g., 'esg-dd', 'esg-dd.irl', 'esg-dd.irl.company')
  granted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, portfolio_company_id, menu_item_id)
);

-- Enable RLS
ALTER TABLE public.user_menu_permissions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view permissions for their company"
ON public.user_menu_permissions
FOR SELECT
USING (
  portfolio_company_id IN (
    SELECT user_profiles.portfolio_company_id
    FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage permissions for their company"
ON public.user_menu_permissions
FOR ALL
USING (
  portfolio_company_id IN (
    SELECT user_profiles.portfolio_company_id
    FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.role = 'portfolio_company_admin'::portfolio_role
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_user_menu_permissions_updated_at
  BEFORE UPDATE ON public.user_menu_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Add foreign key for portfolio_company_id
ALTER TABLE public.user_menu_permissions
ADD CONSTRAINT fk_user_menu_permissions_portfolio_company
FOREIGN KEY (portfolio_company_id)
REFERENCES public.portfolio_companies(id)
ON DELETE CASCADE;