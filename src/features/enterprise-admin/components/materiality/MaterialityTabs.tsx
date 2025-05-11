
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MaterialityMatrix from './MaterialityMatrix';
import TopicsByPriority from './TopicsByPriority';
import MaterialTopicsTab from './MaterialTopicsTab';
import MethodologyTab from './MethodologyTab';

// Define allowed framework types
type Framework = 'SASB' | 'GRI' | 'Custom';

interface MaterialTopic {
  id: string;
  name: string;
  category: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
  industryRelevance?: string[];
}

interface MaterialityTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  materialTopics: MaterialTopic[];
  materialityData: any[];
  highPriorityTopics: MaterialTopic[];
  mediumPriorityTopics: MaterialTopic[];
  lowPriorityTopics: MaterialTopic[];
  selectedIndustries: string[];
  activeFrameworks: Framework[];
  setActiveFrameworks: (frameworks: Framework[]) => void;
}

const MaterialityTabs: React.FC<MaterialityTabsProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  materialTopics,
  materialityData,
  highPriorityTopics,
  mediumPriorityTopics,
  lowPriorityTopics,
  selectedIndustries,
  activeFrameworks,
  setActiveFrameworks
}) => {
  const navigate = useNavigate();

  const handleNavigateToESGMetrics = () => {
    navigate('/esg-management');
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="matrix">Materiality Matrix</TabsTrigger>
        <TabsTrigger value="topics">Material Topics</TabsTrigger>
        <TabsTrigger value="methodology">Assessment Methodology</TabsTrigger>
      </TabsList>
      
      <TabsContent value="matrix" className="space-y-6">
        <MaterialityMatrix 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          materialityData={materialityData}
          activeFrameworks={activeFrameworks}
          setActiveFrameworks={setActiveFrameworks}
        />
        
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Topics By Priority</h2>
          {materialTopics.length > 0 && (
            <Button onClick={handleNavigateToESGMetrics}>
              Set ESG Metrics for Materiality Topics
            </Button>
          )}
        </div>
        
        <TopicsByPriority 
          highPriorityTopics={highPriorityTopics}
          mediumPriorityTopics={mediumPriorityTopics}
          lowPriorityTopics={lowPriorityTopics}
        />
      </TabsContent>
      
      <TabsContent value="topics">
        <MaterialTopicsTab 
          materialTopics={materialTopics} 
          activeFrameworks={activeFrameworks}
          setActiveFrameworks={setActiveFrameworks}
        />
      </TabsContent>
      
      <TabsContent value="methodology">
        <MethodologyTab 
          selectedIndustries={selectedIndustries}
          frameworks={activeFrameworks}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MaterialityTabs;
