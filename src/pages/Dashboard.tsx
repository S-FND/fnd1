
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import EmployeeDashboard from '@/components/dashboard/EmployeeDashboard';
import { useAuth } from '@/context/AuthContext';
import { useFeatures } from '@/context/FeaturesContext';
import { Navigate } from 'react-router-dom';
import { logger } from '@/hooks/logger';

const Dashboard = () => {
  logger.debug('Rendering Dashboard component');
  const { user, isAuthenticated, isCompanyUser, isEmployeeUser, isLoading,isAuthenticatedStatus } = useAuth();
  const { isLoading: featuresLoading } = useFeatures();

  if (isLoading || featuresLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  return (
    <UnifiedSidebarLayout>
      {isCompanyUser() ? <AdminDashboard /> : <EmployeeDashboard />}
    </UnifiedSidebarLayout>
  );
};

export default Dashboard;
