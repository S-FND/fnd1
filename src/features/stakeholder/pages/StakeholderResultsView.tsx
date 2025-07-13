
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaterialTopic, generateMatrixData } from '../../enterprise-admin/data/frameworkTopics';
import MaterialityMatrix from '../../enterprise-admin/components/materiality/MaterialityMatrix';

interface StakeholderResultsViewProps {
  stakeholderName: string;
  groupName: string;
  topics: MaterialTopic[];
}

const StakeholderResultsView: React.FC<StakeholderResultsViewProps> = ({
  stakeholderName,
  groupName,
  topics
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Generate mock aggregated results for all stakeholders
  const aggregatedTopics = topics.map(topic => ({
    ...topic,
    businessImpact: Math.random() * 3 + 7, // Random value between 7-10
    sustainabilityImpact: Math.random() * 3 + 7, // Random value between 7-10
  }));

  const materialityData = generateMatrixData(aggregatedTopics);

  const highPriorityTopics = aggregatedTopics.filter(
    topic => topic.businessImpact >= 8.5 && topic.sustainabilityImpact >= 8.5
  );

  const mediumPriorityTopics = aggregatedTopics.filter(
    topic => (topic.businessImpact >= 8.5 && topic.sustainabilityImpact < 8.5) || 
            (topic.businessImpact < 8.5 && topic.sustainabilityImpact >= 8.5)
  );

  const lowPriorityTopics = aggregatedTopics.filter(
    topic => topic.businessImpact < 8.5 && topic.sustainabilityImpact < 8.5
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stakeholder Assessment Results</CardTitle>
          <CardDescription>
            Aggregated results from all stakeholders in the {groupName} group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{highPriorityTopics.length}</div>
              <div className="text-sm text-green-600">High Priority Topics</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{mediumPriorityTopics.length}</div>
              <div className="text-sm text-blue-600">Medium Priority Topics</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">{lowPriorityTopics.length}</div>
              <div className="text-sm text-gray-600">Lower Priority Topics</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <MaterialityMatrix
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        materialityData={materialityData}
      />

      <Card>
        <CardHeader>
          <CardTitle>Topic Prioritization Summary</CardTitle>
          <CardDescription>
            Overview of how all topics were categorized based on stakeholder input
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3">High Priority Topics (Focus & Act)</h3>
              <div className="grid gap-3">
                {highPriorityTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">{topic.name}</div>
                      <div className="text-sm text-muted-foreground">{topic.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" style={{ 
                        backgroundColor: `${topic.category === 'Environment' ? '#22c55e' : 
                                           topic.category === 'Social' ? '#60a5fa' : '#f59e0b'}20`,
                        color: topic.category === 'Environment' ? '#22c55e' : 
                               topic.category === 'Social' ? '#60a5fa' : '#f59e0b',
                        borderColor: topic.category === 'Environment' ? '#22c55e' : 
                                     topic.category === 'Social' ? '#60a5fa' : '#f59e0b'
                      }}>
                        {topic.category}
                      </Badge>
                      <Badge variant="secondary">{topic.framework}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3">Medium Priority Topics (Manage)</h3>
              <div className="grid gap-3">
                {mediumPriorityTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">{topic.name}</div>
                      <div className="text-sm text-muted-foreground">{topic.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" style={{ 
                        backgroundColor: `${topic.category === 'Environment' ? '#22c55e' : 
                                           topic.category === 'Social' ? '#60a5fa' : '#f59e0b'}20`,
                        color: topic.category === 'Environment' ? '#22c55e' : 
                               topic.category === 'Social' ? '#60a5fa' : '#f59e0b',
                        borderColor: topic.category === 'Environment' ? '#22c55e' : 
                                     topic.category === 'Social' ? '#60a5fa' : '#f59e0b'
                      }}>
                        {topic.category}
                      </Badge>
                      <Badge variant="secondary">{topic.framework}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {lowPriorityTopics.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Lower Priority Topics (Monitor)</h3>
                <div className="grid gap-3">
                  {lowPriorityTopics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{topic.name}</div>
                        <div className="text-sm text-muted-foreground">{topic.description}</div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" style={{ 
                          backgroundColor: `${topic.category === 'Environment' ? '#22c55e' : 
                                             topic.category === 'Social' ? '#60a5fa' : '#f59e0b'}20`,
                          color: topic.category === 'Environment' ? '#22c55e' : 
                                 topic.category === 'Social' ? '#60a5fa' : '#f59e0b',
                          borderColor: topic.category === 'Environment' ? '#22c55e' : 
                                       topic.category === 'Social' ? '#60a5fa' : '#f59e0b'
                        }}>
                          {topic.category}
                        </Badge>
                        <Badge variant="secondary">{topic.framework}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StakeholderResultsView;
