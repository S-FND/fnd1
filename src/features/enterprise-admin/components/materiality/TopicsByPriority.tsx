
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MaterialTopic {
  id: string;
  name: string;
  category: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
}

interface TopicsByPriorityProps {
  highPriorityTopics: MaterialTopic[];
  mediumPriorityTopics: MaterialTopic[];
  lowPriorityTopics: MaterialTopic[];
}

const TopicsByPriority: React.FC<TopicsByPriorityProps> = ({
  highPriorityTopics,
  mediumPriorityTopics,
  lowPriorityTopics
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Topics by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-2 flex items-center gap-2">
              <Badge variant="destructive">High Priority</Badge>
              <span>Topics to Focus On</span>
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {highPriorityTopics.map(topic => (
                <div key={topic.id} className="border rounded-md p-3">
                  <div className="font-medium">{topic.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{topic.description}</div>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }}></div>
                    <span>{topic.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2 flex items-center gap-2">
              <Badge variant="default">Medium Priority</Badge>
              <span>Topics to Manage</span>
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {mediumPriorityTopics.map(topic => (
                <div key={topic.id} className="border rounded-md p-3">
                  <div className="font-medium">{topic.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{topic.description}</div>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }}></div>
                    <span>{topic.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline">Lower Priority</Badge>
              <span>Topics to Monitor</span>
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {lowPriorityTopics.map(topic => (
                <div key={topic.id} className="border rounded-md p-3">
                  <div className="font-medium">{topic.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{topic.description}</div>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }}></div>
                    <span>{topic.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicsByPriority;
