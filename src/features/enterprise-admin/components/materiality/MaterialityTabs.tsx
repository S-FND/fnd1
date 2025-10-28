
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MaterialityMatrix from './MaterialityMatrix';
import MaterialTopicsTab from './MaterialTopicsTab';
import TopicsByPriority from './TopicsByPriority';
import MethodologyTab from './MethodologyTab';
import { logger } from '@/hooks/logger';

// Define allowed framework types
type Framework = 'SASB' | 'GRI' | 'Custom';

interface MaterialTopic {
  id: string;
  topic: string;
  esg: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
  isRisk?: boolean;
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
  onUpdateTopics?: (topics: MaterialTopic[]) => void;
  onUpdateSelectedTopics?: (topics: MaterialTopic[]) => void;
  selectedMaterialTopics:{
    id:string;
    industry:string;
    topic:string;
    esg:string;
    businessImpact:string;
    sustainabilityImpact:string;
    framework:string;
    description:string;
  }[];
  customTopics:MaterialTopic[];
  getMaterialityData:() => {};
  buttonEnabled: boolean;
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
  setActiveFrameworks,
  onUpdateTopics,
  onUpdateSelectedTopics,selectedMaterialTopics,customTopics,getMaterialityData,
  buttonEnabled
}) => {
  // setTimeout(()=>{
  //   getMaterialityData()
  // },4000)
  logger.log(`selectedMaterialTopics ========> `,selectedMaterialTopics)
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assessment">
            Materiality Assessment
            {/* <Badge variant="secondary" className="ml-2">
              {materialTopics.length}
            </Badge> */}
          </TabsTrigger>
          <TabsTrigger value="matrix">Materiality Matrix</TabsTrigger>
          <TabsTrigger value="priority">Priority Analysis</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
        </TabsList>

        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Environment">Environment</SelectItem>
              <SelectItem value="Social">Social</SelectItem>
              <SelectItem value="Governance">Governance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TabsContent value="assessment" className="space-y-4">
        <MaterialTopicsTab 
          materialTopics={materialTopics}
          activeFrameworks={activeFrameworks}
          setActiveFrameworks={setActiveFrameworks}
          selectedIndustries={selectedIndustries}
          onUpdateTopics={onUpdateTopics}
          onUpdateSelectedTopics={onUpdateSelectedTopics}
          selectedMaterialTopics={selectedMaterialTopics}
          customTopics={customTopics}
          getMaterialityData={getMaterialityData}
          buttonEnabled={buttonEnabled}
        />
      </TabsContent>

      <TabsContent value="matrix" className="space-y-4">
        <MaterialityMatrix 
          materialityData={materialityData}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeFrameworks={activeFrameworks}
          setActiveFrameworks={setActiveFrameworks}
        />
      </TabsContent>

      <TabsContent value="priority" className="space-y-4">
        <TopicsByPriority 
          highPriorityTopics={highPriorityTopics}
          mediumPriorityTopics={mediumPriorityTopics}
          lowPriorityTopics={lowPriorityTopics}
        />
      </TabsContent>

      <TabsContent value="methodology" className="space-y-4">
        <MethodologyTab 
          selectedIndustries={selectedIndustries}
          frameworks={activeFrameworks}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MaterialityTabs;
