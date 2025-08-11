
import React from 'react';
import ComplianceDashboard from '@/components/compliance/ComplianceDashboard';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const CompliancePage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <ComplianceDashboard />;
};

export default CompliancePage;
