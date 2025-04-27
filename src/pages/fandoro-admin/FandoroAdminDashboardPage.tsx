
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import FandoroAdminDashboard from '@/components/fandoro-admin/FandoroAdminDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const FandoroAdminDashboardPage = () => {
  const { isLoading } = useRouteProtection('fandoro_admin');
  const { user, isFandoroAdmin } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isFandoroAdmin()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Fandoro Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {user?.name}! Here's an overview of all enterprises and their ESG performance.
            </p>
          </div>
          
          <FandoroAdminDashboard />
        </div>
      </SidebarLayout>
    </div>
  );
};

export default FandoroAdminDashboardPage;
