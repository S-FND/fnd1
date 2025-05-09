
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import ESGDashboard from '@/features/enterprise-admin/components/ESGDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import ESGManagementPage from './ESGManagement';

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
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<ESGDashboard />} />
          <Route path="/management" element={<ESGManagementPage />} />
        </Routes>
      </SidebarLayout>
    </div>
  );
};

export default ESGPage;
