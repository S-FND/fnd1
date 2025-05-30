
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
import { ESGDDWizard } from '../components/esg-dd/ESGDDWizard';
import { ArrowLeft, FileSearch, Plus } from 'lucide-react';

const AutomatedESGDDPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [wizardActive, setWizardActive] = useState(false);

  // Filter only automated reports
  const automatedReports = mockESGDDReports.filter(report => report.type === 'automated');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
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
              <h1 className="text-2xl font-bold tracking-tight">Automated ESG Due Diligence</h1>
              <p className="text-muted-foreground">
                Generate ESG due diligence reports automatically based on company information and regulatory requirements.
              </p>
            </div>
            
            {!wizardActive && (
              <Button onClick={() => setWizardActive(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Automated Assessment
              </Button>
            )}
          </div>
          
          {wizardActive ? (
            <ESGDDWizard onComplete={() => setWizardActive(false)} onCancel={() => setWizardActive(false)} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSearch className="h-5 w-5 text-primary" />
                  Automated ESG DD Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ESGDDReportsList reports={automatedReports} />
              </CardContent>
            </Card>
          )}
        </div>
      </UnifiedSidebarLayout>
    </div>
  );
};

export default AutomatedESGDDPage;
