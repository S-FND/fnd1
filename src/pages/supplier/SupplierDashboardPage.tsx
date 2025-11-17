
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SupplierLayout } from '@/components/layout/SupplierLayout';
import SupplierDashboard from '@/components/supplier/SupplierDashboard';
import { logger } from '@/hooks/logger';

const SupplierDashboardPage = () => {
  logger.debug('Rendering SupplierDashboardPage component');
  const { user, isAuthenticated, isSupplier,isAuthenticatedStatus } = useAuth();

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  if (!isSupplier()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <SupplierLayout>
      <SupplierDashboard />
    </SupplierLayout>
  );
};

export default SupplierDashboardPage;
