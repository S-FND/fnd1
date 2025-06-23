
import { httpClient } from '@/lib/httpClient';
import { API_ENDPOINTS, buildUrl } from '@/lib/apiEndpoints';

// Example service functions using the HTTP client
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    httpClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  
  logout: () =>
    httpClient.post(API_ENDPOINTS.AUTH.LOGOUT),
  
  getProfile: () =>
    httpClient.get(API_ENDPOINTS.AUTH.PROFILE),
  
  refreshToken: () =>
    httpClient.post(API_ENDPOINTS.AUTH.REFRESH),
};

export const companyService = {
  getProfile: () =>
    httpClient.get(API_ENDPOINTS.COMPANY.PROFILE),
  
  updateProfile: (data: any) =>
    httpClient.put(API_ENDPOINTS.COMPANY.UPDATE, data),
};

export const esgService = {
  getMetrics: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.ESG.METRICS, params)),
  
  getReports: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.ESG.REPORTS, params)),
  
  createDueDiligence: (data: any) =>
    httpClient.post(API_ENDPOINTS.ESG.DD, data),
};

export const ghgService = {
  getEmissions: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.GHG.EMISSIONS, params)),
  
  calculateEmissions: (data: any) =>
    httpClient.post(API_ENDPOINTS.GHG.CALCULATOR, data),
  
  getReports: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.GHG.REPORTS, params)),
};

export const auditService = {
  getAudits: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.AUDIT.LIST, params)),
  
  createAudit: (data: any) =>
    httpClient.post(API_ENDPOINTS.AUDIT.CREATE, data),
  
  updateAudit: (id: string, data: any) =>
    httpClient.put(API_ENDPOINTS.AUDIT.UPDATE(id), data),
  
  deleteAudit: (id: string) =>
    httpClient.delete(API_ENDPOINTS.AUDIT.DELETE(id)),
};

export const stakeholderService = {
  getStakeholders: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.STAKEHOLDERS.LIST, params)),
  
  createStakeholder: (data: any) =>
    httpClient.post(API_ENDPOINTS.STAKEHOLDERS.CREATE, data),
  
  updateStakeholder: (id: string, data: any) =>
    httpClient.put(API_ENDPOINTS.STAKEHOLDERS.UPDATE(id), data),
  
  deleteStakeholder: (id: string) =>
    httpClient.delete(API_ENDPOINTS.STAKEHOLDERS.DELETE(id)),
};

export const reportsService = {
  generateBRSR: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.REPORTS.BRSR, params)),
  
  generateGRI: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.REPORTS.GRI, params)),
  
  generateTCFD: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.REPORTS.TCFD, params)),
  
  generateImpact: (params?: Record<string, any>) =>
    httpClient.get(buildUrl(API_ENDPOINTS.REPORTS.IMPACT, params)),
};
