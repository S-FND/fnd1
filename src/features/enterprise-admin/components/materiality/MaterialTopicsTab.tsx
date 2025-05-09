
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

  // Filter topics by search term and active frameworks
  const filteredTopics = materialTopics.filter(topic => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by framework
    const matchesFramework = !topic.framework || 
      activeFrameworks.includes(topic.framework as Framework);
    
    return matchesSearch && matchesFramework;
  });

  // Organize topics by category
  const topicsByCategory: Record<string, MaterialTopic[]> = {};
  ['Environment', 'Social', 'Governance'].forEach(category => {
    topicsByCategory[category] = filteredTopics.filter(topic => topic.category === category);
  });

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
        <div className="space-y-4">
          {Object.entries(topicsByCategory).map(([category, topics]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-medium">{category}</h3>
              {topics.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {topics.map(topic => (
                    <div key={topic.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-base">{topic.name}</div>
                        {topic.framework && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                            {topic.framework}
                          </span>
                        )}
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
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-4">
                  No {category.toLowerCase()} topics found matching your criteria.
                </div>
              )}
            </div>
          ))}
          
          {filteredTopics.length === 0 && (
            <div className="py-12 text-center">
              <h4 className="text-lg font-medium">No topics found</h4>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or framework filters
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialTopicsTab;
