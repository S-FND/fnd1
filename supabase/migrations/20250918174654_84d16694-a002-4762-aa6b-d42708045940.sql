-- Insert sample portfolio company
INSERT INTO public.portfolio_companies (id, name, slug, is_approved, approval_status, approved_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Sample Company', 'sample-company', true, 'approved', now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample user profiles for testing permissions
INSERT INTO public.user_profiles (id, user_id, portfolio_company_id, role, is_active, email, full_name, approved_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'portfolio_company_admin', true, 'admin@sample.com', 'John Admin', now()),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'manager', true, 'manager@sample.com', 'Sarah Manager', now()),
  ('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'employee', true, 'employee@sample.com', 'Mike Employee', now()),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001', 'employee', true, 'jane@sample.com', 'Jane Smith', now()),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'manager', true, 'manager2@sample.com', 'Bob Manager', now())
ON CONFLICT (id) DO NOTHING;