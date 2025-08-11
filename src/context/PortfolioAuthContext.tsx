import React, { createContext, useContext } from 'react';
import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, PortfolioRole, RolePermission } from '@/types/portfolio';

interface PortfolioAuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  permissions: RolePermission[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (email: string, password: string, inviteCode?: string, fullName?: string) => Promise<any>;
  checkPermission: (resource: string, action: string) => boolean;
  redirectToDashboard: (role: PortfolioRole) => void;
}

const PortfolioAuthContext = createContext<PortfolioAuthContextType | null>(null);

export const PortfolioAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = usePortfolioAuth();

  return (
    <PortfolioAuthContext.Provider value={auth}>
      {children}
    </PortfolioAuthContext.Provider>
  );
};

export const usePortfolioAuthContext = () => {
  const context = useContext(PortfolioAuthContext);
  if (!context) {
    throw new Error('usePortfolioAuthContext must be used within a PortfolioAuthProvider');
  }
  return context;
};