
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ESGDashboard from '@/features/enterprise-admin/components/ESGDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import ESGManagementPage from './ESGManagement';
import BRSRReport from './BRSRReport';
import GRIReport from './GRIReport';
import TCFDReport from './TCFDReport';
import ESRSReport from './ESRSReport';
import ImpactReport from './ImpactReport';
import ReportsPage from './Reports';

const ESGPage = () => {
  const { isLoading } = useRouteProtection('enterprise_admin');
  const { user, isEnterpriseAdmin } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isEnterpriseAdmin()) {
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <UnifiedSidebarLayout>
          <ESGDashboard />
        </UnifiedSidebarLayout>
      } />
      <Route path="/management" element={
        <UnifiedSidebarLayout>
          <ESGManagementPage />
        </UnifiedSidebarLayout>
      } />
      <Route path="/reports" element={
        <UnifiedSidebarLayout>
          <ReportsPage />
        </UnifiedSidebarLayout>
      } />
      <Route path="/reports/brsr" element={<BRSRReport />} />
      <Route path="/reports/gri" element={<GRIReport />} />
      <Route path="/reports/tcfd" element={<TCFDReport />} />
      <Route path="/reports/esrs" element={<ESRSReport />} />
      <Route path="/reports/impact" element={<ImpactReport />} />
    </Routes>
  );
};

export default ESGPage;
