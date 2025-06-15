
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
  );
};
