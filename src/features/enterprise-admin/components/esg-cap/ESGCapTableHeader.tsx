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
      <TableRow className="bg-[#f1f5f9]">
        
        <TableHead className="w-[60px] text-center !text-black">S. No</TableHead>

        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('issue')}
        >
          Item
          {sortConfig?.key === 'issue' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        <TableHead className="!text-black">Category</TableHead>

        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('priority')}
        >
          Priority
          {sortConfig?.key === 'priority' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        <TableHead className="!text-black">Measures and/or Corrective Actions</TableHead>
        <TableHead className="!text-black">Resource & Responsibility</TableHead>
        <TableHead className="!text-black">Expected Deliverable</TableHead>

        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('deadline')}
        >
          Target Date
          {sortConfig?.key === 'deadline' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead>

        <TableHead className="!text-black">CP/CS</TableHead>
        <TableHead className="!text-black">Actual Date</TableHead>
        <TableHead className="!text-black">Status</TableHead>
        <TableHead className="text-right !text-black">Actions</TableHead>
        <TableHead className="!text-black">Remarks</TableHead>

      </TableRow>
    </TableHeader>
  );
};