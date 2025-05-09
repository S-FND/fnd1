import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { industries } from '../data/materiality';
import { toast } from 'sonner';
import { 
  getCombinedTopics, 
  generateMatrixData, 
  MaterialTopic, 
  sasbTopics, 
  griTopics 
} from '../data/frameworkTopics';

// Import refactored components
import IndustrySelection from '../components/materiality/IndustrySelection';
import MaterialityTabs from '../components/materiality/MaterialityTabs';
import StakeholderEngagement from '../components/materiality/StakeholderEngagement';

const MaterialityPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [tempSelectedIndustries, setTempSelectedIndustries] = useState<string[]>([]);
  const [materialTopics, setMaterialTopics] = useState<MaterialTopic[]>([]);
  const [activeFrameworks, setActiveFrameworks] = useState<string[]>(['SASB', 'GRI', 'Custom']);
  
  // Update tempSelectedIndustries when selectedIndustries changes
  useEffect(() => {
    setTempSelectedIndustries([...selectedIndustries]);
  }, [selectedIndustries]);
  
  // Initialize with some default topics
  useEffect(() => {
    // If no industries selected, use a mix of common topics
    if (selectedIndustries.length === 0) {
      const commonSasbTopics = sasbTopics.slice(0, 6);
      const commonGriTopics = griTopics.slice(0, 6);
      setMaterialTopics([...commonSasbTopics, ...commonGriTopics]);
    } else {
      // Otherwise, get topics for selected industries
      const topics = getCombinedTopics(selectedIndustries, activeFrameworks);
      setMaterialTopics(topics);
    }
  }, [selectedIndustries, activeFrameworks]);
  
  const updateMatrixData = () => {
    // Update the actual selected industries from the temp selection
    setSelectedIndustries([...tempSelectedIndustries]);
    
    if (tempSelectedIndustries.length === 0) {
      const commonSasbTopics = sasbTopics.slice(0, 6);
      const commonGriTopics = griTopics.slice(0, 6);
      setMaterialTopics([...commonSasbTopics, ...commonGriTopics]);
      toast.info('Reset to default materiality assessment');
      return;
    }
    
    // Get combined topics from selected industries
    const topics = getCombinedTopics(tempSelectedIndustries, activeFrameworks);
    setMaterialTopics(topics);
    
    toast.info(`Updated materiality assessment for ${tempSelectedIndustries.length} selected ${tempSelectedIndustries.length === 1 ? 'industry' : 'industries'}`);
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
    if (item.framework && !activeFrameworks.includes(item.framework)) {
      return false;
    }
    return true;
  });

  const highPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact && topic.sustainabilityImpact &&
    topic.businessImpact >= 7.5 && topic.sustainabilityImpact >= 7.5
  );

  const mediumPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact && topic.sustainabilityImpact && (
      (topic.businessImpact >= 7.5 && topic.sustainabilityImpact < 7.5) || 
      (topic.businessImpact < 7.5 && topic.sustainabilityImpact >= 7.5)
    )
  );

  const lowPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact && topic.sustainabilityImpact &&
    topic.businessImpact < 7.5 && topic.sustainabilityImpact < 7.5
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
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
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
          />
          
          <StakeholderEngagement
            selectedIndustries={selectedIndustries}
            materialTopics={materialTopics}
            onUpdatePrioritization={handleUpdatePrioritization}
          />
        </div>
      </SidebarLayout>
    </div>
  );
};

export default MaterialityPage;
