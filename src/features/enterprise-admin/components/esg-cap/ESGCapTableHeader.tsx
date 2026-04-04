
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ESGCapTableHeaderProps {
  sortConfig: { key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof ESGCapItem) => void;
}

export const ESGCapTableHeader: React.FC<ESGCapTableHeaderProps> = ({ 
  sortConfig, 
  requestSort 
}) => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
      <TableRow className="hover:bg-transparent">
        <TableHead className="w-[60px] text-center font-semibold">S. No</TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/80 font-semibold transition-colors"
          onClick={() => requestSort('issue')}
        >
          Item
          {sortConfig?.key === 'issue' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>
        <TableHead className="font-semibold">Category</TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/80 font-semibold transition-colors"
          onClick={() => requestSort('priority')}
        >
          Priority
          {sortConfig?.key === 'priority' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>
        <TableHead className="font-semibold">Measures and/or Corrective Actions</TableHead>
        <TableHead className="font-semibold">Resource & Responsibility</TableHead>
        <TableHead className="font-semibold">Expected Deliverable</TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/80 font-semibold transition-colors"
          onClick={() => requestSort('deadline')}
        >
          Target Date
          {sortConfig?.key === 'deadline' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>
        <TableHead className="font-semibold">CP/CS</TableHead>
        <TableHead className="font-semibold">Actual Date</TableHead>
        <TableHead className="font-semibold">Status</TableHead>
        <TableHead className="text-right font-semibold">Actions</TableHead>
        <TableHead className="font-semibold">Remarks</TableHead>
      </TableRow>
    </TableHeader>
  );
};
