
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { EnhancedSidebarLayout } from '@/components/layout/EnhancedSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Navigate } from 'react-router-dom';
import { GHGScope1Form } from '../components/ghg/GHGScope1Form';
import { GHGScope2Form } from '../components/ghg/GHGScope2Form';
import { GHGScope3Form } from '../components/ghg/GHGScope3Form';
import { GHGScope4Form } from '../components/ghg/GHGScope4Form';
import { GHGSummary } from '../components/ghg/GHGSummary';
import { GHGDataAssignment } from '../components/ghg/GHGDataAssignment';
import { companyInfo } from '../components/ghg/summary/mockData';

const GHGAccountingPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("summary");

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
    return <Navigate to="/login" />;
  }

  const isUnitAdmin = user?.role === 'unit_admin';
  const unitName = isUnitAdmin && user?.units?.find(unit => unit.id === user?.unitId)?.name;

  return (
    <div className="min-h-screen">
      <Navbar />
      <EnhancedSidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GHG Accounting</h1>
            <p className="text-muted-foreground">
              {isUnitAdmin 
                ? `Manage carbon emissions data for ${unitName || 'your unit'}.` 
                : `Manage enterprise-wide carbon emissions for ${companyInfo.name}.`}
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Company Overview</CardTitle>
              <CardDescription>Key information about IMR Resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Headquarters</h3>
                  <p className="text-sm text-muted-foreground">{companyInfo.headquarters}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Established</h3>
                  <p className="text-sm text-muted-foreground">{companyInfo.established}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Operations</h3>
                  <p className="text-sm text-muted-foreground">{companyInfo.operations.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Annual Trading Volume</h3>
                  <p className="text-sm text-muted-foreground">{companyInfo.annualTradingVolume}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Business Units</h3>
                  <p className="text-sm text-muted-foreground">{companyInfo.businessUnits.length} units across {companyInfo.operations.length} countries</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Total Employees</h3>
                  <p className="text-sm text-muted-foreground">
                    {companyInfo.businessUnits.reduce((sum, unit) => sum + unit.employees, 0)} employees
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="scope1">Scope 1</TabsTrigger>
              <TabsTrigger value="scope2">Scope 2</TabsTrigger>
              <TabsTrigger value="scope3">Scope 3</TabsTrigger>
              <TabsTrigger value="scope4">Scope 4</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-6">
              <GHGSummary />
            </TabsContent>
            
            <TabsContent value="scope1" className="mt-6">
              <GHGScope1Form />
            </TabsContent>
            
            <TabsContent value="scope2" className="mt-6">
              <GHGScope2Form />
            </TabsContent>
            
            <TabsContent value="scope3" className="mt-6">
              <GHGScope3Form />
            </TabsContent>
            
            <TabsContent value="scope4" className="mt-6">
              <GHGScope4Form />
            </TabsContent>
            
            <TabsContent value="assignments" className="mt-6">
              <GHGDataAssignment />
            </TabsContent>
          </Tabs>
        </div>
      </EnhancedSidebarLayout>
    </div>
  );
};

export default GHGAccountingPage;
