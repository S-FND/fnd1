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
  const targetDate = new Date(item.targetDate);
  
  // If target date has passed and status is not completed and no actual date, mark as delayed
  if (targetDate < today && item.status !== 'completed' && !item.actualDate) {
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
        {item.item}
      </TableCell>
      <TableCell>
        <CategoryBadge category={item.category} />
      </TableCell>
      <TableCell>
        <PriorityBadge priority={item.priority} />
      </TableCell>
      <TableCell>{item.measures}</TableCell> {/* Changed from description to measures */}
      <TableCell>{item.assignedTo || 'Not assigned'}</TableCell>
      <TableCell>{item.resource}</TableCell> {/* Changed from recommendation to resource */}
      <TableCell>{new Date(item.targetDate).toLocaleDateString()}</TableCell> {/* Changed from deadline to targetDate */}
      <TableCell>
        {item.CS !== 'none' && (
          <Badge variant="outline" className="font-bold">
            {item.CS}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {item.actualDate ? new Date(item.actualDate).toLocaleDateString() : '-'} {/* Changed from actualCompletionDate to actualDate */}
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