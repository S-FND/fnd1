
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamManagementDashboard from '../components/team/TeamManagementDashboard';
// import TeamPermissionsPage from '@/components/admin/TeamPermissionsPage';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Users, Shield } from 'lucide-react';

const TeamManagementPage = () => {
  const { isLoading } = useRouteProtection(['admin']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">
          Manage employees, assign roles, and control access to specific pages and features.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Overview
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Page Permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <TeamManagementDashboard />
        </TabsContent>
        
        {/* <TabsContent value="permissions">
          <TeamPermissionsPage />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default TeamManagementPage;
