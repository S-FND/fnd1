import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ESGCapItem } from '../../types/esgDD';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ESGCapTableHeaderProps {
  sortConfig: { key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof ESGCapItem) => void;
  compact?: boolean;
}

export const ESGCapTableHeader: React.FC<any> = ({ 
  sortConfig, 
  requestSort ,
  compact = false
}) => {
  const SortableHeader = ({ field, title }: { field: keyof ESGCapItem; title: string }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-200 !text-black"
      onClick={() => requestSort(field)}
    >
      {title}
      {sortConfig?.key === field ? (
        sortConfig.direction === "asc" ? ( '↑' ) : ( '↓' ) ) : ( '↑↓' )}
    </TableHead>
  );

  if (compact) {
    return (
      <TableHeader>
        <TableRow className="bg-[#f1f5f9]">
          <TableHead className="w-[60px] text-center !text-black">S. No</TableHead>
          <TableHead className=" text-center !text-black">Item</TableHead>
          <TableHead className=" text-center !text-black">Issue</TableHead>
          <TableHead className=" text-center !text-black">Completion Indicator</TableHead>
          <TableHead className=" text-center !text-black">Progress Percentage</TableHead>
          <TableHead className="text-center !text-black">Actions</TableHead>
          {/* <SortableHeader field="item" title="Item" />
          <SortableHeader field="issue" title="Issue" />
          <SortableHeader field="deliverable" title="Completion Indicator" /> */}
          {/* <SortableHeader field="measures" title="Measures & Corrective Actions" /> */}
          {/* <SortableHeader field="progressPercentage" title="Progress Percentage" /> */}
        </TableRow>
      </TableHeader>
    );
  }
  
  return (
    <TableHeader>
      <TableRow className="bg-[#f1f5f9]">
        {/* S. No */}
        <TableHead className="w-[60px] text-center !text-black">S. No</TableHead>

        {/* 1. Item */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black min-w-[200px]">Item</TableHead>

        {/* 2. Category */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black">Category</TableHead>

        {/* 3. Priority */}
        {/* <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('priority')}
        >
          Priority
          {sortConfig?.key === 'priority' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead> */}
        <SortableHeader field="priority" title="Priority" />

        {/* 4. Issue */}
        <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]">Issue</TableHead>

        {/* 5. Related Finding */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]">Related Finding</TableHead>

        {/* 6. ESG Lever */}
        {/* <TableHead 
          className="cursor-pointer hover:bg-gray-200 !text-black"
          onClick={() => requestSort('esgLever')}
        >
          ESG Lever
          {sortConfig?.key === 'esgLever' && (
            sortConfig.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4 inline ml-1" /> : 
              <ArrowDown className="h-4 w-4 inline ml-1" />
          )}
        </TableHead> */}

        {/* 7. Measures & Corrective Actions */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black min-w-[200px]">Measures & Corrective Actions</TableHead>

        {/* 8. Resource & Responsibility */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]">Resource & Responsibility</TableHead>

        {/* 9. Completion Indicator */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]">Completion Indicator</TableHead>

        {/* 10. Timeline Month */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black text-center">Timeline Month</TableHead>

        {/* 11. Target Date */}
        <SortableHeader field="targetDate" title="Target Date" />


        {/* 11.1 progressPercentage */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black">Progress Percentage</TableHead>

        {/* 12. Actual Date */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black">Actual Date</TableHead>

        {/* 13. CP/CS */}
        <SortableHeader field="CS" title="CP/CS/ESG Forward areas" />

        {/* 14. Status */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black">Status</TableHead>

        {/* 15. Company Current Status Update */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]">Company Current Status Update</TableHead>

        {/* 15.1 Investor Current Status Update */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]">Investor Current Status Update</TableHead>

        {/* 16. Review Remarks */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]">Review Remarks</TableHead>

        {/* 17. Last Review Date */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black">Last Review Date</TableHead>

        {/* 18. Implementation Support Needed */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black min-w-[150px]">Implementation Support Needed</TableHead>

        {/* 19. Closure Verified By */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black">Closure Verified By</TableHead>

        {/* 20. Assigned To */}
        <TableHead className="cursor-pointer hover:bg-gray-200 !text-black">Assigned To</TableHead>

        {/* Actions */}
        <TableHead className="text-center !text-black">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};