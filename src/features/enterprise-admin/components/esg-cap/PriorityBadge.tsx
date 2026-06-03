import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ESGCapPriority } from '../../types/esgDD';

interface PriorityBadgeProps {
  priority?: ESGCapPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority = 'low' }) => {
  if (!priority?.trim()) return null;
  const getPriorityStyles = (priority: ESGCapPriority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-200 text-red-500';      // destructive
      case 'medium':
        return 'bg-yellow-200 text-yellow-700';   // warning
      case 'low':
        return 'bg-blue-200 text-blue-700';     // muted
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