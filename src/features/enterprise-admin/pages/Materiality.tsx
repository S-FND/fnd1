import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Building2, Grid3X3 } from 'lucide-react';
import CheQMateriality from '../components/materiality/CheQMateriality';
import StakeholderEngagement from '../components/materiality/StakeholderEngagement';
import IndustrySelection from '../components/materiality/IndustrySelection';
import { industries } from '../data/materiality';

const MaterialityPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'assessment' | 'industry' | 'stakeholder' | 'matrix'>('overview');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !['admin', 'manager', 'unit_admin'].includes(user?.role || '')) {
    return <Navigate to="/login" />;
  }

  const handleStartAssessment = () => {
    setCurrentView('assessment');
  };

  const handleIndustryAnalysis = () => {
    setCurrentView('industry');
  };

  const handleStakeholderEngagement = () => {
    setCurrentView('stakeholder');
  };

  const handleImpactMatrix = () => {
    setCurrentView('matrix');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
  };

  const handleUpdatePrioritization = (updatedTopics: any[]) => {
    console.log('Updated prioritizations:', updatedTopics);
  };

  if (currentView === 'assessment') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Materiality Assessment</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive ESG materiality analysis with stakeholder input
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToOverview}>
            Back to Overview
          </Button>
        </div>
        
        <CheQMateriality />
      </div>
    );
  }

  if (currentView === 'industry') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Industry Analysis</h1>
            <p className="text-muted-foreground mt-2">
              Select industries to customize material topics for your organization
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToOverview}>
            Back to Overview
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Select Your Industry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Choose your primary industry to get relevant material topics and benchmarks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industries.map((industry) => (
                <Button 
                  key={industry.id} 
                  variant={selectedIndustries.includes(industry.id) ? "default" : "outline"} 
                  className="h-auto p-4 text-left"
                  onClick={() => {
                    if (selectedIndustries.includes(industry.id)) {
                      setSelectedIndustries(selectedIndustries.filter(id => id !== industry.id));
                    } else {
                      setSelectedIndustries([...selectedIndustries, industry.id]);
                    }
                  }}
                >
                  {industry.name}
                </Button>
              ))}
            </div>
            {selectedIndustries.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Selected Industries:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIndustries.map(industryId => {
                    const industry = industries.find(i => i.id === industryId);
                    return (
                      <div key={industryId} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {industry?.name}
                      </div>
                    );
                  })}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setSelectedIndustries([])}
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'stakeholder') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stakeholder Engagement</h1>
            <p className="text-muted-foreground mt-2">
              Create stakeholder groups and collect materiality input
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToOverview}>
            Back to Overview
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Stakeholder Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Engage with different stakeholder groups to understand their sustainability priorities.
            </p>
            <div className="space-y-4">
              {['Investors', 'Customers', 'Employees', 'Suppliers', 'Communities', 'Regulators'].map((group) => (
                <div key={group} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{group}</h3>
                    <p className="text-sm text-muted-foreground">Collect input from {group.toLowerCase()}</p>
                  </div>
                  <Button variant="outline">
                    Start Survey
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'matrix') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Materiality Matrix</h1>
            <p className="text-muted-foreground mt-2">
              Visualize topics by business and sustainability impact
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToOverview}>
            Back to Overview
          </Button>
        </div>
        
        <CheQMateriality />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materiality Assessment</h1>
          <p className="text-muted-foreground mt-2">
            Identify and prioritize material sustainability topics for your organization
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Materiality Assessment Tool
          </CardTitle>
          <CardDescription>
            Comprehensive materiality assessment to identify and prioritize ESG topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Start Your Materiality Assessment</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our comprehensive materiality assessment tool helps you identify and prioritize 
              the most important ESG topics for your organization based on stakeholder input 
              and business impact.
            </p>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <Button className="w-full" size="lg" onClick={handleStartAssessment}>
                Start Assessment
              </Button>
              <p className="text-xs text-muted-foreground">
                Begin your materiality assessment process
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Industry Analysis
            </CardTitle>
            <CardDescription>Analyze material topics by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Select your industry to get relevant materiality topics and benchmarks.
            </p>
            <Button variant="outline" className="w-full" onClick={handleIndustryAnalysis}>
              Select Industry
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Stakeholder Engagement
            </CardTitle>
            <CardDescription>Collect stakeholder input</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Engage stakeholders to understand their priorities and concerns.
            </p>
            <Button variant="outline" className="w-full" onClick={handleStakeholderEngagement}>
              Start Engagement
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Impact Matrix
            </CardTitle>
            <CardDescription>Visualize material topics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate impact vs. influence matrix for your material topics.
            </p>
            <Button variant="outline" className="w-full" onClick={handleImpactMatrix}>
              View Matrix
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialityPage;