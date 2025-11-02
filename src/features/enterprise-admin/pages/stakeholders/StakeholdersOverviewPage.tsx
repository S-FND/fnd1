
import React from 'react';
import StakeholderOverview from '../../components/stakeholders/StakeholderOverview';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { logger } from '@/hooks/logger';

const StakeholdersOverviewPage = () => {
  logger.debug('Rendering StakeholdersOverviewPage component');
  const { isLoading } = useRouteProtection(['admin', 'manager','employee']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  return (
    <UnifiedSidebarLayout>
      <StakeholderOverview />
    </UnifiedSidebarLayout>
  );
};

export default StakeholdersOverviewPage;
