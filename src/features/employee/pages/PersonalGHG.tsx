
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import PersonalGHGCalculator from '@/features/employee/components/PersonalGHGCalculator';

const PersonalGHGPage = () => {
  const { isLoading } = useRouteProtection('employee');
  const { isEmployeeUser } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isEmployeeUser()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Personal Carbon Footprint</h1>
            <p className="text-muted-foreground">
              Calculate and track your personal carbon emissions
            </p>
          </div>
          <PersonalGHGCalculator />
        </div>
      </SidebarLayout>
    </div>
  );
};

export default PersonalGHGPage;
