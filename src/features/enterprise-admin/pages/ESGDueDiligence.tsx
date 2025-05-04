
import React, { useState } from 'react';
import { EnhancedSidebarLayout } from '@/components/layout/EnhancedSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ESGDDDashboard from '../components/esg-dd/ESGDDDashboard';
import ESGCapTable from '../components/esg-dd/ESGCapTable';
import StageSelector from '../components/esg-dd/StageSelector';
import EarlyStageForm from '../components/esg-dd/EarlyStageForm';
import ReportGenerator from '../components/esg-dd/ReportGenerator';
import { FundingStage } from '../types/esgDD';

const ESGDueDiligencePage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // New DD Workflow state
  const [workflowStep, setWorkflowStep] = useState<'select-stage' | 'form' | 'report'>('select-stage');
  const [selectedStage, setSelectedStage] = useState<FundingStage | null>(null);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
    return <Navigate to="/login" />;
  }

  const handleStageSelect = (stage: FundingStage) => {
    setSelectedStage(stage);
    setWorkflowStep('form');
  };
  
  const handleFormNext = () => {
    setWorkflowStep('report');
  };
  
  const handleBackToStages = () => {
    setWorkflowStep('select-stage');
  };
  
  const handleFinish = () => {
    setActiveTab('dashboard');
    setWorkflowStep('select-stage');
    setSelectedStage(null);
  };

  const isUnitAdmin = user?.role === 'unit_admin';
  const unitName = isUnitAdmin && user?.units?.find(unit => unit.id === user?.unitId)?.name;
  
  const renderWorkflowContent = () => {
    switch (workflowStep) {
      case 'select-stage':
        return <StageSelector onStageSelect={handleStageSelect} />;
      case 'form':
        return selectedStage ? <EarlyStageForm stage={selectedStage} onBack={handleBackToStages} onNext={handleFormNext} /> : null;
      case 'report':
        return selectedStage ? <ReportGenerator stage={selectedStage} onBack={() => setWorkflowStep('form')} onFinish={handleFinish} /> : null;
      default:
        return <StageSelector onStageSelect={handleStageSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <EnhancedSidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ESG Due Diligence</h1>
            <p className="text-muted-foreground">
              {isUnitAdmin 
                ? `Manage ESG due diligence processes for ${unitName || 'your unit'}.` 
                : 'Automate and standardize ESG due diligence across your enterprise.'}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="cap">CAP Items</TabsTrigger>
              <TabsTrigger value="new">New DD Workflow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6">
              <ESGDDDashboard />
            </TabsContent>
            
            <TabsContent value="cap" className="mt-6">
              <ESGCapTable />
            </TabsContent>
            
            <TabsContent value="new" className="mt-6">
              {renderWorkflowContent()}
            </TabsContent>
          </Tabs>
        </div>
      </EnhancedSidebarLayout>
    </div>
  );
};

export default ESGDueDiligencePage;
