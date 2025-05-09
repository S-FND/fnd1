
import React from 'react';
import ManageStakeholders from '../../components/stakeholders/ManageStakeholders';
import { EnhancedSidebarLayout } from '@/components/layout/EnhancedSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const ManageStakeholdersPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'manager')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <EnhancedSidebarLayout>
        <ManageStakeholders />
      </EnhancedSidebarLayout>
    </div>
  );
};

export default ManageStakeholdersPage;
