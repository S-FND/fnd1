
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import GHGAccountingPage from '@/features/enterprise-admin/pages/GHGAccounting';

const UnitGHGAccountingPage = () => {
  const { isLoading } = useRouteProtection(['unit_admin']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus() || user?.role !== 'unit_admin') {
    return <Navigate to="/" />;
  }

  return <GHGAccountingPage />;
};

export default UnitGHGAccountingPage;
