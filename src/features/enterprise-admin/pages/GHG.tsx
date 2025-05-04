
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import GHGCalculator from '@/features/enterprise-admin/components/GHGCalculator';
import EmissionsDataEntry from '@/features/enterprise-admin/components/EmissionsDataEntry';
import CarbonGoalTracker from '@/features/employee/components/ghg/CarbonGoalTracker';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { emissionsByLocation, emissionsYearly } from '@/data/emissions/data';

const GHGPage = () => {
  const { isLoading } = useRouteProtection('enterprise_admin');
  const { user, isEnterpriseAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isEnterpriseAdmin()) {
    return <Navigate to="/login" />;
  }

  // Define scope colors for consistency
  const scopeColors = {
    scope1: "#10b981", // green
    scope2: "#3b82f6", // blue
    scope3: "#f97316", // orange
    scope4: "#8b5cf6", // purple
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GHG Accounting</h1>
            <p className="text-muted-foreground">
              Calculate, track and reduce carbon emissions across your organization
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-[600px]">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
              <TabsTrigger value="goals">Carbon Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <div className="space-y-6">
                <GHGCalculator />
              </div>
            </TabsContent>
            <TabsContent value="data-entry">
              <EmissionsDataEntry />
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

export default GHGPage;
