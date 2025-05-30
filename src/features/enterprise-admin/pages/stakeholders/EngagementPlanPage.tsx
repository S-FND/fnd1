
import React from 'react';
import EngagementPlan from '../../components/stakeholders/EngagementPlan';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const EngagementPlanPage = () => {
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
      <UnifiedSidebarLayout>
        <EngagementPlan />
      </UnifiedSidebarLayout>
    </div>
  );
};

export default EngagementPlanPage;
