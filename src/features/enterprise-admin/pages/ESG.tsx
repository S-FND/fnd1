
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ESGDashboard from '@/features/enterprise-admin/components/ESGDashboard';
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
      <Route path="/esms" element={
        <UnifiedSidebarLayout>
          <ESMSPage />
        </UnifiedSidebarLayout>
      } />
      <Route path="/metrics" element={
        <UnifiedSidebarLayout>
          <ESGMetricsPage />
        </UnifiedSidebarLayout>
      } />
      <Route path="/reports" element={
        <UnifiedSidebarLayout>
          <ReportsPage />
        </UnifiedSidebarLayout>
      } />
      <Route path="/reports/brsr" element={
        <UnifiedSidebarLayout>
          <BRSRReport />
        </UnifiedSidebarLayout>
      } />
      <Route path="/reports/gri" element={
        <UnifiedSidebarLayout>
          <GRIReport />
        </UnifiedSidebarLayout>
      } />
      <Route path="/reports/tcfd" element={
        <UnifiedSidebarLayout>
          <TCFDReport />
        </UnifiedSidebarLayout>
      } />
      <Route path="/reports/esrs" element={
        <UnifiedSidebarLayout>
          <ESRSReport />
        </UnifiedSidebarLayout>
      } />
      <Route path="/reports/impact" element={
        <UnifiedSidebarLayout>
          <ImpactReport />
        </UnifiedSidebarLayout>
      } />
    </Routes>
  );
};

export default ESGPage;
