-- Create action types enum
CREATE TYPE public.action_type AS ENUM (
  'create', 'update', 'delete', 'upload', 'download', 'view', 'share', 'restore'
);

-- Create action log table
CREATE TABLE public.action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type action_type NOT NULL,
  entity_type TEXT NOT NULL, -- 'document', 'report', 'policy', etc.
  entity_id UUID, -- ID of the affected entity
  entity_name TEXT, -- Name/title of the affected entity
  description TEXT, -- Human readable description
  metadata JSONB DEFAULT '{}', -- Additional context data
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create document versions table for version control
CREATE TABLE public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL, -- Reference to main document
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT, -- Document content or file path
  file_url TEXT, -- For file uploads
  file_size BIGINT,
  mime_type TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  change_summary TEXT, -- Summary of what changed
  is_current BOOLEAN DEFAULT FALSE,
  UNIQUE(document_id, version_number)
);

-- Create indexes for better performance
CREATE INDEX idx_action_logs_user_id ON public.action_logs(user_id);
CREATE INDEX idx_action_logs_created_at ON public.action_logs(created_at DESC);
CREATE INDEX idx_action_logs_entity ON public.action_logs(entity_type, entity_id);
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_document_versions_current ON public.document_versions(document_id, is_current) WHERE is_current = true;

-- Enable RLS
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- RLS policies for action_logs
CREATE POLICY "Users can view action logs" 
ON public.action_logs 
FOR SELECT 
USING (true); -- All authenticated users can view logs

CREATE POLICY "Users can insert their own action logs" 
ON public.action_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for document_versions
CREATE POLICY "Users can view document versions" 
ON public.document_versions 
FOR SELECT 
USING (true); -- All authenticated users can view versions

CREATE POLICY "Users can create document versions" 
ON public.document_versions 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update document versions they created" 
ON public.document_versions 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Function to log actions
CREATE OR REPLACE FUNCTION public.log_action(
  p_action_type action_type,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_entity_name TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.action_logs (
    user_id,
    action_type,
    entity_type,
    entity_id,
    entity_name,
    description,
    metadata
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_entity_name,
    p_description,
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Function to create document version
CREATE OR REPLACE FUNCTION public.create_document_version(
  p_document_id UUID,
  p_title TEXT,
  p_content TEXT DEFAULT NULL,
  p_file_url TEXT DEFAULT NULL,
  p_file_size BIGINT DEFAULT NULL,
  p_mime_type TEXT DEFAULT NULL,
  p_change_summary TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_version INTEGER;
  version_id UUID;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO next_version
  FROM public.document_versions 
  WHERE document_id = p_document_id;
  
  -- Mark previous version as not current
  UPDATE public.document_versions 
  SET is_current = FALSE 
  WHERE document_id = p_document_id AND is_current = TRUE;
  
  -- Create new version
  INSERT INTO public.document_versions (
    document_id,
    version_number,
    title,
    content,
    file_url,
    file_size,
    mime_type,
    created_by,
    change_summary,
    is_current
  ) VALUES (
    p_document_id,
    next_version,
    p_title,
    p_content,
    p_file_url,
    p_file_size,
    p_mime_type,
    auth.uid(),
    p_change_summary,
    TRUE
  ) RETURNING id INTO version_id;
  
  -- Log the action
  PERFORM public.log_action(
    'create'::action_type,
    'document_version',
    version_id,
    p_title,
    format('Created version %s of document', next_version),
    jsonb_build_object('version_number', next_version, 'document_id', p_document_id)
  );
  
  RETURN version_id;
END;
$$;