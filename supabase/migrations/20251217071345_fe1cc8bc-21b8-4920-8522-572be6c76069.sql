-- Insert a test portfolio company
INSERT INTO portfolio_companies (name, slug, is_approved, approval_status)
VALUES ('Demo Corporation', 'demo-corp', true, 'approved')
ON CONFLICT (slug) DO NOTHING;