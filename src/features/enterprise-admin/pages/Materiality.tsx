
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { defaultMaterialTopics, industries, materialTopicsByIndustry } from '../data/materiality';
import { toast } from 'sonner';

// Import refactored components
import IndustrySelection from '../components/materiality/IndustrySelection';
import MaterialityTabs from '../components/materiality/MaterialityTabs';

const MaterialityPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [tempSelectedIndustries, setTempSelectedIndustries] = useState<string[]>([]);
  const [materialTopics, setMaterialTopics] = useState(defaultMaterialTopics);
  
  // Update tempSelectedIndustries when selectedIndustries changes
  useEffect(() => {
    setTempSelectedIndustries([...selectedIndustries]);
  }, [selectedIndustries]);
  
  const updateMatrixData = () => {
    // Update the actual selected industries from the temp selection
    setSelectedIndustries([...tempSelectedIndustries]);
    
    if (tempSelectedIndustries.length === 0) {
      setMaterialTopics(defaultMaterialTopics);
      toast.info('Reset to default materiality assessment');
      return;
    }
    
    // Combine material topics from all selected industries
    const combinedTopics = new Map();
    
    // Count how many industries each topic appears in for proper averaging
    const topicOccurrences = new Map();
    
    tempSelectedIndustries.forEach(industryId => {
      const industryTopics = materialTopicsByIndustry[industryId as keyof typeof materialTopicsByIndustry];
      if (!industryTopics) return;
      
      industryTopics.forEach(topic => {
        if (combinedTopics.has(topic.id)) {
          // Count occurrences for proper averaging
          topicOccurrences.set(topic.id, topicOccurrences.get(topic.id) + 1);
          
          // Sum values for later averaging
          const existingTopic = combinedTopics.get(topic.id);
          existingTopic.businessImpact += topic.businessImpact;
          existingTopic.sustainabilityImpact += topic.sustainabilityImpact;
        } else {
          // First occurrence of this topic
          combinedTopics.set(topic.id, { ...topic });
          topicOccurrences.set(topic.id, 1);
        }
      });
    });
    
    // Calculate proper averages based on occurrence count
    combinedTopics.forEach((topic, id) => {
      const count = topicOccurrences.get(id);
      if (count > 1) {
        topic.businessImpact = topic.businessImpact / count;
        topic.sustainabilityImpact = topic.sustainabilityImpact / count;
      }
    });
    
    // Convert map to array for state update
    const updatedTopics = Array.from(combinedTopics.values());
    setMaterialTopics(updatedTopics);
    
    toast.info(`Updated materiality assessment for ${tempSelectedIndustries.length} selected industries`);
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

  const filteredTopics = selectedCategory === 'All' 
    ? materialTopics 
    : materialTopics.filter(topic => topic.category === selectedCategory);

  const materialityData = filteredTopics.map(topic => ({
    x: topic.businessImpact,
    y: topic.sustainabilityImpact,
    z: 100,
    name: topic.name,
    category: topic.category,
    businessImpact: topic.businessImpact,
    sustainabilityImpact: topic.sustainabilityImpact,
    color: topic.color
  }));

  const highPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact >= 7.5 && topic.sustainabilityImpact >= 7.5
  );

  const mediumPriorityTopics = materialTopics.filter(
    topic => 
      (topic.businessImpact >= 7.5 && topic.sustainabilityImpact < 7.5) || 
      (topic.businessImpact < 7.5 && topic.sustainabilityImpact >= 7.5)
  );

  const lowPriorityTopics = materialTopics.filter(
    topic => topic.businessImpact < 7.5 && topic.sustainabilityImpact < 7.5
  );

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
            materialityData={materialityData}
            highPriorityTopics={highPriorityTopics}
            mediumPriorityTopics={mediumPriorityTopics}
            lowPriorityTopics={lowPriorityTopics}
            selectedIndustries={selectedIndustries}
          />
        </div>
      </SidebarLayout>
    </div>
  );
};

export default MaterialityPage;
