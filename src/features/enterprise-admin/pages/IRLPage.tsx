
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IRLCompanyInformation from '../components/irl/IRLCompanyInformation';
import IRLHRInformation from '../components/irl/IRLHRInformation';
import IRLBusinessOperations from '../components/irl/IRLBusinessOperations';
import IRLPhotographs from '../components/irl/IRLPhotographs';
import IRLCompliance from '../components/irl/IRLCompliance';
import IRLManagement from '../components/irl/IRLManagement';
import IRLITSecurity from '../components/irl/IRLITSecurity';
import IRLWarehouse from '../components/irl/IRLWarehouse';
import IRLAdditionalFacility from '../components/irl/IRLAdditionalFacility';
import IRLGovernance from '../components/irl/IRLGovernance';

const IRLPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'manager')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Information Request List (IRL)</h1>
        <p className="text-muted-foreground">
          Complete the comprehensive information request forms for ESG due diligence.
        </p>
      </div>
      
      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="hr">HR</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="photographs">Photos</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="itsecurity">IT Security</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
          <TabsTrigger value="facility">Facility</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <IRLCompanyInformation />
        </TabsContent>
        
        <TabsContent value="hr">
          <IRLHRInformation />
        </TabsContent>

        <TabsContent value="business">
          <IRLBusinessOperations />
        </TabsContent>

        <TabsContent value="photographs">
          <IRLPhotographs />
        </TabsContent>

        <TabsContent value="compliance">
          <IRLCompliance />
        </TabsContent>

        <TabsContent value="management">
          <IRLManagement />
        </TabsContent>

        <TabsContent value="itsecurity">
          <IRLITSecurity />
        </TabsContent>

        <TabsContent value="warehouse">
          <IRLWarehouse />
        </TabsContent>

        <TabsContent value="facility">
          <IRLAdditionalFacility />
        </TabsContent>

        <TabsContent value="governance">
          <IRLGovernance />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IRLPage;
