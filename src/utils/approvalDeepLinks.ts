// Deep linking utility for approval items
export interface DeepLinkParams {
  module: string;
  type: string;
  id?: string;
  scope?: string;
  category?: string;
}

export const getApprovalDeepLink = (params: DeepLinkParams): string => {
  const { module, type, id, scope } = params;
  
  switch (module.toLowerCase()) {
    case 'ghg':
    case 'ghg accounting':
      // Navigate to the appropriate scope tab
      const scopeTab = scope?.toLowerCase().replace('scope ', 'scope') || 'scope1';
      return `/ghg-accounting?tab=${scopeTab}${id ? `&highlight=${id}` : ''}`;
    
    case 'esg metrics':
    case 'esg_metrics':
      return `/esg/metrics?tab=data-entry${id ? `&highlight=${id}` : ''}`;
    
    case 'esms':
      return `/esg/esms${id ? `?highlight=${id}` : ''}`;
    
    case 'esg dd':
    case 'esg_dd':
      return `/esg-dd${id ? `?highlight=${id}` : ''}`;
    
    case 'sdg':
    case 'sdg metrics':
      return `/sdg${id ? `?highlight=${id}` : ''}`;
    
    default:
      return '/dashboard';
  }
};

export const getModuleDisplayName = (module: string): string => {
  switch (module.toLowerCase()) {
    case 'ghg':
    case 'ghg accounting':
      return 'GHG Accounting';
    case 'esg metrics':
    case 'esg_metrics':
      return 'ESG Metrics';
    case 'esms':
      return 'ESMS';
    case 'esg dd':
    case 'esg_dd':
      return 'ESG Due Diligence';
    case 'sdg':
    case 'sdg metrics':
      return 'SDG Metrics';
    default:
      return module;
  }
};

export const getScopeDisplayName = (scope: string): string => {
  if (!scope) return '';
  
  const scopeMap: Record<string, string> = {
    'scope 1': 'Scope 1 - Direct Emissions',
    'scope 2': 'Scope 2 - Purchased Energy',
    'scope 3': 'Scope 3 - Value Chain',
    'scope 4': 'Scope 4 - Avoided Emissions',
    'scope1': 'Scope 1 - Direct Emissions',
    'scope2': 'Scope 2 - Purchased Energy',
    'scope3': 'Scope 3 - Value Chain',
    'scope4': 'Scope 4 - Avoided Emissions',
  };
  
  return scopeMap[scope.toLowerCase()] || scope;
};