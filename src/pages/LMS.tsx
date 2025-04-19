
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import LMSOverview from '@/components/lms/LMSOverview';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const LMSPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <LMSOverview />
      </SidebarLayout>
    </div>
  );
};

export default LMSPage;
