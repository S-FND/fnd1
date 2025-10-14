import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePortfolioAuth } from './usePortfolioAuth';
import { 
  ApprovalRequest, 
  ApprovalHistory, 
  CreateApprovalRequestParams,
  ProcessApprovalParams,
  ApprovalStats,
  DiffField,
  MakerCheckerModule,
  WorkflowStatus
} from '@/types/maker-checker';

interface UseMakerCheckerOptions {
  module?: MakerCheckerModule;
  status?: WorkflowStatus;
  autoRefresh?: boolean;
}

export const useMakerChecker = (options: UseMakerCheckerOptions = {}) => {
  const { user, profile } = usePortfolioAuth();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyId = profile?.portfolio_company_id;

  // Fetch approval requests
  const fetchRequests = async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      let query = supabase
        .from('approval_requests')
        .select('*')
        .eq('portfolio_company_id', companyId)
        .order('created_at', { ascending: false });

      if (options.module) {
        query = query.eq('module', options.module);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setRequests((data as any) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch approval requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [companyId, options.module, options.status]);

  // Create new approval request
  const createApprovalRequest = async (params: CreateApprovalRequestParams) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.rpc('create_approval_request', {
        p_module: params.module,
        p_record_id: params.record_id,
        p_record_type: params.record_type,
        p_current_data: params.current_data,
        p_previous_data: params.previous_data || null,
        p_change_summary: params.change_summary || null,
        p_priority: params.priority || 'medium',
        p_materiality_flag: params.materiality_flag || false
      });

      if (error) throw error;

      await fetchRequests();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create approval request');
    }
  };

  // Process approval (approve/reject/request change)
  const processApproval = async (params: ProcessApprovalParams) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.rpc('process_approval_request', {
        p_request_id: params.request_id,
        p_action: params.action,
        p_comment: params.comment || null
      });

      if (error) throw error;

      await fetchRequests();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to process approval');
    }
  };

  // Get approval history for a request
  const getApprovalHistory = async (requestId: string): Promise<ApprovalHistory[]> => {
    try {
      const { data, error } = await supabase
        .from('approval_history')
        .select('*')
        .eq('approval_request_id', requestId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as any) || [];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch approval history');
    }
  };

  // Get approval statistics
  const getApprovalStats = (): ApprovalStats => {
    const now = new Date();
    
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending_review' || r.status === 'in_review').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      overdue: requests.filter(r => {
        if (!r.due_at) return false;
        return new Date(r.due_at) < now && (r.status === 'pending_review' || r.status === 'in_review');
      }).length
    };
  };

  // Get requests assigned to current user as checker
  const getMyCheckerRequests = () => {
    return requests.filter(r => r.assigned_checker_id === user?.id);
  };

  // Get requests created by current user
  const getMyMakerRequests = () => {
    return requests.filter(r => r.maker_id === user?.id);
  };

  // Calculate diff between current and previous data
  const calculateDiff = (request: ApprovalRequest): DiffField[] => {
    if (!request.previous_data) return [];

    const currentData = request.current_data;
    const previousData = request.previous_data;
    const allKeys = new Set([...Object.keys(currentData), ...Object.keys(previousData)]);

    return Array.from(allKeys).map(key => ({
      field: key,
      old_value: previousData[key],
      new_value: currentData[key],
      changed: JSON.stringify(previousData[key]) !== JSON.stringify(currentData[key])
    })).filter(diff => diff.changed);
  };

  // Assign checker to request
  const assignChecker = async (requestId: string, checkerId: string) => {
    try {
      const { error } = await supabase
        .from('approval_requests')
        .update({ 
          assigned_checker_id: checkerId,
          status: 'in_review'
        })
        .eq('id', requestId);

      if (error) throw error;

      await fetchRequests();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to assign checker');
    }
  };

  return {
    requests,
    loading,
    error,
    createApprovalRequest,
    processApproval,
    getApprovalHistory,
    getApprovalStats,
    getMyCheckerRequests,
    getMyMakerRequests,
    calculateDiff,
    assignChecker,
    refetch: fetchRequests
  };
};
