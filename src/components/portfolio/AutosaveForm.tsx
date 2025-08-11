import React, { useEffect, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveIndicator } from '@/components/common/AutosaveIndicator';

interface AutosaveFormProps<T extends Record<string, any>> {
  entityType: string;
  entityId?: string;
  defaultValues?: T;
  onSubmit?: (data: T) => void | Promise<void>;
  children: (form: UseFormReturn<T>, autosaveState: ReturnType<typeof useAutosave>) => React.ReactNode;
  debounceMs?: number;
  className?: string;
}

export function AutosaveForm<T extends Record<string, any>>({
  entityType,
  entityId,
  defaultValues,
  onSubmit,
  children,
  debounceMs = 1000,
  className,
}: AutosaveFormProps<T>) {
  const form = useForm<T>({
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });

  const autosave = useAutosave({
    entityType,
    entityId,
    debounceMs,
    onSave: (data) => {
      console.log('Autosaved:', { entityType, entityId, data });
    },
    onError: (error) => {
      console.error('Autosave error:', error);
    },
  });

  const { watch, formState } = form;
  const watchedValues = watch();

  // Load draft on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const draft = await autosave.loadDraft();
        if (draft && Object.keys(draft).length > 0) {
          // Ask user if they want to restore the draft
          const restore = window.confirm(
            'A draft was found for this form. Would you like to restore it?'
          );
          
          if (restore) {
            form.reset(draft);
          } else {
            await autosave.clearDraft();
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    };

    loadInitialData();
  }, [autosave, form]);

  // Autosave on form changes
  useEffect(() => {
    if (formState.isDirty && !formState.isSubmitting) {
      autosave.save(watchedValues);
    }
  }, [watchedValues, formState.isDirty, formState.isSubmitting, autosave]);

  const handleSubmit = useCallback(async (data: T) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      
      // Clear draft after successful submission
      await autosave.clearDraft();
      form.reset(data); // Reset form state to mark as clean
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }, [onSubmit, autosave, form]);

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <AutosaveIndicator 
          state={autosave} 
          onRetry={autosave.retry}
          className="text-xs"
        />
      </div>
      
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {children(form, autosave)}
      </form>
    </div>
  );
}