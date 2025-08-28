
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import AuditDashboard from '@/components/audit/AuditDashboard';

const SupplierAuditsPage = () => {
  const { isAuthenticated, isCompanyUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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

export default SupplierAuditsPage;
