
import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleAlert, TrendingUp, Edit, Trash2 } from 'lucide-react';

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

interface TopicCardProps {
  topic: MaterialTopic;
  onEdit: (topic: MaterialTopic) => void;
  onDelete: (topicId: string) => void;
  canEditOrDelete: (topic: MaterialTopic) => boolean;
  showActions?: boolean;
}

const TopicCard: React.FC<TopicCardProps> = ({ 
  topic, 
  onEdit, 
  onDelete, 
  canEditOrDelete,
  showActions = true
}) => {
  const getTopicClassification = (topic: MaterialTopic): 'risk' | 'opportunity' => {
    if (topic.isRisk !== undefined) {
      return topic.isRisk ? 'risk' : 'opportunity';
    }
    return topic.businessImpact < 5 ? 'risk' : 'opportunity';
  };

  const classification = getTopicClassification(topic);
  const canEdit = canEditOrDelete(topic);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-base flex-1">{topic.name}</div>
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
          {showActions && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onEdit(topic)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  onClick={() => onDelete(topic.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
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
};

export default TopicCard;
