import React, { useState, useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { industries } from '../data/materiality';
import { toast } from 'sonner';
import { 
  getCombinedTopics, 
  generateMatrixData, 
  MaterialTopic as FrameworkMaterialTopic, 
  sasbTopics, 
  griTopics 
} from '../data/frameworkTopics';

// Import refactored components
import IndustrySelection from '../components/materiality/IndustrySelection';
import MaterialityTabs from '../components/materiality/MaterialityTabs';
import StakeholderEngagement from '../components/materiality/StakeholderEngagement';
import FinalizationMethodSelector from '../components/materiality/FinalizationMethodSelector';
import InternalFinalization from '../components/materiality/InternalFinalization';

// Define a union type for allowed frameworks
type Framework = 'SASB' | 'GRI' | 'Custom';

// Create a local MaterialTopic type that extends the framework one but makes businessImpact and sustainabilityImpact required
interface MaterialTopic extends Omit<FrameworkMaterialTopic, 'businessImpact' | 'sustainabilityImpact'> {
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
}

const MaterialityPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('assessment');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [tempSelectedIndustries, setTempSelectedIndustries] = useState<string[]>([]);
  const [materialTopics, setMaterialTopics] = useState<MaterialTopic[]>([]);
  const [selectedTopicsForEngagement, setSelectedTopicsForEngagement] = useState<MaterialTopic[]>([]);
  const [activeFrameworks, setActiveFrameworks] = useState<Framework[]>(['SASB', 'GRI', 'Custom']);
  
  // Finalization flow state
  const [finalizationStep, setFinalizationStep] = useState<'method' | 'internal' | 'stakeholder' | 'completed'>('method');
  const [finalizationMethod, setFinalizationMethod] = useState<'internal' | 'stakeholder' | null>(null);
  const [finalizedTopics, setFinalizedTopics] = useState<MaterialTopic[]>([]);
  
  // Update tempSelectedIndustries when selectedIndustries changes
  useEffect(() => {
    setTempSelectedIndustries([...selectedIndustries]);
  }, [selectedIndustries]);
  
  // Initialize with some default topics
  useEffect(() => {
    // Load custom topics from localStorage
    const savedCustomTopics = localStorage.getItem('customMaterialTopics');
    let customTopics: MaterialTopic[] = [];
    
    if (savedCustomTopics) {
      try {
        customTopics = JSON.parse(savedCustomTopics);
      } catch (error) {
        console.error('Error loading custom topics:', error);
      }
    }

    // If no industries selected, use a mix of common topics
    if (selectedIndustries.length === 0) {
      const commonSasbTopics = sasbTopics.slice(0, 6).map(ensureRequiredProps);
      const commonGriTopics = griTopics.slice(0, 6).map(ensureRequiredProps);
      setMaterialTopics([...commonSasbTopics, ...commonGriTopics, ...customTopics]);
    } else {
      // Otherwise, get topics for selected industries plus custom topics
      const topics = getCombinedTopics(selectedIndustries, activeFrameworks).map(ensureRequiredProps);
      setMaterialTopics([...topics, ...customTopics]);
    }
  }, [selectedIndustries, activeFrameworks]);
  
  // Helper function to ensure topics have the required properties
  const ensureRequiredProps = (topic: FrameworkMaterialTopic): MaterialTopic => {
    // Calculate impacts if not already present
    const businessImpact = topic.businessImpact ?? calculateInitialBusinessImpact(topic);
    const sustainabilityImpact = topic.sustainabilityImpact ?? calculateInitialSustainabilityImpact(topic);
    const color = topic.color ?? getCategoryColor(topic.category);
    
    return {
      ...topic,
      businessImpact,
      sustainabilityImpact,
      color
    };
  };
  
  // Helper function to calculate initial business impact for topics missing it
  const calculateInitialBusinessImpact = (topic: FrameworkMaterialTopic): number => {
    // Base values by framework
    const baseValues: Record<Framework, number> = {
      'SASB': 7.0,
      'GRI': 6.5,
      'Custom': 7.0
    };
    
    // Modifiers by category
    const categoryModifiers: Record<string, number> = {
      'Environment': 0.0,
      'Social': 0.5,
      'Governance': 1.5
    };
    
    const base = baseValues[topic.framework as Framework] || 7.0;
    const modifier = categoryModifiers[topic.category] || 0;
    
    // Add some randomness to make the matrix more interesting
    const randomVariation = (Math.random() - 0.5) * 2;
    
    return Math.min(10, Math.max(1, base + modifier + randomVariation));
  };
  
  // Helper function to calculate initial sustainability impact for topics missing it
  const calculateInitialSustainabilityImpact = (topic: FrameworkMaterialTopic): number => {
    // Base values by framework
    const baseValues: Record<Framework, number> = {
      'SASB': 6.5,
      'GRI': 7.0,
      'Custom': 7.0
    };
    
    // Modifiers by category
    const categoryModifiers: Record<string, number> = {
      'Environment': 1.5,
      'Social': 1.0,
      'Governance': 0.0
    };
    
    const base = baseValues[topic.framework as Framework] || 7.0;
    const modifier = categoryModifiers[topic.category] || 0;
    
    // Add some randomness to make the matrix more interesting
    const randomVariation = (Math.random() - 0.5) * 2;
    
    return Math.min(10, Math.max(1, base + modifier + randomVariation));
  };
  
  // Helper function to get color for a category
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Environment': '#22c55e', // green
      'Social': '#60a5fa',     // blue
      'Governance': '#f59e0b'  // amber
    };
    
    return colors[category] || '#94a3b8'; // default to slate
  };
  
  const updateMatrixData = () => {
    // Update the actual selected industries from the temp selection
    setSelectedIndustries([...tempSelectedIndustries]);
    
    if (tempSelectedIndustries.length === 0) {
      const commonSasbTopics = sasbTopics.slice(0, 6).map(ensureRequiredProps);
      const commonGriTopics = griTopics.slice(0, 6).map(ensureRequiredProps);
      setMaterialTopics([...commonSasbTopics, ...commonGriTopics]);
      toast.info('Reset to default materiality assessment');
      return;
    }
    
    // Get combined topics from selected industries
    const topics = getCombinedTopics(tempSelectedIndustries, activeFrameworks).map(ensureRequiredProps);
    setMaterialTopics(topics);
    
    toast.info(`Updated materiality assessment for ${tempSelectedIndustries.length} selected ${tempSelectedIndustries.length === 1 ? 'industry' : 'industries'}`);
  };

  // Handle updating topics from the MaterialTopicsTab
  const handleUpdateTopics = (updatedTopics: MaterialTopic[]) => {
    setMaterialTopics(updatedTopics);
    
    // Save custom topics to localStorage
    const customTopics = updatedTopics.filter(topic => topic.framework === 'Custom');
    localStorage.setItem('customMaterialTopics', JSON.stringify(customTopics));
  };

  // Handle updating selected topics for stakeholder engagement
  const handleUpdateSelectedTopics = (selectedTopics: MaterialTopic[]) => {
    setSelectedTopicsForEngagement(selectedTopics);
    toast.info(`${selectedTopics.length} topics selected for stakeholder engagement`);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleIndustryChange = (industryId: string, checked: boolean) => {
    if (checked) {
      setTempSelectedIndustries(prev => [...prev, industryId]);
    } else {
      setTempSelectedIndustries(prev => prev.filter(id => id !== industryId));
    }
  };

  const materialityData = generateMatrixData(materialTopics);
  const filteredTopics = selectedCategory === 'All' 
    ? materialTopics 
    : materialTopics.filter(topic => topic.category === selectedCategory);

  const filteredData = materialityData.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (item.framework && !activeFrameworks.includes(item.framework as Framework)) {
      return false;
    }
    return true;
  });

  const highPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact >= 7.5 && topic.sustainabilityImpact >= 7.5
  );

  const mediumPriorityTopics = materialTopics.filter(
    topic => (topic.businessImpact >= 7.5 && topic.sustainabilityImpact < 7.5) || 
            (topic.businessImpact < 7.5 && topic.sustainabilityImpact >= 7.5)
  );

  const lowPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact < 7.5 && topic.sustainabilityImpact < 7.5
  );

  // Handle updating topics from stakeholder prioritization
  const handleUpdatePrioritization = (updatedTopics: MaterialTopic[]) => {
    // Merge updated topics with existing ones
    const updatedMaterialTopics = materialTopics.map(topic => {
      const updatedTopic = updatedTopics.find(t => t.id === topic.id);
      return updatedTopic || topic;
    });
    
    setMaterialTopics(updatedMaterialTopics);
    setFinalizedTopics(updatedTopics);
    setFinalizationStep('completed');
    
    // Save finalized topics to localStorage for ESG Metrics page
    localStorage.setItem('finalizedMaterialTopics', JSON.stringify(updatedTopics));
    
    toast.info('Material topics finalized with stakeholder input');
  };

  // Handle finalization method selection
  const handleFinalizationMethodSelect = (method: 'internal' | 'stakeholder') => {
    setFinalizationMethod(method);
    if (method === 'internal') {
      setFinalizationStep('internal');
    } else {
      setFinalizationStep('stakeholder');
    }
  };

  // Handle internal finalization
  const handleInternalFinalization = (selectedTopics: MaterialTopic[]) => {
    setFinalizedTopics(selectedTopics);
    setFinalizationStep('completed');
    
    // Save finalized topics to localStorage for ESG Metrics page
    localStorage.setItem('finalizedMaterialTopics', JSON.stringify(selectedTopics));
    
    toast.success('Material topics finalized internally');
  };

  // Handle back to method selection
  const handleBackToMethodSelection = () => {
    setFinalizationStep('method');
    setFinalizationMethod(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <MaterialityTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        finalizationStep={finalizationStep}
        finalizationMethod={finalizationMethod}
      />

      {/* Industry Selection Tab */}
      {activeTab === 'industry' && (
        <IndustrySelection
          industries={industries}
          selectedIndustries={selectedIndustries}
          tempSelectedIndustries={tempSelectedIndustries}
          setTempSelectedIndustries={setTempSelectedIndustries}
          onConfirmIndustries={handleConfirmIndustries}
        />
      )}

      {/* Assessment Tab */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Materiality Assessment</h1>
                <p className="text-muted-foreground">
                  Identify and prioritize material sustainability topics for your organization
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="All">All Categories</option>
                  {Array.from(new Set(materialTopics.map(topic => topic.category))).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {selectedIndustries.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No Industry Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Please select at least one industry to proceed with the materiality assessment.
                </p>
                <button
                  onClick={() => setActiveTab('industry')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                >
                  Select Industries
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <MaterialityMatrix
                  data={getFilteredTopics()}
                  onPointClick={(point) => console.log('Point clicked:', point)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stakeholder Engagement Tab */}
      {activeTab === 'engagement' && (
        <StakeholderEngagement
          selectedTopics={selectedTopicsForEngagement}
          setSelectedTopics={setSelectedTopicsForEngagement}
          materialTopics={materialTopics}
          onProceedToFinalization={() => setActiveTab('finalization')}
        />
      )}

      {/* Finalization Tab */}
      {activeTab === 'finalization' && (
        <div className="space-y-6">
          {finalizationStep === 'method' && (
            <FinalizationMethodSelector
              onSelectMethod={(method) => {
                setFinalizationMethod(method);
                setFinalizationStep(method);
              }}
            />
          )}

          {finalizationStep === 'internal' && (
            <InternalFinalization
              materialTopics={materialTopics}
              onFinalize={handleInternalFinalization}
              onBack={handleBackToMethodSelection}
            />
          )}

          {finalizationStep === 'stakeholder' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Stakeholder Finalization</h3>
              <p className="text-muted-foreground">
                Stakeholder finalization workflow coming soon...
              </p>
            </div>
          )}

          {finalizationStep === 'completed' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Assessment Complete</h3>
              <p className="text-muted-foreground mb-4">
                Your materiality assessment has been completed successfully.
              </p>
              <div className="space-y-2">
                <p>Total Topics Assessed: {finalizedTopics.length}</p>
                <p>High Priority Topics: {finalizedTopics.filter(t => t.businessImpact > 7 && t.sustainabilityImpact > 7).length}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MaterialityPage;
