
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import ESGManagementPage from './ESGManagement';
import ESMSPage from './ESMSPage';
import ESGMetricsPage from './ESGMetricsPage';
import BRSRReport from './BRSRReport';
import GRIReport from './GRIReport';
import TCFDReport from './TCFDReport';
import ESRSReport from './ESRSReport';
import ImpactReport from './ImpactReport';
import ReportsPage from './Reports';

const ESGPage = () => {
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
        <Route index element={<ESGManagementPage />} />
        <Route path="esms" element={<ESMSPage />} />
        <Route path="metrics" element={<ESGMetricsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/brsr" element={<BRSRReport />} />
        <Route path="reports/gri" element={<GRIReport />} />
        <Route path="reports/tcfd" element={<TCFDReport />} />
        <Route path="reports/esrs" element={<ESRSReport />} />
        <Route path="reports/impact" element={<ImpactReport />} />
      </Routes>
    </UnifiedSidebarLayout>
  );
};

export default ESGPage;
