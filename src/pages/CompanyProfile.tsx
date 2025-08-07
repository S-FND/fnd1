
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import EditableCompanyProfile from '@/features/enterprise-admin/components/profile/EditableCompanyProfile';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const CompanyProfilePage = () => {
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage company information, locations, and key metrics
          </p>
        </div>
        <EditableCompanyProfile />
      </div>
    </UnifiedSidebarLayout>
  );
};

export default CompanyProfilePage;
