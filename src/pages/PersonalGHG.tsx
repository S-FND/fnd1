
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import PersonalGHGCalculator from '@/components/ghg/PersonalGHGCalculator';

const PersonalGHGPage = () => {
  const { isAuthenticated, isEmployeeUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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
