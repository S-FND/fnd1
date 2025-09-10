
import React from 'react';
import ManageStakeholders from '../../components/stakeholders/ManageStakeholders';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const ManageStakeholdersPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    console.log("user?.role",user?.role)
    // return <Navigate to="/" />;
  }

  return (
    <UnifiedSidebarLayout>
      <ManageStakeholders />
    </UnifiedSidebarLayout>
  );
};

export default ManageStakeholdersPage;
