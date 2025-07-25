
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ComplianceDashboard from '@/components/compliance/ComplianceDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const CompliancePage = () => {
  const { isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  return (
    <UnifiedSidebarLayout>
      <ComplianceDashboard />
    </UnifiedSidebarLayout>
  );
};

export default CompliancePage;
