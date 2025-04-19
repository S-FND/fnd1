
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import GHGCalculator from '@/components/ghg/GHGCalculator';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const GHGPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GHG Accounting</h1>
            <p className="text-muted-foreground">
              Calculate and track carbon emissions across your organization and personal activities
            </p>
          </div>
          <GHGCalculator />
        </div>
      </SidebarLayout>
    </div>
  );
};

export default GHGPage;
