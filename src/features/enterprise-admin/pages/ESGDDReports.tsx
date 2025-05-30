
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockESGDDReports } from '../data/esgDD';
import { ESGDDReportsList } from '../components/esg-dd/ESGDDReportsList';
import { ArrowLeft, FileSearch, Plus } from 'lucide-react';

const ESGDDReportsPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated } = useAuth();

  // Filter reports by type
  const allReports = mockESGDDReports;
  const manualReports = mockESGDDReports.filter(report => report.type === 'manual');
  const automatedReports = mockESGDDReports.filter(report => report.type === 'automated');

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
          <div className="flex justify-between items-center">
            <div>
              <Link to="/esg-dd" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to ESG DD
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">ESG DD Reports</h1>
              <p className="text-muted-foreground">
                View and manage all your ESG due diligence reports, both manual and automated.
              </p>
            </div>
            
            <Button asChild>
              <Link to="/esg-dd">
                <Plus className="h-4 w-4 mr-2" />
                New ESG DD
              </Link>
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-primary" />
                ESG Due Diligence Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Reports ({allReports.length})</TabsTrigger>
                  <TabsTrigger value="manual">Manual ({manualReports.length})</TabsTrigger>
                  <TabsTrigger value="automated">Automated ({automatedReports.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ESGDDReportsList reports={allReports} />
                </TabsContent>
                
                <TabsContent value="manual">
                  <ESGDDReportsList reports={manualReports} />
                </TabsContent>
                
                <TabsContent value="automated">
                  <ESGDDReportsList reports={automatedReports} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </UnifiedSidebarLayout>
    </div>
  );
};

export default ESGDDReportsPage;
