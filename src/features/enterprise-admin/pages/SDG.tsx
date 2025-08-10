import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import SDGOverviewPage from './SDGOverviewPage';
import SDGStrategyPage from './SDGStrategyPage';

const SDGPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <UnifiedSidebarLayout>
      <Routes>
        <Route index element={<SDGOverviewPage />} />
        <Route path="strategy" element={<SDGStrategyPage />} />
      </Routes>
    </UnifiedSidebarLayout>
  );
};

export default SDGPage;