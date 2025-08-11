
import React, { useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockESGDDReports } from '../data/esgDD';
import { ESGDDReportsList } from '../components/esg-dd/ESGDDReportsList';
import { ESGDDWizard } from '../components/esg-dd/ESGDDWizard';
import { ArrowLeft, FileSearch, Plus, Bot, Sparkles } from 'lucide-react';

const AutomatedESGDDPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automated ESG Due Diligence</h1>
          <p className="text-muted-foreground mt-2">
            Generate ESG due diligence assessments automatically using AI-powered analysis
          </p>
        </div>
        <Button onClick={() => navigate('/esg-dd')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to ESG DD
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automated Assessment Generation</CardTitle>
          <CardDescription>
            Use our AI-powered system to automatically generate comprehensive ESG due diligence assessments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-12">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">AI-Powered ESG Assessment</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our automated system will analyze your organization's data and generate 
              a comprehensive ESG due diligence assessment with recommendations.
            </p>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <Button className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Assessment
              </Button>
              <p className="text-xs text-muted-foreground">
                This process typically takes 5-10 minutes to complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedESGDDPage;
