
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import AuditDashboard from '@/components/audit/AuditDashboard';
import { logger } from '@/hooks/logger';

const SupplierAuditsPage = () => {
  logger.debug('Rendering SupplierAuditsPage component');
  const { isAuthenticated, isCompanyUser,isAuthenticatedStatus } = useAuth();

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  if (!isCompanyUser()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <AuditDashboard />
      </div>
    </UnifiedSidebarLayout>
  );
};

export default SupplierAuditsPage;
