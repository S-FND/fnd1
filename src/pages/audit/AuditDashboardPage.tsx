
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SidebarLayout } from '@/components/layout/Sidebar';
import AuditDashboard from '@/components/audit/AuditDashboard';

const AuditDashboardPage = () => {
  const { isAuthenticated, isCompanyUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isCompanyUser()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <SidebarLayout>
      <AuditDashboard />
    </SidebarLayout>
  );
};

export default AuditDashboardPage;
