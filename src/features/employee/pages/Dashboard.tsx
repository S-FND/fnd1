
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import EmployeeDashboard from '@/features/employee/components/Dashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const EmployeeDashboardPage = () => {
  const { isLoading } = useRouteProtection(['employee']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'employee') {
    return <Navigate to="/login" />;
  }

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Personal Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's your personal sustainability snapshot.
          </p>
        </div>
        
        <EmployeeDashboard />
      </div>
    </UnifiedSidebarLayout>
  );
};

export default EmployeeDashboardPage;
