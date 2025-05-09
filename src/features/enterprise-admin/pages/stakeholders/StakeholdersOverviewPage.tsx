
import React from 'react';
import StakeholderOverview from '../../components/stakeholders/StakeholderOverview';
import { EnhancedSidebarLayout } from '@/components/layout/EnhancedSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const StakeholdersOverviewPage = () => {
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
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Stakeholder Management</h1>
            <p className="text-muted-foreground">
              Manage your organization's stakeholders and their engagement.
            </p>
          </div>
          
          <StakeholderOverview />
        </div>
      </EnhancedSidebarLayout>
    </div>
  );
};

export default StakeholdersOverviewPage;
