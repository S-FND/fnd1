
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import AuditDashboard from '@/components/audit/AuditDashboard';

const SupplierAuditsPage = () => {
  const { isAuthenticated, isCompanyUser,isAuthenticatedStatus } = useAuth();

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  if (!isCompanyUser()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Supplier Audits</h1>
          <p className="text-muted-foreground">
            Manage and track sustainability audits for your suppliers
          </p>
        </div>
        
        <AuditDashboard />
      </div>
    </UnifiedSidebarLayout>
  );
};

export default SupplierAuditsPage;
