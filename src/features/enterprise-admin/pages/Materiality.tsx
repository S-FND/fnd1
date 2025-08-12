import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Building2, Grid3X3, ArrowLeft } from 'lucide-react';
import StakeholderEngagement from '../components/materiality/StakeholderEngagement';
import IndustrySelection from '../components/materiality/IndustrySelection';
import FinalizationMethodSelector from '../components/materiality/FinalizationMethodSelector';
import InternalFinalization from '../components/materiality/InternalFinalization';
import { industries } from '../data/materiality';
import { MaterialTopic, getTopicsByIndustry, getCombinedTopics, topicColors } from '../data/frameworkTopics';

const MaterialityPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'industry' | 'topics' | 'method' | 'internal' | 'stakeholder'>('overview');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [materialTopics, setMaterialTopics] = useState<MaterialTopic[]>([]);
  const [finalizationMethod, setFinalizationMethod] = useState<'internal' | 'stakeholder' | null>(null);
  const [finalizedTopics, setFinalizedTopics] = useState<MaterialTopic[]>([]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !['admin', 'manager', 'unit_admin'].includes(user?.role || '')) {
    return <Navigate to="/login" />;
  }

  // Update material topics when industries change
  useEffect(() => {
    if (selectedIndustries.length > 0) {
      const topics = getCombinedTopics(selectedIndustries, ['SASB', 'GRI']);
      setMaterialTopics(topics);
    } else {
      setMaterialTopics([]);
    }
  }, [selectedIndustries]);

  const handleStartAssessment = () => {
    setCurrentView('industry');
  };

  const handleIndustrySelected = (industries: string[]) => {
    setSelectedIndustries(industries);
    if (industries.length > 0) {
      setCurrentView('topics');
    }
  };

  const handleProceedToMethod = () => {
    setCurrentView('method');
  };

  const handleMethodSelected = (method: 'internal' | 'stakeholder') => {
    setFinalizationMethod(method);
    if (method === 'internal') {
      setCurrentView('internal');
    } else {
      setCurrentView('stakeholder');
    }
  };

  const handleFinalizeMaterial = (topics: MaterialTopic[]) => {
    setFinalizedTopics(topics);
    // Save to localStorage for ESG Metrics
    localStorage.setItem('finalizedMaterialTopics', JSON.stringify(topics));
    setCurrentView('overview');
  };

  const handleBack = () => {
    switch (currentView) {
      case 'industry':
        setCurrentView('overview');
        break;
      case 'topics':
        setCurrentView('industry');
        break;
      case 'method':
        setCurrentView('topics');
        break;
      case 'internal':
      case 'stakeholder':
        setCurrentView('method');
        break;
      default:
        setCurrentView('overview');
    }
  };

  const handleUpdatePrioritization = (updatedTopics: MaterialTopic[]) => {
    setMaterialTopics(updatedTopics);
  };

  if (currentView === 'industry') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Industry Selection</h1>
            <p className="text-muted-foreground mt-2">
              Select your industry to get relevant SASB/GRI material topics
            </p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <IndustrySelection
          selectedIndustries={selectedIndustries}
          onIndustryChange={(industryId, checked) => {
            if (checked) {
              setSelectedIndustries([...selectedIndustries, industryId]);
            } else {
              setSelectedIndustries(selectedIndustries.filter(id => id !== industryId));
            }
          }}
          onClearSelection={() => setSelectedIndustries([])}
          onUpdateMatrix={() => handleIndustrySelected(selectedIndustries)}
        />
      </div>
    );
  }

  if (currentView === 'topics') {
    const topicsByCategory = materialTopics.reduce((acc, topic) => {
      if (!acc[topic.category]) {
        acc[topic.category] = [];
      }
      acc[topic.category].push(topic);
      return acc;
    }, {} as Record<string, MaterialTopic[]>);

    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Material Topics</h1>
            <p className="text-muted-foreground mt-2">
              Review industry-specific SASB/GRI material topics by category
            </p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="space-y-6">
          {['Environment', 'Social', 'Governance'].map(category => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: topicColors[category as keyof typeof topicColors] }}
                  />
                  {category} Topics
                </CardTitle>
                <CardDescription>
                  {topicsByCategory[category]?.length || 0} topics available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {topicsByCategory[category]?.map(topic => (
                    <div key={topic.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{topic.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {topic.framework}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {topic.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Relevant to: {topic.industryRelevance.slice(0, 3).join(', ')}
                        {topic.industryRelevance.length > 3 && ' +more'}
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                      No {category.toLowerCase()} topics available for selected industries
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleProceedToMethod} disabled={materialTopics.length === 0}>
            Proceed to Finalization
          </Button>
        </div>
      </div>
    );
  }

  if (currentView === 'method') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finalization Method</h1>
            <p className="text-muted-foreground mt-2">
              Choose how to finalize your material topics
            </p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <FinalizationMethodSelector onSelectMethod={handleMethodSelected} />
      </div>
    );
  }

  if (currentView === 'internal') {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Internal Finalization</h1>
            <p className="text-muted-foreground mt-2">
              Select material topics with internal team input
            </p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <InternalFinalization
          materialTopics={materialTopics.map(topic => ({
            id: topic.id,
            name: topic.name,
            category: topic.category,
            businessImpact: topic.businessImpact || 5,
            sustainabilityImpact: topic.sustainabilityImpact || 5,
            color: topicColors[topic.category as keyof typeof topicColors],
            description: topic.description,
            framework: topic.framework
          }))}
          onFinalize={(selectedTopics) => {
            const finalizedWithIndustryRelevance = selectedTopics.map(topic => {
              const originalTopic = materialTopics.find(mt => mt.id === topic.id);
              return {
                ...topic,
                framework: originalTopic?.framework as 'SASB' | 'GRI' | 'Custom' || 'Custom',
                industryRelevance: originalTopic?.industryRelevance || []
              };
            });
            handleFinalizeMaterial(finalizedWithIndustryRelevance);
          }}
          onBack={handleBack}
        />
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
              Invite stakeholders to prioritize material topics
            </p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <StakeholderEngagement
          selectedIndustries={selectedIndustries}
          materialTopics={materialTopics}
          onUpdatePrioritization={handleUpdatePrioritization}
        />

        <div className="flex justify-end">
          <Button onClick={() => handleFinalizeMaterial(materialTopics)}>
            Finalize Topics
          </Button>
        </div>
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

      {finalizedTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Finalized Material Topics
            </CardTitle>
            <CardDescription>
              {finalizedTopics.length} topics have been finalized and are ready for ESG metrics configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {finalizedTopics.slice(0, 6).map(topic => (
                <div key={topic.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: topicColors[topic.category as keyof typeof topicColors] }}
                    />
                    <span className="font-medium text-sm">{topic.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {topic.framework}
                  </Badge>
                </div>
              ))}
              {finalizedTopics.length > 6 && (
                <div className="border rounded-lg p-3 flex items-center justify-center text-muted-foreground">
                  +{finalizedTopics.length - 6} more topics
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Quick Start Assessment
            </CardTitle>
            <CardDescription>Complete materiality assessment workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Follow the guided process: Industry → Topics → Finalization Method → Results
            </p>
            <Button className="w-full" onClick={handleStartAssessment}>
              Start Assessment
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              ESG Metrics Integration
            </CardTitle>
            <CardDescription>Configure metrics for finalized topics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {finalizedTopics.length > 0 
                ? `${finalizedTopics.length} finalized topics ready for metrics configuration`
                : 'Complete materiality assessment to configure ESG metrics'
              }
            </p>
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={finalizedTopics.length === 0}
              onClick={() => window.location.href = '/esg/metrics'}
            >
              Configure Metrics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialityPage;