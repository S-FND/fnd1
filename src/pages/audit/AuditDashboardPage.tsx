
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import AuditDashboard from '@/components/audit/AuditDashboard';
import { logger } from '@/hooks/logger';

const AuditDashboardPage = () => {
  logger.debug('Rendering AuditDashboardPage component');
  const { isAuthenticated, isCompanyUser,isAuthenticatedStatus } = useAuth();

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  if (!isCompanyUser()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <UnifiedSidebarLayout>
      <AuditDashboard />
    </UnifiedSidebarLayout>
  );
};

export default AuditDashboardPage;
