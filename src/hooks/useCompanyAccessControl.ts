import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyAccessSettings {
  enabled: boolean;
  demo_mode_enabled: boolean;
  demo_company_ids: string[];
}

interface DemoAccountSettings {
  enabled: boolean;
  bypass_company_approval: boolean;
}

interface CompanyAccessState {
  accessSettings: CompanyAccessSettings | null;
  demoSettings: DemoAccountSettings | null;
  isLoading: boolean;
}

export function useCompanyAccessControl() {
  const [state, setState] = useState<CompanyAccessState>({
    accessSettings: null,
    demoSettings: null,
    isLoading: true,
  });

  const fetchSettings = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const { data: settings, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['company_access_control', 'demo_accounts']);

      if (error) {
        console.error('Error fetching access control settings:', error);
        return;
      }

      const accessControlSetting = settings?.find(s => s.setting_key === 'company_access_control');
      const demoAccountsSetting = settings?.find(s => s.setting_key === 'demo_accounts');

      setState({
        accessSettings: accessControlSetting?.setting_value ? 
          accessControlSetting.setting_value as unknown as CompanyAccessSettings : null,
        demoSettings: demoAccountsSetting?.setting_value ? 
          demoAccountsSetting.setting_value as unknown as DemoAccountSettings : null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const updateAccessSettings = useCallback(async (settings: Partial<CompanyAccessSettings>) => {
    try {
      const currentSettings = state.accessSettings || {
        enabled: true,
        demo_mode_enabled: false,
        demo_company_ids: []
      };

      const updatedSettings = { ...currentSettings, ...settings };

      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: updatedSettings })
        .eq('setting_key', 'company_access_control');

      if (error) {
        toast.error('Failed to update access control settings');
        throw error;
      }

      setState(prev => ({
        ...prev,
        accessSettings: updatedSettings
      }));

      toast.success('Access control settings updated');
    } catch (error) {
      console.error('Error updating access settings:', error);
      throw error;
    }
  }, [state.accessSettings]);

  const updateDemoSettings = useCallback(async (settings: Partial<DemoAccountSettings>) => {
    try {
      const currentSettings = state.demoSettings || {
        enabled: true,
        bypass_company_approval: true
      };

      const updatedSettings = { ...currentSettings, ...settings };

      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: updatedSettings })
        .eq('setting_key', 'demo_accounts');

      if (error) {
        toast.error('Failed to update demo account settings');
        throw error;
      }

      setState(prev => ({
        ...prev,
        demoSettings: updatedSettings
      }));

      toast.success('Demo account settings updated');
    } catch (error) {
      console.error('Error updating demo settings:', error);
      throw error;
    }
  }, [state.demoSettings]);

  const isCompanyAccessEnabled = useCallback(() => {
    return state.accessSettings?.enabled ?? true;
  }, [state.accessSettings]);

  const isDemoModeEnabled = useCallback(() => {
    return state.demoSettings?.enabled ?? true;
  }, [state.demoSettings]);

  const shouldBypassCompanyApproval = useCallback((companyId?: string) => {
    if (!isDemoModeEnabled()) return false;
    if (!state.demoSettings?.bypass_company_approval) return false;
    
    // If demo mode is enabled globally, bypass for all
    if (state.accessSettings?.demo_mode_enabled) return true;
    
    // If specific company IDs are configured for demo, check if this company is in the list
    if (companyId && state.accessSettings?.demo_company_ids?.includes(companyId)) {
      return true;
    }

    return false;
  }, [state.accessSettings, state.demoSettings, isDemoModeEnabled]);

  const checkCompanyAccess = useCallback((
    companyId?: string,
    isApproved?: boolean,
    approvalStatus?: string
  ): { hasAccess: boolean; reason?: string } => {
    // If company access control is disabled, allow access
    if (!isCompanyAccessEnabled()) {
      return { hasAccess: true };
    }

    // If no company ID, deny access
    if (!companyId) {
      return { hasAccess: false, reason: 'No company associated with this account' };
    }

    // If demo mode is enabled for this company, allow access
    if (shouldBypassCompanyApproval(companyId)) {
      return { hasAccess: true };
    }

    // Check if company is approved
    if (!isApproved || approvalStatus !== 'approved') {
      return { 
        hasAccess: false, 
        reason: `Your company is ${approvalStatus || 'pending approval'}. Please contact your administrator.` 
      };
    }

    return { hasAccess: true };
  }, [isCompanyAccessEnabled, shouldBypassCompanyApproval]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    ...state,
    fetchSettings,
    updateAccessSettings,
    updateDemoSettings,
    isCompanyAccessEnabled,
    isDemoModeEnabled,
    shouldBypassCompanyApproval,
    checkCompanyAccess,
  };
}