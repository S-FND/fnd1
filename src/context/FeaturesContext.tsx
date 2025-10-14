
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FeatureId, CompanyFeatures } from '@/types/features';
import { getDefaultFeatures } from '@/data/features';
import { useAuth } from './AuthContext';
import { logger } from '@/hooks/logger';

interface FeaturesContextType {
  companyFeatures: CompanyFeatures | null;
  isFeatureActive: (featureId: FeatureId) => boolean;
  updateFeatures: (features: FeatureId[]) => Promise<void>;
  isLoading: boolean;
}

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export const FeaturesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [companyFeatures, setCompanyFeatures] = useState<CompanyFeatures | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (user?.companyId) {
      loadCompanyFeatures(user.companyId);
    }
  }, [user]);

  const loadCompanyFeatures = async (companyId: string) => {
    setIsLoading(true);
    try {
      // Mock loading from localStorage or API
      const stored = localStorage.getItem(`company-features-${companyId}`);
      if (stored) {
        setCompanyFeatures(JSON.parse(stored));
      } else {
        // Default features for new companies
        const defaultFeatures = getDefaultFeatures();
        const newCompanyFeatures: CompanyFeatures = {
          companyId,
          activeFeatures: defaultFeatures,
          activationDates: defaultFeatures.reduce((acc, feature) => {
            acc[feature] = new Date().toISOString();
            return acc;
          }, {} as Record<FeatureId, string>),
          lastUpdated: new Date().toISOString()
        };
        setCompanyFeatures(newCompanyFeatures);
        localStorage.setItem(`company-features-${companyId}`, JSON.stringify(newCompanyFeatures));
      }
    } catch (error) {
      logger.error('Error loading company features:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFeatureActive = (featureId: FeatureId): boolean => {
    return companyFeatures?.activeFeatures.includes(featureId) || false;
  };

  const updateFeatures = async (features: FeatureId[]) => {
    if (!companyFeatures) return;

    const updatedFeatures: CompanyFeatures = {
      ...companyFeatures,
      activeFeatures: features,
      activationDates: {
        ...companyFeatures.activationDates,
        ...features.reduce((acc, feature) => {
          if (!companyFeatures.activationDates[feature]) {
            acc[feature] = new Date().toISOString();
          }
          return acc;
        }, {} as Record<FeatureId, string>)
      },
      lastUpdated: new Date().toISOString()
    };

    setCompanyFeatures(updatedFeatures);
    localStorage.setItem(`company-features-${updatedFeatures.companyId}`, JSON.stringify(updatedFeatures));
  };

  return (
    <FeaturesContext.Provider value={{
      companyFeatures,
      isFeatureActive,
      updateFeatures,
      isLoading
    }}>
      {children}
    </FeaturesContext.Provider>
  );
};

export const useFeatures = () => {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeaturesProvider');
  }
  return context;
};
