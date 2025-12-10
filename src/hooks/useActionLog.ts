import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ActionLog {
  id: string;
  user_id: string;
  action_type: 'create' | 'update' | 'delete' | 'upload' | 'download' | 'view' | 'share' | 'restore';
  entity_type: string;
  entity_id?: string | null;
  entity_name?: string | null;
  description?: string | null;
  metadata: any;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  title: string;
  content?: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  created_by?: string;
  created_at: string;
  change_summary?: string;
  is_current: boolean;
}

export function useActionLog() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLogs = async (limit = 100, offset = 0) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('action_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      setLogs((data as ActionLog[]) || []);
    } catch (error) {
      console.error('Error fetching action logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch action logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logAction = async (
    actionType: ActionLog['action_type'],
    entityType: string,
    entityId?: string,
    entityName?: string,
    description?: string,
    metadata: Record<string, any> = {}
  ) => {
    try {
      const { error } = await supabase.rpc('log_action', {
        p_action_type: actionType,
        p_entity_type: entityType,
        p_entity_id: entityId,
        p_entity_name: entityName,
        p_description: description,
        p_metadata: metadata
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  return {
    logs,
    loading,
    fetchLogs,
    logAction
  };
}

export function useDocumentVersions(documentId?: string) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchVersions = async (docId: string) => {
    if (!docId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', docId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching document versions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch document versions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (
    docId: string,
    title: string,
    options: {
      content?: string;
      fileUrl?: string;
      fileSize?: number;
      mimeType?: string;
      changeSummary?: string;
    } = {}
  ) => {
    try {
      const { data, error } = await supabase.rpc('create_document_version', {
        p_document_id: docId,
        p_title: title,
        p_content: options.content,
        p_file_url: options.fileUrl,
        p_file_size: options.fileSize,
        p_mime_type: options.mimeType,
        p_change_summary: options.changeSummary
      });

      if (error) throw error;
      
      // Refresh versions
      await fetchVersions(docId);
      
      toast({
        title: "Success",
        description: "Document version created successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating document version:', error);
      toast({
        title: "Error",
        description: "Failed to create document version",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchVersions(documentId);
    }
  }, [documentId]);

  return {
    versions,
    loading,
    fetchVersions,
    createVersion
  };
}