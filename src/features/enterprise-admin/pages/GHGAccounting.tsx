
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
                : 'Manage enterprise-wide carbon emissions across all scopes.'}
            </p>
          </div>

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
