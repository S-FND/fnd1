
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import AuditChecklist from '@/components/audit/AuditChecklist';
import AuditSupplierSharing from '@/components/audit/AuditSupplierSharing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AuditChecklistPage = () => {
  const { isAuthenticated, isCompanyUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isCompanyUser()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit Checklists</h1>
            <p className="text-muted-foreground">
              Manage sustainability audit checklists and share with suppliers
            </p>
          </div>
          
          <Tabs defaultValue="checklists">
            <TabsList>
              <TabsTrigger value="checklists">Audit Checklists</TabsTrigger>
              <TabsTrigger value="sharing">Supplier Sharing</TabsTrigger>
            </TabsList>
            <TabsContent value="checklists">
              <AuditChecklist />
            </TabsContent>
            <TabsContent value="sharing">
              <AuditSupplierSharing />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default AuditChecklistPage;
