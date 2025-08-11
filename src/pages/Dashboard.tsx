
import React from 'react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import EmployeeDashboard from '@/components/dashboard/EmployeeDashboard';
import { useAuth } from '@/context/AuthContext';
import { useFeatures } from '@/context/FeaturesContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated, isCompanyUser, isEmployeeUser, isLoading } = useAuth();
  const { isLoading: featuresLoading } = useFeatures();

  if (isLoading || featuresLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return isCompanyUser() ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default Dashboard;
