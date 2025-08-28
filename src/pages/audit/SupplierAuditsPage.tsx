
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuditDashboard from '@/components/audit/AuditDashboard';

const SupplierAuditsPage = () => {
  const { isAuthenticated, isCompanyUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isCompanyUser()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supplier Audits</h1>
        <p className="text-muted-foreground">
          Manage and track sustainability audits for your suppliers
        </p>
      </div>
      
      <AuditDashboard />
    </div>
  );
};

export default SupplierAuditsPage;
