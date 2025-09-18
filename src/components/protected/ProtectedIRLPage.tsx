import React, { useMemo } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { usePermissionBasedNavigation } from '@/hooks/usePermissionBasedNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import IRLCompanyInformation from '@/features/enterprise-admin/components/irl/IRLCompanyInformation';
import IRLHRInformation from '@/features/enterprise-admin/components/irl/IRLHRInformation';
import IRLBusinessOperations from '@/features/enterprise-admin/components/irl/IRLBusinessOperations';
import IRLPhotographs from '@/features/enterprise-admin/components/irl/IRLPhotographs';
import IRLCompliance from '@/features/enterprise-admin/components/irl/IRLCompliance';
import IRLManagement from '@/features/enterprise-admin/components/irl/IRLManagement';
import IRLITSecurity from '@/features/enterprise-admin/components/irl/IRLITSecurity';
import IRLWarehouse from '@/features/enterprise-admin/components/irl/IRLWarehouse';
import IRLAdditionalFacility from '@/features/enterprise-admin/components/irl/IRLAdditionalFacility';
import IRLGovernance from '@/features/enterprise-admin/components/irl/IRLGovernance';

const ProtectedIRLPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated } = useAuth();
  const { canAccessTab, getAccessibleTabs } = usePermissionBasedNavigation();

  // Define all IRL tabs with their components
  const allTabs = [
    { id: 'company', name: 'Company', component: IRLCompanyInformation },
    { id: 'hr', name: 'HR', component: IRLHRInformation },
    { id: 'business', name: 'Business', component: IRLBusinessOperations },
    { id: 'photographs', name: 'Photos', component: IRLPhotographs },
    { id: 'compliance', name: 'Compliance', component: IRLCompliance },
    { id: 'management', name: 'Management', component: IRLManagement },
    { id: 'itsecurity', name: 'IT Security', component: IRLITSecurity },
    { id: 'warehouse', name: 'Warehouse', component: IRLWarehouse },
    { id: 'facility', name: 'Facility', component: IRLAdditionalFacility },
    { id: 'governance', name: 'Governance', component: IRLGovernance }
  ];

  // Filter tabs based on permissions
  const accessibleTabs = useMemo(() => {
    return allTabs.filter(tab => canAccessTab('esg-dd.irl', tab.id));
  }, [canAccessTab]);

  // Get default tab (first accessible tab)
  const defaultTab = accessibleTabs.length > 0 ? accessibleTabs[0].id : null;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'manager')) {
    return <Navigate to="/login" />;
  }

  // Check if user has access to IRL page itself
  const { hasPermission } = usePermissionBasedNavigation();
  if (!hasPermission('esg-dd.irl')) {
    return <Navigate to="/dashboard" />;
  }

  // If no accessible tabs, show access denied message
  if (accessibleTabs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Information Request List (IRL)</h1>
          <p className="text-muted-foreground">
            Complete the comprehensive information request forms for ESG due diligence.
          </p>
        </div>
        
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have access to any IRL sections. Please contact your administrator to request access to specific sections.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Information Request List (IRL)</h1>
        <p className="text-muted-foreground">
          Complete the comprehensive information request forms for ESG due diligence.
        </p>
      </div>
      
      <Tabs defaultValue={defaultTab || undefined} className="space-y-4">
        <TabsList className={`grid w-full ${accessibleTabs.length <= 5 ? `grid-cols-${accessibleTabs.length}` : 'grid-cols-5 lg:grid-cols-10'}`}>
          {accessibleTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {accessibleTabs.map((tab) => {
          const TabComponent = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id}>
              <TabComponent />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ProtectedIRLPage;