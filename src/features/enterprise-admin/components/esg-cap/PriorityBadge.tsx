import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ESGCapPriority } from '../../types/esgDD';

interface PriorityBadgeProps {
  priority?: ESGCapPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority = 'low' }) => {
  const getPriorityStyles = (priority: ESGCapPriority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';      // destructive
      case 'medium':
        return 'bg-yellow-400 text-black';   // warning
      case 'low':
        return 'bg-gray-300 text-black';     // muted
      default:
        return 'bg-gray-300 text-black';
    }
  };

  return (
    <Badge variant="outline" className={getPriorityStyles(priority)}>
      {priority?.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};