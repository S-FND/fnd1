
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ESGCapTableProps {
  sortedItems: ESGCapItem[];
  sortConfig: { key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof ESGCapItem) => void;
}

export const ESGCapTable: React.FC<ESGCapTableProps> = ({ 
  sortedItems, 
  sortConfig, 
  requestSort 
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">S. No</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('issue')}
            >
              Item
              {sortConfig?.key === 'issue' && (
                sortConfig.direction === 'asc' ? 
                  <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                  <ArrowDown className="h-4 w-4 inline ml-1" />
              )}
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Measures and/or Corrective Actions</TableHead>
            <TableHead>Resource & Responsibility</TableHead>
            <TableHead>Expected Deliverable</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('deadline')}
            >
              Target Date
              {sortConfig?.key === 'deadline' && (
                sortConfig.direction === 'asc' ? 
                  <ArrowUp className="h-4 w-4 inline ml-1" /> : 
                  <ArrowDown className="h-4 w-4 inline ml-1" />
              )}
            </TableHead>
            <TableHead>CP/CS</TableHead>
            <TableHead>Actual Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-center font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">
                {item.issue}
              </TableCell>
              <TableCell>
                <CategoryBadge category={item.category} />
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Update status</DropdownMenuItem>
                    <DropdownMenuItem>Assign responsibility</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {item.status === 'completed' ? 'Completed on time' : 
                 item.status === 'in_progress' ? 'Implementation ongoing' : 'Awaiting action'}
              </TableCell>
            </TableRow>
          ))}
          
          {sortedItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-6">
                No CAP items found matching the current filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
