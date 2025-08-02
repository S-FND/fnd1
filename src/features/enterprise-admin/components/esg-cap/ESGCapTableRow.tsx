
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { ESGCapRowActions } from './ESGCapRowActions';

interface ESGCapTableRowProps {
  item: ESGCapItem;
  index: number;
}

export const ESGCapTableRow: React.FC<ESGCapTableRowProps> = ({ item, index }) => {
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
        {item.status === 'completed' ? new Date(item.deadline).toLocaleDateString() : '-'}
      </TableCell>
      <TableCell>
        <StatusBadge status={item.status} />
      </TableCell>
      <TableCell className="text-right">
        <ESGCapRowActions />
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {item.status === 'completed' ? 'Completed on time' : 
         item.status === 'in_progress' ? 'Implementation ongoing' : 'Awaiting action'}
      </TableCell>
    </TableRow>
  );
};
