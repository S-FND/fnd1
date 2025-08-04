
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface TopicSelectorProps {
  materialTopics: MaterialTopic[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  materialTopics,
  selectedTopicId,
  onSelectTopic
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Material Topic</CardTitle>
        <CardDescription>
          Choose a material topic to view recommended metrics, or skip to manage custom metrics for all topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedTopicId} onValueChange={onSelectTopic}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a material topic or skip to manage custom metrics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-topics">
              <div className="font-medium">Manage Custom Metrics (All Topics)</div>
            </SelectItem>
            {materialTopics.map(topic => (
              <SelectItem key={topic.id} value={topic.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: topic.color }}
                  />
                  <div>
                    <div className="font-medium">{topic.name}</div>
                    <div className="text-xs text-muted-foreground">{topic.category}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default TopicSelector;
