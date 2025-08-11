-- Fix remaining function security warnings
CREATE OR REPLACE FUNCTION public.log_action(p_action_type action_type, p_entity_type text, p_entity_id uuid DEFAULT NULL::uuid, p_entity_name text DEFAULT NULL::text, p_description text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.create_document_version(p_document_id uuid, p_title text, p_content text DEFAULT NULL::text, p_file_url text DEFAULT NULL::text, p_file_size bigint DEFAULT NULL::bigint, p_mime_type text DEFAULT NULL::text, p_change_summary text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;