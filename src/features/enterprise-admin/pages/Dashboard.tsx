
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import AdminDashboard from '@/features/enterprise-admin/components/Dashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const EnterpriseAdminDashboardPage = () => {
  const { isLoading } = useRouteProtection(['admin']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <UnifiedSidebarLayout>
      <AdminDashboard />
    </UnifiedSidebarLayout>
  );
};

export default EnterpriseAdminDashboardPage;
