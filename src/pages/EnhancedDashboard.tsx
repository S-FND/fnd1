
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import OverviewDashboard from '@/components/dashboard/OverviewDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { logger } from '@/hooks/logger';

const EnhancedDashboard = () => {
  logger.debug('Rendering EnhancedDashboard component');
  const { isLoading } = useRouteProtection(['admin', 'manager','employee']);
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
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's your company sustainability overview.
          </p>
        </div>
        
        <OverviewDashboard />
      </div>
    </UnifiedSidebarLayout>
  );
};

export default EnhancedDashboard;
