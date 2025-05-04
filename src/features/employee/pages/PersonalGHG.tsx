
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import PersonalGHGCalculator from '@/features/employee/components/PersonalGHGCalculator';
import CarbonGoalTracker from '@/features/employee/components/ghg/CarbonGoalTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              Calculate, track and reduce your personal carbon emissions
            </p>
          </div>
          
          <Tabs defaultValue="calculator" className="space-y-4">
            <TabsList>
              <TabsTrigger value="calculator">Carbon Calculator</TabsTrigger>
              <TabsTrigger value="goals">My Carbon Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="calculator">
              <PersonalGHGCalculator />
            </TabsContent>
            <TabsContent value="goals">
              <CarbonGoalTracker />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default PersonalGHGPage;
