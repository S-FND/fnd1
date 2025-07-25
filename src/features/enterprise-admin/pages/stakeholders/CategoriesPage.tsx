
import React from 'react';
import CategoryManagement from '../../components/stakeholders/CategoryManagement';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const CategoriesPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus() || (user?.role !== 'admin' && user?.role !== 'manager')) {
    return <Navigate to="/" />;
  }

  return (
    <UnifiedSidebarLayout>
      <CategoryManagement />
    </UnifiedSidebarLayout>
  );
};

export default CategoriesPage;
