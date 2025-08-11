import { useState, useEffect, useCallback, useRef } from 'react';
import { usePortfolioAuth } from './usePortfolioAuth';
import { supabase } from '@/integrations/supabase/client';
import { AutosaveState, SaveStatus } from '@/types/portfolio';
import { toast } from 'sonner';

interface UseAutosaveOptions {
  entityType: string;
  entityId?: string;
  debounceMs?: number;
  onSave?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useAutosave({
  entityType,
  entityId,
  debounceMs = 1000,
  onSave,
  onError,
}: UseAutosaveOptions) {
  const { user, profile } = usePortfolioAuth();
  const [state, setState] = useState<AutosaveState>({
    status: 'idle',
    lastSaved: null,
    error: null,
    isDirty: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout>();
  const dataRef = useRef<any>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const saveToDatabase = useCallback(async (data: any, retryCount = 0): Promise<void> => {
    if (!user || !profile) {
      throw new Error('User not authenticated');
    }

    try {
      setState(prev => ({ ...prev, status: 'saving', error: null }));

      const { error } = await supabase
        .from('autosave_drafts')
        .upsert({
          user_id: user.id,
          portfolio_company_id: profile.portfolio_company_id,
          entity_type: entityType,
          entity_id: entityId || null,
          form_data: data,
          version: Date.now(), // Simple versioning using timestamp
        }, {
          onConflict: 'user_id,entity_type,entity_id'
        });

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        status: 'saved',
        lastSaved: new Date(),
        error: null,
        isDirty: false,
      }));

      retryCountRef.current = 0;
      onSave?.(data);

      // Reset status after showing "saved" for a moment
      setTimeout(() => {
        setState(prev => prev.status === 'saved' ? { ...prev, status: 'idle' } : prev);
      }, 2000);

    } catch (error: any) {
      console.error('Autosave error:', error);
      
      // Retry with exponential backoff for transient errors
      if (retryCount < maxRetries && isRetryableError(error)) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          saveToDatabase(data, retryCount + 1);
        }, delay);
        return;
      }

      const errorMessage = error.message || 'Failed to save changes';
      setState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));
      
      onError?.(errorMessage);
      toast.error('Auto-save failed. Please save manually.');
    }
  }, [user, profile, entityType, entityId, onSave, onError]);

  const isRetryableError = (error: any): boolean => {
    // Check for network errors, timeouts, etc.
    return error.code === 'PGRST301' || // Network error
           error.code === 'PGRST000' || // Connection error
           error.message?.includes('network') ||
           error.message?.includes('timeout');
  };

  const save = useCallback((data: any, immediate = false) => {
    dataRef.current = data;
    setState(prev => ({ ...prev, isDirty: true }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (immediate) {
      saveToDatabase(data);
    } else {
      timeoutRef.current = setTimeout(() => {
        saveToDatabase(data);
      }, debounceMs);
    }
  }, [debounceMs, saveToDatabase]);

  const retry = useCallback(() => {
    if (dataRef.current && state.status === 'error') {
      saveToDatabase(dataRef.current);
    }
  }, [saveToDatabase, state.status]);

  const loadDraft = useCallback(async (): Promise<any | null> => {
    if (!user || !profile) return null;

    try {
      const { data, error } = await supabase
        .from('autosave_drafts')
        .select('form_data, updated_at')
        .eq('user_id', user.id)
        .eq('portfolio_company_id', profile.portfolio_company_id)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId || null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No draft found, this is fine
          return null;
        }
        throw error;
      }

      return data?.form_data || null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, [user, profile, entityType, entityId]);

  const clearDraft = useCallback(async () => {
    if (!user || !profile) return;

    try {
      await supabase
        .from('autosave_drafts')
        .delete()
        .eq('user_id', user.id)
        .eq('portfolio_company_id', profile.portfolio_company_id)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId || null);

      setState(prev => ({
        ...prev,
        status: 'idle',
        isDirty: false,
        lastSaved: null,
      }));
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [user, profile, entityType, entityId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (dataRef.current && state.isDirty) {
        // Try to save immediately before page unload
        saveToDatabase(dataRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveToDatabase, state.isDirty]);

  return {
    ...state,
    save,
    retry,
    loadDraft,
    clearDraft,
  };
}