
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaterialityMatrix from './MaterialityMatrix';
import TopicsByPriority from './TopicsByPriority';
import MaterialTopicsTab from './MaterialTopicsTab';
import MethodologyTab from './MethodologyTab';

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
  activeFrameworks?: string[];
  setActiveFrameworks?: (frameworks: string[]) => void;
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
          frameworks={activeFrameworks || []}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MaterialityTabs;
