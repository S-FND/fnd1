
import { toast } from 'sonner';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface InterceptorConfig {
  onRequest?: (config: RequestConfig & { url: string }) => RequestConfig & { url: string } | Promise<RequestConfig & { url: string }>;
  onResponse?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  onError?: (error: ApiError) => ApiError | Promise<ApiError>;
}

class HttpClient {
  private baseURL: string = '';
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  private interceptors: InterceptorConfig = {};

  constructor() {
    this.setupDefaultInterceptors();
  }

  private setupDefaultInterceptors() {
    this.interceptors = {
      onRequest: async (config) => {
        console.log(`📤 Request: ${config.method} ${config.url}`, config);
        
        // Add auth token if available
        const token = localStorage.getItem('fandoro-token');
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        
        return config;
      },
      onResponse: async (response) => {
        console.log(`📥 Response: ${response.status} ${response.statusText}`, response);
        return response;
      },
      onError: async (error) => {
        console.error('🚨 API Error:', error);
        
        // Handle common error scenarios
        if (error.status === 401) {
          toast.error('Authentication required. Please login again.');
          // Redirect to login or handle auth refresh
          localStorage.removeItem('fandoro-token');
          localStorage.removeItem('fandoro-user');
          window.location.href = '/login';
        } else if (error.status === 403) {
          toast.error('Access denied. You do not have permission for this action.');
        } else if (error.status === 404) {
          toast.error('Resource not found.');
        } else if (error.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.message) {
          toast.error(error.message);
        }
        
        throw error;
      }
    };
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }

  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  addInterceptor(interceptor: Partial<InterceptorConfig>) {
    this.interceptors = { ...this.interceptors, ...interceptor };
  }

  private async handleRequest<T>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const fullUrl = this.baseURL + url;
    if(!url.split('/').includes('auth')){
      config['headers']['authorization']=localStorage.getItem('fandoro-token')
    }
    let requestConfig: RequestConfig & { url: string } = {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...config.headers },
      ...config,
      url: fullUrl,
    };

    // Apply request interceptor
    if (this.interceptors.onRequest) {
      requestConfig = await this.interceptors.onRequest(requestConfig);
    }

    const controller = new AbortController();
    const timeoutId = config.timeout ? setTimeout(() => controller.abort(), config.timeout) : null;

    try {
      const fetchConfig: RequestInit = {
        method: requestConfig.method,
        headers: requestConfig.headers,
        signal: controller.signal,
      };

      if (requestConfig.body && requestConfig.method !== 'GET') {
        fetchConfig.body = typeof requestConfig.body === 'string' 
          ? requestConfig.body 
          : JSON.stringify(requestConfig.body);
      }

      const response = await fetch(requestConfig.url, fetchConfig);
      
      if (timeoutId) clearTimeout(timeoutId);

      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      const apiResponse: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };

      if (!response.ok) {
        // Handle error response data safely
        const errorMessage = this.extractErrorMessage(data) || response.statusText || 'Request failed';
        
        const error: ApiError = {
          message: errorMessage,
          status: response.status,
          statusText: response.statusText,
          data,
        };

        if (this.interceptors.onError) {
          await this.interceptors.onError(error);
        }
        throw error;
      }

      // Apply response interceptor
      if (this.interceptors.onResponse) {
        return await this.interceptors.onResponse(apiResponse);
      }

      return apiResponse;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Network error occurred',
        status: (error as any)?.status,
        statusText: (error as any)?.statusText,
        data: (error as any)?.data,
      };

      if (this.interceptors.onError && !(error as ApiError).status) {
        await this.interceptors.onError(apiError);
      }

      throw apiError;
    }
  }

  private extractErrorMessage(data: any): string | null {
    // Safely extract error message from response data
    if (typeof data === 'object' && data !== null) {
      return data.message || data.error || data.detail || null;
    }
    return null;
  }

  async get<T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(url, { ...config, method: 'GET' });
  }

  async post<T>(url: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(url, { ...config, method: 'POST', body });
  }

  async put<T>(url: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(url, { ...config, method: 'PUT', body });
  }

  async patch<T>(url: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(url, { ...config, method: 'PATCH', body });
  }

  async delete<T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(url, { ...config, method: 'DELETE' });
  }
}

// Create and export singleton instance
export const httpClient = new HttpClient();

// Set base URL from environment variable if available
const baseURL = import.meta.env.VITE_API_BASE_URL || '';
if (baseURL) {
  httpClient.setBaseURL(baseURL);
}
