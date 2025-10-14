
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import UnitsManagement from '@/components/units/UnitsManagement';
import { logger } from '@/hooks/logger';

const UnitsPage = () => {
  logger.debug('Rendering UnitsPage component');
  const { isAuthenticated, user,isAuthenticatedStatus } = useAuth();

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Units Management</h1>
          <p className="text-muted-foreground">
            Manage your company's units across multiple locations
          </p>
        </div>
        <UnitsManagement />
      </div>
    </UnifiedSidebarLayout>
  );
};

export default UnitsPage;
