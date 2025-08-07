
import React from 'react';
import { SupplierLayout } from "@/components/layout/SupplierLayout";
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import SupplierDashboard from '@/components/supplier/SupplierDashboard';

const SupplierDashboardPage = () => {
  const { isLoading } = useRouteProtection('supplier');
  const { user, isAuthenticated, isSupplier } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus() || !isSupplier()) {
    return <Navigate to="/" />;
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Supplier Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's an overview of your sustainability compliance status.
          </p>
        </div>
        
        <SupplierDashboard />
      </div>
    </SupplierLayout>
  );
};

export default SupplierDashboardPage;
