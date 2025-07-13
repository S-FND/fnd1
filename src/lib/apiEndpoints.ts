
// Centralized API endpoints configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  COMPANY: {
    PROFILE: '/company/profile',
    UPDATE: '/company/update',
  },
  ESG: {
    METRICS: '/esg/metrics',
    REPORTS: '/esg/reports',
    DD: '/esg/due-diligence',
  },
  GHG: {
    EMISSIONS: '/ghg/emissions',
    CALCULATOR: '/ghg/calculator',
    REPORTS: '/ghg/reports',
  },
  AUDIT: {
    LIST: '/audits',
    CREATE: '/audits',
    UPDATE: (id: string) => `/audits/${id}`,
    DELETE: (id: string) => `/audits/${id}`,
  },
  STAKEHOLDERS: {
    LIST: 'stakeholders',
    CREATE: 'stakeholders',
    UPDATE: (id: string) => `stakeholders/${id}`,
    DELETE: (id: string) => `stakeholders/${id}`,
  },
  REPORTS: {
    BRSR: '/reports/brsr',
    GRI: '/reports/gri',
    TCFD: '/reports/tcfd',
    IMPACT: '/reports/impact',
  },
} as const;

// Helper function to build URLs with query parameters
export function buildUrl(endpoint: string, params?: Record<string, any>): string {
  if (!params) return endpoint;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${endpoint}?${queryString}` : endpoint;
}
