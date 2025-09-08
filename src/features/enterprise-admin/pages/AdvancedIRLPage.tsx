
import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedIRLCompany from '../components/advanced-irl/AdvancedIRLCompany';
import AdvancedIRLHR from '../components/advanced-irl/AdvancedIRLHR';
import AdvancedIRLEnvironment from '../components/advanced-irl/AdvancedIRLEnvironment';
import AdvancedIRLPhotos from '../components/advanced-irl/AdvancedIRLPhotos';
import AdvancedIRLManagement from '../components/advanced-irl/AdvancedIRLManagement';
import AdvancedIRLFacility from '../components/advanced-irl/AdvancedIRLFacility';
import AdvancedIRLITSecurity from '../components/advanced-irl/AdvancedIRLITSecurity';

const AdvancedIRLPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated,isAuthenticatedStatus } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Advanced Information Request List (IRL)</h1>
          <p className="text-muted-foreground">
            Complete the comprehensive advanced ESG due diligence forms with detailed BRSR compliance requirements.
          </p>
        </div>
        
        <Tabs defaultValue="company" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="hr">HR</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="facility">Facility</TabsTrigger>
            <TabsTrigger value="itsecurity">IT Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <AdvancedIRLCompany />
          </TabsContent>
          
          <TabsContent value="hr">
            <AdvancedIRLHR />
          </TabsContent>

          <TabsContent value="environment">
            <AdvancedIRLEnvironment />
          </TabsContent>

          <TabsContent value="photos">
            <AdvancedIRLPhotos />
          </TabsContent>

          <TabsContent value="management">
            <AdvancedIRLManagement />
          </TabsContent>

          <TabsContent value="facility">
            <AdvancedIRLFacility />
          </TabsContent>

          <TabsContent value="itsecurity">
            <AdvancedIRLITSecurity />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default AdvancedIRLPage;
