import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import LMSOverview from '@/features/enterprise-admin/components/LMSOverview';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { toast } from 'sonner';

const LMSPage = () => {
  const { isLoading } = useRouteProtection('enterprise_admin');
  const { user, isEnterpriseAdmin } = useAuth();
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    const getAllTrainings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/trainings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("fandoro-token")}`,
          },
        });

        if (!res.ok) {
          toast.error("Invalid credentials");
          return;
        }

        const jsondata = await res.json();
        const { data } = jsondata;
        setTrainings(data);
      } catch (error) {
        console.error("API call:", error);
        toast.error("API Call failed. Please try again.");
      }
    };

    if (isEnterpriseAdmin()) {
      getAllTrainings();
    }
  }, [isEnterpriseAdmin]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isEnterpriseAdmin()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <LMSOverview />
        {/* or <LMSOverview ehsTraining={trainings} /> if you want to pass data */}
      </SidebarLayout>
    </div>
  );
};

export default LMSPage;
