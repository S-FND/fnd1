
import React from 'react';
import TopicCard from './TopicCard';

interface MaterialTopic {
  id: string;
  name: string;
  category: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
  isRisk?: boolean;
}

interface TopicsByCategoryProps {
  topicsByCategory: Record<string, MaterialTopic[]>;
  onEditTopic: (topic: MaterialTopic) => void;
  onDeleteTopic: (topicId: string) => void;
  canEditOrDelete: (topic: MaterialTopic) => boolean;
  showActions?: boolean;
}

const TopicsByCategory: React.FC<TopicsByCategoryProps> = ({
  topicsByCategory,
  onEditTopic,
  onDeleteTopic,
  canEditOrDelete,
  showActions = true
}) => {
  return (
    <>
      {Object.entries(topicsByCategory).map(([category, topics]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium">{category}</h3>
          {topics.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {topics.map(topic => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onEdit={onEditTopic}
                  onDelete={onDeleteTopic}
                  canEditOrDelete={canEditOrDelete}
                  showActions={showActions}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground py-4">
              No {category.toLowerCase()} topics found matching your criteria.
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default TopicsByCategory;
