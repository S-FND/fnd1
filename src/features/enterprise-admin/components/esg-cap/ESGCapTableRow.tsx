
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { ESGCapRowActions } from './ESGCapRowActions';

// Helper function to determine the effective status
const getEffectiveStatus = (item: ESGCapItem): ESGCapItem['status'] => {
  const today = new Date();
  const deadline = new Date(item.deadline);
  
  // If deadline has passed and status is not completed and no actual completion date, mark as delayed
  if (deadline < today && item.status !== 'completed' && !item.actualCompletionDate) {
    return 'delayed';
  }
  
  return item.status;
};

interface ESGCapTableRowProps {
  item: ESGCapItem;
  index: number;
  onUpdate?: (updatedItem: ESGCapItem) => void;
}

export const ESGCapTableRow: React.FC<ESGCapTableRowProps> = ({ item, index, onUpdate }) => {
  const effectiveStatus = getEffectiveStatus(item);
  
  return (
    <TableRow>
      <TableCell className="text-center font-medium">{index + 1}</TableCell>
      <TableCell className="font-medium">
        {item.issue}
      </TableCell>
      <TableCell>
        <CategoryBadge category={item.category} />
      </TableCell>
      <TableCell>
        <PriorityBadge priority={item.priority} />
      </TableCell>
      <TableCell>{item.description}</TableCell>
      <TableCell>{item.assignedTo || 'Not assigned'}</TableCell>
      <TableCell>{item.recommendation}</TableCell>
      <TableCell>{new Date(item.deadline).toLocaleDateString()}</TableCell>
      <TableCell>
        {item.dealCondition !== 'none' && (
          <Badge variant="outline" className="font-bold">
            {item.dealCondition}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {item.actualCompletionDate ? new Date(item.actualCompletionDate).toLocaleDateString() : '-'}
      </TableCell>
      <TableCell>
        <StatusBadge status={effectiveStatus} />
      </TableCell>
      <TableCell className="text-right">
        <ESGCapRowActions item={item} onUpdate={onUpdate || (() => {})} />
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {effectiveStatus === 'completed' ? 'Completed on time' : 
         effectiveStatus === 'in_progress' ? 'Implementation ongoing' :
         effectiveStatus === 'delayed' ? 'Action overdue' :
         effectiveStatus === 'accepted' ? 'CAP accepted' :
         effectiveStatus === 'in_review' ? 'Under review' : 'Awaiting action'}
      </TableCell>
    </TableRow>
  );
};
