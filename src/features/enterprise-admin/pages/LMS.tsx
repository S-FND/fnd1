
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import LMSOverview from '@/features/enterprise-admin/components/LMSOverview';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';

const LMSPage = () => {
  const { isLoading } = useRouteProtection('enterprise_admin');
  const { user, isEnterpriseAdmin } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isEnterpriseAdmin()) {
    return <Navigate to="/login" />;
  }
  const [trainings,setTrainings]=useState([])
  const getAllTrainings = async () => {
    // Here you would typically save the data to your backend

    // setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}`+"/trainings", {
        method: "GET",
        headers: { "Content-Type": "application/json",Authorization : `Bearer ${localStorage.getItem("fandoro-token")}` },
      });
      if (!res.ok) {
        toast.error("Invalid credentials");
        // setIsLoading(false);
        return;
      }
      else{
        const jsondata = await res.json();
        const { data } = jsondata;
        console.log('data',data)
        setTrainings(data)
      }
    } catch (error) {
      console.error("Api call:", error);
      toast.error("API Call failed. Please try again.");
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(()=>{
    getAllTrainings()
  },[])

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <LMSOverview ehsTraining={trainings} />
      </SidebarLayout>
    </div>
  );
};

export default LMSPage;
