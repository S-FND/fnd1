
import { useState, useCallback } from 'react';
import { httpClient, ApiResponse, ApiError } from '@/lib/httpClient';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  showToast?: boolean;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>,
    options: UseApiOptions = {}
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setState({
        data: null,
        loading: false,
        error: apiError,
      });

      if (options.onError) {
        options.onError(apiError);
      }

      throw apiError;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Convenience hooks for common HTTP methods
export function useApiGet<T = any>() {
  const api = useApi<T>();
  
  const get = useCallback((url: string, options?: UseApiOptions) => {
    return api.execute(() => httpClient.get<T>(url), options);
  }, [api]);

  return { ...api, get };
}

export function useApiPost<T = any>() {
  const api = useApi<T>();
  
  const post = useCallback((url: string, body?: any, options?: UseApiOptions) => {
    return api.execute(() => httpClient.post<T>(url, body), options);
  }, [api]);

  return { ...api, post };
}

export function useApiPut<T = any>() {
  const api = useApi<T>();
  
  const put = useCallback((url: string, body?: any, options?: UseApiOptions) => {
    return api.execute(() => httpClient.put<T>(url, body), options);
  }, [api]);

  return { ...api, put };
}

export function useApiDelete<T = any>() {
  const api = useApi<T>();
  
  const del = useCallback((url: string, options?: UseApiOptions) => {
    return api.execute(() => httpClient.delete<T>(url), options);
  }, [api]);

  return { ...api, delete: del };
}
