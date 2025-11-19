import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { SDGProvider } from '@/contexts/SDGContext';
import SDGOverviewPage from './SDGOverviewPage';
import SDGStrategyPage from './SDGStrategyPage';
import SDGOutcomeMappingPage from './SDGOutcomeMappingPage';

const SDGPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <UnifiedSidebarLayout>
      <SDGProvider>
        <Routes>
          <Route index element={<SDGOverviewPage />} />
          <Route path="strategy" element={<SDGStrategyPage />} />
          <Route path="outcome-mapping" element={<SDGOutcomeMappingPage />} />
        </Routes>
      </SDGProvider>
    </UnifiedSidebarLayout>
  );
};

export default SDGPage;
