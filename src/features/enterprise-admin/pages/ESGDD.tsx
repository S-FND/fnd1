
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { EnhancedSidebarLayout } from '@/components/layout/EnhancedSidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, FileSearch, Database } from 'lucide-react';

const ESGDDPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <EnhancedSidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ESG Due Diligence</h1>
            <p className="text-muted-foreground">
              Create, manage, and track ESG due diligence assessments and corrective action plans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Manual ESG DD
                </CardTitle>
                <CardDescription>Create detailed ESG due diligence assessments manually</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Perform comprehensive ESG due diligence assessments with customizable templates 
                  and frameworks based on industry best practices.
                </p>
                <Button asChild className="w-full">
                  <Link to="/esg-dd/manual">View Manual ESG DD</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileSearch className="h-5 w-5 text-primary" />
                  Automated ESG DD
                </CardTitle>
                <CardDescription>Generate ESG assessments automatically</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Use our automated system to generate ESG due diligence reports 
                  based on company profile, regulatory requirements, and funding stage.
                </p>
                <Button asChild className="w-full">
                  <Link to="/esg-dd/automated">View Automated ESG DD</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  ESG CAP
                </CardTitle>
                <CardDescription>Manage ESG corrective action plans</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track and manage corrective action plans generated from ESG due diligence, 
                  including timelines, responsibilities, and completion status.
                </p>
                <Button asChild className="w-full">
                  <Link to="/esg-dd/cap">View ESG CAP</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </EnhancedSidebarLayout>
    </div>
  );
};

export default ESGDDPage;
