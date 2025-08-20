import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ESGCapPriority } from '../../types/esgDD';

interface PriorityBadgeProps {
  priority?: ESGCapPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority = 'low' }) => {
  const getPriorityStyles = (priority: ESGCapPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-muted/50 text-muted-foreground border-muted/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Badge variant="outline" className={getPriorityStyles(priority)}>
      {priority?.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};