
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamManagementDashboard from '../components/team/TeamManagementDashboard';
// import TeamPermissionsPage from '@/components/admin/TeamPermissionsPage';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Users, Shield } from 'lucide-react';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { log } from 'console';
import { logger } from '@/hooks/logger';

const TeamManagementPage = () => {
  logger.debug('Rendering TeamManagementPage component');
  const { isLoading } = useRouteProtection(['admin']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
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
