
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
  const [workflowMode, setWorkflowMode] = useState<'automated' | 'manual'>('automated');
  
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
        return (
          <div className="space-y-6">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setWorkflowMode('automated')}
                className={`px-6 py-3 rounded-lg border-2 ${
                  workflowMode === 'automated' 
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-medium">Automated ESG DD</div>
                <div className="text-sm text-muted-foreground">AI-powered analysis using regulatory frameworks</div>
              </button>
              <button
                onClick={() => setWorkflowMode('manual')}
                className={`px-6 py-3 rounded-lg border-2 ${
                  workflowMode === 'manual' 
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-medium">Manual ESG DD</div>
                <div className="text-sm text-muted-foreground">Custom due diligence with full control</div>
              </button>
            </div>
            <StageSelector onStageSelect={handleStageSelect} mode={workflowMode} />
          </div>
        );
      case 'form':
        return selectedStage ? (
          <EarlyStageForm 
            stage={selectedStage} 
            mode={workflowMode}
            onBack={handleBackToStages} 
            onNext={handleFormNext} 
          />
        ) : null;
      case 'report':
        return selectedStage ? (
          <ReportGenerator 
            stage={selectedStage} 
            mode={workflowMode}
            onBack={() => setWorkflowStep('form')} 
            onFinish={handleFinish} 
          />
        ) : null;
      default:
        return <StageSelector onStageSelect={handleStageSelect} mode={workflowMode} />;
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
