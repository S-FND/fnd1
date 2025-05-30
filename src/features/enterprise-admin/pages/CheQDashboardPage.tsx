
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CheQDashboard from '../components/CheQDashboard';
import CheQMateriality from '../components/materiality/CheQMateriality';
import CheQStakeholders from '../components/stakeholders/CheQStakeholders';
import CheQGHGCalculator from '../components/ghg/CheQGHGCalculator';
import CheQAuditDashboard from '../components/audit/CheQAuditDashboard';
import CheQLMSOverview from '../components/lms/CheQLMSOverview';
import CheQEHSTrainings from '../components/ehs/CheQEHSTrainings';
import { companyInfo } from '../data/cheq-mock-data';

const CheQDashboardPage = () => {
  const { isLoading } = useRouteProtection(['admin']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <UnifiedSidebarLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{companyInfo.name}</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name}! Here's your company sustainability snapshot.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                <div>Industry: <span className="font-medium">{companyInfo.industry}</span></div>
                <div>Employees: <span className="font-medium">{companyInfo.employees.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList className="flex w-full flex-wrap">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="materiality">Materiality</TabsTrigger>
              <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
              <TabsTrigger value="ghg">GHG Accounting</TabsTrigger>
              <TabsTrigger value="audit">Supplier Audits</TabsTrigger>
              <TabsTrigger value="lms">LMS</TabsTrigger>
              <TabsTrigger value="ehs">EHS Trainings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <CheQDashboard />
            </TabsContent>
            
            <TabsContent value="materiality">
              <CheQMateriality />
            </TabsContent>
            
            <TabsContent value="stakeholders">
              <CheQStakeholders />
            </TabsContent>
            
            <TabsContent value="ghg">
              <CheQGHGCalculator />
            </TabsContent>
            
            <TabsContent value="audit">
              <CheQAuditDashboard />
            </TabsContent>
            
            <TabsContent value="lms">
              <CheQLMSOverview />
            </TabsContent>
            
            <TabsContent value="ehs">
              <CheQEHSTrainings />
            </TabsContent>
          </Tabs>
        </div>
      </UnifiedSidebarLayout>
    </div>
  );
};

export default CheQDashboardPage;
