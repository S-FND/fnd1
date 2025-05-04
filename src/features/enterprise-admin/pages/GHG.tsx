
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
import { emissionsByLocation, emissionsYearly } from '@/data/emissions/data';
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
                <Card>
                  <CardHeader>
                    <CardTitle>Carbon Emissions by Scope</CardTitle>
                    <CardDescription>Breakdown of emissions across all scopes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={emissionsByLocation}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="scope1" name="Scope 1" fill={scopeColors.scope1} />
                          <Bar dataKey="scope2" name="Scope 2" fill={scopeColors.scope2} />
                          <Bar dataKey="scope3" name="Scope 3" fill={scopeColors.scope3} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emissions Trend</CardTitle>
                    <CardDescription>Year-over-year emissions data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={emissionsYearly}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="emissions" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
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
