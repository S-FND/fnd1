-- Create maker-checker workflow tables (fixed version)

-- Check if action_type enum exists, if not create it
DO $$ BEGIN
    CREATE TYPE public.action_type AS ENUM (
      'create',
      'update', 
      'delete',
      'upload',
      'bulk_operation'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enum for pending action status
CREATE TYPE public.pending_status AS ENUM (
  'pending',
  'approved', 
  'rejected',
  'expired'
);

-- Table for pending actions (maker-checker workflow)
CREATE TABLE public.pending_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checker_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type action_type NOT NULL,
  entity_type TEXT NOT NULL, -- table name or entity type
  entity_id TEXT, -- can be UUID or other identifier
  action_data JSONB NOT NULL, -- the actual data/changes to be applied
  original_data JSONB, -- original state before change (for updates/deletes)
  reason TEXT, -- reason for the action
  status pending_status NOT NULL DEFAULT 'pending',
  checker_comments TEXT,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for maker-checker configuration
CREATE TABLE public.maker_checker_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  action_type action_type NOT NULL,
  requires_approval BOOLEAN NOT NULL DEFAULT true,
  min_checker_role TEXT NOT NULL DEFAULT 'manager',
  max_pending_hours INTEGER DEFAULT 168, -- 7 days
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(entity_type, action_type)
);

-- Table for user roles (extending the existing system)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  can_make_actions BOOLEAN DEFAULT true,
  can_approve_actions BOOLEAN DEFAULT false,
  max_approval_amount DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.pending_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maker_checker_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pending_actions
CREATE POLICY "Users can view their own pending actions"
ON public.pending_actions
FOR SELECT
USING (
  maker_id = auth.uid() OR 
  checker_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND can_approve_actions = true
  )
);

CREATE POLICY "Makers can create pending actions"
ON public.pending_actions
FOR INSERT
WITH CHECK (
  maker_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND can_make_actions = true
  )
);

CREATE POLICY "Checkers can update pending actions"
ON public.pending_actions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND can_approve_actions = true
  ) AND
  maker_id != auth.uid() -- Cannot approve own actions
);

-- RLS Policies for maker_checker_rules
CREATE POLICY "All authenticated users can view rules"
ON public.maker_checker_rules
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can modify rules"
ON public.maker_checker_rules
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can modify roles"
ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert default maker-checker rules
INSERT INTO public.maker_checker_rules (entity_type, action_type, requires_approval, min_checker_role) VALUES
('documents', 'create', true, 'manager'),
('documents', 'update', true, 'manager'),
('documents', 'delete', true, 'admin'),
('files', 'upload', true, 'manager'),
('files', 'delete', true, 'admin'),
('users', 'create', true, 'admin'),
('users', 'update', true, 'manager'),
('users', 'delete', true, 'admin'),
('esg_data', 'create', true, 'manager'),
('esg_data', 'update', true, 'manager'),
('esg_data', 'delete', true, 'admin'),
('audit_data', 'create', true, 'manager'),
('audit_data', 'update', true, 'manager'),
('audit_data', 'delete', true, 'admin');

-- Insert default user roles (these should be updated based on actual users)
INSERT INTO public.user_roles (user_id, role, can_make_actions, can_approve_actions) 
SELECT 
  id as user_id,
  'user' as role,
  true as can_make_actions,
  false as can_approve_actions
FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;