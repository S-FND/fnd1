
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IRLCompanyInformation from '../components/irl/IRLCompanyInformation';
import IRLHRInformation from '../components/irl/IRLHRInformation';

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
    <div className="min-h-screen">
      <Navbar />
      <UnifiedSidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Information Request List (IRL)</h1>
            <p className="text-muted-foreground">
              Complete the comprehensive information request forms for ESG due diligence.
            </p>
          </div>
          
          <Tabs defaultValue="company" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="company">Company Information</TabsTrigger>
              <TabsTrigger value="hr">HR</TabsTrigger>
            </TabsList>
            
            <TabsContent value="company">
              <IRLCompanyInformation />
            </TabsContent>
            
            <TabsContent value="hr">
              <IRLHRInformation />
            </TabsContent>
          </Tabs>
        </div>
      </UnifiedSidebarLayout>
    </div>
  );
};

export default IRLPage;
