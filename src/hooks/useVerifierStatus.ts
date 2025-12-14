import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface VerifierStatus {
  isVerifier: boolean;
  canApproveActions: boolean;
  assignedSourcesCount: number;
  loading: boolean;
}

export const useVerifierStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<VerifierStatus>({
    isVerifier: false,
    canApproveActions: false,
    assignedSourcesCount: 0,
    loading: true
  });

  useEffect(() => {
    const checkVerifierStatus = async () => {
      if (!user?.id) {
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        // Get user's Supabase auth id from user_profiles
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('user_id')
          .eq('email', user.email)
          .single();

        if (!profileData?.user_id) {
          setStatus(prev => ({ ...prev, loading: false }));
          return;
        }

        const userId = profileData.user_id;

        // Check if user has can_approve_actions in user_roles
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('can_approve_actions')
          .eq('user_id', userId)
          .single();

        const canApproveActions = roleData?.can_approve_actions ?? false;

        // Count GHG sources where user is an assigned verifier
        const { data: sourcesData, count } = await supabase
          .from('ghg_sources')
          .select('id', { count: 'exact' })
          .contains('assigned_verifiers', [userId]);

        const assignedSourcesCount = count || 0;

        // User is a verifier if they have can_approve_actions or are assigned to sources
        const isVerifier = canApproveActions || assignedSourcesCount > 0;

        setStatus({
          isVerifier,
          canApproveActions,
          assignedSourcesCount,
          loading: false
        });
      } catch (error) {
        console.error('Error checking verifier status:', error);
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };

    checkVerifierStatus();
  }, [user?.id, user?.email]);

  return status;
};
