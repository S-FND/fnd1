-- Secure document_versions SELECT access
-- 1) Remove overly-permissive policy
DROP POLICY IF EXISTS "Users can view document versions" ON public.document_versions;

-- 2) Allow super admins to view all document versions
CREATE POLICY "Super admins can view all document versions"
ON public.document_versions
FOR SELECT
USING (
  public.get_user_role(auth.uid()) = 'super_admin'::portfolio_role
);

-- 3) Allow users to view versions they created or within their own company
--    Uses existing helper functions:
--      - public.get_user_company(uuid) RETURNS uuid
--      - public.get_user_role(uuid) RETURNS portfolio_role
CREATE POLICY "Users can view document versions for their company"
ON public.document_versions
FOR SELECT
USING (
  created_by IS NOT NULL AND (
    auth.uid() = created_by OR 
    public.get_user_company(auth.uid()) = public.get_user_company(created_by)
  )
);
