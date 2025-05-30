
import React from 'react';
import { SidebarLayout } from '@/components/layout/Sidebar';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import EmployeeDashboard from '@/components/dashboard/EmployeeDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated, isCompanyUser, isEmployeeUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <SidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! 
              {isCompanyUser() ? 
                " Here's your company sustainability snapshot." : 
                " Here's your personal sustainability snapshot."}
            </p>
          </div>
          
          {isCompanyUser() ? <AdminDashboard /> : <EmployeeDashboard />}
        </div>
      </SidebarLayout>
    </div>
  );
};

export default Dashboard;
