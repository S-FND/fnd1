import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SupplierLayout } from '@/components/layout/SupplierLayout';
import GHGInventory from '@/components/supplier/GHGInventory';

const GHGInventoryPage = () => {
  const { user, isAuthenticated, isSupplier,isAuthenticatedStatus } = useAuth();

  if (!isAuthenticatedStatus) {
    return <Navigate to="/" />;
  }

  if (!isSupplier()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <SupplierLayout>
      <GHGInventory />
    </SupplierLayout>
  );
};

export default GHGInventoryPage;