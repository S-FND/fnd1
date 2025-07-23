
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import TeamManagementDashboard from '../components/team/TeamManagementDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const TeamManagementPage = () => {
  const { isLoading } = useRouteProtection(['admin']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus() || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">
            Manage employees, assign roles, and organize teams across locations and departments.
          </p>
        </div>
        
        <TeamManagementDashboard />
      </div>
    </UnifiedSidebarLayout>
  );
};

export default TeamManagementPage;
