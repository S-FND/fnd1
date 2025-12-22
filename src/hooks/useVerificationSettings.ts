import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface ModuleVerificationConfig {
  esms: boolean;
  esgMetrics: boolean;
  sdg: boolean;
  ghgScope1: boolean;
  ghgScope2: boolean;
  ghgScope3: boolean;
  ghgScope4: boolean;
}

const DEFAULT_CONFIG: ModuleVerificationConfig = {
  esms: false,
  esgMetrics: false,
  sdg: false,
  ghgScope1: false,
  ghgScope2: false,
  ghgScope3: false,
  ghgScope4: false,
};

const STORAGE_KEY = 'module-verification-settings';

export const useVerificationSettings = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<ModuleVerificationConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [user?.companyId]);

  const loadSettings = () => {
    setLoading(true);
    try {
      const storageKey = user?.companyId 
        ? `${STORAGE_KEY}-${user.companyId}` 
        : STORAGE_KEY;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setConfig(JSON.parse(stored));
      } else {
        setConfig(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error('Error loading verification settings:', error);
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (newConfig: Partial<ModuleVerificationConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    
    const storageKey = user?.companyId 
      ? `${STORAGE_KEY}-${user.companyId}` 
      : STORAGE_KEY;
    localStorage.setItem(storageKey, JSON.stringify(updatedConfig));
  };

  const isVerificationRequired = (module: string, scope?: string): boolean => {
    switch (module.toLowerCase()) {
      case 'esms':
        return config.esms;
      case 'esg metrics':
      case 'esg_metrics':
      case 'esgmetrics':
        return config.esgMetrics;
      case 'sdg':
      case 'sdg metrics':
        return config.sdg;
      case 'ghg':
      case 'ghg accounting':
        if (scope) {
          switch (scope.toLowerCase()) {
            case 'scope 1':
            case 'scope1':
              return config.ghgScope1;
            case 'scope 2':
            case 'scope2':
              return config.ghgScope2;
            case 'scope 3':
            case 'scope3':
              return config.ghgScope3;
            case 'scope 4':
            case 'scope4':
              return config.ghgScope4;
          }
        }
        return config.ghgScope1 || config.ghgScope2 || config.ghgScope3 || config.ghgScope4;
      default:
        return false;
    }
  };

  return {
    config,
    loading,
    updateConfig,
    isVerificationRequired,
  };
};
