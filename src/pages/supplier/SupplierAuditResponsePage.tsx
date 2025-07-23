
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SupplierLayout } from '@/components/layout/SupplierLayout';
import SupplierAuditResponse from '@/components/supplier/SupplierAuditResponse';

const SupplierAuditResponsePage = () => {
  const { user, isAuthenticated, isSupplier,isAuthenticatedStatus } = useAuth();
  const { auditId } = useParams();

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  if (!isSupplier()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <SupplierLayout>
      <SupplierAuditResponse />
    </SupplierLayout>
  );
};

export default SupplierAuditResponsePage;
