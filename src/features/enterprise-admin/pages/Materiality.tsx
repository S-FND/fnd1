import React, { useState, useEffect } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
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
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [tempSelectedIndustries, setTempSelectedIndustries] = useState<string[]>([]);
  const [materialTopics, setMaterialTopics] = useState<MaterialTopic[]>([]);
  const [selectedTopicsForEngagement, setSelectedTopicsForEngagement] = useState<MaterialTopic[]>([]);
  const [activeFrameworks, setActiveFrameworks] = useState<Framework[]>(['SASB', 'GRI', 'Custom']);
  
  // Update tempSelectedIndustries when selectedIndustries changes
  useEffect(() => {
    setTempSelectedIndustries([...selectedIndustries]);
  }, [selectedIndustries]);
  
  // Initialize with some default topics
  useEffect(() => {
    // If no industries selected, use a mix of common topics
    if (selectedIndustries.length === 0) {
      const commonSasbTopics = sasbTopics.slice(0, 6).map(ensureRequiredProps);
      const commonGriTopics = griTopics.slice(0, 6).map(ensureRequiredProps);
      setMaterialTopics([...commonSasbTopics, ...commonGriTopics]);
    } else {
      // Otherwise, get topics for selected industries
      const topics = getCombinedTopics(selectedIndustries, activeFrameworks).map(ensureRequiredProps);
      setMaterialTopics(topics);
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
    toast.info('Updated materiality assessment with stakeholder input');
  };

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Materiality Assessment</h1>
          <p className="text-muted-foreground">
            Analyze and prioritize ESG material topics based on business impact and sustainability impact
          </p>
        </div>
        
        <IndustrySelection 
          selectedIndustries={tempSelectedIndustries} 
          onIndustryChange={handleIndustryChange}
          onClearSelection={() => setTempSelectedIndustries([])}
          onUpdateMatrix={updateMatrixData}
        />
        
        <MaterialityTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          materialTopics={materialTopics}
          materialityData={filteredData}
          highPriorityTopics={highPriorityTopics}
          mediumPriorityTopics={mediumPriorityTopics}
          lowPriorityTopics={lowPriorityTopics}
          selectedIndustries={selectedIndustries}
          activeFrameworks={activeFrameworks}
          setActiveFrameworks={setActiveFrameworks}
          onUpdateTopics={handleUpdateTopics}
          onUpdateSelectedTopics={handleUpdateSelectedTopics}
        />
        
        <StakeholderEngagement
          selectedIndustries={selectedIndustries}
          materialTopics={selectedTopicsForEngagement.length > 0 ? selectedTopicsForEngagement : materialTopics}
          onUpdatePrioritization={handleUpdatePrioritization}
        />
      </div>
    </UnifiedSidebarLayout>
  );
};

export default MaterialityPage;
