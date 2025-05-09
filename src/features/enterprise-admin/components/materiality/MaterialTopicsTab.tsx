
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleAlert, TrendingUp } from 'lucide-react';

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
  isRisk?: boolean; // Added for classification
}

interface MaterialTopicsTabProps {
  materialTopics: MaterialTopic[];
  activeFrameworks: Framework[];
  setActiveFrameworks: (frameworks: Framework[]) => void;
}

const MaterialTopicsTab: React.FC<MaterialTopicsTabProps> = ({ 
  materialTopics,
  activeFrameworks = ['SASB', 'GRI', 'Custom'],
  setActiveFrameworks 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationView, setClassificationView] = useState<'all' | 'risks' | 'opportunities'>('all');

  // Filter topics by search term and active frameworks
  const filteredTopics = materialTopics.filter(topic => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by framework
    const matchesFramework = !topic.framework || 
      activeFrameworks.includes(topic.framework as Framework);
    
    // Filter by classification (risk or opportunity)
    const matchesClassification = 
      classificationView === 'all' ||
      (classificationView === 'risks' && (topic.isRisk || topic.businessImpact < 5)) ||
      (classificationView === 'opportunities' && (!topic.isRisk || topic.businessImpact >= 5));
    
    return matchesSearch && matchesFramework && matchesClassification;
  });

  // Organize topics by category
  const topicsByCategory: Record<string, MaterialTopic[]> = {};
  ['Environment', 'Social', 'Governance'].forEach(category => {
    topicsByCategory[category] = filteredTopics.filter(topic => topic.category === category);
  });

  // Helper function to determine if topic is a risk or opportunity based on business impact
  const getTopicClassification = (topic: MaterialTopic): 'risk' | 'opportunity' => {
    if (topic.isRisk !== undefined) {
      return topic.isRisk ? 'risk' : 'opportunity';
    }
    return topic.businessImpact < 5 ? 'risk' : 'opportunity';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Topics Assessment</CardTitle>
        <CardDescription>Detailed assessment of key material ESG topics</CardDescription>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full px-3 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {setActiveFrameworks && (
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">Frameworks:</span>
              {(['SASB', 'GRI', 'Custom'] as Framework[]).map(framework => (
                <label key={framework} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeFrameworks.includes(framework)}
                    onChange={() => {
                      if (activeFrameworks.includes(framework)) {
                        setActiveFrameworks(activeFrameworks.filter(f => f !== framework));
                      } else {
                        setActiveFrameworks([...activeFrameworks, framework]);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{framework}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setClassificationView(value as 'all' | 'risks' | 'opportunities')}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-1">
              <CircleAlert className="w-4 h-4" /> Risks
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Opportunities
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {renderTopicsByCategory()}
          </TabsContent>
          
          <TabsContent value="risks" className="space-y-4">
            {renderTopicsByCategory()}
          </TabsContent>
          
          <TabsContent value="opportunities" className="space-y-4">
            {renderTopicsByCategory()}
          </TabsContent>
        </Tabs>

        {filteredTopics.length === 0 && (
          <div className="py-12 text-center">
            <h4 className="text-lg font-medium">No topics found</h4>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or framework filters
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  function renderTopicsByCategory() {
    return Object.entries(topicsByCategory).map(([category, topics]) => (
      <div key={category} className="space-y-4">
        <h3 className="text-lg font-medium">{category}</h3>
        {topics.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {topics.map(topic => {
              const classification = getTopicClassification(topic);
              
              return (
                <div key={topic.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-base">{topic.name}</div>
                    <div className="flex gap-2 items-center">
                      {classification === 'risk' ? (
                        <span className="text-xs bg-red-100 px-2 py-0.5 rounded text-red-700 flex items-center gap-1">
                          <CircleAlert className="w-3 h-3" /> Risk
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 px-2 py-0.5 rounded text-green-700 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Opportunity
                        </span>
                      )}
                      {topic.framework && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                          {topic.framework}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {topic.description}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Business Impact</div>
                      <div className="font-medium">{topic.businessImpact?.toFixed(1) || 'N/A'}/10</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Sustainability Impact</div>
                      <div className="font-medium">{topic.sustainabilityImpact?.toFixed(1) || 'N/A'}/10</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground py-4">
            No {category.toLowerCase()} topics found matching your criteria.
          </div>
        )}
      </div>
    ));
  }
};

export default MaterialTopicsTab;
