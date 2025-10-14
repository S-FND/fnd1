import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePortfolioAuth } from './usePortfolioAuth';
import { ApprovalRequest } from '@/types/maker-checker';

interface SLAAlert {
  requestId: string;
  module: string;
  recordType: string;
  dueAt: string;
  hoursOverdue: number;
  priority: string;
}

export const useSLAMonitoring = () => {
  const { profile } = usePortfolioAuth();
  const [alerts, setAlerts] = useState<SLAAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const companyId = profile?.portfolio_company_id;

  const checkSLAViolations = async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      const now = new Date();

      const { data, error } = await supabase
        .from('approval_requests')
        .select('*')
        .eq('portfolio_company_id', companyId)
        .in('status', ['pending_review', 'in_review'])
        .not('due_at', 'is', null);

      if (error) throw error;

      const violations: SLAAlert[] = (data as ApprovalRequest[])
        .filter(request => {
          if (!request.due_at) return false;
          return new Date(request.due_at) < now;
        })
        .map(request => {
          const dueDate = new Date(request.due_at!);
          const hoursOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60));
          
          return {
            requestId: request.id,
            module: request.module,
            recordType: request.record_type,
            dueAt: request.due_at!,
            hoursOverdue,
            priority: request.priority
          };
        })
        .sort((a, b) => b.hoursOverdue - a.hoursOverdue);

      setAlerts(violations);
    } catch (err) {
      console.error('SLA monitoring error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSLAViolations();
    
    // Check every 15 minutes
    const interval = setInterval(checkSLAViolations, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [companyId]);

  const getCriticalAlerts = () => {
    return alerts.filter(alert => alert.priority === 'critical' || alert.hoursOverdue > 48);
  };

  const getAlertsByModule = (module: string) => {
    return alerts.filter(alert => alert.module === module);
  };

  return {
    alerts,
    loading,
    criticalAlerts: getCriticalAlerts(),
    getAlertsByModule,
    refresh: checkSLAViolations
  };
};
