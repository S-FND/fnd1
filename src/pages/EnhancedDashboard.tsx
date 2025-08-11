
import React from 'react';
import OverviewDashboard from '@/components/dashboard/OverviewDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const EnhancedDashboard = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'manager')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enterprise Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your company sustainability overview.
        </p>
      </div>
      
      <OverviewDashboard />
    </div>
  );
};

export default EnhancedDashboard;
